app.controller('ControllerNotificationCompose', ['$scope', '$http', '$location', '$route',
    function ($scope, $http, $location, $route) {
        $scope.sendMessage = function() {
            $scope.notification.to = {id: null, kind: 'all'};
            $http({
                method: 'post',
                url: '/api/administration/messages',
                data: $scope.notification
            })
                .success(function (data, status) {
                    $scope.message = data;
                });
        }
    }]);