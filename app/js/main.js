'use strict';
function addPlaceholder() {
    if ($.fn.placeholder) {
        $('input, textarea').placeholder();
    }
}

function fileLoaderModule() {
    var fileUploads = $(".input__upload"),
        picTypes = ['.jpg', '.jpeg', '.png', '.bmp'];

    function _eventListener() {
        fileUploads.on('change', _fileUploadFix);
    }

    function _fileUploadFix(e) {
        var fileApi = ( window.File && window.FileReader && window.FileList && window.Blob ) ? true : false,
            fileName,
            thisUploadWrapper = $(e.target).closest('.input_popup'),
            fileUploadInput = thisUploadWrapper.find('.input__upload'),
            fakeFileUploadInput = thisUploadWrapper.find('.input__fake-upload');

        if (fileApi && fileUploadInput[0].files[0]) {
            fileName = fileUploadInput[0].files[0].name;
        } else {
            fileName = fileUploadInput.val().replace("C:\\fakepath\\", '');
        }

        if (!fileName.length) return;

        var fileType = fileName.slice(fileName.lastIndexOf('.'));

        if ($.inArray(fileType, picTypes) === -1) {
            fakeFileUploadInput.val('');
            validateModule().validateInput(fakeFileUploadInput);
        } else {
            fakeFileUploadInput.val(fileName);
            validateModule().validateInput(fakeFileUploadInput);
        }
    }

    return {
        'init': function () {
            _eventListener();
        }
    };
}

function popupModule() {
    var popups = $('.popup'),
        popupButtons = $('.popup-button'),
        time = 300;

    function _eventListener() {
        popupButtons.on('click', _popupSwitcher.show);
        popups.on('click', _popupSwitcher.hide);
    }

    var _popupSwitcher = {
        'show': function (e) {
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);

            var popupName = $(this).data('popup-name');

            popups.filter('[data-popup-name="' + popupName + '"]').fadeIn(time, function () {
                addPlaceholder();
            });
        },
        'hide': function (e) {
            var $this = $(e.target),
                thisPopup = $(this),
                form = thisPopup.find('form'),
                serverMessageBlock = form.siblings('.server-message'),
                popupContainer = serverMessageBlock.closest('.content-block__container_popup');

            if ($this.hasClass('popup') || $this.hasClass('popup__close')) {
                e.preventDefault ? e.preventDefault() : (e.returnValue = false);

                thisPopup.fadeOut(time, function () {
                    serverMessageBlock.attr('style', '')
                        .removeClass('server-message_ok server-message_error')
                        .hide()
                        .siblings()
                        .show();
                    popupContainer.attr('style', '');

                    if (form.length) {
                        var inputs = form.find('.input__text'),
                            tooltips = form.find('.tooltip');

                        form.each(function (i) {
                            form.eq(i)[0].reset();
                        });

                        inputs.removeClass('input__text_no-valid');
                        tooltips.hide();
                    }
                });
            }
        }
    };

    return {
        'init': function () {
            _eventListener();
        }
    };
}

function validateModule() {
    var forms = $('form'),
        time = 300;

    function _eventListener() {
        forms.on('submit', _validator);
        forms.on('reset', _cleanForm);
    }

    function _cleanForm(e) {
        var thisForm = $(e.target).closest('form'),
            inputs = thisForm.find('.input__text'),
            tooltips = thisForm.find('.tooltip'),
            serverMessage = thisForm.siblings('.server-message');

        inputs.removeClass('input__text_no-valid');
        tooltips.hide();
        serverMessage.hide();
        grecaptcha.reset();
    }

    var _validateSwitcher = {
        noValid: function (input) {
            input.addClass('input__text_no-valid')
                .siblings('.tooltip').fadeIn(time);
        },
        valid: function (input) {
            input.removeClass('input__text_no-valid')
                .siblings('.tooltip').fadeOut(time);
        }
    };

    function validateInput(input) {
        var type = input.attr('type'),
            tooltipText = input.data('tooltip'),
            tooltipPosition = input.data('tooltip-position'),
            inputWrapper = $('<div></div>', {
                'class': 'input-tooltip-wrapper'
            }),
            tooltipBlock = $('<div></div>', {
                'class': 'tooltip',
                'text': tooltipText
            });

        if (!input.siblings('.tooltip').length) {
            input.wrap(inputWrapper)
                .after(tooltipBlock);
        } else {
            tooltipBlock = input.siblings('.tooltip');
        }

        if (tooltipPosition === 'right') {
            tooltipBlock.css({
                right: -tooltipBlock.width() - 17
            }).addClass('tooltip_right');
        } else {
            tooltipBlock.css({
                left: -tooltipBlock.width() - 17
            });
        }

        if (type !== 'file' && !input.hasClass('input__fake-upload') && !input.hasClass('g-recaptcha')) {
            input.on('focus', function (e) {
                var thisInput = $(e.target);

                if (thisInput.hasClass('input__text_no-valid')) {
                    thisInput.on('keydown', function () {
                        _validateSwitcher.valid(thisInput);
                    });
                }
            });
        }

        if (input.hasClass('g-recaptcha')) {
            if (!grecaptcha.getResponse().length) {
                _validateSwitcher.noValid(input);
            } else {
                _validateSwitcher.valid(input)
            }
        } else {
            if (!input.val()) {
                _validateSwitcher.noValid(input);
            } else {
                _validateSwitcher.valid(input)
            }
        }
    }

    function _validator(e) {
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);

        var thisForm = $(this),
            inputs = thisForm.find('.input__text');

        inputs.each(function (i) {
            var input = inputs.eq(i);

            validateInput(input);
        });

        if (!thisForm.find('.input__text_no-valid').length) {
            ajaxModule(thisForm).init();
        }
    }

    return {
        'init': function () {
            _eventListener();
        },
        'validateInput': validateInput
    };
}

