app.controller('ControllerGroup', ['$scope', '$routeParams', 'FactoryCycles', 'FactoryGroups', 'FactoryUsers',
    function ($scope, $routeParams, FactoryCycles, FactoryGroups, FactoryUsers) {

        var groupId = $routeParams.id;

        $scope.profileTypeOptions = [{id: 'student', name: 'Alumno'}, {id: 'teacher', name: 'Maestro'}];


        $scope.updateLists = function () {
            FactoryGroups.getOne(groupId)
                .success(function (data) {
                    $scope.group = data.data;
                    $scope.groupName = $scope.group.name;
                    FactoryCycles.get({status: 'available'})
                        .success(function (data, status) {
                            $scope.cycleOptions = data.data;
                            for (var i = 0; i < $scope.cycleOptions.length; i++) {
                                if ($scope.cycleOptions[i].id === $scope.group.cycle.id) {
                                    $scope.listCycle = $scope.cycleOptions[i];
                                    return;
                                }
                            }
                        });
                });
            FactoryGroups.enrollments({group: groupId, role: 'student'})
                .success(function (data) {
                    $scope.studentList = data;
                });
            FactoryGroups.enrollments({group: groupId, role: 'teacher'})
                .success(function (data) {
                    $scope.teacherList = data;
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
                group: groupId,
                role: $scope.profileType.id
            };
            FactoryGroups.enrollOne(obj)
                .success(function (data) {
                    $scope.messageSearch = data.info;
                    $scope.updateLists();
                });
        };

        $scope.updateInfo = function () {
            if ($scope.groupName !== '') {

                var _grp = {
                    id: groupId,
                    name: $scope.groupName,
                    //level: $scope.group.level.id,
                    cycle: $scope.listCycle.id
                };
                FactoryGroups.updateOne(_grp)
                    .success(function (data) {
                        $scope.group.name = $scope.groupName;
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
            FactoryGroups.withdrawOne(data);
            $scope.updateLists();
        };
        $scope.clearFields = function () {
            $scope.availableUsers = [];
            $scope.messageSearch = '';
            $scope.fieldUser = '';
        }
    }]);