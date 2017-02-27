"use strict";

var extensionInstalled = true;

unsafeWindow.extensionInstalled = cloneInto(extensionInstalled, unsafeWindow);

document.addEventListener("qwant_website_login", function () {
    self.port.emit("qwant_website_login");
});

document.addEventListener("qwant_website_logout", function () {
    self.port.emit("qwant_website_logout");
});

document.addEventListener("qwant_extension_forced_logout", function () {
    self.port.emit("qwant_extension_forced_logout");
});

document.addEventListener("qwant_website_bookmark_created", function () {
    self.port.emit("qwant_website_bookmark_created");
});

document.addEventListener("qwant_website_bookmark_deleted", function () {
    self.port.emit("qwant_website_bookmark_deleted");
});

document.addEventListener("qwant_website_open_extension", function () {
    self.port.emit("qwant_website_open_extension");
});

document.addEventListener("qwant_website_is_tp_enabled", function () {
    self.port.emit("qwant_website_is_tp_enabled");
});

document.addEventListener("qwant_website_tp_on", function () {
    self.port.emit("qwant_website_tp_on");
});

document.addEventListener("qwant_website_tp_off", function () {
    self.port.emit("qwant_website_tp_off");
});

self.port.on("qwant_extension_login", function () {
    document.dispatchEvent(new CustomEvent("qwant_extension_login"));
});

self.port.on("qwant_extension_logout", function () {
    document.dispatchEvent(new CustomEvent("qwant_extension_logout"));
});

self.port.on("qwant_extension_tp_status", function (data) {
    if (data === true) {
        document.dispatchEvent(new CustomEvent("qwant_extension_tp_enabled"));
    } else {
        document.dispatchEvent(new CustomEvent("qwant_extension_tp_disabled"));
    }

});