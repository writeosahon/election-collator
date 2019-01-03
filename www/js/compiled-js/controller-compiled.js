'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Created by UTOPIA SOFTWARE on 26/7/2018.
 */

/**
 * file defines all View-Models, Controllers and Event Listeners used by the app
 *
 * The 'utopiasoftware_app_namespace' namespace variable has being defined in the base js file.
 * The author uses the terms 'method' and function interchangeably; likewise the terms 'attribute' and 'property' are
 * also used interchangeably
 */

// define the controller namespace
utopiasoftware[utopiasoftware_app_namespace].controller = {

    /**
     * method contains the stratup/bootstrap code needed to initiate app logic execution
     */
    startup: function startup() {

        // initialise the app libraries and plugins
        ons.ready(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
            var electionDataPromisesArray;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            // set the default handler for the app
                            ons.setDefaultDeviceBackButtonListener(function () {
                                // does nothing for now!!
                            });

                            // displaying prepping message
                            $('#loader-modal-message').html("Loading App...");
                            $('#loader-modal').get(0).show(); // show loader

                            if (false) {
                                // there is a previous logged in user
                                // load the app main page
                                $('ons-splitter').get(0).content.load("app-main-template");
                            } else {
                                // there is no previously logged in user
                                // load the login page
                                $('ons-splitter').get(0).content.load("login-template");
                            }

                            // START ALL CORDOVA PLUGINS CONFIGURATIONS
                            try {
                                // lock the orientation of the device to 'PORTRAIT'
                                screen.orientation.lock('portrait');
                            } catch (err) {}

                            _context.prev = 5;
                            // START ALL THE CORDOVA PLUGINS CONFIGURATION WHICH REQUIRE PROMISE SYNTAX

                            // prepare the inapp browser plugin by removing the default window.open() functionality
                            delete window.open;

                            // prepare the window.URL static object for use
                            window.URL = window.URL || window.webkitURL;

                            // note: for most promises, we will use async-wait syntax
                            //load the senatorial districts, lgas, wards and polling units, data
                            electionDataPromisesArray = [];

                            electionDataPromisesArray.push(new Promise(function (resolve, reject) {
                                Promise.resolve($.ajax({
                                    url: "edo-state-senatorial-districts-list.json",
                                    type: "get",
                                    //contentType: "application/x-www-form-urlencoded",
                                    beforeSend: function beforeSend(jqxhr) {},
                                    dataType: "json",
                                    timeout: 240000, // wait for 4 minutes before timeout of request
                                    processData: true,
                                    data: {}
                                })).then(function (responseObject) {
                                    resolve(responseObject.rows); // resolve the parent promise with the data gotten from the server
                                }).catch(function (err) {
                                    // an error occurred

                                    reject(err); // reject the parent promise with the error
                                });
                            }));

                            _context.next = 12;
                            return Promise.all(electionDataPromisesArray);

                        case 12:
                            utopiasoftware[utopiasoftware_app_namespace].controller.collatorPageViewModel.electionDataArray = _context.sent;
                            _context.next = 18;
                            break;

                        case 15:
                            _context.prev = 15;
                            _context.t0 = _context['catch'](5);

                            console.log("APP LOADING ERROR", _context.t0);

                        case 18:
                            _context.prev = 18;

                            // set status bar color
                            StatusBar.backgroundColorByHexString("#00B2A0");
                            navigator.splashscreen.hide(); // hide the splashscreen
                            utopiasoftware[utopiasoftware_app_namespace].model.isAppReady = true; // flag that app is fullyt loaded and ready
                            return _context.finish(18);

                        case 23:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this, [[5, 15, 18, 23]]);
        }))); // end of ons.ready()
    },

    /**
     * this is the view-model/controller for the SIDE MENU page
     */
    sideMenuPageViewModel: {

        /**
         * method is triggered when the "Sign Out" button is clicked
         * @returns {Promise<void>}
         */
        signOutButtonClicked: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                console.log("STACKS", $('#app-main-navigator').get(0).pages);
                                // remove the user details rev id from storage
                                window.localStorage.removeItem("utopiasoftware-edpms-app-status");
                                // load the login page
                                _context2.next = 4;
                                return $('ons-splitter').get(0).content.load("login-template");

                            case 4:
                                // hide the side menu
                                $('ons-splitter').get(0).right.close();

                            case 5:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function signOutButtonClicked() {
                return _ref2.apply(this, arguments);
            }

            return signOutButtonClicked;
        }(),


        /**
         * method is triggered when the "Upload Reports" button is clicked
         *
         * @returns {Promise<void>}
         */
        uploadReportsButtonClicked: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var totalUploads;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                // upload all the report evaluation sheets
                                totalUploads = 0;
                                _context3.prev = 1;
                                _context3.next = 4;
                                return utopiasoftware[utopiasoftware_app_namespace].projectEvaluationReportData.uploadProjectEvaluationReports(true);

                            case 4:
                                totalUploads = _context3.sent;

                                if (!(totalUploads === 0)) {
                                    _context3.next = 10;
                                    break;
                                }

                                _context3.next = 8;
                                return ons.notification.alert('No evaluation reports to upload', { title: '<ons-icon icon="md-info" style="color: #3f51b5" size="33px"></ons-icon> <span style="color: #3f51b5; display: inline-block; margin-left: 1em;">No Reports Uploaded</span>',
                                    buttonLabels: ['OK'], modifier: 'utopiasoftware-alert-dialog' });

                            case 8:
                                _context3.next = 12;
                                break;

                            case 10:
                                _context3.next = 12;
                                return ons.notification.alert('All evaluation reports successfully uploaded. ' + totalUploads + ' in total', { title: '<ons-icon icon="fa-check" style="color: #00B2A0;" size="25px"></ons-icon> <span style="color: #00B2A0; display: inline-block; margin-left: 1em;">Uploaded Reports</span>',
                                    buttonLabels: ['OK'], modifier: 'utopiasoftware-alert-dialog' });

                            case 12:

                                // call the method to refresh the contents of the View Reports page
                                utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.pagePullHookAction();
                                _context3.next = 18;
                                break;

                            case 15:
                                _context3.prev = 15;
                                _context3.t0 = _context3['catch'](1);

                                ons.notification.alert('uploading evaluation reports failed. Please try again. ' + (_context3.t0.message || ""), { title: '<span style="color: red">Uploading Reports Failed</span>',
                                    buttonLabels: ['OK'], modifier: 'utopiasoftware-alert-dialog' });

                            case 18:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[1, 15]]);
            }));

            function uploadReportsButtonClicked() {
                return _ref3.apply(this, arguments);
            }

            return uploadReportsButtonClicked;
        }(),


        /**
         * method is triggered when the "View Reports" button is clicked
         * @returns {Promise<void>}
         */
        viewReportsButtonClicked: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                _context4.next = 2;
                                return $("#app-main-navigator").get(0).bringPageTop("view-reports-page.html", { animation: "slide" });

                            case 2:
                                // hide the side menu
                                $('ons-splitter').get(0).right.close();

                            case 3:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function viewReportsButtonClicked() {
                return _ref4.apply(this, arguments);
            }

            return viewReportsButtonClicked;
        }(),


        /**
         * method is triggered when the Refresh Offline Data button is clicked
         * @returns {Promise<void>}
         */
        refreshOfflineDataButtonClicked: function () {
            var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.prev = 0;
                                _context5.next = 3;
                                return utopiasoftware[utopiasoftware_app_namespace].appCachedData.loadProjectData(true);

                            case 3:
                                _context5.next = 5;
                                return ons.notification.alert('App offline has been refreshed successfully', { title: '<ons-icon icon="fa-check" style="color: #00B2A0;" size="25px"></ons-icon> <span style="color: #00B2A0; display: inline-block; margin-left: 1em;">Offline Data Refreshed</span>',
                                    buttonLabels: ['OK'], modifier: 'utopiasoftware-alert-dialog' });

                            case 5:
                                _context5.next = 10;
                                break;

                            case 7:
                                _context5.prev = 7;
                                _context5.t0 = _context5['catch'](0);

                                ons.notification.alert('refreshing app offline data failed. Please try again. ' + (_context5.t0.message || ""), { title: '<span style="color: red">Offline Data Refresh Failed</span>',
                                    buttonLabels: ['OK'], modifier: 'utopiasoftware-alert-dialog' });

                            case 10:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this, [[0, 7]]);
            }));

            function refreshOfflineDataButtonClicked() {
                return _ref5.apply(this, arguments);
            }

            return refreshOfflineDataButtonClicked;
        }()
    },

    /**
     * this is the view-model/controller for the LOGIN page
     */
    loginPageViewModel: {

        /**
         * used to hold the parsley form validation object for the sign-in page
         */
        formValidator: null,

        /**
         * event is triggered when page is initialised
         */
        pageInit: function pageInit(event) {

            //function is used to initialise the page if the app is fully ready for execution
            var loadPageOnAppReady = function () {
                var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
                    return regeneratorRuntime.wrap(function _callee6$(_context6) {
                        while (1) {
                            switch (_context6.prev = _context6.next) {
                                case 0:
                                    if (!(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false)) {
                                        _context6.next = 3;
                                        break;
                                    }

                                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                                    return _context6.abrupt('return');

                                case 3:

                                    // listen for the back button event
                                    $('#login-navigator').get(0).topPage.onDeviceBackButton = function () {
                                        ons.notification.confirm('Do you want to close the app?', { title: 'Exit App',
                                            buttonLabels: ['No', 'Yes'], modifier: 'utopiasoftware-alert-dialog' }) // Ask for confirmation
                                        .then(function (index) {
                                            if (index === 1) {
                                                // OK button
                                                navigator.app.exitApp(); // Close the app
                                            }
                                        });
                                    };

                                    // adjust the window/view-port settings for when the soft keyboard is displayed
                                    //window.SoftInputMode.set('adjustPan'); // let the window/view-port 'pan' when the soft keyboard is displayed
                                    window.SoftInputMode.set('adjustResize');

                                    // initialise the login form validation
                                    utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.formValidator = $('#login-form').parsley();

                                    // listen for log in form field validation failure event
                                    utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.formValidator.on('field:error', function (fieldInstance) {
                                        // get the element that triggered the field validation error and use it to display tooltip
                                        // display tooltip
                                        $(fieldInstance.$element).addClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                                        $(fieldInstance.$element).attr("data-hint", fieldInstance.getErrorsMessages()[0]);
                                    });

                                    // listen for log in form field validation success event
                                    utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.formValidator.on('field:success', function (fieldInstance) {
                                        // remove tooltip from element
                                        $(fieldInstance.$element).removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                                        $(fieldInstance.$element).removeAttr("data-hint");
                                    });

                                    /*// listen for log in form validation success
                                    utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.formValidator.on('form:success',
                                        utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.formValidated);*/

                                    // hide the loader
                                    $('#loader-modal').get(0).hide();

                                case 9:
                                case 'end':
                                    return _context6.stop();
                            }
                        }
                    }, _callee6, this);
                }));

                return function loadPageOnAppReady() {
                    return _ref6.apply(this, arguments);
                };
            }();

            var $thisPage = $(event.target); // get the current page shown
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();
        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function pageShow() {
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // adjust the window/view-port settings for when the soft keyboard is displayed
            window.SoftInputMode.set('adjustResize'); // let the window/view-port 'pan' when the soft keyboard is displayed

            // listen for when the device keyboard is hidden
            window.addEventListener("keyboardDidHide", utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.keyboardHidden);

            // listen for when the device keyboard is shown
            window.addEventListener("keyboardDidShow", utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.keyboardShown);
        },

        /**
         * method is triggered when page is hidden
         */
        pageHide: function pageHide() {
            // adjust the window/view-port settings for when the soft keyboard is displayed
            // window.SoftInputMode.set('adjustResize'); // let the view 'resize' when the soft keyboard is displayed

            try {
                // remove the listeners registered to listen for when the device keyboard is hidden and shown
                window.removeEventListener("keyboardDidHide", utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.keyboardHidden);
                window.removeEventListener("keyboardDidShow", utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.keyboardShown);
                // remove any tooltip being displayed on all forms on the page
                $('#login-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                $('#login-page [data-hint]').removeAttr("data-hint");
                // reset the form validator object on the page
                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.formValidator.reset();
            } catch (err) {}
        },

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function pageDestroy() {

            try {
                // remove any tooltip being displayed on all forms on the page
                $('#login-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                $('#login-page [data-hint]').removeAttr("data-hint");
                // reset the form validator object on the page
                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.formValidator.destroy();
            } catch (err) {}
        },

        /**
         * method will be triggered when the device keyboard is hidden. This is an event listener
         */
        keyboardHidden: function keyboardHidden() {
            // show the title banner on the home page
            $('#login-page .login-title-banner').css("display", "block");
        },


        /**
         * method will be triggered when the device keyboard is shown. This is an event listener
         */
        keyboardShown: function keyboardShown() {
            // hide the title banner on the home page
            $('#login-page .login-title-banner').css("display", "none");
        },


        /**
         * method is triggered when the "Sign In / Log In" button is clicked
         *
         * @returns {Promise<void>}
         */
        loginButtonClicked: function () {
            var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
                return regeneratorRuntime.wrap(function _callee7$(_context7) {
                    while (1) {
                        switch (_context7.prev = _context7.next) {
                            case 0:

                                /*// run the validation method for the sign-in form
                                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.formValidator.whenValidate();*/
                                $('#login-navigator').get(0).pushPage('collator-page.html');

                            case 1:
                            case 'end':
                                return _context7.stop();
                        }
                    }
                }, _callee7, this);
            }));

            function loginButtonClicked() {
                return _ref7.apply(this, arguments);
            }

            return loginButtonClicked;
        }(),


        /**
         * method is triggered when the enter button is clicked on the device keyboard
         *
         * @param keyEvent
         * @returns {Promise<void>}
         */
        enterButtonClicked: function () {
            var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(keyEvent) {
                return regeneratorRuntime.wrap(function _callee8$(_context8) {
                    while (1) {
                        switch (_context8.prev = _context8.next) {
                            case 0:
                                // check which key was pressed
                                if (keyEvent.which === kendo.keys.ENTER) // if the enter key was pressed
                                    {
                                        // prevent the default action from occurring
                                        keyEvent.preventDefault();
                                        keyEvent.stopImmediatePropagation();
                                        keyEvent.stopPropagation();
                                        // hide the device keyboard
                                        Keyboard.hide();
                                    }

                            case 1:
                            case 'end':
                                return _context8.stop();
                        }
                    }
                }, _callee8, this);
            }));

            function enterButtonClicked(_x) {
                return _ref8.apply(this, arguments);
            }

            return enterButtonClicked;
        }(),


        /**
         * method is triggered when the form is successfully validated
         *
         * @returns {Promise<void>}
         */
        formValidated: function () {
            var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9() {
                var formData, serverResponse, userDetailsDoc, databaseResponse;
                return regeneratorRuntime.wrap(function _callee9$(_context9) {
                    while (1) {
                        switch (_context9.prev = _context9.next) {
                            case 0:
                                if (!(navigator.connection.type === Connection.NONE)) {
                                    _context9.next = 3;
                                    break;
                                }

                                // no Internet Connection
                                // inform the user that they cannot proceed without Internet
                                window.plugins.toast.showWithOptions({
                                    message: "You cannot sign in without an Internet Connection",
                                    duration: 4000,
                                    position: "top",
                                    styling: {
                                        opacity: 1,
                                        backgroundColor: '#ff0000', //red
                                        textColor: '#FFFFFF',
                                        textSize: 14
                                    }
                                }, function (toastEvent) {
                                    if (toastEvent && toastEvent.event == "touch") {
                                        // user tapped the toast, so hide toast immediately
                                        window.plugins.toast.hide();
                                    }
                                });

                                return _context9.abrupt('return');

                            case 3:

                                // inform user that login validation is taking place
                                $('#loader-modal #loader-modal-message').html("Signing You In...");
                                _context9.next = 6;
                                return $('#loader-modal').get(0).show();

                            case 6:
                                _context9.prev = 6;

                                // create the form data to be submitted
                                formData = {
                                    username: $('#login-page #login-email').val().trim(),
                                    password: $('#login-page #login-password').val().trim()
                                };
                                _context9.next = 10;
                                return Promise.resolve($.ajax({
                                    url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + "/mobile/login.php",
                                    type: "post",
                                    contentType: "application/x-www-form-urlencoded",
                                    beforeSend: function beforeSend(jqxhr) {
                                        jqxhr.setRequestHeader("X-PTRACKER-APP", "mobile");
                                    },
                                    dataType: "text",
                                    timeout: 240000, // wait for 4 minutes before timeout of request
                                    processData: true,
                                    data: formData
                                }));

                            case 10:
                                serverResponse = _context9.sent;

                                // convert the response to an object
                                serverResponse = JSON.parse(serverResponse.trim());

                                // check if the user login was successful

                                if (!(serverResponse.status !== "success")) {
                                    _context9.next = 14;
                                    break;
                                }

                                throw serverResponse;

                            case 14:

                                // save the user's details
                                utopiasoftware[utopiasoftware_app_namespace].model.userDetails = {
                                    _id: "userDetails",
                                    userDetails: { firstname: serverResponse.firstname, username: serverResponse.username },
                                    type: "userDetails",
                                    _rev: window.localStorage.getItem("utopiasoftware-edpms-app-status") && window.localStorage.getItem("utopiasoftware-edpms-app-status") !== "" ? window.localStorage.getItem("utopiasoftware-edpms-app-status") : null
                                };

                                // check if the user wants to remain signed in

                                if (!$('#login-page #login-remember-me').get(0).checked) {
                                    _context9.next = 32;
                                    break;
                                }

                                // the user wants to remian signed in
                                // save the user's details to persistent database
                                userDetailsDoc = null; // holds the previous stored user details from the database

                                _context9.prev = 17;
                                _context9.next = 20;
                                return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.get('userDetails');

                            case 20:
                                userDetailsDoc = _context9.sent;
                                _context9.next = 25;
                                break;

                            case 23:
                                _context9.prev = 23;
                                _context9.t0 = _context9['catch'](17);

                            case 25:

                                if (!userDetailsDoc) {
                                    // no userDetails object has been previous saved
                                    delete utopiasoftware[utopiasoftware_app_namespace].model.userDetails._rev; // delete the _rev property
                                } else {
                                    // user details object has been previously saved
                                    // update the _rev property of the userDetails object being used by the app
                                    utopiasoftware[utopiasoftware_app_namespace].model.userDetails._rev = userDetailsDoc._rev;
                                }

                                // saved the user details object in the app database
                                _context9.next = 28;
                                return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.put(utopiasoftware[utopiasoftware_app_namespace].model.userDetails);

                            case 28:
                                databaseResponse = _context9.sent;

                                // save the returned user details rev id
                                window.localStorage.setItem("utopiasoftware-edpms-app-status", databaseResponse.rev);
                                _context9.next = 33;
                                break;

                            case 32:
                                // user does not want to remain signed in
                                // remove the user details rev id from storage
                                window.localStorage.removeItem("utopiasoftware-edpms-app-status");

                            case 33:

                                // flag that the user just completed a sign in for this session
                                window.sessionStorage.setItem("utopiasoftware-edpms-user-logged-in", "yes");

                                // move user to the main menu page
                                _context9.next = 36;
                                return Promise.all([$('ons-splitter').get(0).content.load("app-main-template"), $('#loader-modal').get(0).hide()]);

                            case 36:
                                _context9.next = 42;
                                break;

                            case 38:
                                _context9.prev = 38;
                                _context9.t1 = _context9['catch'](6);

                                $('#loader-modal').get(0).hide();
                                ons.notification.alert(_context9.t1.message, { title: '<span style="color: red">Sign In Failed</span>',
                                    buttonLabels: ['OK'], modifier: 'utopiasoftware-alert-dialog' });

                            case 42:
                            case 'end':
                                return _context9.stop();
                        }
                    }
                }, _callee9, this, [[6, 38], [17, 23]]);
            }));

            function formValidated() {
                return _ref9.apply(this, arguments);
            }

            return formValidated;
        }()
    },

    /**
     * this is the view-model/controller for the Search Project page
     */
    searchProjectPageViewModel: {

        /**
         * used to hold the parsley form validation object for the sign-in page
         */
        formValidator: null,

        /**
         * object holds the currently searched and chosen project object
         */
        currentlySelectedProject: null,

        /**
         * event is triggered when page is initialised
         */
        pageInit: function pageInit(event) {

            //function is used to initialise the page if the app is fully ready for execution
            var loadPageOnAppReady = function () {
                var _ref10 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10() {
                    var serverResponse, allProjects;
                    return regeneratorRuntime.wrap(function _callee10$(_context10) {
                        while (1) {
                            switch (_context10.prev = _context10.next) {
                                case 0:
                                    if (!(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false)) {
                                        _context10.next = 3;
                                        break;
                                    }

                                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                                    return _context10.abrupt('return');

                                case 3:

                                    // listen for the back button event
                                    /*$('#app-main-navigator').get(0).topPage.onDeviceBackButton =
                                        utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.backButtonClicked;*/
                                    event.target.onDeviceBackButton = utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.backButtonClicked;

                                    // initialise the login form validation
                                    utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.formValidator = $('#search-project-form').parsley();

                                    // listen for log in form field validation failure event
                                    utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.formValidator.on('field:error', function (fieldInstance) {
                                        // get the element that triggered the field validation error and use it to display tooltip
                                        // display tooltip
                                        $(fieldInstance.$element).addClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                                        $(fieldInstance.$element).attr("data-hint", fieldInstance.getErrorsMessages()[0]);
                                    });

                                    // listen for log in form field validation success event
                                    utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.formValidator.on('field:success', function (fieldInstance) {
                                        // remove tooltip from element
                                        $(fieldInstance.$element).removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                                        $(fieldInstance.$element).removeAttr("data-hint");
                                    });

                                    // listen for log in form validation success
                                    utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.formValidator.on('form:success', utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.formValidated);

                                    _context10.prev = 8;


                                    // keep device awake during the downloading process
                                    window.plugins.insomnia.keepAwake();
                                    // check if the user just completed a signin or log-in

                                    if (!(window.sessionStorage.getItem("utopiasoftware-edpms-user-logged-in") === "yes" && window.sessionStorage.getItem("utopiasoftware-edpms-refresh-page") !== "yes")) {
                                        _context10.next = 64;
                                        break;
                                    }

                                    // beginning uploading app data
                                    $('#determinate-progress-modal .modal-message').html('Downloading projects data for offline use...');
                                    $('#determinate-progress-modal').get(0).show();
                                    $('#determinate-progress-modal #determinate-progress').get(0).value = 30;

                                    // get the projects data to be cached
                                    _context10.next = 16;
                                    return Promise.resolve($.ajax({
                                        url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + "/mobile/loadprojects.php",
                                        type: "post",
                                        contentType: "application/x-www-form-urlencoded",
                                        beforeSend: function beforeSend(jqxhr) {
                                            jqxhr.setRequestHeader("X-PTRACKER-APP", "mobile");
                                        },
                                        dataType: "text",
                                        timeout: 240000, // wait for 4 minutes before timeout of request
                                        processData: true,
                                        data: {}
                                    }));

                                case 16:
                                    serverResponse = _context10.sent;


                                    serverResponse = JSON.parse(serverResponse); // convert the response to JSON object

                                    $('#determinate-progress-modal #determinate-progress').get(0).value = 35;

                                    // delete all previous project data/docs
                                    _context10.next = 21;
                                    return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.find({
                                        selector: {
                                            "TYPE": {
                                                "$eq": "projects"
                                            } },
                                        fields: ["_id", "_rev", "PROJECTID", "TITLE", "CONTRACTSUM", "CONTRACTOR", "CONTRACTORID", "MDAID", "TYPE"],
                                        use_index: ["ptracker-index-designdoc", "DOC_TYPE_INDEX"]
                                    });

                                case 21:
                                    allProjects = _context10.sent;


                                    // get all the returned projects and delete them
                                    allProjects = allProjects.docs.map(function (currentValue, index, array) {
                                        currentValue._deleted = true; // mark the document as deleted
                                        return currentValue;
                                    });

                                    // check if there are any project data to delete

                                    if (!(allProjects.length > 0)) {
                                        _context10.next = 26;
                                        break;
                                    }

                                    _context10.next = 26;
                                    return utopiasoftware[utopiasoftware_app_namespace].utilities.updateBulkDocsInBatches(500, allProjects, utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);

                                case 26:

                                    $('#determinate-progress-modal #determinate-progress').get(0).value = 45;

                                    // store the all the project data received
                                    _context10.next = 29;
                                    return utopiasoftware[utopiasoftware_app_namespace].utilities.updateBulkDocsInBatches(500, serverResponse, utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);

                                case 29:

                                    // inform the user that milestone data is being downloaded for offline use
                                    $('#determinate-progress-modal .modal-message').html('Downloading milestones data for offline use...');

                                    $('#determinate-progress-modal #determinate-progress').get(0).value = 50;

                                    // get the milestones data to be cached
                                    _context10.next = 33;
                                    return Promise.resolve($.ajax({
                                        url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + "/mobile/loadboq.php",
                                        type: "post",
                                        contentType: "application/x-www-form-urlencoded",
                                        beforeSend: function beforeSend(jqxhr) {
                                            jqxhr.setRequestHeader("X-PTRACKER-APP", "mobile");
                                        },
                                        dataType: "text",
                                        timeout: 240000, // wait for 4 minutes before timeout of request
                                        processData: true,
                                        data: {}
                                    }));

                                case 33:
                                    serverResponse = _context10.sent;


                                    serverResponse = JSON.parse(serverResponse); // convert the response to JSON object

                                    $('#determinate-progress-modal #determinate-progress').get(0).value = 65;

                                    // delete all previous milestones /docs
                                    _context10.next = 38;
                                    return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.find({
                                        selector: {
                                            "TYPE": {
                                                "$eq": "BOQ"
                                            } },
                                        fields: ["_id", "_rev", "CATEGORY", "AMOUNT", "RATE", "PROJECTID", "DDATE", "BOQID", "TYPE"],
                                        use_index: ["ptracker-index-designdoc", "DOC_TYPE_INDEX"]
                                    });

                                case 38:
                                    allProjects = _context10.sent;


                                    // get all the returned milestones and delete them
                                    allProjects = allProjects.docs.map(function (currentValue, index, array) {
                                        currentValue._deleted = true; // mark the document as deleted
                                        return currentValue;
                                    });

                                    // check if there are any milestone data to delete

                                    if (!(allProjects.length > 0)) {
                                        _context10.next = 43;
                                        break;
                                    }

                                    _context10.next = 43;
                                    return utopiasoftware[utopiasoftware_app_namespace].utilities.updateBulkDocsInBatches(500, allProjects, utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);

                                case 43:

                                    $('#determinate-progress-modal #determinate-progress').get(0).value = 80;

                                    // store the all the milestone data received
                                    _context10.next = 46;
                                    return utopiasoftware[utopiasoftware_app_namespace].utilities.updateBulkDocsInBatches(500, serverResponse, utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);

                                case 46:

                                    // inform the user that approved evaluation data is being downloaded for offline use
                                    $('#determinate-progress-modal .modal-message').html('Downloading approved evaluation data for offline use...');
                                    $('#determinate-progress-modal #determinate-progress').get(0).value = 85;

                                    // get previously uploaded and approved project evaluation reports
                                    _context10.next = 50;
                                    return Promise.resolve($.ajax({
                                        url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + "/mobile/load-current-evaluations.php",
                                        type: "post",
                                        contentType: "application/x-www-form-urlencoded",
                                        beforeSend: function beforeSend(jqxhr) {
                                            jqxhr.setRequestHeader("X-PTRACKER-APP", "mobile");
                                        },
                                        dataType: "text",
                                        timeout: 240000, // wait for 4 minutes before timeout of request
                                        processData: true,
                                        data: {}
                                    }));

                                case 50:
                                    serverResponse = _context10.sent;


                                    serverResponse = JSON.parse(serverResponse); // convert the response to JSON object

                                    $('#determinate-progress-modal #determinate-progress').get(0).value = 90;

                                    // delete all previously stored/cached approved project evaluation reports
                                    _context10.next = 55;
                                    return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.find({
                                        selector: {
                                            "TYPE": {
                                                "$eq": "project evaluations"
                                            } },
                                        use_index: ["ptracker-index-designdoc", "DOC_TYPE_INDEX"]
                                    });

                                case 55:
                                    allProjects = _context10.sent;


                                    // get all the returned approved evaluation report and delete them
                                    allProjects = allProjects.docs.map(function (currentValue, index, array) {
                                        currentValue._deleted = true; // mark the document as deleted
                                        return currentValue;
                                    });

                                    // check if there are any approved evaluation report to delete

                                    if (!(allProjects.length > 0)) {
                                        _context10.next = 60;
                                        break;
                                    }

                                    _context10.next = 60;
                                    return utopiasoftware[utopiasoftware_app_namespace].utilities.updateBulkDocsInBatches(500, allProjects, utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);

                                case 60:

                                    // format the retrieved evaluation report before storing in the app database
                                    serverResponse = serverResponse.map(function (currentValue, index, array) {
                                        // format/convert the EVALUATIONS field to proper json
                                        currentValue.EVALUATIONS = JSON.parse(currentValue.EVALUATIONS);
                                        return currentValue;
                                    });

                                    $('#determinate-progress-modal #determinate-progress').get(0).value = 100;

                                    // store the all the milestone data received
                                    _context10.next = 64;
                                    return utopiasoftware[utopiasoftware_app_namespace].utilities.updateBulkDocsInBatches(500, serverResponse, utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);

                                case 64:
                                    if (!(window.sessionStorage.getItem("utopiasoftware-edpms-user-logged-in") !== "yes" && !utopiasoftware[utopiasoftware_app_namespace].model.userDetails)) {
                                        _context10.next = 68;
                                        break;
                                    }

                                    _context10.next = 67;
                                    return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.get("userDetails");

                                case 67:
                                    utopiasoftware[utopiasoftware_app_namespace].model.userDetails = _context10.sent;

                                case 68:
                                    if (!(window.sessionStorage.getItem("utopiasoftware-edpms-user-logged-in") === "yes" && window.sessionStorage.getItem("utopiasoftware-edpms-refresh-page") !== "yes")) {
                                        _context10.next = 71;
                                        break;
                                    }

                                    _context10.next = 71;
                                    return Promise.all([$('#determinate-progress-modal').get(0).hide()]);

                                case 71:
                                    _context10.next = 73;
                                    return Promise.all([$('#loader-modal').get(0).hide()]);

                                case 73:

                                    // this only displays when page is NOT marked as being loaded from a user refresh request
                                    if (window.sessionStorage.getItem("utopiasoftware-edpms-refresh-page") !== "yes") {
                                        // display a toast to the user
                                        ons.notification.toast('<ons-icon icon="md-check" size="20px" style="color: #00D5C3"></ons-icon> <span style="text-transform: capitalize; display: inline-block; margin-left: 1em">Welcome ' + utopiasoftware[utopiasoftware_app_namespace].model.userDetails.userDetails.firstname + '</span>', { timeout: 3000 });
                                    }
                                    _context10.next = 82;
                                    break;

                                case 76:
                                    _context10.prev = 76;
                                    _context10.t0 = _context10['catch'](8);

                                    console.log("LOAD ERROR", _context10.t0);
                                    // display error message indicating that projects data could not be loaded
                                    $('#search-project-page .project-data-download-error').css("display", "block");
                                    $('#determinate-progress-modal').get(0).hide();
                                    $('#loader-modal').get(0).hide();

                                case 82:
                                    _context10.prev = 82;

                                    // clear the page refresh marker from device session storage
                                    window.sessionStorage.removeItem("utopiasoftware-edpms-refresh-page");
                                    window.plugins.insomnia.allowSleepAgain(); // the device can go to sleep now
                                    return _context10.finish(82);

                                case 86:
                                case 'end':
                                    return _context10.stop();
                            }
                        }
                    }, _callee10, this, [[8, 76, 82, 86]]);
                }));

                return function loadPageOnAppReady() {
                    return _ref10.apply(this, arguments);
                };
            }();

            var $thisPage = $(event.target); // get the current page shown
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();
        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function pageShow() {
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // adjust the window/view-port settings for when the soft keyboard is displayed
            window.SoftInputMode.set('adjustPan'); // let the window/view-port 'pan' when the soft keyboard is displayed
        },

        /**
         * method is triggered when page is hidden
         */
        pageHide: function pageHide() {
            // adjust the window/view-port settings for when the soft keyboard is displayed
            // window.SoftInputMode.set('adjustResize'); // let the view 'resize' when the soft keyboard is displayed
            try {
                // remove any tooltip being displayed on all forms on the page
                $('#search-project-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                $('#search-project-page [data-hint]').removeAttr("data-hint");
                // reset the form validator object on the page
                utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.formValidator.reset();
            } catch (err) {}
        },

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function pageDestroy() {
            // remove any tooltip being displayed on all forms on the page
            $('#search-project-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
            $('#search-project-page [data-hint]').removeAttr("data-hint");
            // reset the form validator object on the page
            utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.formValidator.destroy();
            // destroy the currently selected project object
            utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.currentlySelectedProject = null;
        },

        /**
         * method is triggered when the "Project Search" button is clicked
         *
         * @returns {Promise<void>}
         */
        searchButtonClicked: function () {
            var _ref11 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(keyEvent) {
                return regeneratorRuntime.wrap(function _callee11$(_context11) {
                    while (1) {
                        switch (_context11.prev = _context11.next) {
                            case 0:

                                // check which key was pressed
                                if (keyEvent.which === kendo.keys.ENTER) // if the enter key was pressed
                                    {
                                        // run the validation method for the project search form
                                        utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.formValidator.whenValidate();
                                        keyEvent.preventDefault();
                                        keyEvent.stopImmediatePropagation();
                                        keyEvent.stopPropagation();
                                    }

                            case 1:
                            case 'end':
                                return _context11.stop();
                        }
                    }
                }, _callee11, this);
            }));

            function searchButtonClicked(_x2) {
                return _ref11.apply(this, arguments);
            }

            return searchButtonClicked;
        }(),


        /**
         * method is triggered when the download of projects data fails and
         * the user hits the "Please Retry" button
         *
         * @returns {Promise<void>}
         */
        retryProjectDataDownloadButtonClicked: function () {
            var _ref12 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12() {
                return regeneratorRuntime.wrap(function _callee12$(_context12) {
                    while (1) {
                        switch (_context12.prev = _context12.next) {
                            case 0:

                                // hide the page preloader
                                $('#search-project-page .page-preloader').css("display", "none");
                                // hide the previous project details being displayed
                                $('#search-project-page #search-project-details').css("display", "none");
                                // hide all previous error messages (if any)
                                $('#search-project-page .no-project-found').css("display", "none");
                                $('#search-project-page .project-data-download-error').css("display", "none");
                                // hide the device keyboard
                                Keyboard.hide();

                                _context12.prev = 5;
                                _context12.next = 8;
                                return utopiasoftware[utopiasoftware_app_namespace].appCachedData.loadProjectData(true);

                            case 8:
                                // error the project data download error message
                                $('#search-project-page .project-data-download-error').css("display", "none");
                                _context12.next = 14;
                                break;

                            case 11:
                                _context12.prev = 11;
                                _context12.t0 = _context12['catch'](5);

                                // display the project data download error message
                                $('#search-project-page .project-data-download-error').css("display", "block");

                            case 14:
                            case 'end':
                                return _context12.stop();
                        }
                    }
                }, _callee12, this, [[5, 11]]);
            }));

            function retryProjectDataDownloadButtonClicked() {
                return _ref12.apply(this, arguments);
            }

            return retryProjectDataDownloadButtonClicked;
        }(),


        /**
         * method is triggered when the project search search/find form is successfully validated
         * @returns {Promise<void>}
         */
        formValidated: function () {
            var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13() {
                var dbQueryResult, searchedProjectDetails;
                return regeneratorRuntime.wrap(function _callee13$(_context13) {
                    while (1) {
                        switch (_context13.prev = _context13.next) {
                            case 0:
                                // show the page preloader
                                $('#search-project-page .page-preloader').css("display", "block");
                                // hide the previous project details being displayed
                                $('#search-project-page #search-project-details').css("display", "none");
                                // hide all previous error messages (if any)
                                $('#search-project-page .no-project-found').css("display", "none");
                                $('#search-project-page .project-data-download-error').css("display", "none");
                                // hide the bottom toolbar of the page
                                $('#search-project-page ons-bottom-toolbar').css("display", "none");

                                // hide the device keyboard
                                Keyboard.hide();

                                _context13.prev = 6;
                                _context13.next = 9;
                                return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.find({
                                    selector: {
                                        "PROJECTID": {
                                            "$eq": $('#search-project-page #search-project-search-input').get(0).value.trim().toLocaleUpperCase()
                                        },
                                        "TYPE": {
                                            "$eq": "projects"
                                        } },
                                    fields: ["_id", "_rev", "PROJECTID", "TITLE", "CONTRACTSUM", "CONTRACTOR", "CONTRACTORID", "MDAID", "TYPE"],
                                    use_index: ["ptracker-index-designdoc", "FIND_PROJECT_BY_ID_INDEX"]
                                });

                            case 9:
                                dbQueryResult = _context13.sent;

                                if (!(dbQueryResult.docs.length == 0)) {
                                    _context13.next = 17;
                                    break;
                                }

                                // search project was NOT FOUND
                                // hide the page preloader
                                $('#search-project-page .page-preloader').css("display", "none");
                                // inform user that no project was found
                                $('#search-project-page .no-project-found').css("display", "block");
                                // hide the previous project details being displayed
                                $('#search-project-page #search-project-details').css("display", "none");
                                // hide all previous error messages
                                $('#search-project-page .project-data-download-error').css("display", "none");
                                // hide the bottom toolbar of the page
                                $('#search-project-page ons-bottom-toolbar').css("display", "none");
                                return _context13.abrupt('return');

                            case 17:

                                // if the method gets to this point, it means a project was found
                                // assign the searched project object as the currently searched and chosen project object
                                utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.currentlySelectedProject = dbQueryResult.docs[0];
                                // create the searched project details to be displayed
                                searchedProjectDetails = '<div class="col-xs-6" style="font-weight: bold; color: #000000; padding: 1rem;">Project ID</div>';

                                searchedProjectDetails += '<div class="col-xs-6" style="color: #000000; text-transform: uppercase; padding: 1rem;">' + dbQueryResult.docs[0].PROJECTID + '</div>';
                                searchedProjectDetails += '<div class="col-xs-6" style="font-weight: bold; color: #000000; padding: 1rem;">Title</div>';
                                searchedProjectDetails += '<div class="col-xs-6" style="color: #000000; text-transform: capitalize; padding: 1rem;">' + dbQueryResult.docs[0].TITLE + '</div>';
                                searchedProjectDetails += '<div class="col-xs-6" style="font-weight: bold; color: #000000; padding: 1rem;">Contractor</div>';
                                searchedProjectDetails += '<div class="col-xs-6" style="color: #000000; text-transform: capitalize; padding: 1rem;">' + dbQueryResult.docs[0].CONTRACTOR + '</div>';
                                searchedProjectDetails += '<div class="col-xs-6" style="font-weight: bold; color: #000000; padding: 1rem;">Contract Sum</div>';
                                searchedProjectDetails += '<div class="col-xs-6" style="color: #000000; text-transform: capitalize; padding: 1rem;">' + kendo.toString(kendo.parseFloat(dbQueryResult.docs[0].CONTRACTSUM), "n2") + '</div>';

                                // attach the generated project details to the page
                                $('#search-project-page #search-project-details').html(searchedProjectDetails);

                                // hide the page preloader
                                $('#search-project-page .page-preloader').css("display", "none");

                                // perform actions to reveal result
                                kendo.fx($('#search-project-page #search-project-details')).fade("in").duration(550).play();
                                _context13.next = 31;
                                return Promise.resolve(kendo.fx($('#search-project-page ons-bottom-toolbar')).slideIn("up").duration(600).play());

                            case 31:
                                $('#search-project-page ons-bottom-toolbar').css("display", "block");
                                _context13.next = 41;
                                break;

                            case 34:
                                _context13.prev = 34;
                                _context13.t0 = _context13['catch'](6);

                                // hide the page preloader
                                $('#search-project-page .page-preloader').css("display", "none");
                                // inform user that no project was found
                                $('#search-project-page .no-project-found').css("display", "block");
                                // hide the previous project details being displayed
                                $('#search-project-page #search-project-details').css("display", "none");
                                // hide the project data download error
                                $('#search-project-page .project-data-download-error').css("display", "none");
                                // hide the bottom toolbar of the page
                                $('#search-project-page ons-bottom-toolbar').css("display", "none");

                            case 41:
                            case 'end':
                                return _context13.stop();
                        }
                    }
                }, _callee13, this, [[6, 34]]);
            }));

            function formValidated() {
                return _ref13.apply(this, arguments);
            }

            return formValidated;
        }(),


        /**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */
        backButtonClicked: function backButtonClicked() {

            // check if the side menu is open
            if ($('ons-splitter').get(0).right.isOpen) {
                // side menu open, so close it
                $('ons-splitter').get(0).right.close();
                return; // exit the method
            }

            ons.notification.confirm('Do you want to close the app?', { title: 'Exit App',
                buttonLabels: ['No', 'Yes'], modifier: 'utopiasoftware-alert-dialog' }) // Ask for confirmation
            .then(function (index) {
                if (index === 1) {
                    // OK button
                    navigator.app.exitApp(); // Close the app
                }
            });
        },


        /**
         * method is triggered when the 'Proceed' button is clicked
         */
        proceedButtonClicked: function proceedButtonClicked() {

            // move to the project evaluation page. Also pass along the currently chosen project object
            $('#app-main-navigator').get(0).pushPage("project-evaluation-page.html", { animation: "lift-md",
                data: { projectData: utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.currentlySelectedProject } });
        }
    },

    /**
     * this is the view-model/controller for the Project Evaluation page
     */
    projectEvaluationPageViewModel: {

        /**
         * used to hold the parsley form validation object for the page
         */
        formValidator: null,

        /**
         * used to hold the Viewer object used to display the evaluations snapshots
         */
        pictureViewer: null,

        /**
         * used to hold the retrieved project milestones
         */
        projectMilestones: null,

        /**
         * holds the project picturesUrls array.
         * the 1st element of the array is ALWAYS null with subsequent elements holds the url for the pictures
         */
        projectPicturesUrls: [null],

        /**
         * holds the Google Map object used to display the current location of the project being evaluated
         */
        projectEvaluationMap: null,

        /**
         * holds the Geo location object for the project. The object is gotten from the device's GPS
         */
        projectGeoPosition: null,

        /**
         * this property indicates if the picture viewer widget is being displayed or not
         */
        isPictureViewerShowing: false,

        /**
         * property indicates if project evaluation has commenced on the selected/chosen project.
         * Project evaluation is marked has 'started' if any of the initial states for evaluation is changed by the user
         */
        hasProjectEvaluationStarted: false,

        /**
         * event is triggered when page is initialised
         */
        pageInit: function pageInit(event) {

            //function is used to initialise the page if the app is fully ready for execution
            var loadPageOnAppReady = function () {
                var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14() {
                    var projectData, dbQueryResult, projectEvaluationsQueryResult, carouselContent, index;
                    return regeneratorRuntime.wrap(function _callee14$(_context14) {
                        while (1) {
                            switch (_context14.prev = _context14.next) {
                                case 0:
                                    if (!(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false || !ej || !Viewer)) {
                                        _context14.next = 3;
                                        break;
                                    }

                                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                                    return _context14.abrupt('return');

                                case 3:

                                    ej.base.enableRipple(true);

                                    // listen for the back button event
                                    $('#app-main-navigator').get(0).topPage.onDeviceBackButton = utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.backButtonClicked;

                                    // show the page preloader
                                    $('#project-evaluation-page .page-preloader').css("display", "block");
                                    // hide the items that are not to be displayed
                                    $('#project-evaluation-page .project-evaluation-instructions, ' + '#project-evaluation-page .no-milestone-found').css("display", "none");

                                    // pick the project data object for which milestones are to be evaluated
                                    projectData = $('#app-main-navigator').get(0).topPage.data.projectData;
                                    _context14.prev = 8;
                                    _context14.next = 11;
                                    return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.find({
                                        selector: {
                                            "BOQID": {
                                                "$exists": true
                                            },
                                            "TYPE": {
                                                "$eq": "BOQ"
                                            },
                                            "PROJECTID": {
                                                "$eq": projectData.PROJECTID
                                            }
                                        },
                                        use_index: ["ptracker-index-designdoc", "FIND_BOQ_BY_ID_INDEX"]

                                    });

                                case 11:
                                    dbQueryResult = _context14.sent;

                                    if (!(dbQueryResult.docs.length == 0)) {
                                        _context14.next = 14;
                                        break;
                                    }

                                    throw "error";

                                case 14:

                                    // if the code gets to this point, milestones were returned
                                    // sort the returned milestones array
                                    dbQueryResult.docs.sort(function (firstElem, secondElement) {
                                        return window.parseInt(firstElem.BOQID) - window.parseInt(secondElement.BOQID);
                                    });

                                    utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectMilestones = dbQueryResult.docs; // update the current project milestones

                                    // get all the previously approved and cached project evaluations belonging to the provided project id
                                    _context14.next = 18;
                                    return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.find({
                                        selector: {
                                            "PROJECTID": {
                                                "$eq": projectData.PROJECTID
                                            },
                                            "TYPE": {
                                                "$eq": "project evaluations"
                                            }
                                        },
                                        use_index: ["ptracker-index-designdoc", "FIND_PROJECT_BY_ID_INDEX"]

                                    });

                                case 18:
                                    projectEvaluationsQueryResult = _context14.sent;


                                    // create the evaluation carousel item based on the milestones retrieved
                                    carouselContent = "";

                                    for (index = 0; index < dbQueryResult.docs.length; index++) {
                                        carouselContent = '\n                        <ons-carousel-item style="overflow-y: auto">\n                            <ons-card>\n                                <div style="font-size: 1.2em">\n                                    ' + dbQueryResult.docs[index].CATEGORY + '\n                                </div>\n                                <div class="project-evaluation-slider"></div>\n                                <div class="project-evaluation-milestone-amount" style="margin-top: 1em; font-size: 1em;">\n                                    <span style="display: inline-block; font-style: italic; margin-right: 1em;">Milestone Value </span> \n                                    ' + kendo.toString(kendo.parseFloat(dbQueryResult.docs[index].AMOUNT), "n2") + '\n                                </div>\n                                <div class="project-evaluation-milestone-current-value" style="font-size: 1em;">\n                                    <span style="display: inline-block; font-style: italic; margin-right: 1em;">Value Completed </span> \n                                    ' + kendo.toString(kendo.parseFloat(0), "n2") + '\n                                </div>\n                            </ons-card>\n                        </ons-carousel-item>';
                                        $('#project-evaluation-page #project-evaluation-carousel').append(carouselContent);
                                    } // end of for loop

                                    // append the carousel content used for displaying evaluation pictures
                                    carouselContent = '\n                    <ons-carousel-item style="overflow-y: scroll">\n                        <div class="row project-evaluation-images-container" style="margin-top: 1.5em;">\n                            <div class="col-xs-6" style="padding: 0.5em; position: relative">\n                                <div style="position: absolute; top: 5px;">\n                                    <ons-speed-dial id="project-evaluation-picture-speed-dial-1" direction="down">\n                                        <ons-fab modifier="utopiasoftware-pic-capture-speed-dial"\n                                                 class="utopiasoftware-pic-capture-speed-dial" \n                                                 onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                                                 projectEvaluationPageViewModel.pictureSpeedDialClicked(1)">\n                                            <ons-icon icon="md-image-o"></ons-icon>\n                                        </ons-fab>\n                                        <ons-speed-dial-item modifier="utopiasoftware-pic-capture-speed-dial-item"\n                                                             class="utopiasoftware-pic-capture-speed-dial" \n                                                             onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                                                 projectEvaluationPageViewModel.pictureCaptureButtonClicked(1)">\n                                            <ons-icon icon="md-camera"></ons-icon>\n                                        </ons-speed-dial-item>\n                                        <ons-speed-dial-item modifier="utopiasoftware-pic-capture-speed-dial-item"\n                                                             class="utopiasoftware-pic-capture-speed-dial" \n                                                             onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                                                 projectEvaluationPageViewModel.deletePictureButtonClicked(1)">\n                                            <ons-icon icon="md-delete"></ons-icon>\n                                        </ons-speed-dial-item>\n                                    </ons-speed-dial>\n                                </div>\n                                <img id="project-evaluation-picture-1" src="css/app-images/project-evaluation-photo-placeholder.png" style="width: 100%; border: 2px darkgray groove" alt="Picture 1">\n                            </div>\n                            <div class="col-xs-6" style="padding: 0.5em; position: relative">\n                                <div style="position: absolute; top: 5px;">\n                                    <ons-speed-dial id="project-evaluation-picture-speed-dial-2" direction="down">\n                                        <ons-fab modifier="utopiasoftware-pic-capture-speed-dial"\n                                                 class="utopiasoftware-pic-capture-speed-dial" \n                                                 onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                                                 projectEvaluationPageViewModel.pictureSpeedDialClicked(2)">\n                                            <ons-icon icon="md-image-o"></ons-icon>\n                                        </ons-fab>\n                                        <ons-speed-dial-item modifier="utopiasoftware-pic-capture-speed-dial-item"\n                                                             class="utopiasoftware-pic-capture-speed-dial" \n                                                             onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                                                 projectEvaluationPageViewModel.pictureCaptureButtonClicked(2)">\n                                            <ons-icon icon="md-camera"></ons-icon>\n                                        </ons-speed-dial-item>\n                                        <ons-speed-dial-item modifier="utopiasoftware-pic-capture-speed-dial-item"\n                                                             class="utopiasoftware-pic-capture-speed-dial" \n                                                             onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                                                 projectEvaluationPageViewModel.deletePictureButtonClicked(2)">\n                                            <ons-icon icon="md-delete"></ons-icon>\n                                        </ons-speed-dial-item>\n                                    </ons-speed-dial>\n                                </div>\n                                <img id="project-evaluation-picture-2" src="css/app-images/project-evaluation-photo-placeholder.png" style="width: 100%; border: 2px darkgray groove" alt="Picture 2">\n                            </div>\n                            <div class="col-xs-offset-3 col-xs-6" style="padding: 0.5em; position: relative">\n                                <div style="position: absolute; top: 5px;">\n                                    <ons-speed-dial id="project-evaluation-picture-speed-dial-3" direction="down">\n                                        <ons-fab modifier="utopiasoftware-pic-capture-speed-dial"\n                                                 class="utopiasoftware-pic-capture-speed-dial" \n                                                 onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                                                 projectEvaluationPageViewModel.pictureSpeedDialClicked(3)">\n                                            <ons-icon icon="md-image-o"></ons-icon>\n                                        </ons-fab>\n                                        <ons-speed-dial-item modifier="utopiasoftware-pic-capture-speed-dial-item"\n                                                             class="utopiasoftware-pic-capture-speed-dial" \n                                                             onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                                                 projectEvaluationPageViewModel.pictureCaptureButtonClicked(3)">\n                                            <ons-icon icon="md-camera"></ons-icon>\n                                        </ons-speed-dial-item>\n                                        <ons-speed-dial-item modifier="utopiasoftware-pic-capture-speed-dial-item"\n                                                             class="utopiasoftware-pic-capture-speed-dial" \n                                                             onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                                                 projectEvaluationPageViewModel.deletePictureButtonClicked(3)">\n                                            <ons-icon icon="md-delete"></ons-icon>\n                                        </ons-speed-dial-item>\n                                    </ons-speed-dial>\n                                </div>\n                                <img id="project-evaluation-picture-3" src="css/app-images/project-evaluation-photo-placeholder.png" style="width: 100%; border: 2px darkgray groove" alt="Picture 3">\n                            </div>\n                        </div>\n                    </ons-carousel-item>';
                                    // append the generated carousel content to the project evaluation carousel
                                    $('#project-evaluation-page #project-evaluation-carousel').append(carouselContent);

                                    // append the carousel content used for displaying project location on a map
                                    carouselContent = '\n                    <ons-carousel-item style="position: relative;">\n                        <div id="project-evaluation-map" style="position: absolute; top: 0; left: 0; width: 100%; \n                            height: 100%; bottom: 0; border: 1px #00d5c3 solid; text-align: center;">\n                            <ons-button style="background-color: #3f51b5; position: relative; top: 3px;\n                            display: inline-block;"\n                            onclick="utopiasoftware[utopiasoftware_app_namespace].\n                            controller.projectEvaluationPageViewModel.getProjectGeoLocationButtonClicked()">Get Project Location</ons-button>\n                            <div id="project-evaluation-gps-progress" \n                            style="position: relative; display: none; top: 65px; text-align: center">\n                                <ons-progress-circular indeterminate modifier="project-gps-location-progress"></ons-progress-circular>\n                            </div>\n                            <div id="project-evaluation-gps-location-tag" style="color: #ffffff; \n                            font-weight: bold; font-size: 0.8em; text-transform: uppercase; \n                            background-color: rgba(0,213,195,0.80); padding: 0.6em; border-radius: 10px; \n                            width: 80%; position: absolute; bottom: 2px; display: inline-block; \n                            left: 10%; \n                            overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Location:</div>\n                        </div>\n                    </ons-carousel-item>';
                                    // append the generated carousel content to the project evaluation carousel
                                    $('#project-evaluation-page #project-evaluation-carousel').append(carouselContent);

                                    // append the carousel content used for displaying project remarks textarea
                                    carouselContent = '\n                    <ons-carousel-item style="overflow-y: auto">\n                        <textarea id="project-evaluation-remarks" spellcheck="true" \n                        style="width: 80%; height: 4em; margin-left: 10%;\n                        margin-right: 10%; border: none; border-bottom: 2px #00D5C3 solid; \n                        border-left: 2px #00D5C3 solid; border-right: 2px #00D5C3 solid; \n                        background-color: transparent;"></textarea>\n                    </ons-carousel-item>';
                                    // append the generated carousel content to the project evaluation carousel
                                    $('#project-evaluation-page #project-evaluation-carousel').append(carouselContent);

                                    // create the project evaluation slider elements
                                    $('#project-evaluation-page .project-evaluation-slider').each(function (index, element) {

                                        element._ptracker_index = index; //  store the index position of the element within the collection on the element itself
                                        var previousSliderValue = null; // holds the slider value gotten from previously saved evaluations

                                        if (!projectEvaluationsQueryResult.docs[0]) {
                                            previousSliderValue = null; // if there are no saved approved project evaluations, then set value to null
                                        } else {
                                            // there are saved/cached approved project evaluations
                                            // get the saved and approved milestone score from the approved project evaluations
                                            previousSliderValue = projectEvaluationsQueryResult.docs[0].EVALUATIONS.find(function (currentValue, index2) {
                                                // check if any of the approved evaluation reports are for any of the milestones to be currently viewed
                                                if (window.parseInt(currentValue.milestoneId) === window.parseInt(dbQueryResult.docs[element._ptracker_index].BOQID)) {
                                                    return true; // this approved evaluation reports are for the currently viewed milestone
                                                }
                                            });
                                        }

                                        if (previousSliderValue) {
                                            // if previously slider value is an object, get the previous evaluation score
                                            previousSliderValue = window.parseInt(previousSliderValue.milestoneScore); // update to the previous score
                                        }
                                        // create each milestone evaluation slider
                                        var aSlider = new ej.inputs.Slider({
                                            min: 0,
                                            max: 100,
                                            value: previousSliderValue || 0,
                                            limits: {
                                                enabled: true,
                                                minStart: previousSliderValue || 0,
                                                minEnd: 100
                                            },
                                            step: 1,
                                            orientation: 'Horizontal',
                                            type: 'MinRange',
                                            created: function created() {
                                                // write the value on the slider handle element
                                                $('.e-handle', element).text(this.value);
                                                // update the milestone current value
                                                $('.project-evaluation-milestone-current-value', $(element).closest('ons-card')).html('<span style="display: inline-block; font-style: italic; margin-right: 1em;">Value Completed </span> \n                                    ' + kendo.toString(kendo.parseFloat(this.value / 100 * kendo.parseFloat(dbQueryResult.docs[element._ptracker_index].AMOUNT)), "n2"));
                                            },
                                            change: function change(changeEvent) {
                                                $('.e-handle', element).text(changeEvent.value);
                                                // update the project evaluation started flag to indicate evaluation has started
                                                utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.hasProjectEvaluationStarted = true;
                                            },
                                            changed: function changed(changedEvent) {
                                                // update the milestone current value based on changes in the slider
                                                $('.project-evaluation-milestone-current-value', $(element).closest('ons-card')).html('<span style="display: inline-block; font-style: italic; margin-right: 1em;">Value Completed </span> \n                                    ' + kendo.toString(kendo.parseFloat(changedEvent.value / 100 * kendo.parseFloat(dbQueryResult.docs[element._ptracker_index].AMOUNT)), "n2"));
                                            }
                                        });
                                        aSlider.appendTo(element);
                                        element._ptracker_slider = aSlider;
                                    });

                                    // create the Viewer widget used to view the project evaluation photos
                                    utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.pictureViewer = new Viewer($('#project-evaluation-page .project-evaluation-images-container').get(0), { inline: false,
                                        toolbar: {
                                            prev: {
                                                show: true,
                                                size: 'large'
                                            },
                                            next: {
                                                show: true,
                                                size: 'large'
                                            },
                                            zoomIn: {
                                                show: true,
                                                size: 'large'
                                            },
                                            zoomOut: {
                                                show: true,
                                                size: 'large'
                                            },
                                            oneToOne: {
                                                show: true,
                                                size: 'large'
                                            },
                                            reset: {
                                                show: true,
                                                size: 'large'
                                            },
                                            play: {
                                                show: false,
                                                size: 'large'
                                            },
                                            rotateLeft: {
                                                show: false,
                                                size: 'large'
                                            },
                                            rotateRight: {
                                                show: false,
                                                size: 'large'
                                            },
                                            flipHorizontal: {
                                                show: false,
                                                size: 'large'
                                            },
                                            flipVertical: {
                                                show: false,
                                                size: 'large'
                                            }
                                        },
                                        backdrop: 'static',
                                        shown: function shown() {
                                            // event is triggered when Picture Viewer is shown
                                            // indicate that the picture viewer widget is showing
                                            utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.isPictureViewerShowing = true;
                                        },
                                        hidden: function hidden() {
                                            // event is triggered when Picture Viewer is hidden
                                            // indicate that the picture viewer widget is hidden
                                            utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.isPictureViewerShowing = false;
                                        } });

                                    // hide the page preloader
                                    $('#project-evaluation-page .page-preloader').css("display", "none");
                                    // show the items that are to be displayed
                                    $('#project-evaluation-page .project-evaluation-instructions, #project-evaluation-page .content').css("display", "block");
                                    $('#project-evaluation-page #project-evaluation-next-button').css("display", "inline-block");
                                    _context14.next = 40;
                                    break;

                                case 34:
                                    _context14.prev = 34;
                                    _context14.t0 = _context14['catch'](8);

                                    // hide the page preloader
                                    $('#project-evaluation-page .page-preloader').css("display", "none");
                                    // hide the items that are not to be displayed
                                    $('#project-evaluation-page .project-evaluation-instructions, #project-evaluation-page .content').css("display", "none");
                                    $('#project-evaluation-page #project-evaluation-prev-button, #project-evaluation-page #project-evaluation-next-button').css("display", "none");
                                    // display the message to inform user that there are no milestones available for the project
                                    $('#project-evaluation-page .no-milestone-found').css("display", "block");

                                case 40:
                                    _context14.prev = 40;

                                    // hide the loader
                                    $('#loader-modal').get(0).hide();
                                    return _context14.finish(40);

                                case 43:
                                case 'end':
                                    return _context14.stop();
                            }
                        }
                    }, _callee14, this, [[8, 34, 40, 43]]);
                }));

                return function loadPageOnAppReady() {
                    return _ref14.apply(this, arguments);
                };
            }();

            var $thisPage = $(event.target); // get the current page shown
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();
        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function pageShow() {
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // adjust the window/view-port settings for when the soft keyboard is displayed
            window.SoftInputMode.set('adjustPan'); // let the window/view-port 'pan' when the soft keyboard is displayed
        },

        /**
         * method is triggered when page is hidden
         */
        pageHide: function pageHide() {
            // adjust the window/view-port settings for when the soft keyboard is displayed
            // window.SoftInputMode.set('adjustResize'); // let the view 'resize' when the soft keyboard is displayed

            // REMOVE the app background transparency, map np longer showing
            $('html, body').removeClass('utopiasoftware-transparent');

            // check if Map already exists and is ready to be used
            if (utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectEvaluationMap && utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectEvaluationMap._ptracker_isMapReady === true) {
                // hide the map object
                utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectEvaluationMap.setVisible(false);
            }
        },

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function pageDestroy() {
            // destroy the pictures Viewer widget instance
            if (utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.pictureViewer) {
                utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.pictureViewer.destroy();
            }
            // reset other object properties
            utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectMilestones = null;
            utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectPicturesUrls = [null];
            utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.hasProjectEvaluationStarted = false;

            // check if Map already exists and is ready to be used
            if (utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectEvaluationMap && utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectEvaluationMap._ptracker_isMapReady === true) {
                utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectEvaluationMap.remove();
            }

            utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectEvaluationMap = null;
            utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectGeoPosition = null;

            // destroy slider widgets created
            $('#project-evaluation-page .project-evaluation-slider').each(function (index, element) {
                // destroy the slider widget attached to this element
                element._ptracker_slider.destroy();
                element._ptracker_slider = null;
            });
        },

        /**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */
        backButtonClicked: function () {
            var _ref15 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15() {
                var leaveProjectEvaluation;
                return regeneratorRuntime.wrap(function _callee15$(_context15) {
                    while (1) {
                        switch (_context15.prev = _context15.next) {
                            case 0:
                                if (!$('ons-splitter').get(0).right.isOpen) {
                                    _context15.next = 3;
                                    break;
                                }

                                // side menu open, so close it
                                $('ons-splitter').get(0).right.close();
                                return _context15.abrupt('return');

                            case 3:
                                if (!(utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.isPictureViewerShowing === true)) {
                                    _context15.next = 6;
                                    break;
                                }

                                // Picture Viewer is showing
                                // hide it
                                utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.pictureViewer.hide();
                                return _context15.abrupt('return');

                            case 6:
                                if (!( // update the project evaluation started flag to indicate evaluation has started
                                utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.hasProjectEvaluationStarted === true)) {
                                    _context15.next = 12;
                                    break;
                                }

                                _context15.next = 9;
                                return ons.notification.confirm('', { title: '<ons-icon icon="md-alert-triangle" style="color: #3f51b5" size="33px"></ons-icon> <span style="color: #3f51b5; display: inline-block; margin-left: 1em;">Warning</span>',
                                    messageHTML: 'You have NOT completed the evaluation. If you leave now, all evaluation data will be cancelled.<br><br> Do you want to leave the project evaluation?',
                                    buttonLabels: ['No', 'Yes'], modifier: 'utopiasoftware-alert-dialog' });

                            case 9:
                                leaveProjectEvaluation = _context15.sent;

                                if (!(leaveProjectEvaluation == 0)) {
                                    _context15.next = 12;
                                    break;
                                }

                                return _context15.abrupt('return');

                            case 12:

                                // move to the project evaluation page
                                $('#app-main-navigator').get(0).popPage();

                            case 13:
                            case 'end':
                                return _context15.stop();
                        }
                    }
                }, _callee15, this);
            }));

            function backButtonClicked() {
                return _ref15.apply(this, arguments);
            }

            return backButtonClicked;
        }(),


        /**
         * method is used to control the behaviour of the picture speed dials
         *
         * @param pictureNumber {Integer} holds the number/position of the picture.
         * The position of pictures starts from 1 (i.e. 1-based counting)
         */
        pictureSpeedDialClicked: function pictureSpeedDialClicked(pictureNumber) {

            // handler conditions for each picture speed-dial
            switch (pictureNumber) {// determine what to do based on the picture number value

                case 1:
                    // check if the speed-dial widget that was clicked is currently opened
                    if (!$('#project-evaluation-page #project-evaluation-picture-speed-dial-1').get(0).isOpen()) {
                        // speed-dial is open
                        // close all other picture speed-dials
                        $('#project-evaluation-page #project-evaluation-picture-speed-dial-2').get(0).hideItems();
                        $('#project-evaluation-page #project-evaluation-picture-speed-dial-3').get(0).hideItems();
                    }
                    break;

                case 2:
                    if (!$('#project-evaluation-page #project-evaluation-picture-speed-dial-2').get(0).isOpen()) {
                        // speed-dial is open
                        // close all other picture speed-dials
                        $('#project-evaluation-page #project-evaluation-picture-speed-dial-1').get(0).hideItems();
                        $('#project-evaluation-page #project-evaluation-picture-speed-dial-3').get(0).hideItems();
                    }
                    break;

                case 3:
                    if (!$('#project-evaluation-page #project-evaluation-picture-speed-dial-3').get(0).isOpen()) {
                        // speed-dial is open
                        // close all other picture speed-dials
                        $('#project-evaluation-page #project-evaluation-picture-speed-dial-1').get(0).hideItems();
                        $('#project-evaluation-page #project-evaluation-picture-speed-dial-2').get(0).hideItems();
                    }
                    break;
            }
        },


        /**
         * method is used to capture project evaluation photos with the user's camera
         *
         * @param pictureNumber {Integer} holds the number/position of the picture.
         * The position of pictures starts from 1 (i.e. 1-based counting)
         */
        pictureCaptureButtonClicked: function () {
            var _ref16 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(pictureNumber) {
                var permissionStatuses, imageUrl;
                return regeneratorRuntime.wrap(function _callee16$(_context16) {
                    while (1) {
                        switch (_context16.prev = _context16.next) {
                            case 0:
                                permissionStatuses = null; // holds the statuses of the runtime permissions requested

                                _context16.prev = 1;
                                _context16.next = 4;
                                return new Promise(function (resolve, reject) {
                                    cordova.plugins.diagnostic.requestRuntimePermissions(resolve, reject, [cordova.plugins.diagnostic.permission.CAMERA]);
                                });

                            case 4:
                                permissionStatuses = _context16.sent;

                                if (!(!permissionStatuses || permissionStatuses[cordova.plugins.diagnostic.permission.CAMERA] !== cordova.plugins.diagnostic.permissionStatus.GRANTED)) {
                                    _context16.next = 7;
                                    break;
                                }

                                throw "error - no runtime permissions";

                            case 7:

                                // disable screen orientation lock
                                screen.orientation.unlock();

                                // open the device camera app and capture a photo
                                _context16.next = 10;
                                return new Promise(function (resolve, reject) {
                                    navigator.camera.getPicture(resolve, reject, {
                                        quality: 70,
                                        destinationType: Camera.DestinationType.FILE_URI,
                                        sourceType: Camera.PictureSourceType.CAMERA,
                                        allowEdit: false,
                                        encodingType: Camera.EncodingType.JPEG,
                                        correctOrientation: false,
                                        saveToPhotoAlbum: false,
                                        cameraDirection: Camera.Direction.BACK
                                    });
                                });

                            case 10:
                                imageUrl = _context16.sent;
                                _context16.t0 = pictureNumber;
                                _context16.next = _context16.t0 === 1 ? 14 : _context16.t0 === 2 ? 17 : _context16.t0 === 3 ? 20 : 23;
                                break;

                            case 14:
                                // store the image url in the correct picturesUrls array index
                                utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectPicturesUrls[pictureNumber] = imageUrl;
                                // update the image src for the correct project picture, so that picture can be displayed
                                $('#project-evaluation-page #project-evaluation-picture-1').attr("src", imageUrl);
                                return _context16.abrupt('break', 23);

                            case 17:
                                // store the image url in the correct picturesUrls array index
                                utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectPicturesUrls[pictureNumber] = imageUrl;
                                // update the image src for the correct project picture, so that picture can be displayed
                                $('#project-evaluation-page #project-evaluation-picture-2').attr("src", imageUrl);
                                return _context16.abrupt('break', 23);

                            case 20:
                                // store the image url in the correct picturesUrls array index
                                utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectPicturesUrls[pictureNumber] = imageUrl;
                                // update the image src for the correct project picture, so that picture can be displayed
                                $('#project-evaluation-page #project-evaluation-picture-3').attr("src", imageUrl);
                                return _context16.abrupt('break', 23);

                            case 23:

                                // update the project evaluation started flag to indicate evaluation has started
                                utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.hasProjectEvaluationStarted = true;

                                // update the picture viewer widget
                                utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.pictureViewer.update();
                                _context16.next = 30;
                                break;

                            case 27:
                                _context16.prev = 27;
                                _context16.t1 = _context16['catch'](1);

                                // inform the user of the error
                                window.plugins.toast.showWithOptions({
                                    message: "Photo Capture Failed - " + _context16.t1,
                                    duration: 4000,
                                    position: "top",
                                    styling: {
                                        opacity: 1,
                                        backgroundColor: '#ff0000', //red
                                        textColor: '#FFFFFF',
                                        textSize: 14
                                    }
                                }, function (toastEvent) {
                                    if (toastEvent && toastEvent.event == "touch") {
                                        // user tapped the toast, so hide toast immediately
                                        window.plugins.toast.hide();
                                    }
                                });

                            case 30:
                                _context16.prev = 30;

                                // lock the device orientation back to 'portrait'
                                screen.orientation.lock('portrait');
                                return _context16.finish(30);

                            case 33:
                            case 'end':
                                return _context16.stop();
                        }
                    }
                }, _callee16, this, [[1, 27, 30, 33]]);
            }));

            function pictureCaptureButtonClicked(_x3) {
                return _ref16.apply(this, arguments);
            }

            return pictureCaptureButtonClicked;
        }(),


        /**
         * method is used to delete/remove project evaluation photos from the collection and display
         *
         * @param pictureNumber {Integer} holds the number/position of the picture.
         * The position of pictures starts from 1 (i.e. 1-based counting)
         */
        deletePictureButtonClicked: function () {
            var _ref17 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(pictureNumber) {
                var deletePhoto;
                return regeneratorRuntime.wrap(function _callee17$(_context17) {
                    while (1) {
                        switch (_context17.prev = _context17.next) {
                            case 0:
                                if (utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectPicturesUrls[pictureNumber]) {
                                    _context17.next = 2;
                                    break;
                                }

                                return _context17.abrupt('return');

                            case 2:
                                _context17.next = 4;
                                return ons.notification.confirm('Do you want to delete the photo?', { title: '<ons-icon icon="md-delete" style="color: #3f51b5" size="33px"></ons-icon> <span style="color: #3f51b5; display: inline-block; margin-left: 1em;">Delete Photo</span>',
                                    buttonLabels: ['No', 'Yes'], modifier: 'utopiasoftware-alert-dialog' });

                            case 4:
                                deletePhoto = _context17.sent;

                                if (!(deletePhoto == 0)) {
                                    _context17.next = 7;
                                    break;
                                }

                                return _context17.abrupt('return');

                            case 7:

                                // remove the image url in the correct picturesUrls array index
                                utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectPicturesUrls[pictureNumber] = null;
                                // update the image src to the "no photo" display
                                $('#project-evaluation-page #project-evaluation-picture-' + pictureNumber).attr("src", "css/app-images/project-evaluation-photo-placeholder.png");

                                // update the picture viewer widget
                                utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.pictureViewer.update();

                            case 10:
                            case 'end':
                                return _context17.stop();
                        }
                    }
                }, _callee17, this);
            }));

            function deletePictureButtonClicked(_x4) {
                return _ref17.apply(this, arguments);
            }

            return deletePictureButtonClicked;
        }(),


        /**
         * method is used to retrieve the project location by using the current GPS location of the device
         *
         * @returns {Promise<void>}
         */
        getProjectGeoLocationButtonClicked: function () {
            var _ref18 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18() {
                var permissionStatuses, isGPSEnabled, geoPosition, projectMarker;
                return regeneratorRuntime.wrap(function _callee18$(_context18) {
                    while (1) {
                        switch (_context18.prev = _context18.next) {
                            case 0:
                                permissionStatuses = null; // holds the statuses of the runtime permissions requested

                                _context18.prev = 1;
                                _context18.next = 4;
                                return new Promise(function (resolve, reject) {
                                    cordova.plugins.diagnostic.requestRuntimePermissions(resolve, reject, [cordova.plugins.diagnostic.permission.ACCESS_FINE_LOCATION]);
                                });

                            case 4:
                                permissionStatuses = _context18.sent;

                                if (!(!permissionStatuses || permissionStatuses[cordova.plugins.diagnostic.permission.ACCESS_FINE_LOCATION] !== cordova.plugins.diagnostic.permissionStatus.GRANTED)) {
                                    _context18.next = 7;
                                    break;
                                }

                                throw "error - no location permission";

                            case 7:
                                _context18.next = 9;
                                return new Promise(function (resolve, reject) {
                                    cordova.plugins.diagnostic.isGpsLocationEnabled(resolve, reject);
                                });

                            case 9:
                                isGPSEnabled = _context18.sent;

                                if (!(isGPSEnabled === false)) {
                                    _context18.next = 19;
                                    break;
                                }

                                _context18.next = 13;
                                return ons.notification.alert('', { title: '<ons-icon icon="md-pin" style="color: #3f51b5" size="33px"></ons-icon> <span style="color: #3f51b5; display: inline-block; margin-left: 1em;">Location Service</span>',
                                    messageHTML: 'You need to enable you device location service to capture the project location. <br>Switch to Location Settings or enable the location service directly?',
                                    buttonLabels: ['Proceed'], modifier: 'utopiasoftware-alert-dialog' });

                            case 13:
                                _context18.next = 15;
                                return new Promise(function (resolve, reject) {
                                    cordova.plugins.locationAccuracy.request(function () {
                                        resolve(true);
                                    }, function () {
                                        resolve(false);
                                    }, cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
                                });

                            case 15:
                                isGPSEnabled = _context18.sent;

                                if (!(isGPSEnabled === false)) {
                                    _context18.next = 19;
                                    break;
                                }

                                // GPS IS STILL NOT ENABLED
                                // switch to the Location Settings screen, so user can manually enable Location Services
                                cordova.plugins.diagnostic.switchToLocationSettings();

                                return _context18.abrupt('return');

                            case 19:

                                // if method get here, GPS has been successfully enabled and app has authorisation to use it
                                // show the circular progress to indicate app has started working on getting user gps
                                $('#project-evaluation-page #project-evaluation-gps-progress').css("display", "block");
                                // get project's current location using device's gps geolocation
                                _context18.next = 22;
                                return new Promise(function (resolve, reject) {
                                    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 300000, maximumAge: 5000 });
                                });

                            case 22:
                                geoPosition = _context18.sent;

                                utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectGeoPosition = geoPosition; // assign the retrieved geo position object to its appropriate object property

                                // flag that progress evaluation has started
                                utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.hasProjectEvaluationStarted = true;

                                // make the app background transparent, so the map can show
                                $('html, body').addClass('utopiasoftware-transparent');

                                // update the location tag info displayed at the bottom of screen
                                $('#project-evaluation-page #project-evaluation-gps-location-tag').html('Location: ' + geoPosition.coords.latitude + ',' + geoPosition.coords.longitude);

                                // check if Map already exists and is ready to be used

                                if (!(utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectEvaluationMap && utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectEvaluationMap._ptracker_isMapReady === true)) {
                                    _context18.next = 37;
                                    break;
                                }

                                // map has previously been created and is ready for use
                                utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectEvaluationMap.setVisible(true); // make map visible

                                // hide circular progress display
                                $('#project-evaluation-page #project-evaluation-gps-progress').css("display", "none");

                                // animate the map camera
                                _context18.next = 32;
                                return new Promise(function (resolve, reject) {
                                    utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectEvaluationMap.animateCamera({
                                        target: { lat: geoPosition.coords.latitude,
                                            lng: geoPosition.coords.longitude }
                                    }, function () {
                                        resolve();
                                    });
                                });

                            case 32:
                                _context18.next = 34;
                                return new Promise(function (resolve, reject) {
                                    utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectEvaluationMap.clear(function () {
                                        resolve();
                                    });
                                });

                            case 34:
                                projectMarker = utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectEvaluationMap.addMarker({
                                    position: {
                                        "lat": utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectGeoPosition.coords.latitude,
                                        "lng": utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectGeoPosition.coords.longitude
                                    },
                                    icon: '#00D5C3',
                                    'title': $('#app-main-navigator').get(0).topPage.data.projectData.TITLE.toLocaleUpperCase(),
                                    animation: plugin.google.maps.Animation.BOUNCE
                                });
                                // display marker info window

                                projectMarker.showInfoWindow();

                                return _context18.abrupt('return');

                            case 37:

                                // generate the geo map for the project evaluation
                                utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectEvaluationMap = plugin.google.maps.Map.getMap($('#project-evaluation-page #project-evaluation-map').get(0), {
                                    'mapType': plugin.google.maps.MapTypeId.ROADMAP,
                                    'camera': {
                                        target: {
                                            lat: geoPosition.coords.latitude,
                                            lng: geoPosition.coords.longitude
                                        },
                                        tilt: 90,
                                        zoom: 20
                                    },
                                    controls: {
                                        'compass': false,
                                        'myLocationButton': false,
                                        'myLocation': false,
                                        'indoorPicker': false,
                                        'zoom': false,
                                        'mapToolbar': false
                                    },
                                    gestures: {
                                        scroll: false,
                                        tilt: false,
                                        zoom: false,
                                        rotate: false
                                    },
                                    'preferences': {
                                        'zoom': {
                                            'minZoom': 20,
                                            'maxZoom': 30
                                        },
                                        'building': false
                                    }
                                });

                                // listen for when the map object is successfully created
                                utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectEvaluationMap.one(plugin.google.maps.event.MAP_READY, function () {
                                    // hide circular progress display
                                    $('#project-evaluation-page #project-evaluation-gps-progress').css("display", "none");
                                    // flag an internal property that indicates the the map is ready to be used
                                    utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectEvaluationMap._ptracker_isMapReady = true;
                                    // disable the ability to click on the map
                                    utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectEvaluationMap.setClickable(false);

                                    // add a marker to identify the project's location on the map
                                    var projectMarker = utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectEvaluationMap.addMarker({
                                        position: {
                                            "lat": utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectGeoPosition.coords.latitude,
                                            "lng": utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectGeoPosition.coords.longitude
                                        },
                                        icon: '#00D5C3',
                                        'title': $('#app-main-navigator').get(0).topPage.data.projectData.TITLE.toLocaleUpperCase(),
                                        animation: plugin.google.maps.Animation.BOUNCE
                                    });
                                    // display marker info window
                                    projectMarker.showInfoWindow();
                                });
                                _context18.next = 44;
                                break;

                            case 41:
                                _context18.prev = 41;
                                _context18.t0 = _context18['catch'](1);

                                // inform the user of the error
                                window.plugins.toast.showWithOptions({
                                    message: "Location Capture Failed - " + (_context18.t0.message || _context18.t0),
                                    duration: 4000,
                                    position: "top",
                                    styling: {
                                        opacity: 1,
                                        backgroundColor: '#ff0000', //red
                                        textColor: '#FFFFFF',
                                        textSize: 14
                                    }
                                }, function (toastEvent) {
                                    if (toastEvent && toastEvent.event == "touch") {
                                        // user tapped the toast, so hide toast immediately
                                        window.plugins.toast.hide();
                                    }
                                });

                            case 44:
                            case 'end':
                                return _context18.stop();
                        }
                    }
                }, _callee18, this, [[1, 41]]);
            }));

            function getProjectGeoLocationButtonClicked() {
                return _ref18.apply(this, arguments);
            }

            return getProjectGeoLocationButtonClicked;
        }(),


        /**
         * method is triggered when the "project evaluation carousel" is changed
         * @param event
         */
        carouselChanged: function () {
            var _ref19 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(event) {
                return regeneratorRuntime.wrap(function _callee19$(_context19) {
                    while (1) {
                        switch (_context19.prev = _context19.next) {
                            case 0:
                                // change the css display the prev fab button
                                $('#project-evaluation-page #project-evaluation-prev-button').css("display", "inline-block");
                                // hide the bottom toolbar of the page
                                $('#project-evaluation-page ons-bottom-toolbar').css("display", "none");

                                // REMOVE the app background transparency, map np longer showing
                                $('html, body').removeClass('utopiasoftware-transparent');

                                // update the stay of the the fab "prev" or "next" buttons
                                // check if the carousel is at the last item
                                if (event.originalEvent.activeIndex === event.originalEvent.carousel.itemCount - 1) {
                                    // this is the last carousel item, so hide the next slide button
                                    // hide the next fab button
                                    $('#project-evaluation-page #project-evaluation-next-button').css("transform", "scale(0)");
                                } else if (event.originalEvent.activeIndex === 0) {
                                    // this is the first carousel item, so hide the prev slide button
                                    // hide the prev fab button
                                    $('#project-evaluation-page #project-evaluation-prev-button').css("transform", "scale(0)");
                                } else {
                                    // this is not the first or last item
                                    $('#project-evaluation-page #project-evaluation-prev-button,#project-evaluation-page #project-evaluation-next-button').css("transform", "scale(1)");
                                }

                                // update the primary instruction and the milestone badge

                                if (!(event.originalEvent.activeIndex < utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectMilestones.length)) {
                                    _context19.next = 8;
                                    break;
                                }

                                // change the primary instructions
                                $('#project-evaluation-page #project-evaluation-primary-instruction').html('Evaluate the milestones of project completion on a scale of 0 - 100%');
                                // change the milestone number
                                $('#project-evaluation-page #project-evaluation-milestone-badge').html('Milestone ' + (event.originalEvent.activeIndex + 1));
                                return _context19.abrupt('return');

                            case 8:
                                if (!(event.originalEvent.activeIndex == utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectMilestones.length)) {
                                    _context19.next = 13;
                                    break;
                                }

                                // change the primary instructions
                                $('#project-evaluation-page #project-evaluation-primary-instruction').html('Capture the project progress in photos');
                                // change the milestone number
                                $('#project-evaluation-page #project-evaluation-milestone-badge').html('Project Photos');

                                // check if Map already exists and is ready to be used
                                if (utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectEvaluationMap && utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectEvaluationMap._ptracker_isMapReady === true) {
                                    // make the map invisible
                                    utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectEvaluationMap.setVisible(false);
                                }

                                return _context19.abrupt('return');

                            case 13:
                                if (!(event.originalEvent.activeIndex == utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectMilestones.length + 1)) {
                                    _context19.next = 18;
                                    break;
                                }

                                // change the primary instructions
                                $('#project-evaluation-page #project-evaluation-primary-instruction').html('Capture the project geographical location');
                                // change the milestone number
                                $('#project-evaluation-page #project-evaluation-milestone-badge').html('Project Location');

                                // check if Map already exists and is ready to be used
                                if (utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectEvaluationMap && utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectEvaluationMap._ptracker_isMapReady === true) {
                                    // make the app background transparent, so the map can show
                                    $('html, body').addClass('utopiasoftware-transparent');
                                    // make the map visible
                                    utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectEvaluationMap.setVisible(true);
                                }
                                return _context19.abrupt('return');

                            case 18:
                                if (!(event.originalEvent.activeIndex == utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectMilestones.length + 2)) {
                                    _context19.next = 26;
                                    break;
                                }

                                // change the primary instructions
                                $('#project-evaluation-page #project-evaluation-primary-instruction').html('Provide any remarks on the project evaluation (optional)');
                                // change the milestone number
                                $('#project-evaluation-page #project-evaluation-milestone-badge').html('Project Evaluation Remarks');

                                // display the page toolbar
                                _context19.next = 23;
                                return Promise.resolve(kendo.fx($('#project-evaluation-page ons-bottom-toolbar')).slideIn("up").duration(150).play());

                            case 23:
                                $('#project-evaluation-page ons-bottom-toolbar').css("display", "block");

                                // check if Map already exists and is ready to be used
                                if (utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectEvaluationMap && utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectEvaluationMap._ptracker_isMapReady === true) {
                                    // make the map invisible
                                    utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectEvaluationMap.setVisible(false);
                                }
                                return _context19.abrupt('return');

                            case 26:
                            case 'end':
                                return _context19.stop();
                        }
                    }
                }, _callee19, this);
            }));

            function carouselChanged(_x5) {
                return _ref19.apply(this, arguments);
            }

            return carouselChanged;
        }(),


        /**
         * method is triggered when the "prev button" for the carousel is clicked
         */
        prevButtonClicked: function prevButtonClicked() {
            $('#project-evaluation-page #project-evaluation-carousel').get(0).prev();
        },


        /**
         * method is triggered when the "next button" for the carousel is clicked
         */
        nextButtonClicked: function nextButtonClicked() {
            // get the carousel used for the project evaluation
            var carousel = $('#project-evaluation-page #project-evaluation-carousel').get(0);

            // check which carousel index the user is on
            if (carousel.getActiveIndex() === utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectMilestones.length) // the user is on the picture capture carousel index
                {
                    // check if any photos have been taken at all
                    if (utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectPicturesUrls.length === 1) {
                        // if the length of array is 1, no photos have been taken at all
                        // inform the user of the validation error
                        window.plugins.toast.showWithOptions({
                            message: 'Pictures not captured for project evaluation. Please take photo',
                            duration: 4000,
                            position: "center",
                            styling: {
                                opacity: 1,
                                backgroundColor: '#ff0000', //red
                                textColor: '#FFFFFF',
                                textSize: 14
                            }
                        }, function (toastEvent) {
                            if (toastEvent && toastEvent.event == "touch") {
                                // user tapped the toast, so hide toast immediately
                                window.plugins.toast.hide();
                            }
                        });

                        return; // exit method
                    }

                    // loop through the photos for the project and check if all project photos have been taken
                    for (var index = 1; index < 4; index++) {

                        // check if the photo in this index has been taken OR not
                        if (!utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectPicturesUrls[index]) {

                            // inform the user of the validation error
                            window.plugins.toast.showWithOptions({
                                message: 'Picture ' + index + ' not captured for project evaluation. Please take photo',
                                duration: 4000,
                                position: "center",
                                styling: {
                                    opacity: 1,
                                    backgroundColor: '#ff0000', //red
                                    textColor: '#FFFFFF',
                                    textSize: 14
                                }
                            }, function (toastEvent) {
                                if (toastEvent && toastEvent.event == "touch") {
                                    // user tapped the toast, so hide toast immediately
                                    window.plugins.toast.hide();
                                }
                            });

                            return; // exit method
                        } // end of if
                    } // end of for loop
                }

            if (carousel.getActiveIndex() === utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectMilestones.length + 1) // the user is on the project location capture carousel index
                {
                    // check if the geo location in this index has been taken OR not
                    if (!utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectGeoPosition) {

                        // inform the user of validation error
                        window.plugins.toast.showWithOptions({
                            message: 'Project Location not captured for project evaluation. Please capture location',
                            duration: 4000,
                            position: "center",
                            styling: {
                                opacity: 1,
                                backgroundColor: '#ff0000', //red
                                textColor: '#FFFFFF',
                                textSize: 14
                            }
                        }, function (toastEvent) {
                            if (toastEvent && toastEvent.event == "touch") {
                                // user tapped the toast, so hide toast immediately
                                window.plugins.toast.hide();
                            }
                        });

                        return; // exit method
                    }
                }

            // ALL VALIDATION SUCCESSFUL. Move to the next carousel item
            carousel.next();
        },


        /**
         * method is triggered when the "Save Report" Button is clicked
         */
        saveReportButtonClicked: function () {
            var _ref20 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20() {
                var _this = this;

                var projectEvaluationReportData, jQuerySliderElements, index, milestoneEvaluation, dateStamp, attachments, _loop, _index;

                return regeneratorRuntime.wrap(function _callee20$(_context21) {
                    while (1) {
                        switch (_context21.prev = _context21.next) {
                            case 0:

                                // inform the user that saving report is taking place
                                $('#loader-modal-message').html("Saving Report...");
                                $('#loader-modal').get(0).show(); // show loader

                                // collect all data to be saved
                                projectEvaluationReportData = { milestonesEvaluations: [] }; // variable holds the project evaluation report data
                                // get the jQuery collection of sliders

                                jQuerySliderElements = $('#project-evaluation-page .project-evaluation-slider');

                                // get the score of all milestones evaluated

                                for (index = 0; index < utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectMilestones.length; index++) {
                                    milestoneEvaluation = { milestoneId: utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectMilestones[index].BOQID,
                                        milestoneTitle: utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectMilestones[index].CATEGORY,
                                        milestoneRate: utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectMilestones[index].RATE,
                                        milestoneScore: jQuerySliderElements.eq(index).get(0)._ptracker_slider.value };

                                    // add the milestoneEvaluation data to the collection

                                    projectEvaluationReportData.milestonesEvaluations.push(milestoneEvaluation);
                                }

                                // attach the project data to the project evaluation report data
                                projectEvaluationReportData.projectData = $('#app-main-navigator').get(0).topPage.data.projectData;
                                // attach the project evalution report's geo location
                                projectEvaluationReportData.projectGeoPosition = {
                                    latitude: utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectGeoPosition.coords.latitude,
                                    longitude: utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectGeoPosition.coords.longitude };
                                // attach the projection evalution report's additional remarks
                                projectEvaluationReportData.reportRemarks = $('#project-evaluation-page #project-evaluation-remarks').val().trim();

                                // create a unique report title/id for the evaluation report
                                dateStamp = new Date();

                                projectEvaluationReportData.title = projectEvaluationReportData.projectData.PROJECTID + '-Report-' + dateStamp.getTime();
                                // add other metadata to the evaluation report
                                projectEvaluationReportData.dateStamp = dateStamp.getTime();
                                projectEvaluationReportData.sortingDate = [kendo.toString(dateStamp, "yyyy"), kendo.toString(dateStamp, "MM"), kendo.toString(dateStamp, "dd"), kendo.toString(dateStamp, "HH"), kendo.toString(dateStamp, "mm")];
                                projectEvaluationReportData.formattedDate = kendo.toString(dateStamp, "yyyy-MM-dd HH:mm:ss");
                                projectEvaluationReportData.evaluatedBy = utopiasoftware[utopiasoftware_app_namespace].model.userDetails.userDetails.username;
                                projectEvaluationReportData._id = projectEvaluationReportData.title;
                                projectEvaluationReportData.TYPE = "saved report";

                                _context21.prev = 16;
                                attachments = {}; // object to hold all the project evaluation picture attachments to be saved

                                // attach all saved project photos to the saved evaluation report data

                                _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop(_index) {
                                    var fileEntry, file, fileBlob;
                                    return regeneratorRuntime.wrap(function _loop$(_context20) {
                                        while (1) {
                                            switch (_context20.prev = _context20.next) {
                                                case 0:
                                                    _context20.next = 2;
                                                    return new Promise(function (resolve, reject) {
                                                        window.resolveLocalFileSystemURL(utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.projectPicturesUrls[_index], resolve, reject);
                                                    });

                                                case 2:
                                                    fileEntry = _context20.sent;
                                                    _context20.next = 5;
                                                    return new Promise(function (resolve, reject) {
                                                        fileEntry.file(resolve, reject);
                                                    });

                                                case 5:
                                                    file = _context20.sent;
                                                    _context20.next = 8;
                                                    return new Promise(function (resolve, reject) {
                                                        var fileReader = new FileReader();
                                                        fileReader.onloadend = function () {
                                                            if (this.error) {
                                                                // an error occurred
                                                                reject(this.error); // reject the promise
                                                            }
                                                            // resolve to the Blob object
                                                            resolve(new Blob([new Uint8Array(this.result)], { type: 'image/jpeg' }));
                                                        };

                                                        fileReader.readAsArrayBuffer(file);
                                                    });

                                                case 8:
                                                    fileBlob = _context20.sent;
                                                    // get the blob object for the picture file

                                                    // attach the image to the database document
                                                    attachments['picture' + _index + '.jpg'] = {
                                                        "content_type": "image/jpeg",
                                                        data: fileBlob
                                                    };

                                                case 10:
                                                case 'end':
                                                    return _context20.stop();
                                            }
                                        }
                                    }, _loop, _this);
                                });
                                _index = 1;

                            case 20:
                                if (!(_index < 4)) {
                                    _context21.next = 25;
                                    break;
                                }

                                return _context21.delegateYield(_loop(_index), 't0', 22);

                            case 22:
                                _index++;
                                _context21.next = 20;
                                break;

                            case 25:

                                // join all the attachments to the project evaluation report data
                                projectEvaluationReportData._attachments = attachments;
                                // save the project evaluation report data
                                _context21.next = 28;
                                return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.bulkDocs([projectEvaluationReportData]);

                            case 28:
                                _context21.next = 30;
                                return $('#loader-modal').get(0).hide();

                            case 30:
                                _context21.next = 32;
                                return ons.notification.alert('This evaluation report has been saved successfully', { title: '<ons-icon icon="fa-check" style="color: #00B2A0;" size="25px"></ons-icon> <span style="color: #00B2A0; display: inline-block; margin-left: 1em;">Evaluation Report Saved</span>',
                                    buttonLabels: ['OK'], modifier: 'utopiasoftware-alert-dialog' });

                            case 32:

                                // flag to the app that you are going back to a page that needs to be refreshed
                                window.sessionStorage.setItem("utopiasoftware-edpms-refresh-page", "yes");
                                // move back to the project search page
                                $('#app-main-navigator').get(0).resetToPage("search-project-page.html", { pop: true });

                                _context21.next = 40;
                                break;

                            case 36:
                                _context21.prev = 36;
                                _context21.t1 = _context21['catch'](16);

                                $('#loader-modal').get(0).hide();
                                ons.notification.alert('saving evaluation report sheet failed. Please try again. ' + (_context21.t1.message || ""), { title: '<span style="color: red">Saving Report Failed</span>',
                                    buttonLabels: ['OK'], modifier: 'utopiasoftware-alert-dialog' });

                            case 40:
                                _context21.prev = 40;

                                // hide loader
                                $('#loader-modal').get(0).hide();
                                return _context21.finish(40);

                            case 43:
                            case 'end':
                                return _context21.stop();
                        }
                    }
                }, _callee20, this, [[16, 36, 40, 43]]);
            }));

            function saveReportButtonClicked() {
                return _ref20.apply(this, arguments);
            }

            return saveReportButtonClicked;
        }()
    },

    /**
     * this is the view-model/controller for the View Reports page
     */
    viewReportsPageViewModel: {

        /**
         * holds the maximum number of reports that can be retrieved per request from the app database
         */
        reportPageSize: 20,

        /**
         * holds the number of reports to skip/jump before retrieving reports from app database
         */
        skip: 0,

        /**
         * holds the total number of reports contained in the app database
         */
        totalReports: 0,

        /**
         * holds the unique unique report id for all reports 'checked' for deletion
         */
        selectedReportsCollectionMap: new Map(),

        /**
         * event is triggered when page is initialised
         */
        pageInit: function pageInit(event) {

            //function is used to initialise the page if the app is fully ready for execution
            var loadPageOnAppReady = function () {
                var _ref21 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21() {
                    var dbQueryResult, viewReportListContent, index;
                    return regeneratorRuntime.wrap(function _callee21$(_context22) {
                        while (1) {
                            switch (_context22.prev = _context22.next) {
                                case 0:
                                    if (!(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false)) {
                                        _context22.next = 3;
                                        break;
                                    }

                                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                                    return _context22.abrupt('return');

                                case 3:

                                    // listen for the back button event
                                    $('#app-main-navigator').get(0).topPage.onDeviceBackButton = utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.backButtonClicked;

                                    // listen for the infinite scroll event on the page
                                    $('#app-main-navigator').get(0).topPage.onInfiniteScroll = utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.pageInfiniteScroll;

                                    // add method to handle the loading action of the pull-to-refresh widget
                                    $('#view-reports-pull-hook', $thisPage).get(0).onAction = utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.pagePullHookAction;

                                    // register listener for the pull-to-refresh widget
                                    $('#view-reports-pull-hook', $thisPage).on("changestate", function (event) {

                                        // check the state of the pull-to-refresh widget
                                        switch (event.originalEvent.state) {
                                            case 'initial':
                                                // update the displayed icon
                                                $('#view-reports-pull-hook-fab', event.originalEvent.pullHook).html('<ons-icon icon="fa-long-arrow-down" size="24px" style="color: #FFFFFF"></ons-icon>');
                                                break;

                                            case 'preaction':

                                                $('#view-reports-pull-hook-fab', event.originalEvent.pullHook).html('<ons-icon icon="fa-long-arrow-up" size="24px" style="color: #FFFFFF"></ons-icon>');
                                                break;

                                            case 'action':
                                                $('#view-reports-pull-hook-fab', event.originalEvent.pullHook).html('<ons-icon icon="md-utopiasoftware-icon-spinner" size="24px" spin style="color: #FFFFFF"></ons-icon>');
                                                break;
                                        }
                                    });

                                    // show the page preloader
                                    $('#view-reports-page .page-preloader').css("display", "block");
                                    // hide the items that are not to be displayed
                                    $('#view-reports-page .no-report-found, ' + '#view-reports-page .view-reports-load-error, #view-reports-page #view-reports-list').css("display", "none");

                                    // pick the reports that have been saved by user to-date in descending order
                                    _context22.prev = 9;
                                    _context22.next = 12;
                                    return utopiasoftware[utopiasoftware_app_namespace].projectEvaluationReportData.loadProjectEvaluationReports(false, utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.reportPageSize, utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.skip, true, Date.now(), new Date(2018, 0, 1).getTime());

                                case 12:
                                    dbQueryResult = _context22.sent;

                                    if (!(dbQueryResult.rows.length == 0)) {
                                        _context22.next = 18;
                                        break;
                                    }

                                    // no saved report found
                                    // inform the user that no saved reports are available
                                    $('#view-reports-page .page-preloader').css("display", "none");
                                    // hide the items that are not to be displayed
                                    $('#view-reports-page .view-reports-load-error, #view-reports-page #view-reports-list').css("display", "none");
                                    // show the no reports messages
                                    $('#view-reports-page .no-report-found').css("display", "block");
                                    return _context22.abrupt('return');

                                case 18:

                                    // update the properties of the View-Model
                                    utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.skip += dbQueryResult.rows.length;
                                    utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.totalReports = dbQueryResult.total_rows;

                                    // create the report list content
                                    viewReportListContent = "";

                                    for (index = 0; index < dbQueryResult.rows.length; index++) {
                                        viewReportListContent += '\n                        <ons-list-item modifier="longdivider" tappable lock-on-drag="true" \n                        data-utopiasoftware-ptracker-report-id="' + dbQueryResult.rows[index].value._id + '" \n                        data-utopiasoftware-ptracker-report-rev="' + dbQueryResult.rows[index].value._rev + '"\n                           onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                           viewReportsPageViewModel.viewReportListItemClicked(this, event)">\n                            <div class="left">\n                                <ons-icon icon="md-utopiasoftware-icon-document-text" size="46px" class="list-item__icon" style="color: #3F51B5" fixed-width></ons-icon>\n                            </div>\n                            <div class="center" style="margin-left: 1em">\n                                <span class="list-item__title" style="color: #3F51B5">' + dbQueryResult.rows[index].value._id + '</span>\n                                <span class="list-item__subtitle">Project: ' + dbQueryResult.rows[index].value.projectId + '</span>\n                                <span class="list-item__subtitle">Evaluated By: ' + utopiasoftware[utopiasoftware_app_namespace].model.userDetails.userDetails.username + '</span>\n                                <span class="list-item__subtitle" style="font-size: 0.6em">\n                                ' + kendo.toString(new Date(dbQueryResult.rows[index].value.dateStamp), "MMMM d, yyyy h:mm tt") + '\n                                </span>\n                            </div>\n                            <div class="right">\n                                <ons-fab modifier="mini" style="background-color: transparent; color: #f30000" \n                                onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                                viewReportsPageViewModel.reportDeleteButtonClicked(\'' + dbQueryResult.rows[index].value._id + '\', \n                                \'' + dbQueryResult.rows[index].value._rev + '\')">\n                                    <ons-icon icon="md-delete">\n                                    </ons-icon>\n                                </ons-fab>\n                                <ons-checkbox modifier="login-checkbox" value="delete" \n                                onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                                viewReportsPageViewModel.reportCheckBoxClicked(this, \'' + dbQueryResult.rows[index].value._id + '\', \n                                \'' + dbQueryResult.rows[index].value._rev + '\')"></ons-checkbox>\n                            </div>\n                        </ons-list-item>';
                                    } // end of for loop

                                    // append generated list content to the view-reports
                                    $('#view-reports-page #view-reports-list').html(viewReportListContent);

                                    // hide the page preloader
                                    $('#view-reports-page .page-preloader').css("display", "none");
                                    // hide the items that are not to be displayed
                                    $('#view-reports-page .no-report-found, #view-reports-page .view-reports-load-error').css("display", "none");
                                    // display the view reports list
                                    $('#view-reports-page #view-reports-list').css("display", "block");
                                    _context22.next = 33;
                                    break;

                                case 28:
                                    _context22.prev = 28;
                                    _context22.t0 = _context22['catch'](9);


                                    // hide the page preloader
                                    $('#view-reports-page .page-preloader').css("display", "none");
                                    // hide the items that are not to be displayed
                                    $('#view-reports-page .no-report-found, #view-reports-page #view-reports-list').css("display", "none");
                                    // display the error message to user
                                    $('#view-reports-page .view-reports-load-error').css("display", "block");

                                case 33:
                                    _context22.prev = 33;

                                    // hide the loader
                                    $('#loader-modal').get(0).hide();
                                    return _context22.finish(33);

                                case 36:
                                case 'end':
                                    return _context22.stop();
                            }
                        }
                    }, _callee21, this, [[9, 28, 33, 36]]);
                }));

                return function loadPageOnAppReady() {
                    return _ref21.apply(this, arguments);
                };
            }();

            var $thisPage = $(event.target); // get the current page shown
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();
        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function pageShow() {
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // adjust the window/view-port settings for when the soft keyboard is displayed
            window.SoftInputMode.set('adjustPan'); // let the window/view-port 'pan' when the soft keyboard is displayed
        },

        /**
         * method is triggered when page is hidden
         */
        pageHide: function pageHide() {
            // adjust the window/view-port settings for when the soft keyboard is displayed
            // window.SoftInputMode.set('adjustResize'); // let the view 'resize' when the soft keyboard is displayed

        },

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function pageDestroy() {

            // reset the object properties to their default values
            utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.skip = 0;
            utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.totalReports = 0;
            // empty the collection of selected/checked reports
            utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.selectedReportsCollectionMap.clear();

            // uncheck the Bulk Delete checkbox in the Additional Menu Popover
            $('#view-reports-bulk-delete-checkbox').get(0).checked = false;
        },

        /**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */
        backButtonClicked: function () {
            var _ref22 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22() {
                return regeneratorRuntime.wrap(function _callee22$(_context23) {
                    while (1) {
                        switch (_context23.prev = _context23.next) {
                            case 0:
                                if (!$('ons-splitter').get(0).right.isOpen) {
                                    _context23.next = 3;
                                    break;
                                }

                                // side menu open, so close it
                                $('ons-splitter').get(0).right.close();
                                return _context23.abrupt('return');

                            case 3:

                                // check if the view-reports-additional-menu-popover is visible
                                if ($('#view-reports-additional-menu-popover').get(0).visible) {
                                    // popover menu is currently visible
                                    // hide the popover menu
                                    $('#view-reports-additional-menu-popover').get(0).hide();
                                }

                                // move to the project evaluation page
                                $('#app-main-navigator').get(0).popPage();

                            case 5:
                            case 'end':
                                return _context23.stop();
                        }
                    }
                }, _callee22, this);
            }));

            function backButtonClicked() {
                return _ref22.apply(this, arguments);
            }

            return backButtonClicked;
        }(),


        /**
         * method is triggered when the delete fab button is clicked
         *
         * @returns {Promise<void>}
         */
        reportDeleteButtonClicked: function () {
            var _ref23 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23(docId, docRevision) {
                var deleteReport, jQueryListItem;
                return regeneratorRuntime.wrap(function _callee23$(_context24) {
                    while (1) {
                        switch (_context24.prev = _context24.next) {
                            case 0:
                                _context24.next = 2;
                                return ons.notification.confirm('Do you want to delete the report?', { title: '<ons-icon icon="md-delete" style="color: #3f51b5" size="33px"></ons-icon> <span style="color: #3f51b5; display: inline-block; margin-left: 1em;">Delete Report</span>',
                                    buttonLabels: ['No', 'Yes'], modifier: 'utopiasoftware-alert-dialog' });

                            case 2:
                                deleteReport = _context24.sent;

                                if (!(deleteReport == 0)) {
                                    _context24.next = 5;
                                    break;
                                }

                                return _context24.abrupt('return');

                            case 5:
                                jQueryListItem = $('#view-reports-page #view-reports-list ons-list-item[data-utopiasoftware-ptracker-report-id="' + docId + '"]');

                                //remove the list item from view with an animation

                                _context24.next = 8;
                                return Promise.resolve(kendo.fx(jQueryListItem).slideIn("right").duration(400).reverse());

                            case 8:
                                // remove the element from the list item altogether
                                jQueryListItem.remove();

                                _context24.prev = 9;
                                _context24.next = 12;
                                return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.remove(docId, docRevision);

                            case 12:

                                // inform the user that evaluation report has been delete
                                // display a toast to the user
                                ons.notification.toast('<ons-icon icon="md-delete" size="28px" style="color: #00D5C3"></ons-icon> <span style="text-transform: capitalize; display: inline-block; margin-left: 1em">Report Deleted</span>', { timeout: 2500 });
                                _context24.next = 17;
                                break;

                            case 15:
                                _context24.prev = 15;
                                _context24.t0 = _context24['catch'](9);

                            case 17:
                            case 'end':
                                return _context24.stop();
                        }
                    }
                }, _callee23, this, [[9, 15]]);
            }));

            function reportDeleteButtonClicked(_x6, _x7) {
                return _ref23.apply(this, arguments);
            }

            return reportDeleteButtonClicked;
        }(),
        reportCheckBoxClicked: function () {
            var _ref24 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee24(checkboxElement, docId, docRevision) {
                return regeneratorRuntime.wrap(function _callee24$(_context25) {
                    while (1) {
                        switch (_context25.prev = _context25.next) {
                            case 0:

                                // check if the clicked checkbox is in a checked state or not
                                if (checkboxElement.checked === true) {
                                    // the clicked checkbox is in a checked state
                                    // add the unique report id attached to the clicked checkbox to the collection of selected reports
                                    utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.selectedReportsCollectionMap.set(docId, { _id: docId, _rev: docRevision, _deleted: true });
                                } else {
                                    // the clicked checkbox is in an unchecked state
                                    // remove the unique report id attached to the clicked checkbox from the collection of selected reports
                                    utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.selectedReportsCollectionMap.delete(docId);
                                }

                            case 1:
                            case 'end':
                                return _context25.stop();
                        }
                    }
                }, _callee24, this);
            }));

            function reportCheckBoxClicked(_x8, _x9, _x10) {
                return _ref24.apply(this, arguments);
            }

            return reportCheckBoxClicked;
        }(),


        /**
         * method is triggered on page infinite scroll
         * @param doneCallBack {function}
         *
         * @returns {Promise<void>}
         */
        pageInfiniteScroll: function () {
            var _ref25 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee25(doneCallBack) {
                var dbQueryResult, viewReportListContent, index;
                return regeneratorRuntime.wrap(function _callee25$(_context26) {
                    while (1) {
                        switch (_context26.prev = _context26.next) {
                            case 0:
                                // append the loader icon/indicator to the view-reports lists
                                $('#view-reports-page #view-reports-list').append('<ons-list-item modifier="nodivider" lock-on-drag="true" class="list-view-infinite-loader">\n                <div class="left">\n                </div>\n                <div class="center">\n                    <div style="width: 100%; text-align: center">\n                        <ons-icon icon="md-utopiasoftware-icon-spinner" spin size="42px" class="list-item__icon" style="color: #00D5C3"></ons-icon>\n                    </div>\n                </div>\n                <div class="right">\n                </div>\n            </ons-list-item>');

                                // load additional reports to the page
                                _context26.prev = 1;

                                if (!(utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.skip >= utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.totalReports)) {
                                    _context26.next = 6;
                                    break;
                                }

                                // remove the loader icon/indicator to the view-reports lists
                                $('#view-reports-page #view-reports-list .list-view-infinite-loader').remove();
                                doneCallBack();
                                // this is the last set/page of reports. so no need to load any more
                                return _context26.abrupt('return');

                            case 6:
                                _context26.next = 8;
                                return utopiasoftware[utopiasoftware_app_namespace].projectEvaluationReportData.loadProjectEvaluationReports(false, utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.reportPageSize, utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.skip, true, Date.now(), new Date(2018, 0, 1).getTime());

                            case 8:
                                dbQueryResult = _context26.sent;

                                if (!(dbQueryResult.rows.length == 0)) {
                                    _context26.next = 13;
                                    break;
                                }

                                // no saved report found
                                // remove the loader icon/indicator to the view-reports lists
                                $('#view-reports-page #view-reports-list .list-view-infinite-loader').remove();
                                doneCallBack();
                                // no report data was returned, so exit method
                                return _context26.abrupt('return');

                            case 13:

                                // update the properties of the View-Model
                                utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.skip += dbQueryResult.rows.length;
                                utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.totalReports = dbQueryResult.total_rows;

                                // create the report list content
                                viewReportListContent = "";

                                for (index = 0; index < dbQueryResult.rows.length; index++) {
                                    viewReportListContent += '\n                        <ons-list-item modifier="longdivider" tappable lock-on-drag="true" \n                        data-utopiasoftware-ptracker-report-id="' + dbQueryResult.rows[index].value._id + '" \n                        data-utopiasoftware-ptracker-report-rev="' + dbQueryResult.rows[index].value._rev + '"\n                           onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                           viewReportsPageViewModel.viewReportListItemClicked(this, event)">\n                            <div class="left">\n                                <ons-icon icon="md-utopiasoftware-icon-document-text" size="46px" class="list-item__icon" style="color: #3F51B5" fixed-width></ons-icon>\n                            </div>\n                            <div class="center" style="margin-left: 1em">\n                                <span class="list-item__title" style="color: #3F51B5">' + dbQueryResult.rows[index].value._id + '</span>\n                                <span class="list-item__subtitle">Project: ' + dbQueryResult.rows[index].value.projectId + '</span>\n                                <span class="list-item__subtitle">Evaluated By: ' + utopiasoftware[utopiasoftware_app_namespace].model.userDetails.userDetails.username + '</span>\n                                <span class="list-item__subtitle" style="font-size: 0.6em">\n                                ' + kendo.toString(new Date(dbQueryResult.rows[index].value.dateStamp), "MMMM d, yyyy h:mm tt") + '\n                                </span>\n                            </div>\n                            <div class="right">\n                                <ons-fab modifier="mini" style="background-color: transparent; color: #f30000" \n                                onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                                viewReportsPageViewModel.reportDeleteButtonClicked(\'' + dbQueryResult.rows[index].value._id + '\', \n                                \'' + dbQueryResult.rows[index].value._rev + '\')">\n                                    <ons-icon icon="md-delete">\n                                    </ons-icon>\n                                </ons-fab>\n                                <ons-checkbox modifier="login-checkbox" value="delete" \n                                onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                                viewReportsPageViewModel.reportCheckBoxClicked(this, \'' + dbQueryResult.rows[index].value._id + '\', \n                                \'' + dbQueryResult.rows[index].value._rev + '\')"></ons-checkbox>\n                            </div>\n                        </ons-list-item>';
                                } // end of for loop

                                // remove the loader icon/indicator to the view-reports lists
                                $('#view-reports-page #view-reports-list .list-view-infinite-loader').remove();
                                // append generated list content to the view-reports
                                $('#view-reports-page #view-reports-list').append(viewReportListContent);
                                doneCallBack();
                                _context26.next = 27;
                                break;

                            case 22:
                                _context26.prev = 22;
                                _context26.t0 = _context26['catch'](1);

                                // remove the loader icon/indicator to the view-reports lists
                                $('#view-reports-page #view-reports-list .list-view-infinite-loader').remove();
                                doneCallBack();
                                // display message to inform user of load error
                                ons.notification.toast('<ons-icon icon="md-alert-circle" size="28px" style="color: yellow"></ons-icon> <span style="text-transform: capitalize; display: inline-block; margin-left: 1em; color: yellow">Loading Error. Try Again</span>', { timeout: 3000 });

                            case 27:
                            case 'end':
                                return _context26.stop();
                        }
                    }
                }, _callee25, this, [[1, 22]]);
            }));

            function pageInfiniteScroll(_x11) {
                return _ref25.apply(this, arguments);
            }

            return pageInfiniteScroll;
        }(),


        /**
         * method is triggered when the pull-hook on the page is active
         *
         * @param doneCallBack
         * @returns {Promise<void>}
         */
        pagePullHookAction: function () {
            var _ref26 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee26() {
                var doneCallBack = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};
                var dbQueryResult, viewReportListContent, index;
                return regeneratorRuntime.wrap(function _callee26$(_context27) {
                    while (1) {
                        switch (_context27.prev = _context27.next) {
                            case 0:
                                // disable pull-to-refresh widget till loading is done
                                $('#view-reports-page #view-reports-pull-hook').attr("disabled", true);
                                // empty the collection of selected/checked reports
                                utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.selectedReportsCollectionMap.clear();

                                // reload reports to the page. start from the 1st
                                _context27.prev = 2;
                                _context27.next = 5;
                                return utopiasoftware[utopiasoftware_app_namespace].projectEvaluationReportData.loadProjectEvaluationReports(false, utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.reportPageSize, 0, true, Date.now(), new Date(2018, 0, 1).getTime());

                            case 5:
                                dbQueryResult = _context27.sent;

                                if (!(dbQueryResult.rows.length == 0)) {
                                    _context27.next = 12;
                                    break;
                                }

                                // no saved report found
                                // enable pull-to-refresh widget
                                $('#view-reports-page #view-reports-pull-hook').removeAttr("disabled");
                                // hide the items that are not to be displayed
                                $('#view-reports-page .view-reports-load-error, #view-reports-page #view-reports-list').css("display", "none");
                                // show the no reports messages
                                $('#view-reports-page .no-report-found').css("display", "block");
                                // inform ONSEN that the refresh action is completed
                                doneCallBack();
                                return _context27.abrupt('return');

                            case 12:

                                // update the properties of the View-Model
                                utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.skip = dbQueryResult.rows.length;
                                utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.totalReports = dbQueryResult.total_rows;

                                // create the report list content
                                viewReportListContent = "";

                                for (index = 0; index < dbQueryResult.rows.length; index++) {
                                    viewReportListContent += '\n                        <ons-list-item modifier="longdivider" tappable lock-on-drag="true" \n                        data-utopiasoftware-ptracker-report-id="' + dbQueryResult.rows[index].value._id + '" \n                        data-utopiasoftware-ptracker-report-rev="' + dbQueryResult.rows[index].value._rev + '"\n                           onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                           viewReportsPageViewModel.viewReportListItemClicked(this, event)">\n                            <div class="left">\n                                <ons-icon icon="md-utopiasoftware-icon-document-text" size="46px" class="list-item__icon" style="color: #3F51B5" fixed-width></ons-icon>\n                            </div>\n                            <div class="center" style="margin-left: 1em">\n                                <span class="list-item__title" style="color: #3F51B5">' + dbQueryResult.rows[index].value._id + '</span>\n                                <span class="list-item__subtitle">Project: ' + dbQueryResult.rows[index].value.projectId + '</span>\n                                <span class="list-item__subtitle">Evaluated By: ' + utopiasoftware[utopiasoftware_app_namespace].model.userDetails.userDetails.username + '</span>\n                                <span class="list-item__subtitle" style="font-size: 0.6em">\n                                ' + kendo.toString(new Date(dbQueryResult.rows[index].value.dateStamp), "MMMM d, yyyy h:mm tt") + '\n                                </span>\n                            </div>\n                            <div class="right">\n                                <ons-fab modifier="mini" style="background-color: transparent; color: #f30000" \n                                onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                                viewReportsPageViewModel.reportDeleteButtonClicked(\'' + dbQueryResult.rows[index].value._id + '\', \n                                \'' + dbQueryResult.rows[index].value._rev + '\')">\n                                    <ons-icon icon="md-delete">\n                                    </ons-icon>\n                                </ons-fab>\n                                <ons-checkbox modifier="login-checkbox" value="delete" \n                                onclick="utopiasoftware[utopiasoftware_app_namespace].controller.\n                                viewReportsPageViewModel.reportCheckBoxClicked(this, \'' + dbQueryResult.rows[index].value._id + '\', \n                                \'' + dbQueryResult.rows[index].value._rev + '\')"></ons-checkbox>\n                            </div>\n                        </ons-list-item>';
                                } // end of for loop

                                // enable pull-to-refresh widget
                                $('#view-reports-page #view-reports-pull-hook').removeAttr("disabled");
                                // append generated list content to the view-reports
                                $('#view-reports-page #view-reports-list').html(viewReportListContent);
                                // hide the items that are not to be displayed
                                $('#view-reports-page .no-report-found, #view-reports-page .view-reports-load-error').css("display", "none");
                                // display the view reports list
                                $('#view-reports-page #view-reports-list').css("display", "block");
                                // inform ONSEN that the refresh action is completed
                                doneCallBack();
                                _context27.next = 27;
                                break;

                            case 23:
                                _context27.prev = 23;
                                _context27.t0 = _context27['catch'](2);

                                // enable pull-to-refresh widget
                                $('#view-reports-page #view-reports-pull-hook').removeAttr("disabled");
                                doneCallBack();

                            case 27:
                            case 'end':
                                return _context27.stop();
                        }
                    }
                }, _callee26, this, [[2, 23]]);
            }));

            function pagePullHookAction() {
                return _ref26.apply(this, arguments);
            }

            return pagePullHookAction;
        }(),


        /**
         * method is triggered when any of the list items on the view report lisat is clicked
         * @param listItemElement {HTMLElement} the list item that was clicked
         * @param event {Event}
         *
         * @returns {Promise<void>}
         */
        viewReportListItemClicked: function () {
            var _ref27 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee27(listItemElement, event) {
                var jQueryListItem;
                return regeneratorRuntime.wrap(function _callee27$(_context28) {
                    while (1) {
                        switch (_context28.prev = _context28.next) {
                            case 0:
                                if (!$(event.target).closest('ons-fab', listItemElement).is('ons-fab')) {
                                    _context28.next = 2;
                                    break;
                                }

                                return _context28.abrupt('return');

                            case 2:
                                if (!$(event.target).closest('ons-checkbox', listItemElement).is('ons-checkbox')) {
                                    _context28.next = 4;
                                    break;
                                }

                                return _context28.abrupt('return');

                            case 4:
                                jQueryListItem = $(listItemElement); // convert the list item to a jquery object and get required data attributes

                                // push the evaluation report page into view

                                $('#app-main-navigator').get(0).pushPage("evaluation-report-page.html", { animation: "slide-md",
                                    data: { reportDetails: { id: jQueryListItem.attr('data-utopiasoftware-ptracker-report-id'),
                                            rev: jQueryListItem.attr('data-utopiasoftware-ptracker-report-rev') } } });

                            case 6:
                            case 'end':
                                return _context28.stop();
                        }
                    }
                }, _callee27, this);
            }));

            function viewReportListItemClicked(_x13, _x14) {
                return _ref27.apply(this, arguments);
            }

            return viewReportListItemClicked;
        }(),


        /**
         * method is triggered when the bulk delete option is clicked from the
         * Addition Menu Popover List
         * @returns {Promise<void>}
         */
        bulkDeletePopOverListItemClicked: function () {
            var _ref28 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee28() {
                return regeneratorRuntime.wrap(function _callee28$(_context29) {
                    while (1) {
                        switch (_context29.prev = _context29.next) {
                            case 0:
                                _context29.next = 2;
                                return Promise.resolve($('#view-reports-additional-menu-popover').get(0).hide());

                            case 2:
                                if (!($('#view-reports-bulk-delete-checkbox').get(0).checked === true)) {
                                    _context29.next = 9;
                                    break;
                                }

                                // checkbox is checked
                                // hide all the delete buttons displayed on the view-reports-list and show the checkboxes
                                $('#view-reports-page #view-reports-list').removeClass('show-delete').addClass('hide-delete');
                                // show the Bulk Delete button
                                _context29.next = 6;
                                return Promise.resolve(kendo.fx($('#view-reports-page #view-reports-bottom-toolbar-bulk-delete-block')).slideIn("up").duration(400).play());

                            case 6:
                                $('#view-reports-page #view-reports-bottom-toolbar-bulk-delete-block').css("display", "block");
                                _context29.next = 15;
                                break;

                            case 9:
                                // checkbox is NOT checked

                                // uncheck ALL previously checked checkboxes on the view-reports list
                                $('#view-reports-page #view-reports-list ons-checkbox').each(function (index, element) {
                                    element.checked = false;
                                });

                                // empty the collection of selected/checked reports
                                utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.selectedReportsCollectionMap.clear();

                                // show all the delete buttons displayed on the view-reports-list and hide the checkboxes
                                $('#view-reports-page #view-reports-list').removeClass('hide-delete').addClass('show-delete');
                                // hide the Bulk Delete button
                                _context29.next = 14;
                                return Promise.resolve(kendo.fx($('#view-reports-page #view-reports-bottom-toolbar-bulk-delete-block')).slideIn("up").duration(400).reverse());

                            case 14:
                                $('#view-reports-page #view-reports-bottom-toolbar-bulk-delete-block').css("display", "none");

                            case 15:
                            case 'end':
                                return _context29.stop();
                        }
                    }
                }, _callee28, this);
            }));

            function bulkDeletePopOverListItemClicked() {
                return _ref28.apply(this, arguments);
            }

            return bulkDeletePopOverListItemClicked;
        }(),


        /**
         * method is triggered when the Delete bottom toolbar button is clicked
         * @returns {Promise<void>}
         */
        bulkDeleteButtonClicked: function () {
            var _ref29 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee29() {
                var selectedReportArray, deleteReport;
                return regeneratorRuntime.wrap(function _callee29$(_context30) {
                    while (1) {
                        switch (_context30.prev = _context30.next) {
                            case 0:

                                // get the collection of selected reports for deletion
                                selectedReportArray = [].concat(_toConsumableArray(utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.selectedReportsCollectionMap)).map(function (currentValue, index) {
                                    return currentValue[1];
                                });

                                if (!(selectedReportArray.length === 0)) {
                                    _context30.next = 5;
                                    break;
                                }

                                _context30.next = 4;
                                return ons.notification.alert('Please, select reports to be deleted', { title: '<ons-icon icon="md-info" style="color: #3f51b5" size="33px"></ons-icon> <span style="color: #3f51b5; display: inline-block; margin-left: 1em;">No Reports Selected</span>',
                                    buttonLabels: ['OK'], modifier: 'utopiasoftware-alert-dialog' });

                            case 4:
                                return _context30.abrupt('return');

                            case 5:
                                _context30.next = 7;
                                return ons.notification.confirm('Do you want to delete the selected reports?', { title: '<ons-icon icon="md-delete" style="color: #3f51b5" size="33px"></ons-icon> <span style="color: #3f51b5; display: inline-block; margin-left: 1em;">Delete Report</span>',
                                    buttonLabels: ['No', 'Yes'], modifier: 'utopiasoftware-alert-dialog' });

                            case 7:
                                deleteReport = _context30.sent;

                                if (!(deleteReport == 0)) {
                                    _context30.next = 10;
                                    break;
                                }

                                return _context30.abrupt('return');

                            case 10:
                                _context30.prev = 10;

                                // show the page preloader
                                $('#view-reports-page .page-preloader').css("display", "block");
                                _context30.next = 14;
                                return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.bulkDocs(selectedReportArray);

                            case 14:
                                // get a collection of the list items that match the selected reports
                                selectedReportArray.forEach(function (arrayObj, index) {
                                    selectedReportArray[index] = $('#view-reports-page #view-reports-list ons-list-item[data-utopiasoftware-ptracker-report-id="' + arrayObj._id + '"]').get(0);
                                });

                                // remove the collection of elements from the list item
                                $(selectedReportArray).remove();
                                // clear/empty the selected reports collection
                                utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.selectedReportsCollectionMap.clear();
                                // hide the page preloader
                                $('#view-reports-page .page-preloader').css("display", "none");

                                // disable the bulk delete checkbox and other bulk delete setup
                                $('#view-reports-bulk-delete-checkbox').get(0).checked = false;
                                _context30.next = 21;
                                return utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.bulkDeletePopOverListItemClicked();

                            case 21:
                                _context30.next = 23;
                                return ons.notification.toast('<ons-icon icon="md-delete" size="28px" style="color: #00D5C3"></ons-icon> <span style="text-transform: capitalize; display: inline-block; margin-left: 1em">' + selectedReportArray.length + ' ' + (selectedReportArray.length === 1 ? "Report" : "Reports") + ' Deleted</span>', { timeout: 2500 });

                            case 23:
                                selectedReportArray = [];

                                _context30.next = 31;
                                break;

                            case 26:
                                _context30.prev = 26;
                                _context30.t0 = _context30['catch'](10);

                                console.log("BULK DELETE ERROR", _context30.t0);
                                // hide the page preloader
                                $('#view-reports-page .page-preloader').css("display", "none");
                                // display message to inform user of load error
                                ons.notification.toast('<ons-icon icon="md-alert-circle" size="28px" style="color: yellow"></ons-icon> <span style="text-transform: capitalize; display: inline-block; margin-left: 1em; color: yellow">Bulk Delete Failed</span>', { timeout: 3000 });

                            case 31:
                            case 'end':
                                return _context30.stop();
                        }
                    }
                }, _callee29, this, [[10, 26]]);
            }));

            function bulkDeleteButtonClicked() {
                return _ref29.apply(this, arguments);
            }

            return bulkDeleteButtonClicked;
        }()
    },

    /**
     * this is the view-model/controller for the View Reports page
     */
    evaluationReportPageViewModel: {

        /**
         * holds the dynamically created url for the project evaluation photo 1
         */
        projectPicture1Url: null,

        /**
         * holds the dynamically created url for the project evaluation photo 2
         */
        projectPicture2Url: null,

        /**
         * holds the dynamically created url for the project evaluation photo 3
         */
        projectPicture3Url: null,

        /**
         * event is triggered when page is initialised
         */
        pageInit: function pageInit(event) {

            //function is used to initialise the page if the app is fully ready for execution
            var loadPageOnAppReady = function () {
                var _ref30 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee30() {
                    var evaluationReport, evaluationReportListContent, index;
                    return regeneratorRuntime.wrap(function _callee30$(_context31) {
                        while (1) {
                            switch (_context31.prev = _context31.next) {
                                case 0:
                                    if (!(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false)) {
                                        _context31.next = 3;
                                        break;
                                    }

                                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                                    return _context31.abrupt('return');

                                case 3:

                                    // listen for the back button event
                                    $('#app-main-navigator').get(0).topPage.onDeviceBackButton = utopiasoftware[utopiasoftware_app_namespace].controller.evaluationReportPageViewModel.backButtonClicked;

                                    // show the page preloader
                                    $('#evaluation-report-page .page-preloader').css("display", "block");
                                    // hide the items that are not to be displayed
                                    $('#evaluation-report-page .no-report-found, ' + '#evaluation-report-page .evaluation-report-load-error, #evaluation-report-page #evaluation-report-list').css("display", "none");
                                    $('#evaluation-report-page #evaluation-report-delete-fab').attr("disabled", true);

                                    // pick the evaluation report to delete
                                    _context31.prev = 7;
                                    _context31.next = 10;
                                    return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.get($('#app-main-navigator').get(0).topPage.data.reportDetails.id, { attachments: true, binary: true });

                                case 10:
                                    evaluationReport = _context31.sent;


                                    // get the object urls for the 3 project evaluation photos
                                    utopiasoftware[utopiasoftware_app_namespace].controller.evaluationReportPageViewModel.projectPicture1Url = window.URL.createObjectURL(evaluationReport._attachments['picture1.jpg'].data);
                                    // get the object urls for the 3 project evaluation photos
                                    utopiasoftware[utopiasoftware_app_namespace].controller.evaluationReportPageViewModel.projectPicture2Url = window.URL.createObjectURL(evaluationReport._attachments['picture2.jpg'].data);
                                    // get the object urls for the 3 project evaluation photos
                                    utopiasoftware[utopiasoftware_app_namespace].controller.evaluationReportPageViewModel.projectPicture3Url = window.URL.createObjectURL(evaluationReport._attachments['picture3.jpg'].data);

                                    // create the evaluation report list content
                                    evaluationReportListContent = '\n                    <ons-list-header>Report Title</ons-list-header>\n                    <ons-list-item modifier="longdivider" lock-on-drag="true"\n                                   onclick="">\n                        <div class="center" style="">\n                            <span class="list-item__title" style="color: #3F51B5; text-transform: uppercase">' + evaluationReport.title + '</span>\n                        </div>\n                    </ons-list-item>\n                    \n                    <ons-list-header>Project Title</ons-list-header>\n                    <ons-list-item modifier="longdivider" lock-on-drag="true"\n                                   onclick="">\n                        <div class="center" style="">\n                            <span class="list-item__title" style="color: #3F51B5; text-transform: uppercase">' + evaluationReport.projectData.TITLE + '</span>\n                        </div>\n                    </ons-list-item>\n                    \n                    <ons-list-header>Project ID</ons-list-header>\n                    <ons-list-item modifier="longdivider" lock-on-drag="true"\n                                   onclick="">\n                        <div class="center" style="">\n                            <span class="list-item__title" style="color: #3F51B5; text-transform: uppercase">' + evaluationReport.projectData.PROJECTID + '</span>\n                        </div>\n                    </ons-list-item>\n                    \n                    <ons-list-header>Project Milestones</ons-list-header>\n                    <ons-list-item modifier="longdivider" lock-on-drag="true" expandable\n                                   onclick="">\n                        <div class="center" style="">\n                            <span class="list-item__title" style="color: #3F51B5;">Milestone Progress Evaluation</span>\n                        </div>\n                        <div class="expandable-content">\n                            <div class="row">';

                                    for (index = 0; index < evaluationReport.milestonesEvaluations.length; index++) {
                                        evaluationReportListContent += '\n                        <div class="col-xs-9" style="text-transform: capitalize">\n                        ' + evaluationReport.milestonesEvaluations[index].milestoneTitle + '</div>\n                        <div class="col-xs-3" style="text-align: left; padding-left: 1em;">\n                        ' + evaluationReport.milestonesEvaluations[index].milestoneScore + '%</div>';
                                    }

                                    evaluationReportListContent += '\n                        </div>\n                        </div>\n                    </ons-list-item>\n\n                    <ons-list-header>Project Photos</ons-list-header>\n                    <ons-list-item modifier="longdivider" lock-on-drag="true" expandable\n                                   onclick="">\n                        <div class="center" style="">\n                            <span class="list-item__title" style="color: #3F51B5;">View Photos</span>\n                        </div>\n                        <div class="expandable-content">\n                            <div class="row">\n                                <div class="col-xs-6" style="padding: 0.5em;">\n                                    <img src="' + utopiasoftware[utopiasoftware_app_namespace].controller.evaluationReportPageViewModel.projectPicture1Url + '" style="width: 100%; border: 2px darkgray groove">\n                                </div>\n                                <div class="col-xs-6" style="padding: 0.5em;">\n                                    <img src="' + utopiasoftware[utopiasoftware_app_namespace].controller.evaluationReportPageViewModel.projectPicture2Url + '" style="width: 100%; border: 2px darkgray groove">\n                                </div>\n                                <div class="col-xs-6" style="padding: 0.5em;">\n                                    <img src="' + utopiasoftware[utopiasoftware_app_namespace].controller.evaluationReportPageViewModel.projectPicture3Url + '" style="width: 100%; border: 2px darkgray groove">\n                                </div>\n                            </div>\n                        </div>\n                    </ons-list-item>\n                    \n                    <ons-list-header>Project Location</ons-list-header>\n                    <ons-list-item modifier="longdivider" lock-on-drag="true"\n                                   onclick="">\n                        <div class="center" style="">\n                            <span class="list-item__title" style="color: #3F51B5;">' + evaluationReport.projectGeoPosition.latitude + ',' + evaluationReport.projectGeoPosition.longitude + '</span>\n                        </div>\n                    </ons-list-item>\n        \n                    <ons-list-header>Evaluation Remarks</ons-list-header>\n                    <ons-list-item modifier="longdivider" lock-on-drag="true"\n                                   onclick="">\n                        <div class="center" style="">\n                            <span class="list-item__title" style="color: #3F51B5;">' + evaluationReport.reportRemarks.replace(/\n/ig, "<br>") + '</span>\n                        </div>\n                    </ons-list-item>\n        \n                    <ons-list-header>Evaluation By</ons-list-header>\n                    <ons-list-item modifier="longdivider" lock-on-drag="true"\n                                   onclick="">\n                        <div class="center" style="">\n                            <span class="list-item__title" style="color: #3F51B5;">' + evaluationReport.evaluatedBy + '</span>\n                        </div>\n                    </ons-list-item>\n        \n                    <ons-list-header>Evaluation Date</ons-list-header>\n                    <ons-list-item modifier="longdivider" lock-on-drag="true"\n                                   onclick="">\n                        <div class="center" style="">\n                            <span class="list-item__title" style="color: #3F51B5;">' + kendo.toString(new Date(evaluationReport.dateStamp), "MMMM d, yyyy h:mm tt") + '</span>\n                        </div>\n                    </ons-list-item>';

                                    // append generated list content to the evaluation report
                                    $('#evaluation-report-page #evaluation-report-list').html(evaluationReportListContent);

                                    // hide the page preloader
                                    $('#evaluation-report-page .page-preloader').css("display", "none");
                                    // hide the items that are not to be displayed
                                    $('#evaluation-report-page .no-report-found, #evaluation-report-page .evaluation-report-load-error').css("display", "none");
                                    // display the view reports list
                                    $('#evaluation-report-page #evaluation-report-list').css("display", "block");
                                    $('#evaluation-report-page #evaluation-report-delete-fab').removeAttr("disabled");
                                    _context31.next = 30;
                                    break;

                                case 24:
                                    _context31.prev = 24;
                                    _context31.t0 = _context31['catch'](7);


                                    // hide the page preloader
                                    $('#evaluation-report-page .page-preloader').css("display", "none");
                                    // hide the items that are not to be displayed
                                    $('#evaluation-report-page .no-report-found, #evaluation-report-page #evaluation-report-list').css("display", "none");
                                    $('#evaluation-report-page #evaluation-report-delete-fab').attr("disabled", true);
                                    // display the error message to user
                                    $('#evaluation-report-page .evaluation-report-load-error').css("display", "block");

                                case 30:
                                    _context31.prev = 30;

                                    // hide the loader
                                    $('#loader-modal').get(0).hide();
                                    return _context31.finish(30);

                                case 33:
                                case 'end':
                                    return _context31.stop();
                            }
                        }
                    }, _callee30, this, [[7, 24, 30, 33]]);
                }));

                return function loadPageOnAppReady() {
                    return _ref30.apply(this, arguments);
                };
            }();

            var $thisPage = $(event.target); // get the current page shown
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();
        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function pageShow() {
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // adjust the window/view-port settings for when the soft keyboard is displayed
            window.SoftInputMode.set('adjustPan'); // let the window/view-port 'pan' when the soft keyboard is displayed
        },

        /**
         * method is triggered when page is hidden
         */
        pageHide: function pageHide() {
            // adjust the window/view-port settings for when the soft keyboard is displayed
            // window.SoftInputMode.set('adjustResize'); // let the view 'resize' when the soft keyboard is displayed

        },

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function pageDestroy() {
            // destroy all picture object urls created for this page
            window.URL.revokeObjectURL(utopiasoftware[utopiasoftware_app_namespace].controller.evaluationReportPageViewModel.projectPicture1Url);
            window.URL.revokeObjectURL(utopiasoftware[utopiasoftware_app_namespace].controller.evaluationReportPageViewModel.projectPicture2Url);
            window.URL.revokeObjectURL(utopiasoftware[utopiasoftware_app_namespace].controller.evaluationReportPageViewModel.projectPicture3Url);
        },

        /**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */
        backButtonClicked: function () {
            var _ref31 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee31() {
                return regeneratorRuntime.wrap(function _callee31$(_context32) {
                    while (1) {
                        switch (_context32.prev = _context32.next) {
                            case 0:
                                if (!$('ons-splitter').get(0).right.isOpen) {
                                    _context32.next = 3;
                                    break;
                                }

                                // side menu open, so close it
                                $('ons-splitter').get(0).right.close();
                                return _context32.abrupt('return');

                            case 3:

                                // move to the view report page
                                $('#app-main-navigator').get(0).popPage();

                            case 4:
                            case 'end':
                                return _context32.stop();
                        }
                    }
                }, _callee31, this);
            }));

            function backButtonClicked() {
                return _ref31.apply(this, arguments);
            }

            return backButtonClicked;
        }(),


        /**
         * method is triggered when the delete fab button is clicked
         *
         * @returns {Promise<void>}
         */
        reportDeleteButtonClicked: function () {
            var _ref32 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee32() {
                var fabElement = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                var docId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : $('#app-main-navigator').get(0).topPage.data.reportDetails.id;
                var docRevision = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : $('#app-main-navigator').get(0).topPage.data.reportDetails.rev;
                var deleteReport, jQueryListItem;
                return regeneratorRuntime.wrap(function _callee32$(_context33) {
                    while (1) {
                        switch (_context33.prev = _context33.next) {
                            case 0:
                                if (!(fabElement.disabled === true)) {
                                    _context33.next = 2;
                                    break;
                                }

                                return _context33.abrupt('return');

                            case 2:
                                _context33.next = 4;
                                return ons.notification.confirm('Do you want to delete the report?', { title: '<ons-icon icon="md-delete" style="color: #3f51b5" size="33px"></ons-icon> <span style="color: #3f51b5; display: inline-block; margin-left: 1em;">Delete Report</span>',
                                    buttonLabels: ['No', 'Yes'], modifier: 'utopiasoftware-alert-dialog' });

                            case 4:
                                deleteReport = _context33.sent;

                                if (!(deleteReport == 0)) {
                                    _context33.next = 7;
                                    break;
                                }

                                return _context33.abrupt('return');

                            case 7:

                                // display the page preloader
                                $('#evaluation-report-page .page-preloader').css("display", "block");

                                // remove the evaluation report from database
                                _context33.next = 10;
                                return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.remove(docId, docRevision);

                            case 10:
                                _context33.next = 12;
                                return $('#app-main-navigator').get(0).popPage();

                            case 12:

                                // get the list item corresponding to the evaluation report being deleted
                                jQueryListItem = $('#view-reports-page #view-reports-list ons-list-item[data-utopiasoftware-ptracker-report-id="' + docId + '"]');

                                // remove the element from the list item altogether

                                jQueryListItem.remove();

                                // inform the user that evaluation report has been delete
                                // display a toast to the user
                                _context33.next = 16;
                                return ons.notification.toast('<ons-icon icon="md-delete" size="28px" style="color: #00D5C3"></ons-icon> <span style="text-transform: capitalize; display: inline-block; margin-left: 1em">Report Deleted</span>', { timeout: 2500 });

                            case 16:
                            case 'end':
                                return _context33.stop();
                        }
                    }
                }, _callee32, this);
            }));

            function reportDeleteButtonClicked() {
                return _ref32.apply(this, arguments);
            }

            return reportDeleteButtonClicked;
        }()
    },

    /**
     * this is the view model for the collator page
     */
    collatorPageViewModel: {

        electionDataArray: [],

        /**
         * event is triggered when page is initialised
         */
        pageInit: function () {
            var _ref33 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee34(event) {

                //function is used to initialise the page if the app is fully ready for execution
                var loadPageOnAppReady = function () {
                    var _ref34 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee33() {
                        return regeneratorRuntime.wrap(function _callee33$(_context34) {
                            while (1) {
                                switch (_context34.prev = _context34.next) {
                                    case 0:
                                        if (!(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false)) {
                                            _context34.next = 3;
                                            break;
                                        }

                                        setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                                        return _context34.abrupt('return');

                                    case 3:

                                        // initialise the SENATORIAL DISTRICT DROPDOWN LIST
                                        new ej.dropdowns.DropDownList({
                                            dataSource: utopiasoftware[utopiasoftware_app_namespace].controller.collatorPageViewModel.electionDataArray[0],
                                            enabled: true,
                                            floatLabelType: 'Auto',
                                            fields: { text: "doc.senatorial_description", value: "doc.senatorial_code" },
                                            placeholder: "Senatorial Districts"
                                        }).appendTo('#collator-page-senatorial-districts');

                                    case 4:
                                    case 'end':
                                        return _context34.stop();
                                }
                            }
                        }, _callee33, this);
                    }));

                    return function loadPageOnAppReady() {
                        return _ref34.apply(this, arguments);
                    };
                }();

                var $thisPage;
                return regeneratorRuntime.wrap(function _callee34$(_context35) {
                    while (1) {
                        switch (_context35.prev = _context35.next) {
                            case 0:
                                $thisPage = $(event.target); // get the current page shown
                                // disable the swipeable feature for the app splitter

                                $('ons-splitter-side').removeAttr("swipeable");

                                // call the function used to initialise the app page if the app is fully loaded
                                loadPageOnAppReady();
                            case 3:
                            case 'end':
                                return _context35.stop();
                        }
                    }
                }, _callee34, this);
            }));

            function pageInit(_x18) {
                return _ref33.apply(this, arguments);
            }

            return pageInit;
        }(),

        /**
         * method is triggered when page is shown
         */
        pageShow: function () {
            var _ref35 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee35() {
                return regeneratorRuntime.wrap(function _callee35$(_context36) {
                    while (1) {
                        switch (_context36.prev = _context36.next) {
                            case 0:
                            case 'end':
                                return _context36.stop();
                        }
                    }
                }, _callee35, this);
            }));

            function pageShow() {
                return _ref35.apply(this, arguments);
            }

            return pageShow;
        }(),

        /**
         * method is triggered when page is hidden
         */
        pageHide: function () {
            var _ref36 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee36() {
                return regeneratorRuntime.wrap(function _callee36$(_context37) {
                    while (1) {
                        switch (_context37.prev = _context37.next) {
                            case 0:
                            case 'end':
                                return _context37.stop();
                        }
                    }
                }, _callee36, this);
            }));

            function pageHide() {
                return _ref36.apply(this, arguments);
            }

            return pageHide;
        }(),

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function () {
            var _ref37 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee37() {
                return regeneratorRuntime.wrap(function _callee37$(_context38) {
                    while (1) {
                        switch (_context38.prev = _context38.next) {
                            case 0:
                            case 'end':
                                return _context38.stop();
                        }
                    }
                }, _callee37, this);
            }));

            function pageDestroy() {
                return _ref37.apply(this, arguments);
            }

            return pageDestroy;
        }()
    }

};

//# sourceMappingURL=controller-compiled.js.map