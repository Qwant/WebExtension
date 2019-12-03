browser.runtime.sendMessage({name: "popup_loaded"});
browser.runtime.onMessage.addListener((message, sender, callback) => {
    switch (message.name) {
        case "close-popup":
            closePopup(message.timeout ? message.timeout : 10);
            break;
        case "account":
            location.href="../html/account.html";
            break;
    }
});

function closePopup(timeout) {
    setTimeout(function() { window.close(); }, timeout || 10);
}

function submitSearchBar() {
    var q = document.querySelectorAll(".search__bar__input")[0].value;
    if (q !== "") {
        browser.tabs.create({
            url: "https://www.qwant.com/?q=" + encodeURIComponent(q) + "&client=ext-edge-ol",
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
