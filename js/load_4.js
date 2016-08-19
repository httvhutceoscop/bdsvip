(function() {
	var _tpl = rdChatOption.TPL,
		_home = "https://rdapi.zamba.vn/tplchat";

	var _a_ = document.createElement("script"),
		_b_ = document.createElement("script"),
		_c_ = document.createElement("script"),
		_a = document.createElement("script"),
		_b = document.createElement("script"),
		_c = document.createElement("script"),
		_d = document.createElement("script"),
		_e = document.createElement("script"),

		_l = document.createElement("link"),
		_h = document.getElementsByTagName("head")[0];
	_l.href = _home + "/" + _tpl + "/css/rdchat.css";
	_l.rel = "stylesheet";
	_l.type = "text/css";

	_a_.src = _home + "/js/config.js";
	_a_.type = "text/javascript";

	_b_.src = _home + "/js/strophe.min.js";
	_b_.type = "text/javascript";

	_c_.src = _home + "/js/jquery.slimscroll.min.js";
	_c_.type = "text/javascript";

	_a.src = _home + "/js/rdHelper.js";
	_a.type = "text/javascript";

	_b.src = _home + "/" + _tpl + "/type_4/js/rdChatUI.js";
	_b.type = "text/javascript";

	_c.src = _home + "/" + _tpl + "/type_4/js/rdChatBox.js";
	_c.type = "text/javascript";

	_d.src = _home + "/" + _tpl + "/type_4/js/rdChatZamba.js";
	_d.type = "text/javascript";

	_e.src = _home + "/" + _tpl + "/type_4/js/rdMain.js";
	_e.type = "text/javascript";

	_d.onload = function () {
		_h.appendChild(_e);
	}

	_c.onload = function () {
		_h.appendChild(_d);
	}

	_b.onload = function () {
		_h.appendChild(_c);
	}

	_a.onload = function () {
		_h.appendChild(_b);
		rdpconfig.PROJECT = _project;
	}

	_a_.onload = function() {
		_h.appendChild(_b_);
	}

	_b_.onload = function() {
		_h.appendChild(_c_);
	}

	_c_.onload = function () {
		_h.appendChild(_a);
	}

	_h.appendChild(_l);
	_h.appendChild(_a_);
})()