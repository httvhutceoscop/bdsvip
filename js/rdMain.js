$(document).ready(function() {
	var dock = rdChatUI.dock;
	$("body").append(dock);
	// $(".evt_rd_screen_chat").slimScroll({
	// 	size: "8px",
	// 	color: "#999",
	// 	height: "153px"
	// });
	var _cache = rdChatHelper.loadAccount();
	
	if(_cache === undefined) {
		rdChatHelper.loginAnonymous();	
	} else {
		rdlczb.jid = _cache.jid;
		rdlczb.password = _cache.password;
		rdlczb.name = _cache.name;
		rdlczb.email = _cache.email;
		rdlczb.phone = _cache.phone;
		rdlczb.connect({
			jid: rdlczb.jid, 
			password: rdlczb.password
		});
	}
	
});