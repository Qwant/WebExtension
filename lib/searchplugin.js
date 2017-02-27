"use strict";
var config = require("./configuration");

var simplePrefs = require("sdk/simple-prefs");
var Preferences = require("sdk/preferences/service");

const {Cc, Cu, Ci, Cm} = require("chrome");
const {Services}       = Cu.import("resource://gre/modules/Services.jsm");
const _                = require("sdk/l10n").get;

var setAsDefault = function () {
    if (Services.search.currentEngine.name !== 'Qwant') {
        Services.search.currentEngine = Services.search.getEngineByName('Qwant');
    }
};

var addQwant = function (callback) {
    if (!(Services.search.getEngineByName('Qwant'))) {
        try {
            Services.search.addEngine(
                "https://www.qwant.com/opensearch-ff.xml",
                1,
                config.FAVICON_BASE_64,
                false,
                {
                    onSuccess: function (engine) {
                        if (Preferences.get(config.SEARCH_SUGGEST) !== true) {
                            simplePrefs.prefs['SearchSuggest_initial'] = false;
                            Preferences.set(config.SEARCH_SUGGEST, true);
                        }
                        if (callback) {
                            callback();
                        }
                    },
                    onError  : function (errorCode) {
                    }
                }
            );
        }
        catch (e) {
        }
    }
};

var removeQwant = function () {
    var qwant = Services.search.getEngineByName('Qwant');
    if (qwant) {
        Services.search.removeEngine(qwant);
    }
    if (simplePrefs.prefs['SearchSuggest_initial'] !== undefined) {
        Preferences.set(config.SEARCH_SUGGEST, simplePrefs.prefs['SearchSuggest_initial']);
    }
};

var resetSearchEngine = function () {
    var qwant = Services.search.getEngineByName('Qwant');
    if (qwant && qwant.hidden) {
        qwant.hidden = false;
        setAsDefault();
    }
};

module.exports = {
    setAsDefault     : setAsDefault,
    addQwant         : addQwant,
    removeQwant      : removeQwant,
    resetSearchEngine: resetSearchEngine
};
