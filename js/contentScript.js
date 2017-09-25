"use strict";

var alertVisible = false;
var panelBookmarkVisible = false;
var panelNoteVisible = false;

var ALERT_SHOW_CLASS = "qwant-alert--visible";
var PANEL_SHOW_CLASS = "qwant-panel--visible";

var NO_PANEL = "no-panel";
var NOTE_PANEL = "note-panel";
var ADVANCED_PANEL = "advanced-panel";
var BOARD_PANEL = "board-panel";

var currentPanel = NO_PANEL;

var currentBoard = null;
var noteData = null;
var advancedNoteData = null;

/**
 * Definition of HTMLElements
 */

var body = document.body;
var alert, overlay, panel, panelContent, loader, panelCloseButton, cancelButton, submitButton, panelNameInput, panelURLInput, generator;

var timeoutAlert;

var showAlert = function () {
    if (!alertVisible) {
        alert.classList.add(ALERT_SHOW_CLASS);
        alertVisible = true;
        browser.runtime.sendMessage({name: "alert-visible"});
        timeoutAlert = setTimeout(hideAlert, 30000);
    }
};
var hideAlert = function () {
    console.log('hideAlert---');
    if(timeoutAlert) clearTimeout(timeoutAlert);

    if (alertVisible) {
        alert.classList.remove(ALERT_SHOW_CLASS);
        alertVisible = false;
        browser.runtime.sendMessage({name: "alert-hidden"});
        //setTimeout(function () {
            if (body !== undefined) {
                body.removeChild(alert);
            }
        //}, 600);
    }
};

var showPanelBookmark = function () {
    if (!panelBookmarkVisible && body !== undefined) {
        body.insertBefore(overlay, body.firstChild);
        body.style.overflow = "hidden";
        panel.style.display = "block";
        setTimeout(function () {
            panel.classList.add(PANEL_SHOW_CLASS);
        }, 10);
        panelBookmarkVisible = true;
        browser.runtime.sendMessage({name: "panel-visible"});
    }
};
var hidePanelBookmark = function () {
    if (panelBookmarkVisible) {
        panel.classList.remove(PANEL_SHOW_CLASS);
        //setTimeout(function () {
        if (body !== undefined) {
            panel.style.display = "none";
            panelBookmarkVisible = false;
            browser.runtime.sendMessage({name: "panel-hidden"});
            body.removeChild(overlay);
            body.style.overflow = "auto";
            while (overlay.hasChildNodes()) {
                overlay.removeChild(overlay.lastChild);
            }
        }
        //}, 300);
    }
};

var showPanelNote = function () {
    if (!panelNoteVisible && body !== undefined) {
        body.insertBefore(overlay, body.firstChild);
        body.style.overflow = "hidden";
        panel.style.display = "block";
        setTimeout(function () {
            panel.classList.add(PANEL_SHOW_CLASS);
        }, 10);
        panelNoteVisible = true;
        browser.runtime.sendMessage({name: "panel-visible"});
    }
};
var hidePanelNote = function () {
    if (panelNoteVisible) {
        panel.classList.remove(PANEL_SHOW_CLASS);
        currentPanel = NO_PANEL;
        //setTimeout(function () {
        if (body !== undefined) {
            panel.style.display = "none";
            panelNoteVisible = false;
            browser.runtime.sendMessage({name: "panel-hidden"});
            body.removeChild(overlay);
            body.style.overflow = "auto";
            while (overlay.hasChildNodes()) {
                overlay.removeChild(overlay.lastChild);
            }
        }
        //}, 300);
    }
}

