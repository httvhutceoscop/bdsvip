shop.header = {
  
};

shop.captcha = {
  img_id:'captcha',
  txt_id:'captcha_txt',
  reloadCaptcha:function(){
	var captcha = shop.get_ele(shop.captcha.img_id);
	if(captcha){
	  captcha.src = BASE_URL + 'captcha.php?w=80&h=28&l=5&r='+Math.random();
	}
  },
  validCaptcha:function(cb){
	var captcha = shop.get_ele(shop.captcha.txt_id);
	if(captcha){
	  if(shop.util_trim(captcha.value) != ''){
		shop.ajax_popup("act=index&code=valid-captcha",'POST', {str: captcha.value},
		  function(json){
			if(json.err == 0){
			  if(cb) cb()
			}else{
			  switch(json.msg){
				case 1: json.msg = 'Captcha chưa được khởi tạo'; break;
				case 2:
				  json.msg = 'Sai captcha quá nhiều, vui lòng nhập mã khác';
				  shop.captcha.reloadCaptcha();
				  break;
				case 3: json.msg = 'Captcha đã hết hạn! Vui lòng nhập mã khác';
				  shop.captcha.reloadCaptcha();
				  break;
				case 4: json.msg = 'Sai captcha! Vui lòng nhập lại'; break;
			  }
			  alert(json.msg);
			}
		  }
		);
	  }else{
		alert('Vui lòng nhập captcha để tiếp tục');
		captcha.focus();
	  }
	}else{
	  alert('Không tồn tại ô nhập captcha');
	}
  }
};

shop.button = {
  id:"btLoading",
  hide:function(id){
	var bt = shop.get_ele(shop.button.id);
	if(bt){
	  jQuery(bt).show();
	}else{
	  var obj = jQuery(id).parent();
	  obj.append('<img src="'+BASE_URL+'style/images/ajax-loader.gif" />');
	}
	jQuery(id).hide();
  },
  show:function(id){
	jQuery('#'+shop.button.id).hide();
	jQuery(id).show();
  },
  preload:function(){
	jQuery('body').append('<img class="hidden" src="'+BASE_URL+'style/images/ajax-loader.gif" />');
  }
};
function shortPriceSlider(value){
	if(value >=1000000){
		value = (value/1000000 + ' triệu').replace('.',',');
	}else{
		value = jQuery.formatNumber(value, {format:"###,###,###", locale:"vi"});
		if(value == '') value = 0;
	}
	
	return value;
};
function shortPriceSlider_html(value){
	if(value >10000000){
		value = '<span style="font-weight: normal">Trên </span>10  <span>triệu</span>';
	}else if(value >=1000000){
		value = (value/1000000 + ' <span>triệu</span>').replace('.',',');
	}else{
		value = jQuery.formatNumber(value, {format:"###,###,###", locale:"vi"});
		if(value == '') value = 0;
	}
	
	return value;
};
function rt_slideToggle(id){
	if (typeof id == 'undefined'){
		jQuery('.rt_os_Gen').hide();
	}else{
		jQuery( ".rt_os_Gen" ).each(function() {
			if (jQuery(this).css('display') != 'none'){
				jQuery(this).hide();
			}else if(jQuery(this).attr("id")==id){
				jQuery('#'+id).slideToggle();
			}
		 });
		
	}
}
function taginput_focus(obj,type){
	jQuery(obj).find('div').css('display','none');
	if(type=='to'){
		jQuery('#rt_v3_Input_To').removeClass('hidden');
		jQuery('#rt_v3_Input_To').val(0).focus();

	}else{
		jQuery('#rt_v3_Input_Form').removeClass('hidden');
		jQuery('#rt_v3_Input_Form').val(0).focus();
	}
}
$(document).ready(function(){
	jQuery('#rt_v3_Input_Form').focusout(function() {
		jQuery('#rt_v3_Input_Form').addClass('hidden');
		jQuery('#rt_v3_BSValPrice_Form').find('div').css('display','block');
		var v = shop.util_trim(this.value);
		v = parseInt(v.replace(/,/gi, ''));
		if (!isNaN(v)&&v>0) {
			slider_Restore.update({from: v});
			slider_Restore.options.onChange(slider_Restore.result);
		}
	});
	jQuery('#rt_v3_Input_To').focusout(function() {
		jQuery('#rt_v3_Input_To').addClass('hidden');
		jQuery('#rt_v3_BSValPrice_to').find('div').css('display','block');
		var v = shop.util_trim(this.value);
		v = parseInt(v.replace(/,/gi, ''));
		if (!isNaN(v)&&v>0) {
			slider_Restore.update({to: v});
			slider_Restore.options.onChange(slider_Restore.result);
		}
	});
	$('.rt_v3_BSValPrice').find('input').live('keydown', function(e) {
		var keyCode = e.keyCode || e.which; 
		if (e.keyCode === 9) {
			var idswidth = $(this).parents("div").attr('id');
			if(idswidth==='rt_v3_BSValPrice_Form'){
				jQuery('#rt_v3_BSValPrice_to').find('div').css('display','none');
				jQuery('#rt_v3_Input_To').removeClass('hidden');
				jQuery('#rt_v3_Input_To').focus().val(0);
			}
			else if(idswidth==='rt_v3_BSValPrice_to'){
				jQuery('.rt_SearchHomea').focus();
				jQuery('.rt_v3_BL_BtnBorRadiusCam').focus();
			}
			e.preventDefault();
			// do work
		}
	});
});

