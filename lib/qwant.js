"use strict";

// const config = require("./configuration");
// const user = require("./user");

// console.log('config: ', config);

// var _ = (message => {
//     return chrome.i18n.getMessage(message);
// });

//bookmarks.test();

var routes = {
    login: {
        path: "/account/login",
        method: "POST",
        apiType: config.SEARCH_API
    },
    getBookmarks: {
        path: "/account/favorite",
        method: "GET",
        apiType: config.SEARCH_API
    },
    createBookmark: {
        path: "/account/favorite/create",
        method: "POST",
        apiType: config.SEARCH_API
    },
    getBoards: {
        path: "/board/getFlatList",
        method: "GET",
        apiType: config.BOARDS_API
    },
    createBoard: {
        path: "/board/create",
        method: "POST",
        apiType: config.BOARDS_API
    },
    getNotePreview: {
        path: "/note/preview",
        method: "GET",
        apiType: config.BOARDS_API
    },
    createNote: {
        path: "/note/create?XDEBUG_SESSION_START=vagrant",
        method: "POST",
        apiType: config.BOARDS_API
    }
};

var errors = {
    0: {
        code: "ERROR_EXTENSION",
        message: _("error_0_message")
    },
    1: {
        code: "ERROR_FORM_VALIDATION",
        message: _("error_1_message")
    },
    2: {
        code: "ERROR_DATABASE",
        message: _("error_2_message")
    },
    3: {
        code: "ERROR_INTERNAL",
        message: _("error_3_message")
    },
    101: {
        code: "ERROR_USER_NOT_FOUND",
        message: _("error_101_message")
    },
    102: {
        code: "ERROR_USER_DISABLED",
        message: _("error_102_message")
    },
    104: {
        code: "ERROR_USER_BANNED",
        message: _("error_104_message")
    },
    105: {
        code: "ERROR_INVALID_PASSWORD_OR_EMAIL",
        message: _("error_105_message")
    },
    108: {
        code: "ERROR_INVALID_TOKEN",
        message: _("error_108_message")
    },
    201: {
        code: "ERROR_BOARD_NOT_FOUND",
        message: _("error_201_message")
    },
    206: {
        code: "ERROR_BOARD_ALREADY_EXISTS",
        message: _("error_206_message")
    },
    304: {
        code: "ERROR_NOTE_ALREADY_EXISTS",
        message: _("error_304_message")
    },
    401: {
        code: "ERROR_FAVORITE_ALREADY_EXISTS",
        message: _("error_401_message")
    },
    402: {
        code: "ERROR_FAVORITE_URL_NOT_ACCESSIBLE",
        message: _("error_402_message")
    }
};

var categories = [
    {
        id: 10,
        i18n: _('category_animals')
    },
    {
        id: 6,
        i18n: _('category_architecture')
    },
    {
        id: 2,
        i18n: _('category_art')
    },
    {
        id: 11,
        i18n: _('category_automoto')
    },
    {
        id: 12,
        i18n: _('category_beauty')
    },
    {
        id: 19,
        i18n: _('category_culture')
    },
    {
        id: 14,
        i18n: _('category_entrepreneur')
    },
    {
        id: 7,
        i18n: _('category_fashion')
    },
    {
        id: 9,
        i18n: _('category_gastronomy')
    },
    {
        id: 15,
        i18n: _('category_geek')
    },
    {
        id: 29,
        i18n: _('category_health')
    },
    {
        id: 24,
        i18n: _('category_hightech')
    },
    {
        id: 25,
        i18n: _('category_hobbies')
    },
    {
        id: 3,
        i18n: _('category_humor')
    },
    {
        id: 27,
        i18n: _('category_illustration')
    },
    {
        id: 8,
        i18n: _('category_job')
    },
    {
        id: 13,
        i18n: _('category_kids')
    },
    {
        id: 18,
        i18n: _('category_marketing')
    },
    {
        id: 28,
        i18n: _('category_movies')
    },
    {
        id: 26,
        i18n: _('category_music')
    },
    {
        id: 16,
        i18n: _('category_nature')
    },
    {
        id: 4,
        i18n: _('category_news')
    },
    {
        id: 1,
        i18n: _('category_people')
    },
    {
        id: 5,
        i18n: _('category_politics')
    },
    {
        id: 23,
        i18n: _('category_sciences')
    },
    {
        id: 70,
        i18n: _('category_sexy')
    },
    {
        id: 22,
        i18n: _('category_society')
    },
    {
        id: 21,
        i18n: _('category_sport')
    },
    {
        id: 20,
        i18n: _('category_travel')
    },
    {
        id: 17,
        i18n: _('category_videogames')
    },
    {
        id: 30,
        i18n: _('category_web')
    },
    {
        id: 69,
        i18n: _("category_adult")
    },
    {
        id: 31,
        i18n: _('category_others')
    }
];

