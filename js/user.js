function showLogin() {
	
	/* bind the login function and ajax it */
	$('#login_block').bind('submit', function (event) {
						   doLogin(event);
						   });
	
	/* display and hide something */
	$('#login').remove();
	$('#register').remove();
	$('#login_block').show();
	$('#login_block > input:nth-child(1)').select();
}

function doLogin(event) {
	event.preventDefault();
	$.post($('#login_block').attr('action'),
		   $('#login_block').serialize(),
		   function (data) {
		   /* The return format
			* must be with status : 'SUCCESS' or 'FAILED'
			* and have message, 
			*     if 'SUCCESS' : with username
			*     if 'FAILED' : be error message
			*/
			   var obj = jQuery.parseJSON(data);
			   if (obj.status == 'SUCCESS') {
				   _successLogin(obj);
			   } else if (obj.status == 'FAILED') {
				   error(obj.message);
			   }
		   });
}

function showRegister() {
	
	$('#register_block').bind('submit', function (event) {
						   doRegister(event);
						   });
	
	$('#login').remove();
	$('#register').remove();
	$('#register_block').show();
	$('#register_block > input:nth-child(1)').focus();
}

function doRegister(event) {
	event.preventDefault();
	$.post($('#register_block').attr('action'),
		   $('#register_block').serialize(),
		   function (data) {
			   var obj = jQuery.parseJSON(data);
			   if (obj.status == 'SUCCESS') {
				   _successLogin(obj);
			   } else if (obj.status == 'FAILED') {
				   error(obj.message);
			   }
		   });
}

function _successLogin(obj) {
	/* change the html title with username */
	document.title = obj.message.username + ' - ' + document.title;
	
	/* set the cookie */
	$.cookie('userid', obj.message.userid);
	
	/* remove and show something */
	$("#user").remove();
	initialProject(obj.project);
	
	
}