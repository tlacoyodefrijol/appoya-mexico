app.factory('FactoryCycles', ['$http',
    function ($http) {

        var _cycles = {};
        var _urlBase = '/api/cycles/';
        var _urlBaseOne = '/api/cycle/';


        _cycles.getOne = function(_id)
        {
            return $http({
                method: 'post',
                url: _urlBaseOne,
                data: {id: _id}
            });
        };

        _cycles.addOne = function (obj) {
            return $http({
                method: 'post',
                url: _urlBaseOne + 'add',
                data: obj
            });
        };

        _cycles.updateOne = function(obj)
        {
            return $http({
                method: 'post',
                url: _urlBaseOne + 'update',
                data: obj
            });
        };

        _cycles.deleteOne = function(_id)
        {
            return $http({
                method: 'post',
                url: _urlBaseOne + 'delete',
                data: {id: _id}
            });
        };
        _cycles.get = function (_obj) {
            return $http({
                method: 'post',
                url: _urlBase,
                data: _obj
            });
        };
        return _cycles;
    }]);