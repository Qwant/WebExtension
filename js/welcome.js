"use strict";

var login = function(action) {
    if(action) chrome.runtime.sendMessage({name: "login_action", action: action});
    location.href='../html/login.html';
};

if (document.querySelectorAll(".login__input__submit") && document.querySelectorAll(".login__input__submit").length > 0) {
    document.querySelectorAll(".login__input__submit")[0]
        .addEventListener("click", function () {
            login();
        });
}

if (document.querySelectorAll(".button__action--board") && document.querySelectorAll(".button__action--board").length > 0) {
    document.querySelectorAll(".button__action--board")[0]
        .addEventListener("click", function () {
            login("boards");
        });
}

if (document.querySelectorAll(".button__action--bookmark") && document.querySelectorAll(".button__action--bookmark").length > 0) {
    document.querySelectorAll(".button__action--bookmark")[0]
        .addEventListener("click", function () {
            login("bookmarks");
        });
}

if (document.querySelectorAll(".button__link--board") && document.querySelectorAll(".button__link--board").length > 0) {
    document.querySelectorAll(".button__link--board")[0]
        .addEventListener("click", function () {
            login();
        });
}

if (document.querySelectorAll(".button__link--bookmark") && document.querySelectorAll(".button__link--bookmark").length > 0) {
    document.querySelectorAll(".button__link--bookmark")[0]
        .addEventListener("click", function () {
            login();
        });
}

chrome.storage.local.get(["userExtension"], object => {
    if(object && object.userExtension) {
        object = JSON.parse(object.userExtension);
        if(object.avatar && object.username) {
            location.href='../html/account.html';
        }
    }
});
