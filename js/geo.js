//var geocoder = new google.maps.Geocoder(), LatLng;
shop.geo = {
	listDistrict: new Array(),
	listDistrictDropdown: {},
	listStreet: new Array(),
	listStreetDropdown: {},
	error: function(msg) {
		shop.debug(msg);
		alert('Kéo xuống dưới cùng xem lỗi');
	},
	getPlaces: function(cb){
		if(confirm("Để dùng tính năng lấy địa chỉ tự động, bạn phải bấm "+(jQuery.browser.mozilla?'Share Location':'Allow')+" (Cho phép) trên trình duyệt")){
			if(navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(function(position){
					LatLng =  new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					geocoder.geocode({'latLng': LatLng}, function(results, status) {
						if (status == google.maps.GeocoderStatus.OK) {
							data = {
								address: results[0].formatted_address,
								latLng_jb: results[0].geometry.location.jb,
								latLng_kb: results[0].geometry.location.kb
							};
							shop.geo.fetchAddress(data, cb);
						} else {
							alert("Geocoder failed due to: " + status);
						}
					});
				}, shop.geo.error);
			} else {
				error('not supported');
			}
		}
	},
	fetchAddress: function(data, cb) {
		shop.ajax_popup("act=geo&code=geoToForm","POST",data,
		function(j){
			if(j.err == -1){
				alert(j.msg);
			}else{
				if(cb)	cb(j.data)
			}
		});
	},
	loadDistrict:function(city_id, cb){
		if(city_id > 0){
			var key = 'listDistrict'+city_id;
			jQuery.jCache.maxSize = 20;
			shop.geo.listDistrict = jQuery.jCache.getItem(key);
			if(!shop.geo.listDistrict){
				shop.ajax_popup('act=geo&code=loadDistrict',"POST",{city_id:city_id},
				function (j) {
					shop.geo.listDistrict = j;
					shop.geo.listDistrictDropdown = j;
					jQuery.jCache.setItem(key, shop.geo.listDistrict);
					if(cb) cb();
				});
			}else{
				shop.geo.listDistrictDropdown = shop.geo.listDistrict;
				if(cb) cb();
			}
		}
	},
	loadDistrictDropdown:function(city_id, container_id, cb, def){
		if(city_id > 0){
			jQuery.jCache.maxSize = 20;
			var key = 'listDistrictDropdown'+city_id;
			
			shop.geo.listDistrictDropdown = jQuery.jCache.getItem(key);
			if(!shop.geo.listDistrictDropdown){
				shop.ajax_popup('act=geo&code=loadDistrictDropdown',"POST",{city_id:city_id},
				function (j) {
					shop.geo.listDistrict = j;
					shop.geo.listDistrictDropdown = j;
					//set cached
					jQuery.jCache.setItem(key, j);
					//tao theme
					def = shop.geo.theme.district(container_id, j, def, city_id);
					//goi callback
					if(cb) cb(def, city_id);
				});
			}else{
				shop.geo.listDistrict = shop.geo.listDistrictDropdown;
				def = shop.geo.theme.district(container_id, shop.geo.listDistrictDropdown, def, city_id);
				if(cb) cb(def, city_id);
			}
		}
	},
	loadStreet:function(district_id, cb){
		if(district_id > 0){
			var key = 'listStreet'+district_id;
			jQuery.jCache.maxSize = 20;
			shop.geo.listStreet = jQuery.jCache.getItem(key);
			if(!shop.geo.listStreet){
				shop.ajax_popup('act=geo&code=loadStreetDropdown',"POST",{district_id:district_id},
				function (j) {
					shop.geo.listStreet = j;
					shop.geo.listStreetDropdown = j;
					jQuery.jCache.setItem(key, shop.geo.listStreet);
					if(cb) cb();
				});
			}else{
				shop.geo.listStreetDropdown = shop.geo.listStreet;
				if(cb) cb();
			}
		}
	},
	loadStreetDropdown:function(district_id, container_id, cb, def){
		if(district_id > 0){
			var key = 'listStreetDropdown'+district_id;
			jQuery.jCache.maxSize = 20;
			shop.geo.listStreetDropdown = jQuery.jCache.getItem(key);
			if(!shop.geo.listStreetDropdown){
				shop.ajax_popup('act=geo&code=loadStreetDropdown',"POST",{district_id:district_id},
				function (j) {
					shop.geo.listStreet = j;
					shop.geo.listStreetDropdown = j;
					//set cached
					jQuery.jCache.setItem(key, j);
					//tao theme
					def = shop.geo.theme.street(container_id, j, def, district_id);
					//goi callback
					if(cb)	cb(def, district_id)
				});
			}else{
				shop.geo.listStreet = shop.geo.listStreetDropdown;
				//tao theme
				def = shop.geo.theme.street(container_id, shop.geo.listStreetDropdown, def, district_id);
				//goi callback
				if(cb)	cb(def, district_id)
			}
		}
	},
	loadStreetToSuggest: function(district_id, city_id, street_con) {
		if(district_id > 0 && city_id > 0){
			street_con = '#' + (street_con ? street_con : 'cart_street');
			if(city_id != 22){
				jQuery(street_con).unautocomplete();
				return;
			}
			var CURRENT_STREET_LIST = [];
			shop.ajax_popup('act=geo&code=loadStreet',"GET",{district_id: district_id},
			function (data) {
				shop.hide_loading();
				jQuery(street_con).unautocomplete();
				if(data){
					for (var index in data) {
						CURRENT_STREET_LIST.push(data[index]);
					}
					jQuery(street_con).autocomplete(CURRENT_STREET_LIST, {
						width: 224,
						matchContains: true,
						minChars: 1
					});
				}
			});
		}
	},
	loadWardToSuggest: function(ele,currentWard) {
		shop.show_loading();
		var CURRENT_WARD_LIST = [];
		$.ajax({
			async: false,
			type: "POST",
			url: "ajax.php?act=geo&code=loadWard",
			data: {
				district_id: ele
			},
			timeout: 4000,
			cache: true,
			dataType: "json",
			success: function(obj){
				if(obj.data!=''){
					$el = jQuery("#wards_id");
					$el.empty(); // remove old options
					if(obj.data){
						var data = obj.data;
						for (var index in data) {
							CURRENT_WARD_LIST.push(data[index]);
						}
						$el.append($("<option></option>").attr("value", '').text('--Chọn xã/phường--'));
						jQuery.each(CURRENT_WARD_LIST, function(key, value) {
							if (value == currentWard) isMe = true;
							else isMe = false;
						$el.append($("<option></option>")
							.attr("value", value).attr("selected", isMe).text(value));
						});
					}
				}else{
					$el = jQuery("#wards_id");
					$el.empty(); // remove old options
				}
				//update uniform
				jQuery(document).ready(function(){
					if(shop.is_exists(jQuery.uniform)){
						jQuery.uniform.update("#wards_id");
					}
				});
			},
			error: function() {}
		}
		);		
		shop.hide_loading();
	},
	theme:{
		district: function(container_id, j, def, city){
			var is_num = def && shop.is_num(def),
			sl = false,
			districtOpt = '',
			defaultOpt = '<option value="0">-- Chọn Quận/Huyện --</option>';
			for(var i in j){
				if(is_num){
					sl = def == j[i].id;
				}else{
					sl = def == j[i].title;
					if(sl){
						def = j[i].id;
					}
				}
				districtOpt += '<option value="'+j[i].id+'"'+(sl?" selected":"")+'>'+j[i].title+'</option>';
			}
			
			jQuery("#"+container_id).html(defaultOpt+districtOpt);
			
			//update uniform
			jQuery(document).ready(function(){
				if(shop.is_exists(jQuery.uniform)){
					jQuery.uniform.update("#"+container_id);
				}
			});
			return def;
		},
		street: function(container_id, j, def, district){
			var is_num = def && shop.is_num(def),
			sl = false,
			streetOpt = '',
			defaultOpt = '<option value="0">-- Chọn Đường/phố --</option>';
			for(var i in j){
				if(is_num){
					sl = def == i;
				}else{
					sl = def == j[i];
					if(sl){
						def = i;
					}
				}
				streetOpt += '<option value="'+i+'"'+(sl?" selected":"")+'>'+j[i]+'</option>';
			}
			jQuery("#"+container_id).html(defaultOpt+streetOpt);
			//update uniform
			if(shop.is_exists(jQuery.uniform)){
				jQuery.uniform.update("#"+container_id);
			}
			return def;
		}
	}
};

