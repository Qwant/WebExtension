/**
 * Communication between Qwant Chrome extension and Google search engine
 * @file google.js
 * @author Qwant
 */
chrome.extension.sendMessage({options: "get"}, function(opt){
    var url = window.location.hostname;
    var qwt_timer;

    qBed = new QwantEmbed({
        target: '#rhs',
        query: document.getElementsByName('q')[0].value,
        disabledon: 'tbm=',
        ext: url.split('.').pop()
    });

    qBed.init(opt.qwt_embedded_google);

    $(document).on('click', '.sbqs_c', function(){
        qBed.query = $(this).text();
        if (qBed.query != ""){
            qBed.show(opt.qwt_embedded_google);
        }
    });

    $('[name="q"]').keyup(function(e){
        clearTimeout(qwt_timer);
        qwt_timer = setTimeout(function(){
            qBed.query = document.getElementsByName('q')[0].value;
            if (qBed.query != ""){
                qBed.show(opt.qwt_embedded_google);
            }
        }, 700);
    });

    qBed.show(opt.qwt_embedded_google);

});