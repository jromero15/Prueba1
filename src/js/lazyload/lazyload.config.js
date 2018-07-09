/*lazyload config here*/
(function() {
    'use strict';

    function lazyloadConfig($ocLazyLoadProvider, APP_REQUIRES) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: APP_REQUIRES.modules
        });
    }

    angular.module('app.lazyload').config(lazyloadConfig);
    lazyloadConfig.$inject = [
    	'$ocLazyLoadProvider',
    	'APP_REQUIRES'
    ];
})();
