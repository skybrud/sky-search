(function() {
	'use strict';
	
	angular.module('skySearch').directive('skySearch',skySearchDirective);	
	
	skySearchDirective.$inject = ['skyList','skyQueryString'];
	
	function skySearchDirective(skyList:sky.ISkyListFactory, skyQueryString) {
		var directive = {
			restrict:'E',
			templateUrl:'/sky-search/sky-search.template.html',
			scope:{},
			controller:controller,
			controllerAs:'skySearchCtrl'
		};
		
		controller.$inject = ['$scope'];
		function controller($scope) {
			var _this = this;
			
			_this.query = {
				keywords:''
			};
			
			var lastQuery = _this.query.keywords;
			
			var keywords = skyQueryString.get('keywords');
			if(keywords) {
				_this.query.keywords = keywords;
			}

			skyList.createInstance('search',{ api: '/umbraco/api/sitesearchapi/search', limit:5 }).then(function(searchList) {
				_this.data = searchList.results;
				_this.showMore = searchList.getNext;
				
				$scope.$watch(()=>_this.query.keywords, function() {
					if(_this.query.keywords.length<2) {
						return searchList.empty();
					}
					if(lastQuery != _this.query.keywords) {
						searchList.getResults(_this.query);
					}
					lastQuery = _this.query.keywords;
				});
				
			});

		}
		
		return directive;
		
	}
	
})();