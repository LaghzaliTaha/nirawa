(function(){
  var app = angular.module('Routes', ['Services']);
    app.config(function($stateProvider, $urlRouterProvider){
      $stateProvider
        .state("home",{
          url:"/",
          templateUrl: "home.html",
          access: { requiredAuthentication: true }
        })
        .state("page",{
          url:"/page",
          templateUrl: "page.html",
          access: { requiredAuthentication: true }
        })
        .state('stories', {
        url: "/Affichage",
        templateUrl: 'story.html',
        access: { requiredAuthentication: false }
        })
        .state('AfficherPartie', {
        url: "/AfficherPartie/:id",
        templateUrl: 'partstory.html',
        access: { requiredAuthentication: false }
        })
        .state("signin",{
          url:"/signin",
          templateUrl: "signin.html",
          access: { requiredAuthentication: false }
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
        $urlRouterProvider.otherwise("/login");
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
