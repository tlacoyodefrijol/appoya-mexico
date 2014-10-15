var app = angular.module('Main', ['ngRoute', 'ngCookies']);
app.config([
    '$routeProvider',
    '$locationProvider',
    '$controllerProvider',
    '$compileProvider',
    '$filterProvider',
    '$provide',
    function ($routeProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
        app.controllerProvider = $controllerProvider;
        app.compileProvider = $compileProvider;
        app.routeProvider = $routeProvider;
        app.filterProvider = $filterProvider;
        app.provide = $provide;

        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/', {
                templateUrl: '/partials/home.html',
                controller: 'ControllerHome'
            })
            .otherwise({
                controller: function()
                {
                    window.location.replace('/404.htm');
                },
                template:''
            });
    }]);
