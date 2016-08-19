
(function(root, factory) {
	if(typeof define === "function" && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === "object") {
		module.exports = factory(require('jquery'));
	} else {
		root.rdlczb = factory(root.jQuery);
	}
}(this, function(jquery) {
	var api = {
		jid: undefined,
		password: undefined,
		name: undefined,
		email: undefined,
		phone: undefined,
		session: undefined,
		server: new Strophe.Connection(rdconfig.BOSH_SERVICE),
		isReconnect: rdpconfig.IS_RECONNECT,
		isCarbons: rdpconfig.IS_CARBONS,

		ebConnected: undefined,
		ebReconnected: undefined,
		isConnected: false,
		loadCache: false,
		isSendWellcome: false,
		textwellcome: "",
		first_chat: true,
	};

	/**
	 * Thêm các namespace vào Strophe
	 */
	Strophe.addNamespace("chatstates", "http://jabber.org/protocal/chatstates");
	Strophe.addNamespace("forwarded", "urn.xmpp.forward:0");
	Strophe.addNamespace("delay", "urn:xmpp:delay");
	Strophe.addNamespace("client", "jabber:client");

	/**
	 * Kết nối đến server chat
	 */
	api.connect = function connect(data) {
		var _this = api
		  , jid = data.jid
		  , password = data.password;
		if(typeof jid === "string" && typeof password === "string") {
			if(jid.indexOf("@" + rdconfig.DOMAIN_CHAT) === -1) {
				jid += "@" + rdconfig.DOMAIN_CHAT;
			}

			rdlczb.session = "/Website-" + Math.floor(Math.random() * 139749825).toString();
			jid += rdlczb.session;
			_this.server.connect(jid, password, _this.onStatusChanged, rdconfig.TIMEOUT, 0);
		} else {
			console.log("Chưa có jid hoặc password");
		}
	};

	/** 
	 * Bật chức năng carbons
	 */
	api.carbons = function carbons() {
		var _this = this
		  , iqCarbon = undefined;

		if(!_this.isCarbons) {
			return;
		}

		iqCarbon = new Strophe.Builder("iq", {
			from: _this.server.jid,
			id: "enablecarbons",
			type: "set"
		}).c("enable", {xmlns: "urn:xmpp:carbons:2"});
		
		_this.server.addHandler(function(iq){
			if(jquery(iq).find("error").length > 0) {
				console.log("ERROR: Không hỗ trợ carbons");
			} else {
				console.log("Message carbons have been enabled");
			}
		}, null, "iq", null, "enablecarbons");

		_this.server.sendIQ(iqCarbon);
	};

	/**
	 * Tự động kết nối lại
	 */
	api.reconnect = function reconnect() {
		var _this = api;
		if(_this.isReconnect) {
			_this.server.connect(_this.connection.jid, _this.connection.pass, function(status) {_this.onStatusChanged(status, true)}, rdconfig.TIMEOUT, 0);
		}
	}

	/**
	 * Call back thay đổi trạng thái
	 */
	api.onStatusChanged = function onStatusChanged(status, recon) {
		if(status === Strophe.Status.CONNECTED) {
			if(recon) {
				api.onReconnected();
			} else {
				api.onConnected();
			}
			api.server.send($pres().tree());
		} else if(status === Strophe.Status.DISCONNECTED) {
			api.reconnect();
		} else if(status === Strophe.Status.CONNFAIL) {
			console.log("Lỗi kết nối");
		} else if(status === Strophe.Status.AUTHFAIL) {
			console.log("Sai tài khoản");
		}
	};

	/**
	 * Xử lý các chức năng khi kết nối lại thành công
	 */
	api.onReconnected = function onReconnected() {
		var _this = this;
		_this.server.addHandler(_this.onMessage, Strophe.NS.client, "message", "chat", null, null);
		_this.server.addHandler(_this.onForwarded, Strophe.NS.forwarded, "message", "chat", null, null);
		_this.server.addHandler(_this.onServiceForwarded, Strophe.NS.forwarded, "message", "normal", null, null);
		_this.server.addHandler(_this.onNormal, null, "message", "normal", null, null);
		_this.server.addHandler(_this.onIQ, null, "iq", "get", null, null);
		if (typeof _this.ebReconnected === "function") {
			_this.ebReconnected();
		}
	};

	/**
	 * Xử lý các chức năng khi kết nối thành công
	 */
	api.onConnected = function onConnected() {
		var _this = api;
		_this.carbons();
		_this.server.addHandler(_this.onMessage, Strophe.NS.client, "message", "chat", null, null);
		_this.server.addHandler(_this.onForwarded, Strophe.NS.forwarded, "message", "chat", null, null);
		_this.server.addHandler(_this.onServiceForwarded, Strophe.NS.forwarded, "message", "normal", null, null);
		_this.server.addHandler(_this.onNormal, null, "message", "normal", null, null);
		_this.server.addHandler(_this.onIQ, null, "iq", "get", null, null);
		rdChatHelper.getSupport({
			jid: api.jid
		});
		rdChatHelper.saveAccount({
			jid: api.jid
		  , password: api.password
		  , name: api.name
		  , email: api.email
		  , phone: api.phone
		});

		api.isConnected = true;
	};

	/**
	 * Nhận các tin nhắn gửi đến
	 */
	api.onMessage = function onMessage(data) {
		/**
		 * [$message description]
		 * jquery message
		 * @type {[type]}
		 */
		var $message = $(data);

		/**
		 * [$from description]
		 * JID nguoi gui
		 * @type {[type]}
		 */
	    var $from = $message.attr('from'),

	    /**
	     * [$to description]
	     * JID nguoi nhan
	     * @type {[type]}
	     */
	    $to = $message.attr('to'),

	    /**
	     * [$id description]
	     * Chat message id
	     * @type {[type]}
	     */
	    $id = $message.attr('id'),

	    /**
	     * [$type description]
	     * type message, loai message gui den
	     * @type {[type]}
	     */
	    $type = $message.attr('type'),

	    /**
	     * [$body description]
	     * Thong tin body message chat (chua thong tin message)
	     * @type {[type]}
	     */
	    $body = $message.find('body'),

	    /**
	     * [$fullname description]
	     * fullname
	     * @type {[type]}
	     */
	    $fullname = $message.find('fullname'),

	    $email = $message.find('email'),

	    $avatar = $message.find('avatar'),

	    /**
	     * [$status description]
	     * Trang thai message do ai gui (client)
	     * @type {[type]}
	     */
	    $status = $message.find('status');

	    $forwarded = $message.find('forwarded');

	    /**
	     * [from_bareJID description]
	     * Thong tin base JID Chat cua nguoi gui
	     * @type {[type]}
	     */
	    var from_bareJID = $from.split('@')[0];

	    if($forwarded.length > 0) {
	    	return true;
	    } else if($status.text() === "CF1E8C14E54505F60AA10CEB8D5D8AB3") {
	    	return true;
	    } else {
	    	var $bare_fromJID = Strophe.getBareJidFromJid($from);
	    	var $baseFromJID = $bare_fromJID.replace("@" + rdconfig.DOMAIN_CHAT, ""),
	    	messageJson = JSON.parse($body.text());
	    	if ( typeof messageJson.type != undefined && messageJson.type === "transfer" ) {
	    		var dataBody = messageJson.body,
	    			oSupport = messageJson.from,
	    			nSupport = messageJson.employ;
	    		var _da = {
							jid: rdlczb.jid.split("@chatzamba")[0],
							project: _project,
							code: rdChatHelper.getCodeTransferSupport(rdlczb.jid.split("@chatzamba")[0], _project),
							newSupport: nSupport
						};

	    		if ( rdChatBox.jid === oSupport ) {
	    			rdChatBox.jid = nSupport;
	    			
	    			rdChatHelper.ajax({
	    				url: "https://apichat.zamba.vn:9090/plugins/rdapi/v1/support/changedsupport",
						type: "POST",
						dataType: "json",
						contentType: "application/json; charset=UTF-8",
						data: _da,
						async: true,
						success: function success( done ) {rdChatBox.sendTransfer( dataBody );},
						error: function error( fail ) {}
	    			});
	    		}
	    	} else {
	    		if(rdChatBox.jid === $baseFromJID) {
		    		var i = {
			  			message: messageJson.msg,
			  			images: messageJson.images,
			  			id: $id
			  		}
			  		rdChatBox.receiveUI(i);
		    	}
	    	}
	    }
	
		/**
		 * Luon tra ve gia tri true.
		 */
		return true;
	};

	/**
	 * Nhận các tin nhắn mình gửi đi
	 */
	api.onForwarded = function onForwarded(data){
		/**
		 * [$this description]
		 * object lczb.
		 * @type {[type]}
		 */
		var $this = api,

		/**
		 * [$message description]
		 * message jquery
		 * 
		 */
	    $message = $( data );

	    /**
	     * [$forwarded description]
	     * Lay message forwarded (carbon message).
	     * Message phan hoi cua chinh minh.
	     * @type {[type]}
	     */
	    var $forwarded = $message.find( 'forwarded' );
	    var $messForward = $forwarded.find( 'message' );
	    var $typeForward = $forwarded.find( 'typeForward' );	

	    /**
	     * [$messageID description]
	     * message id chat
	     * @type {[type]}
	     */
	    var $messageID = $messForward.attr( "id" ),

	    /**
	     * [$toFullJID description]
	     * full jid chat (chat id) cua nguoi nhan
	     * @type {[type]}
	     */
	    $toFullJID = $messForward.attr( "to" ),

	    /**
	     * [$fromFullJID description]
	     * from jid full
	     * @type {[type]}
	     */
	    $fromFullJID = $messForward.attr( "from" ),

	    /**
	     * [$body description]
	     * body chat (message), chua thong tin message chat
	     * @type {[type]}
	     */
	    $body = $messForward.find( "body" );

	    /**
	     * [$status description]
	     * Status gui sang
	     * @type {[type]}
	     */
	    $status = $messForward.find( "status" );

	    /**
	     * [$toBaseJID description]
	     * JID chat co ban (ID chat co ban) cua nguoi nhan
	     * @type {[type]}
	     */
	    var $toBaseJID = Strophe.getBareJidFromJid( $toFullJID );

	    /**
	     * [$toIdJID description]
	     * JID chat cua nguoi nhan
	     * @type {[type]}
	     */
	    var $toIdJID = $toBaseJID.split( "@" )[0];

	    var messageJson = JSON.parse( $body.text() );

	    if ( $typeForward && $typeForward.text() === "transfer" ) {
	    	
	    } else {
	    	if(rdChatBox.jid === $toIdJID) {
	    		var i = {
		  			message: messageJson.msg,
		  			images: messageJson.images,
		  			id: $messageID
		  		}
		  		rdChatBox.sendUI(i);
	    	}
	    }

	    /**
	     * Luon tra ve gia tri true
	     */
	    return true;
	};

	api.saveAccount = function saveAccount(data) {
		var _this = this;
		_this.jid = data.jid;
		_this.password = data.password;
		_this.name = data.name;
		_this.email = data.email;
		_this.phone = data.phone;
	};

	api.sendSupport = function sendChat(data) {
		if (api.first_chat) {
			rdChatHelper.ajax({
				url: "https://apichat.zamba.vn:9090/plugins/mobileapi/v1/conversations/addInfoConversationSupport",
				type: "POST",
				dataType: "json",
				contentType: "application/json; charset=UTF-8",
				data: {
					browser: rdChatHelper.getBrowser(),
					fromJID: api.jid,
					near_time: Date.now(),
					os: rdChatHelper.getOperating(),
					project: "rento",
					title: document.title,
					toJID: data.jid,
					type: 1,
					url: document.location.href,
					wellcome: ""
				},
				async: true,
				success: function success( done ) {rdChatBox.sendTransfer( dataBody );},
				error: function error( fail ) {}
			});
		}
		api.first_chat = false;
		var message = data.message
		  , time = data.time
		  , images = data.images
		  , jid = data.jid
		  , iMess = data.id
		  , plus = undefined
		  , tEmail = data.tEmail
		  , tName = data.tName;

        if (typeof jid === 'string' && jid !== "") {
           if (jid.indexOf( "@" + rdconfig.DOMAIN_CHAT ) === -1 ) {
                jid += "@" + rdconfig.DOMAIN_CHAT;
           }
        } else {
        	return;
        }

        if((typeof message === "string" && message !== "") || (typeof images === "object" && Object.keys(images).length > 0)) {
        	var fromUserID = "";

        	var buildMessage = {
	            "toemail": tEmail === undefined ? "" : tEmail, 
	            "tousername": tName === undefined ? "" : tName, 
	            "tofid": jid, 
	            "fromemail": rdlczb.jid, 
	            "fromid": rdlczb.jid,
	            "msg": message,
	            "mesid": iMess,
	            "images": images === undefined ? "" : images,
	            "fromusername": fromUserID,
	            "fromname": rdlczb.name === null || rdlczb.name === undefined ? "" : rdlczb.name
	        };

            /**
             * [timestamp description]
             * timestamp he thong, lam id chat cua message
             * @type {[type]}
             */
            var timestamp = iMess,

            /**
             * [bare_jid description]
             * base JID chat cua nguoi nhan
             * @type {[type]}
             */
            bare_jid = jid;

            /**
             * [message description]
             * Build message chat
             * @type {[type]}
             */
            if(rdlczb.isSendWellcome) {
            	var _message = $msg({from: api.server.jid, to: bare_jid, type: "chat", id: timestamp})
                .c('body').t(JSON.stringify(buildMessage)).up()
                .c('fullname').t(api.name).up()
                .c('email').t(api.email).up()
                .c('avatar').t(api.avatar === undefined || api.avatar === null? "" : api.avatar).up()
                .c('project').t(rdpconfig.PROJECT).up()
                .c('info').t(JSON.stringify(rdChatHelper.getInfo())).up()
                .c('status').t('434990C8A25D2BE94863561AE98BD682').up()
                .c("active", {xmlns: Strophe.NS.chatstates});
            } else {
            	var _message = $msg({from: api.server.jid, to: bare_jid, type: "chat", id: timestamp})
                .c('body').t(JSON.stringify(buildMessage)).up()
                .c('fullname').t(api.name).up()
                .c('email').t(api.email).up()
                .c('avatar').t(api.avatar === undefined || api.avatar === null? "" : api.avatar).up()
                .c('project').t(rdpconfig.PROJECT).up()
                .c('info').t(JSON.stringify(rdChatHelper.getInfo())).up()
                .c('status').t('434990C8A25D2BE94863561AE98BD682').up()
                .c('wellcome').t(rdlczb.textwellcome).up()
                .c("active", {xmlns: Strophe.NS.chatstates});
            }
            api.server.send(_message);

            /**
             * [if description]
             * Send message chat forward (Carbon message)
             * @param  {[type]} $type [description]
             * @return {[type]}       [description]
             */
            if (rdpconfig.IS_FORWARD && typeof rdlczb.jid === 'string' && rdlczb.jid.length > 0) {
            	var tJID = rdlczb.jid;
            	if(api.jid.indexOf("@") === -1) {
            		api.jid += "@" + rdconfig.DOMAIN_CHAT;
            	}
                var forwarded = $msg({ to: rdlczb.jid, type: "chat", id: timestamp})
                    .c("forwarded", {xmlns: Strophe.NS.forwarded})
                    .c("delay", {xmns: Strophe.NS.DELAY, stamp: timestamp}).up()
                    .cnode(_message.tree());
                rdlczb.server.send(forwarded);
            }
            api.isSendWellcome = true;
            // rdlczb.playAudioSendMessage();
        }
	};

	api.messageTransferSupport = function messageTransferSupport (toJID, textMessage, typeChat, idMess, toEmail, toName, images) {
		$type = typeChat;
        if (typeof toJID === 'string' && toJID != undefined && toJID != null && typeof textMessage != 'undefined' && $type === "chat") {
           if (toJID.indexOf( "@" + "chatzamba" ) === -1 ) {
                toJID += "@" + "chatzamba";
           }
        }
        if ( toJID && (textMessage || images) ) {
        	var fromUserID = "";
        	var buildMessage = {
	            "toemail": toEmail === undefined ? "" : toEmail, 
	            "tousername": toName === undefined ? "" : toName, 
	            "tofid": toJID, 
	            "fromemail": api.jid, 
	            "fromid": api.jid,
	            "msg": textMessage,
	            "mesid": idMess,
	            "images": images === undefined ? "" : images,
	            "fromusername": fromUserID,
	            "fromname": api.name === null || api.name === undefined ? "" : api.name,
	            "transfer": "true"
	        };

            var timestamp = idMess,
            	bare_jid = toJID;
            var message = $msg({from: api.server.jid, to: bare_jid, type: $type, id: timestamp})
                .c('body').t(JSON.stringify(buildMessage)).up()
                .c('fullname').t(api.name).up()
                .c('email').t(api.jid).up()
                .c('avatar').t(api.avatar === undefined || api.avatar === null? "http://chat.zambam.vn" : api.avatar).up()
                .c('info').t(JSON.stringify(rdChatHelper.getInfo())).up()
                .c('status').t('434990C8A25D2BE94863561AE98BD682').up()
                .c('project').t(_project).up()                
                .c('active', {xmlns: Strophe.NS.CHATSTATES});
            api.server.send(message);
            
            if ($type === "chat") {
                if (rdpconfig.IS_FORWARD && typeof api.jid != 'undefined') {
                    var forwarded = $msg({ to: api.jid, type: $type, id: timestamp})
                        .c("forwarded", {xmlns: Strophe.NS.forwarded})
                        .c('typeForward').t("transfer").up()
                        .c("delay", {xmns: Strophe.NS.delay, stamp: timestamp}).up()
                        .cnode(message.tree());
                    api.server.send(forwarded);
                }
            }
        } else {
        	console.log("Thiếu JID hoặc message");
        }
	};

	return api;
}));