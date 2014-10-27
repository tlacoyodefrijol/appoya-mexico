app.controller('ControllerAvatar', ['$scope', '$http', '$location', '$route', '$cookieStore',
    function ($scope, $http, $location, $route, $cookieStore) {
        $scope.avatar = {};
        $scope.avatar.gender = 0;
        $scope.avatar.face = 0;
        $scope.avatar.hair = 0;
    }]);