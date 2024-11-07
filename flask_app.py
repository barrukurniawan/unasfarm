from flask import Flask, request, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import desc, asc
import datetime

app = Flask(__name__)
app.config["DEBUG"] = True

SQLALCHEMY_DATABASE_URI = "mysql+mysqlconnector://{username}:{password}@{hostname}/{databasename}".format(
    username="unasfarm",
    password="SMAN60jakarta",
    hostname="unasfarm.mysql.pythonanywhere-services.com",
    databasename="unasfarm$default",
)
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_POOL_RECYCLE"] = 299
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

class SensorTable(db.Model):
    __tablename__ = "sensor_table"
    id = db.Column(db.Integer, primary_key=True)
    soil_temperature = db.Column(db.Integer, nullable=True)
    air_temperature = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    rain_sensor = db.Column(db.String(255), nullable=True)
    water_level = db.Column(db.String(255), nullable=True)
    humidity = db.Column(db.String(255), nullable=True)
    fertilizer = db.Column(db.String(255), nullable=True)
    soil_moisture = db.Column(db.String(255), nullable=True)
    description = db.Column(db.String(255), nullable=True)
    pump_date = db.Column(db.DateTime, nullable=True)
    schedule_pump = db.Column(db.Integer, nullable=True)
    waterpump_first = db.Column(db.String(255), nullable=True, server_default='false')
    waterpump_second = db.Column(db.String(255), nullable=True, server_default='false')
    waterpump_date_first = db.Column(db.DateTime, nullable=True)
    waterpump_date_second = db.Column(db.DateTime, nullable=True)

    def __repr__(self):
        return f"<{self.id}>"

# New function to get the latest data from SensorTable
def get_latest_sensor_data():
    return SensorTable.query.order_by(SensorTable.created_at.desc()).first()

@app.route('/hello')
def hello_world():
    return 'Hello from UNAS Farm!'
    
@app.route('/')
def dashboard_sensor():
    return render_template("ove_11.html")

@app.route('/send', methods=["POST","GET"])
def insert_data():
    params = request.args
    soil_temperature = params.get('soil_temperature') if 'soil_temperature' in params else 0
    air_temperature = params.get('air_temperature') if 'air_temperature' in params else 0
    rain_sensor = params.get('rain_sensor') if 'rain_sensor' in params else ''
    water_level = params.get('water_level') if 'water_level' in params else ''
    humidity = params.get('humidity') if 'humidity' in params else ''
    fertilizer = params.get('fertilizer') if 'fertilizer' in params else ''
    soil_moisture = params.get('soil_moisture') if 'soil_moisture' in params else ''
    description = params.get('description') if 'description' in params else ''
    pump_date = params.get('pump_date') if 'pump_date' in params else ''
    schedule_pump = params.get('schedule_pump') if 'schedule_pump' in params else ''
    waterpump_first = params.get('waterpump_first') if 'waterpump_first' in params else 'false'
    waterpump_second = params.get('waterpump_second') if 'waterpump_second' in params else 'false'
    waterpump_date_first = datetime.datetime.now() if waterpump_first == 'true' else None
    waterpump_date_second = datetime.datetime.now() if waterpump_second == 'true' else None

    # Create a new record instance
    save_db = SensorTable(
        soil_temperature=soil_temperature,
        air_temperature=air_temperature,
        rain_sensor=rain_sensor,
        water_level=water_level,
        humidity=humidity,
        fertilizer=fertilizer,
        soil_moisture=soil_moisture,
        description=description,
        pump_date=pump_date,
        schedule_pump=schedule_pump,
        waterpump_first=waterpump_first,
        waterpump_second=waterpump_second,
        waterpump_date_first=waterpump_date_first,
        waterpump_date_second=waterpump_date_second
    )

    # Try to add and commit the record to the database
    try:
        db.session.add(save_db)
        db.session.commit()
        return "SUCCESS"
    except Exception as e:
        db.session.rollback()
        return "FAILED"

