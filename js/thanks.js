/**
 * Thanks splash screen
 * @file thanks.js
 * @author Qwant
 */
window.onload = function() {
    var objects = document.getElementsByTagName('*'), i;
    for(i = 0; i < objects.length; i++) {
        if (objects[i].dataset && objects[i].dataset.msg) {
            if (objects[i].nodeName === "INPUT"){
                objects[i].placeholder = chrome.i18n.getMessage(objects[i].dataset.msg);
            } else if (objects[i].nodeName === "IMG"){
                objects[i].src = chrome.i18n.getMessage(objects[i].dataset.msg);
            } else {
                objects[i].innerHTML = chrome.i18n.getMessage(objects[i].dataset.msg);
            }
        }
    }
}

