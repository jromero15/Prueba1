/*!
Anuket gmaps module
Author: Jorge Brunal
Version: 2.0.7
*/

var Anuket = (function() {
	'use strict';

	var fn = {};
	var AnuketMap = null;
	var iconfirst='images/clusters/userpin2.png';

	var cities = [{
		"city": "Bogota",
		"lat": 4.672454,
		"lng": -74.064038
	}];

	var latlong = {};
	var theZoom = 12;
	var actualZoom = theZoom;
	var configLayers = null;
	var max_distance = 12.0;
	var initMarker = false;
	var useGeolocation = false;

	var markers;
	var clickOnMarker = null;

	fn.flightPathLine;
	fn.trafficLayer = new google.maps.TrafficLayer();
	fn.trafficBool = true;


	fn.traffic = function(){

		if(fn.trafficBool){
			fn.trafficLayer.setMap(fn.getObjectMap().map);
			fn.trafficBool = false;
		}else{
			fn.trafficLayer.setMap(null);
			fn.trafficBool = true;
		}

	};

	//deprecated
	fn.mapPos = function(latlong) {
		console.log('get mapPos', latlong);
		var currPos = {};
		GMaps.geolocate({
			success: function(position) {
				console.log('Geolocation success: ', currPos, position, latlong);
				AnuketMap.removeMarkers();
				if (typeof latlong === "object") {
					if ((latlong.lat === undefined) || (latlong.lng === undefined)) {
						var pos = position.coords;
						currPos.lat = pos.latitude;
						currPos.lng = pos.longitude;
						console.log('Geolocation position: ', currPos);
					} else {
						currPos = latlong;
						console.log('Geolocation latlong: ', latlong, currPos);
					}
				}
				AnuketMap.setCenter(currPos.lat, currPos.lng);
				addMarker(currPos);
			},
			error: function(error) {
				console.log('Geolocation failed: ' + error.message);
			},
			not_supported: function() {
				console.log("Your browser does not support geolocation");
			},
			always: function() {
				console.log("activando geolocation en", currPos);
			}
		});
	} //mapPos

	//deprecated
	fn.geocodePosition = function(pos,cb) {
		GMaps.geocode({
		    latLng: pos,
		    callback: function(results, status) {
				if (status === 'OK') {
					if (typeof(cb) === 'function') {
						cb(results);
					}
				} else {
					console.warn('Anuket: geocodePosition FAIL');
					if (typeof(cb) === 'function') {
						cb(null);
					}
				}
		    }
		});
	}

	fn.streetView = function(coords) {
		console.log('panorama', coords);
		var panorama = GMaps.createPanorama({
			el: '#gpanorama',
			lat: coords.lat,
			lng: coords.lng
		});
	} //streetView

	//deprecated
	function showLayer(layer) {
		//layer.setMap(AnuketMap)
	} //showLayer

	fn.setZoom = function(zoom) {
		return AnuketMap.setZoom(zoom);
	}

	fn.getZoom = function(zoom) {
		return AnuketMap.getZoom();
	}

	fn.getObjectMap = function(zoom) {
		return AnuketMap;
	}

	//deprecated
	function hideLayer(layer) {
		//layer.setMap(null)
		AnuketMap.removeLayer(layer);
	} //hideLayer

	//deprecated
	function showAll() {
		for (key in fLayers) {
			fLayers[key].setMap(AnuketMap);
		}
	} //showAll

	//deprecated
	function hideAll() {
		for (key in fLayers) {
			//fLayers[key].setMap(null)
			console.log('capa', key)
			//AnuketMap.removeLayer(key);
			AnuketMap.removeLayer(fLayers[key]);
		}
	} //hideAll


	fn.arrayMarkers = {route:[], users:[], alarms:[], userHistorical:[]};
	fn.addMarker = function(latlong, drag, infoAdd, callback, container, firsticon,label, option) {

		var elicon= firsticon || null;

		var textAdd;

		if(infoAdd==null){
			textAdd = '';
		}else{
			textAdd = infoAdd;
		}

		markers = AnuketMap.addMarker({
			lat: latlong.lat,
			lng: latlong.lng,
			title: 'Posicion Actual',
			icon:elicon,
			label:{text:label, color:"#fff",fontSize: "8.5px"},
			draggable: drag || false,
			infoWindow: {
				content: textAdd + ''
			},
			click: function(e) {
				//console.log('You clicked here...', e);
				if (typeof(callback) === 'function') {
					callback(e, { lat: latlong.lat, lng: latlong.lng });
				}
			}
		});
		if (drag == true) {
			console.log('get dragend');
			setTimeout(function() {
				google.maps.event.addListener(markers, 'dragend', function() {
					var pos = {};
					var getPosition = markers.getPosition();
					pos.lat = getPosition.lat();
					pos.lng = getPosition.lng();
					console.log('pos', pos);
					localStorage.setItem('pos', JSON.stringify(pos));
					console.log('container', container);

					if(infoAdd=='customerCreate'){
						document.getElementById('cxCustomer').value = pos.lat;
						document.getElementById('cyCustomer').value = pos.lng;
						Anuket.moveMarkerCustomer = true;
					}

					$(container).html('<strong>Coordenadas: ' + pos.lat + ', ' + pos.lng + '</strong>');
				});
			}, 500);
		}

		switch(option){
			case 'route':
				fn.arrayMarkers.route.push(markers);
				break;
			case 'customer':
				fn.arrayMarkers.customers.push(markers);
				break;
			case 'users':
				fn.arrayMarkers.users.push(markers);
				break;
			case 'alarms':
				fn.arrayMarkers.alarms.push(markers);
				break;
			case 'userHistorical':
				fn.arrayMarkers.userHistorical.push(markers);
				break;
		}




	} //addMarkers


	//deprecated
	fn.getConfigLayers = function(data) {
		console.log('getConfigLayers in', data);
		var vm = {};
		$.each(data, function(index, value) {
			var newLayer = {
				id: value.id,
				name: value.name,
				layer: value.layer,
				query: value.query,
				style: value.style,
				fields: value.fields
			}
			vm[value.name] = newLayer;
		});

		Anuket.configLayers = vm;
		console.log('configLayers:', vm);
	};

	fn.getCurrentPosition = function(custom_distance) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
			latlong.lat = position.coords.latitude;
			latlong.lng = position.coords.longitude;

			if (custom_distance){
				if (custom_distance > max_distance){
					max_distance = custom_distance;
				}
				//var current_dist = calculate_distance([cities[0].lat, cities[0].lng], [latlong.lat, latlong.lng], 'kms');
				var current_dist = Haversine.calculate([cities[0].lat, cities[0].lng], [latlong.lat, latlong.lng], 'kms');

				if (current_dist >= max_distance) {
					var msg = 'Te encuentras lejos de ' + cities[0].city + '(' + current_dist + ' kms), no podemos predecir ciertos resultados';
					$.notify({ message: msg }, { type: 'warning', timer: 4500 });

					fn.removeMarkers();
					fn.addMarker(cities[0], false, clickOnMarker,null, iconfirst);
					AnuketMap.setCenter(cities[0].lat, cities[0].lng);
					AnuketMap.setZoom(theZoom);
				} else {
					fn.addMarker(latlong, false, null);
					AnuketMap.setCenter(latlong.lat, latlong.lng);
					AnuketMap.setZoom(theZoom);
					$.notify({ message: 'Usando la geolocalizacion de Google' }, { type: 'info', timer: 2500 });
				}
			}else{
				//fn.addMarker(latlong, false, null);
				fn.addMarker(latlong, false, clickOnMarker, null, iconfirst);
				AnuketMap.setCenter(latlong.lat, latlong.lng);
				AnuketMap.setZoom(theZoom);
				$.notify({ message: 'Usando la geolocalizacion de Google' }, { type: 'info', timer: 2500 });
			}

			}, function(error) {
				console.error('Anuket: Error code', error.code);
				console.error('Anuket: Error message', error.message);
				$.notify({ message: 'Ocurrio un error al geolocalizar la app' }, { type: 'danger', timer: 2500 });
			});
		} else {
			// Browser doesn't support Geolocation
			console.error('Anuket: Your browser doesnt support Geolocation');
			$.notify({ message: 'Su navegador no soporta la Geolocalizacion' }, { type: 'danger', timer: 2500 });
		}
	};

	fn.run = function(_divMap, _opts) {
		console.log('Anuket Run', _opts);
		latlong.lat = cities[0].lat;
		latlong.lng = cities[0].lng;

		if (_opts) {
			if (_opts.zoom) {
				console.log('Anuket now using zoom', _opts.zoom);
				theZoom = _opts.zoom;
			}//zoom

			if (_opts.initMarker) {
				initMarker = _opts.initMarker;

				if (initMarker == true) {
					if (typeof(_opts.markerClick) === 'function') {
						clickOnMarker = _opts.markerClick;
					}
				}
			}//initMarker

			if (_opts.geolocation) {
				if (_opts.geolocation == true) {
					useGeolocation = _opts.geolocation;
					console.log('Anuket now using geolocation');
				}
			}//geolocation

			if (useGeolocation === false) {
				console.log('useGeolocation is false, checking _opts.latlng');
				if (_opts.latlng) {
					var _pos = _opts.latlng;
					if (_pos != null) {
						console.log('Anuket now using coord', _pos);
						if ((_pos.lat != null) && (_pos.lat != null)) {
							latlong.lat = _pos.lat;
							latlong.lng = _pos.lng;
						}
					} else {
						console.log('Anuket now using getCurrentPosition');
					}
				}//latlng
			}
		} else {
			console.log('Anuket now using current configuration');
		}
		fn.loadMap(_divMap);
	};

	fn.loadMap = function(_divMap) {
		console.log('loadMap MAP');
		AnuketMap = new GMaps({
			el: _divMap,
			lat: latlong.lat,
			lng: latlong.lng,
			zoom: theZoom,
			zoomControl: false,
			streetViewControl: false,
			panControl: true,
			overviewMapControl: false,
			mapTypeControl: false,
		});

		AnuketMap.setCenter(latlong.lat, latlong.lng);

		if (useGeolocation === true){
			fn.getCurrentPosition();
		}else if (initMarker === true){
			//fn.addMarker(latlong, false, clickOnMarker, null, iconfirst);
		}
	}; //loadMap

	fn.removeMarkers = function() {
		if (AnuketMap) {
			AnuketMap.removeMarkers();
		}

		if(fn.flightPathLine!=undefined){
			fn.flightPathLine.setMap(null);
		}

		fn.arrayMarkers = {route:[], users:[], alarms:[], userHistorical:[]};

		Anuket.directionsDisplay.setMap(null);
	};

	fn.clearMap = function() {
		if (AnuketMap) {
			AnuketMap.removePolylines();
			AnuketMap.removeMarkers();
			fn.addMarker(latlong, false, null, null, iconfirst);
			Anuket.removeMarkers();

			for(var i in fn.arrayPolyLines){
				fn.arrayPolyLines[i].setMap(null);
			}

			fn.arrayPolyLines = [];
		}
	};

	fn.centerMap = function(lat, long) {
		AnuketMap.setCenter(lat, long);
	};

	fn.centerOverOrigin = function(options) {
		//origin = fn.getOriginPosition();
		var origin = cities[0];
		AnuketMap.setCenter(origin.lat, origin.lng);
		if (options.zoom){
			AnuketMap.setZoom(options.zoom);
		}
	}; //centerOverOrigin

	fn.getOriginPosition = function() {
		return cities[0];
	}; //getOriginPosition

	fn.geoRef = function(setAddress) {
		AnuketMap.removeMarkers();
		GMaps.geocode({
			address: setAddress,
			callback: function(results, status) {
				if (status == 'OK') {
					console.log('geo ref obtenida');
					var latlng = results[0].geometry.location;
					AnuketMap.setCenter(latlng.lat(), latlng.lng());
					latlong.lat = latlng.lat();
					latlong.lng = latlng.lng();

					localStorage.setItem('pos', JSON.stringify(latlng));

					$('#markerPos').html('<strong>Coordenadas: ' + latlong.lat + ', ' + latlong.lng + '</strong>');
					fn.addMarker(latlong, true, '#markerPos');
				} else {
					console.log('Anuket: geo ref FAIL');
					$.notify({ message: 'No se pudo georeferenciar la dirección.' }, { type: 'warning', timer: 2500 });
				}
			}
		});
	}; //geoRef

	fn.drawRoute = function(origin, destiny) {
		console.log('drawRoute', origin, destiny);
		AnuketMap.removePolylines();

		var route = AnuketMap.drawRoute({
			origin: origin,
			destination: destiny,
			travelMode: 'driving',
			strokeColor: '#0C41AE',
			strokeOpacity: 0.8,
			strokeWeight: 7
		});
		console.log('route', route);
	}; //drawRoute

	fn.setMapType = function(el) {
		// [roadmap, terrain, satellite, hybrid, night_mode, servinf_beta, osm]
		console.info('setMapType fn', el);
		switch (el) {
		    case 'roadmap':
		    case 'terrain':
		    case 'satellite':
		    case 'hybrid':
		        AnuketMap.setStyle(el);
		        break;
		    case 'night_mode':
				//map_dark_theme, map_gray_theme, map_took_theme
				AnuketMap.addStyle({
					styledMapName: 'StyledDark Map',
					styles: map_dark_theme,
					mapTypeId: 'map_style_dark'
				});
				AnuketMap.setStyle('map_style_dark');
				break;
			default:
				console.warn('Anuket: unknow option', el);
				AnuketMap.setStyle('roadmap');
				break;
		}
	}; //setMapType

	fn.arrayPolyLines = [];
	fn.contColor = 0;
	fn.polyLines = function(arrayCoor){

		var arrayColors = ['#607D8B','#E91E63','#3F51B5','#009688','#673AB7','#8BC34A','#CDDC39','#FF9800','#795548','#9E9E9E','#9C27B0'];

		if(fn.contColor==10){
			fn.contColor = 0;
		}

        fn.flightPathLine = new google.maps.Polyline({
          path: arrayCoor,
          geodesic: true,
          strokeColor: arrayColors[fn.contColor],
          strokeOpacity: 1.0,
          strokeWeight: 2
        });

        fn.flightPathLine.setMap(Anuket.getObjectMap().map);

        fn.arrayPolyLines.push(fn.flightPathLine);

        fn.contColor = fn.contColor + 1;

	};// line in map

	fn.directionsService = new google.maps.DirectionsService;

    fn.directionsDisplay = new google.maps.DirectionsRenderer({
        map: fn.getObjectMap(),
        panel:document.getElementById('set-panel'),
        polylineOptions: {
	      strokeColor: "#2196f3db"
	    }
    });

	fn.directions = function(originPosition, destinationPosition, waypointsRoute, modeTravel, callback){

		var responseService = null;

		fn.directionsDisplay.addListener('directions_changed', function() {
      		computeTotalDistance(fn.directionsDisplay.getDirections());
    	});

        fn.directionsDisplay.map = fn.getObjectMap().map;
        fn.directionsDisplay.panel = document.getElementById('set-panel');

        fn.directionsService.route({
            origin: originPosition,
            destination: destinationPosition,
            waypoints: waypointsRoute || [],
            travelMode: modeTravel,
            avoidTolls: false,
            optimizeWaypoints: true,
            //provideRouteAlternatives: true,
            drivingOptions: {
			    departureTime: new Date(Date.now()),
				trafficModel: 'bestguess'
			}
        }, function(response, status) {
            if (status === 'OK') {
                fn.directionsDisplay.setOptions( { suppressMarkers: true } );
                fn.directionsDisplay.setDirections(response);
                document.getElementById('closeSetPanel').classList.remove('displayNone');
                callback(response);
            } else {
                $.notify({ message: 'Se ha producido un error en la solicitud de ' + status }, { type: 'warning', timer: 4000 });
            }
        });

	};

	fn.closeSetPanel = function(){

		document.getElementById('closeSetPanel').classList.add('displayNone');
		document.getElementById('infoRoute').innerHTML = '';
		document.getElementById('set-panel').innerHTML = '';
	};

	function computeTotalDistance(result) {


        var total = 0;
        var timeTotal = 0;
        var myroute = result.routes[0];
        for (var i = 0; i < myroute.legs.length; i++) {
          total += myroute.legs[i].distance.value;
          timeTotal += myroute.legs[i].duration.value;
        }

        timeTotal = Math.round( timeTotal / 60 );
        total = total / 1000;
        document.getElementById('infoRoute').innerHTML = total + ' km | ' + timeTotal + ' Min';

    }



	return fn;

}()); //Anuket
