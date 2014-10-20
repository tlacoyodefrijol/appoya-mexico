app.controller('ControllerDashboard', ['$scope', '$cookieStore', 'FactoryUsers', 'FactoryEvents',
    function ($scope, $cookieStore, FactoryUsers, FactoryEvents) {
        $scope.isAdmin = false;
        $scope.isUser = false;
        $scope.profile = $cookieStore.get('profile');

        switch ($scope.profile) {
            case 'master':
            case 'principal':
            case 'coordinator':
                $scope.isAdmin = true;
                FactoryUsers.count('voluntario')
                    .success(function (data) {
                        $scope.countVolunteers = data.data;
                    });
                FactoryUsers.count('aliado')
                    .success(function (data) {
                        $scope.countAllies = data.data;
                    });
                FactoryEvents.get({status:'available'})
                    .success(function (data) {
                        $scope.countEvents = data.data.length;
                    });
                break;
            case 'teacher':
                break;
            case 'parent':
                break;
            case 'student':
                $scope.isUser = true;
                break
        }
        /*
         //Para cuando hagamos mostrar como
         $rootScope.$watch(function () {
         return $cookies.viewAs
         }, function (val) {
         if ($cookies.profile == 5 || $cookies.viewAs == 5) {
         $scope.isUsr = true;
         }
         else {
         $scope.isUsr = false;
         }
         });*/
    }]);