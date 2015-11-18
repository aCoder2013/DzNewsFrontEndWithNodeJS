/**
 * Created by Song on 2015/10/24.
 */
var newsControllers = angular.module('newsControllers', []);


//首页Controller：newsListCtrl
newsControllers.controller('newsListCtrl', function ($scope,$http,instance) {
    $scope.page = 0;
    $scope.pageTitle = "DzNews";


    //获取新闻列表数据
    $http.get('/api/news').success(function(data) {
        $scope.newses = data;
    });

    $scope.change = function (url) {
      instance.url = url;
    };
    //上一页
    $scope.lastPage = function(){
      $scope.page = $scope.page-1;
      $http.get('/api/news?page='+$scope.page).success(function(data){
          $scope.newses = data ;
      });
    };
    //下一夜
    $scope.nextPage = function(){
      $scope.page = $scope.page+1;
      $http.get('/api/news?page='+$scope.page).success(function(data){
          // $scope.newses =  data;
          angular.forEach(data,function(item) {
               $scope.newses.push(item);
          });
      });
    };
});

//新闻详情页面Controller：newsDetailCtrl
newsControllers.controller("newsDetailCtrl",function($rootScope,$scope, $routeParams,$http,$sce,$location,instance,Notification) {
          if(!(instance.url)){
            //如果是直接通过url访问，则通过newsitem.id获取相应的新闻详情URL
            $http.get("/api/news/"+$routeParams.id).success(function (data) {
            instance.url = data._links.detail.href;
            $http.get(instance.url).success(function (data) {
              $scope.detail = data.detail ;
              $scope.detail.content = $sce.trustAsHtml($scope.detail.content);
              $scope.pageTitle = $scope.detail.title;
              //Get comment
              $http.get(instance.url+"/comment").success(function (data) {
                  $scope.commentList = data;
              });
            });
            });
          }else {
            //如果是通过首页跳转访问则直接获取新闻详情
            $http.get(instance.url).success(function (data) {
              $scope.detail = data.detail ;
              $scope.detail.content = $sce.trustAsHtml($scope.detail.content);
              $scope.pageTitle = $scope.detail.title;
            });
            //Get comment
            $http.get(instance.url+"/comment").success(function (data) {
                $scope.commentList = data;
            });
          };

          //提交评论
          $scope.submitComment = function (content) {
              $http.get('/api/validate').success(function (data) {
                if(!$rootScope.me){
                  $scope.$emit('login',data);
                }
                if(!content){
                    Notification.error({message: '内容为空 ！', positionX: 'center', positionY: 'bottom'});
                    return ;
                }
                user = JSON.parse(data);
                $http.post(instance.url+'/comment/new', $.param({
                  userid:user.id,
                  content:content
                }),{
                  headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                }).success(function (data) {
                    Notification.success({message: '评论成功', positionX: 'center', positionY: 'bottom'});
                    $scope.commentList.push(data);
                });
              }).error(function (data) {
                Notification.error({message: '需要登录后方可回复', positionX: 'center', positionY: 'bottom'});
                $location.path('/login');
                return;
              });
          }
});
//login controller
newsControllers.controller('loginCtrl',function ($rootScope,$scope,$http,$location,instance,Notification) {

  $rootScope.$on('login',function (evt,me) {
    $rootScope.me = me;
  });
  $scope.userLogin = function (user) {
    if(!user.password || !user.password){
        Notification.error({message: '错误！', positionX: 'center', positionY: 'bottom'});
        return ;
    }
    $http.post('/api/user/login',$.param({
      email:user.email,
      password:user.password
    }),{
      headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    }).success(function (data) {
      if(data.code===0){
        Notification.error({message: '邮箱或者密码输入错误！', positionX: 'center', positionY: 'bottom'});
        $location.path('/login');
        return;
      }
      $scope.$emit('login',data.msg);
      Notification.success({message: '登陆成功', positionX: 'center', positionY: 'bottom'});
      if(instance.url){
        $location.path(instance.url);
        return ;
      }
      $location.path('/');
    });
  };
});


//register Controller
newsControllers.controller('regCtrl',function ($scope,$http,$location,Notification) {
    //注册
    $scope.subminRegInfo = function (user) {
      if(!user.name || !user.password || !user.password){
          Notification.error({message: '错误！', positionX: 'center', positionY: 'bottom'});
          return ;
      }
      $http.post('/api/user/register',$.param({
          name:user.name,
          email:user.email,
          password:user.password
      }),{
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      }).success(function (data) {
          Notification.success({message: '注册成功', positionX: 'center', positionY: 'bottom'});
          $location.path('/login');
      });
    };
});
