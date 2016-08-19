(function ($) {

    AdvanceHiddenFilter = function (_options) {

        var $this = $(this);

        if ($this.length == 0)
            return null;

        this.Value = $('#' + _options.hddValue);
        if (_options.minValue != undefined)
            this.txtMinValue = $('#' + _options.minValue);
        else
            this.txtMinValue = null;
        if (_options.maxValue != undefined)
            this.txtMaxValue = $('#' + _options.maxValue);
        else
            this.txtMaxValue = null;

        if (_options.unit != undefined)
            this.unitPrice = _options.unit;
        else
            this.unitPrice = null;
        if (_options.heso != undefined)
            this.heso = _options.heso;
        else
            this.heso = 1000000000;

        this.minValue = 0;
        this.maxValue = 0;


        function EventKeyDownHandler(el, event) {
            var code = event.keyCode ? event.keyCode : event.which;
            if (code == 13) {
                event.data.CheckToClose();
                if ($('.btn-filter-price').length) {
                    $('.btn-filter-price').trigger('click');
                } else {
                    $(el).parents('form').submit();
                }
                event.preventDefault();
            }
            else {
                var decimal = $(el).attr('decimal') == 'true';
                var retval = numbersonly(el, event, decimal);
                if (retval == false) {
                    event.preventDefault();
                }
            }

        }

        function EventKeyUpHandler(el, event) {
            event.data.UpdateTextValue();
            var val = $(el).val();
            if ($(el).attr('id') == _options.minValue) {
                event.data.minValue = parseFloat(val);
            } else {
                event.data.maxValue = parseFloat(val);
            }
        }

        if (this.txtMinValue != null) {
            this.txtMinValue.bind('keydown', this, function (event) {
                EventKeyDownHandler(this, event);
            });
            this.txtMinValue.bind('keyup', this, function (event) {
                EventKeyUpHandler(this, event);
            });
        }
        if (this.txtMaxValue != null) {
            this.txtMaxValue.bind('keydown', this, function (event) {
                EventKeyDownHandler(this, event);
            });
            this.txtMaxValue.bind('keyup', this, function (event) {
                EventKeyUpHandler(this, event);
            });
        }

        this.CheckToClose = function () {
            if (this.txtMaxValue != null && this.txtMinValue != null && this.txtMaxValue.val().length > 0 && this.txtMinValue.val().length > 0 && this.minValue >= this.maxValue) {
                var min = parseFloat(this.txtMinValue.val());
                var max = parseFloat(this.txtMaxValue.val());
                if (max < min) {
                    var tempValue = this.txtMaxValue.val();
                    this.txtMaxValue.val(this.txtMinValue.val());
                    this.txtMinValue.val(tempValue);
                    this.UpdateTextValue();
                }
            }
            return true;

        }
        this.CheckToClosesubmit = function () {
            if (parseFloat(this.txtMinValue.val()) && (this.txtMaxValue.val() == '' || this.txtMaxValue.val().length == 0)) {
                this.txtMaxValue.val('0');
            }
            if (this.txtMaxValue != null && this.txtMinValue != null && this.txtMaxValue.val().length >= 0 && this.txtMinValue.val().length > 0) {
                var min = parseFloat(this.txtMinValue.val());
                var max = parseFloat(this.txtMaxValue.val());
                if (max < min) {
                    var tempValue = this.txtMaxValue.val();
                    this.txtMaxValue.val(this.txtMinValue.val());
                    this.txtMinValue.val(tempValue);
                    this.UpdateTextValue();
                }
            }

            return true;

        }

        this.UpdateTextValue = function () {
            if (this.txtMaxValue != null && this.txtMinValue != null) {
                if (this.txtMinValue.val().length == 0 && this.txtMaxValue.val().length == 0) {
                    this.SetValue();
                }
                else {
                    var _text = '';
                    var _value = '';
                    var txtMinValue = this.txtMinValue.val().replace(",", ".");
                    var txtMaxValue = this.txtMaxValue.val().replace(",", ".");
                    if (this.unitPrice == 'money') {
                        if (txtMinValue.length > 0 && parseFloat(txtMinValue)) {
                            var txt = parseFloat(txtMinValue) * this.heso;
                            if (txtMaxValue.length > 0)
                                _text += txt;
                            else
                                _text += '>= ' + txt;

                            $('#' + _options.lblMin).text(txt);
                            _value = (parseFloat(txtMinValue)* this.heso);
                        }
                        else {
                            $('#' + _options.lblMin).text('');
                            _value = '0';
                        }
                        if (txtMaxValue.length > 0 && parseFloat(txtMaxValue)) {

                            var txt = parseFloat(txtMaxValue) * this.heso;
                            if (txtMinValue.length > 0)
                                _text += ' ; ' + txt;
                            else
                                _text += '< ' + txt;

                            $('#' + _options.lblMax).text(txt);
                            _value += ';' + (parseFloat(txtMaxValue)* this.heso);
                        } else {
                            $('#' + _options.lblMax).text('');
                            _value += ';0';
                        }
                    }
                    else if (this.unitPrice == 'area') {
                        if (txtMinValue.length > 0) {
                            if (txtMaxValue.length > 0)
                                _text += txtMinValue;
                            else
                                _text += '>= ' + txtMinValue;
                            _value = (parseFloat(txtMinValue)* this.heso);
                        }
                        if (txtMaxValue.length > 0) {

                            if (txtMinValue.length > 0)
                                _text += ' - ' + txtMaxValue;
                            else
                                _text += '< ' + txtMaxValue;
                            _value += ';' + (parseFloat(txtMaxValue)* this.heso);
                        }

                        _text += ' m2';
                    }

                    this.Value.val(_value);
                }
            }
        }
        this.SetValue = function (val) {

            this.Value.val(val);
            if (this.txtMaxValue != null) {
                this.txtMaxValue.val('');
                $('#' + _options.lblMin).text('');
            }
            if (this.txtMinValue != null) {
                this.txtMinValue.val('');
                $('#' + _options.lblMax).text('');
            }
        }

        this.GetValue = function () {
            return this.Value.val();
        }



        this._ChangeFunc = null;
        this._ChangeFuncScope = null;
        this.BindChangeEvent = function (_scope, func) {
            this._ChangeFunc = func;
            this._ChangeFuncScope = _scope;
        }


        if (this.txtMaxValue != null && this.txtMinValue != null && (this.txtMaxValue.val().length > 0 || this.txtMinValue.val().length > 0)) {
            this.UpdateTextValue();
        }
        return this;

    }

    AdvanceHiddenFilter.getValueById = function () {

    }

    $.fn.AdvanceHiddenFilter = AdvanceHiddenFilter;
    $.fn.AdvanceHiddenFilter.getValueById = AdvanceHiddenFilter.getValueById;

}(jQuery));

