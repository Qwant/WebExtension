"use strict";

// var qwant        = require("./qwant");
// var localstorage = require("./localstorage");

const NO_USER  = 0;
const USER_WEB = 1;
const USER_EXT = 2;

var userData = {
    username     : "",
    avatar       : "",
    session_token: ""
};

var userIsLogged  = function () {
    return (userData.session_token !== "");
};
var userLogin = function (data, eventsWorkers) {
    return new Promise(function (resolveLogin, rejectLogin) {
        qwant.api(qwant.routes.login, {
            login   : data.username,
            password: data.password
        })
            .then(function (resolveAPI) {
                if (!resolveAPI.error) {

                    userFillInfos({
                        username     : resolveAPI.data.user.username,
                        avatar       : resolveAPI.data.user.avatar,
                        session_token: resolveAPI.data.session_token
                    });
                    userSave();
                    // if (eventsWorkers.length > 0) {
                    //     eventsWorkers.forEach(function (worker) {
                    //         chrome.runtime.sendMessage({name: "qwant_extension_login"});
                    //     });
                    // }
                    chrome.tabs.query({url: ["https://www.qwant.com/*", "https://boards.qwant.com/*"]}, function(tabs) {
                        for(var i=0; i<tabs.length; i++) {
                            chrome.tabs.sendMessage(tabs[i].id, {
                                name: "qwant_extension_login",
                                user: userData
                            });
                        }
                        if (tabs.length === 0) {
                            chrome.storage.local.set({lastLogAction: "in"});
                        }
                    });
                    updateIcon();
                    resolveLogin(userData);
                } else {
                    rejectLogin({
                        user: resolveAPI.error
                    });
                }
            }, function (rejectAPI) {
                rejectLogin({
                    api: rejectAPI
                });
            });
    });

};
var userFillInfos = function (data) {
    userData.username      = data.username;
    userData.avatar        = data.avatar;
    userData.session_token = data.session_token;
};
var userLogout    = function (eventsWorkers) {
    userFillInfos({
        username     : "",
        avatar       : "",
        session_token: ""
    });
    chrome.storage.local.remove(["userExtension"]);
    // localstorage.remove("user");
    // localstorage.remove("userExtension");

    // if (eventsWorkers && eventsWorkers.length > 0) {
    //     eventsWorkers.forEach(function (worker) {
    //         worker.port.emit("qwant_extension_logout");
    //     });
    // }
    chrome.tabs.query({url: "https://*.qwant.com/*"}, function(tabs) {
        for(var i=0; i<tabs.length; i++) {
            chrome.tabs.sendMessage(tabs[i].id, {name: "qwant_extension_logout"});
        }
        if (tabs.length === 0) {
            chrome.storage.local.set({lastLogAction: "out"});
        }
    });
    updateIcon();
    // chrome.runtime.sendMessage({name: "close-popup"});
};
var userSave      = function () {
    chrome.storage.local.set({ userExtension: JSON.stringify(userData) });
};
var userLoad      = function (callback) {
    var userExtension, userWebsite, userJson, flag;
    chrome.storage.local.get(["userExtension", "user"], function(items) {
        userExtension = items.userExtension || null;
        userWebsite   = items.user || null;
        userJson      = null;
        flag          = NO_USER;

        if (!userExtension && userWebsite) {
            userJson = JSON.parse(userWebsite);
            flag     = USER_WEB;
        } else if (userExtension) {
            userJson = JSON.parse(userExtension);
            flag     = USER_EXT;
        }
        if (userJson && userJson !== "undefined" && userJson !== undefined && userJson !== null
            && (userJson.session_token || userJson.token)) {
            userFillInfos({
                username     : userJson.username,
                avatar       : userJson.avatar,
                session_token: userJson.session_token || userJson.token
            });
            if (flag === USER_WEB) {
                userSave();
            }
        } else {
            userFillInfos({
                username     : "",
                avatar       : "",
                session_token: ""
            });
        }
        callback();
    });
};

var userGetBoards = function () {
    return new Promise(function (resolve, reject) {
        qwant.api(qwant.routes.getBoards, {
            session_token: userData.session_token
        }).then(function (resolveAPI) {
            resolve(resolveAPI.data.boards);
        }, function (rejectApi) {
            reject(rejectApi);
        });
    });
};
var userGetBookmarks = function () {
    return new Promise(function (resolve, reject) {
        qwant.api(qwant.routes.getBookmarks, {
            session_token: userData.session_token
        })
            .then(function (resolveAPI) {
                if (resolveAPI.status === "error") {
                    reject(resolveAPI);
                } else {
                    resolve(resolveAPI.data);
                }
            }, function (rejectAPI) {
                reject(rejectAPI);
            });
    });
};

var user = {
    user        : userData,
    isLogged    : userIsLogged,
    login       : userLogin,
    logout      : userLogout,
    save        : userSave,
    load        : userLoad,
    getBoards   : userGetBoards,
    getBookmarks: userGetBookmarks
};

chrome.runtime.onMessage.addListener((message, sender, callback) => {
    switch (message.name) {
        case "account-loaded":
            chrome.runtime.sendMessage({name: "popup_data", avatar: userData.avatar, username: userData.username});
            break;
    }
});

userLoad(() => {
    updateIcon();
});
