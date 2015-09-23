var appServices = angular.module('Services', []);
appServices.factory('AuthenticationService', function() {
    var auth = {
        isAuthenticated: false,
    }

    return auth;
});
appServices.factory('GetName',function(){
  function urlBase64Decode(str) {
    var output = str.replace('-', '+').replace('_', '/');
    switch (output.length % 4) {
        case 0:
            break;
        case 2:
            output += '==';
            break;
        case 3:
            output += '=';
            break;
        default:
            throw 'Illegal base64url string!';
    }
    return window.atob(output);
}
  function getUserFromToken() {
    var token = window.sessionStorage.token;
    var user = {};
    if (typeof token !== 'undefined') {
        var encoded = token.split('.')[1];
        user = JSON.parse(urlBase64Decode(encoded));
    }
    return user;
}
  var auth = {
    user: getUserFromToken().id,
    admin: getUserFromToken().Admin
    }
  return auth;
})
appServices.factory('TokenInterceptor', function ($q, $window, $location, AuthenticationService) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },

        requestError: function(rejection) {
            return $q.reject(rejection);
        },

        /* Set Authentication.isAuthenticated to true if 200 received */
        response: function (response) {
            if (response != null && response.status == 200 && $window.sessionStorage.token && !AuthenticationService.isAuthenticated) {
                AuthenticationService.isAuthenticated = true;
            }
            return response || $q.when(response);
        },
        /* Revoke client authentication if 401 is received */
        responseError: function(rejection) {
            if (rejection != null && rejection.status === 401 && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
                delete $window.sessionStorage.token;
                AuthenticationService.isAuthenticated = false;
                $location.path("./login");
            }

            return $q.reject(rejection);
        }
    };
});
