"use strict";

var _                 = require("sdk/l10n").get;
var tabs              = require("sdk/tabs");
var {attach, detach}  = require('sdk/content/mod');
var {Style}           = require('sdk/stylesheet/style');

var visible = false;
var worker  = null;
var style   = Style({
    uri: [
        "./css/reset.css",
        "./css/alert.css"
    ]
});

/**
 *
 * @param data object with the following properties : {type, message, hasLink, url }
 */

var display = function (data) {
    data.linkText  = _("alert.linkText");
    var currentTab = tabs.activeTab;
    if (visible) {
        worker.port.emit("alert-destroy");
        visible = false;
    }
    worker = currentTab.attach({
        // contentStyleFile    : './css/alert.css',
        contentScriptFile   : "./js/alert.js",
        contentScriptOptions: data
    });
    attach(style, currentTab);
    visible = true;
    handleEvents();
};

var handleEvents = function () {
    worker.port.on("alert-visible", function () {
        visible = true;
    });
    worker.port.on("alert-hidden", function () {
        visible = false;
    });
    worker.port.on("reload-tabs", function () {
        for (let tab of tabs) {
            tab.reload();
        }
        visible = false;
    });
    worker.port.on("reload-tabs-no", function () {
        visible = false;
    });

};

module.exports = {
    display: display
};
