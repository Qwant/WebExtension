"use strict";

var createNote = function (data) {
    return new Promise(function (resolve, reject) {
        data.session_token = user.user.session_token;
        qwant.api(qwant.routes.createNote, data)
            .then(function (resolveApi) {
                    resolve(resolveApi);
                },
                function (rejectApi) {
                    reject(rejectApi);
                });
    });
};

var getNotePreview = function (data) {
    return new Promise(function (resolve, reject) {
        qwant.api(qwant.routes.getNotePreview, data)
            .then(function (resolveApi) {
                    resolve(resolveApi);
                },
                function (rejectApi) {
                    reject(rejectApi);
                });
    });
};

var createBoard = function (data) {
    return new Promise(function (resolve, reject) {
        data.session_token = user.user.session_token;
        data.board_description = "";
        qwant.api(qwant.routes.createBoard, data)
            .then(function (resolveApi) {
                    resolve(resolveApi);
                },
                function (rejectApi) {
                    reject(rejectApi);
                });
    });
};

var boards = {
    createNote: createNote,
    createBoard: createBoard,
    getNotePreview: getNotePreview
};
