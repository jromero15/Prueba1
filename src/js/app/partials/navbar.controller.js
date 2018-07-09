/*
* navbar controller here
*
*/
(function() {
	'use strict';

	function navbarController($scope, $log, ngUtils) {
		var vm = this;


		vm.showSidebar = function(){
			ngUtils.sideBar('show');
		}


		vm.main = function() {
			$log.info('navbar Controller');
		};

		vm.main();
	}

	angular.module('app.core').controller('navbarController', navbarController);
	navbarController.$inject = [
		'$scope',
		'$log',
		'ngUtils'
	];
})();
