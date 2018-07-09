/**=========================================================
 * Module: fileupload.controller.js
 * Version: 0.4
 * Create an Api for upload files
 * Angular 1.x controller Based on angular-file-upload plugin https://github.com/nervgh/angular-file-upload
 =========================================================*/

(function() {
    'use strict';

    function FileUploadController(FileUploader, $scope, $rootScope, APP_CONFIG, $log, Notify, ConfigUpload) {
        var vm = this;
        vm.hasErrors = false;
        vm.errorMessages = '';
        var _options = {};

        function getUri() {
            return _options.uri;
        }

        function checkExt(filename) {
            var extensions = _options.allowed_extension;
            var nameFile = filename.name;
            nameFile = nameFile.toLowerCase();
            var ext = nameFile.substr((nameFile.lastIndexOf('.') + 1));
            var isValid = extensions.indexOf(ext) > -1;
            return isValid;
        }

        vm.initialize = function() {
            _options = ConfigUpload.getConfig();
            $log.info('_options', _options);
        };

        vm.activate = function() {
            var uploader;

            uploader = vm.uploader = new FileUploader({
                url: getUri()
            });

            uploader.formData.push(_options.form_data);
            uploader.headers = _options.headers;

            uploader.filters.push({
                name: 'checkSize',
                fn: function(item) {
                    if (item.size <= _options.max_file_size) {
                        return true;
                        vm.hasErrors = false;
                    }
                    vm.errorMessages = 'El archivo supera el limite permitido';
                    vm.hasErrors = true;
                    return false;
                }
            });

            uploader.filters.push({
                name: 'checkExtension',
                fn: function(item) {
                    var resp = checkExt(item);
                    if (resp == false) {
                        vm.errorMessages = 'El archivo tiene una extension no permitida';
                        vm.hasErrors = true;
                    }
                    return resp;
                }
            });

            uploader.filters.push({
                name: 'maxQueue',
                fn: function() {
                    if (this.queue.length >= _options.queue_limit) {
                        var msg = 'Maximo ' + _options.queue_limit + ' archivos en la cola';
                        vm.errorMessages = msg;
                        vm.hasErrors = true;
                        return false;
                    }
                    vm.hasErrors = false;
                    return true;
                }
            });

            uploader.onAfterAddingFile = function(fileItem) {
                if (APP_CONFIG.DEBUG) {
                    $log.log('onAfterAddingFile', fileItem);
                }
            };

            uploader.onAfterAddingAll = function(addedFileItems) {
                if (APP_CONFIG.DEBUG) {
                    $log.info('onAfterAddingAll', addedFileItems);
                }
            };

            uploader.onWhenAddingFileFailed = function(item, filter, options) {
                if (APP_CONFIG.DEBUG) {
                    $log.info('onWhenAddingFileFailed', item, filter, options);
                }
            };

            uploader.onBeforeUploadItem = function(item) {
                if (APP_CONFIG.DEBUG) {
                    $log.info('onBeforeUploadItem', item);
                }
            };

            uploader.onProgressItem = function(fileItem, progress) {
                if (APP_CONFIG.DEBUG) {
                    $log.info('onProgressItem', fileItem, progress);
                }
            };

            uploader.onProgressAll = function(progress) {
                if (APP_CONFIG.DEBUG) {
                    $log.info('onProgressAll', progress);
                }
            };

            uploader.onSuccessItem = function(fileItem, response, status, headers) {

                switch (status) {
                    case 200:
                        var filetype = fileItem.file.type;
                        var filename = fileItem.file.name;

                        var responseFile = {
                            'filename': filename,
                            'type': filetype,
                            'response': response
                        };

                        $rootScope.$broadcast('fileLoaded', responseFile);

                        Notify.send('El archivo fue enviado con exito.', {
                            status: 'success',
                            timeout: 4000
                        });
                        break;
                    case 400:
                    case 404:
                    case 604:
                        if (APP_CONFIG.DEBUG) {
                            $log.warn('Ocurrio un Error al subir el archivo:', status, response);
                        }
                        var msg = 'Ocurrio un Error al subir el archivo.\nCodigo de Error: ' + status;
                        Notify.send(msg, {
                            status: 'warning',
                            timeout: 6000
                        });
                        break;
                    default:
                        if (APP_CONFIG.DEBUG) {
                            $log.warn('mensaje de error desconocido al cargar el archivo:', status, response);
                        }
                        var msg = 'Ocurrio un error desconocido al subir el archivo.\nCodigo de Error: ' + status;

                        Notify.send(msg, {
                            status: 'danger',
                            timeout: 6000
                        });
                        break;
                } //status
            };

            uploader.onErrorItem = function(fileItem, response, status, headers) {
                if (APP_CONFIG.DEBUG) {
                    $log.warn('onErrorItem', fileItem, response, status, headers);
                }
                Notify.send('Ocurrio un error al intentar subir el archivo', {
                    status: 'warning',
                    timeout: 6000
                });
            };

            uploader.onCancelItem = function(fileItem, response, status, headers) {
                if (APP_CONFIG.DEBUG) {
                    $log.warn('onCancelItem', fileItem, response, status, headers);
                }
            };

            uploader.onCompleteItem = function(fileItem, response, status, headers) {
                if (APP_CONFIG.DEBUG) {
                    $log.info('onCompleteItem', fileItem, response, status, headers);
                }
            };

            uploader.onCompleteAll = function() {
                if (APP_CONFIG.DEBUG) {
                    $log.info('onCompleteAll');
                }
            };
        };

        vm.main = function() {
            vm.initialize();
            vm.activate();
        };

        vm.main();
    }

    angular.module('app.core').controller('FileUploadController', FileUploadController);
    FileUploadController.$inject = [
        'FileUploader',
        '$scope',
        '$rootScope',
        'APP_CONFIG',
        '$log',
        'Notify',
        'ConfigUpload'
    ];
})();
