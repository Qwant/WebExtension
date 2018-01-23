var span = document.getElementsByClassName('chrome-ext-vars');
var json = span.length > 0 ? span[0].innerHTML : null;
json = JSON.stringify(JSON.parse(json)['userExtension']);
if (!window.applicationState.user.isLogged) {

    if (window.location.href.match(/^https:\/\/boards\.qwant\.com/)) {
        window.CrossDomainStore.store('userExtension', json);
    } else {
        localStorage.setItem('userExtension', json);
    }
    document.dispatchEvent(new CustomEvent("qwant_extension_login"));
}