var api = function (route, params) {
    return new Promise(function (resolve, reject) {
        var client = new XMLHttpRequest();
        var uri = route.apiType + route.path;
        var data = null;
        var searchParams = new URLSearchParams(params);
        console.log('uri:', uri);


        if (route.method === "POST") {
            params.st_encoded = true;
            data = Object.keys(params).map(function(key) {
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(params[key]);
            }).join('&');
        }
        else {
            uri += "?" + searchParams.toString();
        }

        console.log('data:', data);

        if (config.DEBUG) {
            uri += (route.method === "POST")?("?"):("&");
            uri += config.XDEBUG;
        }

        client.open(route.method, uri);
        client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        client.timeout = 10000;

        client.send(data);

        client.onload = function () {
            console.log('api response: ', this.response);

            if (this.status >= 200 && this.status < 300) {
                resolve(JSON.parse(this.response));
            } else {
                reject(this.statusText);
            }
        };

        client.onerror = function () {
            reject(this.statusText);
        };

        client.ontimeout = function () {
            reject(0);
        };
    });
};

var errorMessage = function (errorCode) {
    if (errors[errorCode]) {
        return errors[errorCode].message;
    } else {
        return errors[0].message;
    }

};

var getCategories = function () {
    var cats = categories.slice(0), // We need to clone the categories array in order not to remove the Adult category
        others = {
            idx: 0,
            item: null
        },
        adult = {
            idx: 0,
            item: null
        },
        stop = false;

    cats.sort(function (a, b) {
        if (a.i18n > b.i18n)
            return 1;
        if (a.i18n < b.i18n)
            return -1;
        return 0;
    });

    stop = false;
    cats.forEach(function (cat, idx) {
        if (69 === cat.id && !stop) {
            adult.idx = idx;
            adult.item = cat;
            cats.splice(adult.idx, 1);
            cats.push(adult.item);
            stop = true;
        }
    });

    stop = false;
    cats.forEach(function (cat, idx) {
        if (31 === cat.id && !stop) {
            others.idx = idx;
            others.item = cat;
            cats.splice(others.idx, 1);
            cats.unshift(others.item);
            stop = true;
        }
    });

    return cats;
};

