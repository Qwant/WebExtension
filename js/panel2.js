"use strict";

var action;

chrome.runtime.onMessage.addListener((message, sender, callback) => {
    console.log('message: ', message);
    switch(message.name) {
        case 'close-popup':
            window.close();
            break;
        case 'popup_login':
            action = message.action;
            location.href='../html/login.html';
            break;
    }
});
