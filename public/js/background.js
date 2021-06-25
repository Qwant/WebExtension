
const b = chrome || browser

b.runtime.onInstalled.addListener( (details) => {
    if (details.reason === "install") {
        chrome.tabs.create({
            url: "https://www.qwant.com/extension/thanks",
            active: false
        });
    }
});

b.runtime.setUninstallURL('https://www.qwant.com/extension/feedback');
