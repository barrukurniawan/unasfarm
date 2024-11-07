// up json reader 

UPResultSet = function (jsonString) {
    this._obj = JSON.parse(jsonString);
    this._rowIndex = 0;
    this._idxTable = new Array();
    this._columns = new Array();
    this.init();
};

UPResultSet.prototype = {
    init: function () {
        for (i = 0; i < this._obj.r[0].length; i++) {
            this._idxTable[this._obj.r[0][i]] = i;
            this._columns[i] = this._obj.r[0][i];
        }
    },

    append: function (jsonString) {
        var res = JSON.parse(jsonString);
        if (res.type === "data") {
            res.r.shift();
            this._obj.r = this._obj.r.concat(res.r);
        }
    },

    hasError: function () {
        return this._obj.type === "error";
    },

    hasNext: function () {
        if (this.hasError())
            return false;
        return this._rowIndex + 1 < this._obj.r.length;
    },

    next: function () {
        if (this.hasError())
            return false;
        if (this.hasNext()) {
            this._rowIndex++;
            return true;
        } else
            return false;
    },

    previous: function () {
        if (this.hasError())
            return false;
        if (this._rowIndex > 1) {
            this._rowIndex--;
            return true;
        } else
            return false;
    },

    first: function () {
        this._rowIndex = 0;
    },

    last: function () {
        this._rowIndex = this._obj.r.length - 1;
    },

    close: function () {
        this._json = null;
        this._obj = null;
    },

    getColumn: function (columnName) {
        var i = Number.isInteger(columnName) ? columnName-- : this._idxTable[columnName];
        return this._obj.r[this._rowIndex][i];
    },

    getColumnNames: function () {
        return this._columns;
    },

    getErrorCode: function () {
        if (!this.hasError())
            return "";
        return this.getColumn("error code");
    },

    getErrorMessage: function () {
        if (!this.hasError())
            return "";
        return this.getColumn("error message");
    }
};

QueryString = function (str) {
    this._map = {};
    this.init(str);
}

QueryString.prototype = {
    init: function (str) {
        var qd = {};
        if (str === undefined)
            str = window.location.search;
        str.split("?")[1].split("&").forEach(function (item) {
            var s = item.split("="), k = s[0], v = s[1] && decodeURIComponent(s[1]);
            (k in qd) ? qd[k].push(v) : qd[k] = [v];
        });
        this._map = qd;
    },

    getParameterMap: function () {
        return this._map;
    },

    getParameter: function (str) {
        return this._map[str][0];
    },

    getParameterValues: function (str) {
        return this._map[str];
    },

    getParameterNames: function () {
        return Object.keys(this._map);
    }
}

