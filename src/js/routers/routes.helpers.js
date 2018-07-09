/* routes helper here*/
(function() {
	'use strict';
	function RouteHelpersProvider(APP_REQUIRES) {

		/* jshint validthis:true */
		function basepath(uri) {
			return 'views/' + uri;
		}

		function resolveFor () {
			var _args;
			_args = arguments;
			return {
				deps: [
					'$ocLazyLoad', '$q', function($ocLL, $q) {
						var andThen, getRequired, i, len, promise;
						promise = $q.when(1);
						andThen = function(_arg) {
							if (typeof _arg === 'function') {
								return promise.then(_arg);
							} else {
								return promise.then(function() {
									var whatToLoad;
									whatToLoad = getRequired(_arg);
									if (!whatToLoad) {
										return $.error('Route resolve: Bad resource name [' + _arg + ']');
									}
									return $ocLL.load(whatToLoad);
								});
							}
						};

						getRequired = function(name) {
							var m;
							if (APP_REQUIRES.modules) {
								for (m in APP_REQUIRES.modules) {
									if (APP_REQUIRES.modules[m].name && APP_REQUIRES.modules[m].name === name) {
										return APP_REQUIRES.modules[m];
									}
								}
							}
							return APP_REQUIRES.scripts && APP_REQUIRES.scripts[name];
						};

						i = 0;
						len = _args.length;
						while (i < len) {
							promise = andThen(_args[i]);
							i++;
						}
						return promise;
					}
				]
			};
		}

		return {
			basepath: basepath,
			resolveFor: resolveFor,
			$get: function() {
				return {
					basepath: basepath,
					resolveFor: resolveFor
				};
			}
		};

	}

	angular.module('app.routes').provider('RouteHelpers', RouteHelpersProvider);
	RouteHelpersProvider.$inject = [
		'APP_REQUIRES'
	];
})();
