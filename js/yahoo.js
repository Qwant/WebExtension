/**
 * Communication between Qwant Chrome extension and Yahoo search engine
 * @file yahoo.js
 * @author Qwant
 */
chrome.extension.sendMessage({options: "get"}, function(opt){
    var url = window.location.hostname;
    qBed = new QwantEmbed({
        target: '#left',
        query: document.getElementsByName('p')[0].value,
        disabledon: '',
        ext: url.split('.')[0]
    });

    qBed.init(opt.qwt_embedded_yahoo);
    qBed.show(opt.qwt_embedded_yahoo);
});