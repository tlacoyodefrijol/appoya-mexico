app.controller('ControllerCycle', ['$scope', '$http', '$routeParams', 'FactoryCycles',
    function ($scope, $http, $routeParams, FactoryCycles) {

        $scope.cycleId = $routeParams.id;

        FactoryCycles.getOne($scope.cycleId)
            .success(function (data) {
                $scope.cycle = data.data;
            });
    }]);