function createAlert(data) {
    hideAlert();

    alert              = document.createElement("div");
    alert.classList.add("qwant-alert");

    var alertContent                = document.createElement("div");

    alertContent.classList.add("qwant-alert__content");
    alertContent.classList.add("qwant-alert__content--" + data.type);

    var icon = document.createElement("span");
    icon.classList.add("qwant-alert__content__icon");
    icon.classList.add("qwant-alert__content__icon--" + data.type);

    var message = document.createElement("span");
    message.classList.add("qwant-alert__content__message");
    message.textContent = data.message;

    if (data.hasLink) {
        var link         = document.createElement("a");
        link.href        = data.url;
        link.target      = "_blank";
        link.textContent = data.linkText;
        message.appendChild(link);
    }

    var closeButton = document.createElement("span");
    closeButton.classList.add("qwant-alert__content__icon");
    closeButton.classList.add("qwant-alert__content__icon--close");
    closeButton.addEventListener("click", hideAlert);

    /**
     * Adding content in the webpage
     */

    if (data.type === "question") {
        message.style.padding = "0 8px";
    } else {
        alertContent.appendChild(icon);
    }
    alertContent.appendChild(message);
    alertContent.appendChild(closeButton);
    alert.appendChild(alertContent);

    if (data.type === "question") {
        var buttonsContainer = document.createElement("div");
        buttonsContainer.classList.add("qwant-alert__content__buttons");

        var yes     = document.createElement("a");
        var spanYes = document.createElement("span");
        yes.classList.add("qwant-alert__content__button");
        yes.classList.add("qwant-alert__content__button--yes");
        yes.href        = "javascript:;";
        yes.textContent = data.yes;
        yes.addEventListener("click", function () {
            browser.runtime.sendMessage({name: "reload-tabs"});
            hideAlert();
        });
        spanYes.classList.add('icon');
        spanYes.classList.add('icon__alert-yes');
        yes.appendChild(spanYes);
        buttonsContainer.appendChild(yes);

        var no     = document.createElement("a");
        var spanNo = document.createElement("span");
        no.classList.add("qwant-alert__content__button");
        no.classList.add("qwant-alert__content__button--no");
        no.href        = "javascript:;";
        no.textContent = data.no;
        no.addEventListener("click", function () {
            browser.runtime.sendMessage({name: "reload-tabs-no"});
            hideAlert();
        });
        spanNo.classList.add('icon');
        spanNo.classList.add('icon__alert-no');

        no.appendChild(spanNo);
        buttonsContainer.appendChild(no);

        alertContent.appendChild(buttonsContainer);
    }

    if (body !== undefined) {
        body.insertBefore(alert, body.firstChild);
    }

    setTimeout(showAlert, 10);
}

function createPanelBookmark (data) {
    if(!panelBookmarkVisible) {
        hidePanelNote();

        console.log('panel-bookmark-create');

        overlay = document.createElement("div");
        overlay.classList.add("qwant-overlay");

        panel = document.createElement("div");
        panel.classList.add("qwant-panel");
        panel.addEventListener("click", function (e) {
            e.stopPropagation();
        });

        panelContent = document.createElement("div");
        panelContent.classList.add("qwant-panel__content");

        var panelTitle = document.createElement("h2");
        panelTitle.classList.add("qwant-panel__content__title");
        panelTitle.textContent = data.title;

        panelCloseButton = document.createElement("span");
        panelCloseButton.classList.add("qwant-panel__content__close--button");
        panelCloseButton.classList.add("icon");
        panelCloseButton.classList.add("icon-close");

        var panelURLLabel = document.createElement("p");
        panelURLLabel.textContent = data.urlLabel;
        panelURLLabel.classList.add("qwant-panel__content__label");
        panelURLLabel.classList.add("qwant-panel__content__label--url");

        panelURLInput = document.createElement("input");
        panelURLInput.type = "text";
        panelURLInput.value = data.url;
        panelURLInput.required = true;
        panelURLInput.classList.add("qwant-panel__content__input");
        panelURLInput.classList.add("qwant-panel__content__input--url");

        var panelNameLabel = document.createElement("p");
        panelNameLabel.textContent = data.nameLabel;
        panelNameLabel.classList.add("qwant-panel__content__label");
        panelNameLabel.classList.add("qwant-panel__content__label--name");

        panelNameInput = document.createElement("input");
        panelNameInput.value = data.name2;
        panelNameInput.required = true;
        panelNameInput.classList.add("qwant-panel__content__input");
        panelNameInput.classList.add("qwant-panel__content__input--name");

        loader = document.createElement("span");
        loader.classList.add("icon");
        loader.classList.add("icon-loading");
        loader.style.display = "none";

        cancelButton = document.createElement("a");
        cancelButton.href = "javascript:;";
        cancelButton.classList.add("qwant-panel__button");
        cancelButton.classList.add("qwant-panel__button--cancel");
        cancelButton.textContent = data.cancel;

        submitButton = document.createElement("a");
        submitButton.href = "javascript:;";
        submitButton.classList.add("qwant-panel__button");
        submitButton.classList.add("qwant-panel__button--submit");
        submitButton.textContent = data.submit;

        var poweredBy = document.createElement("a");
        poweredBy.href = "https://www.qwant.com";
        poweredBy.target = "_blank";
        poweredBy.classList.add("qwant-panel__powered-by");
        poweredBy.classList.add("icon");
        poweredBy.classList.add("icon-powered");

        panelContent.appendChild(panelTitle);
        panelContent.appendChild(panelCloseButton);
        panelContent.appendChild(panelURLLabel);
        panelContent.appendChild(panelURLInput);
        panelContent.appendChild(panelNameLabel);
        panelContent.appendChild(panelNameInput);
        panelContent.appendChild(loader);
        panelContent.appendChild(cancelButton);
        panelContent.appendChild(submitButton);
        panelContent.appendChild(poweredBy);

        panel.appendChild(panelContent);

        overlay.appendChild(panel);

        panelCloseButton.addEventListener("click", function () {
            hidePanelBookmark();
        });

        cancelButton.addEventListener("click", function () {
            hidePanelBookmark();
        });

        submitButton.addEventListener("click", function () {
            loader.style.display = "block";
            cancelButton.style.display = "none";
            submitButton.style.display = "none";

            if (panelNameInput.value !== "") {
                browser.runtime.sendMessage({name: "panel-bookmark-submit", name2: panelNameInput.value, url: panelURLInput.value});
            }
        });

        setTimeout(showPanelBookmark, 10);
    }
}

