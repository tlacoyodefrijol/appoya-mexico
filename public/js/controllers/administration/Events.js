app.controller('ControllerEvents', ['$scope', '$cookieStore', 'FactoryEvents',
    function ($scope, $cookieStore, FactoryEvents) {
        var defaultVal = [{id: 'all', name: 'Todos'}, {id: 'active', name: 'Activos'}];

        $scope.event = {};

        if ($cookieStore.get('profile') === 'master' || $cookieStore.get('profile') === 'secretaria' || $cookieStore.get('profile') === 'aliado') {
            $scope.enableAddEvent = true;
        } else {
            $scope.enableAddEvent = false;
        }

        $scope.init = function () {
            getEvents();
        };

        $scope.addEvent = function () {
            var _grp = {
                name: $scope.event.name,
                beginning: new Date($scope.event.beginning),
                end: new Date($scope.event.end),
                usermin: $scope.event.usermin,
                creator: $cookieStore.get('userId')
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

        $scope.enrollInEvent = function(_event)
        {
            var obj = {
                user: $cookieStore.get('userId'),
                event: _event,
                role: 'voluntario'
            };
            FactoryEvents.enrollOne(obj).success(function(data){
                getEvents();
            })
        };
        $scope.isCreator = function (id) {
            if (id === $cookieStore.get('userId') || $cookieStore.get('profile') === 'master' || $cookieStore.get('profile') === 'secretaria') {
                return true;
            }
        };

        function getEvents() {
            FactoryEvents.get({status: 'available'})
                .success(function (data) {
                    $scope.events = data.data;
                    for (var i = 0; i < $scope.events.length; i++) {
                        if(typeof $scope.events[i].usermin === 'undefined')
                        {
                            $scope.events[i].usermin = 0;
                        }
                        checkEnroll(i)
                    }
                });
        }

        function checkEnroll(index) {
            var obj = {};
            var _ev = $scope.events[index]
            obj = {
                event: _ev.id,
                user: $cookieStore.get('userId')
            };
            FactoryEvents.enrollment(obj)
                .success(function (data) {
                    _ev.isEnrolled = data.success;
                });

        }
    }]);