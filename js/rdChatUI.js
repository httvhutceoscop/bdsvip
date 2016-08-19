(function(root, factory) {
	if(typeof define === "function" && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === "object") {
		module.exports = factory(require('jquery'));
	} else {
		root.rdChatUI = factory(root.jQuery);
	}
}(this, function(jquery) {
	var api = {};

	api.dock = jquery(document.createElement("div")).attr({
		id: "rd_chat"
	}).append(rdChatHelper.join
	("<div class='rd_chat_dock rd_chat_width_box'></div>")
	());

	try {
		api.dock.addClass(rdChatOption.CLASSCOLOR);	
	} catch (e) {
		console.log(e);
	}

	api.box = {
		el: function createElement(data) {
			var el = jquery(document.createElement("div")).attr({
				class: "rd_chat_box"
			});

			data.boxUp = api.box.up();
			data.boxDown = api.box.down();
			el.append(data.boxUp);
			el.append(data.boxDown);
			return el;
		},
		down: function createBoxDown() {
			var el = jquery(document.createElement("div")).attr({
				class: "rd_chat_box_down rd_chat_border rd_chat_backgroud rd_status_onl rd_hide"
			}).append(rdChatHelper.join
			("<span class='rd_chat_title_box_down'>")
				("<span class='rd_title_onl'>" + rdChatOption.TITLE_BOX_DOWN_ONLINE + "</span>")
				("<span class='rd_title_off'>" + rdChatOption.TITLE_BOX_DOWN_OFFLINE + "</span>")
			("</span>")
			("<span class='rd_chat_icon_up_box'></span>")
			());
			return el;
		},
		up: function createBoxUp() {
			var el = jquery(document.createElement("div")).attr({
				class: "rd_chat_box_up rd_chat_border rd_chat_backgroud rd_status_onl rd_hide"
			})
			el.append(api.box.chat());
			el.append(api.box.offline());
			return el;
		},
			offline: function createBoxOffline() {
			//Ban đầu tạo tất cả các thành phần trong box chát này
			var el = jquery(document.createElement("div")).attr({
				class: "rd_chat_box_offline rd_chat_border rd_chat_backgroud rd_hide"
			}).append(rdChatHelper.join
			("<div class='rd_chat_box_broad'>")
				("<div class='rd_chat_chat_head evt_chat_down_window'>")
					("<span class='rd_chat_chat_head_title'>"+rdChatOption.TITLE_BOX_UP+"</span>")
					("<span class='rd_chat_chat_head_icon'></span>")
				("</div>")
				("<div class='rd_chat_info_offline'>")
					("<div class='rd_chat_label_offline'>"+rdChatOption.BOX_TITLE_OFFLINE+"</div>")
					("<div class='rd_chat_offline_phone'>")
						("<input type='text' placeholder='Nhập số điện thoại' class='evt_value_phone'/>")
						("</div>")
						("<div class='rd_chat_offline_edit_infor'>Sửa thông tin cá nhân")("</div>")//Them link sua thong tin 
					("<div class='rd_chat_offline_message_viewer'>")
					("</div>")
					("<div class='rd_chat_offline_message'>")
						("<textarea placeholder='Nhập tin nhắn' class='evt_value_message'></textarea>")
					("</div>")
					("<div class='rd_chat_offline_submit'>")
						("<input type='button' value='Gửi' class='rd_chat_border rd_chat_backgroud evt_send_mail' id='buttonSend'")
					("<input type='button' value='Lưu' class='rd_chat_border rd_chat_backgroud evt_save_mail' id='buttonSave'")
					("</div>")
					("<div class='rd_chat_offline_submit'>")
					("<input type='button' value='Lưu' class='rd_chat_border rd_chat_backgroud evt_save_mail' id='buttonSave'")
						("</div>")
			("</div>")
			());
			//Kiểm tra điều kiện để hiển thị, nếu đã có số điện thoại trước đó thì hiển thị giao diện với lịch sử chát, không thì hiển thị giao diện mặc định
			var phoneNumber=localStorage.getItem("rdChatPhoneNumber");
			if(phoneNumber===null||phoneNumber===""){
				    $(el).find(".rd_chat_offline_message").addClass("rd_hide");
				    $(el).find(".rd_chat_offline_edit_infor").addClass("rd_hide");
					$(el).find(".rd_chat_offline_message_viewer").addClass("rd_hide");
					$(el).find(".evt_save_mail").addClass("rd_hide");
			}
			else{
				//Hiển thị với lịch sử chát
					$(el).find(".rd_chat_offline_phone").addClass("rd_hide");
					$(el).find(".rd_chat_label_offline").addClass("rd_hide");
					$(el).find(".evt_save_mail").addClass("rd_hide");
					//Load lịch sử chát lên
					var jsonMessageHistory=localStorage.getItem("rdChatMessage");

                    if(jsonMessageHistory!==null){
					var messageHistory=JSON.parse(jsonMessageHistory);
					for(i=0 ; i<messageHistory.length;i++){
					var spanMessage=document.createElement("span");
					spanMessage.className="rd_chat_offline_message_viewer_span";
					spanMessage.innerHTML=messageHistory[i];
					$(el).find(".rd_chat_offline_message_viewer").append(spanMessage);
					}
				}
			}	
			return el;
		},
		chat: function createBoxChat() {
			var el = jquery(document.createElement("div")).attr({
				class: "rd_chat_box_chat rd_hide"
			}).append(rdChatHelper.join
			("<div class='rd_chat_box_broad'>")
				("<div class='rd_chat_chat_head evt_chat_down_window'>")
					("<span class='rc_chat_info_support'>")
						("<span class='rd_chat_name js_change_name'>"+rdChatOption.TITLE_BOX_UP+"</span>")
						("<span class='rd_chat_anything'>"+rdChatOption.BOX_ANYTHING+"</span>")
					("</span>")
					("<span class='rd_chat_chat_head_icon'></span>")
				("</div>")
				("<div class='rd_chat_chat_chat evt_rd_screen_chat'>")
					("<section class='chat-message '>")
						("<div class='chat-center'>")
							("<div class='chat-grid-message js_screen_message'>")
							("</div>")
						("</div>")
					("</section>")
				("</div>")
				("<div class='rd_chat_chat_input'>")
					("<span class='rd_chat_input_send'>")
						("<textarea type='text' placeholder='Nhập nội dung chat ...' class='evt_rd_chat_send_message'></textarea>")
					("</span>")
					("<span class='rd_chat_input_image'>")
						("<input type='file' class='evt_send_img'>")
					("</span>")
				("</div>")
			("</div>")
			());
			return el;
		}
	}

	api.message = {
		hfrom: function createHFrom(_data) {
			console.log(_data.message);
			var _re = undefined;
			if(typeof _data.message === "string" && (_data.message !== "" || Object.keys(_data.images).length > 0)) {
				var _screen = _data.boxScreen;
				var _ls = _screen.find(".chat-col-message-received:last-child");
				if(_data.message.indexOf("img") === -1) {
					_data.message = rdChatHelper.encodeHTMLEntities(_data.message);
					_data.message = rdChatHelper.makeLink(_data.message);
				}
				var _ui = $(document.createElement("span")).append(rdChatHelper.join
					("<div class='chat-message-received'>")
						("<div class='chat-message-text'>"+_data.message+"</div>")
						("<div class='chat-message-image'></div>")
						("<div class='chat-message-icon'></div>")
					("</div>")
					("<span class='chat-support-img'>")
						("<img src='"+rdChatOption.BOX_AVATAR+"' class='js_change_avatar'")
					("</span>")
					());
				if(Object.keys(_data.images).length > 0) {
					console.log(_data.images);
					var key = "<a href='"+_data.images.idImageLange+"' target='_blank'><img src='"+_data.images.idImageSmall+"'/></a>";
					_ui.find(".chat-message-image").append(key);
				}
				_re = _ui;
				if(_ls.hasClass("chat-col-message-received")) {
					_ls.append(_ui);
				} else {
					var _el = $(document.createElement("div")).attr({
						class: 'chat-col-message-received'
					}).append(_ui);
					_screen.append(_el);
				}
			}

			return _re;
		},
		hto: function createHto(_data) {
			var _re = undefined;
			if(typeof _data.message === "string" && (_data.message !== "" || Object.keys(_data.images).length > 0)) {
				var _screen = _data.boxScreen;
				var _ls = _screen.find(".chat-col-message-sent:last-child");
				_data.message = rdChatHelper.encodeHTMLEntities(_data.message);
				_data.message = rdChatHelper.makeLink(_data.message);
				var _ui = $(document.createElement("span")).append(rdChatHelper.join
					("<div class='chat-message-sent'>")
						("<div class='chat-message-text'>"+_data.message+"</div>")
						("<div class='chat-message-image'></div>")
						("<div class='chat-message-icon'></div>")
					("</div>")
					());
				if(Object.keys(_data.images).length > 0) {
					console.log(_data.images);
					var key = "<a href='"+_data.images.idImageLange+"' target='_blank'><img src='"+_data.images.idImageSmall+"'/></a>";
					_ui.find(".chat-message-image").append(key);
				}
				_re = _ui;
				if(_ls.hasClass("chat-col-message-sent")) {
					_ls.append(_ui);
				} else {
					var _el = $(document.createElement("div")).attr({
						class: 'chat-col-message-sent'
					}).append(_ui);
					_screen.append(_el);
				}
			}

			return _re;
		},
		from: function createFrom(_data) {
			try {
				var _re = undefined;
				if(typeof _data.message === "string" && (_data.message !== "" || Object.keys(_data.images).length > 0)) {
					var _screen = _data.boxScreen;
					var _ls = _screen.find(".chat-col-message-sent:last-child");
					if(_data.message.indexOf("img") === -1) {
						_data.message = rdChatHelper.encodeHTMLEntities(_data.message);
						_data.message = rdChatHelper.makeLink(_data.message);
					}
					var _ui = $(document.createElement("span")).append(rdChatHelper.join
						("<div class='chat-message-received'>")
							("<div class='chat-message-text'>"+_data.message+"</div>")
							("<div class='chat-message-image'></div>")
							("<div class='chat-message-icon'></div>")
						("</div>")
						("<span class='chat-support-img'>")
							("<img src='"+rdChatOption.BOX_AVATAR+"' class='js_change_avatar'")
						("</span>")
						());
					if(typeof _data.images === "object" && Object.keys(_data.images).length > 0) {
						console.log(_data.images);
						var key = "<a href='"+_data.images.idImageLange+"' target='_blank'><img src='"+_data.images.idImageSmall+"'/></a>";
						_ui.find(".chat-message-image").append(key);
					}
					_re = _ui;
					if(_ls.hasClass("chat-col-message-received")) {
						_ls.append(_ui);
					} else {
						var _el = $(document.createElement("div")).attr({
							class: 'chat-col-message-received'
						}).append(_ui);
						_screen.append(_el);
					}
				}
			} catch (e) {
				console.log(e);
			}
			

			return _re;
		},
		to: function createTo(_data) {
			var _re = undefined;
			if(typeof _data.message === "string" && (_data.message !== "" || Object.keys(_data.images).length > 0)) {
				var _screen = _data.boxScreen;
				var _ls = _screen.find(".chat-col-message-sent:last-child");
				_data.message = rdChatHelper.encodeHTMLEntities(_data.message);
				_data.message = rdChatHelper.makeLink(_data.message);
				var _ui = $(document.createElement("div")).attr({
					class: "chat-message-sent"
				}).append(rdChatHelper.join
					("<div class='chat-message-text'>"+_data.message+"</div>")
					("<div class='chat-message-image'></div>")
					("<div class='chat-message-icon'></div>")
					());
				if(Object.keys(_data.images).length > 0) {
					console.log(_data.images);
					var key = "<a href='"+_data.images.idImageLange+"' target='_blank'><img src='"+_data.images.idImageSmall+"'/></a>";
					_ui.find(".chat-message-image").append(key);
				}
				_re = _ui;
				
				if(_ls.hasClass("chat-col-message-sent")) {
					_ls.append(_ui);
				} else {
					var _el = $(document.createElement("div")).attr({
						class: 'chat-col-message-sent'
					}).append(_ui);
					_screen.append(_el);
				}
			}

			return _re;
		}
	}	

	return api;
}));