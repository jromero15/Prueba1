/*core init here*/
(function() {
    'use strict';

    function settingsRun($rootScope, $state, $log, $localStorage, APP_CONFIG) {
        $rootScope.app = {
            name: 'FrontEndBase',
            description: ' - FrontEndBase',
            fullname: 'FrontEndBase',
            year: (new Date).getFullYear(),
            version: '1.0.a',
            viewAnimation: 'ng-fadeInUp',
            background: 'cyan darken-1',
            uri: null,
            hideNavBar:false
        };

		$rootScope.go = function (path) {
			$state.go(path);
		}

		$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
			var uri= toState.url;
			$log.warn('stateChangeStart fn', uri);
			$rootScope.app.uri= uri;

			if ($rootScope.app.uri != '/login'){
				$rootScope.app.hideNavBar=true;
			}else{
				$rootScope.app.hideNavBar=false;
			}
		});

		$rootScope.$on('$stateNotFound', function (event, notFoundState){
			event.preventDefault();
			$log.warn('state not found', notFoundState.to);

			if (APP_CONFIG.DEBUG){
				$log.warn(notFoundState.toParams);
				$log.warn(notFoundState.options);
			}
		});

		$rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error){
			event.preventDefault();
			$log.error('state error', toState.url);
			$log.error(error);

			if (APP_CONFIG.DEBUG){
				$log.error('from', fromState.name, '[', fromState.url, ']');
				$log.error(error);
			}
		});
    };

	angular.module('app.core').run(settingsRun);
	settingsRun.$inject = [
		'$rootScope',
		'$state',
		'$log',
		'$localStorage',
		'APP_CONFIG'
	];
})();
