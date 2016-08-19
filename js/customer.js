shop.customer = {
	logout:function(){
		shop.ajax_popup('act=customer&code=logout',"GET",{},
		function (j) {
			shop.reload();
		});
		return false;
	},
	password:{
		resendPassword:function(email){
			shop.show_overlay_popup('pop-resend-password', '',
			shop.customer.password.theme.resendPassword('pop-resend-password', email),
			{
				background: {'background-color' : 'transparent'},
				border: {
					'background-color' : 'transparent',
					'padding' : '0px'
				},
				title: {'display' : 'none'},
				content: {
					'padding' : '0px',
					'width' : shop.is_ie6() ? '325px' : '315px'
				},
				release:function(){
					shop.enter('#forgot_email', shop.customer.password.submit);
				}
			});
		},
		submit:function(){
			var email = shop.util_trim(jQuery('#forgot_email').val());
			if(email == ''){
				shop.error.set('#forgot_email', 'Chưa nhập email', 230, '.forgot_pasword');
				return false;
			}
			else if(!shop.is_email(email)){
				shop.error.set('#forgot_email', 'Email không hợp lệ', 230, '.forgot_pasword');
				return false;
			}
			else{
				shop.error.close('#forgot_email', '.forgot_pasword');
			}
			shop.ajax_popup('act=customer&code=resend-pass',"GET",{email: email},
			function (j) {
				if (j.err == 0 && j.msg == 'success') {
					shop.hide_overlay_popup('pop-resend-password');
					alert("Thông tin hỗ trợ đã được gửi vào "+email+"\nQuý khách vui lòng làm theo hướng dẫn trong email");
				}else{
					if(j.msg == 'no_active'){
						j.msg = 'Email chưa kích hoạt. Vui lòng kiểm tra hòm thư hoặc <a href="javascript:void(0)" onclick="shop.customer.register.sendActiveEmail(\''+email+'\',0,function(){shop.hide_overlay_popup(\'pop-resend-password\')})">nhấn vào đây</a> để nhận lại email kích hoạt';
					}
					shop.error.set('#forgot_email', j.msg, 230, '.forgot_pasword');
				}
			});
			return true;
		},
		submitFormResendPassword: function(frm){
			if(frm.pass.value == ''){
				frm.pass.focus();
				alert('Chưa nhập mật khẩu');
				return false;
			}else if(frm.pass.value.length < 6){
				frm.pass.focus();
				alert('Mật khẩu tối thiểu phải có 6 kí tự');
				return false;
			}else if(frm.pass1.value == ''){
				frm.pass1.focus();
				alert('Chưa nhập lại mật khẩu');
				return false;
			}else if(frm.pass1.value != frm.pass.value){
				frm.pass1.focus();
				alert('Nhập lại mật khẩu không chính xác');
				return false;
			}
			frm.submit();
			return true;
		},
		theme:{
			resendPassword:function(id, email){
				return shop.popupSite(id, 'Quên mật khẩu', shop.join
					('<div class="content forgot_pasword" style="padding:1px 20px 10px">')
						('<div id="cError"></div>')
						('<div class="label mTop10">Email đã đăng kí:</div>')
						('<div class="input-txt mTop5 reg_collapse" style="width:260px">')
							('<input type="text" id="forgot_email" name="email" class="txt" style="width:250px" value="'+(email?email:'')+'" />')
						('</div>')
						('<div class="f11 mTop5">Vui lòng nhập đúng email đã đăng kí để nhận thông tin hỗ trợ lấy lại mật khẩu từ '+SITE_NAME+'</div>')
						('<div class="mTop10">')
							('<div>')
								('<a id="fl" class="rt_regiter_Cancel mLeft10" onclick="shop.hide_overlay_popup(\''+id+'\')" href="javascript:void(0)">Hủy bỏ</a>')
								('<a id="fr" class="rt_regiter_button" onclick="shop.customer.password.submit()" href="javascript:void(0)">Gửi đi</a>')
								('<div class="c"></div>')
							('</div>')
						('</div>')
					('</div>')()
				);
			}
		}
	},
	active:{
		send:function(email){
			shop.show_overlay_popup('pop-resend-active', '',
			shop.customer.active.theme.sendActive('pop-resend-active', email),
			{
				background: {'background-color' : 'transparent'},
				border: {
					'background-color' : 'transparent',
					'padding' : '0px'
				},
				title: {'display' : 'none'},
				content: {
					'padding' : '0px',
					'width' : shop.is_ie6() ? '325px' : '315px'
				},
				release:function(){
					shop.enter('#active_email', shop.customer.active.submit);
				}
			});
		},
		submit:function(){
			var email = shop.util_trim(jQuery('#active_email').val());
			if(email == ''){
				shop.error.set('#active_email', 'Chưa nhập email', 230, '.active_email');
				return false;
			}else if(!shop.is_email(email)){
				shop.error.set('#active_email', 'Email không hợp lệ', 230, '.active_email');
				return false;
			}else{
				shop.error.close('#active_email', '.active_email');
			}
			shop.ajax_popup('act=customer&code=resend-active',"GET",{email: email},
			function (j) {
				if (j.err == 0 && j.msg == 'success') {
					shop.hide_overlay_popup('pop-resend-active');
					alert("Thông tin kích hoạt đã được gửi vào "+email+"\nQuý khách vui lòng làm theo hướng dẫn trong email");
				}else{
					shop.error.set('#active_email', j.msg, 230, '.active_email');
				}
			});
			return true;
		},
		theme:{
			sendActive:function(id, email){
				return shop.popupSite(id, 'Kích hoạt tài khoản', shop.join
					('<div class="content active_email" style="padding:1px 20px 10px">')
						('<div id="cError"></div>')
						('<div class="label mTop10">Email của Quý khách:</div>')
						('<div class="input-txt reg_collapse mTop5" style="width:260px">')
							('<input type="text" id="active_email" name="email" class="txt" style="width:250px" value="'+(email?email:'')+'" />')
						('</div>')
						('<div class="f11 mTop5">Vui lòng nhập đúng email để nhận được thông tin kích hoạt tài khoản</div>')
						('<div class="mTop10">')
							('<div style="width:165px;margin:0 auto">')
								('<a id="fr" class="btGray mLeft10" onclick="shop.hide_overlay_popup(\''+id+'\')" href="javascript:void(0)">Hủy bỏ</a>')
								('<a id="fr" class="btBlack" onclick="shop.customer.active.submit()" href="javascript:void(0)">Nhận kích hoạt</a>')
								('<div class="c"></div>')
							('</div>')
						('</div>')
					('</div>')()
				);
			}
		}
	},
	login : {
		conf:{
			cb: null
		},
		show:function(){
			if(IS_CUSTOMER_LOGIN){
				alert('Quý khách đã đăng nhập thành công!');
			}else{
				shop.show_overlay_popup('pop-login', 'Đăng nhập',
				shop.customer.login.theme.form('pop-login', 'Đăng nhập'),
				{
					background: {
						'background-color' : 'transparent'
					},
					border: {
						'background-color' : 'transparent',
						'padding' : '0px'
					},
					title: {
						'display' : 'none'
					},
					content: {
						'padding' : '0px',
						'width' : '800px'
					}
				});
			}
		},
		cancel:function(){shop.hide_all_popup()},
		valid:function(id_email, id_pass , popup){
			var jemail = '#'+id_email;
			var jpass = '#'+id_pass;
			var email = shop.util_trim(jQuery(jemail).val());
			
			if(email == '' || email == 'email đăng nhập'){
				var $msg = 'Chưa nhập email!';
				if(!popup){
					shop.show_popup_message($msg, "Đăng nhập thất bại", -1);
				}
				else{
					shop.error.set(jemail, $msg, 400, '.login_form');
				}
				return false;
			}else if(!shop.is_email(email)){
				var $msg = 'Email không hợp lệ!';
				if(!popup){
					shop.show_popup_message($msg, "Đăng nhập thất bại", -1);
				}
				else{
					shop.error.set(jemail, $msg, 400, '.login_form');
				}
				return false;
			}else{
				shop.error.close(jemail, '.login_form');
			}
			var pass = shop.util_trim(jQuery(jpass).val());
			if(pass == ''){
				var $msg = 'Chưa nhập mật khẩu!';
				if(!popup){
					shop.show_popup_message($msg, "Đăng nhập thất bại", -1);
				}
				else{
					shop.error.set(jpass, $msg, 400, '.login_form');
				}
				return false;
			}else if(pass.length < 6){
				var $msg = 'Mật khẩu tối thiểu phải có 6 kí tự!';
				if(!popup){
					shop.show_popup_message($msg, "Đăng nhập thất bại", -1);
				}
				else{
					shop.error.set(jpass, $msg, 400, '.login_form');
				}
				return false;
			}
			return true;
		},
		submit: function(id_email, id_pass , id_save, popup){
			if(shop.customer.login.valid(id_email,id_pass,popup)){
				var jemail = '#'+id_email;
				var jpass = '#'+id_pass;
				var save = shop.get_ele(id_save);
				var cookie = save.checked ? 'on' : 'off';
				var post = {
					email: shop.util_trim(jQuery(jemail).val()),
					pass: shop.util_trim(jQuery(jpass).val()),
					save: cookie,
					city: shop.customer.login.conf.cb ? 1 : 0
				};
				shop.ajax_popup('act=customer&code=login','POST',post,
					function(j){
						if (j.err == 0 && j.msg == 'success') {
							if(shop.customer.login.conf.cb){
								shop.customer.login.conf.cb(j);
							}else{
								location.reload();
							}
						} else {
							switch(j.msg){
								case 'un_active':
									j.msg = '<font color="red">Tài khoản của Quý khách chưa được <a href="javascript:void(0)" onclick="shop.customer.active.send(\''+j.email+'\')">kích hoạt</a></font>, hoặc nhấn <a href="javascript:void(0)" onclick="shop.customer.changeEmail.popupChange(\''+j.email+'\','+j.idNo+')">vào đây</a> để đổi email';
								break;
								case 'blocked'  :
									j.msg = '<font color="red">'+SITE_NAME+' đã khóa tài khoản '+j.more.block_day+' ngày</font>';
									j.msg+= '<div class="mTop5"><b><u>Lí do</u>:</b> <font color="red">'+j.more.block_reason+'</font></div>';
								break;
								case 'nodata'   : j.msg = 'Tài khoản hoặc mật khẩu không hợp lệ'; break;
								case 'err_pass' :
									j.msg = 'Mật khẩu sai, <a href="javascript:void(0)" onclick="shop.customer.password.resendPassword(\''+j.email+'\')">Quý khách đã quên mật khẩu?</a>';
								break;
								case 'err_user' : j.msg = 'Không tồn tại tên đăng nhập này'; break;
								case 'in_email' : j.msg = 'Địa chỉ mail không hợp lệ'; break;
							}
							if(!popup){
								shop.show_overlay_popup('sys-alert', '',
								shop.popupSite('sys-alert', 'Hệ thống', shop.join
														('<div class="content" style="padding:20px">')
															('<div style="color:red"><b>Đăng nhập không thành công !!!</b></div>')
															('<div class="f12 mTop10"><b><u>Nguyên nhân</u>:</b> '+j.msg+'</div>')
														('</div>')()),
								{
									background: {'background-color' : 'transparent'},
									border: {
										'background-color' : 'transparent',
										'padding' : '0px'
									},
									title: {'display' : 'none'},
									content: {
										'padding' : '0px',
										'width' : '400px'
									}
								});
							}
							else{
								shop.error.set('', j.msg, 400, '.login_form');
							}
						  
						}
					});
			}
		},
		theme:{
			form:function(id, title, close, opt, txt){
				var html = shop.join
				('<form onsubmit="return shop.customer.loginPopup();" method="post" id="customer_login_form">')
					('<div class="rt_popup_Content">')
						('<div class="rt_popup_ContentLogin login_form">')
							('<div class="rt_Login_CenLeft">')
								('<div id="cError"></div>')
								('<div class="rt_regiterCon">')
									('<div class="rt_regiter_input">')
										('<span class="rt_login_title">Email:</span>')
										('<input name="email" id="login_email" class="rt_login_input"/>')
									('</div>')
									('<div class="rt_regiter_input">')
										('<span class="rt_login_title">Mật khẩu:</span>')
										('<input id="login_pass" type="password" name="pass" class="rt_login_input"/>')
									('</div>')
									('<div class="rt_regiter_check">')
										('<span class="rt_login_title"></span>')
										('<input type="checkbox" checked="" class="checkbox" id="save_login">')
										('<label for="reg_oke">&nbsp;Nhớ mật khẩu</label>')
									('</div>')
									('<div class="rt_login_Submit">')
										('<span class="rt_login_title"></span>')
										('<input type="submit" value="Đăng nhập" onsubmit="shop.customer.loginPopup()" class="rt_regiter_button rt_Fixregiter_button"/>')
										('<a class="rt_login_for" href="javascript:void(0)" onclick="shop.customer.password.resendPassword()">Quên mật khẩu?</a>')
									('</div>')
								('</div>')
							('</div>')
							('<div class="rt_Login_CenRight">')
								('<div class="rt_Login_CenRightTitle mtop5">Đăng nhập bằng</div>')
								('<a id="Facebook" class="rt_btn_LoginFaceBook mTop25" href="javascript:void(0)"></a>')
								('<a id="LinkAutGoogle" class="rt_btn_LoginGooogle" href="javascript:void(0)"></a>')
							('</div>')
							('<div class="c"></div>')
						('</div>')
						('<div class="rt_Login_Foooter">')
							('<div class="rt_popup_FoooterLogin">')
								('<div class="rt_popup_FoooterNote">Chưa có tài khoản?</div>')
								('<div class="rt_regiter_input" align="center">')
									('<a class="rt_log_button" onclick="shop.customer.register.show()" href="javascript:void(0)">Đăng ký</a>')
								('</div>')
							('</div>')
						('</div>')
					('</div>')
				('</form>')();
				if(txt){
					return html;
				}
				return shop.popupSite(id, title, html, close, opt);
			},
			check:function(){
				var c = shop.get_ele('save_login');
				if(c){
					c.checked = !c.checked
				}
			}
		}
	},
	register : {
		show:function(){
			shop.show_overlay_popup('pop-register', 'Đăng kí',
			shop.customer.register.theme.form('pop-register', 'Đăng kí'),
			{
				background: {
					'background-color' : 'transparent'
				},
				border: {
					'background-color' : 'transparent',
					'padding' : '0px'
				},
				title: {
					'display' : 'none'
				},
				content: {
					'padding' : '0px',
					'width' : '860px',
					'font-size': '12px'
				},
				release:function(){
					shop.enter('#reg_full_name', shop.customer.register.submit);
					shop.enter('#reg_email', shop.customer.register.submit);
					shop.enter('#reg_pass', shop.customer.register.submit);
					shop.enter('#reg_pass1', shop.customer.register.submit);
				}
			});
		},
		cancel:function(){shop.hide_all_popup()},
		valid:function(){
			if (typeof ___PASSVALID !== 'undefined') return true;
			var reg_oke = shop.get_ele('reg_oke');
			if(reg_oke && !reg_oke.checked){
				shop.error.set('#reg_oke', 'Vui lòng chấp nhận các điều khoản & quy định của '+SITE_NAME, 430, '.register_form');
				return false;
			}
			var email = shop.util_trim(jQuery('#reg_email').val());
			if(email == ''){
				shop.error.set('#reg_email', 'Chưa nhập email', 430, '.register_form');
				return false;
			}else if(!shop.is_email(email)){
				shop.error.set('#reg_email', 'Email không hợp lệ', 430, '.register_form');
				return false;
			}else{
				shop.error.close('#reg_email', '.register_form');
			}
	
			var pass = jQuery('#reg_pass').val();
			if(pass.length < 6){
				shop.error.set('#reg_pass', 'Mật khẩu tối thiểu phải có 6 kí tự', 430, '.register_form');
				jQuery('#reg_pass #reg_pass1').val('');
				return false;
			}
			if(pass == ''){
				shop.error.set('#reg_pass', 'Chưa nhập mật khẩu hoặc có chỉ có ký tự trắng', 430, '.register_form');
				jQuery('#reg_pass #reg_pass1').val('');
				return false;
			}
			if(shop.util_trim(pass) == ''){
				shop.error.set('#reg_pass', 'Không được bỏ trống trường mật khẩu hoặc dùng ký tự cách', 430, '.register_form');
				jQuery('#reg_pass #reg_pass1').val('');
				return false;
			}
			//pass = shop.util_trim(pass);
			shop.error.close('#reg_pass', '.register_form');
			var pass1 = jQuery('#reg_pass1').val();
			if(pass1 == ''){
				shop.error.set('#reg_pass1', 'Chưa nhập lại mật khẩu', 430, '.register_form');
				return false;
			}else if(pass != pass1){
				shop.error.set('#reg_pass1', 'Mật khẩu không khớp', 430, '.register_form');
				return false;
			}else{
				shop.error.close('#reg_pass1', '.register_form');
			}
	
//			var reg_phone = shop.util_trim(jQuery('#reg_phone').val());
//			if(reg_phone == ''){
//				shop.error.set('#reg_phone', 'Chưa nhập số điện thoại', 430, '.register_form');
//				return false;
//			}else if(!shop.is_phone(reg_phone)){
//				shop.error.set('#reg_phone', 'Số điện thoại di động không hợp lệ', 430, '.register_form');
//				return false;
//			}else{
//				shop.error.close('#reg_phone', '.register_form');
//			}
			return true;
		},
		submit: function(){
			if(shop.customer.register.valid()){
				var post = {
					email: shop.util_trim(jQuery('#reg_email').val()),
					pass: shop.util_trim(jQuery('#reg_pass').val()),
					phone: shop.util_trim(jQuery('#reg_phone').val()),
					uname: shop.util_trim(jQuery('#reg_full_name').val()),
					address: shop.util_trim(jQuery('#reg_address').val()),
					district: shop.util_trim(jQuery('#reg_listDistrict').val()),
					street: shop.util_trim(jQuery('#reg_street').val()),
					city: shop.util_trim(jQuery('#reg_city').val()),
					giftcode: jQuery('#reg_giftcode').length > 0 ? jQuery('#reg_giftcode').val() : ''
				};
	
				shop.ajax_popup('act=customer&code=valid_reg','GET',{email: post.email, phone: post.phone},function(json){
					if(json.email){
						var msg = json.email;
						if(json.block >= 1){
							msg = 'Email này đã được sử dụng và đang bị khóa. Nếu có bất cứ thắc mắc nào, xin Quý khách vui lòng liên hệ với '+SITE_NAME+'.';
						}else if(json.active == 1){
							msg = 'Email này đã được sử dụng! Quý khách đã <a href="javascript:void(0)" onclick="shop.customer.register.showPassForm(\''+post.email+'\')">quên mật khẩu</a> ?';
							if (typeof ___PASSVALID !== 'undefined') {
								msg = 'Email này đã được sử dụng!';
							}
						}else if(json.active == 0){
							msg = 'Email này đã được dùng và đang trong trạng thái chưa kích hoạt. Nếu quý khách đã dùng email này trên '+SITE_NAME+', vui lòng kiểm tra hòm thư hoặc <a href="javascript:void(0)" onclick="shop.customer.register.sendActiveEmail(\''+post.email+'\')">nhấn vào đây</a> để nhận lại email kích hoạt';
							if (typeof ___PASSVALID !== 'undefined') {
								msg = 'Email này đã được dùng và đang trong trạng thái chưa kích hoạt!';
							}
						}
						if (typeof ___PASSVALID !== 'undefined') {
							alert(msg);
							jQuery('#reg_email').focus();
						} else {
							shop.error.set('#reg_email', msg, 430, '.register_form');
						}
					}else if(json.phone){
						if (typeof ___PASSVALID !== 'undefined') {
							alert(json.phone);
							jQuery('#reg_phone').focus();
						} else {
							shop.error.set('#reg_phone', json.phone, 430, '.register_form');
						}
					}else{
						shop.ajax_popup('act=customer&code=register','POST',post,
							function(json){
								if(json.err >= 0){
									shop.customer.register.cancel();
									if(json.active){
										alert(json.msg);
										window.location.reload();
									}else{
										shop.show_overlay_popup('alert-register', 'Kích hoạt tài khoản qua Email',
											shop.popupSite('alert-register', 'Kích hoạt tài khoản qua Email',shop.join
											('<div class="p20" style="padding-bottom:5px">')
												('<div style="font-size:16px"><b>Cám ơn Quý khách đã đăng kí tài khoản trên '+SITE_NAME+'</b></div>')
												('<div class="mTop10">Email kích hoạt đã được gửi vào hòm thư <b style="font-size:16px;color:red">'+json.email+'</b></div>')
												('<div class="mTop10">Vui lòng kiểm tra và <span style="color:red">bấm link kích hoạt</span>. Nếu Quý khách không thấy trong <b>Inbox</b> hãy kiểm tra <b>Thư rác/Spam/Junk mail</b></div>')
												('<div class="mTop15" align="center"><table><tr><td><a class="btBlack" onclick="shop.hide_overlay_popup(\'alert-register\')" href="javascript:void(0)">Đóng cửa sổ</a></td></tr></table></div>')
											('</div>')()),
											{
												background: {
													'background-color' : 'transparent'
												},
												border: {
													'background-color' : 'transparent',
													'padding' : '0px'
												},
												title: {
													'display' : 'none'
												},
												content: {
													'padding' : '0px',
													'width' : '510px'
												}
											}
										);
									}
								}else{
									if(shop.is_exists(json.email)){
										var msg = json.email;
										if(json.block >= 1){
											msg = 'Email này đã được sử dụng và đang bị khóa. Nếu có bất cứ thắc mắc nào, xin Quý khách vui lòng liên hệ với '+SITE_NAME+'.';
										}else if(json.active == 1){
											msg = 'Email này đã được sử dụng! Quý khách đã <a href="javascript:void(0)" onclick="shop.customer.register.showPassForm(\''+post.email+'\')">quên mật khẩu</a> ?';
										}else if(json.active == 0){
											msg = 'Email này đã được dùng và đang trong trạng thái chưa kích hoạt. Nếu quý khách đã dùng email này mua hàng trên '+SITE_NAME+', vui lòng kiểm tra hòm thư hoặc <a href="javascript:void(0)" onclick="shop.customer.register.sendActiveEmail(\''+post.email+'\')">nhấn vào đây</a> để nhận lại email kích hoạt';
										}
										shop.error.set('#reg_email', msg, 430, '.register_form');
									}else if(shop.is_exists(json.phone)){
										shop.error.set('#reg_phone', json.phone, 430, '.register_form');
									}
								}
							}
						);
					}
				});
			}
		},
		showPassForm:function(email){
			shop.hide_overlay_popup('pop-register');
			shop.customer.password.resendPassword(email);
		},
		sendActiveEmail:function(email, active, cb){
			active = active ? active : 0;
			shop.ajax_popup('act=customer&code=email-active','GET',{email: email, active: active},function(j){
				if(j.err == 0){
					shop.hide_overlay_popup('pop-register');
					alert('Email kích hoạt đã được gửi vào hòm thư:\n'+email+'\nVui lòng kiểm tra và kích hoạt tài khoản.');
					if(cb) cb();
				}else{
					alert('Có lỗi xảy ra! Vui lòng thực hiện lại thao tác.');
				}
			});
		},
		theme:{
			form:function(id, title, close, opt, txt){
				var html = '', city = '<select name="city" id="reg_city" onchange="shop.geo.loadDistrictDropdown(this.value, \'reg_listDistrict\');">';
				city += '<option value="0"> Chọn tỉnh thành phố </option>';
				for(var i in city_list){
					city += '<option value="'+city_list[i].id+'">'+city_list[i].title+'</option>';
				}
				city += '</select>';
				html = shop.join
				('<form id="bm_register_form">')
					('<div class="rt_popup_Content">')
						('<div class="content register_form rt_popup_ContentLogin">')
							('<div class="rt_regiterCon rt_Login_CenLeft">')
								('<div id="cError"></div>')
								/*('<div class="rt_regiter_input">')
									('<span class="rt_reg_title">Họ tên:</span>')
									('<input id="reg_full_name" name="full_name" type="text" class="rt_reg_input"/>')
								('</div>')
								('<div class="rt_regiter_input">')
									('<span class="rt_reg_title">Di động:</span>')
									('<input id="reg_phone" name="phone" onkeypress="return shop.numberOnly(this,event)" type="text" class="rt_reg_input"/>')
								('</div>')*/
								('<div class="rt_regiter_input">')
									('<span class="rt_reg_title">Email:</span>')
									('<input id="reg_email" name="email" type="text" class="rt_reg_input"/>')
								('</div>')
								('<div class="rt_regiter_input">')
									('<span class="rt_reg_title">Mật khẩu:</span>')
									('<input type="password" id="reg_pass" name="pass" class="rt_reg_input"/>')
								('</div>')
								('<div class="rt_regiter_input">')
									('<span class="rt_reg_title">Nhập lại mật khẩu:</span>')
									('<input type="password" id="reg_pass1" name="pass1" class="rt_reg_input"/>')
								('</div>')
								('<div class="rt_regiter_note">Bằng việc bấm đăng ký bạn đã chấp nhận các <a href="javascript:void(0)">điều khoản</a> và <a href="javascript:void(0)">quy định</a> của Rento</div>')
								('<div class="rt_regiter_Submit" align="center">')
									('<a class="rt_regiter_button" href="javascript:void(0)" onclick="shop.customer.register.submit()">Đăng ký</a>')
								('</div>')
							('</div>')
							('<div class="rt_Login_CenRight">')
								('<div class="rt_Login_CenRightTitle mtop5">Đăng ký bằng</div>')
								('<a id="Facebook" class="rt_btn_LoginFaceBook mTop25" href="javascript:void(0)"></a>')
								('<a id="LinkAutGoogle" class="rt_btn_LoginGooogle" href="javascript:void(0)"></a>')
							('</div>')
							('<div class="c"></div>')
							('<div class="reg_collapse mTop5 hidden">')
								('<div class="title">')
									('<div class="fl">Thông tin cá nhân, địa chỉ chuyển hàng:</div>')
									('<a href="javascript:void(0)" class="fr" onclick="jQuery(\'#more_info\').slideToggle()">[mở rộng - thu gọn]</a>')
									('<div class="c"></div>')
								('</div>')
								('<table cellpadding="0" cellspacing="5" id="more_info" class="hidden">')
									('<tr>')
										('<td align="right" width="160">Họ tên:</td>')
										('<td><input  /></td>')
									('</tr>')
									('<tr>')
										('<td align="right">Tỉnh/Thành phố:</td>')
										('<td>'+city)
											('<img src="style/images/places.png" onclick="shop.geo.getPlaces(shop.customer.register.theme.address)" width="32" height="32" class="fr" style="cursor:pointer" title="Tự động lấy địa chỉ" />')
										('</td>')
									('</tr>')
									('<tr>')
										('<td align="right">Quận/Huyện/Phường:</td>')
										('<td class="customerRegister"><select id="reg_listDistrict" class="w290" name="district" onchange="shop.geo.loadStreetToSuggest(this.value,jQuery(\'#city\').val(),\'reg_street\');"></select></td>')
									('</tr>')
									('<tr>')
										('<td align="right">Đường/Phố:</td>')
										('<td><input type="text" id="reg_street" name="street" /></td>')
									('</tr>')
									('<tr>')
										('<td align="right">Địa chỉ nhận hàng:</td>')
										('<td><input type="text" id="reg_address" name="address" /></td>')
									('</tr>')
								('</table>')
							('</div>')
						('</div>')
					('</div>')
				('</form>')();
				if(txt){
					return html;
				}
				return shop.popupSite(id, title, html, close, opt);
			},
			check:function(){
				var c = shop.get_ele('reg_oke');
				if(c){
					c.checked = !c.checked
				}
			},
			address:function(data){
				if(data.city > 0){
					jQuery('#reg_city').val(data.city);
					shop.geo.loadDistrictDropdown(data.city,'reg_listDistrict',false,data.district);
					shop.geo.loadStreetToSuggest(data.district,data.city,'reg_street');
				}
			}
		}
	},
	loginMixReg:{
		show:function(){
			shop.customer.login.show();
		}
	},
	loginHeader: function(){
		shop.customer.login.submit('customer_email','customer_password','customer_save_login',false);
		return false;
	},
	loginPopup: function(){
		shop.customer.login.submit('login_email','login_pass','save_login',true);
		return false;
	},
    savingsearch:function (){
        var total = jQuery('#total_search').val();
        if(total>0){
            shop.ajax_popup('act=customer&code=savingsearch','GET',{}, function(j){
                if(j.err == 0){
                    var num = parseInt(jQuery('#headerNumWish').text());
                    shop.customer.updateWishDisplay('saving_search', num+1, 1);
                    //alert('Ban đã lưu thành công');
                }
                else alert(j.msg);
            });
        }else{
            alert('Không có kết quả để lưu');
        }
    },
    delsaving:function (id){
        var r = confirm("Bạn có chắc chắn muốn xóa kết quả tìm kiếm này?");
        if (r == true) {
            shop.ajax_popup('act=customer&code=del_saving','GET',{id:id}, function(j){
                   if(j.err == 0){
                       shop.reload()
                   }
                   else alert(j.msg);
               });
       }
    },
    wish: function (id,undo){
		jQuery('.bon_detailBTitleLike ').hide();
		jQuery('#rt_iconIDFavourite_'+id).hide();
		jQuery('#rt_iconIDFavourite_'+id).after('<a href="yeu-thich.html"  class="p3_build_id_item_saving"><span>&#xf005;</span>&nbsp;&nbsp;Đã lưu</a>');
		jQuery('#rt_saing_detail_'+id).hide();
		jQuery('#rt_saing_detail_'+id).after('<a class="p3_di_box_infogen_showtext p3_dis_saving" href="javascript:void(0)" ><i class="p3_icon_save_dt"></i>Đã lưu</a>');
		jQuery('#bon_iconIDFavourite_'+id).hide();
		jQuery('#bon_iconIDFavourite_'+id).after('<a href="yeu-thich.html" style="padding: 11px 0" class="bon_v2_Btn_FFFNoBack">Đã lưu</a>');
		jQuery('#rt_iconIDFavouriteMap_'+id).hide();
		jQuery('#rt_iconIDFavouriteMap_'+id).after('<a class="rt_v3_BL_BtnBorRadiusBGFFF" style="padding: 7px 0 6px;width: 95px" href="yeu-thich.html"><i class="rt_iconLuulai"></i>&nbsp;Đã lưu</a>');
    	if (IS_CUSTOMER_LOGIN) {
    		shop.ajax_popup('act=customer&code=wish','GET',{id: id}, function(j){
				if(j.err == 0){
					shop.customer.updateWishDisplay(id, j.num, 1,undo);
				}
				else alert(j.msg);
			});
		}
		else{
			if(id>0){
				var getWish = shop.cookie.get('wishList').split(",");
				var check = true;
				for(var x in getWish){
					if(getWish[x]==id){
						check = false;
					}
				}
				if(check==true){
					var str = getWish.join(",");
					if(str==''){
						str = id;
					}else{
						str = str+","+id;
					}
					str = new String(str);
					var arr_id = str.split(",");
					shop.cookie.set('wishList', arr_id, 86400, '/');
					var i = 0;
					if(shop.cookie.get('223d075a4ca1adc047ffdd211a6a568e')){
						var getnum_save = JSON.parse(shop.cookie.get('223d075a4ca1adc047ffdd211a6a568e'));
						for(var x in getnum_save){
							i++;
						}
					}
                    var num =  arr_id.length+i;
					shop.customer.updateWishDisplay(id, num, 1,undo);
				}
			}
		}
    },
    unwish: function (id){
    	if (IS_CUSTOMER_LOGIN) {
    		shop.ajax_popup('act=customer&code=unwish','GET',{id: id}, function(j){
				if(j.err == 0){
					shop.customer.updateWishDisplay(id, j.num, 0);
				}else{
					alert(j.msg);
				}
			});
		}
		else{
			if(id>0){
				var getWish = shop.cookie.get('wishList').split(",");
				var check = true;
				for(var x in getWish){
					if(getWish[x]==id){
						getWish.splice(x, 1);
					}
				}
				var i = 0;
				if(shop.cookie.get('223d075a4ca1adc047ffdd211a6a568e')){
					var getnum_save = JSON.parse(shop.cookie.get('223d075a4ca1adc047ffdd211a6a568e'));
					for(var x in getnum_save){
						i++;
					}
				}
				var num =  getWish.length+i;
				shop.cookie.set('wishList', getWish, 86400, '/');
				shop.customer.updateWishDisplay(id, num, 0);
			}
		}
    },
    updateWishDisplay: function(id, num, type, undo){

		if(URL_PARAMS['page']=="yeu_thich"){
			jQuery('.rt_FT_TypelistBuildLiUndo').remove();
			if(undo==1){
				//jQuery('#rt_listWish'+id).toggle('slide','right',1000);
				jQuery('#rt_listWish'+id).slideToggle('slow');
			}else{
				//jQuery('#rt_listWish'+id).toggle('slide','right',1000);
				jQuery('#rt_listWish'+id).slideToggle('slow');
				jQuery('#rt_listWish'+id).after('<li id="rt_FT_TypelistBuildLiMove_'+id+'" class="rt_FT_TypelistBuildLi rt_FT_TypelistBuildLiUndo hidden"><div class="fl">Đã được bỏ ra khỏi danh sách đã lưu.</div><a href="javascript:void(0)" onclick="shop.customer.wish('+id+',1)" class="rt_detailTitleFavouriteLink fr" style="margin-right: 115px;"><i class="rt_iconLPFavourite"></i>&nbsp;Lưu lại</a><div class="c"></div></li>')
				jQuery('#rt_FT_TypelistBuildLiMove_'+id).toggle('slide','right',800);
			}
		}
		
		if(type){
			if(DETECT_MOBILE==0){
				var cart = $('.p3_menu_save i');
				var imgtodrag = $('#rt_flyImg'+id).find("img").eq(0);
				if (imgtodrag) {
					var imgclone = imgtodrag.clone()
						.offset({
						top: imgtodrag.offset().top,
						left: imgtodrag.offset().left
					})
						.css({
						'opacity': '0.7',
							'position': 'absolute',
							'height': 'auto',
							'width': '180px',
							'z-index': '100'
					})
						.appendTo($('body'))
						.animate({
						'top': cart.offset().top + 10,
							'left': cart.offset().left + 10,
							'width': 75,
							'height': 'auto'
					}, 1000, 'easeInOutExpo');

					setTimeout(function () {
						cart.effect("pulsate", {
							times: 2
						}, 200);
					}, 1500);

					imgclone.animate({
						'width': 0,
							'height': 0
					}, function () {
						$(this).detach()
					});
				}
			}
		}
    	//Header
    	if(num > 0){
    		jQuery('#headerNumWish').html(num).removeClass('hidden');
    	}
    	else{
    		jQuery('#headerNumWish').addClass('hidden');	
    	}

    	//button
    	if(type){
    		jQuery('.signWishButton'+id).addClass('hidden');
			jQuery('.signUnWishButton'+id).removeClass('hidden');
    	}else{
			jQuery('.signWishButton'+id).removeClass('hidden');
			jQuery('.signUnWishButton'+id).addClass('hidden');
		}
    },
    findsimilar: function(id){
    	shop.ajax_popup('act=customer&code=findItem','GET',{id: id}, function(j){
			if(j.err == 0){
				var priceRangeMin = j.price_int - 500000, priceRangeMax = j.price_int + 500000;
				if(priceRangeMin < 0){
					priceRangeMin = 0
				}
				var priceRange = priceRangeMin+";"+priceRangeMax;
				jQuery('#type').val(j.type);
				jQuery('#city_id').val(j.city);
				jQuery('#district_id').val(j.district);
				jQuery('#price').val(priceRange);
				jQuery('#songuoi').val(j.songuoi);
				//tien nghi
				jQuery('#tivi').val(j.build.tivi);
				jQuery('#thcap').val(j.build.thcap);
				jQuery('#wifi').val(j.build.wifi);
				jQuery('#nhaxe').val(j.build.nhaxe);
				jQuery('#dichung').val(j.build.dichung);
				jQuery('#sanphoi').val(j.build.sanphoi);
				jQuery('#dirieng').val(j.build.dirieng);
				jQuery('#maygiat').val(j.build.maygiat);

				shop.customer.searchOptions.save('wish');
				document.shopWishListForm.submit();
			}
		});
    },
	changeEmail:{
		validate:function(frm){
			var fullname = jQuery('#fullname').val();
			var phone = jQuery('#phone').val();
			var homephone = jQuery('#homephone').val();
			var pass = jQuery('#pass').val();
			var pass1 = jQuery('#pass1').val();
			if(fullname == ''){
				var $msg = 'Chưa nhập email!';
				shop.error.set("#fullname", "Chưa nhập tên", 400, '.rt_PostContent');
				return false;
			}
//			else if(phone == ''){
//				shop.error.close("#fullname", '.rt_PostContent');
//				shop.error.set("#phone", "Chưa nhập số điện thoại", 400, '.rt_PostContent');
//				return false;
//			}
//			else if(!shop.is_phone(phone)){
//				shop.error.close("#fullname", '.rt_PostContent');
//				shop.error.set('#phone', 'Số điện thoại di động không hợp lệ', 400, '.rt_PostContent');
//				return false;
//			}
//			else if(homephone==""){
//				shop.error.close("#phone", '.rt_PostContent');
//				shop.error.set('#homephone', 'Chưa nhập số máy bàn', 400, '.rt_PostContent');
//			}
			else{
				shop.error.close("#fullname", '.login_form');
				if((frm.name=='LoginFacebookForm'||frm.name=='shopLoginGoogleForm')&&pass==""){
					shop.error.set('#pass', 'Bạn cần nhập mật khẩu', 400, '.rt_PostContent');
					return false;
				}
				if(pass!=""){
					if(pass.length < 6){
						shop.error.set('#pass', 'Mật khẩu phải lớn hơn 6 ký tự', 400, '.rt_PostContent');
						return false;
					}else if(pass1 == ''){
						shop.error.close("#pass", '.rt_PostContent');
						shop.error.set('#pass1', 'Bạn cần nhập lại mật khẩu để xác nhận', 400, '.rt_PostContent');
						return false;
					}else if(pass != pass1){
						shop.error.close("#pass", '.rt_PostContent');
						shop.error.set('#pass1', 'Mật khẩu nhập lại không trùng khớp', 400, '.rt_PostContent');
						return false;
					}
				}
				frm.submit();
				return true;
			}
			
		},
		popupChange:function (email,hidenId){
			shop.show_overlay_popup('alert-enabled', 'Đổi Email',
				shop.popupSite('alert-enabled', 'Đổi Email',
					shop.join
					('<div class="p20">')
						('<div class="f13 chageEmail">')
							('<div id="cError"></div>')
							('<div class="rt_regiterCon">')
								('<div class="rt_regiter_input">')
									('<span class="rt_login_title">Email mới:</span>')
									('<input type="text" name="changeemail" id="changeemail" class="rt_login_input"/>')
								('</div>')
								('<div class="rt_login_Submit">')
									('<span class="rt_login_title"></span>')
									('<input value="'+email+'" type="hidden" name="email_old" id="email_old"/>')
									('<input value="'+hidenId+'" type="hidden" name="nocode" id="nocode"/>')
									('<a class="rt_regiter_button" href="javascript:void(0)"  onclick="shop.customer.changeEmail.handlingchangeEmail()">Thay đổi</a>')
									('<a class="rt_login_for" href="javascript:void(0)" onclick="shop.hide_overlay_popup(\'alert-enabled\');">Bỏ qua</a>')
								('</div>')
							('</div>')
						('</div>')
					('</div>')()),
					{
							background: {
									'background-color' : 'transparent'
							},
							border: {
									'background-color' : 'transparent',
									'padding' : '0px'
							},
							title: {
									'display' : 'none'
							},
							content: {
									'padding' : '0px',
									'width' : '520px'
							}
			});
		},
		handlingchangeEmail:function (){
			var email = shop.util_trim(jQuery('#changeemail').val());
			var email_old = shop.util_trim(jQuery('#email_old').val());
			var IdHidden = shop.util_trim(jQuery('#nocode').val());
			if(email == ''){
				shop.error.set('#changeemail', 'Chưa nhập email', 360, '.chageEmail');
				return false;
			}else if(!shop.is_email(email)){
				shop.error.set('#changeemail', 'Email không hợp lệ', 360, '.chageEmail');
				return false;
			}else if(email==email_old){
				shop.error.set('#changeemail', 'Email thay đổi phải khác email cũ', 360, '.chageEmail');
				return false;
			}else{
				shop.error.close('#reg_email', '.chageEmail');
				if(email_old==""||IdHidden==""){
					alert("Xin lỗi hệ thống không tìm thấy thông tin cần thiết. Mới bạn thao tác lại từ đầu.");
					location.reload();
				}else{
					shop.ajax_popup('act=customer&code=handlingchangeEmail','POST',{email: email,email_old:email_old,code:IdHidden},function(json){
					if (json.err == 0 && json.msg == 'success') {
						shop.show_overlay_popup('alert-enabled', 'Đổi Email',
							shop.popupSite('alert-enabled', 'Đổi Email',
								shop.join
								('<div class="p20">')
									('<div class="f13 chageEmail" align="center" style="line-height:24px">')
										('<div>Link xác thực đã được gửi đến Email <b>'+email+'</b></div>')
										('<div>Bạn vui lòng kiểm tra <b>'+email+'</b> và làm theo hướng dẫn để xác thực</div>')
										('<div style="color:red;font-weight:bold" class="f16">Nếu bạn không tìm thấy email, hãy kiểm tra trong Thư rác/Spam/Junk mail</div>')
										('<div class="mTop15" align="center"><table><tr><td><a href="javascript:void(0)" onclick="shop.hide_overlay_popup(\'alert-enabled\');" class="rt_regiter_button mTop10"><span><span>Đóng cửa sổ</span></span></a></td></tr></table></div>')
									('</div>')
								('</div>')()),
								{
										background: {
												'background-color' : 'transparent'
										},
										border: {
												'background-color' : 'transparent',
												'padding' : '0px'
										},
										title: {
												'display' : 'none'
										},
										content: {
												'padding' : '0px',
												'width' : '630px'
										}
						});
					}else{
						switch(json.msg){
							case 'invalid'		:json.msg = 'Xin lỗi hệ thống không tìm thấy thông tin cần thiết.';break;
							case 'false'		:json.msg = 'Địa chỉ email không hợp lệ';break;
							case 'active'		:json.msg = 'Email của bạn đã được xác thực bạn, bạn không thể đổi Email';break;
							case 'active_emailnew':json.msg = 'Email bạn vừa nhập đã được xác thực, bạn không thể đổi Email';break;
							case 'falseChange60':json.msg = 'Bạn phải chờ 60ph để thay đổi email khác';break;
						}
						shop.error.set('#changeemail', json.msg, 360, '.chageEmail');
					}
				});
				}
				
			}
		}
	},
	changeDevice:function (device){
		shop.cookie.set('device_cus',device,60*60*24*365);
		location.reload();
	}
};

