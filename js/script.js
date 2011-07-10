var userid;

$(document).ready( function () {
	/* hide something */
	$('#login_block').hide();
	$('#register_block').hide();
	$('#search_block').hide();
	$('#project').hide();
	$('#markers').hide();

	$('#login').bind('click', function (event) {
		$(this).unbind();
		showLogin();
	});

	$('#register').bind('click', function (event) {
		$(this).unbind();
		showRegister();
	});
});

function error(message) {
	$('#error').html(message);
	$('#error').show().delay(2000).fadeOut('slow', function () {
		$(this).html('');
	});
}

function header(message) {
	$('#header').html(message);
}