app.controller('ControllerUser', ['$scope', '$http', '$routeParams',
    function ($scope, $http, $routeParams) {
        $http({
            method: 'post',
            url: '/api/administration/user/',
            data: {id:$routeParams.id}
        })
            .success(function (data) {
                $scope.user = data.data;
            })
            .error(function (data) {
                $scope.message = 'No se encontraron resultados';
            });
    }]);