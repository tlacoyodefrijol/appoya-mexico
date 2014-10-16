app.controller('ControllerGroups', ['$scope', 'FactoryGroups', 'FactoryCycles',
    function ($scope, FactoryGroups, FactoryCycles) {
        var defaultVal = [{id: 'all', name: 'Todos'}, {id: 'active', name: 'Activos'}];

        $scope.init = function () {

            FactoryCycles.get({status:'available'})
                .success(function (data) {
                    $scope.cycles = data.data;
                    $scope.selectCycles = defaultVal.concat(data.data);
                    $scope.groupCycle = $scope.cycles[0].id;
                    $scope.listCycle = $scope.selectCycles[1];
                });
            FactoryGroups.get({status:'active'})
                .success(function (data) {
                    $scope.groups = data.data;
                });
        };

        $scope.addGroup = function () {
            $scope.group.cycle = $scope.groupCycle;
            $scope.group.level = '000000000000000000000000';
            FactoryGroups.addOne($scope.group).success(function (data, status) {
                $scope.messageGroup = data.info;
                $scope.updateGroups();
            });
        };
        $scope.updateGroups = function (data) {
            var _grp;
            if (typeof(data) !== 'undefined') {
                _grp = {cycle: data};
            } else {
                if ($scope.listCycle.id === 'all') {
                    _grp = {status: 'all'}
                } else if ($scope.listCycle.id === 'active') {
                    _grp = {status: 'active'}
                } else {
                    _grp = {cycle: $scope.listCycle.id};
                }
            }
            FactoryGroups.get(_grp)
                .success(function (data) {
                    $scope.groups = data.data;
                });
        };

        $scope.deleteGroup = function (data) {
            FactoryGroups.deleteOne(data)
                .success(function (data) {
                    $scope.updateGroups();
                });
        }
    }]);