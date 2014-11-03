app.controller('ControllerUsers', ['$window', '$rootScope', '$scope', '$routeParams', '$cookieStore', 'FactoryUsers',
    function ($window, $rootScope, $scope, $routeParams, $cookieStore, FactoryUsers) {

        $scope.role = $routeParams.id;
        $scope.selectStatus = [
            {id: 'all', name: 'Todos'},
            {id: 'active', name: 'Activos'},
            {id: 'inactive', name: 'Inactivos'}];
        $scope.listStatus = $scope.selectStatus[0];
        $scope.user = {};
        $scope.isWidget = false;
        if ($cookieStore.get('profile') === 'master') {
            $scope.enableAddUser = true;
        } else {
            $scope.enableAddUser = false;
        }


        $scope.addUser = function () {
            $scope.user.profile = $scope.role;
            FactoryUsers.addOne($scope.user)
                .success(function (data) {
                    if (!data.success) {
                        $scope.message = data.info;
                        $scope.showMessage = true;
                    } else {
                        if ($scope.isWidget) {
                            $cookieStore.put('userId', data.data.id);
                            $cookieStore.put('userUserName', data.data.username);
                            $cookieStore.put('profile', data.data.profile[0]);
                            $cookieStore.put('viewAs', data.data.profile[0]);
                            $cookieStore.put('profiles', data.data.profile);
                            $rootScope.isLogged = true;
                            $window.location.reload();
                        } else {
                            $scope.updateList();
                        }
                    }

                });
        };
        $scope.updateList = function () {
            searchUser($scope.fieldUser);
        };

        $scope.predictUser = debounce(function () {
            searchUser($scope.fieldUser);
        }, 250);

        function searchUser(name) {
            var _name = '';
            if (typeof name !== 'undefined') {
                _name = name;
            }
            FactoryUsers.get({
                profile: $scope.role,
                status: $scope.listStatus.id,
                search: _name
            }).success(function (data) {
                $scope.users = data.data;
                for(var i=0; i<$scope.users.length; i++){
                    if(typeof $scope.users[i].avatar[0] === 'undefined' || $scope.users[i].avatar[0] === undefined || $scope.users[i].avatar[0] === ''){
                        $scope.users[i].avatar[0] = {id: 'a000'};
                    }
                }
            }).error(function (data) {
                $scope.message = 'No se encontraron resultados';
            });
        }
    }]);