"use strict";

document.querySelectorAll(".login__input__submit")[0]
    .addEventListener("click", function () {
        chrome.runtime.sendMessage({name: "popup_login", action: "login"});
    });

document.querySelectorAll(".button__action--board")[0]
    .addEventListener("click", function () {
        chrome.runtime.sendMessage({name: "popup_login", action: "boards"});
    });

document.querySelectorAll(".button__action--bookmark")[0]
    .addEventListener("click", function () {
        chrome.runtime.sendMessage({name: "popup_login", action: "bookmarks"});
    });

document.querySelectorAll(".button__link--board")[0]
    .addEventListener("click", function () {
        chrome.runtime.sendMessage({name: "popup_login"});
    });

document.querySelectorAll(".button__link--bookmark")[0]
    .addEventListener("click", function () {
        chrome.runtime.sendMessage({name: "popup_login"});
    });

document.querySelectorAll(".login__input__register")[0]
    .addEventListener("click", function () {
        chrome.runtime.sendMessage({name: "close-popup"});
    });

document.querySelectorAll(".login__input__lost-password")[0]
    .addEventListener("click", function () {
        chrome.runtime.sendMessage({name: "close-popup"});
    });

chrome.storage.local.get(["avatar", "username"], object => {
    if(object.avatar && object.username) {
        location.href='../html/account.html';
    }
});