function numbersonly(myfield, e, dec) {
    var key;
    var keychar;
    if (window.event)
        key = window.event.keyCode;
    else if (e)
        key = e.which;
    else
        return true;
    if (key >= 96 && key <= 105)
        key = key - 48;
    keychar = String.fromCharCode(key);
    // control keys
    if ((key == null) || (key == 0) || (key == 8) || (key == 9) || (key == 27) || key == 16 || key == 36 || key == 46 || (key >= 48 && key <= 57) || key == 37 || key == 39) {
        return true;
    }

    if (key == 13) {
        if ($(myfield).attr('id') == "txtBetMoney") {
            BetlogInsert();
        }
        return false;
    }
// numbers
    else if ((("0123456789").indexOf(keychar) > -1))
        return true;
    // decimal point jump
    else if (dec && (key == 190 || key == 110 || key == 188)) {
        return ($(myfield).val().indexOf('.') < 0 && $(myfield).val().indexOf(',') < 0);
    }
    else
        return false;
}
function GetMoneyText2(money) {
    money = Math.round(money * 10) / 10;
    var retval = '';
    var sodu = 0;
    if (money >= 1000000000) {
        sodu = money / 1000000000;
        return sodu + ' tỷ ';
    }
    if (money >= 1000000) {
        sodu = money / 1000000;
        return sodu + ' triệu ';
    }
    return GetMoneyText(money);
}
function GetMoneyText(money) {

    if (money <= 0) {
        return "0 đồng";
    }

    money = Math.round(money * 10) / 10;
    var retval = '';
    var sodu = 0;
    if (money >= 1000000000) {
        sodu = Math.floor(money / 1000000000);
        retval += sodu + ' tỷ ';
        money = money - (sodu * 1000000000);
    }
    if (money >= 1000000) {
        sodu = Math.floor(money / 1000000);
        retval += sodu + ' triệu ';
        money = money - (sodu * 1000000);
    }
    if (money >= 1000) {
        sodu = Math.floor(money / 1000);
        retval += sodu + ' nghìn ';
        money = money - (sodu * 1000);
    }
    if (money > 0) {
        retval += money + ' đồng';
    }
    return retval;
}