/* routes config here*/
(function() {
    'use strict';

    function routesConfig($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        $locationProvider.html5Mode(false);
        $urlRouterProvider.otherwise('/app/login');
        $stateProvider.state('app', {
            url: '/app',
            abstract: true,
            templateUrl: helper.basepath('app.html')
        }).state('app.dashboard', {
            url: '/dashboard',
            title: 'Dashboard',
            templateUrl: helper.basepath('dashboard.html'),
            controller: 'dashController',
            controllerAs: 'dashCtrl',
            resolve: helper.resolveFor('Chartist')
        }).state('app.basemap', {
            url: '/maps',
            title: 'maps',
            templateUrl: helper.basepath('basemap.html'),
            controller: 'baseMapController',
            controllerAs: 'bmapCtrl',
            resolve: helper.resolveFor('Maps', 'MapStyles', 'Dtables')
        }).state('app.groups', {
            url: '/groups',
            title: 'groups',
            templateUrl: helper.basepath('users/groups.html'),
            controller: 'groupsController',
            controllerAs: 'gpCtrl',
            resolve: helper.resolveFor('Dtables')
        }).state('app.customers', {
            url: '/customers',
            title: 'customers',
            templateUrl: helper.basepath('users/customers.html'),
            controller: 'customersController',
            controllerAs: 'ctmsCtrl',
            resolve: helper.resolveFor('Maps','Dtables')
        }).state('app.users', {
            url: '/users',
            title: 'users',
            templateUrl: helper.basepath('users/users.html'),
            controller: 'usersController',
            controllerAs: 'usersCtrl',
            resolve: helper.resolveFor('Dtables')
        }).state('app.profiles', {
            url: '/profiles',
            title: 'Perfiles',
            templateUrl: helper.basepath('examples/profiles.html'),
            controller: 'profilesController',
            controllerAs: 'prflsCtrl'
        }).state('app.slogin', {
            url: '/login',
            title: 'login',
            templateUrl: helper.basepath('login.html'),
            controller: 'loginController',
            controllerAs: 'lgnCtrl'
        }).state('app.calendar', {
			url: '/calendar',
			title: 'calendar',
			templateUrl: helper.basepath('administration/calendar.html'),
			controller: 'calendarController',
			controllerAs: 'clndrCtrl',
			resolve: helper.resolveFor('Calendar', 'SelectBootstrap')
		}).state('app.usersCalendar', {
			url: '/usersCalendar',
			title: 'usersCalendar',
			templateUrl: helper.basepath('administration/usersCalendar.html'),
			controller: 'usersCalendarController',
			controllerAs: 'uCldrCtrl',
			resolve: helper.resolveFor('Dtables')
		}).state('app.config', {
			url: '/config',
			title: 'config',
			templateUrl: helper.basepath('administration/config.html'),
			controller: 'configController',
			controllerAs: 'cfgCtrl',
			resolve: helper.resolveFor('Dtables')
		}).state('app.import', {
        url: '/import',
        title: 'import',
        templateUrl: helper.basepath('administration/import.html'),
        controller: 'importController',
        controllerAs: 'impexp',
        resolve: helper.resolveFor('Dtables')
    });
}

    angular.module('app.routes').config(routesConfig);
    routesConfig.$inject = [
        '$stateProvider',
        '$locationProvider',
        '$urlRouterProvider',
        'RouteHelpersProvider'
    ];
})();
