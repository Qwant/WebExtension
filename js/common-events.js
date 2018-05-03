browser.runtime.sendMessage({name: "popup_loaded"});
//console.log('common events loaded');
browser.runtime.onMessage.addListener((message, sender, callback) => {
    //console.log('common-events:message', message);
    switch (message.name) {
        case "close-popup":
            closePopup(message.timeout);
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
            url: "https://www.qwantjunior.com/?q=" + encodeURIComponent(q) + "&client=ext-firefox-ol",
            active: true
        });
        closePopup();
    }
}

function closeReloadMsg() {
    document.body.style.height = parseInt(document.body.clientHeight - 50) + "px";
    document.querySelectorAll('.reload-msg')[0].style.bottom = '-201px';
    document.querySelectorAll('.overlay')[0].style.opacity = '0';
    setTimeout(function(){
        document.querySelectorAll('.reload-msg')[0].style.display = 'none';
        document.querySelectorAll('.overlay')[0].style.display = 'none';
    }, 500);
}

document.querySelectorAll(".reload-msg--yes")[0]
    .addEventListener('click', function() {
        closeReloadMsg();
        browser.runtime.sendMessage({name: 'reload-tabs'});
    });

document.querySelectorAll(".reload-msg--no")[0]
    .addEventListener('click', function() {
        closeReloadMsg();
    });

if (document.querySelectorAll(".search__bar__form")[0]) {
    document.querySelectorAll(".search__bar__form")[0]
        .addEventListener('submit', function () {
            submitSearchBar();
        });
}

if (document.querySelectorAll(".icon__search__submit")[0]) {
    document.querySelectorAll(".icon__search__submit")[0]
        .addEventListener('click', function () {
            submitSearchBar();
        });
}