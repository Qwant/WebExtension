"use strict";
//var config = require("./configuration");

// let {Cc, Ci} = require('chrome');
// var historyService = Cc["@mozilla.org/browser/nav-history-service;1"]
//     .getService(Ci.nsINavHistoryService);
// var bmsvc = Cc["@mozilla.org/browser/nav-bookmarks-service;1"]
//     .getService(Ci.nsINavBookmarksService);
// var _ = require("sdk/l10n").get;
//var bookmarks = require("sdk/places/bookmarks");
//var preferences = require('sdk/simple-prefs');

//var user = require("./user");
//var qwant = require("./qwant");

var qwantGroup;

// browser.bookmarks.search(_("bookmarks.group"), function(nodes) {
//     qwantGroup = nodes[0];
// });

/**
 * Determines if the "Qwant" bookmark folder exists in the user's bookmark menu.
 * @return {boolean}
 */
function qwantGroupExists() {
    return new Promise(function(resolve, reject) {
        browser.bookmarks.search(_("bookmarks_group"), function(nodes) {
            //console.log('qwantGroupExists nodes: ', nodes);

            if(nodes.length > 0) {
                qwantGroup = nodes[0];
                resolve(true);
            }
            else {
                resolve(false);
            }
        });
    });


    // try {
    //     var folder = bmsvc.getItemTitle(preferences.prefs.bookmarksGroupId);
    // } catch (error) {
    //     return false;
    // }
    // if (folder === _("bookmarks.group")) {
    //     qwantGroup.id = preferences.prefs.bookmarksGroupId;
    //     return true;
    // }
    // return false;
}
/**
 * Creates the "Qwant" bookmark folder in the user's bookmark menu.
 * @return {Promise}
 */
function setQwantGroup() {
    return new Promise(function(resolve, reject) {
        browser.bookmarks.create({
             title: _("bookmarks_group")
        }, function(result) {
            resolve();
        });
    });

    // preferences.prefs.bookmarksGroupId = bmsvc.createFolder(bmsvc.bookmarksMenuFolder, _("bookmarks.group"), bmsvc.DEFAULT_INDEX);
    // qwantGroup.id = preferences.prefs.bookmarksGroupId;
}

/**
 * Returns the API response for Qwant.com bookmark creation.
 * @param newBookmark
 * @return {Promise}
 */
function setQwantBookmark(newBookmark) {
    //console.log('setQwantBookmark newBookmark: ', newBookmark);
    return qwant.api(qwant.routes.createBookmark, newBookmark);
}
/**
 * Saves all the bookmarks to Firefox' "Qwant" folder.
 * @param newBookmarks
 * @return {Promise}
 */
function setFirefoxBookmarks(newBookmarks) {
    return new Promise(function (resolve, reject) {
        if (newBookmarks.length === 0) {
            resolve(true);
        }

        browser.bookmarks.create(newBookmarks, function(result) {
            resolve(true);
        });

        //
        //     .on("error", function (error) {
        //         reject(false);
        //     });
        // resolve(true);
    });
}

/**
 * Returns the list of the user's bookmarks from Qwant.com
 * @return Promise
 */
function getQwantBookmarks() {
    return user.getBookmarks();
}
/**
 * Gets all bookmarks saved in the Qwant folder.
 * Should always be fulfilled, but the Promise response will contain an empty array if the Group does not exist or if it is empty.
 * @return {Promise}
 */
function getFirefoxBookmarks() {
    return new Promise(function (resolve, reject) {

        browser.bookmarks.get(qwantGroup.id, function(results) {
            resolve(results);
        });

        // bookmarks.search({group: qwantGroup})
        //     .on("end", function (results) {
        //         resolve(results);
        //     })
        //     .on("error", function (error) {
        //         reject(error);
        //     });
    });
}

/**
 * Default templating for the main bookmarks.js functions.
 * The template checks for the 'Qwant" folder existence, creates it if needed then applies the subfonction.
 * @param subFunction
 * @return {Promise}
 */
var bookmarksInit = function (subFunction) {
    return new Promise(function(resolve, reject) {
        qwantGroupExists().then(function(result) {
            if(!result) {
                return setQwantGroup();
            } else {
                return new Promise(function(resolve2, reject2) {
                    resolve2();
                });
            }
        }).then(function(result) {
            return subFunction();
        }).then(function(result) {
            resolve(result);
        }).catch(reject);
    });
};

var bookmarksTest = function() {
    qwantGroupExists(function(result) {
        //console.log('qwantGroupExists:', result);
        if(!result) {
            setQwantGroup(function() {
                qwantGroupExists(function(result2) {
                    //console.log('qwantGroupExists2:', result2);
                });
            });
        }
    });
};


/**
 * Saves a single bookmark to both Qwant and Firefox.
 * This function is useful when user uses the extension to save a bookmark,
 * in order to avoid a full synchronisation of all the bookmarks.
 * @param data
 * @return Promise
 */
var bookmarksSave = function (data) {
    function onQwantGroupExistence() {

        //console.log('user in bookmarks: ', user);
        //console.log('qwantGroup: ', qwantGroup);
        var fxBookmark = {
            title: data.name2,
            url: data.url,
            parentId: qwantGroup.id
        };
        var qwBookmark = {
            session_token: user.user.session_token,
            url: data.url,
            name: data.name2,
            status: 1
        };

        return Promise
            .all([setQwantBookmark(qwBookmark), setFirefoxBookmarks(fxBookmark)]);
    }

    return bookmarksInit(onQwantGroupExistence);
};
/**
 * Gets Qwant and Firefox' bookmarks and adds the diff to Firefox.
 * @return {Promise}
 */
var bookmarksSync = function () {
    function onQwantGroupExistence() {
        return new Promise(function (resolve, reject) {
            var getUnsynchronizedBookmarks = function (qwBookmarks, fxBookmarks) {
                var newBookmarks = [];
                qwBookmarks.forEach(function (qwBookmark) {
                    if (/^https?:\/\/[^\/]+$/.test(qwBookmark.url)) {
                        // when there is only the domain in the url, let's add a trailing slash
                        // because we want that url to match as it is in bookmarks
                        qwBookmark.url += '/';
                    }
                    var flag = false;
                    fxBookmarks.forEach(function (fxBookmark) {
                        if (fxBookmark.url === qwBookmark.url) {
                            flag = true;
                        }
                    });
                    if (flag === false) {
                        //qwBookmark is a new one, we add him to the list
                        newBookmarks.push(bookmarks.Bookmark({
                            title: qwBookmark.name,
                            url: qwBookmark.url,
                            group: qwantGroup
                        }));
                    }
                });
                return newBookmarks;
            };

            Promise
                .all([getQwantBookmarks(), getFirefoxBookmarks()])
                .then(function (values) {
                    var newBookmarks = getUnsynchronizedBookmarks(values[0], values[1]);
                    // let's add the list to Fx
                    resolve(setFirefoxBookmarks(newBookmarks));
                })
                .catch(function (failed) {
                    reject(failed);
                });
        });
    }

    return bookmarksInit(onQwantGroupExistence);
};

var bookmarks = {
    sync: bookmarksSync,
    save: bookmarksSave,
    test: bookmarksTest
};
