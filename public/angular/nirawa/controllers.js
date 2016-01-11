(function(){
  window.fbAsyncInit = function() {
  FB.init({
   appId      : '471980126296406',
   xfbml      : true,
   version    : 'v2.4'
  });
  };

  (function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  var app = angular.module('controllers', ['Services']);
    app.controller('HomeCtrl', ['$scope','$http','$location', '$window','AuthenticationService',function($scope,$http,$location, $window,AuthenticationService) {
        console.log("access to console");
          $scope.user = {};
        $scope.login = function() {
          if($scope.user.email !== undefined && $scope.user.password !== undefined){
            console.log("Login Access success");
            $http.post('https://hikaya.herokuapp.com/nirawa/login', $scope.user).success(function(response) {
              console.log(response);
              if(response == 1){
                $scope.user.message="Utilisateur n'existe pas !!";
              }
              else if(response == 0){
                $scope.user.message="Mot de passe n'est pas correct !!";
              }else{
              $window.sessionStorage.isAuthenticated = true;
              AuthenticationService.isAuthenticated = true;
              $window.sessionStorage.isNFB = true;
              AuthenticationService.isNFB = true;
              $window.sessionStorage.token = response.token;
              console.log('test');
              $location.path("/");}
            }).error(function(status, data) {
                $scope.user.message=status;
                console.log(data);
              });
          }else{
            $scope.user.message = "Il faut remplire tous les champs.";
          };
        }
        $scope.FBLogin = function(){
          FB.login(function (response) {
                  if (response.authResponse) {
                      console.log('Welcome!  Fetching your information.... ');
                      FB.api('/me?fields=name,email,last_name,first_name', function (response) {
                          console.log(response);
                          var fbuser = response;
                          $http.post('https://hikaya.herokuapp.com/nirawa/loginFB', response).success(function(response) {
                            if(response == 1){
                              $http.post('https://hikaya.herokuapp.com/nirawa/confirm',fbuser).success(function(response) {
                                $window.sessionStorage.isAuthenticated = true;
                                AuthenticationService.isAuthenticated = true;
                                $window.sessionStorage.token = response.token;
                                $location.path("/");
                              }).error(function(status, data) {
                                  $scope.message=status;
                                  console.log(data);
                                });
                            }
                            else{
                              console.log(response);
                            $window.sessionStorage.isAuthenticated = true;
                            AuthenticationService.isAuthenticated = true;
                            $window.sessionStorage.token = response.token;
                            $location.path("/");
                            }
                          }).error(function(status, data) {
                            console.log(status);
                              console.log(data);
                            });
                      });
                  } else {
                      console.log('User cancelled login or did not fully authorize.');
                  }
              },{scope: 'email',
                return_scopes: true});
        }
        }]);

        app.controller('UpdateCtrl', ['$scope','$http','$location','GetName','AuthenticationService',function($scope,$http,$location,GetName,AuthenticationService) {
            if(!AuthenticationService.isNFB){
              $location.path("home");
            }
            else{
            var user = GetName.user;
            console.log(user);
            var user = GetName.user;
            console.log(user);
            $http.get('https://hikaya.herokuapp.com/nirawa/update/'+user).success(function(response) {
              $scope.email = response.email_or_phone;
              $scope.firstname = response.first_name;
              $scope.lastname = response.last_name;
            });
            $scope.update = function() {
              $scope.message="";
              if (!AuthenticationService.isAuthenticated) {
                $location.path("login");
            }
            else {
              var user = {
                  email: $scope.email,
                  firstname: $scope.firstname,
                  lastname: $scope.lastname,
                  password: $scope.password
              }
                $http.post('https://hikaya.herokuapp.com/nirawa/update', user).success(function(response) {
                    if(response == 0){
                      $scope.message="invalid mot de passe"
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
          }
        };
            $scope.reset = function(){
              var user = GetName.user;
              $http.get('https://hikaya.herokuapp.com/nirawa/update/'+user).success(function(response) {
                $scope.email = response.email_or_phone;
                $scope.firstname = response.first_name;
                $scope.lastname = response.last_name;
              });
              $scope.password=""
              $scope.message=""
            };
        }]);

        app.controller('CreateCtrl', ['$scope','$http','$window','$location','AuthenticationService',function($scope,$http,$window,$location,AuthenticationService) {
            $scope.user = {};
            $scope.create = function() {
              if($scope.user.email !== undefined && $scope.user.password !== undefined && $scope.user.passwordConfirmation !== undefined){
                if($scope.user.password == $scope.user.passwordConfirmation){
                  $http.post('https://hikaya.herokuapp.com/nirawa/signin', $scope.user).success(function(response) {
                    $window.sessionStorage.isAuthenticated = true;
                    AuthenticationService.isAuthenticated = true;
                    $window.sessionStorage.isNFB = true;
                    AuthenticationService.isNFB = true;
                    $window.sessionStorage.token = response.token;
                    $location.path('/');
                  }).error(function(status, data) {
                      $scope.user.message=status;
                      console.log(data);
                    });
                }
                else{
                  $scope.user.message = "Le mot de passe de confirmation est erroné.";
                }
              }
              else{
                  $scope.user.message = "Il faut remplire tous les champs.";
              }
            };
        }]);

        app.controller('NavCtrl', ['$scope','$http','$window','$location','AuthenticationService',function($scope,$http,$window,$location,AuthenticationService) {
          $scope.token = function() {
            if (!AuthenticationService.isAuthenticated && !$window.sessionStorage.token){
             return true;
            }
            else{
              return false;
            };
          }
          $scope.NFB = function(){
            if(AuthenticationService.isNFB){
              return false;
            }
            else{
              return true;
            }
          }
          $scope.logout = function() {
              $http.get('https://hikaya.herokuapp.com/nirawa/logout').success(function(data){
                AuthenticationService.isAuthenticated = false;
                AuthenticationService.isNFB = false;
                $window.sessionStorage.clear();
                $location.path("login");
              });
          };
        }]);
  app.controller("StoryController",function ($scope, $http,$location) {
    $scope.article = {};
    $http.get('https://hikaya.herokuapp.com/nirawa/Affichage')
            .success(function(data) {
                $scope.article = data;
            })
    		 .error(function(data) {
                console.log('Error: ' + data);
            });
    });

    app.controller("lightbox",function($scope){
    $scope.DoLightbox=function(){
      $('.lightbox').click(function(){
          $('.backdrop, .boite').animate({'opacity':'.50'}, 300, 'linear');
          $('.boite').animate({'opacity':'1.00'}, 300, 'linear');
          $('.backdrop, .boite').css('display', 'block');
        });
 
        $('.close').click(function(){
          $('.backdrop, .boite').animate({'opacity':'0'}, 300, 'linear', function(){
          $('.backdrop, .boite').css('display', 'none');
        });
        });
 
        $('.backdrop').click(function(){
         $('.backdrop, .boite').animate({'opacity':'0'}, 300, 'linear', function(){
          $('.backdrop, .boite').css('display', 'none');
        });
        });
      } ;
 
      });
  
  app.controller("PartsController",function($scope,$location,$http,$sce){
$scope.parts={};
$scope.DoLightbox=function(){
      $('.lightbox').click(function(){
          $('.backdrop, .boite').animate({'opacity':'.50'}, 300, 'linear');
          $('.boite').animate({'opacity':'1.00'}, 300, 'linear');
          $('.backdrop, .boite').css('display', 'block');
        });
 
        $('.close').click(function(){
          $('.backdrop, .boite').animate({'opacity':'0'}, 300, 'linear', function(){
          $('.backdrop, .boite').css('display', 'none');
        });
        });
 
        $('.backdrop').click(function(){
         $('.backdrop, .boite').animate({'opacity':'0'}, 300, 'linear', function(){
          $('.backdrop, .boite').css('display', 'none');
        });
        });
      } ;
 
$scope.jsonAsHtml = function(html) {
          return $sce.trustAsHtml(html);
        };

      $http.get('.'+$location.url())
          .success(function(data) {
              $scope.parts= data.parts;
             // for(i=0 ;i<$scope.parts.length ; i++)
               //$scope.parts[i].content=$sce.trustAsHtml($scope.parts[i].content);
          })
  		 .error(function(data) {
              console.log('Error: ' + data);
          });
       $scope.currentPage=0;
       $scope.pageSize=1;
       $scope.numberOfPages=function(){
        return Math.ceil($scope.parts.length) ;
       }
});
app.filter('startFrom',function(){
  return function(input,start){
    start=+start;
    return input.slice(start);
  }
})
app.run(['$window','GetName','AuthenticationService','$location', function ($window,GetName,AuthenticationService,$location) {
  if(GetName.admin == true){
    AuthenticationService.isAuthenticated = false;
    AuthenticationService.isNFB = false;
    $window.sessionStorage.clear();
    $location.path("login");
  }
  else{
    if($window.sessionStorage.isNFB){
      AuthenticationService.isNFB = true;
    }
  }
}]);
  })();
