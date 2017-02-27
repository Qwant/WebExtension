"use strict";

var SHOW_CLASS = "qwant-panel--visible";

var NO_PANEL = "no-panel";
var NOTE_PANEL = "note-panel";
var ADVANCED_PANEL = "advanced-panel";
var BOARD_PANEL = "board-panel";

var currentPanel = NO_PANEL;
var visible = false;

var body = document.body;
var overlay = document.createElement("div");
var panel = document.createElement("div");
var panelContent = document.createElement("div");

var generator = {
    "note-panel": notePanelGenerator,
    "advanced-panel": advancedPanelGenerator,
    "board-panel": boardPanelGenerator
};

var currentBoard = null;
if (self.options.userBoards.length > 0) {
    currentBoard = self.options.userBoards[0].board_name;
}

var advancedNoteData = null;

overlay.classList.add("qwant-overlay");
panel.classList.add("qwant-panel");
panelContent.classList.add("qwant-panel__content");

overlay.appendChild(panel);
panel.appendChild(panelContent);
panel.addEventListener("click", function (e) {
    e.stopPropagation();
});

overlay.addEventListener("click", function () {
    hide();
});

/**
 * Changes the content of the panel and links the events
 * @param newState
 */
function changeState(newState) {
    if (currentPanel !== newState) {
        panel.classList.remove("qwant-panel--" + currentPanel);
        panel.removeChild(panelContent);
        while (panelContent.hasChildNodes()) {
            panelContent.removeChild(panelContent.lastChild);
        }
        generator[newState]()
            .then(function (resolveContent) {
                panel.appendChild(resolveContent);
                currentPanel = newState;
            });
    }
}

/**
 * Adds the panel to the body and displays it with the transition
 * @param panelType
 */
function show() {
    if (!visible && body !== undefined) {
        body.insertBefore(overlay, body.firstChild);
        body.style.overflow = "hidden";
        panel.style.display = "block";
        setTimeout(function () {
            panel.classList.add(SHOW_CLASS);
        }, 10);
        visible = true;
        self.port.emit("panel-visible");
    }
}

/**
 * Hides the panel with the transition and removes it.
 */
