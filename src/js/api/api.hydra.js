//A RESTful factory for retrieving json data from backend
(function() {
	'use strict';

	function Api($q, $http, $log, $resource, Notify, APP_CONFIG) {
		return function(url, method, data, options) {
			var defered, promise, uri;
			var objectConstructor = {}.constructor;
			var customHeaders = {};
			var _opts = options;

			var params = {
				'external':false,
				'credentials':false,
				'headers':{
					'header':null,
					'token': null
				}
			};

			if (_opts) {
				if (_opts.constructor === objectConstructor) {
					var size = Object.keys(_opts).length;

					if (size > 0) {
						if (_opts.external !== undefined) {
							if (_opts.external !== null) {
								if (_opts.external === true) {
									params.external = true;
									if (APP_CONFIG.DEBUG) {
										$log.info('using external url');
									}
								}
							}
						}

						if (_opts.headers !== undefined) {
							if (_opts.headers.header !== undefined) {
								if (_opts.headers.header !== '') {
									params.headers.header = _opts.headers.header;
									if (APP_CONFIG.DEBUG) {
										$log.info('using header', _opts.headers.header);
									}
								}
								if (_opts.headers.token !== '') {
									params.headers.token = _opts.headers.token;
									if (APP_CONFIG.DEBUG) {
										$log.info('using token', _opts.headers.token);
									}
								}
							}
						}

						if (_opts.credentials !== undefined) {
							if (_opts.credentials == true) {
								params.credentials = true;
								if (APP_CONFIG.DEBUG) {
									$log.info('setting credentials to true');
								}
							}
						}
					}else{
						$log.error('the options size is not correct');
					}
				} else {
                    $log.error('the options is not a object');
                }
            } else {
                $log.warn('the options was not provided');
            }

			if (params.external === false){
				uri = APP_CONFIG.BASE_URL + url;

				if (APP_CONFIG.AUTH2_TOKEN !== null ){
					customHeaders = {'Authorization': 'Bearer ' + APP_CONFIG.AUTH2_TOKEN};
				}
			}else{
				uri = url;
				if ((params.headers.header !== null) && (params.headers.token !== null)){
					if ((params.headers.header !== '') && (params.headers.token !== '')){
						customHeaders[params.headers.header] = params.headers.token;
						if (APP_CONFIG.DEBUG) {
							$log.info('setting customHeaders');
						}
					}
				}
			}

			defered = $q.defer();
			promise = defered.promise;

			if (params.credentials === true){
				$http.defaults.withCredentials = true;
				if (APP_CONFIG.DEBUG) {
					$log.info('enable credentials');
				}
			}

			$http.defaults.headers.patch = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            };

			$http({
				url: uri,
				headers: customHeaders,
				method: method ? method : 'GET',
				data: data ? data : {},
			}).success(function(data, status, headers, config) {
				if (APP_CONFIG.DEBUG) {
					$log.info('Api Hydra resolve:', data, status, config);
				}
				defered.resolve(data);
			}).error(function(data, status, headers, config) {
				if (APP_CONFIG.DEBUG) {
					$log.error('Api Hydra reject:', data, status, config);
				}
				switch (status) {
					case 401:
						Notify.send('Usuario no autorizado.', {
							status: 'danger'
						});
						break;
					case 500:
					case 503:
						var e= 'Ocurrio un error al intentar realizar el inicio de sesion.\n';
						if (APP_CONFIG.DEBUG) {
							e+='\n Mensaje de Error: <strong>'+data.message+'</strong>';
							e+='\n Codigo de Error: <strong>'+data.status+'</strong>';
							Notify.send(e, {
								timeout: 5000,
								status: 'warning'
							});
						}else{
							e+='\n Mensaje de Error: <strong>'+data.message+'</strong>';
							Notify.send(e, {
								timeout: 5000,
								status: 'warning'
							});
						}
						break;
					default:
						defered.reject(status);
				}
			});

			return promise;
		};
	}

	angular.module('app.api').factory('Api', Api);
	Api.$inject = [
		'$q',
		'$http',
		'$log',
		'$resource',
		'Notify',
		'APP_CONFIG'
	];
})();
