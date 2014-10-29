app.controller('ControllerAvatar', ['$scope', '$http', '$location', '$route', '$cookieStore',
    function ($scope, $http, $location, $route, $cookieStore) {
        $scope.avatar = {};
        $scope.avatar.body = 0;
        $scope.avatar.face = 0;
        $scope.avatar.hair = 0;

        bodies =

        console.log("ControllerAvatar");

        $scope.changePart = function (what, where)
        {
            console.log(what, where);
            $scope.avatar[what] += where;
            if ($scope.avatar[what] > 3) $scope.avatar[what] = 0;
            if ($scope.avatar[what] < 0) $scope.avatar[what] = 3;
            $scope.updateID();
        }

        $scope.updateID = function ()
        {
            $scope.avatar.id = "a"+$scope.avatar.body+$scope.avatar.face+$scope.avatar.hair;
        }

        $scope.updateID();
    }]);