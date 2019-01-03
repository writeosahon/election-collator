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
const utopiasoftware_app_namespace = 'election-collator';

/**
 * create the namespace and base methods and properties for the app
 * @type {{}}
 */
const utopiasoftware = {
    [utopiasoftware_app_namespace]: {

        /**
         * object is responsible for handling operations on the app's cached data
         */
        appCachedData: {

            /**
             * method is used to download the project data to be cached. This includes project data and milestones data
             * @param showProgressModal {Boolean}
             * @returns {Promise<void>}
             */
            async loadProjectData(showProgressModal = true){

                // check if Internet Connection is available before proceeding
                if(navigator.connection.type === Connection.NONE){ // no Internet Connection
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
                    }, function(toastEvent){
                        if(toastEvent && toastEvent.event == "touch"){ // user tapped the toast, so hide toast immediately
                            window.plugins.toast.hide();
                        }
                    });
                    throw "no internet connection";
                }

                try{
                    // keep device awake during the downloading process
                    window.plugins.insomnia.keepAwake();

                    if(showProgressModal === true){ // check if download progress modal should be displayed to user
                        // show download progress
                        $('#determinate-progress-modal .modal-message').html('Downloading projects data for offline use...');
                        $('#determinate-progress-modal').get(0).show();
                        $('#determinate-progress-modal #determinate-progress').get(0).value = 30;
                    }

                    // get the projects data to be cached
                    let serverResponse = await Promise.resolve($.ajax(
                        {
                            url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + "/mobile/loadprojects.php",
                            type: "post",
                            contentType: "application/x-www-form-urlencoded",
                            beforeSend: function(jqxhr) {
                                jqxhr.setRequestHeader("X-PTRACKER-APP", "mobile");
                            },
                            dataType: "text",
                            timeout: 240000, // wait for 4 minutes before timeout of request
                            processData: true,
                            data: {}
                        }
                    ));

                    serverResponse = JSON.parse(serverResponse); // convert the response to JSON object

                    $('#determinate-progress-modal #determinate-progress').get(0).value = 35;

                    // delete all previous project data/docs
                    let allProjects = await utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.find({
                        selector: {
                            "TYPE": {
                                "$eq": "projects"
                            }},
                        fields: ["_id", "_rev", "PROJECTID", "TITLE", "CONTRACTSUM", "CONTRACTOR", "CONTRACTORID", "MDAID", "TYPE"],
                        use_index: ["ptracker-index-designdoc", "DOC_TYPE_INDEX"]
                    });

                    // get all the returned projects and delete them
                    allProjects = allProjects.docs.map((currentValue, index, array) => {
                        currentValue._deleted = true; // mark the document as deleted
                        return currentValue;
                    });

                    // check if there are any project data to delete
                    if(allProjects.length > 0){
                        // delete the already saved projects
                        await utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.bulkDocs(allProjects);
                    }

                    $('#determinate-progress-modal #determinate-progress').get(0).value = 45;

                    // store all the project data received
                    await utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.bulkDocs(serverResponse);
                    // inform the user that milestone data is being downloaded for offline use
                    $('#determinate-progress-modal .modal-message').html('Downloading milestones data for offline use...');

                    $('#determinate-progress-modal #determinate-progress').get(0).value = 50;

                    // get the milestones data to be cached
                    serverResponse = await Promise.resolve($.ajax(
                        {
                            url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + "/mobile/loadboq.php",
                            type: "post",
                            contentType: "application/x-www-form-urlencoded",
                            beforeSend: function(jqxhr) {
                                jqxhr.setRequestHeader("X-PTRACKER-APP", "mobile");
                            },
                            dataType: "text",
                            timeout: 240000, // wait for 4 minutes before timeout of request
                            processData: true,
                            data: {}
                        }
                    ));

                    serverResponse = JSON.parse(serverResponse); // convert the response to JSON object

                    $('#determinate-progress-modal #determinate-progress').get(0).value = 65;

                    // delete all previous milestones /docs
                    allProjects = await utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.find({
                        selector: {
                            "TYPE": {
                                "$eq": "BOQ"
                            }},
                        fields: ["_id", "_rev", "CATEGORY", "AMOUNT", "RATE", "PROJECTID", "DDATE", "BOQID", "TYPE"],
                        use_index: ["ptracker-index-designdoc", "DOC_TYPE_INDEX"]
                    });

                    // get all the returned milestones and delete them
                    allProjects = allProjects.docs.map((currentValue, index, array) => {
                        currentValue._deleted = true; // mark the document as deleted
                        return currentValue;
                    });

                    // check if there are any milestone data to delete
                    if(allProjects.length > 0){
                        // delete the already saved milestone data
                        await utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.bulkDocs(allProjects);
                    }

                    $('#determinate-progress-modal #determinate-progress').get(0).value = 80;

                    // store the all the milestone data received
                    await utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.bulkDocs(serverResponse);

                    // inform the user that approved evaluation data is being downloaded for offline use
                    $('#determinate-progress-modal .modal-message').html('Downloading approved evaluation data for offline use...');
                    $('#determinate-progress-modal #determinate-progress').get(0).value = 85;

                    // get previously uploaded and approved project evaluation reports
                    serverResponse = await Promise.resolve($.ajax(
                        {
                            url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + "/mobile/load-current-evaluations.php",
                            type: "post",
                            contentType: "application/x-www-form-urlencoded",
                            beforeSend: function(jqxhr) {
                                jqxhr.setRequestHeader("X-PTRACKER-APP", "mobile");
                            },
                            dataType: "text",
                            timeout: 240000, // wait for 4 minutes before timeout of request
                            processData: true,
                            data: {}
                        }
                    ));

                    serverResponse = JSON.parse(serverResponse); // convert the response to JSON object

                    $('#determinate-progress-modal #determinate-progress').get(0).value = 90;

                    // delete all previously stored/cached approved project evaluation reports
                    allProjects = await utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.find({
                        selector: {
                            "TYPE": {
                                "$eq": "project evaluations"
                            }},
                        use_index: ["ptracker-index-designdoc", "DOC_TYPE_INDEX"]
                    });

                    // get all the returned approved evaluation report and delete them
                    allProjects = allProjects.docs.map((currentValue, index, array) => {
                        currentValue._deleted = true; // mark the document as deleted
                        return currentValue;
                    });

                    // check if there are any approved evaluation report to delete
                    if(allProjects.length > 0){
                        // delete the previously saved/cached approved evaluation report
                        await utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.bulkDocs(allProjects);
                    }

                    // format the retrieved evaluation report before storing in the app database
                    serverResponse = serverResponse.map((currentValue, index, array) => {
                        // format/convert the EVALUATIONS field to proper json
                        currentValue.EVALUATIONS = JSON.parse(currentValue.EVALUATIONS);
                        return currentValue;
                    });

                    $('#determinate-progress-modal #determinate-progress').get(0).value = 100;

                    // store the all the milestone data received
                    await utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.bulkDocs(serverResponse);

                    if(showProgressModal === true){
                        // hide the progress loader
                        await $('#determinate-progress-modal').get(0).hide();
                    }
                }
                finally {
                    if(showProgressModal === true){
                        // hide the progress loader
                        await $('#determinate-progress-modal').get(0).hide();
                    }
                    window.plugins.insomnia.allowSleepAgain(); // the device can go to sleep now
                }
            }
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
            async uploadProjectEvaluationReports(showProgressModal = true){

                // check if Internet Connection is available before proceeding
                if(navigator.connection.type === Connection.NONE){ // no Internet Connection
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
                    }, function(toastEvent){
                        if(toastEvent && toastEvent.event == "touch"){ // user tapped the toast, so hide toast immediately
                            window.plugins.toast.hide();
                        }
                    });
                    throw "no internet connection";
                }

                var totalReportSheets = 0; // holds the total number of report sheets to be uploaded

                try{
                    // keep device awake during the downloading process
                    window.plugins.insomnia.keepAwake();

                    if(showProgressModal === true){ // check if download progress modal should be displayed to user
                        // show download progress
                        $('#determinate-progress-modal .modal-message').html('Prepping Evaluation Report for Upload...');
                        $('#determinate-progress-modal').get(0).show();
                        $('#determinate-progress-modal #determinate-progress').get(0).value = 1;
                    }

                    // get all the save project report sheets evaluated by the current signed in user from the app database
                    let reportSheets = await utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.find({
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

                    if(reportSheets.docs.length === 0){ // there are no report sheets to upload
                        if(showProgressModal === true){
                            // hide the progress loader
                            await $('#determinate-progress-modal').get(0).hide();
                        }
                        window.plugins.insomnia.allowSleepAgain(); // the device can go to sleep now
                        return 0;
                    }

                    reportSheets = reportSheets.docs; // reassign the report sheets array
                    totalReportSheets = reportSheets.length; // update the number of report sheets to be sent

                    // upload each of the report sheets one at a time
                    for(let index = 0; index < reportSheets.length; index = 0){

                        if(showProgressModal === true){ // check if download progress modal should be displayed to user
                            // show download progress
                            $('#determinate-progress-modal .modal-message').
                            html(`Uploading Evaluation Report ${totalReportSheets - (reportSheets.length - 1)} Of ${totalReportSheets}. Please Wait...`);
                            $('#determinate-progress-modal #determinate-progress').get(0).value =
                                Math.round(((totalReportSheets - (reportSheets.length - 1)) / totalReportSheets) * 100);
                        }
                        // create the FormData object to be used in sending the report sheet
                        let formData = new FormData();
                        // attach the evaluation report data to the FormData
                        formData.set("reportData", JSON.stringify(await utopiasoftware[utopiasoftware_app_namespace].model.
                            appDatabase.get(reportSheets[index]._id)));
                        // attach the blob for the evaluation pictures 1 - 3 to the FormData
                        formData.set("evaluation-pic-1", await utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.
                            getAttachment(reportSheets[index]._id, "picture1.jpg"));
                        formData.set("evaluation-pic-2", await utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.
                        getAttachment(reportSheets[index]._id, "picture2.jpg"));
                        formData.set("evaluation-pic-3", await utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.
                        getAttachment(reportSheets[index]._id, "picture3.jpg"));

                        // send the FormData to the server
                        let serverResponse = await Promise.resolve($.ajax(
                            {
                                url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + "/mobile/reports-upload.php",
                                //url: "reports-upload.json",
                                type: "post",
                                contentType: false,
                                beforeSend: function(jqxhr) {
                                    jqxhr.setRequestHeader("X-PTRACKER-APP", "mobile");
                                },
                                dataType: "text",
                                timeout: 240000, // wait for 4 minutes before timeout of request
                                processData: false,
                                data: formData
                            }
                        ));

                        serverResponse = JSON.parse(serverResponse.trim());

                        if(serverResponse.status !== "success"){ // the evaluation report could not be saved by the server
                            throw serverResponse; // throw error and END upload process
                        }

                        // since server upload of the evaluation report was successful, remove the evaluation report from app database
                        await utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.
                        remove(reportSheets[index]._id, reportSheets[index]._rev);
                        // also remove the evaluation report from the reportSheets array
                        reportSheets.shift();
                    }

                    // compact the database
                    await utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.compact();
                    // cleanup unused/stale database views/queries
                    await utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.viewCleanup();
                    return totalReportSheets; // return the total number of report sheet uploaded
                }
                finally {
                    if(showProgressModal === true){
                        // hide the progress loader
                        await $('#determinate-progress-modal').get(0).hide();
                    }
                    window.plugins.insomnia.allowSleepAgain(); // the device can go to sleep now
                }
            },

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
            async loadProjectEvaluationReports(include_docs = false, limit = 10, skip = 0,
                                               descending = false, startDateStamp, endDateStamp){

                try{

                    // search the app database for saved reports evaluated by currently logged in user
                    return await utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.
                    query("saved_reports_view/get_report_evaluated_by", {
                        include_docs: include_docs,
                        limit: limit,
                        skip: skip,
                        descending: descending,
                        startkey: ["saved report",
                            utopiasoftware[utopiasoftware_app_namespace].model.userDetails.userDetails.username, startDateStamp],
                        endkey: ["saved report",
                            utopiasoftware[utopiasoftware_app_namespace].model.userDetails.userDetails.username, endDateStamp]
                    });
                }
                finally {

                }
            }
        },

        utilities: {

            async updateBulkDocsInBatches(batchSize = 500, docsArray = [], appDatabase){
                var batchCycle; // holds the number of update batch cycles to run

                if(docsArray.length === 0){ // no docs to update
                    return true; // no batch update to perform
                }

                batchCycle = Math.ceil((docsArray.length / batchSize));

                for(let cycleIndex = 0; cycleIndex < batchCycle; cycleIndex++){
                    // get the batched docs to update in the app database
                    let batchedArray = docsArray.slice((cycleIndex * batchSize), ((cycleIndex + 1) * batchSize));
                    // update the database with the batched docs
                    await appDatabase.bulkDocs(batchedArray);
                }

                return true; // batch update completed successfully
            }
        }
    }
};
