app.controller('ControllerEvents', ['$scope', 'FactoryGroups',
    function ($scope, FactoryEvents) {
        var defaultVal = [{id: 'all', name: 'Todos'}, {id: 'active', name: 'Activos'}];

        $scope.init = function () {
            FactoryEvents.get({status: 'active'})
                .success(function (data) {
                    $scope.events = data.data;
                });
        };

        $scope.addGroup = function () {
            var _begin = new Date($scope.event.beginning);
            var _end = new Date($scope.event.end);
            if (_end >= _begin) {
                FactoryEvents.addOne($scope.event)
                    .success(function (data, status) {
                        $scope.messageEvent = data.info;
                        $scope.updateGroups();
                    });
            }
            else {
                $scope.messageEvent = 'La fecha de entrada debe de ser menor a la de salida';
            }
        };
        $scope.updateGroups = function (data) {
            FactoryEvents.get()
                .success(function (data) {
                    $scope.events = data.data;
                });
        };

        $scope.deleteGroup = function (data) {
            FactoryEvents.deleteOne(data)
                .success(function (data) {
                    $scope.updateGroups();
                });
        }
    }]);