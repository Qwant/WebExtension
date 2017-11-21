"use strict";

function closePopup(timeout) {
    setTimeout(function() { window.close(); }, timeout || 10);
}

function submitSearchBar() {
    var q = document.querySelectorAll(".search__bar__input")[0].value;
    if (q !== "") {
        browser.tabs.create({
            url: "https://www.qwant.com/?q=" + encodeURIComponent(q) + "&client=ext-firefox-light-ol",
            active: true
        });
        closePopup();
    }
}

document.querySelectorAll(".search__bar__form")[0]
    .addEventListener('submit', function() {
        submitSearchBar();
    });

document.querySelectorAll(".icon__search__submit")[0]
    .addEventListener('click', function() {
        submitSearchBar();
    });