app.controller('ControllerEvents', ['$scope', '$cookieStore', 'FactoryEvents',
    function ($scope, $cookieStore, FactoryEvents) {
        var defaultVal = [{id: 'all', name: 'Todos'}, {id: 'active', name: 'Activos'}];

        $scope.enableEdit = false;

        if ($cookieStore.get('profile') === 'secretaria' || $cookieStore.get('profile') === 'aliado') {
            $scope.enableEdit = true;
        }

        $scope.init = function () {
            getEvents();
        };

        $scope.addEvent = function () {
            var _begin = new Date($scope.event.beginning);
            var _end = new Date($scope.event.end);
            if (_end >= _begin) {
                FactoryEvents.addOne($scope.event)
                    .success(function (data, status) {
                        $scope.messageEvent = data.info;
                        $scope.updateEvents();
                    });
            }
            else {
                $scope.messageEvent = 'La fecha de entrada debe de ser menor a la de salida';
            }
        };
        $scope.updateEvents = function (data) {
            getEvents();
        };

        $scope.deleteEvent = function (data) {
            FactoryEvents.deleteOne(data)
                .success(function (data) {
                    $scope.updateEvents();
                });
        };

        function getEvents() {
            FactoryEvents.get({status: 'available'})
                .success(function (data) {
                    $scope.events = data.data;
                });
        }
    }]);