app.controller('ControllerCycles', ['$scope', '$routeParams', 'FactoryCycles',
    function ($scope, $routeParams, FactoryCycles) {

        $scope.listCycle = {};
        $scope.cycleOptions = [
            {id: 'all', name: 'Todos'},
            {id: 'active', name: 'Activos'},
            {id: 'available', name: 'Disponibles'},
            {id: 'inactive', name: 'Inactivos'}
        ];

        $scope.addCycle = function () {
            var _begin = new Date($scope.cycle.beginning);
            var _end = new Date($scope.cycle.end);
            if (_end > _begin) {
                FactoryCycles.addOne($scope.cycle)
                    .success(function (data, status) {
                        $scope.messageCycle = data.info;
                        $scope.updateCycles();
                    });
            }
            else {
                $scope.messageCycle = 'La fecha de entrada debe de ser menor a la de salida';
            }
        };
        $scope.updateCycles = function () {
            var _status = typeof($scope.listCycle) !== undefined ? $scope.listCycle.id : 'active';
            FactoryCycles.get({status: _status})
                .success(function (data, status) {
                    $scope.cycles = data.data;
                });
        };
        $scope.updateCycles();
    }]);