shop.geo.popupMap = function (lat, lng) {
	var id = 'pop-map';
	var latlng = '' + lat + ',' + lng;
	var urlGMap = 'http://maps.googleapis.com/maps/api/staticmap?center=' + latlng + '&zoom=16&size=400x400&markers=color:blue|label:R|' + latlng;
	var html = shop.popupSite(id, 'Vị trí trên bản đồ', shop.join
				('<div class="content forgot_pasword" style="padding:20px">')

					('<div style="width: 400px;height:400px"><img src="' + urlGMap + '" width="400" height="400" alt="Ảnh địa điểm trên Google Map" /></div>')

				('</div>')
			());
	shop.show_overlay_popup(id, '',
		html,
		{
			background: {'background-color' : 'transparent'},
			border: {
				'background-color' : 'transparent',
				'padding' : '0px'
			},
			title: {'display' : 'none'},
			content: {
				'padding' : '0px',
				'width' : shop.is_ie6() ? '460px' : '440px'
			},
			release:function(){

			}
		});
};

var mapHereLoc, infoWindowHereLoc;
shop.geo.popupMapListing = function (lat, lng) {
	
	var id = 'pop-map';
	var html = shop.popupSite(id, 'Vị trí trên bản đồ', shop.join
				('<div class="content forgot_pasword" style="padding:10px">')
					('<div id="map-here-loc" style="width: 720px;height:400px"></div>')
					('<div class="rt_buildiengiai">')
						('<ul>')
							('<li><i class="rt_icondiadiembds"></i>Vị trí BĐS</li>')
							('<li><i class="rt_iconcongvien"></i>Công viên</li>')
							('<li><i class="rt_iconbenhvien"></i>Bệnh viện</li>')
							('<li><i class="rt_icontruonghoc"></i>Trường học</li>')
                                                        ('<li><i class="rt_iconbank"></i>Ngân hàng</li>')
                                                        ('<li><i class="rt_iconbus"></i>Bus</li>')
                                                        ('<li><i class="rt_icongym"></i>Gym</li>')
                                                        ('<li><i class="rt_iconcafe"></i>Cafe</li>')
                                                        ('<li><i class="rt_iconmarket"></i>Siêu thị</li>')
                                                        ('<li><i class="rt_iconspa"></i>Spa</li>')
                                                        ('<li><i class="rt_icondoxe"></i>Parking</li>')
						('</ul>')
					('</div>')
				('</div>')
			());
	shop.show_overlay_popup(id, '',
		html,
		{
			background: {'background-color' : 'transparent'},
			border: {
				'background-color' : 'transparent',
				'padding' : '0px'
			},
			title: {'display' : 'none'},
			content: {
				'padding' : '0px',
				'width' : shop.is_ie6() ? '760px' : '740px'
			},
			release:function(){

			}
		});
	
	
	var pyrmont = new google.maps.LatLng(lat, lng);
	mapHereLoc = new google.maps.Map(document.getElementById('map-here-loc'), {
	  center: pyrmont,
	  zoom: 15,
	  scrollwheel:false
	});
	var options = {
		position: pyrmont,
		map: mapHereLoc,
		icon:  BASE_URL + 'style/images/marker/diadiemminh.png'
	};
	new google.maps.Marker(options);
	infoWindowHereLoc = new google.maps.InfoWindow();
	searchPlacesHereLoc(lat, lng);

	// draw circle
	var pyrmont = new google.maps.LatLng(lat, lng);
	var populationOptions = {
		strokeColor: '#FF0000',
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: '#FF0000',
		fillOpacity: 0.35,
		map: mapHereLoc,
		center: pyrmont,
		radius: 500 // met
	};
	var cityCircle = new google.maps.Circle(populationOptions);

};
function customByCat(cat){
    var al = ['hospital', 'school', 'university', 'bank', 'atm', 'bus_station', 'grocery_or_supermarket', 'gym', 'cafe', 'spa', 'parking'];
    switch (cat){
        case 1:
            al = ['hospital', 'school', 'university', 'bank', 'atm', 'bus_station', 'grocery_or_supermarket'];
            break;
        case 3:
            al = ['hospital', 'school', 'university', 'bank', 'atm', 'grocery_or_supermarket', 'gym', 'cafe', 'spa'];
            break;
        case 6:
            al = ['hospital', 'school', 'university', 'bank', 'atm', 'grocery_or_supermarket'];
            break;
        case 8:
            al = ['hospital', 'school', 'university', 'bank', 'atm', 'grocery_or_supermarket'];
            break;
        case 9:
            al = ['hospital', 'school', 'university', 'bank', 'atm'];
            break;
        case 10:
            al = ['bank', 'atm', 'grocery_or_supermarket', 'gym', 'cafe', 'spa'];
            break;
    }
    return al;
}

