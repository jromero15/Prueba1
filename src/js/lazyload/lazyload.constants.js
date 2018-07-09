/*lazyload constants here*/
(function() {
    'use strict';
    angular.module('app.lazyload').constant('APP_REQUIRES', {
        debug: true,
        modules: [{
            name: 'Maps',
            files: [
                'libs/gmaps.min.js',
                'libs/Anuket.js'
            ]
        },{
            name: 'UtilsMaps',
            files: [
                'libs/haversine.js',
                'libs/markerclusterer.js'
            ]
        },{
            name: 'MapStyles',
            files: [
                'libs/dark_theme.js',
                'libs/gray_theme.js',
                'libs/took_theme.js'
            ]
        },{
            name: 'Dtables',
            files: [
                'libs/jquery.dataTables.min.js',
                'libs/angular-datatables.min.js'
            ]
        },{
			name: 'angularFileUpload',
			files: [ 'libs/angular-file-upload.min.js' ]
		},{
			name: 'Chartist',
			files: [ 'libs/Chartist.js' ]
		},{
			name: 'Calendar',
			files: [
				'libs/fullcalendar.min.js'
			]
		},{
			name: 'SelectBootstrap',
			files: [
				'libs/jquery.select-bootstrap.js',
				'libs/bootstrap-datetimepicker.js'
			]
		}]
    });
})();
