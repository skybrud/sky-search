(function() {
	'use strict';

	angular.module('skySearch').directive('skySearch',skySearchDirective);

	skySearchDirective.$inject = ['$rootScope', 'skyList','skyQueryString'];

	function skySearchDirective($rootScope, skyList, skyQueryString) {
		let directive = {
			restrict:'E',
			templateUrl:'/sky-search/sky-search.template.html',
			scope:{},
			controller:controller,
			controllerAs:'skySearchCtrl'
		};

		controller.$inject = ['$scope'];

		function controller($scope) {
			let configuration = {
				api: '/umbraco/api/sitesearchapi/search',
				limit:5
			};

			this.query = {
				// Optional: Define default properties here
			};

			skyList.createInstance('search',configuration).then((list) => {
				this.query = angular.merge(list.query, this.query);
				this.data = list.results;
				this.showMore = list.nextPage;

				// Merge query from location.search
				angular.merge(this.query, skyQueryString.getAll());

				// Get results on query change
				$rootScope.$watchCollection(()=> this.query, () => {
					list.getResults();
				});
			});

			$scope.$on('$destroy', function() {
				skyList.killInstance('search');
			});
		}

		return directive;
	}

})();
