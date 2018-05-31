"use strict";
var manifest = browser.runtime.getManifest();

browser.runtime.onInstalled.addListener(function (details) {
    function setCurrentTabUrl(tabsArray) {
        browser.tabs.create({
            url: "https://www.qwant.com/extension/thanks",
            active: false
        });
    }

    var data = {
        type: 'firefox-light',
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

browser.webRequest.onBeforeRequest.addListener(function(details) {
    if (!details.url.match(/webext=true/)) {
        return {
            redirectUrl: details.url.replace('client=brz-moz', 'client=ext-firefox-light-sb') + '&webext=' + manifest.version + '-light'
        };
    }

    return {};
}, {
    urls: ["https://www.qwant.com/?*client=brz-moz*q=*", "https://www.qwant.com/?*q=*client=brz-moz*"],
    types: ["main_frame"]
}, ["blocking"]);

browser.runtime.setUninstallURL('https://www.qwant.com/extension/feedback?v=' + manifest.version + '-light');

browser.contextMenus.create({
    title   : 'Search Qwant for "%s"',
    contexts: ["selection"],
    onclick : function (info) {
        var queryText = info.selectionText;
        browser.tabs.create({
            url: "https://www.qwant.com/?q=" + queryText + "&client=ext-firefox-light-cm"
        });
    }
});

browser.omnibox.onInputEntered.addListener(function (text) {
    browser.tabs.query({
        'currentWindow': true,
        'active'       : true
    }, function (tabs) {
        browser.tabs.update(tabs[0].id, {
            url: "https://www.qwant.com/?q=" + encodeURIComponent(text) + "&client=ext-firefox-light-ob"
        });
    });
});

var routes = {
    logInstall: {
        path: "/action/webext/install",
        method: "POST",
        apiType: config.SEARCH_API
    },
    logUpdate: {
        path: "/action/webext/update",
        method: "POST",
        apiType: config.SEARCH_API
    },
    logFeatureClick: {
        path: "/action/webext/feature_click",
        method: "POST",
        apiType: config.SEARCH_API
    }
};

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

var qwant = {
    api: api,
    routes: routes
};
