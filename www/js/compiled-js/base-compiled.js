"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Created by UTOPIA SOFTWARE on 26/7/2018.
 */

/**
 * file provides the "base" framework/utilities required to launch the app.
 * E.g. - File creates the base namespace which the app is built on.
 * - Loads all the ES moddule libraries required etc
 *
 * The author uses the terms 'method' and function interchangeably; likewise the terms 'attribute' and 'property' are
 * also used interchangeably
 **/

/**
 * prepare/config the dynamic loader for all the necessary ES Modules
SystemJS.config({
    baseURL: 'js',
    paths: {
        "ej2-modules": "ej2-components-16.2.48" // path is for the base folder that contains all EJ2 COMPONENT MODULES
    },
    map: {
    }
});
** END OF SYSTEMJS CONFIG **/

// constant that defines the app namespace
var utopiasoftware_app_namespace = 'edpms';

/**
 * create the namespace and base methods and properties for the app
 * @type {{}}
 */
var utopiasoftware = _defineProperty({}, utopiasoftware_app_namespace, {

    /**
     * object is responsible for handling operations on the app's cached data
     */
    appCachedData: {

        /**
         * method is used to download the project data to be cached. This includes project data and milestones data
         * @param showProgressModal {Boolean}
         * @returns {Promise<void>}
         */
        loadProjectData: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                var showProgressModal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
                var serverResponse, allProjects;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (!(navigator.connection.type === Connection.NONE)) {
                                    _context.next = 3;
                                    break;
                                }

                                // no Internet Connection
                                // inform the user that they cannot proceed without Internet
                                window.plugins.toast.showWithOptions({
                                    message: "You cannot download offline data without an Internet Connection",
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
                                throw "no internet connection";

                            case 3:
                                _context.prev = 3;

                                // keep device awake during the downloading process
                                window.plugins.insomnia.keepAwake();

                                if (showProgressModal === true) {
                                    // check if download progress modal should be displayed to user
                                    // show download progress
                                    $('#determinate-progress-modal .modal-message').html('Downloading projects data for offline use...');
                                    $('#determinate-progress-modal').get(0).show();
                                    $('#determinate-progress-modal #determinate-progress').get(0).value = 30;
                                }

                                // get the projects data to be cached
                                _context.next = 8;
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

                            case 8:
                                serverResponse = _context.sent;


                                serverResponse = JSON.parse(serverResponse); // convert the response to JSON object

                                $('#determinate-progress-modal #determinate-progress').get(0).value = 35;

                                // delete all previous project data/docs
                                _context.next = 13;
                                return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.find({
                                    selector: {
                                        "TYPE": {
                                            "$eq": "projects"
                                        } },
                                    fields: ["_id", "_rev", "PROJECTID", "TITLE", "CONTRACTSUM", "CONTRACTOR", "CONTRACTORID", "MDAID", "TYPE"],
                                    use_index: ["ptracker-index-designdoc", "DOC_TYPE_INDEX"]
                                });

                            case 13:
                                allProjects = _context.sent;


                                // get all the returned projects and delete them
                                allProjects = allProjects.docs.map(function (currentValue, index, array) {
                                    currentValue._deleted = true; // mark the document as deleted
                                    return currentValue;
                                });

                                // check if there are any project data to delete

                                if (!(allProjects.length > 0)) {
                                    _context.next = 18;
                                    break;
                                }

                                _context.next = 18;
                                return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.bulkDocs(allProjects);

                            case 18:

                                $('#determinate-progress-modal #determinate-progress').get(0).value = 45;

                                // store all the project data received
                                _context.next = 21;
                                return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.bulkDocs(serverResponse);

                            case 21:
                                // inform the user that milestone data is being downloaded for offline use
                                $('#determinate-progress-modal .modal-message').html('Downloading milestones data for offline use...');

                                $('#determinate-progress-modal #determinate-progress').get(0).value = 50;

                                // get the milestones data to be cached
                                _context.next = 25;
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

                            case 25:
                                serverResponse = _context.sent;


                                serverResponse = JSON.parse(serverResponse); // convert the response to JSON object

                                $('#determinate-progress-modal #determinate-progress').get(0).value = 65;

                                // delete all previous milestones /docs
                                _context.next = 30;
                                return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.find({
                                    selector: {
                                        "TYPE": {
                                            "$eq": "BOQ"
                                        } },
                                    fields: ["_id", "_rev", "CATEGORY", "AMOUNT", "RATE", "PROJECTID", "DDATE", "BOQID", "TYPE"],
                                    use_index: ["ptracker-index-designdoc", "DOC_TYPE_INDEX"]
                                });

                            case 30:
                                allProjects = _context.sent;


                                // get all the returned milestones and delete them
                                allProjects = allProjects.docs.map(function (currentValue, index, array) {
                                    currentValue._deleted = true; // mark the document as deleted
                                    return currentValue;
                                });

                                // check if there are any milestone data to delete

                                if (!(allProjects.length > 0)) {
                                    _context.next = 35;
                                    break;
                                }

                                _context.next = 35;
                                return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.bulkDocs(allProjects);

                            case 35:

                                $('#determinate-progress-modal #determinate-progress').get(0).value = 80;

                                // store the all the milestone data received
                                _context.next = 38;
                                return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.bulkDocs(serverResponse);

                            case 38:

                                // inform the user that approved evaluation data is being downloaded for offline use
                                $('#determinate-progress-modal .modal-message').html('Downloading approved evaluation data for offline use...');
                                $('#determinate-progress-modal #determinate-progress').get(0).value = 85;

                                // get previously uploaded and approved project evaluation reports
                                _context.next = 42;
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

                            case 42:
                                serverResponse = _context.sent;


                                serverResponse = JSON.parse(serverResponse); // convert the response to JSON object

                                $('#determinate-progress-modal #determinate-progress').get(0).value = 90;

                                // delete all previously stored/cached approved project evaluation reports
                                _context.next = 47;
                                return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.find({
                                    selector: {
                                        "TYPE": {
                                            "$eq": "project evaluations"
                                        } },
                                    use_index: ["ptracker-index-designdoc", "DOC_TYPE_INDEX"]
                                });

                            case 47:
                                allProjects = _context.sent;


                                // get all the returned approved evaluation report and delete them
                                allProjects = allProjects.docs.map(function (currentValue, index, array) {
                                    currentValue._deleted = true; // mark the document as deleted
                                    return currentValue;
                                });

                                // check if there are any approved evaluation report to delete

                                if (!(allProjects.length > 0)) {
                                    _context.next = 52;
                                    break;
                                }

                                _context.next = 52;
                                return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.bulkDocs(allProjects);

                            case 52:

                                // format the retrieved evaluation report before storing in the app database
                                serverResponse = serverResponse.map(function (currentValue, index, array) {
                                    // format/convert the EVALUATIONS field to proper json
                                    currentValue.EVALUATIONS = JSON.parse(currentValue.EVALUATIONS);
                                    return currentValue;
                                });

                                $('#determinate-progress-modal #determinate-progress').get(0).value = 100;

                                // store the all the milestone data received
                                _context.next = 56;
                                return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.bulkDocs(serverResponse);

                            case 56:
                                if (!(showProgressModal === true)) {
                                    _context.next = 59;
                                    break;
                                }

                                _context.next = 59;
                                return $('#determinate-progress-modal').get(0).hide();

                            case 59:
                                _context.prev = 59;

                                if (!(showProgressModal === true)) {
                                    _context.next = 63;
                                    break;
                                }

                                _context.next = 63;
                                return $('#determinate-progress-modal').get(0).hide();

                            case 63:
                                window.plugins.insomnia.allowSleepAgain(); // the device can go to sleep now
                                return _context.finish(59);

                            case 65:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[3,, 59, 65]]);
            }));

            function loadProjectData() {
                return _ref.apply(this, arguments);
            }

            return loadProjectData;
        }()
    },

    /**
     * object is responsible for handling operations on the project evaluation report sheet data
     */
    projectEvaluationReportData: {

        /**
         * method is used to upload all project evaluation report data/sheets to the server.
         * during the process of upload, all successfully uploaded report data will be deleted
         * from the user's device.
         *
         * @param showProgressModal
         * @returns {Promise<Number>} resolves with a Promise containing
         * the number of report sheets that were successfully uploaded OR rejects with an error object
         */
        uploadProjectEvaluationReports: function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                var showProgressModal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
                var totalReportSheets, reportSheets, index, formData, serverResponse;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (!(navigator.connection.type === Connection.NONE)) {
                                    _context2.next = 3;
                                    break;
                                }

                                // no Internet Connection
                                // inform the user that they cannot proceed without Internet
                                window.plugins.toast.showWithOptions({
                                    message: "You cannot upload evaluation reports without an Internet Connection",
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
                                throw "no internet connection";

                            case 3:
                                totalReportSheets = 0; // holds the total number of report sheets to be uploaded

                                _context2.prev = 4;

                                // keep device awake during the downloading process
                                window.plugins.insomnia.keepAwake();

                                if (showProgressModal === true) {
                                    // check if download progress modal should be displayed to user
                                    // show download progress
                                    $('#determinate-progress-modal .modal-message').html('Prepping Evaluation Report for Upload...');
                                    $('#determinate-progress-modal').get(0).show();
                                    $('#determinate-progress-modal #determinate-progress').get(0).value = 1;
                                }

                                // get all the save project report sheets evaluated by the current signed in user from the app database
                                _context2.next = 9;
                                return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.find({
                                    selector: {
                                        "TYPE": {
                                            "$eq": "saved report"
                                        },
                                        "evaluatedBy": {
                                            "$eq": utopiasoftware[utopiasoftware_app_namespace].model.userDetails.userDetails.username
                                        }
                                    },
                                    fields: ["TYPE", "evaluatedBy", "_id", "_rev"],
                                    use_index: ["ptracker-index-designdoc", "FIND_SAVED_REPORT_BY_EVALUATED_BY"]
                                });

                            case 9:
                                reportSheets = _context2.sent;

                                if (!(reportSheets.docs.length === 0)) {
                                    _context2.next = 16;
                                    break;
                                }

                                if (!(showProgressModal === true)) {
                                    _context2.next = 14;
                                    break;
                                }

                                _context2.next = 14;
                                return $('#determinate-progress-modal').get(0).hide();

                            case 14:
                                window.plugins.insomnia.allowSleepAgain(); // the device can go to sleep now
                                return _context2.abrupt("return", 0);

                            case 16:

                                reportSheets = reportSheets.docs; // reassign the report sheets array
                                totalReportSheets = reportSheets.length; // update the number of report sheets to be sent

                                // upload each of the report sheets one at a time
                                index = 0;

                            case 19:
                                if (!(index < reportSheets.length)) {
                                    _context2.next = 56;
                                    break;
                                }

                                if (showProgressModal === true) {
                                    // check if download progress modal should be displayed to user
                                    // show download progress
                                    $('#determinate-progress-modal .modal-message').html("Uploading Evaluation Report " + (totalReportSheets - (reportSheets.length - 1)) + " Of " + totalReportSheets + ". Please Wait...");
                                    $('#determinate-progress-modal #determinate-progress').get(0).value = Math.round((totalReportSheets - (reportSheets.length - 1)) / totalReportSheets * 100);
                                }
                                // create the FormData object to be used in sending the report sheet
                                formData = new FormData();
                                // attach the evaluation report data to the FormData

                                _context2.t0 = formData;
                                _context2.t1 = JSON;
                                _context2.next = 26;
                                return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.get(reportSheets[index]._id);

                            case 26:
                                _context2.t2 = _context2.sent;
                                _context2.t3 = _context2.t1.stringify.call(_context2.t1, _context2.t2);

                                _context2.t0.set.call(_context2.t0, "reportData", _context2.t3);

                                _context2.t4 = formData;
                                _context2.next = 32;
                                return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.getAttachment(reportSheets[index]._id, "picture1.jpg");

                            case 32:
                                _context2.t5 = _context2.sent;

                                _context2.t4.set.call(_context2.t4, "evaluation-pic-1", _context2.t5);

                                _context2.t6 = formData;
                                _context2.next = 37;
                                return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.getAttachment(reportSheets[index]._id, "picture2.jpg");

                            case 37:
                                _context2.t7 = _context2.sent;

                                _context2.t6.set.call(_context2.t6, "evaluation-pic-2", _context2.t7);

                                _context2.t8 = formData;
                                _context2.next = 42;
                                return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.getAttachment(reportSheets[index]._id, "picture3.jpg");

                            case 42:
                                _context2.t9 = _context2.sent;

                                _context2.t8.set.call(_context2.t8, "evaluation-pic-3", _context2.t9);

                                _context2.next = 46;
                                return Promise.resolve($.ajax({
                                    url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + "/mobile/reports-upload.php",
                                    //url: "reports-upload.json",
                                    type: "post",
                                    contentType: false,
                                    beforeSend: function beforeSend(jqxhr) {
                                        jqxhr.setRequestHeader("X-PTRACKER-APP", "mobile");
                                    },
                                    dataType: "text",
                                    timeout: 240000, // wait for 4 minutes before timeout of request
                                    processData: false,
                                    data: formData
                                }));

                            case 46:
                                serverResponse = _context2.sent;


                                serverResponse = JSON.parse(serverResponse.trim());

                                if (!(serverResponse.status !== "success")) {
                                    _context2.next = 50;
                                    break;
                                }

                                throw serverResponse;

                            case 50:
                                _context2.next = 52;
                                return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.remove(reportSheets[index]._id, reportSheets[index]._rev);

                            case 52:
                                // also remove the evaluation report from the reportSheets array
                                reportSheets.shift();

                            case 53:
                                index = 0;
                                _context2.next = 19;
                                break;

                            case 56:
                                _context2.next = 58;
                                return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.compact();

                            case 58:
                                _context2.next = 60;
                                return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.viewCleanup();

                            case 60:
                                return _context2.abrupt("return", totalReportSheets);

                            case 61:
                                _context2.prev = 61;

                                if (!(showProgressModal === true)) {
                                    _context2.next = 65;
                                    break;
                                }

                                _context2.next = 65;
                                return $('#determinate-progress-modal').get(0).hide();

                            case 65:
                                window.plugins.insomnia.allowSleepAgain(); // the device can go to sleep now
                                return _context2.finish(61);

                            case 67:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[4,, 61, 67]]);
            }));

            function uploadProjectEvaluationReports() {
                return _ref2.apply(this, arguments);
            }

            return uploadProjectEvaluationReports;
        }(),


        /**
         * method is used to return a collection of saved evaluation reports from the app database
         *
         * @param include_docs
         * @param limit
         * @param skip
         * @param descending
         * @param startDateStamp
         * @param endDateStamp
         * @returns {Promise<*>}
         */
        loadProjectEvaluationReports: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                var include_docs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
                var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
                var skip = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
                var descending = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
                var startDateStamp = arguments[4];
                var endDateStamp = arguments[5];
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.prev = 0;
                                _context3.next = 3;
                                return utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.query("saved_reports_view/get_report_evaluated_by", {
                                    include_docs: include_docs,
                                    limit: limit,
                                    skip: skip,
                                    descending: descending,
                                    startkey: ["saved report", utopiasoftware[utopiasoftware_app_namespace].model.userDetails.userDetails.username, startDateStamp],
                                    endkey: ["saved report", utopiasoftware[utopiasoftware_app_namespace].model.userDetails.userDetails.username, endDateStamp]
                                });

                            case 3:
                                return _context3.abrupt("return", _context3.sent);

                            case 4:
                                _context3.prev = 4;
                                return _context3.finish(4);

                            case 6:
                            case "end":
                                return _context3.stop();
                        }
                    }
                }, _callee3, this, [[0,, 4, 6]]);
            }));

            function loadProjectEvaluationReports() {
                return _ref3.apply(this, arguments);
            }

            return loadProjectEvaluationReports;
        }()
    },

    utilities: {
        updateBulkDocsInBatches: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
                var batchSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
                var docsArray = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
                var appDatabase = arguments[2];
                var batchCycle, cycleIndex, batchedArray;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                if (!(docsArray.length === 0)) {
                                    _context4.next = 2;
                                    break;
                                }

                                return _context4.abrupt("return", true);

                            case 2:

                                batchCycle = Math.ceil(docsArray.length / batchSize);

                                cycleIndex = 0;

                            case 4:
                                if (!(cycleIndex < batchCycle)) {
                                    _context4.next = 11;
                                    break;
                                }

                                // get the batched docs to update in the app database
                                batchedArray = docsArray.slice(cycleIndex * batchSize, (cycleIndex + 1) * batchSize);
                                // update the database with the batched docs

                                _context4.next = 8;
                                return appDatabase.bulkDocs(batchedArray);

                            case 8:
                                cycleIndex++;
                                _context4.next = 4;
                                break;

                            case 11:
                                return _context4.abrupt("return", true);

                            case 12:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function updateBulkDocsInBatches() {
                return _ref4.apply(this, arguments);
            }

            return updateBulkDocsInBatches;
        }()
    }
});

//# sourceMappingURL=base-compiled.js.map