app.controller('ControllerEvent', ['$scope', '$routeParams', 'FactoryEvents', 'FactoryUsers','$cookieStore',
    function ($scope, $routeParams, FactoryEvents, FactoryUsers, $cookieStore) {

        var eventId = $routeParams.id;
        $scope.isOwner = false;
        $scope.event = {};

        $scope.profileTypeOptions = [{id: 'voluntario', name: 'Voluntario'}, {id: 'aliado', name: 'Aliado'}];

        $scope.init = function () {
            FactoryEvents.getOne(eventId)
                .success(function (data) {
                    $scope.event = data.data;
                    $scope.eventTitle = $scope.event.name;
                    if ($cookieStore.get('profile') === 'master' || $scope.event.creator === $cookieStore.get('userId')) {
                        $scope.isOwner = true;
                    } else {
                        $scope.isOwner = false;
                    }
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
                    name: $scope.event.name,
                    beginning: new Date($scope.event.beginning),
                    end: new Date($scope.event.end),
                    creator: $scope.event.creator,
                    description: $scope.event.description
                };
                FactoryEvents.updateOne(_grp)
                    .success(function (data) {
                        $scope.eventTitle = $scope.event.name;
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