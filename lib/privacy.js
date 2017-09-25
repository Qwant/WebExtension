"use strict";


var main = function (firstLoad) {
    if (firstLoad) {
        enable(false);
    }
};

var enable = function (alert) {
    browser.storage.local.set({ TrackProtection: true });

    if(alert === true) {
        browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
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
    browser.storage.local.set({ TrackProtection: false });
    browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
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
