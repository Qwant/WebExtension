function Background () {
    chrome.runtime.onInstalled.addListener(function (details) {
        // only run the following section on install
        if (details.reason !== "install") {
            return;
        }

        chrome.tabs.create({
            url: "https://www.qwant.com/extension/thanks"
        });
    });
};

var background = new Background();

chrome.omnibox.onInputEntered.addListener(function (text) {
    chrome.tabs.query({
        'currentWindow': true,
        'active'       : true
    }, function (tabs) {
        chrome.tabs.update(tabs[0].id, {
            url: "https://www.qwant.com/?q=" + encodeURIComponent(text) + "&client=qwant-chrome"
        });
    });
});

chrome.contextMenus.create({
    title   : 'Search Qwant for "%s"',
    contexts: ["selection"],
    onclick : function (info) {
        var queryText = info.selectionText;
        chrome.tabs.create({
            url: "https://www.qwant.com/?q=" + queryText + "&client=qwant-chrome"
        });
    }
});

chrome.browserAction.onClicked.addListener(function (activeTab) {
    chrome.tabs.create({url: "https://www.qwant.com/?client=qwant-chrome"});
});
