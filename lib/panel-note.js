"use strict";

var _                 = require("sdk/l10n").get;
var tabs              = require("sdk/tabs");
var {attach, detach}  = require('sdk/content/mod');
var {Style}           = require('sdk/stylesheet/style');

var boards = require("./boards");
var alerts = require("./alerts");
var qwant  = require("./qwant");
var user   = require("./user");

var visible = false;
var worker  = null;
var style   = Style({
    uri: [
        "./css/reset.css",
        "./css/panel.css",
        "./css/panel-note.css"
    ]
});

var hidePanel = function () {
    if (visible) {
        visible = false;
    }
};

/**
 *
 * @param object data
 */
var display = function () {
    var currentTab  = tabs.activeTab;
    var userBoardsP = user.getBoards();

    currentTab.on("close", function () {
        hidePanel();
    });
    currentTab.on("load", function () {
        hidePanel();
    });
    currentTab.on("ready", function () {
        hidePanel();
    });

    userBoardsP.then(function (userBoards) {
        if (userBoards.status !== "error") {
            if (visible) {
                worker.port.emit("panel-destroy");
                visible = false;
            }
            worker = currentTab.attach({
                contentScriptFile   : "./js/panel-note.js",
                contentScriptOptions: {
                    url       : currentTab.url,
                    name      : currentTab.title,
                    urlLabel  : _("note.url.label"),
                    nameLabel : _("note.name.label"),
                    categories: qwant.getCategories(),
                    userBoards: userBoards.data.boards,

                    cancel  : _("note.cancel"),
                    submit  : _("note.submit"),
                    advanced: _("note.advanced"),
                    create  : _("note.board.createButton"),

                    noteTitle      : _("note.title"),
                    noteSubtitle   : _("note.subtitle"),
                    noteCreateBoard: _("note.board.create"),

                    advancedSubtitle  : _("advanced.subtitle"),
                    advancedBoard     : _("advanced.board"),
                    advancedImage     : _("advanced.image"),
                    advancedEmptyImage: _("advanced.emptyImage"),
                    advancedTitle     : _("advanced.title"),
                    advancedContent   : _("advanced.content"),

                    boardSubtitle  : _("board.subtitle"),
                    boardName      : _("board.name"),
                    boardCategory  : _("board.category"),
                    boardVisibility: _("board.visibility"),
                    boardPrivate   : _("board.private"),
                    boardPublic    : _("board.public")
                }
            });
            attach(style, currentTab);
            visible = true;
            handleEvents();
        } else {
            alerts.display({
                type   : "error",
                message: qwant.errorMessage(userBoards.error),
                hasLink: false,
                url    : ""
            });
        }
    }, function (reject) {
        alerts.display({
            type   : "error",
            message: qwant.errorMessage(0),
            hasLink: false,
            url    : ""
        });
    });

};

var handleEvents = function () {
    worker.port.on("panel-visible", function () {
        visible = true;
    });
    worker.port.on("panel-hidden", function () {
        visible = false;
    });
    worker.port.on("panel-submit-simple", function (data) {
        data.description = tabs.activeTab.url;
        boards.createNote(data)
            .then(function (resolve) {
                if (resolve.status === "error") {
                    alerts.display({
                        type   : "error",
                        message: qwant.errorMessage(resolve.error),
                        hasLink: false,
                        url    : ""
                    });
                    worker.port.emit("panel-enable");
                } else {
                    alerts.display({
                        type   : "success",
                        message: _("note.creation.success"),
                        hasLink: true,
                        url    : "https://boards.qwant.com/board/" + user.user.username + "/" + resolve.data.board.board_slug
                    });
                    worker.port.emit("panel-destroy");
                }
            }, function (reject) {
                alerts.display({
                    type   : "error",
                    message: qwant.errorMessage(0),
                    hasLink: false,
                    url    : ""
                });
                worker.port.emit("panel-enable");
            })
    });
    worker.port.on("panel-create-board", function (data) {
        boards.createBoard(data)
            .then(function (resolve) {
                if (resolve.status !== "error") {
                    alerts.display({
                        type   : "success",
                        message: _("board.creation.success"),
                        hasLink: false,
                        url    : ""
                    });
                    user.getBoards()
                        .then(function (resolve) {
                            worker.port.emit("panel-display-note", resolve.data.boards);
                        });
                } else {
                    alerts.display({
                        type   : "error",
                        message: qwant.errorMessage(resolve.error),
                        hasLink: false,
                        url    : ""
                    });
                    worker.port.emit("panel-enable");
                }
            }, function (reject) {
                alerts.display({
                    type   : "error",
                    message: qwant.errorMessage(0),
                    hasLink: false,
                    url    : ""
                });
                worker.port.emit("panel-enable");
            });
    });
    worker.port.on("panel-advanced", function () {
        boards.getNotePreview({
            content: tabs.activeTab.url
        }).then(function (resolve) {
            if (resolve.status !== "success") {
                alerts.display({
                    type   : "error",
                    message: qwant.errorMessage(resolve.error),
                    hasLink: false,
                    url    : ""
                });
            } else {
                worker.port.emit("panel-advanced", resolve.data);
            }
        }, function (reject) {
            alerts.display({
                type   : "error",
                message: qwant.errorMessage(0),
                hasLink: false,
                url    : ""
            });
            worker.port.emit("panel-enable");
        });

    });
    worker.port.on("panel-advanced-submit", function (data) {
        boards.createNote(data)
            .then(function (resolve) {
                if (resolve.status !== "error") {
                    alerts.display({
                        type   : "success",
                        message: _("note.creation.success"),
                        hasLink: true,
                        url    : "https://boards.qwant.com/board/" + user.user.username + "/" + resolve.data.board.board_slug
                    });
                    worker.port.emit("panel-destroy");
                } else {
                    alerts.display({
                        type   : "error",
                        message: qwant.errorMessage(resolve.error),
                        hasLink: false,
                        url    : ""
                    });
                    worker.port.emit("panel-enable");
                }
            }, function (reject) {
                alerts.display({
                    type   : "error",
                    message: qwant.errorMessage(0),
                    hasLink: false,
                    url    : ""
                });
                worker.port.emit("panel-enable");
            });
    })
};

module.exports = {
    display: display
};