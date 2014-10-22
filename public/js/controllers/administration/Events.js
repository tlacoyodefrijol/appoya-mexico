app.controller('ControllerEvents', ['$scope', '$cookieStore', 'FactoryEvents',
    function ($scope, $cookieStore, FactoryEvents) {
        var defaultVal = [{id: 'all', name: 'Todos'}, {id: 'active', name: 'Activos'}];

        $scope.event = {};

        if ($cookieStore.get('profile') === 'master' || $cookieStore.get('profile') === 'secretaria' || $cookieStore.get('profile') === 'aliado') {
            $scope.enableAddEvent = true;
            $scope.isOwner = true;
        } else {
            $scope.enableAddEvent = false;
            $scope.isOwner = false;
        }

        $scope.init = function () {
            getEvents();
        };

        $scope.addEvent = function () {
            var _grp = {
                name: $scope.event.name,
                beginning: new Date($scope.event.beginning),
                end: new Date($scope.event.end),
                creator: $cookieStore.get('usrId')
            };
            if (_grp.end >= _grp.beginning) {
                FactoryEvents.addOne(_grp)
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
    }])
;