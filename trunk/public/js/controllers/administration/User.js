app.controller('ControllerUser', ['$scope', '$http', '$routeParams', '$cookieStore', 'FactoryUsers', 'FactoryEvents',
    function ($scope, $http, $routeParams, $cookieStore, FactoryUsers, FactoryEvents) {

        $scope.editMode = false;

        if ($routeParams.id === $cookieStore.get('userId')) {
            $scope.welcomeText = 'Bienvenido';
            $scope.isOwner = true;
        }

        FactoryUsers.getOne($routeParams.id)
            .success(function (data) {
                $scope.user = data.data;
                $scope.userName = data.data.name;
            });
        FactoryUsers.enrollmentOne($routeParams.id)
            .success(function(data){
                $scope.events = data.data;
                console.log($scope.events)
            });

        $scope.toggleEdit = function () {
            if ($scope.editMode) {
                $scope.editMode = false;
            } else {
                $scope.editMode = true;
            }
        };
        $scope.updateUser = function () {
            console.log('aqui ', $scope.user)
            var obj = {
                id: $scope.user.id,
                name: $scope.user.name,
                lastname: $scope.user.lastname,
            };
            if (typeof $scope.user.password !== 'undefined' && $scope.user.password !== '') {
                obj.secretword = $scope.user.password
            }
            FactoryUsers.updateOne(obj)
                .success(function (data) {
                    $scope.userName =  $scope.user.name;
                    $scope.toggleEdit();
                });
        };
    }]);