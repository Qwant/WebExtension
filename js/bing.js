/**
 * Communication between Qwant Chrome extension and Bing search engine
 * @file bing.js
 * @author Qwant
 */
chrome.extension.sendMessage({options: "get"}, function(opt){
    qBed = new QwantEmbed({
        target: '#b_context',
        query: document.getElementsByName('q')[0].value,
        disabledon: '',
        ext: 'com'
    });

    qBed.init(opt.qwt_embedded_bing);
    qBed.show(opt.qwt_embedded_bing);
});