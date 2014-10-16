app.factory('FactoryUsers', ['$http',
    function ($http) {

        var _users = {};
        var _urlBase = '/api/administration/users/';
        var _urlBaseOne = '/api/administration/user/';


        _users.getOne = function(_id)
        {
            return $http({
                method: 'post',
                url: _urlBaseOne,
                data: {id: _id}
            });
        };

        _users.addOne = function (obj) {
            return $http({
                method: 'post',
                url: _urlBaseOne + 'add',
                data: obj
            });
        };

        _users.updateOne = function(obj)
        {
            return $http({
                method: 'post',
                url: _urlBaseOne + 'update',
                data: obj
            });
        };

        _users.deleteOne = function(_id)
        {
            return $http({
                method: 'post',
                url: _urlBaseOne + 'delete',
                data: {id: _id}
            });
        };

        _users.get = function (obj) {
            return $http({
                method: 'post',
                url: _urlBase,
                data: obj
            });
        };
        _users.count = function (_profile) {
            return $http({
                method: 'post',
                url: _urlBase+'count/active',
                data: {profile: _profile}
            });
        };

        return _users;
    }]);