app.controller('ControllerViewSwitcher', ['$http','$scope', '$cookieStore', '$cookies',
    function ($http, $scope, $cookieStore, $cookies) {
        $scope.profiles = $cookieStore.get('profiles');
        $http({
            method: 'get',
            url: '/api/administration/getRoles'
        })
            .success(function (data, status) {
                console.log(data);
            });
        $scope.viewSwitcher = $scope.profiles[0];

        $scope.updateView = function () {
            $cookies.viewAs = $scope.viewSwitcher._id;
        };
    }]);