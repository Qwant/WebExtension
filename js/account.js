"use strict";

var PROTOCOLE = "https:";
var BOARDS_URL = "//boards.qwant.com";

var avatar = document.querySelectorAll(".account__avatar")[0];
var username = document.querySelectorAll(".account__username")[0];
var boardsLink = document.querySelectorAll(".button__link--board")[0];

document.querySelectorAll(".account__logout")[0]
    .addEventListener("click", function () {
        chrome.runtime.sendMessage({name: "do_logout"});
    });

document.querySelectorAll(".button__action--board")[0]
    .addEventListener("click", function () {
        chrome.runtime.sendMessage({name: "do_boards"});
    });

document.querySelectorAll(".button__action--bookmark")[0]
    .addEventListener("click", function () {
        chrome.runtime.sendMessage({name: "do_bookmarks"});
    });

boardsLink.addEventListener("click", function () {
    chrome.runtime.sendMessage({name: "close-popup"});
});

document.querySelectorAll(".button__link--bookmark")[0]
    .addEventListener("click", function () {
        chrome.runtime.sendMessage({name: "close-popup"});
    });

document.querySelectorAll(".account__avatar__container")[0]
    .addEventListener("click", function () {
        chrome.runtime.sendMessage({name: "close-popup"});
    });

document.querySelectorAll(".account__username")[0]
    .addEventListener("click", function () {
        chrome.runtime.sendMessage({name: "close-popup"});
    });

document.querySelectorAll(".account__settings")[0]
    .addEventListener("click", function () {
        chrome.runtime.sendMessage({name: "close-popup"});
    });

document.querySelectorAll(".account__logout")[0]
    .addEventListener("click", function () {
        chrome.runtime.sendMessage({name: "close-popup"});
    });

chrome.storage.local.get(["avatar", "username"], object => {
    console.log('object:', object);
    avatar.src = PROTOCOLE + object.avatar;
    username.textContent = object.username;
    boardsLink.href = PROTOCOLE + BOARDS_URL + "/user/" + object.username;
});

chrome.runtime.onMessage.addListener((message, sender, callback) => {
    switch (message.name) {
        case "popup_data":
            avatar.src = PROTOCOLE + message.avatar;
            username.textContent = message.username;
            boardsLink.href = PROTOCOLE + BOARDS_URL + "/user/" + message.username;
            break;
        case "popup_action":
            if (message.action === "boards") {
                document.querySelectorAll(".button__action--board")[0].click();
            } else if (message.action === "bookmarks") {
                document.querySelectorAll(".button__action--bookmark")[0].click();
            }
            break;
    }
});
