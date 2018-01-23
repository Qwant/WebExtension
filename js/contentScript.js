"use strict";

chrome.runtime.onMessage.addListener(function (message, sender, callback) {
    switch (message.name) {
        case "ping":
            callback({name: "pong"});
            break;
    }
});