/**
 * Changes the content of the panel and links the events
 * @param newState
 */
function changeState(newState, data) {
    if (currentPanel !== newState) {
        panel.classList.remove("qwant-panel--" + currentPanel);
        panel.removeChild(panelContent);
        while (panelContent.hasChildNodes()) {
            panelContent.removeChild(panelContent.lastChild);
        }
        generator[newState](data)
            .then(function (resolveContent) {
                panel.appendChild(resolveContent);
                currentPanel = newState;
            });
    }
}

function createPanelNote (data) {
    if(!panelNoteVisible) {
        hidePanelBookmark();

        console.log('creatingPanelNote...');

        noteData = data;

        overlay = document.createElement("div");
        panel = document.createElement("div");
        panelContent = document.createElement("div");

        generator = {
            "note-panel": notePanelGenerator,
            "advanced-panel": advancedPanelGenerator,
            "board-panel": boardPanelGenerator
        };

        if (data.userBoards.length > 0) {
            currentBoard = data.userBoards[0].board_name;
        }

        overlay.classList.add("qwant-overlay");
        panel.classList.add("qwant-panel");
        panelContent.classList.add("qwant-panel__content");

        overlay.appendChild(panel);
        panel.appendChild(panelContent);
        panel.addEventListener("click", function (e) {
            e.stopPropagation();
        });

        overlay.addEventListener("click", function () {
            hidePanelNote();
        });

        /**
         * On NOTE_PANEL, selects the clicked board and unselects the previous one.
         * @param event
         */
        function selectBoard(event) {
            document.querySelectorAll(".qwant-panel__boards-container__element--active")[0]
                .classList.remove("qwant-panel__boards-container__element--active");
            event.target.classList.add("qwant-panel__boards-container__element--active");
            currentBoard = event.target.textContent;
        }

        /**
         * On ADVANCED_PANEL, selects the clicked image and unselects the previous one.
         * @param event
         */
        function selectAdvancedImage(event) {
            document.querySelectorAll(".qwant-panel__content__img-container__element--active")[0]
                .classList.remove("qwant-panel__content__img-container__element--active");
            event.target.classList.add("qwant-panel__content__img-container__element--active");
        }

        /**
         * Generates the NodeElements used by the 3 panels types.
         * @param panelType
         * @returns {{panelTitle: Element, panelCloseButton: Element, cancelButton: Element, submitButton: Element, poweredBy: Element}}
         */
        function commonElementsGenerator(panelType) {
            return new Promise(function (resolve, reject) {
                panel.classList.add("qwant-panel--" + panelType);

                var panelTitle = document.createElement("h2");
                panelTitle.classList.add("qwant-panel__content__title");
                panelTitle.textContent = data.noteTitle;

                var panelCloseButton = document.createElement("span");
                panelCloseButton.classList.add("qwant-panel__content__close--button");
                panelCloseButton.classList.add("icon");
                panelCloseButton.classList.add("icon-close");
                panelCloseButton.addEventListener("click", function () {
                    hidePanelNote();
                });

                var cancelButton = document.createElement("a");
                cancelButton.href = "javascript:;";
                cancelButton.classList.add("qwant-panel__button");
                cancelButton.classList.add("qwant-panel__button--cancel");
                cancelButton.textContent = data.cancel;

                var submitButton = document.createElement("a");
                submitButton.href = "javascript:;";
                submitButton.classList.add("qwant-panel__button");
                submitButton.classList.add("qwant-panel__button--submit");
                submitButton.textContent = data.submit;

                var advancedButton = document.createElement("a");
                advancedButton.href = "javascript:;";
                advancedButton.classList.add("qwant-panel__button");
                advancedButton.classList.add("qwant-panel__button--advanced");
                advancedButton.textContent = data.advanced;

                loader = document.createElement("span");
                loader.classList.add("icon");
                loader.classList.add("icon-loading");
                loader.style.display = "none";

                var poweredBy = document.createElement("a");
                poweredBy.href = "https://www.qwant.com";
                poweredBy.target = "_blank";
                poweredBy.classList.add("qwant-panel__powered-by");
                poweredBy.classList.add("icon");
                poweredBy.classList.add("icon-powered");

                resolve({
                    panelTitle: panelTitle,
                    panelCloseButton: panelCloseButton,
                    cancelButton: cancelButton,
                    submitButton: submitButton,
                    advancedButton: advancedButton,
                    loader: loader,
                    poweredBy: poweredBy
                });
            });

        }

        /**
         * Generates the Note creation panel
         * @returns {Element}
         */
        function notePanelGenerator(data) {
            return new Promise(function (resolve) {
                commonElementsGenerator(NOTE_PANEL)
                    .then(function (resolveCommon) {
                        var commonElements = resolveCommon;
                        var panelSubtitle = document.createElement("h3");
                        panelSubtitle.classList.add("qwant-panel__content__subtitle");
                        panelSubtitle.textContent = data.noteSubtitle;

                        var panelBoardsContainer = document.createElement("div");
                        panelBoardsContainer.classList.add("qwant-panel__boards-container");

                        var panelBoardsList = document.createElement("ul");
                        panelBoardsList.classList.add("qwant-panel__boards-container__list");

                        // Adding boards to the list
                        data.userBoards.forEach(function (board, idx) {
                            var panelBoardsElement = document.createElement("li");
                            panelBoardsElement.classList.add("qwant-panel__boards-container__element");
                            panelBoardsElement.id = board.board_id;

                            if (idx === 0) panelBoardsElement.classList.add("qwant-panel__boards-container__element--active");

                            var panelBoardsElementThumbContainer = document.createElement("div");
                            panelBoardsElementThumbContainer.classList.add("qwant-panel__boards-container__element__thumb-container");

                            var panelBoardsElementThumb = document.createElement("img");
                            panelBoardsElementThumb.classList.add("qwant-panel__boards-container__element__thumb-container__img");
                            if (board.previewMediaMini && board.previewMediaMini !== "") {
                                panelBoardsElementThumb.src = "https:" + board.previewMediaMini;
                            } else {
                                panelBoardsElementThumb.src = "https:" + board.board_thumbnail;
                            }

                            var panelBoardsElementName = document.createElement("p");
                            panelBoardsElementName.classList.add("qwant-panel__boards-container__element__name");
                            panelBoardsElementName.textContent = board.board_name;

                            panelBoardsElementThumbContainer.appendChild(panelBoardsElementThumb);
                            panelBoardsElement.appendChild(panelBoardsElementThumbContainer);
                            panelBoardsElement.appendChild(panelBoardsElementName);

                            if (board.board_status === "0") {
                                var panelBoardsElementPrivate = document.createElement("span");
                                panelBoardsElementPrivate.classList.add("icon");
                                panelBoardsElementPrivate.classList.add("icon-private-board");
                                panelBoardsElementPrivate.classList.add("qwant-panel__boards-container__element__thumb-container__private");

                                panelBoardsElement.appendChild(panelBoardsElementPrivate);
                            }

                            panelBoardsElement.addEventListener("click", function (event) {
                                selectBoard(event);
                            });

                            panelBoardsList.appendChild(panelBoardsElement);
                        });

                        var panelCreateBoardButton = document.createElement("a");
                        panelCreateBoardButton.classList.add("qwant-panel__boards-container__board-creator");
                        panelCreateBoardButton.href = "javascript:;";

                        panelCreateBoardButton
                            .addEventListener("click", function () {
                                changeState(BOARD_PANEL, data);
                            });

                        var panelCreateBoardImg = document.createElement("span");
                        panelCreateBoardImg.classList.add("qwant-panel__boards-container__board-creator__icon");
                        panelCreateBoardImg.classList.add("icon");
                        panelCreateBoardImg.classList.add("icon-board-creator");

                        var panelCreateBoardText = document.createElement("span");
                        panelCreateBoardText.classList.add("qwant-panel__boards-container__board-creator__text");
                        panelCreateBoardText.textContent = data.noteCreateBoard;

                        commonElements.cancelButton
                            .addEventListener("click", function () {
                                hidePanelNote();
                                browser.runtime.sendMessage({name: "panel-hidden"});
                            });

                        commonElements.submitButton
                            .addEventListener("click", function () {
                                commonElements.cancelButton.style.display = "none";
                                commonElements.submitButton.style.display = "none";
                                commonElements.advancedButton.style.display = "none";
                                commonElements.loader.style.display = "block";

                                browser.runtime.sendMessage({name: "panel-note-submit-simple",
                                    board_id: document.querySelectorAll(".qwant-panel__boards-container__element--active")[0].id
                                });
                            });

                        commonElements.advancedButton
                            .addEventListener("click", function () {
                                var cancel = document.querySelectorAll(".qwant-panel__button--cancel")[0];
                                var submit = document.querySelectorAll(".qwant-panel__button--submit")[0];
                                var advanced = document.querySelectorAll(".qwant-panel__button--advanced")[0];
                                loader = document.querySelectorAll(".icon-loading")[0];

                                if (cancel) cancel.style.display = "none";
                                if (submit)    submit.style.display = "none";
                                if (advanced) advanced.style.display = "none";
                                if (loader)    loader.style.display = "block";
                                browser.runtime.sendMessage({name: "panel-advanced"});
                                //changeState(ADVANCED_PANEL, data);
                            });

                        panelContent.appendChild(commonElements.panelTitle);
                        panelContent.appendChild(commonElements.panelCloseButton);
                        panelContent.appendChild(panelSubtitle);
                        panelBoardsContainer.appendChild(panelBoardsList);
                        panelContent.appendChild(panelBoardsContainer);
                        panelCreateBoardButton.appendChild(panelCreateBoardImg);
                        panelCreateBoardButton.appendChild(panelCreateBoardText);
                        panelContent.appendChild(panelCreateBoardButton);
                        panelContent.appendChild(commonElements.loader);
                        panelContent.appendChild(commonElements.cancelButton);
                        panelContent.appendChild(commonElements.submitButton);
                        panelContent.appendChild(commonElements.advancedButton);
                        panelContent.appendChild(commonElements.poweredBy);

                        resolve(panelContent);
                    });
            });
        }

        function advancedPanelGenerator(data) {
            return new Promise(function (resolve, reject) {
                commonElementsGenerator(ADVANCED_PANEL)
                    .then(function (resolveCommon) {
                        var commonElements = resolveCommon;

                        var panelSubtitle = document.createElement("h3");
                        panelSubtitle.classList.add("qwant-panel__content__subtitle");
                        panelSubtitle.textContent = data.advancedSubtitle;

                        var panelBoardLabel = document.createElement("p");
                        panelBoardLabel.textContent = data.advancedBoard;
                        panelBoardLabel.classList.add("qwant-panel__content__label");
                        panelBoardLabel.classList.add("qwant-panel__content__label--board");

                        var panelBoardInput = document.createElement("input");
                        panelBoardInput.type = "text";
                        panelBoardInput.required = true;
                        panelBoardInput.disabled = true;
                        panelBoardInput.value = currentBoard;
                        panelBoardInput.classList.add("qwant-panel__content__input");
                        panelBoardInput.classList.add("qwant-panel__content__input--board");

                        var panelURLLabel = document.createElement("p");
                        panelURLLabel.textContent = "URL:";
                        panelURLLabel.classList.add("qwant-panel__content__label");
                        panelURLLabel.classList.add("qwant-panel__content__label--url");

                        var panelURLInput = document.createElement("input");
                        panelURLInput.type = "text";
                        panelURLInput.required = true;
                        panelURLInput.disabled = true;
                        panelURLInput.value = document.URL;
                        panelURLInput.classList.add("qwant-panel__content__input");
                        panelURLInput.classList.add("qwant-panel__content__input--url");

                        var panelImgLabel = document.createElement("p");
                        panelImgLabel.textContent = data.advancedImage;
                        panelImgLabel.classList.add("qwant-panel__content__label");
                        panelImgLabel.classList.add("qwant-panel__content__label--image");

                        var panelImgContainer = document.createElement("div");
                        panelImgContainer.classList.add("qwant-panel__content__img-container");

                        var panelEmptyImg = document.createElement("span");
                        panelEmptyImg.classList.add("qwant-panel__content__img-container__empty-img");
                        panelEmptyImg.classList.add("qwant-panel__content__img-container__element");
                        panelEmptyImg.classList.add("qwant-panel__content__img-container__element--active");
                        panelEmptyImg.textContent = data.advancedEmptyImage;
                        panelEmptyImg.addEventListener("click", function (event) {
                            selectAdvancedImage(event);
                        });

                        panelImgContainer.appendChild(panelEmptyImg);

                        if (advancedNoteData.images && advancedNoteData.images.length > 0) {
                            advancedNoteData.images.forEach(function (image, idx) {
                                var panelImg = document.createElement("span");
                                panelImg.classList.add("qwant-panel__content__img-container__element");

                                var panelImgContent = document.createElement("img");
                                panelImgContent.src = image.thumbnailMini;
                                panelImgContent.classList.add("qwant-panel__content__img-container__element__content")

                                panelImg.addEventListener("click", function (event) {
                                    selectAdvancedImage(event);
                                });

                                panelImg.appendChild(panelImgContent);
                                panelImgContainer.appendChild(panelImg);
                            });
                        }

                        var panelTitleLabel = document.createElement("p");
                        panelTitleLabel.textContent = data.advancedTitle;
                        panelTitleLabel.classList.add("qwant-panel__content__label");
                        panelTitleLabel.classList.add("qwant-panel__content__label--title");

                        var panelTitleInput = document.createElement("input");
                        panelTitleInput.type = "text";
                        panelTitleInput.value = advancedNoteData.title;
                        panelTitleInput.classList.add("qwant-panel__content__input");
                        panelTitleInput.classList.add("qwant-panel__content__input--title");

                        var panelContentLabel = document.createElement("p");
                        panelContentLabel.textContent = data.advancedContent;
                        panelContentLabel.classList.add("qwant-panel__content__label");
                        panelContentLabel.classList.add("qwant-panel__content__label--content");

                        var panelContentInput = document.createElement("textarea");
                        panelContentInput.value = advancedNoteData.description;
                        panelContentInput.classList.add("qwant-panel__content__input");
                        panelContentInput.classList.add("qwant-panel__content__input--content");

                        commonElements.cancelButton
                            .addEventListener("click", function () {
                                changeState(NOTE_PANEL, data);
                            });
                        commonElements.submitButton
                            .addEventListener("click", function () {
                                // Hide the buttons and display the loader
                                var cancel = document.querySelectorAll(".qwant-panel__button--cancel")[0];
                                var submit = document.querySelectorAll(".qwant-panel__button--submit")[0];
                                var loader = document.querySelectorAll(".icon-loading")[0];

                                if (cancel) cancel.style.display = "none";
                                if (submit)    submit.style.display = "none";
                                if (loader)    loader.style.display = "block";

                                // Let's create the data object, as it may not contain all the params
                                var data2 = {
                                    title: document.querySelectorAll(".qwant-panel__content__input--title")[0].value,
                                    description: document.querySelectorAll(".qwant-panel__content__input--content")[0].value,
                                    type: advancedNoteData.type,
                                    url: document.URL
                                };

                                // Get the board ID
                                var chosenBoard = document.querySelectorAll(".qwant-panel__content__input--board")[0];
                                data.userBoards.forEach(function (board) {
                                    if (board.board_name === chosenBoard.value) {
                                        data2.board_id = board.board_id;
                                    }
                                });

                                // Get the chosen picture if there is one
                                var chosenImg = document.querySelectorAll(".qwant-panel__content__img-container__element--active")[0] || null;
                                if (chosenImg !== null) {
                                    advancedNoteData.images.forEach(function (image) {
                                        if (image.src === chosenImg.src) {
                                            data2.image_src = image.src;
                                            data2.image_key = image.key;
                                        }
                                    });
                                }

                                // Let's send the data to the
                                data2.name = "panel-advanced-submit";
                                browser.runtime.sendMessage(data2);
                            });

                        panelContent.appendChild(commonElements.panelTitle);
                        panelContent.appendChild(commonElements.panelCloseButton);
                        panelContent.appendChild(panelSubtitle);
                        panelContent.appendChild(panelBoardLabel);
                        panelContent.appendChild(panelBoardInput);
                        panelContent.appendChild(panelURLLabel);
                        panelContent.appendChild(panelURLInput);
                        panelContent.appendChild(panelImgLabel);
                        panelContent.appendChild(panelImgContainer);
                        panelContent.appendChild(panelTitleLabel);
                        panelContent.appendChild(panelTitleInput);
                        panelContent.appendChild(panelContentLabel);
                        panelContent.appendChild(panelContentInput);
                        panelContent.appendChild(commonElements.loader);
                        panelContent.appendChild(commonElements.cancelButton);
                        panelContent.appendChild(commonElements.submitButton);
                        panelContent.appendChild(commonElements.poweredBy);

                        resolve(panelContent);
                    });
            });
        }

        function boardPanelGenerator(data) {
            return new Promise(function (resolve, reject) {
                commonElementsGenerator(BOARD_PANEL)
                    .then(function (resolveCommon) {
                        var commonElements = resolveCommon;

                        var panelSubtitle = document.createElement("h3");
                        panelSubtitle.classList.add("qwant-panel__content__subtitle");
                        panelSubtitle.textContent = data.boardSubtitle;

                        var panelNameLabel = document.createElement("p");
                        panelNameLabel.textContent = data.boardName;
                        panelNameLabel.classList.add("qwant-panel__content__label");
                        panelNameLabel.classList.add("qwant-panel__content__label--name");

                        var panelNameInput = document.createElement("input");
                        panelNameInput.type = "text";
                        panelNameInput.required = true;
                        panelNameInput.classList.add("qwant-panel__content__input");
                        panelNameInput.classList.add("qwant-panel__content__input--name");

                        var panelCategoryLabel = document.createElement("p");
                        panelCategoryLabel.textContent = data.boardCategory;
                        panelCategoryLabel.classList.add("qwant-panel__content__label");
                        panelCategoryLabel.classList.add("qwant-panel__content__label--name");

                        var panelCategorySelect = document.createElement("select");
                        panelCategorySelect.required = true;
                        panelCategorySelect.classList.add("qwant-panel__content__select");
                        panelCategorySelect.classList.add("qwant-panel__content__input--category");

                        data.categories.forEach(function (category) {
                            var panelCategoryOption = document.createElement("option");
                            panelCategoryOption.textContent = category.i18n;
                            panelCategoryOption.value = category.id;

                            panelCategorySelect.appendChild(panelCategoryOption);
                        });

                        var panelVisibilityLabel = document.createElement("p");
                        panelVisibilityLabel.textContent = data.boardVisibility;
                        panelVisibilityLabel.classList.add("qwant-panel__content__label");
                        panelVisibilityLabel.classList.add("qwant-panel__content__label--visibility");

                        var panelVisibility = document.createElement("div");
                        panelVisibility.classList.add("qwant-panel__content__visibility");

                        var panelVisibilityPrivate = document.createElement("span");
                        panelVisibilityPrivate.textContent = data.boardPrivate;
                        panelVisibilityPrivate.classList.add("qwant-panel__content__visibility__label");
                        panelVisibilityPrivate.classList.add("qwant-panel__content__visibility__label--private");

                        var panelVisibilityCheckbox = document.createElement("label");
                        panelVisibilityCheckbox.classList.add("qwant-panel__content__visibility__container");

                        var panelVisibilityCheckboxInput = document.createElement("input");
                        panelVisibilityCheckboxInput.classList.add("qwant-panel__content__visibility__input");
                        panelVisibilityCheckboxInput.type = "checkbox";

                        var panelVisibilityCheckboxI = document.createElement("i");
                        panelVisibilityCheckboxI.classList.add("qwant-panel__content__visibility__i");

                        panelVisibilityCheckbox.appendChild(panelVisibilityCheckboxInput);
                        panelVisibilityCheckbox.appendChild(panelVisibilityCheckboxI);

                        var panelVisibilityPublic = document.createElement("span");
                        panelVisibilityPublic.textContent = data.boardPublic;
                        panelVisibilityPublic.classList.add("qwant-panel__content__visibility__label");
                        panelVisibilityPublic.classList.add("qwant-panel__content__visibility__label--public");

                        panelVisibility.appendChild(panelVisibilityPrivate);
                        panelVisibility.appendChild(panelVisibilityCheckbox);
                        panelVisibility.appendChild(panelVisibilityPublic);

                        panelContent.appendChild(commonElements.panelTitle);
                        panelContent.appendChild(commonElements.panelCloseButton);
                        panelContent.appendChild(panelSubtitle);
                        panelContent.appendChild(panelNameLabel);
                        panelContent.appendChild(panelNameInput);
                        panelContent.appendChild(panelCategoryLabel);
                        panelContent.appendChild(panelCategorySelect);
                        panelContent.appendChild(panelVisibilityLabel);
                        panelContent.appendChild(panelVisibility);
                        panelContent.appendChild(commonElements.loader);
                        panelContent.appendChild(commonElements.cancelButton);
                        panelContent.appendChild(commonElements.submitButton);
                        panelContent.appendChild(commonElements.poweredBy);

                        commonElements.cancelButton
                            .addEventListener("click", function () {
                                changeState(NOTE_PANEL, data);
                            });

                        commonElements.submitButton
                            .addEventListener("click", function () {
                                commonElements.loader.style.display = "block";
                                browser.runtime.sendMessage({
                                    name: "panel-create-board",
                                    data: {
                                        board_name: document.querySelectorAll(".qwant-panel__content__input--name")[0].value,
                                        board_category: document.querySelectorAll(".qwant-panel__content__input--category")[0].value,
                                        board_status: document.querySelectorAll(".qwant-panel__content__visibility__input")[0].checked ? "1" : "0"
                                    }
                                });
                            });

                        resolve(panelContent);
                    });
            });
        }

        /**
         * On script load, chooses the panel to be displayed whether the user has boards or not
         */
        setTimeout(function () {
            var chosenPanel = NOTE_PANEL;
            if (data.userBoards.length === 0) {
                chosenPanel = BOARD_PANEL;
            }
            changeState(chosenPanel, data);
            showPanelNote();
        }, 1);
    }
}

