/**
 * Setup events
 * @file: options.js
 * @author Qwant
 */
window.onload = function() {
    $("#embedded_google").on('click', function(){
        localStorage['qwt_embedded_google'] = document.getElementById('embedded_google').checked;
    });

    $("#embedded_bing").on('click', function(){
        localStorage['qwt_embedded_bing'] = document.getElementById('embedded_bing').checked;
    });

    $("#embedded_yahoo").on('click', function(){
        localStorage['qwt_embedded_yahoo'] = document.getElementById('embedded_yahoo').checked;
    });

    $("#embedded_yandex").on('click', function(){
        localStorage['qwt_embedded_yandex'] = document.getElementById('embedded_yandex').checked;
    });

    $("#embedded_mail").on('click', function(){
        localStorage['qwt_embedded_mail'] = document.getElementById('embedded_mail').checked;
    });

    $("#embedded_baidu").on('click', function(){
        localStorage['qwt_embedded_baidu'] = document.getElementById('embedded_baidu').checked;
    });

    $("#save").on('click', function(){
        localStorage['qwt_save'] = document.getElementById('save').checked;
    });

    if (localStorage['qwt_embedded_google'] == 'true'){
        document.getElementById('embedded_google').checked = true;
    }

    if (localStorage['qwt_embedded_bing'] == 'true'){
        document.getElementById('embedded_bing').checked = true;
    }

    if (localStorage['qwt_embedded_yahoo'] == 'true'){
        document.getElementById('embedded_yahoo').checked = true;
    }

    if (localStorage['qwt_embedded_yandex'] == 'true'){
        document.getElementById('embedded_yandex').checked = true;
    }

    if (localStorage['qwt_embedded_mail'] == 'true'){
        document.getElementById('embedded_mail').checked = true;
    }

    if (localStorage['qwt_embedded_baidu'] == 'true'){
        document.getElementById('embedded_baidu').checked = true;
    }

    if (localStorage['qwt_save'] == 'true'){
        document.getElementById('save').checked = true;
    }

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

