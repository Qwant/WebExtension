/**
 * Communication between Qwant Chrome extension and Mail.ru search engine
 * @file mailru.js
 * @author Qwant
 */
chrome.extension.sendMessage({options: "get"}, function(opt){
    qBed = new QwantEmbed({
        target: '.responses__wrapper',
        query: document.getElementsByName('q')[0].value,
        disabledon: '',
        ext: 'ru'
    });

    qBed.init(opt.qwt_embedded_mail);
    qBed.show(opt.qwt_embedded_mail);
});