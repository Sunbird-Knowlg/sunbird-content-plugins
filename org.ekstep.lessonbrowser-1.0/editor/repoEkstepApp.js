angular.module('org.ekstep.contentprovider', [])
.controller('contentproviderekstepController', ['$scope', function($scope) {
    var ctrl = this;

    ctrl.err = null;
    ctrl.res = {count:0, content:{}};
    var searchBody = {"request": {
                        "filters":{
                           "objectType": ["Content"],
                           "status": ["Live"]
                        },
                        "limit": 100,
                        "offset":0
                    }};

    // Get accordions functioning
    setTimeout(function(){$('.ui.accordion').accordion()}, 200);

    var searchService = org.ekstep.contenteditor.api.getService(ServiceConstants.SEARCH_SERVICE);

    ctrl.searchLessons = function(searchBody){
        searchService.search(searchBody, function(err, res){
            if (err) {
                ctrl.err = "Oops! Something went wrong. Please try again later.";
            } else {
                ctrl.res.count = res.data.result.count;
                ctrl.res.content = res.data.result.content;
            }
            $scope.$safeApply();
        });
    };
    ctrl.searchLessons(searchBody);

    $scope.searchByKeyword = function(){
        searchBody.request.filters.name = {"startsWith": this.searchKeyword};
        ctrl.searchLessons(searchBody);
    };

    $scope.resetSearchByKeyword = function(){
        this.searchKeyword = '';
        delete searchBody.request.filters.name;
        ctrl.searchLessons(searchBody);
    };

}]).filter('removeHTMLTags', function() {
    return function(text) {
        return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
}).filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace !== -1) {
              //Also remove . and , so its gives a cleaner result.
              if (value.charAt(lastspace-1) === '.' || value.charAt(lastspace-1) === ',') {
                lastspace = lastspace - 1;
              }
              value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});