/* global angular */
(function () {
	'use strict';

	/**
	 * Controller: searchCtrl
	 * DEPENDS ON skyListCtrl
	 *
	 * This controller gets search-results from api, and exposes
	 * a showMore()-method
	 *
	**/

	angular.module('skySearch').controller('SkySearchCtrl', SkySearchCtrl);

	SkySearchCtrl.$inject = ['$scope', '$controller', '$timeout', 'skyQueryString'];

	function SkySearchCtrl($scope, $controller, $timeout, skyQueryString) {

		var _this=this,
			wait={};

		// make this controller extend the genericListCtrl for basic list-methods
		angular.extend(this,$controller('SkyListCtrl',{$scope:$scope}));

		// change default configuration
		$scope.prefs.limit = 2;
		$scope.prefs.api = '/umbraco/api/sitesearchapi/search';

		var keywords = skyQueryString.get('keywords');

		// Define the $scope.query defaults
		$scope.query = {
			// Handle keywords edge cases (booleans, empty strings and no keywords)
			keywords: (keywords && typeof keywords !== 'boolean') ? keywords : '',
			category:''
		};

		// Function to call from the view
		_this.showMore = function() {
			$scope.getNext().then(function(res) {
				// add the data to the results.data-array
				_this.results.data.push.apply(_this.results.data,res.data.data);
			}, function() {
				// fail silently
			});
		};

		$scope.$watch('query', function(){

			$timeout.cancel(wait);
			wait = $timeout(function() {

				if ($scope.query.keywords.length > 2) {

					_this.loading = true;

					$scope.getResults().then(function(res) {
						_this.results = res.data;
						_this.loading = false;

					}, function(res) {
						// fail silently
						_this.loading = false;
					});
				} else {
					_this.results=[];
				}

			},300);

		}, true);

	}


})();
