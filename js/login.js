"use strict";
var browser = chrome;

var formValidation = function (event) {
    event.preventDefault();
    if (event.key && event.key != "Enter") return;

    var username = document.querySelectorAll(".login__input__login")[0].value;
    var password = document.querySelectorAll(".login__input__password")[0].value;

    document.querySelectorAll(".login-error")[0].style.display = 'none';
    document.querySelectorAll(".login__input__login__label")[0].style.color = '#5C6F84';
    document.querySelectorAll(".login__input__password__label")[0].style.color = '#5C6F84';
    document.querySelectorAll(".login__input__login")[0].style.borderColor = "#C8CBD3";
    document.querySelectorAll(".login__input__login")[0].style.color = "#353C52";
    document.querySelectorAll(".login__input__password")[0].style.borderColor = "#C8CBD3";
    document.querySelectorAll(".login__input__password")[0].style.color = "#353C52";
    document.querySelectorAll(".login__input__submit")[0].style.marginTop = "48px";
    browser.runtime.sendMessage({name: "do_login", username: username, password: password});
};

document.querySelectorAll(".login__input__submit")[0]
    .addEventListener("click", formValidation);
document.querySelectorAll(".login__input__login")[0]
    .addEventListener("keyup", formValidation);
document.querySelectorAll(".login__input__password")[0]
    .addEventListener("keyup", formValidation);

chrome.runtime.onMessage.addListener((message, sender, callback) => {
    switch (message.name) {
        case "popup_display_submit":
            document.querySelectorAll(".login-error")[0].style.display = 'block';
            document.querySelectorAll(".login__input__login__label")[0].style.color = '#e53b5b';
            document.querySelectorAll(".login__input__password__label")[0].style.color = '#e53b5b';
            document.querySelectorAll(".login__input__login")[0].style.borderColor = "#e53b5b";
            document.querySelectorAll(".login__input__login")[0].style.color = "#e53b5b";
            document.querySelectorAll(".login__input__password")[0].style.borderColor = "#e53b5b";
            document.querySelectorAll(".login__input__password")[0].style.color = "#e53b5b";
            document.querySelectorAll(".login__input__submit")[0].style.marginTop = "33px";
            break;
        case "popup_previous":
            location.href="../html/welcome.html";
            break;
    }
});

document.querySelectorAll(".login__input__register")[0]
    .addEventListener("click", function () {
        chrome.runtime.sendMessage("close-popup");
    });

document.querySelectorAll(".login__input__lost-password")[0]
    .addEventListener("click", function () {
        chrome.runtime.sendMessage("close-popup");
    });
