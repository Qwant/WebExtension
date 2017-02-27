"use strict";

var textElement = document.querySelectorAll(".tracking-protection__content__text")[0];
var textOK = "";
var textKO = "";

var changeTPIcon = function (state) {
    var icon = document.querySelectorAll(".tracking-protection__content__icon")[0];
    if (state === true) {
        icon.classList.remove("icon__tracking-protection--disabled");
        icon.classList.add("icon__tracking-protection--enabled");
    } else {
        icon.classList.remove("icon__tracking-protection--enabled");
        icon.classList.add("icon__tracking-protection--disabled");
    }
};

var changeText = function (state) {
    textElement.textContent = state ? textOK : textKO;
};

document.querySelectorAll(".tracking-protection__content__button")[0]
    .addEventListener("click", function () {
        var checkbox = document.querySelectorAll(".tracking-protection__content__button__checkbox")[0];

        if (checkbox.checked === true) {
            chrome.runtime.sendMessage({name: "tracking_protection_on"});
            changeTPIcon(true);
            changeText(true);
        } else {
            chrome.runtime.sendMessage({name: "tracking_protection_off"});
            changeTPIcon(false);
            changeText(false);
        }
        chrome.runtime.sendMessage({name: "close-popup"});
    });

chrome.runtime.onMessage.addListener((message, sender, callback) => {
    console.log('tracking-protection:message', message);
    switch (message.name) {
        case "tracking_protection_status":
            var checkbox = document.querySelectorAll(".tracking-protection__content__button__checkbox")[0];
            var checkboxElement = document.querySelectorAll(".tracking-protection__content__button")[0];

            textOK = message.text_enabled;
            textKO = message.text_disabled;

            checkboxElement.style.display = "inherit";
            checkbox.checked = message.status;
            changeTPIcon(message.status);
            changeText(message.status);
            break;
    }
});


document.querySelectorAll(".tracking-protection__content__text")[0]
    .addEventListener("click", function () {
        chrome.runtime.sendMessage({name: "close-popup"});
    });
