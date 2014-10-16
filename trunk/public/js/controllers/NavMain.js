app.controller('NavMain', ['$scope', '$rootScope', '$http', '$cookieStore', '$location', '$route', function ($scope, $rootScope, $http, $cookieStore, $location, $route) {
    $scope.doLogout = function () {
        $cookieStore.remove('profile');
        $cookieStore.remove('viewAs');
        $cookieStore.remove('profiles');
        $rootScope.showNav = false;
        $http({
            method: 'post',
            url: '/api/panel/logout'
        })
            .success(function(){
                $location.path(app.baseURL).replace();
            });
    }
}]);