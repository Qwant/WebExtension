"use strict";
var manifest = chrome.runtime.getManifest();
var browser = chrome;

chrome.runtime.onInstalled.addListener(function (details) {

    if (details.reason === "install") {
        chrome.tabs.query({active: true}, (tabsArray) => {
            if (tabsArray.length > 0 && tabsArray[0].hasOwnProperty('url') && tabsArray[0].url.match(/^https:\/\/www.qwant\.com.*/) !== null) {
                chrome.tabs.executeScript({
                    code: "document.querySelector('.extension__chrome__overlay__instructions').style.display = 'none';document.querySelector('.extension__overlay__thanks').style.display = 'block';"
                });
            }
            chrome.tabs.create({
                url: "https://www.qwant.com/extension/thanks",
                active: false
            });
        })
    }
});

chrome.runtime.setUninstallURL('https://www.qwant.com/extension/feedback?v=' + manifest.version);
