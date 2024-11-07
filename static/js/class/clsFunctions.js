clsFunctions = {
//Load new page to targer div
    loadForm: function (container, pgName) {
        Util.loadDiv(container, 'v?PageId=' + pgName + '&AppID=DCMS');
    },
    //Load/Populate data to combobox (<select></select>)
    LoadControl: function (tc, appid, input, type, element, id, value, blnempty, blnset, setid) {
        var rs;
        var option_val = '';
        var cbo_id;
        var cbo_value;
        $.ajax({
            url: 'a?tc=' + tc + '&AppID=' + appid,
            data: input,
            type: type
        }).done(function (response) {
            rs = new UPResultSet(response);
            if (!rs.hasError()) {
                if (rs != null) {
                    if (blnempty) {
                        option_val += '<option value="0"></option>';
                    }

                    while (rs.next()) {
                        cbo_id = rs.getColumn(id);
                        cbo_value = rs.getColumn(value);
                        option_val += '<option value="' + cbo_id + '">' + cbo_value + '</option>';
                    }
                    $(element).empty();
                    $(element).append(option_val);
                    if (blnset) {
                        $(element).val(setid);
                    }
                }
            }
        });
    },
    LoadControlSync: function (tc, appid, input, type, element, id, value, blnempty, blnset, setid) {
        var rs;
        var option_val = '';
        var cbo_id;
        var cbo_value;
        $.ajax({
            url: 'a?tc=' + tc + '&AppID=' + appid,
            data: input,
            type: type,
            async: false
        }).done(function (response) {
            rs = new UPResultSet(response);
            if (!rs.hasError()) {
                if (rs != null) {
                    if (blnempty) {
                        option_val += '<option value="0"></option>';
                    }

                    while (rs.next()) {
                        cbo_id = rs.getColumn(id);
                        cbo_value = rs.getColumn(value);
                        option_val += '<option value="' + cbo_id + '">' + cbo_value + '</option>';
                    }
                    $(element).empty();
                    $(element).append(option_val);
                    if (blnset) {
                        $(element).val(setid);
                    }
                }
            }
        });
    },
    LoadControlAll: function (tc, appid, input, type, element, id, value, blnempty, blnset, setid) {
        var rs;
        var option_val = '';
        var cbo_id;
        var cbo_value;
        $.ajax({
            url: 'a?tc=' + tc + '&AppID=' + appid,
            data: input,
            type: type
        }).done(function (response) {
            rs = new UPResultSet(response);
            if (!rs.hasError()) {
                if (rs != null) {
                    if (blnempty) {
                        option_val += '<option value="">All</option>';
                    }

                    while (rs.next()) {
                        cbo_id = rs.getColumn(id);
                        cbo_value = rs.getColumn(value);
                        option_val += '<option value="' + cbo_id + '">' + cbo_value + '</option>';
                    }
                    $(element).empty();
                    $(element).append(option_val);
                    if (blnset) {
                        $(element).val(setid);
                    }
                }
            }
        });
    },
    //Sorting data
    SortingElement: function (arg, sel, elem, order) {
        var $selector;
        var $element;
        var strA;
        var strB;
        $selector = $(sel);
        $element = $selector.children(elem);
        $element.sort(function (a, b) {
            strA = a.getAttribute(arg);
            strB = b.getAttribute(arg);
            if (order == "asc") {
                if (strA > strB)
                    return 1;
                if (strA < strB)
                    return -1;
            } else if (order == "desc") {
                if (strA < strB)
                    return 1;
                if (strA > strB)
                    return -1;
            }
            return 0;
        });
        $element.detach().appendTo($selector);
    },
    //Add/Remove css class based on mode
    AddOrRemoveClass: function (targetName, clsName, mode) {
        if (mode == "A") {
            $('#' + targetName).addClass(clsName);
        } else if (mode == "R") {
            $('#' + targetName).removeClass(clsName);
        }
    },
    //Enable/Disable controls(textbox,textarea,combobox)
    EnableControls: function (mode, target) {
        var that = this;
        if (mode == "EDIT") {
            //Enable textbox
            $('#' + target + ' input').prop('disabled', false);
            that.AddOrRemoveClass(target + ' input', "textbox-view form-control-view", "R");
            //Enable combobox
            $('#' + target + ' select').prop('disabled', false);
            that.AddOrRemoveClass(target + ' select', "select-view form-control-view", "R");
            //Enable textarea
            $('#' + target + ' textarea').prop('disabled', false);
            that.AddOrRemoveClass(target + ' textarea', "textarea-view form-control-view", "R");
        } else if (mode == "VIEW") {
            //Disable textbox
            $('#' + target + ' input').prop('disabled', true);
            that.AddOrRemoveClass(target + ' input', "textbox-view form-control-view", "A");
            //Disable combobox
            $('#' + target + ' select').prop('disabled', true);
            that.AddOrRemoveClass(target + ' select', "select-view form-control-view", "A");
            //Disable textarea
            $('#' + target + ' textarea').prop('disabled', true);
            that.AddOrRemoveClass(target + ' textarea', "textarea-view form-control-view", "A");
        }
    },
    //Display text based on toggle active or inactive for both Mobile and Desktop mode
    DisplayToggleText: function (cboid, label, strText1, strText2) {
        $('#' + cboid + "_D").on("change", function () {
            if ($('#' + cboid + "_D").is(":checked") == true) {
                $('#' + label + "_D").text(strText1);
                $('#' + label + "_M").text(strText1);
                $('#' + cboid + "_M").prop('checked', true);
            } else {
                $('#' + label + "_D").text(strText2);
                $('#' + label + "_M").text(strText2);
                $('#' + cboid + "_M").prop('checked', false);
            }
        });
        $('#' + cboid + "_M").on("change", function () {
            if ($('#' + cboid + "_M").is(":checked") == true) {
                $('#' + label + "_D").text(strText1);
                $('#' + label + "_M").text(strText1);
                $('#' + cboid + "_D").prop('checked', true);
            } else {
                $('#' + label + "_D").text(strText2);
                $('#' + label + "_M").text(strText2);
                $('#' + cboid + "_D").prop('checked', false);
            }
        });
    },
    //Input fields only allow numeric
    InputNumericOnly: function (target) {


        $("#" + target).off("change").on("change", function (e) {
            var input = $(this);
            var value = input.val();
            var number = value.split('.');
            var newValue = number[0];
            if (number.length > 1)
            {
                newValue = number[0].substring(0, 14) + '.' + number[1].substring(0, 4);
            }

            input.val(newValue);
        });

        $("#" + target).off("paste").on("paste", function (e) {
            var input = $(this);
            var value = input.val();
            var pastedData = e.originalEvent.clipboardData.getData('text');

            var caretBegin = input.caret().begin;
            var caretEnd = input.caret().end;
            var strStart = "";
            var strEnd = "";

            if (caretBegin > 0) {
                strStart = value.substring(0, caretBegin);
            }
            if (caretEnd >= 0) {
                strEnd = value.substring(caretEnd);
            }

            var newString = strStart + pastedData + strEnd;

            if ($.isNumeric(newString))
            {
                var number = newString.split('.');
                var newValue = number[0];
                if (number.length > 1)
                {
                    newValue = number[0] + '.' + number[1].substring(0, 4)
                }

                if (number[0].length <= 14)
                {
                    input.val(newValue);
                }
            }

            return false;
        });

        $("#" + target).keypress(function (e) {

            var charCode = (e.which) ? e.which : e.charCode;
            var inputChar = "";
            if ((charCode >= 48 && charCode <= 57) || charCode === 46) {
                inputChar = charCode - 48;
                if (charCode === 46)
                {
                    inputChar = ".";
                }
            } else {
                return false;
            }

            var input = $(this);
            var value = input.val();
            var caretBegin = input.caret().begin;
            var caretEnd = input.caret().end;
            var strStart = "";
            var strEnd = "";

            if (caretBegin > 0) {
                strStart = value.substring(0, caretBegin);//caretBegin is position where end get text
            }
            if (caretEnd >= 0) {
                strEnd = value.substring(caretEnd);//caretEnd is position where start get text
            }

            var newString = strStart + inputChar + strEnd;
            var number = newString.split('.');

            if (number.length > 2)
            {
                return false;
            } else if (number[0].length > 14)
            {
                return false;
            } else if (number.length === 2 && number[1].length > 4)
            {
                return false;
            }

            return true;
        });

    },
    //Input fields only allow numeric
    InputNumericOnly_WithoutDashDot: function (target) {
        $("#" + target).off("change").on("change", function (e) {
            var input = $(this);
            var value = input.val();
            var number = value.split('.');
            var newValue = number[0];
            if (number.length > 1)
            {
                newValue = number[0] + '.' + number[1].substring(0, 4)
            }

            input.val(newValue);
        });

        $("#" + target).off("paste").on("paste", function (e) {
            var input = $(this);
            var value = input.val();
            var pastedData = e.originalEvent.clipboardData.getData('text');

            var caretBegin = input.caret().begin;
            var caretEnd = input.caret().end;
            var strStart = "";
            var strEnd = "";

            if (caretBegin > 0) {
                strStart = value.substring(0, caretBegin);
            }
            if (caretEnd >= 0) {
                strEnd = value.substring(caretEnd);
            }

            var newString = strStart + pastedData + strEnd;

            if ($.isNumeric(newString))
            {
                var number = newString.split('.');
                var newValue = number[0];
                if (number.length > 1)
                {
                    newValue = number[0] + '.' + number[1].substring(0, 4)
                }
                input.val(newValue);
            }

            return false;
        });

        $("#" + target).keypress(function (e) {

            var charCode = (e.which) ? e.which : e.charCode;
            if ((charCode >= 48 && charCode <= 57)) {

            } else {
                return false;
            }

            var input = $(this);
            var value = input.val();
            var number = value.split('.');


            var caretBegin = input.caret().begin;
            var caretEnd = input.caret().end;
            var dotPos = value.indexOf(".");
            if (caretBegin > dotPos && dotPos > -1 && (number[1].length > 3 + (caretEnd - caretBegin))) {
                return false;
            }
            return true;


        });
    },
    //Validate Input fields
    ValidateInput: function (target, tag, checktype) {
        var blnValidate;
        var strMessage = '';
        var that = this;
        blnValidate = true;
        //Textbox and Textarea
        if (tag.toLowerCase() == "input" || tag.toLowerCase() == "textarea") {
            if (checktype.toLowerCase() == "mandatory") {
                if ($('#' + target).val().trim() == "" || $('#' + target).val().trim() == "____-__-__" || $('#' + target).val().trim() == "______" || $('#' + target).val().trim() == "____-__-__ __:__") {
                    blnValidate = false;
                } else {
                    blnValidate = true;
                }

                strMessage = strMandatory;
            } else if (checktype.toLowerCase() == "email") {
                var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                blnValidate = regex.test($('#' + target).val().trim());
                strMessage = strInvalidEmail;
            }

            if (!blnValidate) {
                that.ValidationMessage(target, 'A', strMessage);
            } else {
                that.ValidationMessage(target, 'R', "");
            }
        }

        //Combobox
        if (tag.toLowerCase() == "option") {
            if (checktype.toLowerCase() == "mandatory") {
                if ($('#' + target + ' option:selected').text().trim() == "") {
                    blnValidate = false;
                } else {
                    blnValidate = true;
                }
            }

            if (!blnValidate) {
                that.ValidationMessage(target, 'A', strMandatory);
            } else {
                that.ValidationMessage(target, 'R', "");
            }
        }

        return blnValidate;
    },
    //Validate fail and display message to target element
    ValidationMessage: function (targetName, mode, tooltipsText) {
        if (mode === "A") {
            $('#' + targetName).addClass("validatefail");
            $('#' + targetName).popover({
                trigger: 'focus',
                placement: 'top',
                content: tooltipsText,
                delay: {hide: 100}
            });
            $('#' + targetName).keydown(function () {
                $('#' + targetName).removeClass("validatefail");
                $('#' + targetName).popover('dispose');
            });
        } else if (mode == "R") {
            $('#' + targetName).removeClass("validatefail");
            $('#' + targetName).popover('dispose');
        }
    },
    FormatNumberCommaWithDecimal: function (value, decimalNum) {
        var strTemp = '';
        var strDecimal = '';

        if (value.toString().includes(".") == false) {
            strTemp = value;
            strDecimal = '.0000';
        } else {
            strTemp = value.toString().substring(0, value.toString().indexOf("."));
            strDecimal = value.toString().substring(value.toString().indexOf("."), value.toString().length)
        }

        //trucate decimal
        strDecimal = strDecimal.toString().substring(0, decimalNum);

        if (strDecimal != '') {
            return strTemp.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") + strDecimal;
        } else {
            return strTemp.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        }
    },
    GetCurrentDate: function (formatDate) {
        var ajaxresult;
        var response;
        var rs;
        var ds;
        ajaxresult = $.ajax({
            url: 'a?tc=DCMS_SP_GetServerDate_SEL&AppID=DCMS',
            type: 'POST',
            async: false
        });
//        response = ajaxresult.responseText;
//        rs = new UPResultSet(response);
//        if (!rs.hasError()) {
//            if (rs != null) {
//                while (rs.next()) {
//                    return moment(rs.getColumn("SERVER_DATE")).format(formatDate);
//                }
//            }
//        } else {
//            return "";
//        }

        try {
            rs = JSON.parse(ajaxresult.responseText);
        } catch (e) {
        }

        if (rs != undefined) {
            ds = rs.r;
            ds.shift();

            if (rs.type == 'data') {
                return ds[0][0];
            } else if (rs.type == 'error') {
                clsFunctions.AlertMessage("Error", ds[0][0], "red");
                return "";
            }
        }
    },
    ValidateStrEndDt: function (strDt, endDt, msg) {
        var blnValidate;
        var that = this;
        blnValidate = true;
        if ($('#' + strDt).val().trim() != "" && $('#' + endDt).val().trim() != "" && $('#' + strDt).val().trim() != "____-__-__" && $('#' + endDt).val().trim() != "____-__-__") {
            if (moment($('#' + strDt).val()) > moment($('#' + endDt).val())) {
                blnValidate = false;
            } else {
                blnValidate = true;
            }

            if (!blnValidate) {
                if (msg.toLowerCase() == 'start') {
                    that.ValidationMessage(strDt, 'A', strStrDtEndDt);
                } else {
                    that.ValidationMessage(strDt, 'A', strEffDtExpDt);
                }
            } else {
                that.ValidationMessage(strDt, 'R', "");
            }
        }

        return blnValidate;
    },
    ValidateStrEndDt_DateTime: function (strDt, endDt, msg) {
        var blnValidate;
        var that = this;
        blnValidate = true;

        if ($('#' + strDt).val().trim() != "" && $('#' + endDt).val().trim() != "" && $('#' + strDt).val().trim() != "____-__-__ __:__" && $('#' + endDt).val().trim() != "____-__-__ __:__") {
            if (moment($('#' + strDt).val()) > moment($('#' + endDt).val())) {
                blnValidate = false;
            } else {
                blnValidate = true;
            }

            if (!blnValidate) {
                if (msg.toLowerCase() == 'start') {
                    that.ValidationMessage(strDt, 'A', strStrDtEndDt_DateTime);
                } else {
                    that.ValidationMessage(strDt, 'A', strEffDtExpDt);
                }
            } else {
                that.ValidationMessage(strDt, 'R', "");
            }
        }

        return blnValidate;
    },
    ScrollToTop: function () {
        $("html,body").animate({scrollTop: 0}, "slow");
    },
    NumberFormatter: function (num, digits) {
        var si = [
            {value: 1, symbol: ""},
            {value: 1E3, symbol: "K"},
            {value: 1E6, symbol: "M"},
            {value: 1E9, symbol: "G"},
            {value: 1E12, symbol: "T"},
            {value: 1E15, symbol: "P"},
            {value: 1E18, symbol: "E"}
        ];
        var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var i;
        for (i = si.length - 1; i > 0; i--) {
            if (num >= si[i].value) {
                break;
            }
        }
        return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
    },
    XMLEncode: function (strValue) {
        return strValue
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&apos;');
    },
    XMLDecode: function (strValue) {
        return strValue
                .replace(/&apos;/g, "'")
                .replace(/&quot;/g, '"')
                .replace(/&gt;/g, '>')
                .replace(/&lt;/g, '<')
                .replace(/&amp;/g, '&');
    },
    AlertMessage: function (strTitle, strMsg, color) {
        $.alert({
            title: strTitle,
            content: strMsg,
            type: color,
            typeAnimated: true
        });
    },
    GetGeneralParamValue: function (name) {
        var ajaxresult;
        var rs;
        var ds;

        ajaxresult = $.ajax({
            url: 'a?tc=DCMS_SP_GetGeneralParamVal_SEL&AppID=DCMS',
            data: {
                name: name
            },
            type: 'POST',
            async: false
        });

//        rs = JSON.parse(ajaxresult.responseText).r[1][0];

        try {
            rs = JSON.parse(ajaxresult.responseText);
        } catch (e) {
        }

        if (rs != undefined) {
            ds = rs.r;
            ds.shift();

            if (rs.type == 'data') {
                return ds[0][0];
            } else if (rs.type == 'error') {
                clsFunctions.AlertMessage("Error", ds[0][0], "red");
                return "";
            }
        }
    },
    GetSession: function () {
        var ajaxresult;
        var response;
        var rs;

        ajaxresult = $.ajax({
            url: 'a?tc=DCMS_GetUserRole_SS&AppID=DCMS',
            type: 'POST',
            async: false
        });

        response = ajaxresult.responseText;

        rs = JSON.parse(response);

        if (rs.type === "data") {
            if (rs != null) {
                return rs.r[1];
            }
        } else {
            return '';
        }
    }
};


