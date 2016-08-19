shop.header = {
	conf: {city: [], message: []},
	city: {
		conf: {
			city: 0,
			safe: '',
			city_cookie: 'cityRento'
		},
		menuCity: function(obj, over) {
			if (over) {
				jQuery(obj).addClass('headerCityOver');
				jQuery('.content', obj).removeClass('hidden');
			} else {
				jQuery('.content', obj).addClass('hidden');
				jQuery(obj).removeClass('headerCityOver');
			}
		},
		cityPopSelect: function(aTagEle, city_id) {
			jQuery('.rt_reg_title a').css('color', '#535353');
			jQuery(aTagEle).css('color', 'red');
			jQuery('#popCityID').val(city_id);
		},
		reSetupCity: function(id) {
			var cityArr = eval("(" + shop.header.conf.city + ')'),
					html = '',
					def = null;
			id = id == 0 ? shop.cookie.get(shop.header.city.conf.city_cookie) : id;
			if (id > 0) {
				for (var i = 0; i < cityArr.length; i++) {
					if (cityArr[i].i != 0) {
						if (cityArr[i].i == id) {
							def = cityArr[i];
						} else {
							html += '<a href="javascript:void(0);" onclick="shop.header.city.setCity(' + cityArr[i].i + ',\'' + cityArr[i].s + '\')"' + ((i == cityArr.length - 2) ? ' id="noBoder"' : '') + '>' + cityArr[i].t + '</a>';
						}
					}
				}
				if (def) {
					jQuery('.currentBg').html(def.t).attr('id', id);
					jQuery('.mainSublist').html(html);
				}
			}
		},
		start: function() {
			var city = shop.cookie.get(shop.header.city.conf.city_cookie);
			if (city == '' || city == 0) {
				shop.show_overlay_popup('popcityemail', '', shop.header.theme.popupCity(),
				{
					background: {'background-color': 'transparent'},
					border: {
						'background-color': 'transparent',
						'padding': '0px'
					},
					title: {'display': 'none'},
					content: {
						'padding': '0px',
						'width': '431px',
						'height': '233px'
					},
					esc: false
				});
			}
		},
		setCity: function(id, safe_title) {
			if (IS_CUSTOMER_LOGIN) {
				shop.header.city.redirect(id, safe_title);
			} else {
				shop.header.city.conf.city = id;
				shop.header.city.conf.safe = safe_title;
				//chuyen sang nhap email
				var city = shop.cookie.get(shop.header.city.conf.city_cookie);
				if (city == '' || city == 0) {
					shop.header.city.start();
				} else {
					shop.header.city.redirect(id, safe_title);
				}
			}
		},
		redirect: function(id, safe_title) {
			shop.cookie.set(shop.header.city.conf.city_cookie, id, 86400*30, '/');
			if(query_string == '?' || query_string.indexOf(escape('province=')) != -1){
				//neu o trang chu thi redirect ve dung tinh thanh
				if(shop.is_ie6()){
					setTimeout(function(){window.location = BASE_URL + safe_title}, 0);
				}else{
					window.location.href = BASE_URL + safe_title;
				}
			}else{
				window.location.reload(); // neu dang o 1 trang nao do thi reload lai
			}
		},
		finish: function() {
			var city = jQuery('#popCityID').val(), tq = false,
					cityArr = eval("(" + shop.header.conf.city + ')');
			if (city == 0) {
				alert('Quý khách vui lòng chọn Tỉnh/Thành phố');
			} else {
				//TH khach o tinh khac chuyen sang tab toan quoc
				if (city == -1) {
					city = 22;
					shop.cookie.set(shop.header.city.conf.city_cookie, city, 86400 * 30, '/');
					shop.cookie.set('showRegEmail', 'not', 86400 * 365, '/');
					shop.redirect(BASE_URL + 'toan-quoc.html');
					return;
				} else {
					//TH khach chon tinh thanh co VP muachung
					for (var i = 0; i < cityArr.length; i++) {
						if (cityArr[i].i == city) {
							shop.cookie.set(shop.header.city.conf.city_cookie, city, 86400 * 30, '/');
							shop.cookie.set('showRegEmail', 'not', 86400 * 365, '/');
							shop.header.city.redirect(city, cityArr[i].s);
							return;
						}
					}
					alert("Tỉnh thành quý khách chọn không hợp lệ");
				}
			}
		}
	},
	message: {
		start: function() {
			if(IS_CUSTOMER_LOGIN){
				shop.ajax_popup('act=customer&code=getMessage','POST',{}, function(j){
					if(j.err == 0){
						shop.header.conf.message = j.data;
						shop.header.message.show();
					}
				});
			}
		},
		show: function () {
			var data = shop.header.conf.message, first = {};
			for (var key in data) {
			    first = data[key];
			    if(typeof(first) !== 'function') {
			        break;
			    }
			}

			if(shop.is_obj(first) && first.id){
				shop.show_overlay_popup('popcityMessage'+first.id, '', shop.header.theme.popupMessage(first),
				{
					background: {'background-color': 'transparent'},
					border: {'background-color': 'transparent','padding': '0px'},
					title: {'display': 'none'},
					content: {'padding': '0px','width': '431px','height': '233px'},
					esc: false
				});
			}
		},
		read: function(id){
			shop.ajax_popup('act=customer&code=readMessage','POST',{id: id}, function(j){
				if(j.err == 0){
					shop.hide_popup('popcityMessage'+id);
					delete shop.header.conf.message[id];
					shop.header.message.show();
				}
			});
			//console.log(shop.header.conf.message);
		}
	},
	theme: {
		popupMessage: function(data) {
			return shop.join
				('<div id="popupMessage" class="popupCity">')
					('<div class="rt_popupBox">')
						('<div class="rt_popupBox_Title">')
							('<div class="rt_popup_Title">'+ data.title +'</div>')
						('</div>')
						('<div class="rt_popup_Content">')
							('<div class="rt_popup_ContentLogin">')
								('<div class="rt_regiterCon">')
									('<div>'+data.content+'</div>')
									('<div align="center" class="rt_regiter_Submit">')
										('<a href="javascript:void(0)" class="rt_regiter_button" onclick="shop.header.message.read('+data.id+')">Đã đọc</a>')
									('</div>')
								('</div>')
							('</div>')
						('</div>')
					('</div>')
				('</div>')();
		},
		popupCity: function() {
			var html_city = '',
					cityArr = eval("(" + shop.header.conf.city + ')');
			for (var i = 0; i < cityArr.length; i++) {
				if (cityArr[i].i != 0) {
					html_city += shop.join
					('<div class="rt_regiter_input">')
						('<span class="rt_reg_title"><a href="javascript:void(0);" onclick="shop.header.city.cityPopSelect(this, ' + cityArr[i].i + ')">' + cityArr[i].t + '</a></span>')
					('</div>')
					();
				}
			}
			
			return shop.join
					('<div id="popupTQ" class="popupCity">')
						('<div class="rt_popupBox">')
							('<div class="rt_popupBox_Title">')
								('<div class="rt_popup_Title">')
									('Chọn khu vực')
									('<input type="hidden" id="popCityID" value="0" />')
								('</div>')
								//('<a class="rt_poLinkClose" href="javascript:void(0)"><i class="rt_iconPOclose"></i></a>')
							('</div>')
							('<div class="rt_popup_Content">')
								('<div class="rt_popup_ContentLogin">')
									('<div class="rt_regiterCon">')
										(html_city)
										('<div align="center" class="rt_regiter_Submit">')
											('<a href="javascript:void(0)" class="rt_regiter_button" onclick="shop.header.city.finish()">Hoàn tất</a>')
										('</div>')
									('</div>')
								('</div>')
							('</div>')
						('</div>')
					('</div>')();
		}
	}
};

