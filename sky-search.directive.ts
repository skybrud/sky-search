(function() {
	'use strict';

	angular.module('skySearch').directive('skySearch',skySearchDirective);

	skySearchDirective.$inject = ['$rootScope', 'skyList','skyQueryString'];

	function skySearchDirective($rootScope, skyList, skyQueryString) {
		return {
			restrict:'E',
			templateUrl:'/sky-search/sky-search.template.html',
			scope:{},
			controller:controller,
			controllerAs:'skySearchCtrl'
		};

		function controller() {
			let configuration = {
				api: '/umbraco/api/sitesearchapi/search',
				limit:5
			};

			configuration.api = '/umbraco/api/PhonebookApi/Search/';

			skyList.createInstance('search',configuration).then((list) => {
				this.query = list.query;
				this.data = list.results;
				this.showMore = list.nextPage;

				// Merge query from location.search
				angular.merge(this.query, skyQueryString.getAll());

				// Get results on query change
				$rootScope.$watchCollection(()=> this.query, () => {
					list.getResults();
				});
			});
		}
	}

})();
