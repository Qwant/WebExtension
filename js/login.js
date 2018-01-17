"use strict";

var hideSubmit = function () {
    var loginDiv = document.querySelectorAll(".login")[0];
    var submitButton = document.querySelectorAll(".login__input__submit")[0];
    var loader = document.querySelectorAll(".login__input__loader")[0];

    loader.style.display = "block";
    submitButton.style.display = "none";

};
var displaySubmit = function () {
    var loginDiv = document.querySelectorAll(".login")[0];
    var submitButton = document.querySelectorAll(".login__input__submit")[0];
    var loader = document.querySelectorAll(".login__input__loader")[0];

    loader.style.display = "none";
    submitButton.style.display = "block";
};

var formValidation = function (event) {
    event.preventDefault();
    if (event.key && event.key != "Enter") return;

    var username = document.querySelectorAll(".login__input__login")[0].value;
    var password = document.querySelectorAll(".login__input__password")[0].value;

    document.querySelectorAll(".login-error")[0].style.display = 'none';
    hideSubmit();
    chrome.runtime.sendMessage({name: "do_login", username: username, password: password});
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
            displaySubmit();
            document.querySelectorAll(".login-error")[0].style.display = 'block';
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
