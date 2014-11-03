app.controller('ControllerEvent', ['$scope', '$routeParams', 'FactoryEvents', 'FactoryUsers', '$cookieStore',
    function ($scope, $routeParams, FactoryEvents, FactoryUsers, $cookieStore) {

        var eventId = $routeParams.id;
        $scope.event = {};
        $scope.enrollment = {};
        $scope.fieldUser = {};
        $scope.profileType = {};
        $scope.prizeAvailable = [];
        $scope.prizeSelected = {};
        $scope.role = {};
        $scope.animId;

        $scope.roleListType = [
            {label: 'Voluntarios', id: 'voluntario'},
            {label: 'Maestros', id: 'maestro'},
            {label: 'Pintores', id: 'pintor'},
            {label: 'Cocineros', id: 'cocinero'}
        ];

        $scope.eventListType = [
            {label: 'Reforestación', id: 0},
            {label: 'Apoyo a colonia', id: 1}
        ];

        $scope.prizeAvailable = [
            {id: 'prize0', name: 'Camisa gris'},
            {id: 'prize1', name: 'Camisa azul'},
            {id: 'prize2', name: 'Los 80\'s'},
            {id: 'prize3', name: 'Playera verde'},
            {id: 'prize4', name: 'Playera roja'},
            {id: 'prize5', name: 'Playera gris'},
            {id: 'prize6', name: 'Sombrero de chef'},
            {id: 'prize7', name: 'Gorra'},
            {id: 'prize8', name: 'Casco de bombero'}
        ];

        $scope.setPrizes = function (obj, selected) {
            obj.isChecked = selected;
        };

        $scope.profileTypeOptions = [{id: 'voluntario', name: 'Voluntario'}, {id: 'aliado', name: 'Aliado'}];
        $scope.profileType.option = $scope.profileTypeOptions[0];

        FactoryEvents.getOne(eventId)
            .success(function (data) {
                $scope.event = data.data;
                $scope.roleList = $scope.event.roles;
                $scope.prizeSelected = $scope.event.prizes;
                if(typeof $scope.event.kind === 'undefined'){
                    $scope.event.kind = $scope.eventListType[0];
                    $scope.animId = 0;
                }else{
                    $scope.animId = $scope.event.kind[0].id;
                    $scope.event.kind = $scope.eventListType[$scope.event.kind[0].id];
                }
                console.log($scope.animId)
                for (var i = 0; i < $scope.prizeSelected.length; i++) {
                    setInitialSelection($scope.prizeSelected[i]);
                }
                $scope.eventTitle = $scope.event.name;
                if ($cookieStore.get('profile') === 'master' || $scope.event.creator === $cookieStore.get('userId')) {
                    $scope.isOwner = true;
                    var _user = {
                        profile: $scope.profileType.option.id,
                        status: 'all',
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
                        });
                } else {
                    $scope.isOwner = false;
                }
            });

        function setInitialSelection(obj) {
            for (var i = 0; i < $scope.prizeAvailable.length; i++) {
                if (obj.id === $scope.prizeAvailable[i].id) {
                    $scope.prizeAvailable[i].isChecked = true;
                    return;
                }
            }
        }

        if ($cookieStore.get('profile') !== 'visitante') {
            var obj = {
                event: eventId,
                user: $cookieStore.get('userId')
            };
            FactoryEvents.enrollment(obj)
                .success(function (data) {
                    if (data.success) {
                        $scope.enrollment.id = data.data.id;
                        $scope.enrollment.success = data.success;
                    }
                });
        }

        $scope.predictUser = debounce(function () {
            searchUser($scope.fieldUser.text);
        }, 250);

        $scope.enrollUser = function (data) {
            var obj = {
                user: data.id,
                event: eventId,
                role: $scope.profileType.option.id
            };
            FactoryEvents.enrollOne(obj)
                .success(function (data) {
                    $scope.messageSearch = data.info;
                    $scope.updateLists();
                })
                .error(function (data) {
                    console.log(data)
                });
        };
        $scope.enrollInEvent = function (_event) {
            var obj = {
                user: $cookieStore.get('userId'),
                event: eventId,
                role: 'voluntario'
            };
            FactoryEvents.enrollOne(obj)
                .success(function (data) {
                    $scope.enrollment.id = data.data;
                    $scope.enrollment.success = data.success;
                    $scope.updateLists();
                })
        };
        $scope.updateInfo = function () {
            if ($scope.eventName !== '') {
                var _prizes = [];
                for (var i = 0; i < $scope.prizeAvailable.length; i++) {
                    if ($scope.prizeAvailable[i].isChecked) {
                        _prizes.push($scope.prizeAvailable[i])
                    }
                }
                var _grp = {
                    id: eventId,
                    name: $scope.event.name,
                    beginning: new Date($scope.event.beginning),
                    end: new Date($scope.event.end),
                    usermin: $scope.event.usermin,
                    prizes: _prizes,
                    creator: $scope.event.creator,
                    description: $scope.event.description,
                    kind: [$scope.event.kind],
                    roles: $scope.roleList
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
            if (data === 'currentUser') {
                data = $scope.enrollment.id;
            }
            FactoryEvents.withdrawOne(data)
                .success(function (data) {
                    $scope.enrollment = {};
                    $scope.updateLists();
                })
        };
        $scope.clearFields = function () {
            $scope.availableUsers = [];
            $scope.messageSearch = '';
            $scope.fieldUser.text = '';
            searchUser();
        };
        $scope.updateLists = function () {
            FactoryEvents.enrollments({event: eventId, role: 'voluntario'})
                .success(function (data) {
                    $scope.volunteerList = data;
                });
            FactoryEvents.enrollments({event: eventId, role: 'aliado'})
                .success(function (data) {
                    $scope.allyList = data;
                });
        };

        $scope.addRole = function () {
            $scope.event.usermin += $scope.role.quantity;
            $scope.roleList.push({
                quantity: $scope.role.quantity,
                type: $scope.role.type
            });
        };
        $scope.removeRole = function(_index){
            $scope.event.usermin -= $scope.roleList[_index].quantity;
            $scope.roleList.splice(_index, 1);
        };

        function searchUser(name) {
            var _user = {};
            if (typeof name !== 'undefined') {
                _user.search = name;
            }
            _user.profile = $scope.profileType.option.id;
            _user.status = 'all';
            _user.fields = {name: 1, lastname: 1};

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
                });
            if (typeof name !== 'undefined') {
                _name = name;

            }
            else {
                $scope.availableUsers = [];
                $scope.messageSearch = '';
            }
        }
    }]);