var map;
var markers = [];
var global_project;
var geocoder;

function initialize() {
	/* For reverse geocoding (a.k.a. address lookup) */
	geocoder = new google.maps.Geocoder();
	
	/* The most important thing, to place the map in browser */
	setMap();
	
	/* Place the list on the Map */
	setToolsOnMap();
	
	/* Sortable list */
	$('#list').sortable();
	
}

function bindMapFunctions() {
	/* Bind map click */
	google.maps.event.addListener(map, 'click', function(event) {
		placeMarker(event.latLng);
	});
	
	/* bind Delete Markers */
	$("#delete").bind( 'click', function () {
		deleteMarker();
	});
	
	/* bind Save Markers */
	$("#save").bind( 'click', function () {
		saveMarkers();
	});
	
	/* bind Search function */
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
	
	/* bind setting -> reset map position */
	$('#reset_map_center').bind('click', function () {
		_resetCenter();
	});
	
	/* bind Home */
	$('#home').bind('click', function () {
		_home();
	});
	
	/* bind rename project function */
	$('#rename_project').bind('submit', function (event) {
		event.preventDefault();
		rename_project(this);
	});
	
	/* add participant */
	$('#join_project').bind('submit', function (event) {
		event.preventDefault();
		joinProject(this);
	});
}

function setMap() {
	/* Set the home position to Macau :) */
	/* But I don't like the Macau government. :( */
	var myLatlng = new google.maps.LatLng(22.20, 113.55);
	var myOptions = {
		zoom: 13,
		center: myLatlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		disableDefaultUI: true
	}
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
}

function setToolsOnMap() {
	var listControlDiv = document.getElementById("tools");
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(listControlDiv);
}

function placeMarker(location, theTitle, theAddress) {
	var load = (theAddress == null) ? false : true;
	/* fake polymorphyism */
	theTitle = (theTitle == null) ? 'Location' : theTitle;
	theAddress = (theAddress == null) ? location.toString() : theAddress;
	
	/* options of the marker */
	var marker = new google.maps.Marker({
		title: theTitle,
		address: theAddress,
		position: location, 
		draggable: true,
		map: map,
		selected: false,
		deleted: false,
		index: markers.length
	});
	
	/* bind the event - update position when marker has been dragged */
	google.maps.event.addListener(marker, 'dragend', function (event) {
		_dragMarker(marker, event.latLng);
	});
	
	google.maps.event.addListener(marker, 'mouseover', function (event) {
		_mouseOverMarker(this);
	});
	
	google.maps.event.addListener(marker, 'mouseout', function (event) {
		_mouseOutMarker(this);
	});
	
	/* add marker */
	markers.push(marker);
	_addMarkerOnList(marker);
	
	/* address lookup */
	if (!load) {
		_codeLatLng(marker.position, marker.index);
	} else {
		$("#list > li:nth-child("+(marker.index+1)+")").removeClass("loading");
	}
}

function deleteMarker() {
	$.each(markers, function (index, marker) {
		if (marker.selected) {
			marker.deleted = true;
			marker.setMap(null);
		}
	});
	$("#list > li.bouncingMarker").fadeOut('slow', function () {
		//$(this).remove();
	});
}

function selectMarker(index) {
	if (markers[index].selected == true) {
		_deselectMarker(index);
	} else {
		_selectMarker(index);
	}
}

function saveMarkers() {
	var save = [];
	var item;
	$.each(markers, function (index, marker) {
		if (marker.deleted == false) {
			item = new Object();
			item.title = marker.title;
			item.address = marker.address;
			item.position = marker.position.toString();
			save.push(item);
		}
	});
	$.post('app/place/save', {data : JSON.stringify(save)}, function (data, textStatus, jqXHR) {
		var obj = jQuery.parseJSON(data);
		error(obj.message);
	});
}

function loadMarkers(obj) {
	var location;
	$.each(obj, function (index, marker) {
		location = new google.maps.LatLng(marker.lat, marker.lng);
		placeMarker(location, marker.title, marker.address);
	});
}

function _selectMarker(index) {
	map.panTo(markers[index].position);
	markers[index].setAnimation(google.maps.Animation.BOUNCE);
	$("#list > li:nth-child("+(index+1)+")").addClass("bouncingMarker");
	markers[index].selected = true;
}

function _deselectMarker(index) {
	markers[index].setAnimation(null);
	$("#list > li:nth-child("+(index+1)+")").removeClass("bouncingMarker");
	markers[index].selected = false;
}

