app.controller('ControllerUser', ['$scope', '$http', '$routeParams', '$cookieStore', 'FactoryUsers', 'FactoryEvents', 'ServiceAvatar',
    function ($scope, $http, $routeParams, $cookieStore, FactoryUsers, FactoryEvents, ServiceAvatar) {

        $scope.editMode = false;
        $scope.avatarService = ServiceAvatar;


        if ($routeParams.id === $cookieStore.get('userId')) {
            $scope.welcomeText = 'Bienvenido';
            $scope.isOwner = true;
        }

        FactoryUsers.getOne($routeParams.id)
            .success(function (data) {
                $scope.user = data.data;
                $scope.userName = data.data.name;
                console.log(data)
                var _avatar = {}
                if ($scope.user.avatar[0] === undefined) {
                    _avatar = {
                        body: 0,
                        face: 0,
                        hair: 0,
                        _id: 'a000'
                    }
                } else {
                    _avatar = $scope.user.avatar[0];
                }
                $scope.avatarService.setAvatar(_avatar);
                $scope.avatar = ServiceAvatar.getAvatar();
            });
        FactoryUsers.enrollmentOne($routeParams.id)
            .success(function (data) {
                $scope.events = data.data;
            });

        $scope.toggleEdit = function () {
            if ($scope.editMode) {
                $scope.editMode = false;
            } else {
                $scope.editMode = true;
            }
        };
        $scope.cancelChanges = function () {
            $scope.avatarService.cancelChanges();
            $scope.toggleEdit();
        };
        $scope.updateUser = function () {
            var obj = {
                id: $scope.user.id,
                name: $scope.user.name,
                lastname: $scope.user.lastname,
                avatar: [$scope.avatarService.getAvatar()]
            };
            if($scope.user.profile[0] !== 'voluntario'){
                obj.avatar = {
                    body: 0,
                    face: 0,
                    hair: 0,
                    _id: 'default_icon'
                }
            }
            if (typeof $scope.user.password !== 'undefined' && $scope.user.password !== '') {
                obj.secretword = $scope.user.password
            }
            FactoryUsers.updateOne(obj)
                .success(function (data) {
                    $scope.avatarService.setAvatar($scope.avatarService.getAvatar());
                    $scope.userName = $scope.user.name;
                    $scope.toggleEdit();
                });
        };
    }]);