function searchPlacesHereLoc(lat, lng, cat) {
	var service = new google.maps.places.PlacesService(mapHereLoc);
	var al = customByCat(cat);
    //alert(cat_id);
	var request = {
		location: new google.maps.LatLng(lat, lng),
		radius: 1000,
		types: al
	};
	//______PUB_LOCS = [];
	service.nearbySearch(request, callbackHereLoc);
}

function callbackHereLoc(results, status, pagination) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
	drawTableListPubLocs(results);
	var total = results.length;
	for (var i = 0; i < total; i++) {
	  createMarkerHereLoc(results[i]);
	  //______PUB_LOCS.push(results[i]);
	}
	if (total > 0) {
		//mapHereLoc.panTo(results[total-1].geometry.location);
	}
  }
  
  /*
  if (pagination.hasNextPage) {
    sleep:2;
	pagination.nextPage();
  } else {
	  drawTableListPubLocs(______PUB_LOCS);
  }
  */
}

function drawTableListPubLocs(results) {
	var placeBegin = new google.maps.LatLng($('#item_lat').val(),$('#item_lng').val());
	//var geocoder = new google.maps.Geocoder();
	var obj = {'hospital': [], 'school': [], 'university': [], 'park': [], 'bank': [], 'atm': [], 'bus_station': [], 'grocery_or_supermarket': [], 'gym':[], 'cafe':[], 'spa':[]};
	var objTitle = {'hospital': 'Bệnh viện', 'school': 'Trường học', 'university': 'Trường học', 'park': 'Công viên', 'bank': 'Ngân hàng, cây ATM', 'bus_station': 'Bến xe Buýt', 'grocery_or_supermarket': 'Siêu thị', 'gym': 'GYM', 'cafe': 'Cafe', 'spa': 'Spa'};
	var total = results.length, placeLoc, place;
	for (var i = 0; i < total; i++) {
		place = results[i];
		placeLoc = place.geometry.location;
		if (shop.in_array('hospital', place.types)) {
			obj.hospital.push(place);
		}
        else if (shop.in_array('school', place.types)) {
			obj.school.push(place);
		}
        else if (shop.in_array('university', place.types)) {
			obj.school.push(place);
		}
        else if (shop.in_array('park', place.types)) {
			obj.park.push(place);
		}
        else if (shop.in_array('atm', place.types)) {
			obj.bank.push(place);
		}
        else if (shop.in_array('bank', place.types)) {
			obj.bank.push(place);
		}
        else if (shop.in_array('bus_station', place.types)) {
            obj.bus_station.push(place);
        }
        else if (shop.in_array('grocery_or_supermarket', place.types)) {
            obj.grocery_or_supermarket.push(place);
        }
        else if (shop.in_array('spa', place.types)) {
            obj.spa.push(place);
        }
        else if (shop.in_array('cafe', place.types)) {
            obj.cafe.push(place);
        }
        else if (shop.in_array('gym', place.types)) {
            obj.gym.push(place);
        }
	}

    var al = customByCat(cat_id);
    var html_pam = shop.join()('<div class="p3_dt_title">Các tiện ích bản đồ trong khoảng bán kính <span data-bind="text: $root.RadiusDisplay">2km</span></div><div class="rt_tab_detail">')();
    var content_html_pam = '';
    var start =0;
    for (var i in al) {
            sKey = al[i];
            if (obj[al[i]].length > 0) {
                html_pam += shop.join()('<div onclick="showBoxTab_rtd(this,\''+("rt_tabcontent_detailMap"+i)+'\')" class="rt_tab_Build '+(start==0?'active':'')+'">'+objTitle[sKey]+'&nbsp;<span>('+obj[al[i]].length+')</span></div>')();
                var temp = shop.join
	('<div class="rt_tab_Build_content '+(start>0?'hidden':'')+'" id="'+("rt_tabcontent_detailMap"+i)+'"><table class="nb-table">')
	('<thead>')
		('<tr>')
			('<td width="380">'+objTitle[sKey]+'</td>')
			('<td width="510">Địa chỉ</td>')
			('<td width="196">Khoảng cách</td>')
		('</tr>')
	('</thead>')
	('<tbody>')();
                for (var j in obj[al[i]]) {
                    place = obj[al[i]][j];
                    placeLoc = place.geometry.location;
                    var distance = google.maps.geometry.spherical.computeDistanceBetween(placeBegin, placeLoc);
                    var distanceText = parseFloat(distance).toFixed(2) + ' m';
                    if (distance > 1000) {
                            distanceText = parseFloat(distance/1000).toFixed(2) + ' km';
                    }
                    temp += shop.join
                        ('<tr>')
                                ('<td width="380">' + place.name + '</td>')
                                ('<td width="510">' + place.vicinity + '</td>')
                                ('<td width="196">' + distanceText + '</td>')
                        ('</tr>')();
                }
                temp += shop.join
	('</tbody>')
	('</table><div class="c"></div></div>')();
                content_html_pam += temp;
                start++;
            }
	}
        html_pam += shop.join()('<div class="c"></div></div>')();
                
        document.getElementById('p3_list_push').innerHTML = html_pam+content_html_pam;
}

