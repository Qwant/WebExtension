"use strict";

document.querySelectorAll(".login__input__submit")[0]
    .addEventListener("click", function () {
        //self.port.emit("popup_login", {action: "login"});
        location.href='./login.html';
    });

document.querySelectorAll(".button__action--board")[0]
    .addEventListener("click", function () {
        //self.port.emit("popup_login", {action: "boards"});
        browser.runtime.sendMessage({
            name: "popup_login",
            action: "boards"
        });
    });

document.querySelectorAll(".button__action--bookmark")[0]
    .addEventListener("click", function () {
        //self.port.emit("popup_login", {action: "bookmarks"});
        browser.runtime.sendMessage({
            name: "popup_login",
            action: "bookmarks"
        });
    });

document.querySelectorAll(".button__link--board")[0]
    .addEventListener("click", function () {
        //self.port.emit("popup_login");
        browser.runtime.sendMessage({
            name: "popup_login"
        });
    });

document.querySelectorAll(".button__link--bookmark")[0]
    .addEventListener("click", function () {
        //self.port.emit("popup_login");
        browser.runtime.sendMessage({
            name: "popup_login"
        });
    });

document.querySelectorAll(".login__input__register")[0]
    .addEventListener("click", function () {
        //self.port.emit("close-popup");
        closePopup();
    });

document.querySelectorAll(".login__input__lost-password")[0]
    .addEventListener("click", function () {
        //self.port.emit("close-popup");
        closePopup();
    });
