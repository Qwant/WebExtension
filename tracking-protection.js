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
            trackingProtectionOn();
            changeTPIcon(true);
            changeText(true);
        } else {
            trackingProtectionOff();
            changeTPIcon(false);
            changeText(false);
        }
        closePopup(500);
    });

function trackingProtectionStatus(data) {
    var checkbox = document.querySelectorAll(".tracking-protection__content__button__checkbox")[0];
    var checkboxElement = document.querySelectorAll(".tracking-protection__content__button")[0];

    textOK = data.text_enabled;
    textKO = data.text_disabled;

    checkboxElement.style.display = "inherit";
    checkbox.checked = data.status;
    changeTPIcon(data.status);
    changeText(data.status);

    if(data.status) trackingProtectionOn();
    else trackingProtectionOff();
}

function trackingProtectionOn () {
    privacyEnable(true);
    browser.browserAction.setIcon({ path: '../img/q2-48.png' });
}

function trackingProtectionOff () {
    privacyDisable();
    browser.browserAction.setIcon({ path: '../img/q1-48.png' });
}

document.querySelectorAll(".tracking-protection__content__text")[0]
    .addEventListener("click", function () {
        closePopup();
    });