function ajaxModule(form) {
    var serverMessageBlock = form.siblings('.server-message'),
        serverMessageTitle = serverMessageBlock.find('.server-message__title'),
        serverMessageText = serverMessageBlock.find('.server-message__text'),
        serverMessageClose = serverMessageBlock.find('.server-message__close'),
        container = serverMessageBlock.closest('.content-block__container'),
        containerHeight = container.outerHeight();

    var _messageLoader = {
        'ok': function (data, className, noHideOver, noMoveParent) {
            serverMessageTitle.text(data.title);
            serverMessageText.text(data.message);
            serverMessageBlock
                .show()
                .removeClass('server-message_error')
                .addClass('server-message_ok');

            if (className) {
                serverMessageBlock.addClass(className);
            }

            if (!noHideOver) {
                serverMessageBlock
                    .siblings()
                    .not('.popup__close')
                    .hide();
            }

            serverMessageClose.hide();

            if (!noMoveParent) {
                container.css({
                    'margin-top': '+=' + (containerHeight / 2 - container.outerHeight() / 2)
                });
            }
        },
        'error': function (data, className, noMoveParent) {
            serverMessageTitle.text(data.title);
            serverMessageText.text(data.message);
            serverMessageBlock
                .show()
                .removeClass('server-message_ok')
                .addClass('server-message_error');

            if (className) {
                serverMessageBlock.addClass(className);
            }

            serverMessageClose.show();
            if (!noMoveParent) {
                container.css({
                    'top': '-=' + serverMessageBlock.outerHeight(true)
                });
            }
        }
    };

    if (form.hasClass('popup-form')) {
        _addWork();
    } else if (form.hasClass('login-form')) {
        _login();
    } else if (form.hasClass('feedback-form')) {
        _sendMail();
    }

    var _serverMessage = {
        'done': function (data, className, noHideOver, noMoveParent) {
            var status = data.status;

            container.attr('style', '');

            if (status === 'ok') {
                _messageLoader.ok(data, className, noHideOver, noMoveParent);
            } else if (status === 'error') {
                _messageLoader.error(data, className, noHideOver, noMoveParent);
            }
        },
        'error': function (message, className, noMoveParent) {
            var data = {
                'title': 'Ошибка!',
                'message': message
            };

            _messageLoader.error(data, className, noMoveParent);
        }
    };

    function _eventListener() {
        serverMessageClose.on('click', _hideServerMessage);
    }

    function _hideServerMessage(e) {
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);

        var thisClose = $(this);

        thisClose.closest('.server-message')
            .hide()
            .end()
            .closest('.content-block__container')
            .attr('style', '');
    }

    function _addWork() {
        if (window.FormData) {
            var formData = new FormData(form[0]);

            $.ajax({
                type: "POST",
                processData: false,
                contentType: false,
                url: "php/add-work.php",
                data: formData
            }).done(function (data) {
                _serverMessage.done(data);

                var project = $(data.project),
                    addButton = $('.work__add-link').closest('.work');

                project.insertBefore(addButton);
                $('<span> </span>').insertBefore(addButton);
            }).error(function () {
                _serverMessage.error('Невозможно добавить проект.')
            });
        }
    }

    function _login() {
        if (window.FormData) {
            var formData = new FormData(form[0]);

            $.ajax({
                type: "POST",
                processData: false,
                contentType: false,
                url: "php/login.php",
                data: formData
            }).done(function (data) {
                _serverMessage.done(data);

                if (data.auth) {
                    setTimeout(function () {
                        window.location.pathname = data.location;
                    }, 1000);
                }
            }).error(function () {
                _serverMessage.error('Невозможно выполнить вход.')
            });
        }
    }

    function _sendMail() {

        if (window.FormData) {
            var formData = new FormData(form[0]);

            $.ajax({
                type: "POST",
                processData: false,
                contentType: false,
                url: "php/send.php",
                data: formData
            }).done(function (data) {
                _serverMessage.done(data, 'server-message_feedback', true, true);
            }).error(function () {
                _serverMessage.error('Невозможно отправить сообщение.', 'server-message_feedback', true)
            });
        }
    }

    return {
        'init': function () {
            _eventListener();
        }
    }
}

addPlaceholder();
fileLoaderModule().init();
popupModule().init();
validateModule().init();
function recaptchaCallback(){
    validateModule().validateInput($('.g-recaptcha'));
}