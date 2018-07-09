/**=========================================================
 * Module: utils.factory.js
 * A funny factory for utils
 =========================================================*/
(function() {
    'use strict';

    function ngUtils($log, APP_CONFIG) {
        var utls = {};

        utls.capitalize = function(_string) {
            return _string.charAt(0).toUpperCase() + _string.slice(1);
        };

        utls.checkExt = function(filename) {
            //fix this
            var extensions = _options.allowed_extension;
            var nameFile = filename.name;
            nameFile = nameFile.toLowerCase();
            var ext = nameFile.substr((nameFile.lastIndexOf('.') + 1));
            var isValid = extensions.indexOf(ext) > -1;
            return isValid;
        };

        utls.timeStamp = function() {
            var ts = moment().format('MMDYYYYhmmss');
            return ts;
        };

        utls.sideBar = function(option){

        	if(option==='show'){

        		document.getElementById('sidebar').classList.remove('displaySidebar');
	        	document.getElementById('hideSidebar').classList.remove('displaySidebar');
	        	document.getElementById('itemsSidebar').classList.remove('displaySidebar2');
	        	document.getElementById('contentProfile').classList.remove('opacityHide');
	        	document.getElementById('contentList').classList.remove('opacityHide');

        	}else if(option==='hide'){

        		setTimeout(function(){
	            	document.getElementById('sidebar').classList.add('displaySidebar');
	            }, 500);

            	document.getElementById('contentProfile').classList.add('opacityHide');
            	document.getElementById('contentList').classList.add('opacityHide');
	            document.getElementById('hideSidebar').classList.add('displaySidebar');
	            document.getElementById('itemsSidebar').classList.add('displaySidebar2');

        	}

        };

        return utls;
    }

    angular.module('app.core').factory('ngUtils', ngUtils);
    ngUtils.$inject = [
        '$log',
        'APP_CONFIG'
    ];
})();
