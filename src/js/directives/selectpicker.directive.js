angular.module('app.core')
	.directive('selectpicker', function($timeout) {
		return {
			restrict: 'A',
			link: function(scope, element, attributes) {
				$timeout(function() {
					scope.$apply(function() {
						element.selectpicker({

							size: (attributes.size) ? attributes.size : 7
						});
						element.selectpicker('refresh');
					});

					scope.$watch('itemSelected', function( newValue, old ){
						element.selectpicker('refresh');
					});

				}, 0);
			}
		};
	});
