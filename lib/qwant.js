"use strict";
var manifest = browser.runtime.getManifest();

browser.webRequest.onBeforeRequest.addListener(function(details) {
    if (!details.url.match(/webext=true/)) {
        return {
            redirectUrl: details.url.replace('client=brz-moz', 'client=ext-firefox') + '&webext=' + manifest.version
        };
    }

    return {};
}, {
    urls: ["https://www.qwant.com/?*client=brz-moz*q=*", "https://www.qwant.com/?*q=*client=brz-moz*"],
    types: ["main_frame"]
}, ["blocking"]);

browser.runtime.setUninstallURL('https://www.qwant.com/extension/feedback?v=' + manifest.version);

browser.contextMenus.create({
    title   : 'Search Qwant for "%s"',
    contexts: ["selection"],
    onclick : function (info) {
        var queryText = info.selectionText;
        browser.tabs.create({
            url: "https://www.qwant.com/?q=" + queryText + "&client=ext-firefox-cm"
        });
    }
});

browser.runtime.onMessage.addListener((message, sender, callback) => {
    switch (message.name) {
        case 'uninstall':
            browser.management.uninstallSelf({
                showConfirmDialog: true
            }).then(null, null);
            break;
    }
});