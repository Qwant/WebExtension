"use strict";


var main = function (firstLoad) {
    if (firstLoad) {
        enable(false);
    }
};

var enable = function (alert) {
    chrome.storage.local.set({ TrackProtection: true });
};

var disable = function () {
    chrome.storage.local.set({ TrackProtection: false });
};

var reset = function () {
    chrome.storage.local.set({ TrackProtection: true });
};

var isEnabled = function (callback) {
    chrome.storage.local.get('TrackProtection', res => {
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
