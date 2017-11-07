"use strict";
var manifest = browser.runtime.getManifest();

browser.runtime.onInstalled.addListener(function (details) {
    function setCurrentTabUrl(tabsArray) {
        if (tabsArray[0].url.match(/^https?:\/\/([a-zA-Z0-9_-]*)\.qwant\.(com|loc|dev|uat)/) !== null) {
            //console.log('In a Qwant tab');
            browser.tabs.executeScript({
                code: "document.querySelector('.extension__firefox__overlay__instructions').style.display = 'none';document.querySelector('.extension__overlay__thanks').style.display = 'block';"
            });
        }
        browser.tabs.create({
            url: "https://www.qwant.com/extension/firefox/first-run",
            active: false
        });
    }

    var data = {
        type: 'firefox',
        context: manifest.version
    };
    if (user.user.session_token) {
        data.session_token = user.user.session_token;
    }

    if (details.reason === "install") {
        var currentTab = browser.tabs.query({active: true});
        currentTab.then(setCurrentTabUrl);

        qwant.api(qwant.routes.logInstall, data).then(
            function (resolveApi) {},
            function (rejectApi) {}
        );
    } else if (details.reason === "update") {
        qwant.api(qwant.routes.logUpdate, data).then(
            function (resolveApi) {},
            function (rejectApi) {}
        );
    }
});

browser.runtime.setUninstallURL('https://www.qwant.com/extension/feedback?v='+manifest.version);

browser.contextMenus.create({
    title   : 'Search Qwant for "%s"',
    contexts: ["selection"],
    onclick : function (info) {
        var queryText = info.selectionText;
        browser.tabs.create({
            url: "https://www.qwant.com/?q=" + queryText + "&client=qwant-firefox"
        });
    }
});

browser.omnibox.onInputEntered.addListener(function (text) {
    browser.tabs.query({
        'currentWindow': true,
        'active'       : true
    }, function (tabs) {
        browser.tabs.update(tabs[0].id, {
            url: "https://www.qwant.com/?q=" + encodeURIComponent(text) + "&client=qwant-firefox"
        });
    });
});

var updateIcon = () => {
    privacy.isEnabled(isPrivacyEnabled => {
        if(userIsLogged()) {
            if(isPrivacyEnabled) {
                browser.browserAction.setIcon({ path: '../img/q4-48.png' });
            } else {
                browser.browserAction.setIcon({ path: '../img/q3-48.png' });
            }
        } else {
            if(isPrivacyEnabled) {
                browser.browserAction.setIcon({ path: '../img/q2-48.png' });
            } else {
                browser.browserAction.setIcon({ path: '../img/q1-48.png' });
            }
        }
    });
};

var loginAction;

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
    logInstall: {
        path: "/action/webExtInstalled",
        method: "POST",
        apiType: config.SEARCH_API
    },
    logUpdate: {
        path: "/action/webExtUpdated",
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

        if (route.method === "POST") {
            params.st_encoded = true;
            data = Object.keys(params).map(function(key) {
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(params[key]);
            }).join('&');
        }
        else {
            uri += '?';
            uri += Object.keys(params).map(function(key) {
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(params[key]);
            }).join('&');
        }

        if (config.DEBUG) {
            uri += (route.method === "POST")?("?"):("&");
            uri += config.XDEBUG;
        }

        client.open(route.method, uri);
        client.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        client.timeout = 10000;

        client.send(data);

        client.onload = function () {
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

browser.runtime.onMessage.addListener((message, sender, callback) => {
    //console.log('qwant:message: ', message);

    switch (message.name) {
        case "popup_loaded":
            privacy.isEnabled(status => {
                //console.log('sending tracking_protection_status message');
                browser.runtime.sendMessage({
                    name         : "tracking_protection_status",
                    status       : status,
                    text_enabled : _("tracking_protection_content_enabled"),
                    text_disabled: _("tracking_protection_content_disabled")
                });
            });
            break;
        case "tracking_protection_on":
            privacy.enable(true);
            updateIcon();
            break;
        case "tracking_protection_off":
            privacy.disable();
            updateIcon();
            break;
        case "login_action":
            loginAction = message.action;
            break;
        case "get_login_action":
            browser.runtime.sendMessage({name: "popup_action", action: loginAction});
            loginAction = null;
            break;
        case "do_login":
            console.log(message);
            user.login({username: message.username, password: message.password}, [])// eventsWorkers) TODO
                .then(function (resolve) {
                    //browser.storage.local.set({avatar: resolve.avatar, username: resolve.username}, () => {
                    browser.runtime.sendMessage({name: "account"});
                    //});
                }, function (reject) {
                    browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
                        browser.runtime.sendMessage({name: "popup_display_submit"});
                    });
                });
            break;
        case "do_logout":
            user.logout([]);
            break;
        case "do_boards":
            browser.runtime.sendMessage({name: "close-popup"});
            browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
                browser.tabs.create({
                    url: "https://boards.qwant.com/user/" + userData.username + "?url=" + encodeURIComponent(tabs[0].url)
                });
            });
            break;
        case "do_bookmarks":
            browser.runtime.sendMessage({name: "close-popup"});
            browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
                browser.tabs.create({
                    url: "https://www.qwant.com/all?tab=bookmarks&url=" + encodeURIComponent(tabs[0].url) + "&title=" + encodeURIComponent(tabs[0].title)
                });
            });
            break;
        case "qwant_website_login":
            userFillInfos(message);
            userSave();
            updateIcon();
            browser.runtime.sendMessage({name: "account"});
            browser.tabs.query({url: "https://www.qwant.com/*"}, function(tabs) {
                //console.log('qwant tabs: ', tabs.length);
                for(var i=0; i<tabs.length; i++) {
                    ensureSendMessage(tabs[i].id, {
                        name: "qwant_extension_login",
                        user: userData
                    });
                }
            });
            break;
        case "qwant_website_logout":
            userLogout();
            break;

        case 'reload-tabs':
            browser.tabs.query({}, tabs => {
                tabs.forEach(tab => {
                    browser.tabs.reload(tab.id);
                });
            });
            break;
    }
});

function ensureSendMessage(tabId, message, callback) {
    browser.tabs.sendMessage(tabId, {name: "ping"}, function(response) {
        if(response && response.name == "pong") { // Content script ready
            browser.tabs.sendMessage(tabId, message, callback);
        } else { // No listener on the other end
            browser.tabs.executeScript(tabId, {file: "js/contentScript.js"}, function() {
                if(browser.runtime.lastError) {
                    console.error(browser.runtime.lastError);
                    throw Error("Unable to inject script into tab " + tabId);
                }
                // OK, now it's injected and ready
                browser.tabs.sendMessage(tabId, message, callback);
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
