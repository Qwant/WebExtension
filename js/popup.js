/**
 * Setup search popup
 * @file popup.js
 * @author Qwant
 */
window.onload = function() {

    $('#qwant_popup_search_input').focus();

    $('#qwant_popup_form').submit(function(){
        search();
    });

    $('#qwant_popup_search_input').on('click', function(){
        document.getElementById('qwant_popup_search_input').value = '';
        $('#qwant_popup_search_input').focus();
    });

    if (localStorage['qwt_last'] != 'false' && localStorage['qwt_save'] == 'true'){
        $("#qwant_popup_search_input").val(localStorage['qwt_last']);
    }

    function search(){
        var input = $("#qwant_popup_search_input").val();
        localStorage['qwt_last'] = input;

        chrome.tabs.create({
            url: "https://www.qwant.com/?q="+encodeURIComponent(input)
        });
    }

    $("#addons").on('click', function(){
        chrome.tabs.create({url: "html/options.html"});
    });

    var objects = document.getElementsByTagName('*'), i;
    for(i = 0; i < objects.length; i++) {
        if (objects[i].dataset && objects[i].dataset.msg) {
            if (objects[i].nodeName === "INPUT"){
                objects[i].placeholder = chrome.i18n.getMessage(objects[i].dataset.msg);
            } else {
                objects[i].innerHTML = chrome.i18n.getMessage(objects[i].dataset.msg);
            }
        }
    }
}

