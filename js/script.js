var userid;

$(document).ready( function () {
	/* hide something */
	$('#login_block').hide();
	$('#register_block').hide();
	$('#search_block').hide();
	$('#project').hide();
	$('#tool').hide();
	$('#list').hide();

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
	$('#error').show();
	$.timer(2000, function () {
		$("#error").fadeOut('slow', function () {
			$(this).html('');
		});
	});
}