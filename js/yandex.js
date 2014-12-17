/**
 * Communication between Qwant Chrome extension and Yandex search engine
 * @file yandex.js
 * @author Qwant
 */
chrome.extension.sendMessage({options: "get"}, function(opt){
    qBed = new QwantEmbed({
        target: '.content__left',
        query: document.getElementsByName('text')[0].value,
        disabledon: '',
        ext: 'ru'
    });

    qBed.init(opt.qwt_embedded_yandex);

    setTimeout(function(){
        qBed.show(opt.qwt_embedded_yandex);
    }, 500);
});