(function(){
  var app = angular.module('Routes', ['Services']);
    app.config(function($stateProvider, $urlRouterProvider){
      $stateProvider
        .state("Home",{
          url:"/",
          templateUrl: "home.html",
          access: { requiredAuthentication: false }
        })
        .state("page",{
          url:"/page",
          templateUrl: "page.html",
          access: { requiredAuthentication: true }
        })
        .state("update",{
          url:"/update",
          templateUrl: "update.html",
          access: { requiredAuthentication: true }
        })
        .state("login",{
          url:"/login",
          templateUrl: "login.html",
          access: { requiredAuthentication: false }
        })
        .state("logout",{
          url:"/logout",
          templateUrl: "logout.html",
          access: { requiredAuthentication: true }
        })
        $urlRouterProvider.otherwise("/");
    })
    app.run(function($rootScope, $location, $window, $state,AuthenticationService) {
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
          if (!AuthenticationService.isAuthenticated && toState.access.requiredAuthentication && !$window.sessionStorage.token){
           event.preventDefault();
           $state.go('login');
       }
        });
    });
  })();
