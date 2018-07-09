/**=========================================================
 * Module: Alerts.service.js
 * A beautiful plugin, that replace the classic alert
 * Angular 1.x Service using plugin http://limonte.github.io/sweetalert2/
 =========================================================*/

(function() {
    'use strict';

    function Alerts($timeout, $log) {

        this.send = showAlerts;

        function showAlerts(_message, _opts) {

            var objectConstructor = {}.constructor;

            var _titles = {
                info: 'Informacion',
                success: 'Listo',
                warning: 'Advertencia',
                danger: 'Error'
            };

            var _buttons = {
                info: 'btn btn-info',
                success: 'btn btn-success',
                warning: 'btn btn-warning',
                danger: 'btn btn-danger'
            };

            var _options = {
                title: _titles.info,
                type: 'info',
                message: null,
                buttons: _buttons.info,
                icon: null,
                fn: null,
                confirmText: 'Aceptar',
                cancelText: 'Cancelar'
            };

            if (_message) {
                if ($.type(_message) === 'string') {
                    _options.message = _message;
                }
            }

            if (_opts) {
                if (_opts.constructor === objectConstructor) {

                    $log.info('the _opts', _opts);
                    var size = Object.keys(_opts).length;

                    if (size > 0) {
                        if (_opts.status !== null) {
                            switch (_opts.status) {
                                case 'info':
                                case 'success':
                                case 'warning':
                                case 'danger':
                                    _options.type = _opts.status;
                                    _options.title = _titles[_opts.status];
                                    _options.buttons = _buttons[_opts.status];
                                    break;
                                default:
                                    break;
                            }
                        } else {
                            _options.type = 'info';
                        }

                        if (_opts.icon !== null) {
                            if (_opts.icon === true) {
                                if (_options.type === 'danger') {
                                    _options.icon = 'error';
                                } else {
                                    _options.icon = _options.type;
                                }
                            }
                        }

                        if (_opts.confirmText !== null) {
                            if (_opts.confirmText !== '') {
                                _options.confirmText = _opts.confirmText;
                            }
                        }

                        if (_opts.cancelText !== null) {
                            if (_opts.cancelText !== '') {
                                _options.cancelText = _opts.cancelText;
                            }
                        }

                        $log.warn('alerts _options', _options);

                        if (_opts.fn !== null) {
                            if (typeof(_opts.fn) === 'function') {
                                swal({
                                    title: _options.title,
                                    text: _options.message,
                                    type: _options.icon,
                                    showCancelButton: true,
                                    confirmButtonClass: _options.buttons,
                                    cancelButtonClass: 'btn btn-danger',
                                    confirmButtonText: 'Aceptar',//_options.confirmText,
                                    cancelButtonText: 'Cancelar',//_options.cancelText,
                                    buttonsStyling: false,
                                    allowOutsideClick: false
                                }).then(function() {
                                    $log.info("call to fn function");
                                    _opts.fn();
                                });
                            } else {
                                $log.error("fn is not a valid function method");
                            }
                        } else {
                            swal({
                                title: _options.title,
                                text: _options.message,
                                type: _options.icon,
                                buttonsStyling: false,
                                confirmButtonClass: _options.buttons,
                                allowOutsideClick: false,
                            });
                        }
                    } else {
                        swal({
                            title: _options.title,
                            text: _options.message,
                            type: 'info',
                            buttonsStyling: false,
                            confirmButtonClass: _options.buttons,
                            allowOutsideClick: false,
                        });
                    }
                } else {
                    $log.error('the _opts is not a object');
                }
            } else {
                $log.error('the _opts was not provided');
            }
        }
    }

    angular.module('app.alerts').service('Alerts', Alerts);
    Alerts.$inject = [
        '$timeout',
        '$log'
    ];

})();
