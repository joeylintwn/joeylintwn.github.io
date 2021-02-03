﻿jQuery.query = new function () {
    var queryObject = function (a, destructive) {
        var self = this;
        self.keys = {};
        self.destructive = destructive === true ? true : false;
        if (a.queryObject) {
            jQuery.each(a.keys, function (key, val) {
                self.destructiveSet(key, val);
            });
        } else {
            var q = "" + a;
            q = q.replace(/&amp;/, '&');
            q = q.replace(/^\?/, ''); // remove any leading ?
            q = q.replace(/\&$/, ''); // remove any trailing &
            jQuery.each(q.split('&'), function () {
                var key = this.split('=')[0];
                var val = this.split('=')[1];
                if (/^[0-9.]+$/.test(val))
                    val = parseFloat(val);
                else if (/^[0-9]+$/.test(val))
                    val = parseInt(val);
                //if (!isNaN(val))
                    self.destructiveSet(key, val || true);
            });
        }
        return this;
    };

    queryObject.prototype = {
        queryObject: true,
        get: function (key) {
            return this.keys[key];
        },
        destructiveSet: function (key, val) {
            if (val == undefined || val === null)
                this.destructiveRemove(key);
            else
                this[key] = this.keys[key] = val;
            return this;
        },
        set: function (key, val, destructive) {
            var self = ((destructive === true ? true : this.destructive) ===
true) ? this : new queryObject(this);
            return self.destructiveSet(key, val);
        },
        destructiveRemove: function (key) {
            if (typeof this.keys[key] != 'undefined') {
                delete this.keys[key];
                delete this[key];
            }
            return this;
        },
        remove: function (key, destructive) {
            var self = ((destructive === true ? true : this.destructive) ===
true) ? this : new queryObject(this);
            return self.destructiveRemove(key);
        },
        toString: function () {
            var i = 0, queryString = [];
            jQuery.each(this.keys, function (key, value) {
                var o = [];
                if (value !== false) {
                    if (i++ == 0)
                        o.push("?");
                    o.push(key);
                    if (value !== true) {
                        o.push("=");
                        o.push(encodeURIComponent(value));
                    }
                }
                queryString.push(o.join(""));
            });
            return queryString.join("&");
        }
    };

    return new queryObject(location.search);

};
