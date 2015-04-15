/**
 * Setup Chrome object
 * @file qwant.js
 * @author Qwant
 * @class QwantForChrome
 * @constructor
 */
function QwantForChrome(){
    $this = this;

    if (localStorage['used_before'] === undefined) {
        chrome.tabs.create({'url': "html/thanks.html"});
        localStorage['used_before'] = 'true';
    }

    if (localStorage['qwt_embedded_google'] === undefined) {
        localStorage['qwt_embedded_google'] = 'true';
    }

    if (localStorage['qwt_embedded_bing'] === undefined) {
        localStorage['qwt_embedded_bing'] = 'true';
    }

    if (localStorage['qwt_embedded_yahoo'] === undefined) {
        localStorage['qwt_embedded_yahoo'] = 'true';
    }

    if (localStorage['qwt_embedded_yandex'] === undefined) {
        localStorage['qwt_embedded_yandex'] = 'true';
    }

    if (localStorage['qwt_embedded_mail'] === undefined) {
        localStorage['qwt_embedded_mail'] = 'true';
    }

    if (localStorage['qwt_embedded_baidu'] === undefined) {
        localStorage['qwt_embedded_baidu'] = 'true';
    }

    if (localStorage['qwt_save'] === undefined) {
        localStorage['qwt_save'] = 'true';
    }

    if (localStorage['qwt_last'] === undefined || localStorage['qwt_save'] == 'false') {
        localStorage['qwt_last'] = 'false';
    }

    chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
        if (request.options && request.options === "get") {
            sendResponse(localStorage);
        }

        if (request.options && request.options === "openOptions") {
            chrome.tabs.create({url: "html/options.html"});
        }

        if (request.current_url) {
            chrome.tabs.getSelected(function(tab) {
                return sendResponse(tab.url);
            });
        }

        if (request.uninstall) {
            chrome.management.uninstallSelf({showConfirmDialog: true}); 
        }

        return true;
    });
}
var qwantForChrome = new QwantForChrome();

chrome.omnibox.onInputEntered.addListener( function(text) {
    chrome.tabs.getSelected( undefined, function(tab) {
        localStorage['qwt_last'] = text;
        chrome.tabs.update(tab.id, {url: tab.url = "https://www.qwant.com/?q="+encodeURIComponent(text)}, undefined);
    });
});

chrome.contextMenus.create({
    "title": chrome.i18n.getMessage("context_menu_selected"),
    "contexts": ["selection"],
    "onclick" : clickHandlerSelection
});

/**
 * @function clickHandlerSelection
 * @param e
 * @param tab
 */
function clickHandlerSelection(e,tab) {
    if (e.selectionText) {
        var sText = e.selectionText;
        var url = "https://www.qwant.com/?q=" + encodeURIComponent(sText);
        chrome.tabs.create({
            url: url
        })
    }
}
