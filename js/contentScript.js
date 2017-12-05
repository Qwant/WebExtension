"use strict";

browser.runtime.onMessage.addListener((message, sender, callback) => {
    switch (message.name) {
        case "ping":
            callback({name: "pong"});
            break;
    }
});
