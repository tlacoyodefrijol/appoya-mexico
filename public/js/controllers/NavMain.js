app.controller('NavMain', ['$rootScope', '$scope', '$http', '$cookieStore', '$location', function ($rootScope, $scope, $http, $cookieStore, $location) {

    if($cookieStore.get('profile') === 'visitante')
    {
        $rootScope.showLogin = true;
    }
    $scope.doLogout = function () {
        $cookieStore.remove('profile');
        $cookieStore.remove('viewAs');
        $cookieStore.remove('profiles');
        $http({
            method: 'post',
            url: '/api/panel/logout'
        })
            .success(function(){
                $rootScope.showLogin = true;
                //$location.path(app.baseURL).replace();
            });
    }
}]);