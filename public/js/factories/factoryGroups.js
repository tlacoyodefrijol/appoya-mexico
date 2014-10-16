app.factory('FactoryGroups', ['$http',
    function ($http) {

        var _groups = {};
        var _urlBase = '/api/administration/groups/';
        var _urlBaseOne = '/api/administration/group/';


        _groups.getOne = function(_id)
        {
            return $http({
                method: 'post',
                url: _urlBaseOne,
                data: {id: _id}
            });
        };

        _groups.addOne = function (obj) {
            return $http({
                method: 'post',
                url: _urlBaseOne + 'add',
                data: obj
            });
        };

        _groups.updateOne = function(obj)
        {
            return $http({
                method: 'post',
                url: _urlBaseOne + 'update',
                data: obj
            });
        };

        _groups.deleteOne = function(_id)
        {
            return $http({
                method: 'post',
                url: _urlBaseOne + 'delete',
                data: {id: _id}
            });
        };

        _groups.enrollOne = function(obj)
        {
            return $http({
                method: 'post',
                url: _urlBaseOne + 'enroll',
                data: obj
            });
        };
        _groups.withdrawOne = function(_id)
        {
            return $http({
                method: 'post',
                url: _urlBaseOne + 'withdraw',
                data: {id: _id}
            });
        };
        _groups.enrollments = function(obj)
        {
            return $http({
                method: 'post',
                url: _urlBaseOne + 'enrollments',
                data: obj
            });
        };
        _groups.get = function (_obj) {
            return $http({
                method: 'post',
                url: _urlBase,
                data: _obj
            });
        };
        _groups.count = function () {
            return $http({
                method: 'post',
                url: _urlBase+'count/active'
            });
        };

        return _groups;
    }]);