app.controller('ControllerLogin', ['$scope', '$http', '$location', '$route', '$cookieStore',
    function ($scope, $http, $location, $route, $cookieStore) {
        $scope.user = {};
        $scope.doLogin = function () {
            $http({
                method: 'post',
                url: '/api/login',
                data: $scope.user
            })
                .success(function (data, status) {
                    if (!data.success) {
                        $scope.message = data.info;
                    }
                    else {
                        $cookieStore.put('profile',data.data[0].id);
                        $cookieStore.put('viewAs',data.data[0].id);
                        $cookieStore.put('profiles',data.data);
                        //$location.url('/panel/dashboard');
                        $location.path(app.baseURL+'tablero').replace();
                        //window.location.href = '/panel/dashboard';
                    }
                });
        }
    }]);