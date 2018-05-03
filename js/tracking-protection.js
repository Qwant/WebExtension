"use strict";

var textElement = document.querySelectorAll(".tracking-protection__content__text")[0];
var textOK = "", textKO = "", reloadOK = "", reloadKO = "";


var changeText = function (state) {
    textElement.textContent = state ? textOK : textKO;
    textElement.style.color = state ? '#fff' : '#626466';
    document.querySelectorAll(".reload-title")[0].textContent = state ? reloadOK : reloadKO;
};

var changeStyle = function (state) {
    if (state) {
        document.querySelectorAll(".tracking-protection__content")[0].style.background = 'linear-gradient(to bottom, #48b84d, #30a156)';
        document.querySelectorAll(".tracking-protection__content")[0].style.border     = 'none';
    } else {
        document.querySelectorAll(".tracking-protection__content")[0].style.background = '#f5f5f5';
        document.querySelectorAll(".tracking-protection__content")[0].style.border     = '1px solid #d4d4d4';
    }
};

function onSet(result) {
    if (result) {
      //console.log("Value was updated");
    } else {
      //console.log("Value was not updated");
    }
  }

document.querySelectorAll(".tracking-protection__content__button")[0]
    .addEventListener("click", function () {
        var checkbox = document.querySelectorAll(".tracking-protection__content__button__checkbox")[0];

        var blockDisplay = document.querySelectorAll('.reload-msg')[0].style.display;
        if (!blockDisplay || blockDisplay === 'none') {
            document.body.style.height = parseInt(document.body.clientHeight + 50) + "px";
            document.querySelectorAll('.overlay')[0].style.display = 'block';
            document.querySelectorAll('.reload-msg')[0].style.display = 'block';
            setTimeout(function() {
                document.querySelectorAll('.overlay')[0].style.opacity = '.3';
                document.querySelectorAll('.reload-msg')[0].style.bottom = '0';
            }, 0);
        }

        if (checkbox.checked === true) {
            browser.runtime.sendMessage({name: "tracking_protection_on"});
            changeText(true);
            changeStyle(true);
            var setting = browser.privacy.websites.trackingProtectionMode.set({
                value: "always"
            });
            setting.then(onSet);
        } else {
            browser.runtime.sendMessage({name: "tracking_protection_off"});
            changeText(false);
            changeStyle(false);
            var setting = browser.privacy.websites.trackingProtectionMode.set({
                value: "never"
            });
            setting.then(onSet);
        }
        browser.runtime.sendMessage({name: "close-popup"});
    });

browser.runtime.onMessage.addListener((message, sender, callback) => {
    //console.log('tracking-protection:message', message);
    switch (message.name) {
        case "tracking_protection_status":
            var checkbox = document.querySelectorAll(".tracking-protection__content__button__checkbox")[0];
            var checkboxElement = document.querySelectorAll(".tracking-protection__content__button")[0];

            textOK = message.text_enabled;
            textKO = message.text_disabled;
            reloadOK = message.reload_enabled;
            reloadKO = message.reload_disabled;

            checkboxElement.style.display = "inherit";
            checkbox.checked = message.status;
            changeText(message.status);
            changeStyle(message.status);
            break;
    }
});


document.querySelectorAll(".tracking-protection__content__text")[0]
    .addEventListener("click", function () {
        browser.runtime.sendMessage({name: "close-popup"});
    });