function showInfoBoss(id){
	try {
		ga('send', 'event', 'button', 'click', 'bam_de_hien_so');
	} catch (ex) {}
	$.ajax({
		async: false,
		type: "POST",
		url: "ajax.php?act=index&code=get-infoBoss",
		data: {
			id: id
		},
		timeout: 4000,
		cache: true,
		dataType: "json",
		success: function(obj) {
			var mobile = '';
			if(obj.mobile==obj.mobile2){
				mobile = obj.mobile;
			}else{
				if(obj.mobile!=''){
					mobile = obj.mobile;
				}
				if(obj.mobile2!=''){
					if(obj.mobile!=''){
						mobile += ' - ';
					}
					mobile += obj.mobile2;
				}
			
			}
			var email = obj.email;
			jQuery('.rt_jsShowCus').hide();
			jQuery('.rt_v2_D_InfoBoss').show();
			if(URL_PARAMS['page']=="yeu_thich"){
				email = email.substring(0, 18);
				mobile = (obj.mobile!='')?obj.mobile:(obj.mobile2!=''?obj.mobile2:obj.homephone);
			}
			jQuery('#rtname'+id).html(obj.fullname).fadeIn(1000);
			jQuery('#rtphone'+id).html('<a href="tel:'+mobile+'">'+mobile+'</a>').fadeIn(1000);
			jQuery('#rtphone2'+id).html(obj.homephone).fadeIn(1000);
			jQuery('#rtemail'+id).html('<a href="mailto:'+email+'">'+email+'</a>').fadeIn(1000);
			
			jQuery('#v2rtname'+id).html(obj.fullname).fadeIn(1000);
			jQuery('#v2rtphone'+id).html('<a href="tel:'+mobile+'">'+mobile+'</a>').fadeIn(1000);
			jQuery('#v2rtphone2'+id).html(obj.homephone).fadeIn(1000);
			jQuery('#v2rtemail'+id).html('<a href="mailto:'+email+'">'+email+'</a>').fadeIn(1000);
			jQuery('#rt_showBoxBuild_ii').html('<div class="rt_v4_BuildTextInfo">Khi liên hệ với chủ nhà, bạn hãy nói tìm thấy tin này trên <b>rento.vn</b> nhé!<i class="bon_v2_SeaNoArrow"></i></div>').fadeIn(1000);
			jQuery('#rt_showBoxBuild_ii2').html('<div class="rt_v4_BuildTextInfo">Khi liên hệ với chủ nhà, bạn hãy nói tìm thấy tin này trên <b>rento.vn</b> nhé!<i class="bon_v2_SeaNoArrow"></i></div>').fadeIn(1000);
			
		}
	});
}
function send_feedback(item_id,type){
	if(type===1){
		var bds_type = jQuery('#rt_idTypeBDS').text();
		jQuery.ajax({
			async: false,
			type: "POST",
			url: "ajax.php?act=customer&code=sendfeedback",
			data: {
				item_id: item_id,
				type_ck:type
			},
			timeout: 4000,
			cache: true,
			dataType: "json",
			success: function(obj) {
				if(obj.err == 0){
					shop.show_overlay_popup('pop-feedback', 'Phản hồi',
						shop.join('<div class="rt_pop_Feedback">')
									('<div class="classic-popup-title" style="background-color: #FFF">')
										('<div class="fl">Phản hồi về thông tin của '+bds_type+'</div>')
										('<a href="javascript:void(0)" class="classic-popup-close" title="Đóng" onclick="shop.hide_overlay_popup(\'pop-feedback\');">x</a><div class="c"></div>')
									('</div>')
									('<div class="classic-popup-content">')
									('<div class="rt-fb-content">')
										('<div id="cError"></div>')
										('<input type="hidden" name="idfeed" id="idfeed" value="'+obj.id+'">')
										('<ul id="labelcheckfb" class="rt_fbtype">')
											('<li>')
												('<input onclick="changeOptionType()" type="radio" name="fb_type" id="nocall" class="rt_radioCss" value="1">')
												('<label for="nocall" class="rt_csslabel">Không liên lạc được</label>')
											('</li>')
											('<li>')
												('<input onclick="changeOptionType()" type="radio" name="fb_type" id="houserent" class="rt_radioCss" value="2">')
												('<label for="houserent" class="rt_csslabel">Nhà đã cho thuê</label>')
											('</li>')
											('<li>')
												('<input onclick="changeOptionType()" type="radio" name="fb_type" id="housenodes" class="rt_radioCss" value="3">')
												('<label for="housenodes" class="rt_csslabel">Nhà không đúng như mô tả</label>')
											('</li>')
										('</ul>')
										('<div class="c"></div>')
									('</div>')
									('<div class="rt-fb-contentBuild">')
										('<input id="fb_email" name="fb_email" type="text" placeholder="Số điện thoại của bạn" class="rt_fbinput"/>')
										('<div class=""><textarea id="fb_content" name="fb_content" placeholder="ý kiến phản hồi" class="rt_fbtextarea"/></textarea></div>')
									('</div>')
									('<div class="rt-fb-content mTop15 mBottom15" align="center">')
										('<input type="button" value="Gửi" onclick="send_feedback('+item_id+',2)" class="cur_pointer rt_regiter_button rt_Fixregiter_button">')
									('</div>')
									('<div class="c"></div>')
								('</div>')
							('</div>')(),
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
								'width' : '635px'
							}
						}
					);
				}
			}
		});
		
	}else{
		var radio = jQuery('input[name=fb_type]:checked').val();
		var idfeed = shop.util_trim(jQuery('#idfeed').val());
		if(radio===undefined){
			shop.error.set('#labelcheckfb', 'Bạn hãy chọn nguyên nhân phản hồi', 400, '.rt_pop_Feedback');
			return false;
		}else{
			shop.error.close('#labelcheckfb', '.rt_pop_Feedback');
		}
		var email = shop.util_trim(jQuery('#fb_email').val());
//		if(email == ''){
//			var $msg = 'Chưa nhập email!';
//			shop.error.set('#fb_email', $msg, 400, '.rt_pop_Feedback');
//			return false;
//		}else if(!shop.is_email(email)){
//			var $msg = 'Email không hợp lệ!';
//			shop.error.set('#fb_email', $msg, 400, '.rt_pop_Feedback');
//			return false;
//		}else{
//			shop.error.close('#fb_email', '.rt_pop_Feedback');
//		}
		var content = jQuery('#fb_content').val();
//		if(content == ''){
//			var $msg = 'Chưa nhập nội dung phản hồi!';
//			shop.error.set('#fb_content', $msg, 400, '.rt_pop_Feedback');
//			return false;
//		}else{
//			shop.error.close('#fb_content', '.rt_pop_Feedback');
//		}
		jQuery.ajax({
			async: false,
			type: "POST",
			url: "ajax.php?act=customer&code=sendfeedback",
			data: {
				item_id: item_id,
				type: radio,
				email: email,
				content: content,
				id_feed:idfeed,
				type_ck:type
			},
			timeout: 4000,
			cache: true,
			dataType: "json",
			success: function(obj) {
				if(obj.err == 0){
					alert('Cảm ơn bạn đã gửi phản hồi cho chúng tôi.');
					shop.hide_overlay_popup('pop-feedback');
				}else{
					//if(obj.msg=='falsetime'){
						alert('Bạn đã gửi phản hồi cho bất động sản này rồi.');
					//}
				}
			}
		});
	}
}
function changeOptionType(){
	var radio = jQuery('input[name=fb_type]:checked').val();
	var idfeed = shop.util_trim(jQuery('#idfeed').val());
	if(radio!==undefined){
		jQuery.ajax({
			async: false,
			type: "POST",
			url: "ajax.php?act=customer&code=updateTypefeedback",
			data: {
				id_feed: idfeed,
				type: radio,
			},
			timeout: 4000,
			cache: true,
			dataType: "json",
			success: function(obj) {
				
			}
		});
	}
}
function submitContachrb(frm){
	var fullname = frm.fullname.value;
	var email = shop.util_trim(jQuery('#email').val());
	var mobile = frm.mobile.value;
	var source_link = shop.util_trim(jQuery('#source_link').val());
	var id = shop.util_trim(jQuery('#id').val());
	if(fullname==''&&mobile==''){
		if(fullname==''){
			alert('Bạn chưa nhập tên');
			frm.fullname.focus();
		}else if(mobile==''){
			alert('Bạn chưa nhập số điện thoại');
			frm.fullname.focus();
		}
	}else{
		shop.show_loading();
		jQuery.ajax({
			async: false,
			type: "POST",
			url: "ajax.php?act=customer&code=submitcontactRongbay",
			data: {
				fullname: fullname,
				email: email,
				mobile: mobile,
				source_link: source_link,
				id: id
			},
			timeout: 4000,
			cache: true,
			dataType: "json",
			success: function(obj) {
				if(obj.err == 0){
					jQuery( "#id" ).val(obj.id);
					alert('Cảm ơn quý khách đã quan tâm tới dịch vụ của Rento.vn! Chăm sóc khách hàng của chúng tôi sẽ liên hệ với quý khách trong 2h tới');
				}else{
					alert('Bạn đã gửi thông tin cho Rento.vn trước rồi. Rento.vn sẽ liên lạc với bạn ngay sau 2h.');
				}
				shop.hide_loading();
			}
		});
	}
}

