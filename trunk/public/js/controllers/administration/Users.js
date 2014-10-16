app.controller('ControllerUsers', ['$scope', '$routeParams', 'FactoryUsers',
    function ($scope, $routeParams, FactoryUsers) {

        $scope.role = $routeParams.id;
        $scope.selectStatus = [
            {id: 'all', name: 'Todos'},
            {id: 'active', name: 'Activos'},
            {id: 'inactive', name: 'Inactivos'}];
        $scope.listStatus = $scope.selectStatus[0];
        $scope.user = {};

        $scope.addUser = function () {
            $scope.user.profile = $scope.role;
            FactoryUsers.addOne($scope.user)
                .success(function (data) {
                    $scope.message = data.info;
                    $scope.updateList();
                });
        };
        $scope.updateList = function () {
            searchUser($scope.fieldStudent);
        };

        $scope.predictUser = debounce(function () {
            searchUser($scope.fieldStudent);
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
            }).error(function (data) {
                $scope.message = 'No se encontraron resultados';
            });
        }
    }]);