app.controller('ControllerEvent', ['$scope', '$routeParams', 'FactoryEvents', 'FactoryUsers','$filter',
    function ($scope, $routeParams, FactoryEvents, FactoryUsers, $filter) {

        var eventId = $routeParams.id;

        $scope.profileTypeOptions = [{id: 'voluntario', name: 'Voluntario'}, {id: 'aliado', name: 'Aliado'}];

        $scope.updateLists = function () {
            FactoryEvents.getOne(eventId)
                .success(function (data) {
                    $scope.event = data.data;
                    $scope.eventName = $scope.event.name;
                    $scope.eventDateBegin = $scope.event.beginning
                    $scope.eventDateEnd = $scope.event.end;
                });
            FactoryEvents.enrollments({event: eventId, role: 'voluntario'})
                .success(function (data) {
                    $scope.volunteerList = data;
                });
            FactoryEvents.enrollments({event: eventId, role: 'aliado'})
                .success(function (data) {
                    $scope.allyList = data;
                });
        };

        $scope.searchUser = debounce(function () {
            if ($scope.fieldUser != '') {
                var _user = {
                    profile: $scope.profileType.id,
                    status: 'all',
                    search: $scope.fieldUser,
                    fields: {name: 1, lastname: 1}
                };
                FactoryUsers.get(_user)
                    .success(function (data) {
                        if (data.data.length === 0) {
                            $scope.availableUsers = [];
                            $scope.messageSearch = 'No se encontraron resultados';
                        }
                        else {
                            $scope.availableUsers = data.data;
                            $scope.messageSearch = '';
                        }
                    })
            }
            else {
                $scope.availableUsers = [];
                $scope.messageSearch = '';
            }
        }, 250);

        $scope.enrollUser = function (data) {
            var obj = {
                user: data.id,
                event: eventId,
                role: $scope.profileType.id
            };
            FactoryEvents.enrollOne(obj)
                .success(function (data) {
                    $scope.messageSearch = data.info;
                    $scope.updateLists();
                })
                .error(function(data){
                    console.log(data)
                });
        };

        $scope.updateInfo = function () {
            if ($scope.eventName !== '') {
                var _grp = {
                    id: eventId,
                    name: $scope.eventName,
                    beginning: $scope.eventDateBegin,
                    end: $scope.eventDateEnd
                };
                FactoryEvents.updateOne(_grp)
                    .success(function (data) {
                        $scope.event.name = $scope.eventName;
                        $scope.messageUpdate = 'Cambios guardados';
                    })
                    .error(function (data) {
                        console.log('error: ', data, data.info)
                    });
            } else {
                $scope.messageUpdate = 'El campo nombre no puede estár vacío';
            }
        };

        $scope.withdrawUser = function (data) {
            FactoryEvents.withdrawOne(data);
            $scope.updateLists();
        };
        $scope.clearFields = function () {
            $scope.availableUsers = [];
            $scope.messageSearch = '';
            $scope.fieldUser = '';
        }
    }]);