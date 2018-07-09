/**=========================================================
 * Module: notify.service.js
 * Create a notifications that fade out automatically.
 * Angular 1.x Service Based on Bootstrap Notify plugin http://bootstrap-notify.remabledesigns.com/
 =========================================================*/

(function() {
    'use strict';

    function Notify($timeout) {

        this.send = showNotify;

        /*
			positions
			['top left','top center','top right','bottom left','bottom center','bottom right']
		*/

		function showNotify(_message, _opts) {
			var _titles= {
				info:'<strong>Informacion</strong> ',
				success:'<strong>Listo!</strong> ',
				warning:'<strong>Advertencia</strong> ',
				danger:'<strong>Error</strong> '
			};

			var _options= {
				icon: 'notifications',
				title: _titles.info,
				type: 'info',
				message: null,
				timer: 3000,
				from:'top',
				align:'right'
			};

			if (_message) {
                if ($.type(_message) === 'string') {
                    _options.message= _message;
                }
            }

			if (_opts!== null) {
				if (_opts.status!==null) {
					switch(_opts.status){
						case 'info':
						case 'success':
						case 'warning':
						case 'danger':
							_options.type= _opts.status;
							_options.title= _titles[_opts.status];
							break;
						default:
							_options.type= 'info';
							_options.title= _titles.info;
							break;
					}
				}else{
					_options.type= 'info';
				}

				if (_opts.timeout!== null) {
					if (parseInt(_opts.timeout) > 0) {
						_options.timer= parseInt(_opts.timeout);
					}
				}
			}

			console.warn('notify _options', _options);

			$.notify(
				{
					icon: _options.icon,
					title: _options.title,
					message: _options.message
				},
				{
					type: _options.type,
					timer: _options.timer,
					placement: {
						from: _options.from,
						align: _options.align
					}
			});

			$timeout((function() {
				console.info('Cerrando notify...');
				$.notifyClose();
			}), _options.timer);
		}
    }

    angular.module('app.notify').service('Notify', Notify);
    Notify.$inject = [
    	'$timeout'
    ];

})();
