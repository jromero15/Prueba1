(function() {
    'use strict';

    function ConfigUpload($log, APP_CONFIG, UPLOAD_FILES) {

        var _options = {
	        max_file_size: UPLOAD_FILES.max_file_size,
	        allowed_extension: UPLOAD_FILES.allowed_extension,
	        queue_limit: UPLOAD_FILES.queue_limit,
	        external_uri: false,
	        uri: APP_CONFIG.BASE_URL + UPLOAD_FILES.uri,
	        form_data: {},
	        headers: {}
	    };

        this.configure = configureUpload;
        this.getConfig = getConfiguration;

        function configureUpload(_opts) {
        	if (_opts) {
	        	if (_opts.max_file_size !== undefined) {
					if (_opts.max_file_size !== null) {
						if (_opts.max_file_size > 0) {
							_options.max_file_size = _opts.max_file_size;
							if (APP_CONFIG.DEBUG) {
								$log.info('settings max_file_size for uploads');
							}
						}else{
							$log.error('the max_file_size must be great than 0');
						}
					}
				}

				if (_opts.allowed_extension !== undefined) {
					if (_opts.allowed_extension !== null) {
						if (_opts.allowed_extension.constructor === [].constructor) {
							_options.allowed_extension = _opts.allowed_extension;
							if (APP_CONFIG.DEBUG) {
								$log.info('settings allowed_extension for uploads');
							}
						}else{
							$log.error('the allowed_extension is not a array');
						}
					}
				}

				if (_opts.queue_limit !== undefined) {
					if (_opts.queue_limit !== null) {
						if (_opts.queue_limit > 0) {
							_options.queue_limit = _opts.queue_limit;
							if (APP_CONFIG.DEBUG) {
								$log.info('settings queue_limit for uploads');
							}
						}else{
							$log.error('the queue_limit must be great than 0');
	                	}
					}
				}

				if (_opts.external_uri !== undefined) {
					if (_opts.external_uri !== null) {
						if (_opts.external_uri === true) {
							_options.external_uri = _opts.external_uri;
							if (APP_CONFIG.DEBUG) {
								$log.info('using external_uri for uploads');
							}
						}
					}
				}

	        	if (_opts.uri !== undefined) {
					if (_opts.uri !== null) {
						if (0 === _opts.uri.length) {
							$log.error("the uri must not be empty");
						}else{
							_options.uri = _opts.uri;
							if (APP_CONFIG.DEBUG) {
								$log.info('using default uri for uploads');
							}
						}
					}
				}

				if (_opts.form_data !== undefined) {
					if (_opts.form_data !== null) {
						if (_opts.form_data.constructor === {}.constructor) {
							_options.form_data = _opts.form_data;
							if (APP_CONFIG.DEBUG) {
								$log.info('settings form_data for uploads');
							}
						}else{
	                    	$log.error('the form_data is not a object');
	                	}
					}
				}

				if (_opts.headers !== undefined) {
					if (_opts.headers !== null) {
						if (_opts.headers.constructor === {}.constructor) {
							_options.headers = _opts.headers;
							if (APP_CONFIG.DEBUG) {
								$log.info('settings headers for uploads');
							}
						}else{
							$log.error('the headers is not a object');
						}
					}
				}
			} else {
                $log.warn('the options was not provided, using default settings');
				$log.info(_options);
            }
        }

        function getConfiguration() {
			var size = Object.keys(_options).length;
			if (size > 0) {
				return _options;
			}else{
                $log.error('An error occurred when obtaining the default settings');
				return false;
			}
        }
    }

    angular.module('app.sharedUpload').service('ConfigUpload', ConfigUpload);
    ConfigUpload.$inject = [
    	'$log',
    	'APP_CONFIG',
    	'UPLOAD_FILES'
    ];

})();
