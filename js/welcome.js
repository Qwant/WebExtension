"use strict";

var login = function(action) {
    if(action) chrome.runtime.sendMessage({name: "login_action", action: action});
    location.href='../html/login.html';
}

document.querySelectorAll(".login__input__submit")[0]
    .addEventListener("click", function () {
        login();
        //chrome.runtime.sendMessage({name: "popup_login", action: "login"});
        //location.href='../html/login.html';
    });

document.querySelectorAll(".button__action--board")[0]
    .addEventListener("click", function () {
        login("boards");
        //chrome.runtime.sendMessage({name: "popup_login", action: "boards"});
    });

document.querySelectorAll(".button__action--bookmark")[0]
    .addEventListener("click", function () {
        login("bookmarks");
        //chrome.runtime.sendMessage({name: "popup_login", action: "bookmarks"});
    });

document.querySelectorAll(".button__link--board")[0]
    .addEventListener("click", function () {
        login();
        //chrome.runtime.sendMessage({name: "popup_login"});
    });

document.querySelectorAll(".button__link--bookmark")[0]
    .addEventListener("click", function () {
        login();
        //chrome.runtime.sendMessage({name: "popup_login"});
    });

chrome.storage.local.get(["userExtension"], object => {
    if(object && object.userExtension) {
        object = JSON.parse(object.userExtension);
        if(object.avatar && object.username) {
            location.href='../html/account.html';
        }
    }
});
