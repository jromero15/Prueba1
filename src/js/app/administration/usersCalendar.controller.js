/*
 * gruops controller here
 *
 */
(function() {
    'use strict';

    function usersCalendarController($scope, $timeout, $log, Api, Notify, APP_CONFIG, $state) {
        var vm = this;

        vm.goCalendar = function(id) {

        	var obj = JSON.stringify({"application_id": 1,"status_id": 1,"user_id": id});
        	sessionStorage.setItem("userCalendar",obj);

        	$state.go("app.calendar");

        };

        vm.getUsers = function() {

            Api('user/', 'GET').then((function(result) {
                switch (result.status) {
                    case 200:

                        //$('#usersCalendarTable').DataTable().destroy();
                        vm.listUsers = result.data.info;
                        console.log("list users: ",vm.listUsers);

                        var arrayAvatar = [
                        					'images/avatars/man.svg','images/avatars/man-1.svg','images/avatars/man-2.svg','images/avatars/man-3.svg',
                        					'images/avatars/woman.svg','images/avatars/woman-1.svg','images/avatars/woman-2.svg','images/avatars/woman-3.svg'
                        				  ];

                        var cont = 0;
                        angular.forEach(vm.listUsers, function(value, index){

                        	if(cont==7){
                        		cont=0;
                        	}

                        	value.avatar = arrayAvatar[cont];

                        	cont++;

                        });

                        setTimeout(function() {

                            $('#usersCalendarTable').DataTable({
                                "language": {
                                    "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"
                                },
                                "searching": true,
		                        "paging": false,
		                        "info": false,
		                        "scrollX": false,
		                        "ordering": false
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
                    default:
                        console.log("error inesperado. user_get");
                }
            });
        };

        vm.main = function() {

            if (sessionStorage.session != undefined) {

                APP_CONFIG.AUTH2_TOKEN = JSON.parse(sessionStorage.user).data.token.access_token;
                vm.getUsers();

            } else {
                $state.go('app.slogin');
            };
        };

        vm.main();
    } //usersCalendarController

    angular.module('app.core').controller('usersCalendarController', usersCalendarController);
    usersCalendarController.$inject = [
        '$scope',
        '$timeout',
        '$log',
        'Api',
        'Notify',
        'APP_CONFIG',
        '$state'
    ];
})();