var _loadedScripts = null;
var _loadedStyles = null;
Util = {
    /**
     * 
     * @param {String} msgSource - The exception object
     * @param {String} msgError - Error Message
     * @param {type} msgForm - location of method (file name)
     * @param {type} msgMethod - function name
     * @returns {undefined}
     */
    raiseFormError: function (msgSource, msgError, msgForm, msgMethod) {
        alert(msgForm + "[" + msgMethod + "]:" + msgError + "\n\n\n" + msgSource);
    },

    guid: function () {
        function _p4() {
            var p = (Math.random().toString(16) + "000000000").substr(2, 4);
            return p.substr(0, 4);
        }
        return _p4() + _p4() + "-" + _p4() + "-4" + _p4().substr(1, 4) + "-" + _p4() + "-" + _p4() + _p4() + _p4();
    },
    
    loadDiv : function(id, url){
        if(_loadedScripts === null){ 
            _loadedScripts = new Array();
            $("script[src]").each(function(index){
                _loadedScripts.push($(this).attr("src"));
            });
        }
        if(_loadedStyles === null){
            _loadedStyles = new Array();
            $("link[href]").each(function(index){
                _loadedStyles.push($(this).attr("href"));
            });
        }

        $.ajax({ url : url, async:false }).always(function(data, status, xhr){
            if ( status == "error" ) {
                if(xhr.status === 403){
                    alert("Not authorized.");
                }
            } else {
                var header = xhr.getResponseHeader("login");
                if(header !== null){
                    location.href = header;
                } else {
                    if(data.indexOf("<head>") > 0){
                        var headString = data.substring(data.indexOf("<head>"), data.indexOf("</head>") + 7);
                        var xmlDoc = $.parseXML(headString);
                        $(xmlDoc).find("script[src]").each(function(i){
                            for(j=0;j<_loadedScripts.length;j++){
                                if($(this).attr("src") === _loadedScripts[j]){
                                    $(this).remove();
                                    break;
                                }
                            }
                        });
                        $(xmlDoc).find("link[href]").each(function(i){
                            for(j=0;j<_loadedStyles.length;j++){
                                if($(this).attr("href") === _loadedStyles[j]){
                                    $(this).remove();
                                    break;
                                }
                            }
                        });
                        var stripped = (new XMLSerializer()).serializeToString(xmlDoc);
                        data = data.replace(headString, stripped);
                    }
                    
                    if (typeof id === "string"){
                        $("#" + id ).empty();
                        $("#" + id ).html(data);
                        $("#" + id).attr("X-URL", url);
                    } else {
                        id.empty();
                        id.html(data);
                        id.attr("X-URL", url);
                    }
                }
            }
        });
    },

    /** 
     * @param {String} formId - Form Id
     * @param {String} url - Url to call
     * @param {function} doneCallback - A function to be called when the request finishes
     * @param {function} progressCallback - A function to be called when the upload is on progress (only for browser supported xhr2)
     */
    submitMultipart: function(formId, url, doneCallback, progressCallback){
        var form = $('#' + formId);
        $(form).off('submit').on('submit',function(event){
            var xhr2 = !!(window.ProgressEvent && window.FormData);
            //xhr2 support checking
            if(xhr2){
                event.preventDefault();
                var formData = new FormData(document.getElementById(formId));
                $.ajax({
                    type: "POST",
                    url: url,
                    async: true,
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    xhr: function () {
                        var myXhr = $.ajaxSettings.xhr();
                        if (myXhr.upload && progressCallback !== undefined) {
                            myXhr.upload.onprogress = function(e){
                                
                                var loaded = e.position || e.loaded;
                                var total = e.totalSize || e.total;
                                var percent = Math.ceil((loaded/total) * 100);
                                progressCallback(percent, loaded, total);
                            }
                            /*
                            myXhr.upload.onloadend = function(e) {
                                needed????
                            };*/
                        }
                        return myXhr;
                    }
                }).done(function(response){
                    if(doneCallback !== undefined){
                        doneCallback(response);    
                    }
                    
                }).fail(function(response){
                    console.error('Failed to upload file. Ex: ' +  response.statusText);
                });

            }else{ //for older browser
                var iframe = document.createElement("iframe");
                var id = 'iFrame_' + Util.guid();
                $(iframe).attr('id', id).attr('name', id).css('display', 'none');
                $(form).append($(iframe));
                $(form).attr("target", id);
                $(form).attr("action", url);
                $(form).attr("method", "post");
                $(form).attr("enctype", "multipart/form-data");
                $(iframe).on('load', function () {
                    if(doneCallback !== undefined){
                        doneCallback($(iframe).contents().find('body').html());    
                    }
                    $(iframe).remove();
                });
            }
        });

        $(form).submit();
    },
    
    /** 
     * @param {String} text to be encoded
     */
    HTMLEncode : function (data){
        return $('<div/>').text(data).html();
    },
    
    /** 
     * @param {String} text to be decoded
     */
    HTMLDecode : function (data){
        return $('<div/>').html(data).text();
    }
};

