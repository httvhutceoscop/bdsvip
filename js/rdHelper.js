(function(root, factory) {
	if(typeof define === "function" && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === "object") {
		module.exports = factory(require('jquery'));
	} else {
		root.rdChatHelper = factory(root.jQuery);
	}
}(this, function(jquery) {
	var api = {};

	api.join = function join(s) {
		var c = [s];
		return function extend(a) {
			if(a != null && "string" === typeof a) {
				c.push(a);
				return extend;
			}
			return c.join("");
		}
	};

	api.sort = function sort(data) {
		var key = data.key
		  , lData = data.lData
		  , type = data.type;

		_lData = lData.sort(function(x, y) {
			if(typeof type === "string" && type.toLowerCase() === "desc") {
				return y[key] - x[key];
			} else {
				return x[key] - y[key];
			}
		});	

		return _lData;
	};

	/**
	 * Làm đẹp chuỗi string, loại bỏ các khoảng trống ở đầu
	 */
	api.bText = function bText(s) {
		var _p = s.replace(/^[\s]+/g, "");
		return _p;
	};

	api.ajax = function ajax(request) {
		// Đường dẫn api đến server
		var url = request.url

		// Dữ liệu gửi lên server
		  , data = request.data

		// Hàm xử lý response trả về thành công
		  , success = request.success

		// Hàm xử lý response trả về lỗi
		  , error = request.error

		// Kiểu gọi api
		  , method = request.type

		// Kiểu dữ liệu truyền lên
		  , dataType = request.dataType

		// Header Content type data
		  , contentType = request.contentType

		// Đồng bộ service
		  , async = request.async;

		if ( dataType === "text" && typeof data === "object" ) {
			var $temp = "",
				first = false;

			for ( var i in data ) {
				if ( !first ) {
					first = true;
				} else {
					$temp += "&";
				}
				$temp += i + "=" + data[i];
			}
			data = $temp;
		} else if ( dataType === "json" ) {
			data = JSON.stringify( data );
		}

		if ( url === undefined ) {
			console.log( "Bạn chưa nhập url" );
		} else {
			var xmlhttp;
			if ( XMLHttpRequest ) {
				xmlhttp = new XMLHttpRequest();

				if ( "withCredentials" in xmlhttp ) {
					if ( method === "GET" ) {
						url = url + "?" + data;
					}

					xmlhttp.open( method, url, async );

					if ( contentType !== undefined ) {
						xmlhttp.setRequestHeader( "Content-type", contentType );
					}

					xmlhttp.onreadystatechange = function () {
						if ( xmlhttp.readyState === 4 ) {
							if ( xmlhttp.status >= 200 && xmlhttp.status < 400 ) {
								var response = xmlhttp.responseText;
								if ( xmlhttp.getAllResponseHeaders().indexOf( "application/json" ) != -1 ) {
									response = JSON.parse( response );
								}
								success( response );
							} else {
								error( xmlhttp.responseText );
							}
						}
					};

					if ( method.toLowerCase() === "post" ) {
						xmlhttp.send( data );
					} else {
						xmlhttp.send();
					}
				}
			} else if ( XDomainRequest ) {
				xmlhttp = new XDomainRequest();
				xmlhttp.open( method, url );
				xmlhttp.onerror = error( xmlhttp.responseText );
				xmlhttp.onload = function () {
					success( xmlhttp.responseText );
				}

				xmlhttp.send( data );
			} else {
				console.log( "Không hỗ trợ gọi api" );
			}
		}
	};

	api.createAccount = function createAccount() {
		var _name = "Khách hàng",
		_bName = rdChatHelper.bText(_name),
		rdid = undefined, _data, _id;

		try {
			rdid = $.cookie("rdid");
		} catch (e) {}

		if(rdid === undefined) {
			_id = Date.now();
			_data = {
				email: "",
				name: _bName,
				password: "",
				project: rdpconfig.PROJECT,
				token: MD5.hexdigest(_id + "chatzamba"),
				type: 0,
				username: _id
			};
		} else {
			_id = Date.now();
			_data = {
				email: "",
				name: _bName,
				password: "",
				project: rdpconfig.PROJECT,
				token: MD5.hexdigest(_id + "chatzamba"),
				type: 0,
				username: _id,
				properties: {
					property: [
						{
							"@key": "rdid",
							"@value": rdid
						}
					]
				}
			};
		}

		if(_data !== undefined) {
			api.ajax({
				url: rdconfig.URL_REGIS,
				type: "POST",
				dataType: "json",
				data: _data,
				contentType: "application/json; charset=utf-8", 	
				async: true,
				success: function (done) {
					if (done.status === "1") {
						rdlczb.jid = done.data.chat_id;
						rdlczb.password = done.data.token;
						rdlczb.name = _bName;
						rdlczb.email = done.data.email;
						rdChatBox.showLogin();
						if(api.loadToogle() === "down") {
							rdChatBox.showDown();	
						} else {
							rdChatBox.showUp();	
						}
					}
				},

				error: function (fail) {console.log("Lỗi gọi api đăng ký");}	
			});
		}
	}

	api.callTrigger = function callTrigger(data) {
		var base_jid = data.split("@")[0];
		var _data = "url=" + document.URL + "&title=" + document.title + "&reference=" + document.reference + "&project=" + _project + "&chatid=" + rdlczb.jid;
		api.ajax({
			url: "https://apichat.zamba.vn:8080/trigger/get-trigger/",
			type: "GET",
			dataType: "json",
			async: true,
			data: _data,
			success: function done(e) {
				if(e.status === 1) {
					rdChatBox.addTrigger(e);
				}
			},
			error: function fail(e) {}
		});
	}

	api.loginAnonymous = function loginAnonymous() {
		console.log("dis");
		var _name = "Khách hàng",
		_bName = rdChatHelper.bText(_name),
		rdid = undefined, _data, _id;

		try {
			rdid = $.cookie("rdid");
		} catch (e) {}

		if(rdid === undefined) {
			_id = Date.now();
			_data = {
				email: "",
				name: _bName,
				password: "",
				project: rdpconfig.PROJECT,
				token: MD5.hexdigest(_id + "chatzamba"),
				type: 0,
				username: _id
			};
		} else {
			_id = Date.now();
			_data = {
				email: "",
				name: _bName,
				password: "",
				project: rdpconfig.PROJECT,
				token: MD5.hexdigest(_id + "chatzamba"),
				type: 0,
				username: _id,
				properties: {
					property: [
						{
							"@key": "rdid",
							"@value": rdid
						}
					]
				}
			};
		}

		if(_data !== undefined) {
			api.ajax({
				url: rdconfig.URL_REGIS,
				type: "POST",
				dataType: "json",
				data: _data,
				contentType: "application/json; charset=utf-8",
				async: true,
				success: function (done) {
					if (done.status === "1") {
						rdlczb.jid = done.data.chat_id;
						rdlczb.password = done.data.token;
						rdlczb.name = _bName;
						rdlczb.email = done.data.email;
						rdlczb.connect({
							jid: rdlczb.jid, 
							password: rdlczb.password
						});
					}
				},

				error: function (fail) {console.log("Lỗi gọi api đăng ký");}	
			});
		}
	};

	api.getCodeSupport = function getCodeSupport(data) {
		var jid = data.jid
		  , project = data.project;
		
		return MD5.hexdigest(jid + project);
	};

	api.getSupport = function getSupport(data) {
		var _jid = data.jid;

		api.ajax({
			url: rdconfig.URL_GET_SUPPORT,
			type: "POST",
			dataType: "json",
			contentType: "application/json; charset=UTF-8",
			data: {
				jid: _jid,
				project: rdpconfig.PROJECT,
				code: api.getCodeSupport({
					jid: _jid, 
					project: rdpconfig.PROJECT
				})
			},
			async: true,
			success: function (done) {
				var status = done.status;
				if(status === 1) {
					rdChatBox.jid = done.data.jid;
					rdChatBox.email = done.data.email;
					rdChatBox.avatar = done.data.avatar;
					rdChatBox.name = done.data.name;
					rdChatOption.BOX_AVATAR = "http://chat.zamba.vn/avatar.php?size=size02&file=" + rdChatBox.avatar;
					if(api.loadToogle() === "down") {
						rdChatBox.showDown();	
					} else {
						rdChatBox.showUp();	
					}
					rdChatBox.changeInfo();

					api.getChatHistories({
						chatID: rdChatBox.jid
					  , page: 0
					  , success: function success(done) {rdChatBox.handleHistories(done);}
					  , error: function error(fail) {}
					});

					rq_phone = rdlczb.phone === undefined? "": rdlczb.phone;
					rq_email = rdlczb.email === undefined? "": rdlczb.email;
					api.ajax({
						url: "https://log.zamba.vn/_chat_session.gif",
						type: "GET",
						dataType: "text",
						contentType: "application/x-www-form-urlencoded; charset=UTF-8",
						// contentType: "application/json; charset=UTF-8",
						data: 'data=' + encodeURIComponent('{"chat_id":"'+rdlczb.jid+'","url":"'+document.URL+'","title":"'+document.title+'","referrer_visit":"'+document.referrer+'","os":"'+api.getOperating()+'","browser":"'+api.getBrowser()+'","type":"1", "project":"'+_project+'", "session_id": "'+rdlczb.session+'", "name": "' + rdlczb.name + '", "support_id": "' +rdChatBox.jid+ '", "email": "'+rq_email+'", "phone": "'+rq_phone+'" }'),
						async: true,
						success: function done() {}, 
						error: function fail() {}
					});
				}
			},

			error: function ( fail ) {}
		});
	};

	api.saveAccount = function saveAccount(data) {
		var jid = data.jid
		  , password = data.password
		  , name = data.name
		  , email = data.email
		  , phone = data.phone;

		if(typeof Storage !== "undefined") {
			localStorage.setItem("__lczb_jid_", jid === undefined ? "" : jid);
			localStorage.setItem("__lczb_password_", password === undefined ? "" : password);
			localStorage.setItem("__lczb_name_", name === undefined ? "" : name);
			localStorage.setItem("__lczb_email_", email === undefined ? "" : email);
			localStorage.setItem("__lczb_phone_", phone === undefined ? "" : phone);
		} else {
			console.log("Không hỗ trợ lưu tài khoản");
		}
	};

	api.loadAccount = function loadAccount() {
		var _data = undefined;
		if(typeof Storage !== "undefined") {
			var jid = localStorage.getItem("__lczb_jid_")
			  , password = localStorage.getItem("__lczb_password_")
			  , name = localStorage.getItem("__lczb_name_")
			  , email = localStorage.getItem("__lczb_email_")
			  , phone = localStorage.getItem("__lczb_phone_");

			_data = {
				jid: jid,
				password: password,
				name: name,
				email: email,
				phone: phone
			}

			if(jid === null || password === null || name === null) {
				_data = undefined;
			}
		}
		return _data;
	};

	api.getInfo = function getInfo() {
		return {
			localtion: document.referrer ? document.referrer : document.URL,
			user_agent: "",
			app_name: navigator.platform ? navigator.platform : "",
			url: document.URL ? document.URL : "",
			title: document.title ? document.title : "",
			ip: ""
		}
	};

	api.getChatHistories = function getChatHistories(data) {
		var _this = api;
		if(typeof data === "object") {
			var jid = data.chatID
			  , page = data.page
			  , _success = data.success
			  , _error = data.error
			  , id = rdlczb.jid;

			if ( typeof jid === "string" &&  jid.indexOf("@" + rdconfig.DOMAIN_CHAT) === -1 && jid != "" ) {
				jid += "@" +  rdconfig.DOMAIN_CHAT;
			} else if (typeof jid === "string" &&  jid.indexOf("@" + rdconfig.DOMAIN_CHAT) !== -1 && jid != "") {
				jid = jid;
			} else {
				jid = undefined;
			}

			if ( typeof id === "string" && id.indexOf("@" + rdconfig.DOMAIN_CHAT) === -1 && id != "" ) {
				id += "@" + rdconfig.DOMAIN_CHAT;
			} else if(typeof id === "string" && id.indexOf("@" + rdconfig.DOMAIN_CHAT) !== 1 && id != "") {
				id = id;
			} else {
				id = undefined;
			}
			
			if ( jid && id ) {
				api.ajax({
					url: rdconfig.URL_GET_HISTORIES,
					type: "POST",
					dataType: "json",
					contentType: "application/json; charset=UTF-8",
					data: {
						fromChatID: id,
						toChatID: jid,
						fromTime: rdconfig.START_TIME,
						pages: data.page,
						limit: rdconfig.HISTORIES_LIMIT,
						project: rdpconfig.PROJECT
					},
					success: function success ( done ) {
						var status = done.status
						  , msg = done.msg;

						if(typeof status !== "number") {
							status = parseInt(status);
						}

						if(status === 1) {
							var _data = done.data
							  , lData = [];

							for(var i in _data) {
								var temp = _data[i];
								var jb = undefined;

								if(Object.keys(temp).indexOf("bodyMsg") !== -1) {
									jb = JSON.parse(temp.bodyMsg);
									// jb = jquery.parseJSON(temp.bodyMsg);
								}
								
								if(jb !== undefined) {
									var message = jb.msg
									  , images = jb.images
									  , mid = jb.mesid
									  , wellcome = null
									  , _plus = Object.keys(jb).indexOf("plus") === -1 ? {status : 0} : jb.plus;
									if(typeof jb.images !== "object") {
										images = {};
									}
									if(typeof temp.wellcome === "string" && temp.wellcome !== "") {
										wellcome = temp.wellcome;
									}
									var _dw = {
										fromChatID: temp.fromChatID,
										toChatID: temp.toChatID,
										fromResource: temp.fromChatIdResource,
										toResource: temp.toChatIdResource,
										time: temp.sentDate,
										message: message,
										images: images,
										mid: mid,
										plus: typeof _plus === "object" ? _plus : {status: 0}
									};
									if(wellcome !== null) {
										_dw.wellcome = wellcome;
									}
									if(Object.keys(jb).indexOf("transfer") === -1) {
										lData.push(_dw);
									}
								}
							}

							if(lData.length > 0) {
								var _bd = _this.sort({
									key: "time",
									lData: lData,								
								});	
							} else {
								_bd = lData;
							}
							
							if(typeof success === "function") {
								data.success({
									status: 1,
									msg: "Lịch sử chat",
									data: _bd
								});
							}
						} else {
							if(typeof error === "function") {
								data.error({
									status: 0,
									msg: "Không có lịch sử chat"
								})
							}
						}
					},
					error: function error ( done ) {
						if(typeof error === "function") {
							_error({
								status: 0,
								msg: "Không thể load được lịch sử chat"
							})
						}
					}
				});	
			} else {
				console.log("Không thể lấy lịch sử chat, truyền thiếu dữ liệu");
			}
		}
	};

	api.getPresentStatus = function getPresentStatus(_data) {
		var _l = [];
		_l.push(rdChatBox.jid);

		var $data = {
			msg: "Check Status",
			status: 1,
			chatID: _l
		};

		if(_l.length > 0) {
			api.ajax({
				url: rdconfig.URL_GET_STATUS,
				type: 'POST',
				dataType: 'json',
				data: $data,
				contentType: "application/json; charset=utf-8",
				async: true,
				success: function success( done ) {
					if (done.status === "0") {
						rdChatBox.showStatus("offline");
						if(typeof _data === "object") {
							_data({
								status: "offline"
							});	
						}
					} else {
						var $chatIDs = done.data;
						for (var i in $chatIDs) {
							var jid = $chatIDs[i].jid;
							if(jid === rdChatBox.jid) {
								if($chatIDs[i].status === "1") {
									rdChatBox.showStatus("online");
									if(typeof _data === "function") {
										_data({
											status: "online"
										});	
									}
								} else {
									rdChatBox.showStatus("offline");
									if(typeof _data === "function") {
										_data({
											status: "offline"
										});		
									}
								}
							}
						}
					} 
				},
				error: function error( fail ) {
					rdChatBox.showStatus("offline");
					_data({
						status: "offline"
					});	
				}
			});
		}

		setTimeout(function () {
			api.getPresentStatus();
		}, 60000);	
	};

	api.changeInfomation = function changeInfomation(_data) {

	}

	api.isPhone = function isPhone(s) {
		var _p = s.replace(/\s+/g, "");
		if(isNaN(_p) === true || _p.length < 10 || _p.length > 13) {
			return false;
		}
		return true;
	};

	api.isEmail = function isEmail(s) {
		var _p = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
		return _p.test(s);
	};

	api.saveToogle = function saveToogle(data) {
		localStorage.setItem("__lczb_toggle_support_", data);
	};

	api.loadToogle = function loadToogle() {
		return localStorage.getItem("__lczb_toggle_support_");	
	}

	api.handleImages = {
		URI: function URI(data) {
			var _byte, _mine, _new, _i, _data = data;
			if(_data.split(",")[0].indexOf("base64") > 0) {
				_byte = atob(_data.split(",")[1]);
			} else {
				_byte = unescape(_data.split(",")[1]);
			}
			_mine = _data.split(",")[0].split(":")[1].split(";")[0];
			_new = new Uint8Array(_byte.length);
			for(_i = 0; _i < _byte.length; _i++) {
				_new[_i] = _byte.charCodeAt(_i);
			}

			return new Blob([_new], {type: _mine});
		},
		handle: function handle(data){
			var $elementImg, $canvas, $context, $width, $height,
			$maxWidth, $maxHeight, $dataURL, $fromData, $image, 
			$reader, $this = api;

			$maxWidth = 800;
			$maxHeight = 800;
			$elementImg = document.createElement( "img" );

			$elementImg.onload = function onload ( loading ) {
				$canvas = document.createElement( "canvas" );
				$context = $canvas.getContext( "2d" );
				$width = $elementImg.width;
				$height = $elementImg.height;

				if ( $width > $height ) {
					if ( $width > $maxWidth ) {
						$height = $maxWidth / $width;
						$width = $maxWidth;
					}
				} else {
					if ( $height > $maxHeight ) {
						$width = $maxHeight / $height;
						$height = $maxHeight;
					}
				}

				$canvas.width = $width;
				$canvas.height = $height;
				$context.drawImage( $elementImg, 0, 0, $width, $height );
				$dataURL = $canvas.toDataURL( "image/jpg" );
				$fromData = new FormData();
				$image = $this.handleImages.URI($dataURL);
				$fromData.append( "zlc_file", $image );
				$fromData.append( "token", rdpconfig.PROJECT );

				api.ajax({ 
					url: data.url,
					data: $fromData,
					type: data.type,
					success: data.success,
					error: data.error,
					async: data.async
				});
			};

			$reader = new FileReader();
			$reader.readAsDataURL( data.data );
			$reader.onload = function onload ( event ) {
				$elementImg.src = event.target.result;
			};
		},
	};

	api.getOperating = function getOperating() {
		var unknown = "-",

		// UserAgent của trình duyệt
			nAgt = navigator.userAgent,

		// Version trình duyệt
			nVer = navigator.appVersion;

		var os = unknown;

		// Các hệ điều hành
		var ClientStrings = [
			{s: "Windows 10", r:/(Windows 10.0|Windows NT 10.0)/},
			{s: "Windows 8.1", r:/(Windows 8.1|Windows NT 6.3)/},
			{s: "Windows 8", r:/(Windows 8|Windows NT 6.2)/},
			{s: "Windows 7", r:/(Windows 7|Windows NT 6.1)/},
			{s: "Windows Vista", r:/Windows NT 6.0/},
			{s: "Windows Server 2003", r:/Windows NT 5.2/},
			{s: "Windows XP", r:/(Windows NT 5.1|Windows XP)/},
			{s: "Windows 2000", r:/(Windows NT 5.0|Windows 2000)/},
			{s: "Windows ME", r:/(Win 9x 4.90|Windows ME)/},
			{s: "Windows 98", r:/(Windows 98|Win98)/},
			{s: "Windows 95", r:/(Windows 95|Win95|Windows_95)/},
			{s: "Windows NT 4.0", r:/(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
			{s: "Windows CE", r:/Windows CE/},
			{s: "Windows 3.11", r:/Win16/},
			{s: "Android", r:/Android/},
			{s: "Open BSD", r:/OpenBSD/},
			{s: "Sun OS", r:/SunOS/},
			{s: "Linux", r:/(Linux|X11)/},
			{s: "iOS", r:/(iPhone|iPad|iPod)/},
			{s: "Mac OS X", r:/Mac OS X/},
			{s: "Mac OS", r:/MacPPC|MacIntel|Mac_PowerPC|Macintosh/},
			{s: "QNX", r:/QNX/},
			{s: "UNIX", r:/UNIX/},
			{s: "BeOS", r:/BeOS/},
			{s: "OS/2", r:/OS\/2/},
			{s: "Search Bot", r:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}];
		
		for ( var id in ClientStrings ) {
			var cs = ClientStrings[id];
			if ( cs.r.test(nAgt) ) {
				os = cs.s;
				break;
			}
		}

		var osVersion = unknown;
		if ( /Windows/.test( os ) ) {
			osVersion = /Windows (.*)/.exec( os )[1];
			os = "Windows";
		}

		switch ( os ) {
			case "Mac OS X":
				osVersion = /Mac OS X (10[\.\_\d]+)/.exec( nAgt )[1];
				break;

			case "Android":
				osVersion = /Android ([\.\_\d]+)/.exec( nAgt )[1];
				break;

			case "iOS":
				osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec( nVer );
				osVersion = osVersion[1] + "." + osVersion[2] + "." + ( osVersion[3] | 0 );
				break;
		}

		return os + " - v." + osVersion;
	};

	api.getBrowser = function getBrowser() {
		// AppVersion của trình duyệt
		var nVer = navigator.appVersion,

		// UserAgent của trình duyệt
			nAgt = navigator.userAgent,

		// Tên trình duyệt
			browserName = navigator.appName,

		// Version của trình duyệt
			fullVersion = "" + parseFloat( navigator.appVersion ),

		// Major version
			majorVersion = parseInt( navigator.appVersion, 10 ),

		// Các thông số khác
			nameOffset, verOffset, ix;

		// Opera
		if ( ( verOffset = nAgt.indexOf( "Opera" ) ) != -1 ) {
			browserName = "Opera";
			fullVersion = nAgt.substring( verOffset + 6 );
			if ( ( verOffset = nAgt.indexOf( "Version" ) ) != -1 ) {
				fullVersion = nAgt.substring( verOffset + 8 );
			}

		// MSIE
		} else if ( ( verOffset = nAgt.indexOf( "MSIE" ) ) != -1 ) {
			browserName = "Microsoft Internet Explorer";
			fullVersion = nAgt.substring( verOffset + 5 );

		// Chrome
		} else if ( ( verOffset = nAgt.indexOf( "Chrome" ) ) != -1 ) {
			browserName = "Chrome";
			fullVersion = nAgt.substring( verOffset + 7 );

		// Safari
		} else if ( ( verOffset = nAgt.indexOf( "Safari" ) ) != -1 ) {
			browserName = "Safari";
			fullVersion = nAgt.substring( verOffset + 7 );
			if ( ( verOffset = nAgt.indexOf( "Version" ) ) != -1 ) {
				fullVersion = nAgt.substring( verOffset + 8 );
			}

		// Firefox
		} else if ( ( verOffset = nAgt.indexOf( "Firefox" ) ) != -1 ) {
			browserName = "Firefox";
			fullVersion = nAgt.substring( verOffset + 8 );

		// Các browser khác
		} else if ( ( nameOffset = nAgt.lastIndexOf( " " ) + 1) < ( verOffset = nAgt.lastIndexOf( "/" ) ) ) {
			browserName = nAgt.substring( nameOffset, verOffset );
			fullVersion = nAgt.substring( verOffset + 1 );
			if ( browserName.toLowerCase() === browserName.toUpperCase() ) {
				browserName = navigator.appName;
			}
		}

		/**
		 * Trim the fullversion string at semicolon/space if present
		 */
		if ( ( ix = fullVersion.indexOf( ";" ) ) != -1 ) {
			fullVersion = fullVersion.substring( 0, ix );
		}

		if ( ( ix = fullVersion.indexOf( " " ) ) != -1 ) {
			fullVersion = fullVersion.substring( 0, ix );
		}

		majorVersion = parseInt( "" + fullVersion, 10 );
		if ( isNaN( majorVersion ) ) {
			fullVersion = "" + parseFloat( navigator.appVersion );
			majorVersion = parseInt( navigator.appVersion, 10 );
		}

		return browserName + " - v." + fullVersion;
	};

	api.save_trigger = function save_trigger() {
		$.cookie("rd_trigger_chat", "1", {path: "/"});
	};

	api.load_trigger = function load_trigger() {
		var _c = $.cookie("rd_trigger_chat");
		if(typeof _c === "string" && _c !== "") {
			return true;
		} else {
			$.removeCookie("rd_trigger_chat");
			return false;
		}
	};

	api.encodeHTMLEntities = function encodeHTMLEntities(text) {
		var entities = [
			['\'', 'apos'],
			['&', 'amp'],
			['<', 'lt'],
			['>', 'gt',]
		];

		for (var i = 0, max = entities.length; i < max; ++i) 
			text = text.replace(new RegExp(entities[i][0], 'g'), '&'+entities[i][1]+';');
		return text;
	};

	api.makeLink = function makeLink(text) {
		var urlRegex = /(https?:\/\/[^\s]+)/g;
		return text.replace(urlRegex, function(url) {
			return '<a href="' + url + '" target="_blank">' + url + '</a>';
		})
	};

	api.getCodeTransferSupport = function getCodeTransferSupport(jid, project) {
		return MD5.hexdigest(jid + project);
	};

	return api;
}));