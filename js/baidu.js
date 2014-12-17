/**
 * Communication between Qwant Chrome extension and Baidu search engine
 * @file baidu.js
 * @author Qwant
 */
chrome.extension.sendMessage({options: "get"}, function (opt) {
    var qwt_timer;

    qBed = new QwantEmbed({
        target: '#content_left',
        query: document.getElementsByName('wd')[0].value,
        disabledon: '',
        ext: 'zh'
    });

    qBed.init(opt.qwt_embedded_baidu);

    $('form#form').submit(function(){
        clearTimeout(qwt_timer);
        qwt_timer = setTimeout(function(){
            qBed.query = document.getElementsByName('wd')[0].value;
            if (qBed.query != ""){
                qBed.show(opt.qwt_embedded_baidu);
            }
        }, 700);
    });

    qBed.show(opt.qwt_embedded_baidu);
});