@app.route('/latest_data', methods=["GET"])
def latest_data():
    latest_record = get_latest_sensor_data()
    if latest_record:
        # Format dates
        created_at = latest_record.created_at.strftime("%m-%Y-%d %H-%M-%S") if latest_record.created_at else None
        waterpump_date_first = latest_record.waterpump_date_first.strftime("%m-%Y-%d %H-%M-%S") if latest_record.waterpump_date_first else None
        waterpump_date_second = latest_record.waterpump_date_second.strftime("%m-%Y-%d %H-%M-%S") if latest_record.waterpump_date_second else None

        return {
            "message": "SUCCESS",
            "data": {
                "soil_temperature": latest_record.soil_temperature,
                "air_temperature": latest_record.air_temperature,
                "created_at": created_at,
                "rain_sensor": latest_record.rain_sensor,
                "water_level": latest_record.water_level,
                "humidity": latest_record.humidity,
                "fertilizer": latest_record.fertilizer,
                "soil_moisture": latest_record.soil_moisture,
                "description": latest_record.description,
                "pump_date": latest_record.pump_date,
                "schedule_pump": latest_record.schedule_pump,
                "waterpump_first": latest_record.waterpump_first,
                "waterpump_second": latest_record.waterpump_second,
                "waterpump_date_first": waterpump_date_first,
                "waterpump_date_second": waterpump_date_second,
            }
        }
    else:
        return {"message": "FAILED", "data": {}}


def get_paginated_sensor_data(page, per_page, start_date=None, end_date=None, wp_start_date=None, wp_end_date=None):
    query = SensorTable.query
    
    # Apply filters based on provided date range
    if start_date and end_date:
        query = query.filter(SensorTable.created_at.between(start_date, end_date))
    if wp_start_date and wp_end_date:
        query = query.filter(SensorTable.waterpump_date_first.between(wp_start_date, wp_end_date))
    
    # Paginate results
    paginated_data = query.order_by(desc(SensorTable.created_at)).paginate(page=page, per_page=per_page, error_out=False)
    
    items = [{
        "id": data.id,
        "soil_temperature": data.soil_temperature,
        "air_temperature": data.air_temperature,
        "created_at": data.created_at,
        "rain_sensor": data.rain_sensor,
        "water_level": data.water_level,
        "humidity": data.humidity,
        "fertilizer": data.fertilizer,
        "soil_moisture": data.soil_moisture,
        "description": data.description,
        "pump_date": data.pump_date,
        "schedule_pump": data.schedule_pump,
        "waterpump_first": data.waterpump_first,
        "waterpump_second": data.waterpump_second,
        "waterpump_date_first": data.waterpump_date_first,
        "waterpump_date_second": data.waterpump_date_second
    } for data in paginated_data.items]

    return {
        "total": paginated_data.total,
        "pages": paginated_data.pages,
        "current_page": paginated_data.page,
        "per_page": paginated_data.per_page,
        "items": items
    }

@app.route('/sensor_data', methods=["GET"])
def sensor_data():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    
    # Optional date filters for created_at
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")
    wp_start_date = request.args.get("wp_start_date")
    wp_end_date = request.args.get("wp_end_date")
    
    # Parse dates if they are provided
    if start_date:
        start_date = datetime.datetime.strptime(start_date, '%Y-%m-%d')
    if end_date:
        end_date = datetime.datetime.strptime(end_date, '%Y-%m-%d')
    if wp_start_date:
        wp_start_date = datetime.datetime.strptime(wp_start_date, '%Y-%m-%d')
    if wp_end_date:
        wp_end_date = datetime.datetime.strptime(wp_end_date, '%Y-%m-%d')

    # Retrieve filtered and paginated data
    data = get_paginated_sensor_data(page, per_page, start_date, end_date, wp_start_date, wp_end_date)
    return jsonify(data)