function _addMarkerOnList(marker) {
	/* creates node and text */
	var newNode = document.createElement('li');
	$(newNode).addClass('loading');
	
	var titleNode = document.createElement('div');
	$(titleNode).addClass('title');
	
	var textOfTitleNode = document.createTextNode(marker.title);
	titleNode.appendChild(textOfTitleNode);
	
	newNode.appendChild(titleNode);
	
	var metaNode = document.createElement('div');
	$(metaNode).addClass('meta');
	
	var textOfMetaNode = document.createTextNode(marker.address);
	metaNode.appendChild(textOfMetaNode);
	
	newNode.appendChild(metaNode);
	
	/* append on the list */
	document.getElementById("list").appendChild(newNode);
	
	/* add an event to bounce if the place has been clicked */
	$(newNode).bind('click', function (e) {
					selectMarker(_indexOf(this));
					});
	
	$(newNode).bind('dblclick', function (e) {
					_editableMarkerTitle(_indexOf(this));
					});
}

function _editableMarkerTitle(index) {
	/* de-select the marker before anything just in case user selected this marker */
	_deselectMarker(index);
	
	/* prepare something */
	var editable = $("#list > li:nth-child("+(index+1)+")");
	var title = $(editable).find(".title");
	var titleText = $(title).text();
	var input = '<input type="text" id="editable" value="' + titleText + '" />';
	
	/* unbind the dblclick and click */
	$(editable).unbind('dblclick');
	$(editable).unbind('click');
	
	/* hide title and display inputbox */
	$(title).hide();
	$(editable).prepend(input);
	
	/* get the textbox back... -.- */
	input = $(editable).find('#editable');
	$(input).select(); // User friendly!!! XD
	$(input).bind('keypress', function (e) {
				  if (e.keyCode == 13) {
				  markers[index].title = $(input).val();
				  markers[index].setMap(map);
				  $(title).html($(input).val());
				  
				  /* let title display again and kill the input box */
				  $(input).remove();
				  $(title).show();
				  
				  /* bind the li again */
				  $(editable).bind('click', function (e) {
								   selectMarker(index);
								   });
				  
				  $(editable).bind('dblclick', function (e) {
								   _editableMarkerTitle(index);
								   });
				  }
				  });
}

function _dragMarker(marker, latLng) {
	marker.position = latLng;
	/* stop the animation or the marker can't bounce after selected */
	marker.setAnimation(null);
	$("#list > li:nth-child("+(marker.index+1)+")").addClass("loading");
	_codeLatLng(marker.position, marker.index);
}

function _home() {
	var latLng = new google.maps.LatLng(global_project.lat, global_project.lng);
	map.panTo(latLng);
	map.setZoom(parseFloat(global_project.zoom));
}

function _resetCenter() {
	var latlng = map.getCenter();
	var data = {
		lat : latlng.lat(),
		lng : latlng.lng(),
		zoom : map.getZoom()
	};
	$.post('app/project/resetCenter', data, function (results) {
		var results = jQuery.parseJSON(results);
		if (results.status == 'SUCCESS') {
			error('Saved');
		} else {
			error(results.message);
		}
	});
}

function _codeLatLng(position, index) {
	geocoder.geocode({'latLng': position}, function (results, status) {
		var result = position.toString();
		if (status = google.maps.GeocoderStatus.OK && results[0]) {
			result = results[0].formatted_address;
		}
		/* set value to both array and list */
		markers[index].address = result;
		$("#list > li:nth-child("+(index+1)+") > .meta").html(result);

		/* no longer loading */
		$("#list > li:nth-child("+(index+1)+")").removeClass("loading");
	});
}

function _codeAddress(address) {
	geocoder.geocode( {'address': address} , function (results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			placeMarker(results[0].geometry.location, address, results[0].formatted_address);
		} else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
			error('Result not found.');
		}
	});
}

function _indexOf(node) {
	return $(node).parent().children().index($(node));
}

function _toggleBounce(marker) {
	if (marker.getAnimation() != null) {
		marker.setAnimation(null);
	} else {
		marker.setAnimation(google.maps.Animation.BOUNCE);
	}
}

function _mouseOverMarker(marker) {
	$('#list > li:nth-child('+(marker.index+1)+')').addClass('bouncingMarker');
}

function _mouseOutMarker(marker) {
	$('#list > li:nth-child('+(marker.index+1)+')').removeClass('bouncingMarker');
}

google.maps.event.addDomListener(window, 'load', initialize);