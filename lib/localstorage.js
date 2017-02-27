"use strict";
// var config = require('./configuration');

var checksum = function(str) {
    if(!str) {
        return -1;
    }
    var hash = 0, i, chr, len;
    if (str.length == 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
        chr   = str.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

var save = function (key, value) {
    chrome.storage.local.set({key: value});
    chrome.storage.local.set({["h_" + key]: checksum(value)});
};

var load = function (key) {
    chrome.storage.local.get([key, "h_" + key], items => {
        if (parseInt(items["h_" + key]) === checksum(items[key])) {
            return items[key];
        } else return null;
    });
};

var remove = function (key) {
    chrome.storage.local.remove([key, "h_" + key]);
};

var localstorage = {
    save: save,
    load: load,
    remove: remove
};
