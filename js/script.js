var userid;

$(document).ready( function () {
	/* hide something */
	$('#login_block').hide();
	$('#register_block').hide();
	$('#search_block').hide();
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
				  
	$('#search').bind('click', function (event) {
		$('#search_block').slideToggle('slow', function () {
			$('#search_block > input:first-child').focus();
		});
	});
				  
	$('#search_block > input:first-child').bind('keypress', function(event) {
		if (event.keyCode == 13) {
			$(this).select();
			_codeAddress($(this).val());
		}
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