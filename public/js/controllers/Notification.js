app.controller('ControllerNotification', ['$scope', '$http', '$location', '$route','$routeParams',
    function ($scope, $http, $location, $route, $routeParams) {
        $http({
            method: 'get',
            url: '/api/administration/messages/'+$routeParams.id
        })
            .success(function (data, status) {
                $scope.message = data.data;
            });
    }]);