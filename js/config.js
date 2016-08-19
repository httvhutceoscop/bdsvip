(function(root, factory) {
	if(typeof define === "function" && define.amd) {
		define([], factory);
	} else if (typeof exports === "object") {
		module.exports = factory();
	} else {
		root.rdconfig = factory();
	}
}(this, function(jquery) {
	var api = {
		URL_API_HOME: "https://apichat.zamba.vn:9090",

		URL_SERVICE: "https://apichat.zamba.vn:8866",
	};

	api.URL_SEND_OFFLINE = "http://dev.rd.todo.vn/chat/api.php?chat&cmd=sendpm";

	// Đường dẫn gọi api transfer support
	api.URL_TRANSFER_SUPPORT = api.URL_API_HOME + "/plugins/rdapi/v1/support/changedsupport";

	// Đưỡng dẫn gọi api kiểm tra các support của dự án có online hay không
	api.URL_CHECK_SUPPORT_ONLINE = api.URL_API_HOME + "/plugins/apilivechat/checkonline";

	// Đường dẫn gọi api để update ảnh
	api.URL_UPLOAD_IMAGE = "https://rdapi.zamba.vn/cgi-rdteam-2014/upload";

	// ĐƯờng dẫn lấy ảnh cỡ nhỏ
	api.URL_LOAD_IMAGE_SMALL = "https://rdapi.zamba.vn/cgi-rdteam-2014/images?bid=";

	// ĐƯờng dẫn lấy ảnh cớ lớn
	api.URL_LOAD_IMAGE_BIG = "https://rdapi.zamba.vn/cgi-rdteam-2014/thumb?bid=";

	// Đường dẫn gọi api thêm một cuộc hội thoại vào db giữa client với client
	api.URL_ADD_CONVERSATION_CLIENT = api.URL_API_HOME + "/plugins/mobileapi/v1/conversations/addConversation";
	
	// Đường dẫn gọi API thêm một cuộc hội thoại giữa client với support
	api.URL_ADD_CONVERSATION_SUPPORT = api.URL_API_HOME + "/plugins/mobileapi/v1/conversations/addInfoConversationSupport";

	// Đường dẫn gọi API lấy histories
	api.URL_GET_HISTORIES = api.URL_API_HOME + "/plugins/rdapi/v1/helper/histories";

	// Đường dẫn gọi api Kiểm tra danh sách chat id có online hay không
	api.URL_GET_STATUS = api.URL_API_HOME + "/plugins/mobileapi/v1/presents/status";

	// Đường dẫn gọi api lấy support
	api.URL_GET_SUPPORT = api.URL_API_HOME + "/plugins/rdapi/v1/support/getsupport";

	// Đường dẫn gọi api lấy các cuộc hội thoại
	api.URL_GET_CONVERSATION_CLIENT = api.URL_API_HOME + "/plugins/mobileapi/v1/conversations/getConversationClient";

	// Đường dẫn gọi api khi các support không online ( trong cửa sổ offline )
	api.URL_SEND_MESSAGE_OFFLINE = "http://chat.zamba.vn/sendpm.php";

	// Đường dẫn gọi api để đăng ký hoặc lấy tài khoản chat
	api.URL_REGIS = api.URL_API_HOME + "/plugins/restapi/v1/users";

	// BOSH HTTP-BIND kết nối đến server XMPP
	api.BOSH_SERVICE = api.URL_SERVICE + "/http-bind/";

	// Domain chat
	api.DOMAIN_CHAT = "chatzamba";

	// Thời gian timeout của một live ajax
	api.TIMEOUT = 300;

	// Sô bản ghi trả về trong histories
	api.HISTORIES_LIMIT = 60;

	// Đường dẫn lưu coockie
	api.COOCKIE_PATH = "/";

	api.START_TIME = Date.now();

	api.PAGE_TITLE_DEFAULT=document.title;
	
	return api;
}));


(function(root, factory) {
	if(typeof define === "function" && define.amd) {
		define([], factory);
	} else if (typeof exports === "object") {
		module.exports = factory();
	} else {
		root.rdpconfig = factory();
	}
}(this, function(jquery) {
	var api = {
		VERSION: "Phiên bản thử nghiệm: v-3.0",
		PROJECT: "default",
		IS_RECONNECT: true,
		IS_CARBONS: true,
		IS_SAVE_ACCOUNT: true,
		IS_FORWARD: true,
		DEFAULT_AVATAR: "http://eboto.todo.vn/_css/style_new/icon/chat_demo/ava_default.jpg",
		CSS_AWAY: "away_s",
		CSS_INVISIABLE: "invisible_s",
		MULTILWINDOW: true,
		NUMBER_WINDOW: 10
	}

	return api;
}));