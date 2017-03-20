"use strict";

var extensionInstalled = true;

//unsafeWindow.extensionInstalled = cloneInto(extensionInstalled, unsafeWindow);

document.addEventListener("qwant_website_login", function () {
    var qwantUser = JSON.parse(localStorage.getItem('user'));
    chrome.runtime.sendMessage({
        name: "qwant_website_login",
        username: qwantUser.username,
        avatar: qwantUser.avatar,
        session_token: qwantUser.token
    });
});

document.addEventListener("qwant_website_logout", function () {
    console.log("events.js: qwant_website_logout");
    chrome.runtime.sendMessage({name: "qwant_website_logout"});
});

document.addEventListener("qwant_extension_forced_logout", function () {
    chrome.runtime.sendMessage({name: "qwant_extension_forced_logout"});
});

document.addEventListener("qwant_website_bookmark_created", function () {
    chrome.runtime.sendMessage({name: "qwant_website_bookmark_created"});
});

document.addEventListener("qwant_website_bookmark_deleted", function () {
    chrome.runtime.sendMessage({name: "qwant_website_bookmark_deleted"});
});

document.addEventListener("qwant_website_open_extension", function () {
    chrome.runtime.sendMessage({name: "qwant_website_open_extension"});
});

document.addEventListener("qwant_website_is_tp_enabled", function () {
    chrome.runtime.sendMessage({name: "qwant_website_is_tp_enabled"});
});

document.addEventListener("qwant_website_tp_on", function () {
    chrome.runtime.sendMessage({name: "qwant_website_tp_on"});
});

document.addEventListener("qwant_website_tp_off", function () {
    chrome.runtime.sendMessage({name: "qwant_website_tp_off"});
});

chrome.runtime.onMessage.addListener((message, sender, callback) => {
    switch (message.name) {
        case "qwant_extension_login":
            localStorage.setItem('userExtension', JSON.stringify({
                username: message.user.username,
                avatar: message.user.avatar,
                session_token: message.user.session_token
            }));
            document.dispatchEvent(new CustomEvent("qwant_extension_login"));
            break;
        case "qwant_extension_logout":
            localStorage.removeItem('user');
            localStorage.removeItem('userExtension');
            document.dispatchEvent(new CustomEvent("qwant_extension_logout"));
            break;
        case "qwant_extension_tp_status":
            if (message.data === true) {
                document.dispatchEvent(new CustomEvent("qwant_extension_tp_enabled"));
            } else {
                document.dispatchEvent(new CustomEvent("qwant_extension_tp_disabled"));
            }
            break;
    }
});
