app.controller('ControllerLogin', ['$rootScope', '$scope', '$http', '$location', '$window', '$cookieStore',
    function ($rootScope, $scope, $http, $location, $window, $cookieStore) {
        $scope.user = {};
        $scope.isWidget = false;


        if($cookieStore.get('profile') === 'visitante' || typeof $cookieStore.get('profile') === 'undefined') {
            $rootScope.isLogged = false;
        } else {
            $rootScope.isLogged = true;
        }
        $scope.doLogout = function () {
            console.log('doLogout');
            $cookieStore.remove('profile');
            $cookieStore.remove('viewAs');
            $cookieStore.remove('profiles');
            $http({
                method: 'post',
                url: '/api/panel/logout'
            })
                .success(function () {
                    $rootScope.isLogged = false;
                    if ($scope.isWidget) {
                        $window.location.reload();
                    } else {
                        $location.path(app.baseURL).replace();
                    }
                });
        };
        $scope.doLogin = function () {
            $http({
                method: 'post',
                url: '/api/login',
                data: $scope.user
            })
                .success(function (data) {
                    if (!data.success) {
                        $scope.message = data.info;
                    }
                    else {
                        $cookieStore.put('profile', data.data[0].id);
                        $cookieStore.put('viewAs', data.data[0].id);
                        $cookieStore.put('profiles', data.data);
                        $rootScope.isLogged = true;

                        if ($scope.isWidget) {
                            $window.location.reload();
                        }
                        else {
                            $location.path(app.baseURL).replace();
                        }
                        //$location.url('/panel/dashboard');
                        //$location.path(app.baseURL+'tablero').replace();
                        //window.location.href = '/panel/dashboard';
                    }
                });
        };
    }]);