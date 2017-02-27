var action;

chrome.runtime.sendMessage({name: "popup_loaded"});

chrome.runtime.onMessage.addListener((message, sender, callback) => {
    console.log('common-events:message', message);
    switch (message.name) {
        case "close-popup":
            setTimeout(function() { window.close(); }, message.timeout || 10);
            break;
        case 'popup_login':
            action = message.action;
            location.href='../html/login.html';
            break;
        case "account":
            location.href="../html/account.html";
            break;
    }
});
