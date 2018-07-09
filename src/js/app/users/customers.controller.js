/*
 * gruops controller here
 *
 */
(function() {
    'use strict';

    function customersController($scope, $timeout, $log, Api, Notify, APP_CONFIG, $state, Alerts) {
        var vm = this;
        vm.btnSHSave = false;
        vm.btnSHUpdate = false;
        Anuket.moveMarkerCustomer = false;

        vm.objClear = {
            nombre_cliente: '',
            direccion: '',
            identificacion: '',
            telefono: '',
            observacion: '',
            cx: '',
            cy: '',
            ids_users: []
        };

        vm.clearForm = function() {

            vm.obj = {
                nombre_cliente: '',
                direccion: '',
                identificacion: '',
                telefono: '',
                observacion: '',
                cx: '',
                cy: '',
                ids_users: []
            };

            angular.forEach(vm.listUsers, function(value, index) {

                document.getElementById("customersUsersList")[index].checked = false;

            });

            document.getElementById('cyCustomer').value = '';
            document.getElementById('cxCustomer').value = '';

        };


        vm.delete = function() {

            $("#btnDeleteCustomer" + vm.deleteCustomerId).button('loading');
            Api('client/' + vm.deleteCustomerId + '/', 'DELETE').then((function(result) {
                switch (result.status) {
                    case 201:
                    case 203:
                    default:
                        vm.clearForm();
                        vm.getCustomers();
                        Notify.send("Cliente eliminado con éxito.", {
                            status: 'success',
                            timeout: 5000
                        });

                }
                $("#btnDeleteCustomer" + vm.deleteCustomerId).button('reset');
            }), function(error) {
                switch (error) {
                    case 400:
                    case 401:
                        var _msg = 'Las credenciales de autenticación no se proporcionaron';
                        Notify.send(_msg, {
                            status: 'warning',
                            timeout: 4500
                        });
                        break;
                    default:
                        console.log("error inesperado. cliente Delete");
                }
                $("#btnDeleteCustomer" + vm.deleteCustomerId).button('reset');
            });
        };

        vm.update = function() {

            console.log("updateeee");

            var sendBool = true;

            for (var i in vm.obj) {
                if (vm.obj[i] == vm.objClear[i]) {
                    sendBool = false;
                    break;
                }
            }

            if (sendBool) {

            	if(vm.obj.telefono.length>=7){

	            	vm.obj.punteo_manual = Anuket.moveMarkerCustomer;

	                $("#updateGroup").button('loading');
	                Api('client/' + vm.updateCustomerId + '/', 'PUT', vm.obj).then((function(result) {
	                    switch (result.status) {
	                        case 201:
	                            vm.clearForm();
	                            vm.getCustomers();
	                            $("#createCustomer").modal("hide");
	                            Notify.send("Cliente actualizado con éxito.", {
	                                status: 'success',
	                                timeout: 5000
	                            });
	                            break;
	                        default:
	                            var _msg = 'Las credenciales de autenticación no se proporcionaron';
	                            Notify.send(_msg, {
	                                status: 'warning',
	                                timeout: 4500
	                            });
	                    }
	                    $("#updateGroup").button('reset');
	                }), function(error) {
	                    switch (error) {
	                        case 400:
	                        case 401:
	                            var _msg = 'Las credenciales de autenticación no se proporcionaron';
	                            Notify.send(_msg, {
	                                status: 'warning',
	                                timeout: 4500
	                            });
	                            break;
	                        default:
	                            console.log("error inesperado. put customers");
	                    }
	                    $("#updateGroup").button('reset');
	                });

	            }else{
	            	Notify.send('El teléfono tiene que ser mínimo de 7 caracteres.', {
	                    status: 'warning',
	                    timeout: 5000
	                });
	            }

            } else {
                Notify.send('Por favor valide los datos', {
                    status: 'warning',
                    timeout: 5000
                });
            }

            console.log("sendBool", sendBool);
            console.log("vm.obj", vm.obj);
        };

        vm.save = function() {
            console.log("save");

            var sendBool = true;

            vm.obj.cx = document.getElementById('cxCustomer').value;
            vm.obj.cy = document.getElementById('cyCustomer').value;

            for (var i in vm.obj) {
                if (vm.obj[i] == vm.objClear[i]) {
                    sendBool = false;
                    break;
                }
            }

            if (sendBool) {

            	if(vm.obj.telefono.length>=7){

	            	vm.obj.punteo_manual = Anuket.moveMarkerCustomer;

	                $("#saveGroupNew").button('loading');
	                Api('client/', 'POST', vm.obj).then((function(result) {
	                    switch (result.status) {
	                        case 200:
	                        case 201:
	                            vm.clearForm();
	                            vm.getCustomers();
	                            Notify.send("Cliente creado con éxito.", {
	                                status: 'success',
	                                timeout: 5000
	                            });
	                            break;
	                        default:
	                            var _msg = 'Las credenciales de autenticación no se proporcionaron';
	                            Notify.send(_msg, {
	                                status: 'warning',
	                                timeout: 4500
	                            });
	                    }
	                    $("#saveGroupNew").button('reset');
	                }), function(error) {
	                    switch (error) {
	                        case 400:
	                            var _msg = 'La identificación del cliente debe de ser única';
	                            Notify.send(_msg, {
	                                status: 'warning',
	                                timeout: 5000
	                            });
	                            break;
	                        case 401:
	                            var _msg = 'Las credenciales de autenticación no se proporcionaron';
	                            Notify.send(_msg, {
	                                status: 'warning',
	                                timeout: 4500
	                            });
	                            break;
	                        default:
	                            console.log("error inesperado. post customers");
	                    }
	                    $("#saveGroupNew").button('reset');
	                });
	                $("#saveGroupNew").button('reset');
	            }else{
	            	Notify.send('El teléfono tiene que ser mínimo de 7 caracteres.', {
	                    status: 'warning',
	                    timeout: 5000
	                });
	            }

            } else {
                Notify.send('Por favor valide los datos', {
                    status: 'warning',
                    timeout: 5000
                });
            }

            console.log("sendBool", sendBool);
            console.log("vm.obj", vm.obj);

        };

        vm.onBlur = function() {

            console.log("onblur");

            var addressCustomer = vm.obj.direccion.split(',');
            //cll 84 24 78

            if (addressCustomer.length > 1) {

                var objSend = { city: addressCustomer[1], address: addressCustomer[0] };

                Notify.send("Buscando dirección...", {
                    status: 'info',
                    timeout: 3500
                });

                Anuket.moveMarkerCustomer = false;

                Api('sitidata/geocoder/', 'POST', objSend).then((function(result) {
                    switch (result.status) {
                        case 200:
                        case 201:
                            if (result.data.latitude != 0 && result.data.longitude != 0) {

                            	Notify.send("Geo localización exitosa..", {
                                	status: 'success',
                                	timeout: 3500
                            	});
                                vm.obj.cx = result.data.latitude;
                                vm.obj.cy = result.data.longitude;
                                Anuket.removeMarkers();
                                Anuket.addMarker({ "lat": parseFloat(result.data.latitude), "lng": parseFloat(result.data.longitude) }, true, 'customerCreate', null);
                                Anuket.centerMap(parseFloat(result.data.latitude),parseFloat(result.data.longitude));

                            } else {
                                vm.obj.cx = '';
                                vm.obj.cy = '';
                                Notify.send("Error al buscar la dirección. Por favor ubique el punto de forma manual.", {
                                    status: 'warning',
                                    timeout: 6000
                                });
                            }

                            break;
                        default:
                            var _msg = 'Las credenciales de autenticación no se proporcionaron';
                            Notify.send(_msg, {
                                status: 'warning',
                                timeout: 4500
                            });
                    }
                }), function(error) {
                    switch (error) {
                        case 400:
                        case 401:
                            var _msg = 'Las credenciales de autenticación no se proporcionaron';
                            Notify.send(_msg, {
                                status: 'warning',
                                timeout: 4500
                            });
                            break;
                        case 403:
                            var _msg = 'No tiene permisos para consultar el Geo.';
                            Notify.send(_msg, {
                                status: 'warning',
                                timeout: 4500
                            });
                            break;
                        default:
                            console.log("error inesperado. user_get");
                    }
                });

            } else {
                Notify.send("La dirección no contiene el siguiente formato “dirección, ciudad” ", {
                    status: 'warning',
                    timeout: 7000
                });
            }
        };

        vm.optionsChecked = function() {

            vm.userSelect = [];

            angular.forEach(vm.listUsers, function(value, index) {

                var validate = document.getElementById("customersUsersList")[index].checked;

                if (validate) {
                    vm.userSelect.push(value.id);
                }

            });

            vm.obj.ids_users = vm.userSelect;
        };

        vm.selectAction = function() {

            vm.optionsChecked();
            vm[vm.selectOption]();

        };

        vm.confirm = function(option, groupId) {

            switch (option) {
                case 'save':
                    vm.textConfirmCustomer = 'Esta seguro de guardar este Cliente.';
                    break;
                case 'delete':
                    vm.textConfirmCustomer = 'Esta seguro de eliminar este Cliente.';
                    vm.deleteCustomerId = groupId;
                    break;
                case 'update':
                    vm.textConfirmCustomer = 'Esta seguro de actualizar este Cliente.';
                    break;
                default:
                    console.log("error option incorrect users");
            }

            vm.selectOption = option;

            vm.loadMap();
            $("#confirmCustomer").modal();
        };

        vm.fillFields = function(userId) {


            console.log("userId", userId)
            vm.updateCustomerId = userId;

            vm.btnSHSave = false;
            vm.btnSHUpdate = true;
            vm.titleModal = 'Actualizar Usuario';

            angular.forEach(vm.listCustomers, function(value, index) {

                if (value.id == vm.updateCustomerId) {

                    vm.clearForm();

                    vm.obj = {
                        nombre_cliente: value.nombre_cliente,
                        direccion: value.direccion,
                        identificacion: value.identificacion,
                        telefono: value.telefono,
                        observacion: value.observacion,
                        cx: value.cx,
                        cy: value.cy
                    };

                    vm.loadMap();
                    $("#createCustomer").modal();

                    angular.forEach(vm.listUsers, function(value2, index2) {

                        angular.forEach(value.usuarios, function(value3, index3) {

                            if (value2.id == value3.id) {
                                document.getElementById("customersUsersList")[index2].checked = true;
                            }

                        });

                    });

                }

            });
        };


        vm.loadMap = function() {
            $("#createCustomer").on("shown.bs.modal", function(e) {
                //Anuket.streetView(coords);
                Anuket.run('#mapCustomer', {
                    'zoom': 12,
                    'latlng': { "lat": 4.7454, "lng": -72.38 },
                    'initMarker': false
                });
                Anuket.removeMarkers();
                Anuket.addMarker({ "lat": 4.7454, "lng": -72.38 }, true, 'customerCreate', null);
            });
        }

        vm.createCustomer = function() {

            vm.btnSHSave = true;
            vm.btnSHUpdate = false;
            vm.titleModal = 'Crear Cliente';
            vm.clearForm();
            vm.loadMap();
            $("#createCustomer").modal();

        };


        vm.getCustomers = function() {
            Api('client/', 'GET').then((function(result) {
                switch (result.status) {
                    case 200:

                        vm.listCustomers = result.data.info;

                        $('#customersTable').DataTable().destroy();

                        setTimeout(function() {

                            $('#customersTable').DataTable({
                                "language": {
                                    "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
                                }
                            });

                        }, 100);

                        break;
                    default:
                        var _msg = 'Las credenciales de autenticación no se proporcionaron';
                        Notify.send(_msg, {
                            status: 'warning',
                            timeout: 4500
                        });
                }
            }), function(error) {
                switch (error) {
                    case 400:
                    case 401:
                        var _msg = 'Las credenciales de autenticación no se proporcionaron';
                        Notify.send(_msg, {
                            status: 'warning',
                            timeout: 4500
                        });
                        break;
                    case 403:
                        var _msg = 'No tiene permisos para consultar los Clientes.';
                        Notify.send(_msg, {
                            status: 'warning',
                            timeout: 4500
                        });
                        break;
                    default:
                        console.log("error inesperado. user_get");
                }
            });
        };

        vm.getUsers = function() {

            Api('user/', 'GET').then((function(result) {
                switch (result.status) {
                    case 200:
                        vm.listUsers = result.data.info;
                        break;
                    default:
                        var _msg = 'Las credenciales de autenticación no se proporcionaron';
                        Notify.send(_msg, {
                            status: 'warning',
                            timeout: 4500
                        });
                }
            }), function(error) {
                switch (error) {
                    case 400:
                    case 401:
                        var _msg = 'Las credenciales de autenticación no se proporcionaron';
                        Notify.send(_msg, {
                            status: 'warning',
                            timeout: 4500
                        });
                        break;
                    default:
                        console.log("error inesperado. user_get");
                }
            });
        };

        vm.main = function() {

            if (sessionStorage.session != undefined) {
                APP_CONFIG.AUTH2_TOKEN = JSON.parse(sessionStorage.user).data.token.access_token;
                vm.clearForm();
                vm.getUsers();
                vm.getCustomers();
            } else {
                $state.go('app.slogin');
            };

        };

        vm.main();
    } //customersController

    angular.module('app.core').controller('customersController', customersController);
    customersController.$inject = [
        '$scope',
        '$timeout',
        '$log',
        'Api',
        'Notify',
        'APP_CONFIG',
        '$state',
        'Alerts'
    ];
})();