shop.customer.crawler = {
	conf: {
		crawler_id : 0
	},
	onoff_items:function(id, active, gold,onPopupMsg){
		var textonoff = ' bật';
		if(active==1){
			textonoff = ' tắt';
		}
		if(onPopupMsg==1){
			var note_cs = jQuery('#note_cs').val(),
			reason = jQuery('#del_reason').val();
			if(reason==""){
				shop.raiseError('#del_reason', "Chưa chọn lí do", true);
			}else{
				shop.hide_overlay_popup('pop-reason-onoff');
				shop.closeErr('#note_cs');
				shop.closeErr('#del_reason');
				active = (active== 0) ? 1 : 0;
				if(id>0&&active>=0){
					var msg = '';
					if(active){
						msg = ((gold > 0)? 'Khách hàng '+jQuery('#fullname').val()+' sẽ bị trừ '+gold+'đ<br/>' : '') + 'Bạn có muốn BẬT TIN không';
					} 
					else{
						msg = 'Bạn có muốn TẮT tin không';
					}
					shop.confirm(msg, function(){
						shop.ajax_popup("act=item&code=onoff_item",'POST',{id: id, active: active, note_cs:note_cs, reason:reason},
						function(json){
							if(json.err == 0){
								//var html = shop.join("<a href='javascript:void(0)' onclick='shop.customer.crawler.onoff_items("+id+","+active+")'><img src='style/images/admin/icons/"+(active==0?'off.png':'on.png')+"' title='"+(active==0?'Tin đang tắt nhấn để bật':'Tin đang bật nhấn để tắt')+"'/></a>");
								//jQuery("#rt_activeText").html(active==0?'Tin đang tắt':'Tin đang bật');
								//jQuery("#rt_actiononoff"+id).html(html);
								//jQuery(".tipsy").remove();
								//$('.tipS').tipsy({gravity: 's',fade: true, html:true});
								alert('Thành công');
								window.location.reload();
							}else{
								alert(json.msg);
							}
						});
					});

				}else{
					alert('Hệ thống không tìm thấy sản phẩm');
				}
			}
		}else{
			shop.show_overlay_popup('pop-reason-onoff', '',
			shop.customer.crawler.popupNoteCs('pop-reason-onoff',id, active, gold),
			{
				background: {'background-color' : 'transparent'},
				border: {
					'background-color' : 'transparent',
					'padding' : '0px'
				},
				title: {'display' : 'none'},
				content: {
					'padding' : '0px',
					'width' : shop.is_ie6() ? '425px' : '415px'
				}
			});
		}
	},
	popupNoteCs:function (idPopup,id, active, gold){
		var textonoff = ' Bật', opt = '<select name="del_reason" id="del_reason"><option value="">-- Chọn lí do --</option>';
		if(active==1){
			textonoff = ' Tắt';
			opt += type_off;
		}else{
			opt += type_on;
		}
		opt += '</select>';
		return shop.popupSite(idPopup, 'Lý do '+textonoff+' tin', shop.join
			('<div style="padding:1px 20px 10px">')
				('<div id="cError"></div>')
				('<div class="mTop10">Lý do '+textonoff+' Tin: '+(opt != '' ? opt : '')+'</div>')
				('<div class="input-txt mTop10 reg_collapse" style="width:260px">')
					('<textarea style="width: 370px; height: 125px;" id="note_cs" name="note_cs" placeholder="Ghi chú thêm"></textarea>')
				('</div>')
				('<div class="mTop10">')
					('<div>')
						('<a id="fl" style="width: 48px;" class="rt_headerBtnPost cur_pointer mTop10 mBottom10" onclick="shop.hide_overlay_popup(\''+idPopup+'\')" href="javascript:void(0)">Hủy bỏ</a>')
						('<a id="fr" class="rt_headerBtnPost cur_pointer mTop10 mBottom10" onclick="shop.customer.crawler.onoff_items('+id+','+active+', '+gold+', 1)" href="javascript:void(0)">'+textonoff+' tin</a>')
						('<div class="c"></div>')
					('</div>')
				('</div>')
			('</div>')()
		);
	},
	adminApprove: function (id, item_id){
		var msg = 'Bạn có chắc chắn DUYỆT <div style="color:red">'+ jQuery('.p3_detail_item_title').html()+'</div>cho CTV <b style="color:green">'+ jQuery('#lbl_CTV'+id).val()+'</b>';
		shop.confirm(msg, function(){
			shop.ajax_popup('act=crawler&code=approveItem', 'POST', {id:id}, function(j){
				if(j.err == -1){
					shop.show_popup_message(j.msg, "Thông báo lỗi",-1);
				}else{
					//alert(j.msg);
					//window.location.reload();
					var msg = 'Bạn có muốn On tin luôn không?';
					shop.confirm(msg, function(){
						shop.customer.crawler.onoff_items(j.id_bds,0,0);
					});
				}
			});
		});
	},
	adminCancel: function (id, ipt_note){
		note = jQuery(ipt_note).val();
		shop.ajax_popup('act=crawler&code=cancelAppoveItem','POST',{id:id, note: note},function(j){
			if(j.err == -1){
				shop.show_popup_message(j.msg, "Thông báo lỗi",-1);
			}else{
				alert(j.msg);
				window.location.reload();
			}
		});
	},
	adminCancelForm: function(id, item_id){
		var msg = 'Bạn có chắc chắn gửi đề nghị CTV LÀM LẠI tin <div style="color:red">'+ jQuery('#itemTitle'+item_id).html()+'</div>tới CTV <b style="color:green">'+ jQuery('#lbl_CTV'+id).val()+'</b>';
		html = shop.join
		('<div class="rt_popup_Content">')
			('<div class="rt_popup_ContentLogin login_form">')
				('<div id="cError"></div>')
				('<div class="rt_regiterCon">')
					('<div class="rt_regiter_input">'+msg+'</div>')
					('<div class="rt_regiter_input mTop10">')
						('<span>Ghi chú:</span>')
					('</div>')
					('<div class="rt_regiter_input">')
						('<textarea class="rt_PostTablearea" name="crawler_note" id="crawler_note" size="30"></textarea>')
					('</div>')
					('<div class="rt_login_Submit">')
						('<span class="rt_login_title"></span>')
						('<a class="rt_regiter_button" href="javascript:void(0)" onclick="shop.customer.crawler.adminCancel('+id+',\'#crawler_note\')">Đề nghị làm lại</a>')
						('<a class="mLeft15" href="javascript:void(0)" onclick="shop.hide_overlay_popup(\'customer-partner\');">Hủy bỏ</a>')
					('</div>')
				('</div>')
			('</div>')
		('</div>')
		();
		html = shop.popupSite(id, "Đề nghị làm lại tin", html, '');
		shop.show_overlay_popup('customer-partner',"Đề nghị làm lại tin", html, {
			background: {'background-color' : 'transparent'},
			border: {'background-color' : 'transparent','padding' : '0px'},
			title: {'display' : 'none'},
			content: {'padding' : '0px','width' : '600px'}
		});
	},
	cancelWorkForm: function(id){
		html = shop.join
		('<div class="p20">')
			('<table border="0" class="orderTable" cellpadding="0" cellspacing="0" align="center" width="100%">')
				('<tr>')
					('<td valign="top">Lý do </td>')
					('<td><textarea name="crawler_note" id="crawler_note" class="rt_PostTablearea" style="width:350px;height:100px;padding:5px"></textarea></td>')
				('</tr>')
			('</table>')
		
			('<div align="center" class="mt28">')
				('<table><tr><td>')
					('<a href="javascript:void(0)" onclick="shop.customer.crawler.cancelWork('+id+', \'#crawler_note\')" class="rt_regiter_button">Xác nhận Hủy việc</a>')
					('<a href="javascript:void(0)" onclick="shop.hide_overlay_popup(\'customer-partner\');" class="mLeft20">Bỏ qua</button>')
				('</td></tr></table>')('<div class="c"></div>')
			('</div>')
		('</div>')
		();
		shop.show_overlay_popup('customer-partner',"Lý do hủy", shop.popupSite('customer-partner',"Lý do hủy",html), {
			background: {'background-color' : 'transparent'},
			border: {
				'background-color' : 'transparent',
				'padding' : '0px'
			},
			title: {'display' : 'none'},
			content: {
				'padding' : '0px',
				'width' : '500px'
			}
		});
	},
	cancelWork: function (id, ipt_note){
		note = jQuery(ipt_note).val();
		if(note == ''){
			shop.show_popup_message('Bạn phải điền Ghi chú', "Thông báo lỗi",-1);
			return false;
		}
		shop.ajax_popup('act=crawler&code=cancelWork','POST',{id:id, note:note},function(j){
			alert(j.msg)
			if(j.err != -1){
				window.location.reload();
			}
		});
	},
	reportWork: function (crawler_id){
		if(confirm('Bạn có chắc chắn BÁO CÁO việc này không ?')){
			shop.ajax_popup('act=crawler&code=reportWork', 'POST', {id:crawler_id},function(j){
				if(j.err == -1){
					shop.show_popup_message(j.msg, "Thông báo lỗi",-1);
				}else{
					shop.show_popup_message(j.msg, "Thông báo", 1);
					window.location.reload();
				}
			});
		}
	},
	setWorkTime: function (){
		var work_time_def = jQuery('#work_time_def').val(),
		work_time = jQuery('#work_time').val();
		if(work_time_def != work_time){
			shop.confirm('Bạn có chắc chắn cập nhật THỜI GIAN LÀM VIỆC không?', function(){
				shop.ajax_popup('act=crawler&code=setWorkTime', 'POST', {workTime:work_time},function(j){
					if(j.err == -1){
						shop.show_popup_message(j.msg, "Thông báo lỗi",-1);
					}else{
						shop.show_popup_message(j.msg, "Thông báo", 1);
					}
				});
			});
		}
	},
	cancelForm:function(){shop.hide_all_popup()},
	theme:{
		form:function(id, title, close, opt, txt){
			html = shop.join
			('<form id="bm_register_form">')
				('<div class="content register_form" style="padding:1px 0 20px">')
					('<div id="cError"></div>')
					('<div class="reg_collapse">')
						('<div class="title">Mã Cho Thuê:</div>')
						('<div class="title">')
							('<table cellpadding="0" cellspacing="5">')
								('<tr>')
									('<td width="200"><input type="text" id="crawler_rent_id" name="crawler_rent_id" /></td>')
									('<td>(<font color="red">*</font>)</td>')
								('</tr>')
							('</table>')
						('</div>')
					('</div>')
					('<div class="mTop20">')
						('<div style="width:215px;margin:0 auto">')
							('<a id="fr" class="btBlack mLeft15" onclick="shop.customer.crawler.reportWork('+shop.customer.crawler.conf.crawler_id+', \'#crawler_rent_id\')" href="javascript:void(0)">Gửi thông tin</a>')
							('<a id="fr" class="btGray" onclick="shop.customer.crawler.cancelForm()" href="javascript:void(0)">Hủy bỏ</a>')
							('<div class="c"></div>')
						('</div>')
					('</div>')
				('</div>')
			('</form>')();
			if(txt){
				return html;
			}
			return shop.popupSite(id, title, html, close, opt);
		}
	}

};