function hide() {
    if (visible) {
        panel.classList.remove(SHOW_CLASS);
        setTimeout(function () {
            panel.style.display = "none";
        }, 300);

        currentPanel = NO_PANEL;
        visible = false;
        self.port.emit("panel-hidden");
        setTimeout(function () {
            if (body !== undefined) {
                body.removeChild(overlay);
                body.style.overflow = "auto";
                while (overlay.hasChildNodes()) {
                    overlay.removeChild(overlay.lastChild);
                }
            }
        }, 300);
    }
}

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
        panelTitle.textContent = self.options.noteTitle;

        var panelCloseButton = document.createElement("span");
        panelCloseButton.classList.add("qwant-panel__content__close--button");
        panelCloseButton.classList.add("icon");
        panelCloseButton.classList.add("icon-close");
        panelCloseButton.addEventListener("click", function () {
            hide();
        });

        var cancelButton = document.createElement("a");
        cancelButton.href = "javascript:;";
        cancelButton.classList.add("qwant-panel__button");
        cancelButton.classList.add("qwant-panel__button--cancel");
        cancelButton.textContent = self.options.cancel;

        var submitButton = document.createElement("a");
        submitButton.href = "javascript:;";
        submitButton.classList.add("qwant-panel__button");
        submitButton.classList.add("qwant-panel__button--submit");
        submitButton.textContent = self.options.submit;

        var advancedButton = document.createElement("a");
        advancedButton.href = "javascript:;";
        advancedButton.classList.add("qwant-panel__button");
        advancedButton.classList.add("qwant-panel__button--advanced");
        advancedButton.textContent = self.options.advanced;

        var loader = document.createElement("span");
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
function notePanelGenerator() {
    return new Promise(function (resolve) {
        commonElementsGenerator(NOTE_PANEL)
            .then(function (resolveCommon) {
                var commonElements = resolveCommon;
                var panelSubtitle = document.createElement("h3");
                panelSubtitle.classList.add("qwant-panel__content__subtitle");
                panelSubtitle.textContent = self.options.noteSubtitle;

                var panelBoardsContainer = document.createElement("div");
                panelBoardsContainer.classList.add("qwant-panel__boards-container");

                var panelBoardsList = document.createElement("ul");
                panelBoardsList.classList.add("qwant-panel__boards-container__list");

                // Adding boards to the list
                self.options.userBoards.forEach(function (board, idx) {
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
                        changeState(BOARD_PANEL);
                    });

                var panelCreateBoardImg = document.createElement("span");
                panelCreateBoardImg.classList.add("qwant-panel__boards-container__board-creator__icon");
                panelCreateBoardImg.classList.add("icon");
                panelCreateBoardImg.classList.add("icon-board-creator");

                var panelCreateBoardText = document.createElement("span");
                panelCreateBoardText.classList.add("qwant-panel__boards-container__board-creator__text");
                panelCreateBoardText.textContent = self.options.noteCreateBoard;

                commonElements.cancelButton
                    .addEventListener("click", function () {
                        hide();
                        self.port.emit("panel-hidden");
                    });

                commonElements.submitButton
                    .addEventListener("click", function () {
                        commonElements.cancelButton.style.display = "none";
                        commonElements.submitButton.style.display = "none";
                        commonElements.advancedButton.style.display = "none";
                        commonElements.loader.style.display = "block";

                        self.port.emit("panel-submit-simple", {
                            board_id: document.querySelectorAll(".qwant-panel__boards-container__element--active")[0].id
                        });
                    });

                commonElements.advancedButton
                    .addEventListener("click", function () {
                        var cancel = document.querySelectorAll(".qwant-panel__button--cancel")[0];
                        var submit = document.querySelectorAll(".qwant-panel__button--submit")[0];
                        var advanced = document.querySelectorAll(".qwant-panel__button--advanced")[0];
                        var loader = document.querySelectorAll(".icon-loading")[0];

                        if (cancel) cancel.style.display = "none";
                        if (submit)    submit.style.display = "none";
                        if (advanced) advanced.style.display = "none";
                        if (loader)    loader.style.display = "block";
                        self.port.emit("panel-advanced");
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

function advancedPanelGenerator() {
    return new Promise(function (resolve, reject) {
        commonElementsGenerator(ADVANCED_PANEL)
            .then(function (resolveCommon) {
                var commonElements = resolveCommon;

                var panelSubtitle = document.createElement("h3");
                panelSubtitle.classList.add("qwant-panel__content__subtitle");
                panelSubtitle.textContent = self.options.advancedSubtitle;

                var panelBoardLabel = document.createElement("p");
                panelBoardLabel.textContent = self.options.advancedBoard;
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
                panelImgLabel.textContent = self.options.advancedImage;
                panelImgLabel.classList.add("qwant-panel__content__label");
                panelImgLabel.classList.add("qwant-panel__content__label--image");

                var panelImgContainer = document.createElement("div");
                panelImgContainer.classList.add("qwant-panel__content__img-container");

                var panelEmptyImg = document.createElement("span");
                panelEmptyImg.classList.add("qwant-panel__content__img-container__empty-img");
                panelEmptyImg.classList.add("qwant-panel__content__img-container__element");
                panelEmptyImg.classList.add("qwant-panel__content__img-container__element--active");
                panelEmptyImg.textContent = self.options.advancedEmptyImage;
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
                panelTitleLabel.textContent = self.options.advancedTitle;
                panelTitleLabel.classList.add("qwant-panel__content__label");
                panelTitleLabel.classList.add("qwant-panel__content__label--title");

                var panelTitleInput = document.createElement("input");
                panelTitleInput.type = "text";
                panelTitleInput.value = advancedNoteData.title;
                panelTitleInput.classList.add("qwant-panel__content__input");
                panelTitleInput.classList.add("qwant-panel__content__input--title");

                var panelContentLabel = document.createElement("p");
                panelContentLabel.textContent = self.options.advancedContent;
                panelContentLabel.classList.add("qwant-panel__content__label");
                panelContentLabel.classList.add("qwant-panel__content__label--content");

                var panelContentInput = document.createElement("textarea");
                panelContentInput.value = advancedNoteData.description;
                panelContentInput.classList.add("qwant-panel__content__input");
                panelContentInput.classList.add("qwant-panel__content__input--content");

                commonElements.cancelButton
                    .addEventListener("click", function () {
                        changeState(NOTE_PANEL);
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
                        var data = {
                            title: document.querySelectorAll(".qwant-panel__content__input--title")[0].value,
                            description: document.querySelectorAll(".qwant-panel__content__input--content")[0].value,
                            type: advancedNoteData.type,
                            url: document.URL
                        };

                        // Get the board ID
                        var chosenBoard = document.querySelectorAll(".qwant-panel__content__input--board")[0];
                        self.options.userBoards.forEach(function (board) {
                            if (board.board_name === chosenBoard.value) {
                                data.board_id = board.board_id;
                            }
                        });

                        // Get the chosen picture if there is one
                        var chosenImg = document.querySelectorAll(".qwant-panel__content__img-container__element--active")[0] || null;
                        if (chosenImg !== null) {
                            advancedNoteData.images.forEach(function (image) {
                                if (image.src === chosenImg.src) {
                                    data.image_src = image.src;
                                    data.image_key = image.key;
                                }
                            });
                        }

                        // Let's send the data to the
                        self.port.emit("panel-advanced-submit", data);
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

function boardPanelGenerator() {
    return new Promise(function (resolve, reject) {
        commonElementsGenerator(BOARD_PANEL)
            .then(function (resolveCommon) {
                var commonElements = resolveCommon;

                var panelSubtitle = document.createElement("h3");
                panelSubtitle.classList.add("qwant-panel__content__subtitle");
                panelSubtitle.textContent = self.options.boardSubtitle;

                var panelNameLabel = document.createElement("p");
                panelNameLabel.textContent = self.options.boardName;
                panelNameLabel.classList.add("qwant-panel__content__label");
                panelNameLabel.classList.add("qwant-panel__content__label--name");

                var panelNameInput = document.createElement("input");
                panelNameInput.type = "text";
                panelNameInput.required = true;
                panelNameInput.classList.add("qwant-panel__content__input");
                panelNameInput.classList.add("qwant-panel__content__input--name");

                var panelCategoryLabel = document.createElement("p");
                panelCategoryLabel.textContent = self.options.boardCategory;
                panelCategoryLabel.classList.add("qwant-panel__content__label");
                panelCategoryLabel.classList.add("qwant-panel__content__label--name");

                var panelCategorySelect = document.createElement("select");
                panelCategorySelect.required = true;
                panelCategorySelect.classList.add("qwant-panel__content__select");
                panelCategorySelect.classList.add("qwant-panel__content__input--category");

                self.options.categories.forEach(function (category) {
                    var panelCategoryOption = document.createElement("option");
                    panelCategoryOption.textContent = category.i18n;
                    panelCategoryOption.value = category.id;

                    panelCategorySelect.appendChild(panelCategoryOption);
                });

                var panelVisibilityLabel = document.createElement("p");
                panelVisibilityLabel.textContent = self.options.boardVisibility;
                panelVisibilityLabel.classList.add("qwant-panel__content__label");
                panelVisibilityLabel.classList.add("qwant-panel__content__label--visibility");

                var panelVisibility = document.createElement("div");
                panelVisibility.classList.add("qwant-panel__content__visibility");

                var panelVisibilityPrivate = document.createElement("span");
                panelVisibilityPrivate.textContent = self.options.boardPrivate;
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
                panelVisibilityPublic.textContent = self.options.boardPublic;
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
                        changeState(NOTE_PANEL);
                    });

                commonElements.submitButton
                    .addEventListener("click", function () {
                        commonElements.loader.style.display = "block";
                        self.port.emit("panel-create-board", {
                            board_name: document.querySelectorAll(".qwant-panel__content__input--name")[0].value,
                            board_category: document.querySelectorAll(".qwant-panel__content__input--category")[0].value,
                            board_status: document.querySelectorAll(".qwant-panel__content__visibility__input")[0].checked ? "1" : "0"
                        });
                    });

                resolve(panelContent);
            });
    });
}

self.port.on("panel-destroy", function () {
    hide();
});

self.port.on("panel-enable", function () {
    var cancel = document.querySelectorAll(".qwant-panel__button--cancel")[0];
    var submit = document.querySelectorAll(".qwant-panel__button--submit")[0];
    var advanced = document.querySelectorAll(".qwant-panel__button--advanced")[0];
    var loader = document.querySelectorAll(".icon-loading")[0];

    if (cancel) cancel.style.display = "inline-block";
    if (submit)    submit.style.display = "inline-block";
    if (advanced) advanced.style.display = "block";
    if (loader)    loader.style.display = "none";
});

self.port.on("panel-display-note", function (data) {
    self.options.userBoards = data;
    changeState(NOTE_PANEL);
});

self.port.on("panel-advanced", function (data) {
    advancedNoteData = data;
    changeState(ADVANCED_PANEL);
});

/**
 * On script load, chooses the panel to be displayed whether the user has boards or not
 */
setTimeout(function () {
    var chosenPanel = NOTE_PANEL;
    if (self.options.userBoards.length === 0) {
        chosenPanel = BOARD_PANEL;
    }
    changeState(chosenPanel);
    show();
}, 1);