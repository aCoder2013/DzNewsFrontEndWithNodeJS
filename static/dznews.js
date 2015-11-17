/**
 * Created by Song on 2015/11/16.
 */
var dznews = angular.module('dznews', [
    'ngRoute',
    'newsControllers',
    'ui-notification'
]);

dznews.factory('instance', function(){
    return {};
});


dznews.config(['$routeProvider','$locationProvider',
    function($routeProvider,$locationProvider) {
        $routeProvider.
            when('/',{
              templateUrl: '/part/news_list.html',
              controller: 'newsListCtrl',
            }).
            when('/news', {
                templateUrl: '/part/news_list.html',
                controller: 'newsListCtrl',
            }).
            when('/news/:id', {
                templateUrl: '/part/news_detail.html',
                controller: 'newsDetailCtrl'
            }).
            when('/login',{
                templateUrl: 'part/login.html',
                controller:  'loginCtrl'
            }).
            otherwise({
                redirectTo: '/news'
            });
            // use the HTML5 History API
            $locationProvider.html5Mode(true);
    }]);
