(function(){

  var app = angular.module('controllers', ['Services']);
    app.controller('FormCtrl', ['$scope','$http','$location', '$window','AuthenticationService',function($scope,$http,$location, $window,AuthenticationService) {
        console.log("access to console");
        $scope.login = function() {
          if($scope.user.username !== undefined && $scope.user.password !== undefined){
            console.log("Login Access success");
            $http.post('./login', $scope.user).success(function(response) {
              if(response == 1){
                $scope.user.message="Utilisateur n'existe pas !!";
              }
              else if(response == 0){
                $scope.user.message="Mot de passe n'est pas correct !!";
              }else{
              $window.sessionStorage.isAuthenticated = true;
              AuthenticationService.isAuthenticated = true;
              $window.sessionStorage.token = response.token;
              console.log('test');
              $location.path("/");}
            }).error(function(status, data) {
                $scope.user.message=status;
                console.log(data);
              });
          };
        }
        }]);

        app.controller('UpdateCtrl', ['$scope','$http','$location','GetName','AuthenticationService',function($scope,$http,$location,GetName,AuthenticationService) {
            console.log("access to console update");
            var user = GetName.user;
            $http.get('./update/'+user).success(function(response) {
              $scope.email = response.email_or_phone;
              $scope.firstname = response.first_name;
              $scope.lastname = response.last_name;
            });
            $scope.update = function() {
              $scope.message="";
              if (!AuthenticationService.isAuthenticated) {
                $location.path("/admin");
            }
            else {
              var user = {
                  email_or_phone: $scope.email,
                  firstname: $scope.firstname,
                  lastname: $scope.lastname,
                  password: $scope.password
              }
              console.log(user);
                $http.post('./update', user).success(function(response) {
                    console.log(response);
                    if(response == 0){
                      $scope.message="invalid mot de pass"
                    }else if(response == 1){
                      $scope.message="@ email n'est pas correct"
                    }else {
                    $location.path("update");
                    }
                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
        };
        $scope.reset = function(){
          var user = GetName.user;
          $http.get('./update/'+user).success(function(response) {
            $scope.email = response.email_or_phone;
            $scope.firstname = response.first_name;
            $scope.lastname = response.last_name;
          });
          $scope.password=""
          $scope.message=""
        };
        }]);

        app.controller('NavCtrl', ['$scope','$window','GetName','AuthenticationService','$http','$location',function($scope,$window,GetName,AuthenticationService,$http,$location) {
          $scope.token = function() {
            if (!AuthenticationService.isAuthenticated && !$window.sessionStorage.token){
             return true;
            }
            else{
              $scope.username=GetName.user;
              return false;
            };
          };
          $scope.logout = function() {
              $http.get('./logout').success(function(data){
                console.log('ttttt');
                AuthenticationService.isAuthenticated = false;
                $window.sessionStorage.clear();
                $location.path("./");
              });
          };
        }]);
        app.run(['$window','GetName','AuthenticationService','$location', function ($window,GetName,AuthenticationService,$location) {
          if(GetName.admin == false){
            AuthenticationService.isAuthenticated = false;
            $window.sessionStorage.clear();
            $location.path("login");
          }
          else{
            if($window.sessionStorage.isAuthenticated){
              AuthenticationService.isAuthenticated = true;
            }
          }
        }]);
  })();