shop.EmailSubscribe = {
	registerEmail: function(){
		var email = shop.util_trim(jQuery('#email').val());
		var provincesubscribe = jQuery('#provincesubscribe').val();
		var typesubscribe = jQuery('#typesubscribe').val();
		var district_id = jQuery('#subscribedistrict_id').val();
		var pricesubscribe = shop.util_trim(jQuery('#pricesubscribe').val());
		//Check Time 30p
		timeReg = shop.cookie.get('TIMEEMAILSUBCRIBE');
		//timeReg = '';
		if(!timeReg || (timeReg && TIME_NOW>parseInt(timeReg)+30*60)){
			if(shop.EmailSubscribe.validRegister()){
				shop.ajax_popup('act=customer&code=register-email',"POST",{email:email,provincesubscribe:provincesubscribe,typesubscribe:typesubscribe,pricesubscribe:pricesubscribe,district_id:district_id},
				function (j) {
					shop.hide_overlay_popup('regCity');
					if (j.err == 0) {
						shop.cookie.set('TIMEEMAILSUBCRIBE', TIME_NOW, 86400*365, '/');
						//jQuery('#formRegMail').slideUp('slow');
						//email.value = '';
					}
					alert(j.msg);
				});
			}
		}else{
			alert('Bạn vừa đăng ký nhận tin rồi');
		}
		
	},
	validRegister:function(){
		var email = shop.util_trim(jQuery('#email').val());
		if(email == ''){
			shop.error.set('#email', 'Chưa nhập email', 430, '.rt_FormShow');
			return false;
		}else if(!shop.is_email(email)){
			shop.error.set('#email', 'Email không hợp lệ', 430, '.rt_FormShow');
			return false;
		}else{
			shop.error.close('#email', '.rt_FormShow');
		}
		return true;
	}
}