Validator = {
    defaultOptions: {
        promptPosition:"modalDialog",
        isOverflown:true, 
        maxErrorsPerField:1,
        binded:false,
        showPrompts:false,
        showOneMessage:true
    },

    /**
    * Attach validator to form
    * @param {String} formId form id
    * @param {Object} options validator options - http://posabsolute.github.io/jQuery-Validation-Engine/#options
    */
    attach: function(formId, options){
        var valid = false;
        var form = $('#' + formId);
        var newOpt = $.extend(true, {}, Validator.defaultOptions, options);
        var form = $('#' + formId);
        form.validationEngine('attach', newOpt);

        if(newOpt.promptPosition === 'modalDialog'){
            form.removeData('errorMsg');
            form.removeData('validationField');
            
            form.off("jqv.field.result").on("jqv.field.result", function(event, field, errorFound, promptText) {
                if(errorFound){
                    var errMsg = $(this).data('validationErrorMsg');
    
                    if(errMsg === undefined) 
                        errMsg = '';

                    var textArr = promptText.split('<br/>');
                    
                    $.each(textArr, function(idx, txt){
                        if(txt.startsWith('*'))
                            txt = txt.substr(1);                    

                        if(errMsg !== '')
                            errMsg += '<br/>';

                        errMsg += txt.trim();
                    });

                    $(this).data('validationErrorMsg', errMsg);
                    $(this).data('validationField', $(field).data('fieldname'));
                }
            });    
    
            form.off("jqv.form.result").on("jqv.form.result", function(event, errorFound) {
                if(errorFound){
                    var errMsg = $(this).data('validationErrorMsg');
                    var fieldName = $(this).data('validationField');
                    var dialog = BSModal();
                    dialog.create({title:'Validation Error - ' + fieldName, type:'error', body:errMsg});

                }
            });
        }
    },

    /**
    * Detach validator from form
    * @param {String} formId form id
    */
    detach: function(formId){
        var form = $('#' + formId);
        form.removeData('validationErrorMsg');
        form.validationEngine('hideAll');
        form.validationEngine('detach');
    },

     /**
    * Hide all error messages
    * @param {String} formId form id
    */
    hideAll: function(formId){
        $('#' + formId).validationEngine('hideAll');
    },

    /**
    * Prepare field for validation
    * @param {String} fieldId field id
    * @param {String} fieldName field name to display on error pop up
    * @param {String} type field type (text, number, integer, date, datetime, url, email, ipv4)
    * @param {Boolean} mandatory true, if field is mandatory
    * @param {Int} minFieldLen min length of field 
    * @param {Int} maxFieldLen max length of field 
    * @param {Format} format custom format
    * @param {String} classGroup group of fields (currently only for date and datetime range validation)
    * @param {String} validateFuncName function name of custom validation function
    */
    prepareField: function(fieldId, fieldName, type, mandatory, minFieldLen, maxFieldLen, format, 
        classGroup, validationFuncName){

        /*custom format 
        *phone,
		*url,
		*ipv4,
		*email,
		*date [YYYY-mm-dd],
		*number, [ie: -3849.354, 38.00, 38, .77],
		*integer [ie +34, 34 or -1],
		*onlyNumberSp [only [0-9] and space],
		*onlyascii [only ascii letters, space and ']
	    *..etc)
        *please check http://posabsolute.github.io/jQuery-Validation-Engine/#custom-regex
        * or js/jquery.validationEngine-en.js and js/jquery.validationEngine-en-other.js
        */

        var validators = [];
        if(mandatory){
            validators.push('required');
        }

        if(minFieldLen != undefined && minFieldLen != '' && minFieldLen > 0){
            validators.push('minSize[' + minFieldLen + ']');    
        }

        if(maxFieldLen != undefined && maxFieldLen != '' && maxFieldLen > 0){
            validators.push('maxSize[' + maxFieldLen + ']');    
        }

        switch(type){
            case 'integer':
                validators.push('custom[integer]');
                break;
            case 'number':
                validators.push('custom[number]');
                break;
            case 'date':
            case 'datetime':
                if(type === 'date')
                    validators.push('custom[date]');
                else
                    validators.push('custom[datetime]');

                if(classGroup != undefined && classGroup != ''){
                    validators.push(((type=='date')?'dateRange[':'dateTimeRange[') + classGroup + ']');
                }
                break;    
            case 'url':
                validators.push('custom[url]');
                break;
            case 'email':
                validators.push('custom[email]');
                break;
            case 'ipv4':
                validators.push('custom[ipv4]');
                break;

        }
       
        if(format != undefined && format != ''){
            validators.push('custom[' +  format +']');
        }

        if(validationFuncName !== undefined && validationFuncName !== ''){
            validators.push('funcCall[' + validationFuncName + ']');
        }

        if(validators.length > 0){
            var validatorsStr = '';
            $.each(validators, function(i, v){
                if(i > 0) validatorsStr += ',';
                validatorsStr += v;       
            });

            $('#' + fieldId).addClass('validate[' + validatorsStr + ']');

            if(fieldName === undefined || fieldName === ''){
                fieldName = fieldId;
            }

            $('#' + fieldId).data('fieldname', fieldName);
        }
    },

    /**
    * Validate form
    * @param {String} formId form id
    * @param {Object} options validator options
    * @returns {Boolean} validation result
    */
    validateForm: function(formId, options){
        $('#' + formId).data('validationErrorMsg', '');
        $('#' + formId).data('validationField', '');
        return $('#' + formId).validationEngine('validate');
    },
}

