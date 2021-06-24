
const b = chrome || browser

b.runtime.onInstalled.addListener( (details) => {
    if (details.reason === "install") {
        chrome.tabs.create({
            url: "https://www.qwant.com/extension/thanks",
            active: false
        });
    }
});

b.runtime.setUninstallURL('https://fr.surveymonkey.com/r/KS9WPBC');
