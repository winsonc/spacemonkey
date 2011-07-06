function initialProject(project) {
	header('Projects');
	
	$('#project').show();
	$.each(project, function (index, value) {
		_listAProject(value);
	});
	
	$('#create_project').bind('submit', function (event) {
		event.preventDefault();
		createProject(this);
	});
}

function createProject(form) {
	var latlng = map.getCenter();
	var data = {
		project : $(form).children("input[name='project']").val(),
		lat : latlng.lat(),
		lng : latlng.lng(),
		zoom : map.getZoom()
	};
	$.post($(form).attr('action'), data, function (results) {
		var results = $.parseJSON(results);
		if (results.status == 'SUCCESS') {
			_projectSelect(results.project[0]);
		} else {
			error(results.status);
		}
	});
}

function _listAProject(project) {
	/* create a node and placed it on screen */
	var node = document.createElement('li');
	var text = document.createTextNode(project.project);
	node.appendChild(text);
	
	/* bind the project with change project when clicked */
	$(node).bind('click', function (event) {
		_projectSelect(project);
	});
	
	/* append it */
	$('#project_list').append(node);
}

function _projectSelect(project) {
	
	header(project.project);
	
	$('#project_list > li').unbind();
	
	/* zoom to the default location */
	var latlng = new google.maps.LatLng(project.lat, project.lng);
	map.setCenter(latlng);
	map.setZoom(parseFloat(project.zoom));
	
	/* show and hide something */
	$('#project').hide();
	$('#markers').show();
	$('#markers').tabs();
	
	$('#markers').find("input[name='project']").val(project.project);
	
	/* read markers from database */
	$.post('app/place/read', project, function (results) {
		/* cookie set the current project */
		$.cookie('projectid', project.id);
		   
		/* put markers on the map */
		var obj = jQuery.parseJSON(results);
		if (obj.markers) {
			loadMarkers(obj.markers);
		}

		/* start to bind map tools */
		bindMapFunctions();
	});
}