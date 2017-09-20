chrome.runtime.sendMessage({name: "popup_loaded"});
console.log('common events loaded');
chrome.runtime.onMessage.addListener((message, sender, callback) => {
    console.log('common-events:message', message);
    switch (message.name) {
        case "close-popup":
            closePopup(message.timeout);
            break;
        // case 'popup_login':
        //     action = message.action;
        //     console.log('location.href');
        //     location.href='../html/login.html';
        //     break;
        case "account":
            location.href="../html/account.html";
            break;
    }
});

function closePopup(timeout) {
    setTimeout(function() { window.close(); }, timeout || 10);
}
