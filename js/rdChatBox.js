(function(root, factory) {
	if(typeof define === "function" && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === "object") {
		module.exports = factory(require('jquery'));
	} else {
		root.rdChatBox = factory(root.jQuery);
	}
}(this, function(jquery) {
	var api = {
		el: undefined,
		boxUp: undefined,
		boxDown: undefined,
		jid: undefined,
		email: undefined,
		avatar: undefined,
		name: undefined,
		isShowMessWellcome: false,
		trigger: [],

		isLogin: false,
		firstShowUp: false,

		lwait: {},
		lsend: [],
		lreceive: [],
		fsend: false,
	};

	api.el = rdChatUI.box.el(api);

	rdChatUI.dock.find(".rd_chat_dock").append(api.el);

	api.boxChat = api.boxUp.find(".rd_chat_box_chat");
	api.boxOffline = api.boxUp.find(".rd_chat_box_offline");

	api.showChat = function showChat() {
		api.boxOffline.addClass("rd_hide");
		api.boxChat.removeClass("rd_hide");
		api.scrollChatToEnd();
	};

	api.showLogin = function showLogin() {		
		api.boxOffline.addClass("rd_hide");
		api.boxChat.addClass("rd_hide");
	};

	api.showOffline = function showOffline() {
		api.boxChat.addClass("rd_hide");
		api.boxOffline.removeClass("rd_hide");
	};

	api.boxUp.find(".evt_chat_down_window").click(function() {
		api.showDown();
	});

	api.boxDown.click(function() {
		api.showUp();
	});

	api.showStatus = function showStatus(_status) {
		if(_status === "online") {
			api.boxUp.addClass("rd_status_onl");
			api.boxDown.addClass("rd_status_onl");
			api.boxUp.removeClass("rd_status_off");
			api.boxDown.removeClass("rd_status_off");
		} else {
			api.boxUp.addClass("rd_status_off");
			api.boxDown.addClass("rd_status_off");
			api.boxUp.removeClass("rd_status_onl");
			api.boxDown.removeClass("rd_status_onl");
		}
	}

	api.showUp = function showUp() {
		api.boxUp.removeClass("rd_hide");
		api.boxDown.addClass("rd_hide");
		rdChatHelper.saveToogle("up");
		api.firstShowUp = true;
		if(api.isShowMessWellcome) {
			api.showMessWellcome();
		}
	};

	api.showDown = function showDown() {
		api.boxDown.removeClass("rd_hide");
		api.boxUp.addClass("rd_hide");
		rdChatHelper.saveToogle("down");
	};

	api.scrollChatToEnd = function scrollChatToEnd() {
		// $(".evt_rd_screen_chat").trigger("heightChange");
		var s = api.boxChat.find(".evt_rd_screen_chat")[0];
		s.scrollTop = s.scrollHeight;
	};

	api.boxChat.find(".evt_rd_chat_send_message").keydown(function(e) {
		var _keycode = e.keyCode || e.which,
		_value = api.boxChat.find(".evt_rd_chat_send_message").val(),
		_bMessage, _textarea, _id;

		_bMessage = rdChatHelper.bText(_value);
		_textarea = api.boxChat.find(".evt_rd_chat_send_message");

		if(_keycode === 13) {
			e.preventDefault();
			if(_bMessage !== "") {
				_textarea.val("");
				var _screen = api.boxChat.find(".js_screen_message");
				_id = Date.now();
				var _item = {
					id: _id.toString(),
					message: _bMessage,
					images: {},
					time: _id,
					boxScreen: _screen
				}

				if(!api.fsend) {
					var _url = "https://apichat.zamba.vn:8080/info/update/data";
					var _data = "title=" + document.title + "&browser=" + rdChatHelper.getBrowser() + "&operating=" + rdChatHelper.getOperating() + "&url=" + document.URL + "&from=" + rdlczb.jid + "&to=" + rdChatBox.jid + "&project=" + _project;
					rdChatHelper.ajax({
						url: _url,
						type: "GET",
						dataType: "text",
						data: _data,
						async: true,
						success: function() {},
						error: function() {}
					});
					api.fsend = true;
				}

				var _ui = rdChatUI.message.to(_item);
				if(_ui !== undefined) {
					_ui.addClass("rd_message_wait");
					api.lwait[_id] = _ui;
					rdlczb.sendSupport({
						message: _bMessage,
						time: _id,
						images: {},
						jid: api.jid,
						id: _id,
						tEmail: api.email,
						tName: api.name,
					});
					api.scrollChatToEnd();
				}
			}
		}
	});

	api.receiveUI = function receiveUI(_data) {
		if(api.lreceive.indexOf(_data.id) === -1) {
			_data.boxScreen = api.boxChat.find(".js_screen_message");
			var _ui = rdChatUI.message.from(_data);
			api.lreceive.push(_data.id);
			api.scrollChatToEnd();
		}
	};

	api.sendUI = function sendUI(_data) {
		if(api.lsend.indexOf(_data.id) === -1) {
			if(Object.keys(api.lwait).indexOf(_data.id) !== -1) {
				api.lwait[_data.id].removeClass("rd_message_wait");
				delete api.lwait[_data.id];
			} else {
				var _ui = rdChatUI.message.to(_data);
			}
			api.lsend.push(_data.id);
			api.scrollChatToEnd();
		}
	};

	api._hisReceiveUI = function receiveUI(_data) {
		if(api.lreceive.indexOf(_data.id) === -1) {
			var _ui = rdChatUI.message.hfrom(_data);
			api.lreceive.push(_data.id);
			api.scrollChatToEnd();
		}
	};

	api._hisSendUI = function sendUI(_data) {
		if(api.lsend.indexOf(_data.id) === -1) {
			if(Object.keys(api.lwait).indexOf(_data.id) !== -1) {
				api.lwait[_data.id].removeClass("rd_message_wait");
				delete api.lwait[_data.id];
			} else {
				var _ui = rdChatUI.message.hto(_data);
			}
			api.lsend.push(_data.id);
			api.scrollChatToEnd();
		}
	};

	api.changeInfo = function changeInfo() {
		api.boxChat.find(".js_change_name").text(api.name);
		api.boxChat.find(".js_change_avatar").attr({
			src: rdChatOption.BOX_AVATAR
		});
	};

	api.handleHistories = function handleHistories(item) {
		var _screen = api.boxChat.find(".js_screen_message");
		if(item.status === 1) {
			if(item.data.length > 0) {
				rdlczb.isSendWellcome = true;
				for(var i in item.data) {
					var _t = item.data[i];
					if(typeof _t === "object" && _t.fromChatID.split("@")[0] === rdlczb.jid) {
						if(Object.keys(_t).indexOf("wellcome")!=-1) {
							api._hisReceiveUI({
								message: _t.wellcome,
								images: {},
								id: Date.now()/1000,
								time: Date.now()/1000,
								boxScreen: _screen
							});
						}
						api._hisSendUI({
							message: _t.message,
							images: _t.images,
							id: _t.mid,
							time: _t.time,
							boxScreen: _screen
						});
					} else {
						api._hisReceiveUI({
							message: _t.message,
							images: _t.images,
							id: _t.mid,
							time: _t.time,
							boxScreen: _screen
						});
					}
				}
				rdChatHelper.getPresentStatus(function(_data) {
					if(_data.status === "online") {
						api.showChat();
					} else {
						api.showOffline();
					}
				});
			} else {
				api.isShowMessWellcome = true;
				if(api.firstShowUp) {
					api.showMessWellcome();
				} else {
					rdChatHelper.getPresentStatus();
				}
				api.showChat();
			}
		}
	};

	api.showMessWellcome = function showMessWellcome() {
		api.isShowMessWellcome = false;
		var _screen = api.boxChat.find(".js_screen_message");
		rdChatHelper.getPresentStatus(function(_data) {
			if(_data.status === "online") {
				rdlczb.textwellcome = rdChatOption.MESS_ONLINE;
				api._hisReceiveUI({
					message: rdChatOption.MESS_ONLINE,
					images: {},
					id: rdconfig.START_TIME.toString(),
					time: rdconfig.START_TIME.toString(),
					boxScreen: _screen
				});
				api.showChat();
			} else {
				rdlczb.textwellcome = rdChatOption.MESS_OFFLINE;
				api._hisReceiveUI({
					message: rdChatOption.MESS_OFFLINE,
					images: {},
					id: rdconfig.START_TIME.toString(),
					time: rdconfig.START_TIME.toString(),
					boxScreen: _screen
				});
				api.showOffline();
			}
		});
	}

	//Click vao nut gui
	api.boxOffline.find("#buttonSend").click(function() {
		var phoneNumberInlocalStorage=localStorage.getItem("rdChatPhoneNumber");
		//Kiem tra box chat ban dau o trang thai mac dinh hay trang thai da co lich su chat
		if(phoneNumberInlocalStorage===null||phoneNumberInlocalStorage===""){
			  //Chuyển sang ô nhập có số điện thoại và tin nhắn, như vậy ta ẩn ô nhập tên đi 
			var _phone = api.boxOffline.find(".evt_value_phone").val(),
			_screen = api.boxOffline.find(".rd_chat_label_offline");
		   var _bPhone = rdChatHelper.bText(_phone);
			
				if(_bPhone === "" || !rdChatHelper.isPhone(_bPhone)) {	
					_screen.html("<span style='color: red;font-style: italic;'>Số điện thoại chưa đúng hoặc không có</span>");
				}
				/*Nếu nhập đúng, đủ các thông tin thì chuyển sang giao diện chỉ gồm ô nhập tin và nút gửi, vậy cần
				 * ẩn ô nhập số điện thoại và hiện vùng hiển thị tin nhắn cùng với sửa thông tin
			*/
				else{
					localStorage.setItem("rdChatPhoneNumber", _bPhone);
					var _message = api.boxOffline.find(".evt_value_message").val();
					var _bMessage = rdChatHelper.bText(_message);
					_screen.text(rdChatOption.BOX_TITLE_OFFLINE);
				     api.boxOffline.find(".evt_value_message").val("");
					api.boxOffline.find(".rd_chat_label_offline").hide();
					api.boxOffline.find(".rd_chat_offline_phone").hide();
					api.boxOffline.find(".rd_chat_offline_message_viewer").show();
					api.boxOffline.find(".rd_chat_offline_edit_infor").show();
					api.boxOffline.find(".rd_chat_offline_message").show();
			       if(_bMessage!==null && _bMessage!==""){
	               var spanMessageViewer=document.createElement("span");
	               spanMessageViewer.className="rd_chat_offline_message_viewer_span";
	               spanMessageViewer.innerHTML=_bMessage;
			       api.boxOffline.find(".rd_chat_offline_message_viewer").append(spanMessageViewer);
                   	//Gửi ajax, bỏ ô email đi !!!
				         	var _data = "&fullname="+rdlczb.name+"&content="+_bMessage+"&phone="+_bPhone+"&type=support&token=" + _project;
				         	rdChatHelper.ajax({
				         		url: rdconfig.URL_SEND_OFFLINE,
				         		type: "POST",
				         		dataType: "text",
				         		data: "phone",//Thay email bằng phone vì ô email ko còn
				         		contentType: "application/json; charset=utf-8",
				         		async: true,
				         		success: function (done) {
				         			console.log(done);
				         		},

				         		error: function (fail) {console.log(fail);}	
				         	});	

						//Để cho thanh cuộn luôn ở bottom,thuận lợi cho người sử dụng viết thêm đoạn code nữa :
						//Ham cho phep cuon thanh scroll xuong bottom

						  jQuery(api.boxOffline.find(".rd_chat_offline_message_viewer")).scrollTop(jQuery(api.boxOffline.find(".rd_chat_offline_message_viewer"))[0].scrollHeight);
						//Luu message vao localstorage 
						var objMessage=localStorage.getItem("rdChatMessage");
						if(objMessage!=null){
							objMessage=JSON.parse(objMessage); 
		                    objMessage.push(_bMessage);
							}
							else{
								   objMessage=[_bMessage]; 
								}
				             localStorage.setItem("rdChatMessage", JSON.stringify(objMessage));	
				     
				}
			}
		  }
		
		else{
			//Ta ngam dinh rang da co lich su chat
			_message = api.boxOffline.find(".evt_value_message").val(),
			_screen = api.boxOffline.find(".rd_chat_label_offline");
		   var _bPhone = rdChatHelper.bText(phoneNumberInlocalStorage),
			_bMessage = rdChatHelper.bText(_message);
			
		    if(_bMessage!==null && _bMessage!==""){
  
	        var spanMessageViewer=document.createElement("span");
	        spanMessageViewer.className="rd_chat_offline_message_viewer_span";
	        spanMessageViewer.innerHTML=_bMessage;
			api.boxOffline.find(".rd_chat_offline_message_viewer").append(spanMessageViewer);
		     //Gửi ajax, bỏ ô email đi !!!
				         	var _data = "&fullname="+rdlczb.name+"&content="+_bMessage+"&phone="+_bPhone+"&type=support&token=" + _project;
				         	rdChatHelper.ajax({
				         		url: rdconfig.URL_SEND_OFFLINE,
				         		type: "POST",
				         		dataType: "text",
				         		data: "phone",//Thay email bằng phone vì ô email ko còn
				         		contentType: "application/json; charset=utf-8",
				         		async: true,
				         		success: function (done) {
				         			console.log(done);
				         		},

				         		error: function (fail) {console.log(fail);}	
				         	});	
			//Luu message vao localstorage 
			var objMessage=localStorage.getItem("rdChatMessage");
			if(objMessage!=null){
				objMessage=JSON.parse(objMessage); 
                objMessage.push(_bMessage);
				}
				else{
					   objMessage=[_bMessage]; 
					}
	             localStorage.setItem("rdChatMessage", JSON.stringify(objMessage));	
            }
         jQuery(api.boxOffline.find(".rd_chat_offline_message_viewer")).scrollTop(jQuery(api.boxOffline.find(".rd_chat_offline_message_viewer"))[0].scrollHeight);
	//Set title cùng với xóa tin đã nhập ở ô nhập tin mỗi lần gửi xong
	_screen.text(rdChatOption.BOX_TITLE_OFFLINE);
	 api.boxOffline.find(".evt_value_message").val("");

		}
	});

//Click vao sua thong tin (sua so dien thoai)
	  api.boxOffline.find(".rd_chat_offline_edit_infor").click(function(){
	  //Sau khi click vào link này hiện ra ô nhập số điện thoại ban đầu cùng với nút sửa.Vậy cần ẩn vài thành phần
		api.boxOffline.find(".rd_chat_offline_edit_infor").hide();
		api.boxOffline.find(".rd_chat_offline_message_viewer").hide();
		api.boxOffline.find(".rd_chat_offline_message").hide();
		//Và hiện nút sửa cùng với ô nhập số điện thoại
		api.boxOffline.find(".rd_chat_label_offline").show();
		api.boxOffline.find(".rd_chat_label_offline").text("Nhập thông tin cá nhân");
		api.boxOffline.find(".rd_chat_offline_phone").show();
		api.boxOffline.find("#buttonSend").hide();
		api.boxOffline.find("#buttonSave").show();   
		
	});

//Click vao nut luu
	api.boxOffline.find("#buttonSave").click(function(){

       var _phone = api.boxOffline.find(".evt_value_phone").val();
		var	_screen = api.boxOffline.find(".rd_chat_label_offline");
       var _bPhone = rdChatHelper.bText(_phone);
		if(_bPhone === "" || !rdChatHelper.isPhone(_bPhone)) {	
					_screen.html("<span style='color: red;font-style: italic;'>Số điện thoại chưa đúng hoặc không có</span>");
				} else {
					//Đúng rồi thì lưu vào localstorage
			localStorage.setItem("rdChatPhoneNumber",_bPhone);

			//Chuyển lại về giao diện đang chát
			api.boxOffline.find("#buttonSave").hide();
			api.boxOffline.find(".rd_chat_label_offline").hide();
			api.boxOffline.find(".rd_chat_offline_phone").hide();
			api.boxOffline.find(".rd_chat_offline_edit_infor").show();
			api.boxOffline.find(".rd_chat_offline_message_viewer").show();
			api.boxOffline.find(".rd_chat_offline_message").show();
		   api.boxOffline.find("#buttonSend").show();
			}
	});

	api.boxChat.find(".evt_send_img").change(function(e) {
		var _f = this.files[0];
		rdChatHelper.handleImages.handle({
			data: _f,
			success: function(_d) {
				var _s = _d.status,
					_idi = _d.bid;

				if(_s === "complete") {
					var _id = Date.now();
					var _item = {
						id: _id.toString(),
						message: "",
						images: {
							idImageSmall: rdconfig.URL_LOAD_IMAGE_SMALL + _idi,
							idImageLange: rdconfig.URL_LOAD_IMAGE_BIG + _idi
						},
						time: _id,
						boxScreen: api.boxChat.find(".js_screen_message")
					}
					var _ui = rdChatUI.message.to(_item);
					_ui.addClass("rd_message_wait");
					api.lwait[_id] = _ui;	
					rdlczb.sendSupport({
						message: "",
						time: _id,
						images: {
							idImageSmall: rdconfig.URL_LOAD_IMAGE_SMALL + _idi,
							idImageLange: rdconfig.URL_LOAD_IMAGE_BIG + _idi
						},
						jid: api.jid,
						id: _id,
						tEmail: api.email,
						tName: api.name,
					});			
					api.scrollChatToEnd();		
				}
			},
			error: function(_f) {
				console.log(_f);
			},
			url: rdconfig.URL_UPLOAD_IMAGE,
			type: "POST",
			async: true
		});
	});

	api.sendTransfer = function sendTransfer(data) {
		if ( typeof data === "string" ) {
			data = JSON.parse( data );
		}

		for( var i in data ) {
			if ( typeof data[i].msg != "undefined" && typeof data[i].img != "undefined" ) {
				if ( data[i].msg != "" ) {
					var beautiMessage = rdChatHelper.bText( data[i].msg ),
						idMess = Date.now();
					rdlczb.messageTransferSupport(api.jid, beautiMessage, "chat", idMess, api.email, api.name);		
				}
			}
		}
	};

	return api;
}));