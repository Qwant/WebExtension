"use strict";

var extensionInstalled = true;

//unsafeWindow.extensionInstalled = cloneInto(extensionInstalled, unsafeWindow);

document.addEventListener("qwant_website_login", function () {
    var qwantUser;
    if (window.location.href.match(/^https:\/\/boards\.qwant\.com/)) {
        window.Model.restore('user').then(function (data) {
            qwantUser = data;
            chrome.runtime.sendMessage({
                name: "qwant_website_login",
                username: qwantUser.username,
                avatar: qwantUser.avatar,
                session_token: qwantUser.token
            });
        });
    } else {
        qwantUser = JSON.parse(localStorage.getItem('user'));
        chrome.runtime.sendMessage({
            name: "qwant_website_login",
            username: qwantUser.username,
            avatar: qwantUser.avatar,
            session_token: qwantUser.token
        });
    }
});

document.addEventListener("qwant_website_logout", function () {
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

function injectScript(file_name) {
    var node = document.getElementsByTagName('body')[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', chrome.extension.getURL('js/inject_' + file_name + '.js'));
    node.appendChild(script);
}

function injectJSON(key, value) {
    var node = document.getElementsByTagName('body')[0];
    var span = document.getElementsByClassName('chrome-ext-vars');
    var object = {};
    if (span.length > 0) {
        span = span[0];
        object = JSON.parse(span.innerHTML);
    } else {
        span = document.createElement('span');
        span.className = 'chrome-ext-vars';
        span.style.display = 'none';
        node.appendChild(span);
    }
    object[key] = value;
    span.innerHTML = JSON.stringify(object);
}

chrome.runtime.onMessage.addListener((message, sender, callback) => {
    switch (message.name) {
        case "qwant_extension_login":
            injectJSON('userExtension', {
                username: message.user.username,
                avatar: message.user.avatar,
                session_token: message.user.session_token
            });
            injectScript('login');
            break;
        case "qwant_extension_logout":
            injectScript('logout');
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