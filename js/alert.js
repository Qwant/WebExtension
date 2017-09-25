"use strict";

var visible = false;

var SHOW_CLASS = "qwant-alert--visible";

/**
 * Definition of HTMLElements
 */

var body = document.body;
var alert;

var show = function (data) {
    if (!visible) {
        alert.classList.add(SHOW_CLASS);
        visible = true;
        browser.runtime.sendMessage({name: "alert-visible"});
        setTimeout(hide, 30000);
    }
};

var hide = function () {
    if (visible) {
        alert.classList.remove(SHOW_CLASS);
        visible = false;
        browser.runtime.sendMessage({name: "alert-hidden"});
        setTimeout(function () {
            if (body !== undefined) {
                body.removeChild(alert);
            }
        }, 600);
    }
};

function create(data) {
    alert              = document.createElement("div");
    alert.classList.add("qwant-alert");

    var alertContent                = document.createElement("div");

    alertContent.classList.add("qwant-alert__content");
    alertContent.classList.add("qwant-alert__content--" + data.type);

    var icon = document.createElement("span");
    icon.classList.add("qwant-alert__content__icon");
    icon.classList.add("qwant-alert__content__icon--" + data.type);

    var message = document.createElement("span");
    message.classList.add("qwant-alert__content__message");
    message.textContent = data.message;

    if (data.hasLink) {
        var link         = document.createElement("a");
        link.href        = data.url;
        link.target      = "_blank";
        link.textContent = data.linkText;
        message.appendChild(link);
    }

    var closeButton = document.createElement("span");
    closeButton.classList.add("qwant-alert__content__icon");
    closeButton.classList.add("qwant-alert__content__icon--close");
    closeButton.addEventListener("click", hide);

    /**
     * Adding content in the webpage
     */

    if (data.type === "question") {
        message.style.padding = "0 8px";
    } else {
        alertContent.appendChild(icon);
    }
    alertContent.appendChild(message);
    alertContent.appendChild(closeButton);
    alert.appendChild(alertContent);

    if (data.type === "question") {
        var buttonsContainer = document.createElement("div");
        buttonsContainer.classList.add("qwant-alert__content__buttons");

        var yes     = document.createElement("a");
        var spanYes = document.createElement("span");
        yes.classList.add("qwant-alert__content__button");
        yes.classList.add("qwant-alert__content__button--yes");
        yes.href        = "javascript:;";
        yes.textContent = data.yes;
        yes.addEventListener("click", function () {
            browser.runtime.sendMessage({name: "reload-tabs"});
            hide();
        });
        spanYes.classList.add('icon');
        spanYes.classList.add('icon__alert-yes');
        yes.appendChild(spanYes);
        buttonsContainer.appendChild(yes);

        var no     = document.createElement("a");
        var spanNo = document.createElement("span");
        no.classList.add("qwant-alert__content__button");
        no.classList.add("qwant-alert__content__button--no");
        no.href        = "javascript:;";
        no.textContent = data.no;
        no.addEventListener("click", function () {
            browser.runtime.sendMessage({name: "reload-tabs-no"});
            hide();
        });
        spanNo.classList.add('icon');
        spanNo.classList.add('icon__alert-no');

        no.appendChild(spanNo);
        buttonsContainer.appendChild(no);

        alertContent.appendChild(buttonsContainer);
    }

    if (body !== undefined) {
        body.insertBefore(alert, body.firstChild);
    }

    setTimeout(show, 1);
}

browser.runtime.onMessage.addListener((message, sender, callback) => {
    switch (message.name) {
        case "alert-display":
            create(message);
            break;
        case "alert-destroy":
            hide();
            break;
        case "ping":
            callback({name: "pong"});
            break;
    }
});
