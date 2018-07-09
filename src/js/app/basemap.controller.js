/*
 * baseMap controller here
 *
 */
(function() {
        'use strict';

        function baseMapController($scope, $timeout, $log, Notify, APP_CONFIG, $state) {
            var vm = this;

            var currentPos = {
                'lat': 4.672454,
                'lng': -74.064038
            };

            var currentZoom = 14;

            var refUsers;

            vm.toggleSideBar = true;
            vm.toggleArrow = true;
            vm.textArrow = true;

            vm.toggleSideBar2 = false;
            vm.toggleArrow2 = false;
            vm.textArrow2 = false;

            vm.viewRoutes = true;
            vm.viewAlarms = false;

            vm.listCustomerMap = [];
            vm.listAlarm = [];


            vm.alarmType = function() {

                vm.listAlarm = [
                    { id: 1, usuario: 'Karen Gomez Gomez', alerta: 'Gps On', fecha: '2017-07-02 09:56', direccion: 'cll 84 # 24 -78 este.', lat: 4.35145, lng: -74.02245 },
                    { id: 2, usuario: 'Felipe romero', alerta: 'Gps Off', fecha: '2017-07-02 09:56', direccion: 'cll 84 # 24 -78 este.', lat: 4.42145, lng: -74.03245 },
                    { id: 3, usuario: 'Alfredo neme', alerta: 'Ausencia de transmisión', fecha: '2017-07-02 09:56', direccion: 'cll 84 # 24 -78 este.', lat: 4.52145, lng: -74.04245 },
                    { id: 4, usuario: 'Camilo Romero Romero', alerta: 'Detencion Prolongada', fecha: '2017-07-02 09:56', direccion: 'cll 84 # 24 -78 este.', lat: 4.30145, lng: -74.05245 },
                    { id: 5, usuario: 'Jhonatan Torres', alerta: 'Entrada de zona', fecha: '2017-07-02 09:56', direccion: 'cll 84 # 24 -78 este.', lat: 4.39845, lng: -74.06245 },
                    { id: 6, usuario: 'William Marin', alerta: 'Fuera de zona', fecha: '2017-07-02 09:56', direccion: 'cll 84 # 24 -78 este.', lat: 4.38845, lng: -74.07245 },
                    { id: 7, usuario: 'Carlos Matiz', alerta: 'otra', fecha: '2017-07-02 09:56', direccion: 'cll 84 # 24 -78 este.', lat: 4.015145, lng: -74.08245 }
                ];

                angular.forEach(vm.listAlarm, function(value, index) {

                    switch (value.alerta) {
                        case 'Gps On':
                            value.icon = 'gps_fixed';
                            value.color = 'colorGpsOn'; //009688
                            break;
                        case 'Gps Off':
                            value.icon = 'gps_off';
                            value.color = 'colorGpsOff'; //607D8B
                            break;
                        case 'Ausencia de transmisión':
                            value.icon = 'signal_cellular_off';
                            value.color = 'colorAusenciaTransmisión'; //#ff9800
                            break;
                        case 'Detencion Prolongada':
                            value.icon = 'report';
                            value.color = 'colorDetencionProlongada'; //#795548
                            break;
                        case 'Entrada de zona':
                            value.icon = 'transfer_within_a_station';
                            value.color = 'colorEntradaZona'; //00bcd4
                            break;
                        case 'Fuera de zona':
                            value.icon = 'directions_run';
                            value.color = 'colorFueraZona'; //2196F3
                            break;
                        default:
                            value.icon = 'notifications_active';
                            value.color = 'colorDefault'; //2196F3
                    }

                });
            };


            vm.showView = function(option) {

                vm.viewRoutes = false;
                vm.viewAlarms = false;

                switch (option) {
                    case 'routes':
                        vm.viewRoutes = true;
                        break;
                    case 'alarms':
                        vm.viewAlarms = true;
                        break;
                    default:
                        console.log("opcion no encontrada vista items mapas")

                }
            };

            vm.addMarker = function(option, idUser, idCustomer) {

                //Anuket.removeMarkers();

                var bounds = new google.maps.LatLngBounds();

                switch(option){
                	case 'user':
                		angular.forEach(vm.listCustomerMap, function(value, index) {

	                        if (value.id === idUser) {
	                            var label = value.nombre.substring(0, 1).toUpperCase();
	                            var content = '<div class="infoWindowsContent"><h5><b>Dirección</b></h5>' + value.direccion + '<img src="' + value.imagen + '"><br><b>' + value.nombre + '</b></div>';

	                            Anuket.addMarker({ "lat": value.posicion[0], "lng": value.posicion[1] }, false, content, null, null, 'images/markers/circleBlue.png', label, 'users');
	                            Anuket.centerMap(value.posicion[0], value.posicion[1]);

	                            var myLatLngCenter = new google.maps.LatLng(parseFloat(value.posicion[0]), parseFloat(value.posicion[1]), value);
	                            bounds.extend(myLatLngCenter);
	                        }

	                    });
                		break;
                	case 'userAll':
                		angular.forEach(vm.listCustomerMap, function(value, index) {

	                        var label = value.nombre.substring(0, 1).toUpperCase();
	                        var content = '<div class="infoWindowsContent"><h5><b>Dirección</b></h5>' + value.direccion + '<img src="' + value.imagen + '"><br><b>' + value.nombre + '</b></div>';

	                        Anuket.addMarker({ "lat": value.posicion[0], "lng": value.posicion[1] }, false, content, null, null, 'images/markers/circleBlue.png', label, 'users');
	                        Anuket.centerMap(value.posicion[0], value.posicion[1]);

	                        var myLatLngCenter = new google.maps.LatLng(parseFloat(value.posicion[0]), parseFloat(value.posicion[1]), value);
	                        bounds.extend(myLatLngCenter);

	                    });
                		break;
                	case 'customer':
	                	angular.forEach(vm.listCustomerMap, function(value, index) {

	                        if (value.id === idUser) {

	                            angular.forEach(value.clientes, function(value2, index2) {

	                                if (value2.id === idCustomer) {

	                                    var icon = '';

	                                    if (value2.estado === "visitado") {
	                                        icon = 'images/markers/visitado.png';
	                                    } else {
	                                        icon = 'images/markers/novisitado.png';
	                                    }

	                                    Anuket.addMarker({ "lat": value2.coordenadas[0], "lng": value2.coordenadas[1] }, false, null, null, null, icon, '', 'customers');
	                                    Anuket.centerMap(value2.coordenadas[0], value2.coordenadas[1]);

	                                    var myLatLngCenter = new google.maps.LatLng(parseFloat(value2.coordenadas[0]), parseFloat(value2.coordenadas[1]), value2);
	                                    bounds.extend(myLatLngCenter);
	                                }
	                            });

	                        }

	                    });
                		break;
                	case 'allCustomer':
	                	angular.forEach(vm.listCustomerMap, function(value, index) {

	                        var label = value.nombre.substring(0, 1).toUpperCase();
	                        var content = '<div class="infoWindowsContent"><h5><b>Dirección</b></h5>' + value.direccion + '<img src="' + value.imagen + '"><br><b>' + value.nombre + '</b></div>';

	                        if (value.id === idUser) {
	                            var arrayWaypoints = [];
	                            var start = { lat: value.clientes[0].coordenadas[0], lng: value.clientes[0].coordenadas[1] };
	                            var end = { lat: value.clientes[value.clientes.length - 1].coordenadas[0], lng: value.clientes[value.clientes.length - 1].coordenadas[1] };

	                            angular.forEach(value.clientes, function(value2, index2) {

	                                if (index2 != 0 && index2 != value.clientes.length - 1) {
	                                    arrayWaypoints.push({
	                                        location: value2.coordenadas[0] + ',' + value2.coordenadas[1],
	                                        stopover: true
	                                    });
	                                }

	                            });
	                            //markers and route Customers of User
	                            Anuket.directions(start, end, arrayWaypoints, 'DRIVING', function(response) {

	                                var order = response.routes[0].waypoint_order;
	                                var n = 0;

	                                angular.forEach(value.clientes, function(value2, index2) {

	                                    var max = value.clientes.length;

	                                    var icon = '';
	                                    var colorText = '';

	                                    if (value2.estado === "visitado") {
	                                        icon = 'images/markers/circleGreen.png';
	                                        colorText = 'colorVisit';
	                                    } else if (value2.estado === "no visitado") {
	                                        icon = 'images/markers/circleRed.png';
	                                        colorText = 'colorNoVisit';
	                                    } else {
	                                        icon = 'images/markers/circleYellow.png';
	                                        colorText = 'colorTransit';
	                                    }

	                                    var content2 = '<div class="infoWindowsContent"><h5><b>Dirección</b></h5>' + value2.direccion +
	                                        '<br><h5 class="' + colorText + '"><b>' + value2.estado + '</h5>' + value2.nombre + '</b></div>';

	                                    if (index2 === 0) {
	                                        //markert start route
	                                        Anuket.addMarker({ "lat": value2.coordenadas[0], "lng": value2.coordenadas[1] }, false, content2, null, null, icon, '1', 'route');
	                                    } else if (index2 != 0 && index2 != max - 1) {
	                                        //markert waypoints route
	                                        Anuket.addMarker({ "lat": value2.coordenadas[0], "lng": value2.coordenadas[1] }, false, content2, null, null, icon, (order[n] + 2).toString(), 'route');
	                                        n = n + 1;
	                                    } else {
	                                        //markert end route
	                                        Anuket.addMarker({ "lat": value2.coordenadas[0], "lng": value2.coordenadas[1] }, false, content2, null, null, icon, max.toString(), 'route');
	                                    }

	                                });

	                                //marker User
	                                Anuket.addMarker({ "lat": value.posicion[0], "lng": value.posicion[1] }, false, content, null, null, 'images/markers/circleBlue.png', label, 'users');

	                            });
	                        }

	                    });
                		break;
                	case 'allRoute':
                		var route = [
	                        { lat: 4.5552223123124, lng: -74.1145 }, { lat: 4.754, lng: -74.2145 }, { lat: 4.7554, lng: -75.1145 }, { lat: 4.235, lng: -74.9585 }, { lat: 4.321, lng: -73.9851 }
	                    ];

	                    angular.forEach(vm.listCustomerMap, function(value, index) {

	                        if (value.id === idUser) {

	                            value.route = route;

	                            var content = '<div class="infoWindowsContent"><h5><b>Dirección</b></h5>' + value.direccion + '<img src="' + value.imagen + '"><br><b>' + value.nombre + '</b></div>';

	                            var label = value.nombre.substring(0, 1).toUpperCase();

	                            angular.forEach(value.route, function(value2, index2) {

	                                Anuket.addMarker({ "lat": value2.lat, "lng": value2.lng }, false, content, null, null, 'images/markers/circleBrown.png', label, 'userHistorical');
	                                var myLatLngCenter = new google.maps.LatLng(parseFloat(value2.lat), parseFloat(value2.lng), value2);
	                                bounds.extend(myLatLngCenter);

	                            });

	                            Anuket.polyLines(value.route);
	                        }

	                    });
                		break;
                	case 'alarms':
                		angular.forEach(vm.listAlarm, function(value, index) {

	                            if (value.id === idUser) {

	                                var icon = 'images/markers/'+value.alerta+'1.png';

	                                var exists = existeUrl(icon);

	                                if(!exists){
	                                	icon = 'images/markers/otra.png';
	                                }

	                            	var content = '<div class="infoWindowsContent"><h5><b>Dirección</b></h5>' + value.direccion + '<br>'+
	                            				  '<i class="material-icons '+value.color+'">'+value.icon+'</i><br>'+
	                            				  '<b>'+value.alerta+'</b><br><br>'+
	                            				  '<span>'+value.fecha+'</span><br><br><b>' + value.usuario + '</b></div>';

	                                Anuket.addMarker({ lat: value.lat, lng: value.lng}, false, content, null, null, icon, ' ', 'alarms');
	                            	Anuket.centerMap(value.lat, value.lat);

	                            var myLatLngCenter = new google.maps.LatLng(value.lat, value.lng, value);
	                            bounds.extend(myLatLngCenter);
	                        }
	                    });
                		break;
                	case 'alarmsAll':
                		angular.forEach(vm.listAlarm, function(value, index) {

							var icon = 'images/markers/'+value.alerta+'1.png';

							var exists = existeUrl(icon);

                            if(!exists){
                            	icon = 'images/markers/otra.png';
                            }

	                        var content = '<div class="infoWindowsContent"><h5><b>Dirección</b></h5>' + value.direccion + '<br>'+
	                        			  '<i class="material-icons '+value.color+'">'+value.icon+'</i><br>'+
	                            		  '<b>'+value.alerta+'</b><br><br>'+
	                            		  '<span>'+value.fecha+'</span><br><br><b>' + value.usuario + '</b></div>';

	                        Anuket.addMarker({ lat: value.lat, lng: value.lng}, false, content, null, null, icon, ' ', 'alarms');
	                    	//Anuket.centerMap(value.lat, value.lat);

	                        var myLatLngCenter = new google.maps.LatLng(value.lat, value.lng, value);
	                        bounds.extend(myLatLngCenter);

	                    });
                		break;
                }

            Anuket.getObjectMap().map.fitBounds(bounds);
        };

	    function existeUrl(url) {
			var http = new XMLHttpRequest();
			http.open('HEAD', url, false);
			http.send();
			return http.status!=404;
		}

        vm.fillData = function() {

            vm.listCustomerMap = [{
                id: 1,
                nombre: "Karen Gomez",
                telefono: "321654788",
                bateria: "12",
                imagen: 'https://image.flaticon.com/icons/svg/201/201634.svg',
                posicion: [4.735885, -74.076347],
                direccion: 'cll 78 # 24 - 26 oeste',
                visitados: 12,
                novisitados: 10,
                clientes: [
                    { id: 12, nombre: 'Oscar marcos', estado: 'visitado', coordenadas: [4.736912, -74.036179], direccion: 'cl 23 cr 54a - 23 ' },
                    { id: 13, nombre: 'Marcos marcos', estado: 'visitado', coordenadas: [4.715698, -74.032745], direccion: 'cl 23 cr 54a - 23 ' },
                    { id: 14, nombre: 'Lucas marcos', estado: 'no visitado', coordenadas: [4.697563, -74.047508], direccion: 'cl 23 cr 54a - 23 ' },
                    { id: 15, nombre: 'Romero marcos', estado: 'visitado', coordenadas: [4.658555, -74.065704], direccion: 'cl 23 cr 54a - 23 ' },
                    { id: 16, nombre: 'Carlos marcos', estado: 'no visitado', coordenadas: [4.6719, -74.0942], direccion: 'cl 23 cr 54a - 23 ' },
                    { id: 17, nombre: 'Wendy romero', estado: 'no visitado', coordenadas: [4.644183, -74.10141], direccion: 'cl 23 cr 54a - 23 ' },
                    { id: 18, nombre: 'liliana marcos', estado: 'visitado', coordenadas: [4.655133, -74.140205], direccion: 'cl 23 cr 54a - 23 ' },
                    { id: 19, nombre: 'william marcos', estado: 'transito', coordenadas: [4.634601, -74.156342], direccion: 'cl 23 cr 54a - 23 ' },
                    { id: 20, nombre: 'javier marcos', estado: 'transito', coordenadas: [4.619544, -74.131279], direccion: 'cl 23 cr 54a - 23 ' },
                    { id: 21, nombre: 'daniel marcos', estado: 'transito', coordenadas: [4.612358, -74.181404], direccion: 'cl 23 cr 54a - 23 ' }
                ]
            }, {
                id: 2,
                nombre: "Jairo Coronado",
                telefono: "7652145",
                bateria: "50",
                imagen: 'https://image.flaticon.com/icons/svg/236/236831.svg',
                posicion: [4.751282, -74.046907],
                direccion: 'cll 78 # 24 - 26 oeste',
                visitados: 20,
                novisitados: 23,
                clientes: [
                    { id: 12, nombre: 'Carlos Gomez', estado: 'visitado', coordenadas: [4.746912, -74.036179], direccion: 'cl 54 cr 54a - 54 ' },
                    { id: 13, nombre: 'Natalia Guio', estado: 'no visitado', coordenadas: [4.735698, -74.032745], direccion: 'cl 54 cr 54a - 54 ' },
                    { id: 14, nombre: 'Angela Zapata', estado: 'visitad', coordenadas: [4.707563, -74.047508], direccion: 'cl 54 cr 54a - 54 ' },
                    { id: 15, nombre: 'Paola rincon', estado: 'no visitado', coordenadas: [4.618555, -74.065704], direccion: 'cl 54 cr 54a - 54 ' },
                    { id: 16, nombre: 'Lorena Torres', estado: 'visitado', coordenadas: [4.6219, -74.0942], direccion: 'cl 54 cr 54a - 54 ' },
                    { id: 17, nombre: 'Laura calero', estado: 'no visitado', coordenadas: [4.634183, -74.10141], direccion: 'cl 54 cr 54a - 54 ' },
                    { id: 18, nombre: 'Liliana Guio', estado: 'visitado', coordenadas: [4.695133, -74.140205], direccion: 'cl 54 cr 54a - 54 ' },
                    { id: 19, nombre: 'Carolina Gomez', estado: 'no visitado', coordenadas: [4.604601, -74.156342], direccion: 'cl 54 cr 54a - 54 ' },
                    { id: 20, nombre: 'Viviana Rincon', estado: 'transito', coordenadas: [4.629544, -74.131279], direccion: 'cl 54 cr 54a - 54 ' },
                    { id: 21, nombre: 'Jeison Torres', estado: 'transito', coordenadas: [4.665458, -74.181404], direccion: 'cl 54 cr 54a - 23 ' }
                ]
            }, {
                id: 3,
                nombre: "Camilo Romero",
                telefono: "78665224",
                bateria: "100",
                imagen: 'https://image.flaticon.com/icons/svg/236/236831.svg',
                posicion: [4.5365, -73.12],
                direccion: 'cll 78 # 24 - 26 oeste',
                visitados: 5,
                novisitados: 3,
                clientes: []
            }, {
                id: 4,
                nombre: "Diego Torres",
                telefono: "756212 Ext: 23",
                bateria: "98",
                imagen: 'https://image.flaticon.com/icons/svg/236/236831.svg',
                posicion: [4.1365, -72.12],
                direccion: 'cll 78 # 24 - 26 oeste',
                visitados: 32,
                novisitados: 1,
                clientes: []
            }, {
                id: 5,
                nombre: "Wendy Perez",
                telefono: "3002312",
                bateria: "10",
                imagen: 'https://image.flaticon.com/icons/svg/201/201634.svg',
                posicion: [4.0365, -74.02],
                direccion: 'cll 78 # 24 - 26 oeste',
                visitados: 10,
                novisitados: 0,
                clientes: []
            }, {
                id: 6,
                nombre: "Alex Guio",
                telefono: "3211145 ext. 21",
                bateria: "12",
                imagen: 'https://image.flaticon.com/icons/svg/236/236831.svg',
                posicion: [4.1234, -74.52],
                direccion: 'cll 78 # 24 - 26 oeste',
                visitados: 7,
                novisitados: 7,
                clientes: []
            }, {
                id: 7,
                nombre: "Juan Pineda",
                telefono: "65488522",
                bateria: "34",
                imagen: 'https://image.flaticon.com/icons/svg/236/236831.svg',
                posicion: [4.3214, -74.62],
                direccion: 'cll 78 # 24 - 26 oeste',
                visitados: 23,
                novisitados: 9,
                clientes: []
            }, {
                id: 8,
                nombre: "Edgar Marin",
                telefono: "75665512",
                bateria: "29",
                imagen: 'https://image.flaticon.com/icons/svg/236/236831.svg',
                posicion: [4.7895, -72.32],
                direccion: 'cll 78 # 24 - 26 oeste',
                visitados: 3,
                novisitados: 2,
                clientes: []
            }, {
                id: 9,
                nombre: "William Marranin",
                telefono: "6545465",
                bateria: "56",
                imagen: 'https://image.flaticon.com/icons/svg/236/236831.svg',
                posicion: [4.9999, -77.36],
                direccion: 'cll 78 # 24 - 26 oeste',
                visitados: 1,
                novisitados: 11,
                ruta: []
            }];

            angular.forEach(vm.listCustomerMap, function(value, index) {
                var suma = value.visitados + value.novisitados;
                var total = (value.visitados * 100) / suma;
                vm.listCustomerMap[index].porcentaje = Math.round(total);

                var bateria = ['success', 'warning', 'danger'];


                if (parseInt(value.bateria) >= 70 && parseInt(value.bateria) <= 100) {
                    vm.listCustomerMap[index].colorBateria = bateria[0];
                } else if (parseInt(value.bateria) >= 30 && parseInt(value.bateria) <= 69) {
                    vm.listCustomerMap[index].colorBateria = bateria[1];
                } else {
                    vm.listCustomerMap[index].colorBateria = bateria[2];
                }

            });

            console.log(vm.listCustomerMap)
        };

        vm.toggleSidebar = function() {

            vm.toggleSideBar = !vm.toggleSideBar;
            vm.toggleArrow = !vm.toggleArrow;
            vm.textArrow = !vm.textArrow;
        }


        vm.toggleSidebar2 = function() {

            vm.toggleSideBar2 = !vm.toggleSideBar2;
            vm.toggleArrow2 = !vm.toggleArrow2;
            vm.textArrow2 = !vm.textArrow2;
        }


        vm.toggleRoute = function(option, idContent) {

            vm["customersVN" + idContent] = false;
            vm["routeUserCurrent" + idContent] = false;
            vm["arrowHideCR" + idContent] = "▲";

            document.getElementById('mapRoute' + idContent).classList.remove('heightNone');

            if (option === 'customers') {
                vm["customersVN" + idContent] = true;
                vm.addMarker('allCustomer', idContent);
            }

            if (option === 'route') {
                vm["routeUserCurrent" + idContent] = true;
                vm.addMarker('allRoute', idContent);
            }

            if (option === 'hide') {
                document.getElementById('mapRoute' + idContent).classList.add('heightNone');
                vm["arrowHideCR" + idContent] = "";
            }
        };

        vm.centerMap = function(lat, lng) {

            Anuket.centerMap(lat, lng);
            Anuket.setZoom(14)
        };

        vm.infoMarker = {
            'name': 'Servinformación',
            'address': 'Calle 84 24-78',
            'city': 'Bogotá'
        };

        vm.car_route = function() {
            $log.info('draw route using car_route');
        };

        vm.walk_route = function() {
            $log.info('draw route using walk_route');
        };

        vm.subway_route = function() {
            $log.info('draw route using subway_route');
        };

        vm.markerClick = function(e, coords) {
            $("#modalPan").on("shown.bs.modal", function(e) {
                Anuket.streetView(coords);
            });

            $('#modalPan').modal('show');
        };

        vm.initGMaps = function() {
            $log.info('initialize Map');

            Anuket.run('#themap', {
                'zoom': currentZoom,
                'latlng': currentPos,
                'initMarker': true,
                'markerClick': vm.markerClick
            });
            Anuket.setMapType('night_mode');
        };

        vm.usersPositions = function() {
            refUsers.on("value", function(snap) {

                var datos = snap.val();

                angular.forEach(datos, function(value, index) {

                    Anuket.addMarker({ "lat": value.lat, "lng": value.lng }, false, '', null, null, 'images/markers/circleBlue.png', value.id.toString());

                })

            });
        }

        vm.updateUsers = function() {

            //Anuket.removeMarkers();

            var userToUpdate = refUsers.child('usuario1');

            userToUpdate.once("value", function(snap) {

                var datos = snap.val();

                var lngNew = datos.lng + 0.000023499999998932708;

                userToUpdate.update({
                    id: 1,
                    lat: datos.lat,
                    lng: lngNew
                        //lat:4.751966,
                        //lng:-74.116602
                });

            });

        }

        vm.main = function() {

            refUsers = firebase.database().ref().child("usuarios");

            if (sessionStorage.session != undefined) {
                vm.initGMaps();
                vm.fillData();
                vm.toggleSidebar();
                vm.alarmType();
                vm.usersPositions();

                /*setInterval(function(){

                	vm.updateUsers();

                },1000);*/


                setTimeout(function() {

                    $('#mapCustomerTable').DataTable({
                        "language": {
                            "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
                        },
                        "searching": true,
                        "paging": false,
                        "info": false,
                        "scrollX": false,
                        "ordering": false
                    });

                    $('#mapAlertsTable').DataTable({
                        "language": {
                            "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
                        },
                        "searching": true,
                        "paging": false,
                        "info": false,
                        "scrollX": false,
                        "ordering": false
                    });

                }, 1000);

            } else {
                $state.go('app.slogin');
            };

        };

        vm.main();
    } //baseMapController

    angular.module('app.core').controller('baseMapController', baseMapController); baseMapController.$inject = [
        '$scope',
        '$timeout',
        '$log',
        'Notify',
        'APP_CONFIG',
        '$state'
    ];

})();