/**
 * Luu va khoi phuc du lieu tren form search
 * @type Object
 */
shop.customer.searchOptions = {
	cookie_name:{
		city: 'search_city',			// Number
		district: 'search_district',	// String 1,2
		item_type: 'search_item_type',	// String 2,3
		price_range: 'search_price_range',
		nb_bed_room: 'search_nb_bed_room',
		nb_living_room: 'search_nb_living_room',
		tien_nghi: 'search_tien_nghi' // String
	},
	get:function(field) {
		var ck = shop.customer.searchOptions.cookie_name;
		if (typeof ck[field] === 'undefined') {
			return null;
		}
		return shop.cookie.get(ck[field]);
	},
	save:function(forForm){
		var u = {}, field;
		if (forForm == 'home') {
			u.city = jQuery('#province').val();
			u.district = jQuery('#district_id_list').val();
			u.item_type = jQuery('#type_id_list').val();
			u.price_range = jQuery('#price').val();
		} else if (forForm == 'search') {
			u.city = jQuery('#city_id').val();
			u.district = jQuery('#district_id_list').val();
			u.item_type = jQuery('#type_id_list').val();
			u.price_range = jQuery('#price').val();
			search_is_first =  shop.cookie.get('search_is_first')!=''?parseInt(shop.cookie.get('search_is_first')):1;
			if(search_is_first<4){
				shop.cookie.set('search_is_first', parseInt(search_is_first)+1, year, '/');
			}
			var arrId = ['tivi','thcap','dieuhoa','wifi','nhaxe','dichung','sanphoi','dirieng','maygiat'];
			var tiennghi = {};
			var selectTienNghi = false;
			for (var i in arrId) {
				if ($('#' + arrId[i]).is(':checked')) {
					tiennghi[arrId[i]] = 1;
					selectTienNghi = true;
				}
			}
			
			if (selectTienNghi) {
				u.tien_nghi = JSON.stringify(tiennghi);
			} else {
				u.tien_nghi = JSON.stringify(tiennghi);
			}
		} else if (forForm == 'map') {
			u.city = jQuery('#city_id').val();
			u.district = jQuery('#district_id_list').val();
			u.item_type = jQuery('#type_id_list').val();
			u.price_range = jQuery('#price').val();
			
			var arrId = ['tivi','thcap','dieuhoa','wifi','nhaxe','dichung','sanphoi','dirieng','maygiat'];
			var tiennghi = {};
			var selectTienNghi = false;
			for (var i in arrId) {
				if ($('#' + arrId[i]).is(':checked')) {
					tiennghi[arrId[i]] = 1;
					selectTienNghi = true;
				}
			}
			
			if (selectTienNghi) {
				u.tien_nghi = JSON.stringify(tiennghi);
			} else {
				u.tien_nghi = JSON.stringify(tiennghi);
			}
		} else if(forForm == 'wish'){
			u.city = jQuery('#city_id').val();
			u.district = jQuery('#district_id').val();
			u.price_range = jQuery('#price').val();
			u.songuoi = jQuery('#songuoi').val();

			var arrId = ['tivi','thcap','dieuhoa','wifi','nhaxe','dichung','sanphoi','dirieng','maygiat'];
			var tiennghi = {};
			var selectTienNghi = false;
			for (var i in arrId) {
				if ($('#' + arrId[i]).val()) {
					tiennghi[arrId[i]] = 1;
					selectTienNghi = true;
				}
			}
			
			if (selectTienNghi) {
				u.tien_nghi = JSON.stringify(tiennghi);
			} else {
				u.tien_nghi = JSON.stringify(tiennghi);
			}
		}
		var year = 86400*30*12;
		var ck = shop.customer.searchOptions.cookie_name;
		for (var i in shop.customer.searchOptions.cookie_name) {
			field = i;
			if(shop.is_exists(u[field])){
				shop.cookie.set(ck[field], u[field], year, '/');
			}
		}
	},
	restore:function(forForm) {
		var ck = shop.customer.searchOptions.cookie_name;
		var u = {}, field, val;
		for (var i in shop.customer.searchOptions.cookie_name) {
			field = i;
			val = shop.cookie.get(ck[field]);
			if (val != '') {
				u[field] = val;
			}
		}
		
		if (forForm == 'home') {
			if (shop.is_exists(u.city)) {
				jQuery('#province').val(u.city);
			}
			if (shop.is_exists(u.item_type)) {
				var arrTmp = u.item_type.split(',');
				for (var i in arrTmp) {
					jQuery('#type' + arrTmp[i]).attr('checked', true);
				}
				jQuery('#type_id_list').val(u.item_type);
			}
			if (shop.is_exists(u.price_range)) {
				var a = u.price_range.split(';');
				$(document).ready(function(){
//					slider_Restore.update({
//						from: a[0],
//						to: a[1]
//					}); 
					slider_Restore.update({to: a[1],from: a[0]});
					slider_Restore.options.onChange(slider_Restore.result);
				});
			}
		} else if (forForm == 'detail') {
			if (shop.is_exists(u.city)) {
				jQuery('#city_id').val(u.city);
			}
			
			if (shop.is_exists(u.item_type)) {
				var arrTmp = u.item_type.split(',');
				for (var i in arrTmp) {
					jQuery('#type' + arrTmp[i]).attr('checked', true);
				}
				jQuery('#type_id_list').val(u.item_type);
			}
			
			if (shop.is_exists(u.tien_nghi)) {
				u.tien_nghi = eval('(' + u.tien_nghi + ')');
				var arrId = ['tivi','thcap','dieuhoa','wifi','nhaxe','dichung','sanphoi','dirieng','maygiat'];
				for (var i in arrId) {
					if (shop.is_exists(u.tien_nghi[arrId[i]])) {
						$('#' + arrId[i]).attr('checked', true);
					}
				}
			}
			if (shop.is_exists(u.price_range)) {
				var a = u.price_range.split(';');
				
				$(document).ready(function(){
					slider_Restore.update({from: a[0],to: a[1]});
					slider_Restore.options.onChange(slider_Restore.result);
				});
			}
		} else if (forForm == 'search') {
			if (shop.is_exists(u.city)) {
				jQuery('#city_id').val(u.city);
			}
			if (shop.is_exists(u.district)) {
				jQuery('#district_id').val(u.district);
			}
			if (shop.is_exists(u.item_type)) {
				jQuery('#type').val(u.item_type);
			}
			
			if (shop.is_exists(u.tien_nghi)) {
				u.tien_nghi = eval('(' + u.tien_nghi + ')');
				var arrId = ['tivi','thcap','dieuhoa','wifi','nhaxe','dichung','sanphoi','dirieng','maygiat'];
				for (var i in arrId) {
					if (shop.is_exists(u.tien_nghi[arrId[i]])) {
						$('#' + arrId[i]).attr('checked', true);
					}
				}
			}
			if (shop.is_exists(u.price_range)) {
				var a = u.price_range.split(';');
				$(document).ready(function(){
					slider_Restore.update({to: a[1],from: a[0]});
					slider_Restore.options.onChange(slider_Restore.result);
				});
			}
		} else if (forForm == 'map') {
			if (shop.is_exists(u.city)) {
				jQuery('#city_id').val(u.city);
			}
			if (shop.is_exists(u.district)) {
				jQuery('#district_id').val(u.district);
			}
			if (shop.is_exists(u.item_type)) {
				jQuery('#type').val(u.item_type);
			}
			
			if (shop.is_exists(u.tien_nghi)) {
				u.tien_nghi = eval('(' + u.tien_nghi + ')');
				var arrId = ['tivi','thcap','dieuhoa','wifi','nhaxe','dichung','sanphoi','dirieng','maygiat'];
				for (var i in arrId) {
					if (shop.is_exists(u.tien_nghi[arrId[i]])) {
						$('#' + arrId[i]).attr('checked', true);
					}
				}
			}
		}
	}
};
/*JS click checkbox*/
//jQuery(document).ready(function () {
//	$( "ul li.rt_buil_iconLi" ).live('click', function() {
//		if ($(this).find('input').is( ":checked" ) ){
//			$(this).find('input').prop( "checked", false  );
//		}else{
//			$(this).find('input').prop( "checked", true );
//		}
//	});
//});