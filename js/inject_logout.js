if (window.applicationState.user.isLogged) {
    if (window.location.href.match(/^https:\/\/boards\.qwant\.com/)) {
        window.CrossDomainStore.remove('user');
        window.CrossDomainStore.remove('userExtension');
    } else {
        localStorage.removeItem('user');
        localStorage.removeItem('userExtension');
    }
    document.dispatchEvent(new CustomEvent("qwant_extension_logout"));
}