browser.runtime.onMessage.addListener((message, sender, callback) => {
    console.log("contentScript-onMessage", message);

    switch (message.name) {
        case "alert-display":
            createAlert(message);
            break;
        case "alert-destroy":
            hideAlert();
            break;
        case "bookmarks-display":
            createPanelBookmark(message);
            break;
        case "panel-bookmark-destroy":
            hidePanelBookmark();
            break;
        case "panel-bookmark-enable":
            loader.style.display = "none";
            cancelButton.style.display = "inline-block";
            submitButton.style.display = "inline-block";
            break;
        case "panel-note-destroy":
            hidePanelNote();
            break;
        case "panel-note-enable":
            var cancel2 = document.querySelectorAll(".qwant-panel__button--cancel")[0];
            var submit2 = document.querySelectorAll(".qwant-panel__button--submit")[0];
            var advanced2 = document.querySelectorAll(".qwant-panel__button--advanced")[0];
            var loader2 = document.querySelectorAll(".icon-loading")[0];

            if (cancel2) cancel2.style.display = "inline-block";
            if (submit2)    submit2.style.display = "inline-block";
            if (advanced2) advanced2.style.display = "block";
            if (loader2)    loader2.style.display = "none";
            break;
        case "note-display":
            createPanelNote(message);
            break;
        case "panel-display-note":
            noteData.userBoards = message.boards;
            changeState(NOTE_PANEL, noteData);
            break;
        case "panel-note-advanced":
            console.log('panel-advanced data: ', message.data);

            advancedNoteData = message.data;
            changeState(ADVANCED_PANEL, noteData);
            break;
        case "ping":
            callback({name: "pong"});
            break;
    }
});