shop.search={
    showsearch:function (){
        if (jQuery('#p3_textefffff').css('display') != 'none') {
            jQuery('.p3_menu_search').css('margin-top','6px');
            jQuery('.rt_v2_InputSearch').show();
            $(".rt_v2_InputSearch").animate({right: '78px'});
            $(".p3_slogan_button").animate({left: '-10px'}, 760);
            $( "#widthabc" ).animate({
                width: "485px"
              }, 880);
            jQuery('.rt_v2_InputText').show();
            jQuery('.p3_menu_search').html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ẩn&nbsp;&nbsp;&nbsp;&nbsp;');
            jQuery('#p3_textefffff').fadeOut(800);
            jQuery('#keyword').focus();
        }else{
            jQuery('#p3_textefffff').fadeIn(600);
            $(".p3_slogan_button").animate({left: '330'}, 360);
            $(".p3_slogan_button").animate({right: '-142px'});
            jQuery('.p3_menu_search i').show();
            jQuery('.p3_menu_search').css('margin-top','0');
            jQuery('.rt_v2_InputSearch').hide();
            $( "#widthabc" ).css('width','auto');
            jQuery('.p3_menu_search').html('<i></i>&nbsp;Tìm kiếm');
        }
        jQuery('#sugger_text').hide();
    },
    sugger:function (obj){
       
        var key = jQuery(obj).val();
        key = key.replace(/\+/gi,' '); // khi lay ve dau cach thanh +
        key = decodeURIComponent(key);
        if (key != ''&&key != 'Tìm kiếm theo từ khóa...'){
            //link = BASE_URL+'bat-dong-san.html?type_id=1'
            html = '<li><a href="'+BASE_URL+'bat-dong-san/nha-tro-phong-tro.html?type_id=1&amp;keyword='+key+'">Tìm: "<em style="font-weight: 400">'+key+'</em>" trong <b>Nhà trọ, Phòng trọ</b></a></li><li><a href="'+BASE_URL+'bat-dong-san/can-ho-chung-cu.html?type_id=3&amp;keyword='+key+'">Tìm: "<em style="font-weight: 400">'+key+'</em>" trong <b>Căn hộ, Chung cư</b></a></li><li><a href="'+BASE_URL+'bat-dong-san/nha-rieng.html?type_id=6&amp;keyword='+key+'">Tìm: "<em style="font-weight: 400">'+key+'</em>" trong <b>Nhà riêng</b></a></li><li><a href="'+BASE_URL+'bat-dong-san/nha-mat-pho-mat-ngo.html?type_id=8&amp;keyword='+key+'">Tìm: "<em style="font-weight: 400">'+key+'</em>" trong <b>Nhà mặt phố, mặt ngõ</b></a></li><li><a href="'+BASE_URL+'bat-dong-san/cua-hang-ki-ot.html?type_id=9&amp;keyword='+key+'">Tìm: "<em style="font-weight: 400">'+key+'</em>" trong <b>Cửa hàng, Ki ốt</b></a></li><li><a href="'+BASE_URL+'bat-dong-san/van-phong.html?type_id=10&amp;keyword='+key+'">Tìm: "<em style="font-weight: 400">'+key+'</em>" trong <b>Văn phòng</b></a></li>';
            jQuery('#sugger_text').html(html).fadeIn();
            jQuery("#btn_submit").prop("type","submit");
        }else{
             jQuery('#sugger_text').hide();
             jQuery("#btn_submit").prop('type','button');
        }
    }
}

jQuery(document).ready(function(){
	jQuery('#keyword').keyup(function(){
		shop.search.sugger(this);
	});

});