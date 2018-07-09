/*core constants here*/
(function() {
    'use strict';

    angular.module('app.core').constant('APP_CONFIG', {
        BASE_URL: 'https://backend-dot-cloud-rutakontrol.appspot.com/',
        AUTH2_URL: 'api',
        AUTH2_TOKEN: null,
        DEBUG: false,
        SESSION_TIMEOUT: 3600,
		USER_SESSION: null,
        AUTH2_CONFIG: {
            'client_id': 'client_material',
            'client_secret': 'secret_material',
            'grant_type': 'password'
        },
        DT_OPTIONS: {
            'lengthMenu': ' _MENU_ Registros por pagina',
            'zeroRecords': ' ',
            'info': 'Mostrando pagina _PAGE_ de _PAGES_',
            'infoEmpty': 'No hay registros para mostrar',
            'infoFiltered': '(Filtrando de un total de _MAX_ registros)',
            'paginate': {
                'previous': 'Anterior',
                'next': 'Siguiente',
                'first': 'Primera',
                'last': 'Ultima'
            }
        }
    }).constant('APP_MEDIAQUERY', {
        'desktopLG': 1200,
        'desktop': 992,
        'tablet': 768,
        'mobile': 480
    }).constant('UPLOAD_FILES', {
        max_file_size: 2995186, // 3 MB,
        allowed_extension: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'pdf', 'txt', 'csv'],
        queue_limit: 5,
        external_uri: false,
        uri: 'uploads',
        form_data: {},
        headers: {}
    });
})();
