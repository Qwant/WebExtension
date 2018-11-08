"use strict";
var browser = chrome;
var element = document.querySelectorAll(".tracking-protection")[0];
var content = document.querySelectorAll(".tracking-protection__content")[0];
var textElement = document.querySelectorAll(".tracking-protection__content__text")[0];
var textOK = "";
var textKO = "";

var changeGradient = function (state) {
    element.style.background = state ? '#0079a8 linear-gradient(288deg, #0079a8, #43cb4b)' : '#e0e1e6 linear-gradient(108deg, #e0e1e6, #c8cbd3)';
};

var changeTPIcon = function (state) {
    content.style.backgroundImage = state ? 'url(../img/svg/shield_enabled.svg)' : 'url(../img/svg/shield_disabled.svg)';
};

var changeText = function (state) {
    textElement.textContent = state ? textOK : textKO;
    textElement.style.color = state ? 'white' : '#353c52';
};

var changeOverlayInfos = function (state) {
    document.querySelectorAll('.reload-msg_img')[0].src = '../img/svg/protection-' + (state ? 'en' : 'dis') + 'abled.svg';
    document.querySelectorAll('.reload-msg_title')[0].textContent = _('tracking_protection_title_' + (state ? 'en' : 'dis') + 'abled');
};

document.querySelectorAll(".tracking-protection__content__button")[0]
    .addEventListener("click", function () {
        var checkbox = document.querySelectorAll(".tracking-protection__content__button__checkbox")[0];

        var blockDisplay = document.querySelectorAll('.reload-msg')[0].style.bottom;
        if (!blockDisplay || !/^0(px)?$/.test(blockDisplay)) {
            document.querySelectorAll('.reload-msg')[0].style.bottom = '0';
        }

        if (checkbox.checked === true) {
            chrome.runtime.sendMessage({name: "tracking_protection_on"});
            changeTPIcon(true);
            changeText(true);
            changeGradient(true);
            changeOverlayInfos(true);
            var setting = browser.privacy.websites.trackingProtectionMode.set({
                value: "always"
            });
        } else {
            chrome.runtime.sendMessage({name: "tracking_protection_off"});
            changeTPIcon(false);
            changeText(false);
            changeGradient(false);
            changeOverlayInfos(false);
            var setting = browser.privacy.websites.trackingProtectionMode.set({
                value: "never"
            });
        }
        chrome.runtime.sendMessage({name: "close-popup"});
    });

chrome.runtime.onMessage.addListener((message, sender, callback) => {
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
            changeGradient(message.status);
            break;
    }
});


document.querySelectorAll(".tracking-protection__content__text")[0]
    .addEventListener("click", function () {
        chrome.runtime.sendMessage({name: "close-popup"});
    });

document.querySelectorAll(".reload-msg--yes")[0]
    .addEventListener('click', function() {
        document.querySelectorAll('.reload-msg')[0].style.bottom = '-100vh';
        browser.runtime.sendMessage({name: 'reload-tabs'});
    });

document.querySelectorAll(".reload-msg--no")[0]
    .addEventListener('click', function() {
        document.querySelectorAll('.reload-msg')[0].style.bottom = '-100vh';
    });
