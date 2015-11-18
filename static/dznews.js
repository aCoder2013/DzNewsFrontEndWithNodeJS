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



//Core Router
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
            when('/register',{
                templateUrl: 'part/register.html',
                controller:  'regCtrl'
            }).
            otherwise({
                redirectTo: '/news'
            });
            // use the HTML5 History API
            $locationProvider.html5Mode(true);
    }]);
    dznews.config(function(NotificationProvider) {
        NotificationProvider.setOptions({
            delay: 1000,
            startTop: 20,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'left',
            positionY: 'bottom'
        });
    });

    //Run Block
    dznews.run(function ($window,$rootScope,$http,$location,Notification) {
      $rootScope.logout = function () {
        $http.get('/api/user/logout').success(function (data) {
          Notification.success({message: '注销成功', positionX: 'center', positionY: 'bottom'});
          $rootScope.me = null;
          $location.path('/');
        });
      };

      $rootScope.$on('login',function (evt,me) {
        $rootScope.me = me;
      });
    });