chrome.runtime.onMessage.addListener((message, sender, callback) => {
    console.log('qwant:message: ', message);

    switch (message.name) {
        case "popup_loaded":
            privacy.isEnabled(status => {
                console.log('sending tracking_protection_status message');
                chrome.runtime.sendMessage({
                    name         : "tracking_protection_status",
                    status       : status,
                    text_enabled : _("tracking_protection_content_enabled"),
                    text_disabled: _("tracking_protection_content_disabled")
                });
            });
            break;
        case "tracking_protection_on":
            privacy.enable(true);
            chrome.browserAction.setIcon({ path: '../img/q2-48.png' });
            // button.state("window", {
            //     icon: getIcon()
            // });
            break;
        case "tracking_protection_off":
            privacy.disable();
            // button.state("window", {
            //     icon: getIcon()
            // });
            chrome.browserAction.setIcon({ path: '../img/q1-48.png' });
            break;
        case "do_login":
            user.login({username: message.username, password: message.password}, [])// eventsWorkers) TODO
                .then(function (resolve) {
                    chrome.storage.local.set({avatar: resolve.avatar, username: resolve.username}, () => {
                        chrome.runtime.sendMessage({name: "account"});
                    });
                }, function (reject) {
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        if (reject.user) {
                            ensureSendMessage(tabs[0].id, {
                                name   : "alert-display",
                                type   : "error",
                                message: errorMessage(reject.user),
                                hasLink: false,
                                url    : ""
                            });
                        } else {
                            ensureSendMessage(tabs[0].id, {
                                name   : "alert-display",
                                type   : "error",
                                message: errorMessage(0),
                                hasLink: false,
                                url    : ""
                            });
                        }
                        chrome.runtime.sendMessage({name: "popup_display_submit"});
                    });
                });
            break;
        case "do_logout":
            user.logout([]);
            break;
        case "do_boards":
            chrome.runtime.sendMessage({name: "close-popup"});
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                ensureSendMessage(tabs[0].id, {
                    name: "note-display",
                    url      : tabs[0].url,
                    name2     : tabs[0].title,
                    urlLabel : _("bookmark_url_label"),
                    nameLabel: _("bookmark_name_label"),
                    title    : _("bookmark_title"),
                    cancel   : _("bookmark_cancel"),
                    submit   : _("bookmark_submit")
                });
            });
            panelNote.display();
        case "do_bookmarks":
            chrome.runtime.sendMessage({name: "close-popup"});
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                ensureSendMessage(tabs[0].id, {
                    name: "bookmarks-display",
                    url      : tabs[0].url,
                    name2     : tabs[0].title,
                    urlLabel : _("bookmark_url_label"),
                    nameLabel: _("bookmark_name_label"),
                    title    : _("bookmark_title"),
                    cancel   : _("bookmark_cancel"),
                    submit   : _("bookmark_submit")
                });
            });
            break;
        case "panel-bookmark-submit":
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                bookmarks.save(message).then(values => {
                    console.log('bookmark-after-save values: ', values);

                    if (values[0].status === "error") {
                        ensureSendMessage(tabs[0].id, {
                            name   : "alert-display",
                            type   : "error",
                            message: qwant.errorMessage(values[0].error),
                            hasLink: false,
                            url    : ""
                        }, function() {
                            chrome.tabs.sendMessage(tabs[0].id, {
                                name   : "panel-bookmark-enable"
                            });
                        });
                    } else {
                        ensureSendMessage(tabs[0].id, {
                            name   : "alert-display",
                            type   : "success",
                            message: _("bookmark_success"),
                            hasLink: true,
                            url    : "https://www.qwant.com/all?tab=bookmarks"
                        }, function() {
                            chrome.tabs.sendMessage(tabs[0].id, {
                                name   : "panel-bookmark-destroy"
                            });
                        });
                    }
                }, error => {
                    ensureSendMessage(tabs[0].id, {
                        name   : "alert-display",
                        type   : "error",
                        message: qwant.errorMessage(0),
                        hasLink: false,
                        url    : ""
                    }, function() {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            name   : "panel-bookmark-enable"
                        });
                    });

                });
            });
            break;
    }
});

function ensureSendMessage(tabId, message, callback) {
    chrome.tabs.sendMessage(tabId, {name: "ping"}, function(response) {
        if(response && response.name == "pong") { // Content script ready
            chrome.tabs.sendMessage(tabId, message, callback);
        } else { // No listener on the other end
            chrome.tabs.executeScript(tabId, {file: "js/contentScript.js"}, function() {
                if(chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                    throw Error("Unable to inject script into tab " + tabId);
                }
                // OK, now it's injected and ready
                chrome.tabs.sendMessage(tabId, message, callback);
            });
        }
    });
}

var qwant = {
    api: api,
    routes: routes,
    errorMessage: errorMessage,
    getCategories: getCategories
};
