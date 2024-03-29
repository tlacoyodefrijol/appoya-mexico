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
                templateUrl: '/partials/dashboard.html',
                controller: 'ControllerLogin'
            })
            .when(app.baseURL+'notification/message/:id', {
                templateUrl: '/partials/notificationView.html',
                controller: 'ControllerNotification'
            })
            .when(app.baseURL+'notification/compose', {
                templateUrl: '/partials/notificationCompose.html',
                controller: 'ControllerNotificationCompose'
            })
            .when(app.baseURL+'eventos/', {
                templateUrl: '/partials/administration/events.html',
                controller: 'ControllerEvents'
            })
            .when(app.baseURL+'evento/:id', {
                templateUrl: '/partials/administration/event.html',
                controller: 'ControllerEvent'
            })
            .when(app.baseURL+'usuarios/:id', {
                templateUrl: '/partials/administration/users.html',
                controller: 'ControllerUsers'
            })
            .when(app.baseURL+'usuario/:id', {
                templateUrl: '/partials/administration/user.html',
                controller: 'ControllerUser'
            })
            .when(app.baseURL+'informacion', {
                templateUrl: '/partials/informacion.html'
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
        //console.log($location.url(),$location.path())
        /*$rootScope.showNav = false;
        if (_profile === 'undefined' && _url !== app.baseURL) {
            console.log('if')
            $location.path(app.baseURL).replace();
        }
        else if (_profile !== 'undefined' && _url === app.baseURL) {
            console.log('else if ',_url)
            $location.path(app.baseURL+'tablero').replace();
        }
        if (_url !== app.baseURL) {
            $rootScope.showNav = true;
        }*/
        if (_profile === 'undefined') {
            $cookieStore.put('profile','visitante');
        }
    });
});