function BSModal() {
    var self;
    var dom;
    var template = '<div class="modal fade" tabindex="-1" role="dialog"> <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> <h4 class="modal-title">Modal title</h4> </div> <div class="modal-body" style="word-break: break-word;"></div> <div class="modal-footer"></div></div>';

    var options = {
        backdrop: 'static',
        keyboard: false,
        show: true,
        destroy: true,
        autoClose: true,
        showFooter: true
    };

    function setConfig(opts) {
        if (opts == undefined)
            return false;
        for (var i in opts) {
            options[i] = opts[i];
        }
    }

    function setModal(callback) {
        if (options.size != undefined) {
            dom.find('.modal-dialog').addClass(options.size);
        }
        if (options.title != undefined) {
            dom.find('.modal-title').text(options.title);
        }

        if(!options.showFooter)
            dom.find('.modal-footer').remove();

        if (options.viewAction != undefined) {
            // dom.find('.modal-body').load(options.viewAction);
            Util.loadDiv(dom.find('.modal-body'), options.viewAction);
        } else {
            if (options.message != undefined) {
                dom.find('.modal-body').text(options.message);
            }else if (options.body != undefined) {
                dom.find('.modal-body').html(options.body);
            }

            if(options.showFooter){
                if(options.buttons != undefined){
                    dom.find('.modal-footer').append(options.buttons);
                }else{
                    var btnOk = $('<button type="button" class="btn btn-primary" value="yes">Yes</button>');
                    var btnNo = $('<button type="button" class="btn btn-default" value="no">No</button>');
                    var btnCancel = $('<button type="button" class="btn btn-default" value="cancel">Cancel</button>');
    
                    if (options.type == 'confirm') {
                        dom.find('.modal-footer').append(btnOk);
                        dom.find('.modal-footer').append(btnNo);
                        dom.find('.modal-footer').append(btnCancel);
                    } else {
                        dom.find('.modal-footer').append(btnOk.text('Close'));
                    }
                }
            }
        }

        dom.on('show.bs.modal', function(){
            var zIndex = parseInt(dom.css('z-index')) + (10 * $('.modal:visible').length);
            dom.css('z-index', zIndex);
            var count = 0;
            var timer = setInterval(function(){
                if(dom.next('.modal-backdrop').length){
                    dom.next('.modal-backdrop').css('z-index', zIndex - 1);
                    clearInterval(timer);
                }else if(++count >= 20){ //prevent infinite loop
                    clearInterval(timer); //give up
                }

            }, 100);
            
        });

        dom.on('click', '.modal-footer button:not(.disabled),[data-dismiss="modal"]', function (e) {
            var status = $(this).val() == undefined && $(this).val() == '' ? false : $(this).val();
            var callbackDelay = (options.callbackDelay === undefined) ? 500 : options.callbackDelay;

            if(options.autoClose) close();
            if (options.viewAction != undefined) {
                /*
                if (storeId[storeId.length - 1] == __id) {
                    pages = "";
                    parts = "";
                    elements = "";
                    elmtacts = "";
                    grids = "";
                    gridacts = "";
                    widgets = "";
                    storeId.pop();
                }*/
            }

            setTimeout(function () {
                if (options.destroy == true) {
                    destroy();
                }

                if (callback != undefined) {
                    var e = {target: self, status: status};
                    if (typeof callback == 'string') {
                        window[callback](e);
                    } else if (typeof callback == 'function') {
                        callback(e);
                    }
                }
            }, callbackDelay);
        });
    }

    function create(options, callback) {
        if (dom == undefined) {
            self = this;
            dom = $(template);
            setConfig(options);
            setModal(callback);
            $('body').append(dom);
        }

        if (options.viewAction) {
            //if (!checkSession())
            open();
            return;
        }
        open();
    }
    function open() {
        if (dom == undefined)
            return false;
        options.show = true;
        dom.modal(options);
    }
    function close() {
        if (dom == undefined)
            return false;
        options.show = false;
        dom.modal('hide');
    }
    function destroy() {
        if (dom == undefined)
            return false;
        if(!dom.next('.modal-backdrop').length){
            $(dom).remove();
            dom = undefined;
        }else{
            var count = 0;
            var timer = setInterval(function(){
                if(dom == undefined){
                    clearInterval(timer);
                }else if(!dom.next('.modal-backdrop').length){
                    $(dom).remove();
                    dom = undefined;
                    clearInterval(timer);
                }else if(++count >= 20){
                    clearInterval(timer); //give up
                }
            }, 100);
        }
    }

    return {create: create, open: open, close: close, destroy: destroy};
}

