app.service('ServiceAvatar', function () {
    var originalAvatar = {};

    var avatar = {};
    avatar.body = 0;
    avatar.face = 0;
    avatar.hair = 0;


    this.changePart = function (what, where) {
        avatar[what] += where;
        if (avatar[what] > 3) avatar[what] = 0;
        if (avatar[what] < 0) avatar[what] = 3;
        this.updateID();
    };

    this.getAvatar = function () {
        return avatar;
    };

    this.setAvatar = function (obj) {
        avatar = obj;
        originalAvatar.body = obj.body;
        originalAvatar.face = obj.face;
        originalAvatar.hair = obj.hair;
        originalAvatar.id = obj.id;
        this.updateID();
    };

    this.cancelChanges = function () {
        avatar.body = originalAvatar.body;
        avatar.face = originalAvatar.face;
        avatar.hair = originalAvatar.hair;
        avatar.id = originalAvatar.id;
    };

    this.updateID = function () {
        avatar.id = "a" + avatar.body + avatar.face + avatar.hair;
    };
});