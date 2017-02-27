"use strict";


var main = function (firstLoad) {
    if (firstLoad) {
        enable(false);
    }
};

var enable = function (alert) {
    chrome.storage.local.set({ TrackProtection: true });

    if(alert === true) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            ensureSendMessage(tabs[0].id, {
                name   : "alert-display",
                type   : "question",
                message: _('alert_reloadOK'),
                yes: _('yes'),
                no: _('no'),
                hasLink: false,
                url    : ""
            });
        });
    }
};

var disable = function () {
    chrome.storage.local.set({ TrackProtection: false });
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        ensureSendMessage(tabs[0].id, {
            name   : "alert-display",
            type   : "question",
            message: _('alert_reloadKO'),
            yes: _('yes'),
            no: _('no'),
            hasLink: false,
            url    : ""
        });
    });
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