function HashTable(obj)
{
    this.length = 0;
    this.items = {};
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            this.items[p] = obj[p];
            this.length++;
        }
    }

    this.setItem = function (key, value)
    {
        var previous = undefined;
        if (this.hasItem(key)) {
            previous = this.items[key];
        } else {
            this.length++;
        }
        this.items[key] = value;
        return previous;
    };

    this.getItem = function (key) {
        return this.hasItem(key) ? this.items[key] : undefined;
    };

    this.hasItem = function (key)
    {
        return this.items.hasOwnProperty(key);
    };

    this.removeItem = function (key)
    {
        if (this.hasItem(key)) {
            previous = this.items[key];
            this.length--;
            delete this.items[key];
            return previous;
        } else {
            return undefined;
        }
    };

    this.keys = function ()
    {
        var keys = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    this.values = function ()
    {
        var values = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                values.push(this.items[k]);
            }
        }
        return values;
    };

    this.each = function (fn) {
        for (var k in this.items) {
            if (this.hasItem(k)) {
                fn(k, this.items[k]);
            }
        }
    };

    this.clear = function ()
    {
        this.items = {};
        this.length = 0;
    };   
}

// polyfills from MDN
Number.isInteger = Number.isInteger || function (x) {
    return typeof x === "number" && isFinite(x) && Math.floor(x) === x;
};

String.prototype.includes = String.prototype.includes || function (search, start) {
    'use strict';
    if (typeof start !== 'number')
        start = 0;
    if (start + search.length > this.length)
        return false;
    else
        return this.indexOf(search, start) !== -1;
};

String.prototype.startsWith = String.prototype.startsWith || function (searchString, position) {
    return this.substr(position || 0, searchString.length) === searchString;
};

String.prototype.endsWith = String.prototype.endsWith || function (searchStr, Position) {
    if (!(Position < this.length))
        Position = this.length;
    else
        Position |= 0; // round position
    return this.substr(Position - searchStr.length, searchStr.length) === searchStr;
};

String.prototype.trim = String.prototype.trim || function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
};

