app.controller('ControllerDashboard', ['$scope', '$cookieStore', 'FactoryUsers','FactoryGroups',
    function ($scope, $cookieStore, FactoryUsers, FactoryGroups) {
        $scope.isAdmin = false;
        $scope.isUser = false;
        $scope.profile = $cookieStore.get('profile');

        switch ($scope.profile) {
            case 'master':
            case 'principal':
            case 'coordinator':
                $scope.isAdmin = true;
                FactoryUsers.count('student')
                    .success(function (data) {
                        $scope.countUsers = data.data;
                    });
                FactoryUsers.count('teacher')
                    .success(function (data) {
                        $scope.countTeachers = data.data;
                    });
                FactoryGroups.count()
                    .success(function(data){
                        $scope.countGroups = data.data;
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