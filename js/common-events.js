browser.runtime.sendMessage({name: "popup_loaded"});
console.log('common events loaded');
browser.runtime.onMessage.addListener((message, sender, callback) => {
    console.log('common-events:message', message);
    switch (message.name) {
        case "close-popup":
            closePopup(message.timeout);
            break;
        case "account":
            location.href="../html/account.html";
            break;
    }
});

function closePopup(timeout) {
    setTimeout(function() { window.close(); }, timeout || 10);
}
