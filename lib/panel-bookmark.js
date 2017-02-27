"use strict";

var _    = require("sdk/l10n").get;
var tabs = require("sdk/tabs");
var {attach, detach}  = require('sdk/content/mod');
var {Style}           = require('sdk/stylesheet/style');

var bookmarks = require("./bookmarks");
var alerts    = require("./alerts");
var qwant     = require("./qwant");

var visible = false;
var worker  = null;
var style = Style({
    uri: [
        "./css/reset.css",
        "./css/panel.css",
        "./css/panel-bookmark.css"
    ]
});

var hidePanel = function () {
    if (visible) {
        visible = false;
    }
};

/**
 *
 * @param data object
 */
var display = function () {
    var currentTab = tabs.activeTab;

    currentTab.on("close", function () {
        hidePanel();
    });
    currentTab.on("load", function () {
        hidePanel();
    });
    currentTab.on("ready", function () {
        hidePanel();
    });

    if (visible) {
        worker.port.emit("panel-destroy");
        visible = false;
    }
    worker = currentTab.attach({
        contentStyleFile    : [
            './css/panel.css',
            './css/panel-bookmark.css'
        ],
        contentScriptFile   : "./js/panel-bookmark.js",
        contentScriptOptions: {
            url      : currentTab.url,
            name     : currentTab.title,
            urlLabel : _("bookmark.url.label"),
            nameLabel: _("bookmark.name.label"),
            title    : _("bookmark.title"),
            cancel   : _("bookmark.cancel"),
            submit   : _("bookmark.submit")
        }
    });
    attach(style, currentTab);
    visible = true;
    handleEvents();
};

var handleEvents = function () {
    worker.port.on("panel-visible", function () {
        visible = true;
    });
    worker.port.on("panel-hidden", function () {
        visible = false;
    });
    worker.port.on("panel-submit", function (data) {
        bookmarks.save(data)
            .then(values => {
                if (values[0].status === "error") {
                    alerts.display({
                        type   : "error",
                        message: qwant.errorMessage(values[0].error),
                        hasLink: false,
                        url    : ""
                    });
                    worker.port.emit("panel-enable");
                } else {
                    alerts.display({
                        type   : "success",
                        message: _("bookmark.success"),
                        hasLink: true,
                        url    : "https://www.qwant.com/all?tab=bookmarks"
                    });
                    worker.port.emit("panel-destroy");
                }
            }, error => {
                alerts.display({
                    type   : "error",
                    message: qwant.errorMessage(0),
                    hasLink: false,
                    url    : ""
                });
                worker.port.emit("panel-enable");
            });
    });
};

module.exports = {
    display: display
};