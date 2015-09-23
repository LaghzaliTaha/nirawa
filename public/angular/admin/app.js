var app=angular.module('app',['ui.router','Routes','controllers','Services']);
app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});
