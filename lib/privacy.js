"use strict";


var main = function (firstLoad) {
    if (firstLoad) {
        enable(false);
    }
};

var enable = function (alert) {
    browser.storage.local.set({ TrackProtection: true });
};

var disable = function () {
    browser.storage.local.set({ TrackProtection: false });
};

var reset = function () {
    browser.storage.local.set({ TrackProtection: true });
};

var isEnabled = function (callback) {
    browser.storage.local.get('TrackProtection', res => {
        if(res.TrackProtection === undefined) {
            enable(false);
            callback(true);
        } else callback(res.TrackProtection);
    });
};

var privacy = {
    main: main,
    enable: enable,
    disable: disable,
    reset: reset,
    isEnabled: isEnabled
};
