app.factory('FactoryEvents', ['$http',
    function ($http) {

        var _events = {};
        var _urlBase = '/api/events/';
        var _urlBaseOne = '/api/event/';


        _events.getOne = function(_id)
        {
            return $http({
                method: 'post',
                url: _urlBaseOne,
                data: {id: _id}
            });
        };

        _events.addOne = function (obj) {
            return $http({
                method: 'post',
                url: _urlBaseOne + 'add',
                data: obj
            });
        };

        _events.updateOne = function(obj)
        {
            return $http({
                method: 'post',
                url: _urlBaseOne + 'update',
                data: obj
            });
        };

        _events.deleteOne = function(_id)
        {
            return $http({
                method: 'post',
                url: _urlBaseOne + 'delete',
                data: {id: _id}
            });
        };

        _events.enrollOne = function(obj)
        {
            return $http({
                method: 'post',
                url: _urlBaseOne + 'enroll',
                data: obj
            });
        };
        _events.withdrawOne = function(_id)
        {
            return $http({
                method: 'post',
                url: _urlBaseOne + 'withdraw',
                data: {id: _id}
            });
        };
        _events.enrollments = function(obj)
        {
            return $http({
                method: 'post',
                url: _urlBaseOne + 'enrollments',
                data: obj
            });
        };
        _events.get = function (_obj) {
            return $http({
                method: 'post',
                url: _urlBase,
                data: _obj
            });
        };
        _events.count = function () {
            return $http({
                method: 'post',
                url: _urlBase+'count/active'
            });
        };

        return _events;
    }]);