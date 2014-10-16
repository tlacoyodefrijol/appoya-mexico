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
        app.baseURL = '/';
        //app.location = $location;

        if (window.history && history.pushState) {
            //app.baseURL = '/panel';
            $locationProvider.html5Mode(true);
        }
        //$locationProvider.html5Mode(true);

        $routeProvider
            .when(app.baseURL, {
                templateUrl: '/partials/login.html',
                controller: 'ControllerLogin'
            })
            .when(app.baseURL+'dashboard', {
                templateUrl: '/partials/dashboard.html',
                controller: 'ControllerDashboard'
            })
            .when(app.baseURL+'notification/message/:id', {
                templateUrl: '/partials/notificationView.html',
                controller: 'ControllerNotification'
            })
            .when(app.baseURL+'notification/compose', {
                templateUrl: '/partials/notificationCompose.html',
                controller: 'ControllerNotificationCompose'
            })
            .when(app.baseURL+'program', {
                templateUrl: '/partials/elearning/program.html',
                controller: 'ControllerUsers'
            })
            .when(app.baseURL+'learningObject', {
                templateUrl: '/partials/elearning/learningObject.html',
                controller: 'ControllerUsers'
            })
            .when(app.baseURL+'administration/dashboard', {
                templateUrl: '/partials/administration/dashboard.html',
                controller: 'ControllerUsers'
            })
            .when(app.baseURL+'administration/cycles', {
                templateUrl: '/partials/administration/cycles.html',
                controller: 'ControllerCycles'
            })
            .when(app.baseURL+'administration/cycle/:id', {
                templateUrl: '/partials/administration/cycle.html',
                controller: 'ControllerCycle'
            })
            .when(app.baseURL+'administration/events/', {
                templateUrl: '/partials/administration/events.html',
                controller: 'ControllerGroups'
            })
            .when(app.baseURL+'administration/event/:id', {
                templateUrl: '/partials/administration/event.html',
                controller: 'ControllerGroup'
            })
            .when(app.baseURL+'administration/users/:id', {
                templateUrl: '/partials/administration/users.html',
                controller: 'ControllerUsers'
            })
            .when(app.baseURL+'administration/user/:id', {
                templateUrl: '/partials/administration/user.html',
                controller: 'ControllerUser'
            })
            .otherwise({
                controller: function () {
                    window.location.replace('/404.html');
                },
                template: ''
            });
    }]);
app.run(function ($rootScope, $location, $cookieStore) {
    $rootScope.title = 'AppoyaMX';
    $rootScope.$on('$routeChangeSuccess', function () {
        var _profile = typeof $cookieStore.get('profile');
        var _url = $location.url();
        $rootScope.showNav = false;
        if (_profile === 'undefined' && _url !== app.baseURL) {
            $location.path(app.baseURL).replace();
        }
        else if (_profile !== 'undefined' && _url === app.baseURL) {
            $location.path(app.baseURL+'dashboard').replace();
        }
        if (_url !== app.baseURL) {
            $rootScope.showNav = true;
        }
    });
});