function createMarkerHereLoc(place) {
  var placeLoc = place.geometry.location;

  var iconText = 'marker';
  if (shop.in_array('hospital', place.types)) {
	  iconText = 'benhvien';
  } else if (shop.in_array('school', place.types)) {
	  iconText = 'truonghoc';
  } else if (shop.in_array('university', place.types)) {
	  iconText = 'truonghoc';
  } else if (shop.in_array('park', place.types)) {
	  iconText = 'congvien';
  } else if (shop.in_array('atm', place.types)) {
	  iconText = 'nganhang';
  } else if (shop.in_array('bank', place.types)) {
	  iconText = 'nganhang';
  } else if (shop.in_array('spa', place.types)) {
      iconText = 'spa';
  } else if (shop.in_array('gym', place.types)) {
      iconText = 'gym';
  } else if (shop.in_array('cafe', place.types)) {
      iconText = 'cafe';
  } else if (shop.in_array('grocery_or_supermarket', place.types)) {
      iconText = 'market';
  } else if (shop.in_array('bus_station', place.types)) {
      iconText = 'bus';
  }

  var marker = new google.maps.Marker({
	map: mapHereLoc,
	position: placeLoc,
	icon: BASE_URL + 'style/images/marker/' + iconText + '.png'
  });
  google.maps.event.addListener(marker, 'click', function() {
	infoWindowHereLoc.setContent('<div style="width:250px">' + place.name + '</div>');
	infoWindowHereLoc.open(mapHereLoc, this);
  });

  lightIcon(iconText);
}

function lightIcon(type){
    if(type != 'marker'){
        if(type == 'nganhang'){
            type = 'bank';
        }
        var cl = '.rt_icon'+type;
        jQuery(cl).parent().show();
    }
}