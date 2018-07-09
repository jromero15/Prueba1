/*
 * login controller here
 *
 */
(function() {
    'use strict';

    function loginController($scope, $state, $timeout, $log, Api, Notify, APP_CONFIG) {
        var vm = this;
        vm.campos = {};

        vm.code = '';
        vm.passNew = '';
        vm.passNew2 = '';
        vm.emailLogin = '';
        vm.passLogin = '';

        function setBackgroundImage() {
            var $page = $('.full-page');
            var image_src = $page.data('image');

            if (image_src !== undefined) {
                var image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>';
                $page.append(image_container);
            }

            $timeout(function() {
                $('.card').removeClass('card-hidden');
            }, 1000);
        }


        vm.changePass = function() {

            if (vm.passNew != '' && vm.passNew2 != '') {

                if (vm.passNew === vm.passNew2) {

                    var campos = { username: vm.emailLogin, code: vm.code, password: vm.passNew2 };

                    Api('user/change_pass/', 'POST', campos).then((function(result) {
                        switch (result.status) {
                            case 200:
                                Notify.send('Clave cambiada con éxito.', {
                                    status: 'success',
                                    timeout: 5000
                                });
                                vm.shChangePass();
                                vm.shLogin();
                                break;
                            default:
                                var _msg = 'Ocurrio un error por favor intente nuevamente. Gracias';
                                Notify.send(_msg, {
                                    status: 'warning',
                                    timeout: 4500
                                });
                        }
                    }), function(error) {
                        switch (error) {
                            case 400:
                                Notify.send("Código incorrecto para cambiar la contraseña", {
                                    status: 'warning',
                                    timeout: 5000
                                });
                                break;
                            case 401:
                            	var _msg = 'Ocurrio un error por favor intente nuevamente. Gracias';
                                Notify.send(_msg, {
                                    status: 'warning',
                                    timeout: 4500
                                });
                                break;
                            default:
                                console.log("error inesperado. code_change_pass");
                        }
                    });

                } else {
                    Notify.send('Las claves ingresadas no coinciden.', {
                        status: 'warning',
                        timeout: 5000
                    });
                }


            } else {

                Notify.send('Por favor valide los datos. Gracias', {
                    status: 'warning',
                    timeout: 5000
                });

            }
        };

        vm.sendCode = function() {

            if (vm.emailLogin != '') {

                var campos = { username: vm.emailLogin };

                Api('user/code_change_pass/', 'POST', campos).then((function(result) {
                    switch (result.status) {
                        case 200:
                            Notify.send(result.message, {
                                status: 'success',
                                timeout: 50000
                            });
                            vm.shSendCode();
                            vm.shChangePass();
                            break;
                        default:
                            var _msg = 'Ocurrió un error por favor intente nuevamente. Gracias';
                            Notify.send(_msg, {
                                status: 'warning',
                                timeout: 4500
                            });
                    }
                }), function(error) {

                    switch (error) {
                        case 401:
                            Notify.send("No se ha podido encontrar tu cuenta.", {
                                status: 'warning',
                                timeout: 5000
                            });
                            break;
                        default:
                            console.log("error inesperado. code_change_pass");
                    }


                });


            } else {

                Notify.send('Por favor valide los datos. Gracias', {
                    status: 'warning',
                    timeout: 5000
                });
            }
        };

        vm.restorePass = function() {
            vm.shLogin();
            vm.shSendCode();
        };

        vm.loginShow = function() {
            vm.shSendCode();
            vm.shLogin();
        };

        vm.shChangePass = function() {

            vm.txtCode = !vm.txtCode;
            vm.txtPassNew = !vm.txtPassNew;
            vm.txtPassNew2 = !vm.txtPassNew2;
            vm.btnChangePass = !vm.btnChangePass;
        };

        vm.shSendCode = function() {
            vm.email = !vm.email;
            vm.btnRestore = !vm.btnRestore;
            vm.txtLogin = !vm.txtLogin;
        };

        vm.shLogin = function() {

            vm.email = !vm.email;
            vm.txtPass = !vm.txtPass;
            vm.btnLogin = !vm.btnLogin;
            vm.txtRestorePass = !vm.txtRestorePass;
        };

        vm.dochange = function() {
            $log.info('dochange', vm.campos);
            vm.dologin();
            //vm.dofalseLogin();
        };

        vm.dofalseLogin = function() {
            //$log.info('dofalseLogin', vm.campos);

            console.log("bbbb")
            sessionStorage.session = true;
            $state.go('app.dashboard');
            /*if (vm.emailLogin != '' && vm.passLogin != '') {

                if (vm.emailLogin === 'andres' && vm.passLogin === '123456') {
                    $state.go('app.dashboard');
                    localStorage.setItem("session", true);
                } else {
                    Notify.send('Usuario invalido.', {
                        status: 'warning',
                        timeout: 4500
                    });
                }
            } else {

                Notify.send('Por favor valide los datos. Gracias', {
                    status: 'warning',
                    timeout: 5000
                });
            }*/

        };


        vm.dologin = function() {

        	$("#btnLogin").button('loading');

            if (vm.emailLogin != '' && vm.passLogin != '') {

                vm.campos.username = vm.emailLogin;
                vm.campos.password = vm.passLogin;

                $log.info('dologin', vm.campos);

                Api('user/Login/', 'POST', vm.campos).then((function(result) {
                    $log.log('Api.post login', result);
                    switch (result.status) {
                        case 200:
                            var _resp = result.data;
                            var _token = _resp.token;
                            sessionStorage.setItem("user", JSON.stringify(result));
                            APP_CONFIG.AUTH2_TOKEN = JSON.parse(sessionStorage.user).data.token.access_token;
                            $state.go('app.dashboard');
                            sessionStorage.setItem("session", true);
                            break;
                        default:
                            Notify.send('Ocurrió un error por favor intente nuevamente. Gracias.', {
                                status: 'warning',
                                timeout: 4500
                            });
                        $("#btnLogin").button('reset');
                    }
                }), function(error) {

                    switch (error) {
                        case 400:
                        case 401:
                            Notify.send("Usuario o clave incorrecta.", {
                                status: 'warning',
                                timeout: 4500
                            });
                            break;
                        default:
                            $log.error('error on login', error);
                    }

                    $("#btnLogin").button('reset');

                });
            } else {
            	$("#btnLogin").button('reset');
                Notify.send('Por favor valide los datos. Gracias', {
                    status: 'warning',
                    timeout: 5000
                });
            }
        };

        vm.main = function() {

            vm.shLogin();

            /*setBackgroundImage();

			Api('v1/logout', 'GET').then((function(result) {
				$log.log('Api logout', result);
			}), function(error) {
				$log.error('error on logout', error);
			});

            $log.warn('cerrando la sesion');
            APP_CONFIG.AUTH2_TOKEN = null;*/
        };

        vm.main();
    } //loginController

    angular.module('app.core').controller('loginController', loginController);
    loginController.$inject = [
        '$scope',
        '$state',
        '$timeout',
        '$log',
        'Api',
        'Notify',
        'APP_CONFIG'
    ];
})();
