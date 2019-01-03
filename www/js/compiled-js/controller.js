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
    startup: function(){

        // initialise the app libraries and plugins
        ons.ready(async function () {
            // set the default handler for the app
            ons.setDefaultDeviceBackButtonListener(function(){
                // does nothing for now!!
            });

            // displaying prepping message
            $('#loader-modal-message').html("Loading App...");
            $('#loader-modal').get(0).show(); // show loader

            if(false){ // there is a previous logged in user
                // load the app main page
                $('ons-splitter').get(0).content.load("app-main-template");
            }
            else{ // there is no previously logged in user
                // load the login page
                $('ons-splitter').get(0).content.load("login-template");
            }

            // START ALL CORDOVA PLUGINS CONFIGURATIONS
            try{
                // lock the orientation of the device to 'PORTRAIT'
                screen.orientation.lock('portrait');
            }
            catch(err){}

            try { // START ALL THE CORDOVA PLUGINS CONFIGURATION WHICH REQUIRE PROMISE SYNTAX

                // prepare the inapp browser plugin by removing the default window.open() functionality
                delete window.open;

                // prepare the window.URL static object for use
                window.URL = window.URL || window.webkitURL;

                // note: for most promises, we will use async-wait syntax
                //load the senatorial districts, lgas, wards and polling units, data
                let electionDataPromisesArray = [];
                electionDataPromisesArray.push(new Promise(function(resolve, reject){
                    Promise.resolve($.ajax(
                        {
                            url: "edo-state-senatorial-districts-list.json",
                            type: "get",
                            //contentType: "application/x-www-form-urlencoded",
                            beforeSend: function(jqxhr) {
                            },
                            dataType: "json",
                            timeout: 240000, // wait for 4 minutes before timeout of request
                            processData: true,
                            data: {}
                        }
                    )).then(function(responseObject){
                        resolve(responseObject.rows); // resolve the parent promise with the data gotten from the server

                    }).catch(function(err){ // an error occurred

                        reject(err); // reject the parent promise with the error
                    });
                }));

                utopiasoftware[utopiasoftware_app_namespace].controller.collatorPageViewModel.electionDataArray =
                    await Promise.all(electionDataPromisesArray);


            }
            catch(err){
                console.log("APP LOADING ERROR", err);
            }
            finally{
                 // set status bar color
                 StatusBar.backgroundColorByHexString("#00B2A0");
                 navigator.splashscreen.hide(); // hide the splashscreen
                 utopiasoftware[utopiasoftware_app_namespace].model.isAppReady = true; // flag that app is fullyt loaded and ready
            }

        }); // end of ons.ready()

    },

    /**
     * this is the view-model/controller for the SIDE MENU page
     */
    sideMenuPageViewModel: {

        /**
         * method is triggered when the "Sign Out" button is clicked
         * @returns {Promise<void>}
         */
        async signOutButtonClicked(){
            console.log("STACKS", $('#app-main-navigator').get(0).pages);
            // remove the user details rev id from storage
            window.localStorage.removeItem("utopiasoftware-edpms-app-status");
            // load the login page
            await $('ons-splitter').get(0).content.load("login-template");
            // hide the side menu
            $('ons-splitter').get(0).right.close();
        },

        /**
         * method is triggered when the "Upload Reports" button is clicked
         *
         * @returns {Promise<void>}
         */
        async uploadReportsButtonClicked(){
            // upload all the report evaluation sheets
            var totalUploads = 0;

            try{

                totalUploads = await utopiasoftware[utopiasoftware_app_namespace].projectEvaluationReportData.
                uploadProjectEvaluationReports(true);

                if(totalUploads === 0) // no reports were uploaded.
                {
                    await ons.notification.alert('No evaluation reports to upload',
                        {title: '<ons-icon icon="md-info" style="color: #3f51b5" size="33px"></ons-icon> <span style="color: #3f51b5; display: inline-block; margin-left: 1em;">No Reports Uploaded</span>',
                            buttonLabels: ['OK'], modifier: 'utopiasoftware-alert-dialog'});
                }
                else{
                    // inform user that all evaluation reports have been uploaded
                    await ons.notification.alert(`All evaluation reports successfully uploaded. ${totalUploads} in total`,
                        {title: '<ons-icon icon="fa-check" style="color: #00B2A0;" size="25px"></ons-icon> <span style="color: #00B2A0; display: inline-block; margin-left: 1em;">Uploaded Reports</span>',
                            buttonLabels: ['OK'], modifier: 'utopiasoftware-alert-dialog'});
                }

                // call the method to refresh the contents of the View Reports page
                utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.pagePullHookAction();
            }
            catch(err){
                ons.notification.alert(`uploading evaluation reports failed. Please try again. ${err.message || ""}`, {title: '<span style="color: red">Uploading Reports Failed</span>',
                    buttonLabels: ['OK'], modifier: 'utopiasoftware-alert-dialog'});
            }
        },

        /**
         * method is triggered when the "View Reports" button is clicked
         * @returns {Promise<void>}
         */
        async viewReportsButtonClicked(){

            // push the "View Reports" page to view
            await $("#app-main-navigator").get(0).bringPageTop("view-reports-page.html", {animation: "slide"});
            // hide the side menu
            $('ons-splitter').get(0).right.close();
        },

        /**
         * method is triggered when the Refresh Offline Data button is clicked
         * @returns {Promise<void>}
         */
        async refreshOfflineDataButtonClicked(){

            try{

                // reload/refresh the offline app data
                await utopiasoftware[utopiasoftware_app_namespace].appCachedData.loadProjectData(true);

                // inform user that app offline data has been refreshed
                await ons.notification.alert(`App offline has been refreshed successfully`,
                    {title: '<ons-icon icon="fa-check" style="color: #00B2A0;" size="25px"></ons-icon> <span style="color: #00B2A0; display: inline-block; margin-left: 1em;">Offline Data Refreshed</span>',
                        buttonLabels: ['OK'], modifier: 'utopiasoftware-alert-dialog'});

            }
            catch(err){
                ons.notification.alert(`refreshing app offline data failed. Please try again. ${err.message || ""}`, {title: '<span style="color: red">Offline Data Refresh Failed</span>',
                    buttonLabels: ['OK'], modifier: 'utopiasoftware-alert-dialog'});
            }
        }
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
        pageInit: function(event){

            var $thisPage = $(event.target); // get the current page shown
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();

            //function is used to initialise the page if the app is fully ready for execution
            async function loadPageOnAppReady(){
                // check to see if onsen is ready and if all app loading has been completed
                if(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false){
                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                    return;
                }

                // listen for the back button event
                $('#login-navigator').get(0).topPage.onDeviceBackButton = function(){
                    ons.notification.confirm('Do you want to close the app?', {title: 'Exit App',
                        buttonLabels: ['No', 'Yes'], modifier: 'utopiasoftware-alert-dialog'}) // Ask for confirmation
                        .then(function(index) {
                            if (index === 1) { // OK button
                                navigator.app.exitApp(); // Close the app
                            }
                        });
                };

                // adjust the window/view-port settings for when the soft keyboard is displayed
                //window.SoftInputMode.set('adjustPan'); // let the window/view-port 'pan' when the soft keyboard is displayed
                window.SoftInputMode.set('adjustResize');

                // initialise the login form validation
                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.formValidator =
                    $('#login-form').parsley();

                // listen for log in form field validation failure event
                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.formValidator.on('field:error', function(fieldInstance) {
                    // get the element that triggered the field validation error and use it to display tooltip
                    // display tooltip
                    $(fieldInstance.$element).addClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                    $(fieldInstance.$element).attr("data-hint", fieldInstance.getErrorsMessages()[0]);
                });

                // listen for log in form field validation success event
                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.formValidator.on('field:success', function(fieldInstance) {
                    // remove tooltip from element
                    $(fieldInstance.$element).removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                    $(fieldInstance.$element).removeAttr("data-hint");
                });

                // listen for log in form validation success
                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.formValidator.on('form:success',
                    utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.formValidated);

                // hide the loader
                $('#loader-modal').get(0).hide();

            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // adjust the window/view-port settings for when the soft keyboard is displayed
            window.SoftInputMode.set('adjustResize'); // let the window/view-port 'pan' when the soft keyboard is displayed

            // listen for when the device keyboard is hidden
            window.addEventListener("keyboardDidHide", utopiasoftware[utopiasoftware_app_namespace].
                controller.loginPageViewModel.keyboardHidden);

            // listen for when the device keyboard is shown
            window.addEventListener("keyboardDidShow", utopiasoftware[utopiasoftware_app_namespace].
                controller.loginPageViewModel.keyboardShown);
        },


        /**
         * method is triggered when page is hidden
         */
        pageHide: function(){
            // adjust the window/view-port settings for when the soft keyboard is displayed
            // window.SoftInputMode.set('adjustResize'); // let the view 'resize' when the soft keyboard is displayed

            try {
                // remove the listeners registered to listen for when the device keyboard is hidden and shown
                window.removeEventListener("keyboardDidHide", utopiasoftware[utopiasoftware_app_namespace].
                    controller.loginPageViewModel.keyboardHidden);
                window.removeEventListener("keyboardDidShow", utopiasoftware[utopiasoftware_app_namespace].
                    controller.loginPageViewModel.keyboardShown);
                // remove any tooltip being displayed on all forms on the page
                $('#login-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                $('#login-page [data-hint]').removeAttr("data-hint");
                // reset the form validator object on the page
                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.formValidator.reset();
            }
            catch(err){}
        },

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function(){

            try {
                // remove any tooltip being displayed on all forms on the page
                $('#login-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                $('#login-page [data-hint]').removeAttr("data-hint");
                // reset the form validator object on the page
                utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.formValidator.destroy();
            }
            catch(err){}
        },

        /**
         * method will be triggered when the device keyboard is hidden. This is an event listener
         */
        keyboardHidden(){
            // show the title banner on the home page
            $('#login-page .login-title-banner').css("display", "block");
        },

        /**
         * method will be triggered when the device keyboard is shown. This is an event listener
         */
        keyboardShown(){
            // hide the title banner on the home page
            $('#login-page .login-title-banner').css("display", "none");
        },

        /**
         * method is triggered when the "Sign In / Log In" button is clicked
         *
         * @returns {Promise<void>}
         */
        async loginButtonClicked(){

            // run the validation method for the sign-in form
            utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.formValidator.whenValidate();
        },

        /**
         * method is triggered when the enter button is clicked on the device keyboard
         *
         * @param keyEvent
         * @returns {Promise<void>}
         */
        async enterButtonClicked(keyEvent){
            // check which key was pressed
            if(keyEvent.which === kendo.keys.ENTER) // if the enter key was pressed
            {
                // prevent the default action from occurring
                keyEvent.preventDefault();
                keyEvent.stopImmediatePropagation();
                keyEvent.stopPropagation();
                // hide the device keyboard
                Keyboard.hide();
            }
        },

        /**
         * method is triggered when the form is successfully validated
         *
         * @returns {Promise<void>}
         */
        async formValidated(){

            // check if Internet Connection is available before proceeding
            if(navigator.connection.type === Connection.NONE){ // no Internet Connection
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
                }, function(toastEvent){
                    if(toastEvent && toastEvent.event == "touch"){ // user tapped the toast, so hide toast immediately
                        window.plugins.toast.hide();
                    }
                });

                return; // exit method immediately
            }

            // inform user that login validation is taking place
            $('#loader-modal #loader-modal-message').html("Signing You In...");
            await $('#loader-modal').get(0).show();

            try{
                // create the form data to be submitted
                let formData = {
                    username: $('#login-page #login-email').val().trim(),
                    password: $('#login-page #login-password').val().trim()
                };

                let serverResponse = await Promise.resolve($.ajax(
                    {
                        url: utopiasoftware[utopiasoftware_app_namespace].model.appBaseUrl + "/mobile/login.php",
                        type: "post",
                        contentType: "application/x-www-form-urlencoded",
                        beforeSend: function(jqxhr) {
                            jqxhr.setRequestHeader("X-PTRACKER-APP", "mobile");
                        },
                        dataType: "text",
                        timeout: 240000, // wait for 4 minutes before timeout of request
                        processData: true,
                        data: formData
                    }
                ));
                // convert the response to an object
                serverResponse = JSON.parse(serverResponse.trim());

                // check if the user login was successful
                if(serverResponse.status !== "success"){ // user log was NOT successful
                    throw serverResponse; // throw error
                }

                // save the user's details
                utopiasoftware[utopiasoftware_app_namespace].model.userDetails = {
                    _id: "userDetails",
                    userDetails: {firstname: serverResponse.firstname, username: serverResponse.username},
                    type: "userDetails",
                    _rev: (window.localStorage.getItem("utopiasoftware-edpms-app-status") &&
                        window.localStorage.getItem("utopiasoftware-edpms-app-status") !== "") ?
                        window.localStorage.getItem("utopiasoftware-edpms-app-status") : null
                };

                // check if the user wants to remain signed in
                if($('#login-page #login-remember-me').get(0).checked){ // the user wants to remian signed in
                    // save the user's details to persistent database
                    let userDetailsDoc = null; // holds the previous stored user details from the database
                    try{
                        // check if a user details object has been previously saved in app database
                        userDetailsDoc = await utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.get('userDetails');
                    }catch(error){}

                    if(!userDetailsDoc){ // no userDetails object has been previous saved
                        delete utopiasoftware[utopiasoftware_app_namespace].model.userDetails._rev; // delete the _rev property
                    }
                    else{ // user details object has been previously saved
                        // update the _rev property of the userDetails object being used by the app
                        utopiasoftware[utopiasoftware_app_namespace].model.userDetails._rev = userDetailsDoc._rev;
                    }

                    // saved the user details object in the app database
                    let databaseResponse = await utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.put(
                        utopiasoftware[utopiasoftware_app_namespace].model.userDetails);
                    // save the returned user details rev id
                    window.localStorage.setItem("utopiasoftware-edpms-app-status", databaseResponse.rev);
                }
                else{ // user does not want to remain signed in
                    // remove the user details rev id from storage
                    window.localStorage.removeItem("utopiasoftware-edpms-app-status");
                }

                // flag that the user just completed a sign in for this session
                window.sessionStorage.setItem("utopiasoftware-edpms-user-logged-in", "yes");

                // move user to the main menu page
                await Promise.all([$('ons-splitter').get(0).content.load("app-main-template"),
                    $('#loader-modal').get(0).hide()]);
            }
            catch(err){
                $('#loader-modal').get(0).hide();
                ons.notification.alert(err.message, {title: '<span style="color: red">Sign In Failed</span>',
                    buttonLabels: ['OK'], modifier: 'utopiasoftware-alert-dialog'});
            }
        }

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
        pageInit: function(event){

            var $thisPage = $(event.target); // get the current page shown
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();

            //function is used to initialise the page if the app is fully ready for execution
            async function loadPageOnAppReady(){
                // check to see if onsen is ready and if all app loading has been completed
                if(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false){
                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                    return;
                }

                // listen for the back button event
                /*$('#app-main-navigator').get(0).topPage.onDeviceBackButton =
                    utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.backButtonClicked;*/
                event.target.onDeviceBackButton =
                    utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.backButtonClicked;

                // initialise the login form validation
                utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.formValidator =
                    $('#search-project-form').parsley();

                // listen for log in form field validation failure event
                utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.formValidator.on('field:error', function(fieldInstance) {
                    // get the element that triggered the field validation error and use it to display tooltip
                    // display tooltip
                    $(fieldInstance.$element).addClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                    $(fieldInstance.$element).attr("data-hint", fieldInstance.getErrorsMessages()[0]);
                });

                // listen for log in form field validation success event
                utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.
                formValidator.on('field:success', function(fieldInstance) {
                    // remove tooltip from element
                    $(fieldInstance.$element).removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                    $(fieldInstance.$element).removeAttr("data-hint");
                });

                // listen for log in form validation success
                utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.formValidator.on('form:success',
                    utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.formValidated);

                try{

                    // keep device awake during the downloading process
                    window.plugins.insomnia.keepAwake();
                    // check if the user just completed a signin or log-in
                    if(window.sessionStorage.getItem("utopiasoftware-edpms-user-logged-in") === "yes" &&
                        window.sessionStorage.getItem("utopiasoftware-edpms-refresh-page") !== "yes") {
                        // beginning uploading app data
                        $('#determinate-progress-modal .modal-message').html('Downloading projects data for offline use...');
                        $('#determinate-progress-modal').get(0).show();
                        $('#determinate-progress-modal #determinate-progress').get(0).value = 30;

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
                            // delete the already saved projects in batches
                            await utopiasoftware[utopiasoftware_app_namespace].utilities.
                            updateBulkDocsInBatches(500, allProjects,
                                utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);
                        }

                        $('#determinate-progress-modal #determinate-progress').get(0).value = 45;

                        // store the all the project data received
                        await utopiasoftware[utopiasoftware_app_namespace].utilities.
                        updateBulkDocsInBatches(500, serverResponse,
                            utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);

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
                            await utopiasoftware[utopiasoftware_app_namespace].utilities.
                            updateBulkDocsInBatches(500, allProjects,
                                utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);
                        }

                        $('#determinate-progress-modal #determinate-progress').get(0).value = 80;

                        // store the all the milestone data received
                        await utopiasoftware[utopiasoftware_app_namespace].utilities.
                        updateBulkDocsInBatches(500, serverResponse,
                            utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);

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
                            await utopiasoftware[utopiasoftware_app_namespace].utilities.
                            updateBulkDocsInBatches(500, allProjects,
                                utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);
                        }

                        // format the retrieved evaluation report before storing in the app database
                        serverResponse = serverResponse.map((currentValue, index, array) => {
                            // format/convert the EVALUATIONS field to proper json
                            currentValue.EVALUATIONS = JSON.parse(currentValue.EVALUATIONS);
                            return currentValue;
                        });

                        $('#determinate-progress-modal #determinate-progress').get(0).value = 100;

                        // store the all the milestone data received
                        await utopiasoftware[utopiasoftware_app_namespace].utilities.
                        updateBulkDocsInBatches(500, serverResponse,
                            utopiasoftware[utopiasoftware_app_namespace].model.appDatabase);
                    }

                    // check if the user just completed a signin or log-in
                    if(window.sessionStorage.getItem("utopiasoftware-edpms-user-logged-in") !== "yes" &&
                        ! utopiasoftware[utopiasoftware_app_namespace].model.userDetails) { // user did NOT just log in / sign in
                        // get the userDetails data from the app database
                        utopiasoftware[utopiasoftware_app_namespace].model.userDetails =
                            (await utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.get("userDetails"));
                    }

                    // check if the user just completed a signin or log-in
                    if(window.sessionStorage.getItem("utopiasoftware-edpms-user-logged-in") === "yes" &&
                        window.sessionStorage.getItem("utopiasoftware-edpms-refresh-page") !== "yes") {
                        // hide the progress loader
                        await Promise.all([$('#determinate-progress-modal').get(0).hide()]);
                    }

                    // hide the loader modal
                    await Promise.all([$('#loader-modal').get(0).hide()]);

                    // this only displays when page is NOT marked as being loaded from a user refresh request
                    if(window.sessionStorage.getItem("utopiasoftware-edpms-refresh-page") !== "yes") {
                        // display a toast to the user
                        ons.notification.toast(`<ons-icon icon="md-check" size="20px" style="color: #00D5C3"></ons-icon> <span style="text-transform: capitalize; display: inline-block; margin-left: 1em">Welcome ${utopiasoftware[utopiasoftware_app_namespace].model.userDetails.userDetails.firstname}</span>`, {timeout: 3000});
                    }
                }
                catch(err){
                    console.log("LOAD ERROR", err);
                    // display error message indicating that projects data could not be loaded
                    $('#search-project-page .project-data-download-error').css("display", "block");
                    $('#determinate-progress-modal').get(0).hide();
                    $('#loader-modal').get(0).hide();
                }
                finally {
                    // clear the page refresh marker from device session storage
                    window.sessionStorage.removeItem("utopiasoftware-edpms-refresh-page");
                    window.plugins.insomnia.allowSleepAgain(); // the device can go to sleep now
                }
            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // adjust the window/view-port settings for when the soft keyboard is displayed
            window.SoftInputMode.set('adjustPan'); // let the window/view-port 'pan' when the soft keyboard is displayed
        },


        /**
         * method is triggered when page is hidden
         */
        pageHide: function(){
            // adjust the window/view-port settings for when the soft keyboard is displayed
            // window.SoftInputMode.set('adjustResize'); // let the view 'resize' when the soft keyboard is displayed
            try {
                // remove any tooltip being displayed on all forms on the page
                $('#search-project-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
                $('#search-project-page [data-hint]').removeAttr("data-hint");
                // reset the form validator object on the page
                utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.formValidator.reset();
            }
            catch(err){}
        },

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function(){
            // remove any tooltip being displayed on all forms on the page
            $('#search-project-page [data-hint]').removeClass("hint--always hint--success hint--medium hint--rounded hint--no-animate");
            $('#search-project-page [data-hint]').removeAttr("data-hint");
            // reset the form validator object on the page
            utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.formValidator.destroy();
            // destroy the currently selected project object
            utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.
                currentlySelectedProject = null;
        },


        /**
         * method is triggered when the "Project Search" button is clicked
         *
         * @returns {Promise<void>}
         */
        async searchButtonClicked(keyEvent){

            // check which key was pressed
            if(keyEvent.which === kendo.keys.ENTER) // if the enter key was pressed
            {
                // run the validation method for the project search form
                utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.formValidator.whenValidate();
                keyEvent.preventDefault();
                keyEvent.stopImmediatePropagation();
                keyEvent.stopPropagation();
            }
        },

        /**
         * method is triggered when the download of projects data fails and
         * the user hits the "Please Retry" button
         *
         * @returns {Promise<void>}
         */
        async retryProjectDataDownloadButtonClicked(){

            // hide the page preloader
            $('#search-project-page .page-preloader').css("display", "none");
            // hide the previous project details being displayed
            $('#search-project-page #search-project-details').css("display", "none");
            // hide all previous error messages (if any)
            $('#search-project-page .no-project-found').css("display", "none");
            $('#search-project-page .project-data-download-error').css("display", "none");
            // hide the device keyboard
            Keyboard.hide();

            try {
                // call the method used to load app project data into the persistent database
                await utopiasoftware[utopiasoftware_app_namespace].appCachedData.loadProjectData(true);
                // error the project data download error message
                $('#search-project-page .project-data-download-error').css("display", "none");
            }
            catch(err){
                // display the project data download error message
                $('#search-project-page .project-data-download-error').css("display", "block");
            }
        },


        /**
         * method is triggered when the project search search/find form is successfully validated
         * @returns {Promise<void>}
         */
        async formValidated(){
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

            try{

                // search the app database for the project id provided
                let dbQueryResult = await utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.find({
                    selector: {
                        "PROJECTID": {
                            "$eq": $('#search-project-page #search-project-search-input').get(0).value.trim().toLocaleUpperCase()
                        },
                        "TYPE": {
                          "$eq": "projects"
                        }},
                    fields: ["_id", "_rev", "PROJECTID", "TITLE", "CONTRACTSUM", "CONTRACTOR", "CONTRACTORID", "MDAID", "TYPE"],
                    use_index: ["ptracker-index-designdoc", "FIND_PROJECT_BY_ID_INDEX"]
                });

                // check that the requested project was found
                if(dbQueryResult.docs.length == 0){ // search project was NOT FOUND
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
                    return; // exit the method here
                }

                // if the method gets to this point, it means a project was found
                // assign the searched project object as the currently searched and chosen project object
                utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.
                    currentlySelectedProject = dbQueryResult.docs[0];
                // create the searched project details to be displayed
                let searchedProjectDetails = `<div class="col-xs-6" style="font-weight: bold; color: #000000; padding: 1rem;">Project ID</div>`;
                searchedProjectDetails += `<div class="col-xs-6" style="color: #000000; text-transform: uppercase; padding: 1rem;">${dbQueryResult.docs[0].PROJECTID}</div>`;
                searchedProjectDetails += `<div class="col-xs-6" style="font-weight: bold; color: #000000; padding: 1rem;">Title</div>`;
                searchedProjectDetails += `<div class="col-xs-6" style="color: #000000; text-transform: capitalize; padding: 1rem;">${dbQueryResult.docs[0].TITLE}</div>`;
                searchedProjectDetails += `<div class="col-xs-6" style="font-weight: bold; color: #000000; padding: 1rem;">Contractor</div>`;
                searchedProjectDetails += `<div class="col-xs-6" style="color: #000000; text-transform: capitalize; padding: 1rem;">${dbQueryResult.docs[0].CONTRACTOR}</div>`;
                searchedProjectDetails += `<div class="col-xs-6" style="font-weight: bold; color: #000000; padding: 1rem;">Contract Sum</div>`;
                searchedProjectDetails += `<div class="col-xs-6" style="color: #000000; text-transform: capitalize; padding: 1rem;">${kendo.toString(kendo.parseFloat(dbQueryResult.docs[0].CONTRACTSUM), "n2")}</div>`;

                // attach the generated project details to the page
                $('#search-project-page #search-project-details').html(searchedProjectDetails);

                // hide the page preloader
                $('#search-project-page .page-preloader').css("display", "none");

                // perform actions to reveal result
                kendo.fx($('#search-project-page #search-project-details')).fade("in").duration(550).play();
                await Promise.
                resolve(kendo.fx($('#search-project-page ons-bottom-toolbar')).slideIn("up").duration(600).play());
                $('#search-project-page ons-bottom-toolbar').css("display", "block");
            }
            catch(err){
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
            }
        },


        /**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */
        backButtonClicked(){

            // check if the side menu is open
            if($('ons-splitter').get(0).right.isOpen){ // side menu open, so close it
                $('ons-splitter').get(0).right.close();
                return; // exit the method
            }

            ons.notification.confirm('Do you want to close the app?', {title: 'Exit App',
                buttonLabels: ['No', 'Yes'], modifier: 'utopiasoftware-alert-dialog'}) // Ask for confirmation
                .then(function(index) {
                    if (index === 1) { // OK button
                        navigator.app.exitApp(); // Close the app
                    }
                });
        },


        /**
         * method is triggered when the 'Proceed' button is clicked
         */
        proceedButtonClicked(){

            // move to the project evaluation page. Also pass along the currently chosen project object
            $('#app-main-navigator').get(0).pushPage("project-evaluation-page.html", {animation: "lift-md",
            data: {projectData: utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.
                    currentlySelectedProject}});
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
        pageInit: function(event){

            var $thisPage = $(event.target); // get the current page shown
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();

            //function is used to initialise the page if the app is fully ready for execution
            async function loadPageOnAppReady(){
                // check to see if onsen is ready and if all app loading has been completed
                if(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false
                || !ej || !Viewer){
                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                    return;
                }

                ej.base.enableRipple(true);

                // listen for the back button event
                $('#app-main-navigator').get(0).topPage.onDeviceBackButton =
                    utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.backButtonClicked;

                // show the page preloader
                $('#project-evaluation-page .page-preloader').css("display", "block");
                // hide the items that are not to be displayed
                $('#project-evaluation-page .project-evaluation-instructions, ' +
                    '#project-evaluation-page .no-milestone-found').css("display", "none");

                // pick the project data object for which milestones are to be evaluated
                let projectData = $('#app-main-navigator').get(0).topPage.data.projectData;

                try{
                    // search the app database for milestones using the project id provided
                    let dbQueryResult = await utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.find({
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

                    // check if any milestones were returned
                    if(dbQueryResult.docs.length == 0) { // no milestones were found for the project
                        throw "error"; // throw an error
                    }

                    // if the code gets to this point, milestones were returned
                    // sort the returned milestones array
                    dbQueryResult.docs.sort(function(firstElem, secondElement){
                        return (window.parseInt(firstElem.BOQID) - window.parseInt(secondElement.BOQID));
                    });

                    utopiasoftware[utopiasoftware_app_namespace].controller.
                        projectEvaluationPageViewModel.projectMilestones = dbQueryResult.docs; // update the current project milestones

                    // get all the previously approved and cached project evaluations belonging to the provided project id
                    let projectEvaluationsQueryResult = await utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.find({
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

                    // create the evaluation carousel item based on the milestones retrieved
                    let carouselContent = "";
                    for(let index = 0; index < dbQueryResult.docs.length; index++)
                    {
                        carouselContent = `
                        <ons-carousel-item style="overflow-y: auto">
                            <ons-card>
                                <div style="font-size: 1.2em">
                                    ${dbQueryResult.docs[index].CATEGORY}
                                </div>
                                <div class="project-evaluation-slider"></div>
                                <div class="project-evaluation-milestone-amount" style="margin-top: 1em; font-size: 1em;">
                                    <span style="display: inline-block; font-style: italic; margin-right: 1em;">Milestone Value </span> 
                                    ${kendo.toString(kendo.parseFloat(dbQueryResult.docs[index].AMOUNT), "n2")}
                                </div>
                                <div class="project-evaluation-milestone-current-value" style="font-size: 1em;">
                                    <span style="display: inline-block; font-style: italic; margin-right: 1em;">Value Completed </span> 
                                    ${kendo.toString(kendo.parseFloat(0), "n2")}
                                </div>
                            </ons-card>
                        </ons-carousel-item>`;
                        $('#project-evaluation-page #project-evaluation-carousel').append(carouselContent);
                    } // end of for loop

                    // append the carousel content used for displaying evaluation pictures
                    carouselContent = `
                    <ons-carousel-item style="overflow-y: scroll">
                        <div class="row project-evaluation-images-container" style="margin-top: 1.5em;">
                            <div class="col-xs-6" style="padding: 0.5em; position: relative">
                                <div style="position: absolute; top: 5px;">
                                    <ons-speed-dial id="project-evaluation-picture-speed-dial-1" direction="down">
                                        <ons-fab modifier="utopiasoftware-pic-capture-speed-dial"
                                                 class="utopiasoftware-pic-capture-speed-dial" 
                                                 onclick="utopiasoftware[utopiasoftware_app_namespace].controller.
                                                 projectEvaluationPageViewModel.pictureSpeedDialClicked(1)">
                                            <ons-icon icon="md-image-o"></ons-icon>
                                        </ons-fab>
                                        <ons-speed-dial-item modifier="utopiasoftware-pic-capture-speed-dial-item"
                                                             class="utopiasoftware-pic-capture-speed-dial" 
                                                             onclick="utopiasoftware[utopiasoftware_app_namespace].controller.
                                                 projectEvaluationPageViewModel.pictureCaptureButtonClicked(1)">
                                            <ons-icon icon="md-camera"></ons-icon>
                                        </ons-speed-dial-item>
                                        <ons-speed-dial-item modifier="utopiasoftware-pic-capture-speed-dial-item"
                                                             class="utopiasoftware-pic-capture-speed-dial" 
                                                             onclick="utopiasoftware[utopiasoftware_app_namespace].controller.
                                                 projectEvaluationPageViewModel.deletePictureButtonClicked(1)">
                                            <ons-icon icon="md-delete"></ons-icon>
                                        </ons-speed-dial-item>
                                    </ons-speed-dial>
                                </div>
                                <img id="project-evaluation-picture-1" src="css/app-images/project-evaluation-photo-placeholder.png" style="width: 100%; border: 2px darkgray groove" alt="Picture 1">
                            </div>
                            <div class="col-xs-6" style="padding: 0.5em; position: relative">
                                <div style="position: absolute; top: 5px;">
                                    <ons-speed-dial id="project-evaluation-picture-speed-dial-2" direction="down">
                                        <ons-fab modifier="utopiasoftware-pic-capture-speed-dial"
                                                 class="utopiasoftware-pic-capture-speed-dial" 
                                                 onclick="utopiasoftware[utopiasoftware_app_namespace].controller.
                                                 projectEvaluationPageViewModel.pictureSpeedDialClicked(2)">
                                            <ons-icon icon="md-image-o"></ons-icon>
                                        </ons-fab>
                                        <ons-speed-dial-item modifier="utopiasoftware-pic-capture-speed-dial-item"
                                                             class="utopiasoftware-pic-capture-speed-dial" 
                                                             onclick="utopiasoftware[utopiasoftware_app_namespace].controller.
                                                 projectEvaluationPageViewModel.pictureCaptureButtonClicked(2)">
                                            <ons-icon icon="md-camera"></ons-icon>
                                        </ons-speed-dial-item>
                                        <ons-speed-dial-item modifier="utopiasoftware-pic-capture-speed-dial-item"
                                                             class="utopiasoftware-pic-capture-speed-dial" 
                                                             onclick="utopiasoftware[utopiasoftware_app_namespace].controller.
                                                 projectEvaluationPageViewModel.deletePictureButtonClicked(2)">
                                            <ons-icon icon="md-delete"></ons-icon>
                                        </ons-speed-dial-item>
                                    </ons-speed-dial>
                                </div>
                                <img id="project-evaluation-picture-2" src="css/app-images/project-evaluation-photo-placeholder.png" style="width: 100%; border: 2px darkgray groove" alt="Picture 2">
                            </div>
                            <div class="col-xs-offset-3 col-xs-6" style="padding: 0.5em; position: relative">
                                <div style="position: absolute; top: 5px;">
                                    <ons-speed-dial id="project-evaluation-picture-speed-dial-3" direction="down">
                                        <ons-fab modifier="utopiasoftware-pic-capture-speed-dial"
                                                 class="utopiasoftware-pic-capture-speed-dial" 
                                                 onclick="utopiasoftware[utopiasoftware_app_namespace].controller.
                                                 projectEvaluationPageViewModel.pictureSpeedDialClicked(3)">
                                            <ons-icon icon="md-image-o"></ons-icon>
                                        </ons-fab>
                                        <ons-speed-dial-item modifier="utopiasoftware-pic-capture-speed-dial-item"
                                                             class="utopiasoftware-pic-capture-speed-dial" 
                                                             onclick="utopiasoftware[utopiasoftware_app_namespace].controller.
                                                 projectEvaluationPageViewModel.pictureCaptureButtonClicked(3)">
                                            <ons-icon icon="md-camera"></ons-icon>
                                        </ons-speed-dial-item>
                                        <ons-speed-dial-item modifier="utopiasoftware-pic-capture-speed-dial-item"
                                                             class="utopiasoftware-pic-capture-speed-dial" 
                                                             onclick="utopiasoftware[utopiasoftware_app_namespace].controller.
                                                 projectEvaluationPageViewModel.deletePictureButtonClicked(3)">
                                            <ons-icon icon="md-delete"></ons-icon>
                                        </ons-speed-dial-item>
                                    </ons-speed-dial>
                                </div>
                                <img id="project-evaluation-picture-3" src="css/app-images/project-evaluation-photo-placeholder.png" style="width: 100%; border: 2px darkgray groove" alt="Picture 3">
                            </div>
                        </div>
                    </ons-carousel-item>`;
                    // append the generated carousel content to the project evaluation carousel
                    $('#project-evaluation-page #project-evaluation-carousel').append(carouselContent);

                    // append the carousel content used for displaying project location on a map
                    carouselContent = `
                    <ons-carousel-item style="position: relative;">
                        <div id="project-evaluation-map" style="position: absolute; top: 0; left: 0; width: 100%; 
                            height: 100%; bottom: 0; border: 1px #00d5c3 solid; text-align: center;">
                            <ons-button style="background-color: #3f51b5; position: relative; top: 3px;
                            display: inline-block;"
                            onclick="utopiasoftware[utopiasoftware_app_namespace].
                            controller.projectEvaluationPageViewModel.getProjectGeoLocationButtonClicked()">Get Project Location</ons-button>
                            <div id="project-evaluation-gps-progress" 
                            style="position: relative; display: none; top: 65px; text-align: center">
                                <ons-progress-circular indeterminate modifier="project-gps-location-progress"></ons-progress-circular>
                            </div>
                            <div id="project-evaluation-gps-location-tag" style="color: #ffffff; 
                            font-weight: bold; font-size: 0.8em; text-transform: uppercase; 
                            background-color: rgba(0,213,195,0.80); padding: 0.6em; border-radius: 10px; 
                            width: 80%; position: absolute; bottom: 2px; display: inline-block; 
                            left: 10%; 
                            overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Location:</div>
                        </div>
                    </ons-carousel-item>`;
                    // append the generated carousel content to the project evaluation carousel
                    $('#project-evaluation-page #project-evaluation-carousel').append(carouselContent);

                    // append the carousel content used for displaying project remarks textarea
                    carouselContent = `
                    <ons-carousel-item style="overflow-y: auto">
                        <textarea id="project-evaluation-remarks" spellcheck="true" 
                        style="width: 80%; height: 4em; margin-left: 10%;
                        margin-right: 10%; border: none; border-bottom: 2px #00D5C3 solid; 
                        border-left: 2px #00D5C3 solid; border-right: 2px #00D5C3 solid; 
                        background-color: transparent;"></textarea>
                    </ons-carousel-item>`;
                    // append the generated carousel content to the project evaluation carousel
                    $('#project-evaluation-page #project-evaluation-carousel').append(carouselContent);

                    // create the project evaluation slider elements
                    $('#project-evaluation-page .project-evaluation-slider').
                    each(function(index, element){

                        element._ptracker_index = index; //  store the index position of the element within the collection on the element itself
                        let previousSliderValue = null; // holds the slider value gotten from previously saved evaluations

                        if(! projectEvaluationsQueryResult.docs[0]){
                            previousSliderValue = null; // if there are no saved approved project evaluations, then set value to null
                        }
                        else{ // there are saved/cached approved project evaluations
                            // get the saved and approved milestone score from the approved project evaluations
                            previousSliderValue = projectEvaluationsQueryResult.docs[0].EVALUATIONS.
                            find(function(currentValue, index2){
                                // check if any of the approved evaluation reports are for any of the milestones to be currently viewed
                                if(window.parseInt(currentValue.milestoneId) ===
                                    window.parseInt(dbQueryResult.docs[element._ptracker_index].BOQID)){
                                    return true; // this approved evaluation reports are for the currently viewed milestone
                                }
                            });
                        }

                        if(previousSliderValue){ // if previously slider value is an object, get the previous evaluation score
                            previousSliderValue = window.parseInt(previousSliderValue.milestoneScore); // update to the previous score
                        }
                        // create each milestone evaluation slider
                        let aSlider = new ej.inputs.Slider({
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
                            created: function(){
                                // write the value on the slider handle element
                                $('.e-handle', element).text(this.value);
                                // update the milestone current value
                                $('.project-evaluation-milestone-current-value', $(element).closest('ons-card'))
                                    .html(`<span style="display: inline-block; font-style: italic; margin-right: 1em;">Value Completed </span> 
                                    ${kendo.toString(kendo.parseFloat((this.value / 100) * kendo.parseFloat(dbQueryResult.docs[element._ptracker_index].AMOUNT)), "n2")}`);
                            },
                            change: function(changeEvent){
                                $('.e-handle', element).text(changeEvent.value);
                                // update the project evaluation started flag to indicate evaluation has started
                                utopiasoftware[utopiasoftware_app_namespace].controller.
                                    projectEvaluationPageViewModel.hasProjectEvaluationStarted = true;
                            },
                            changed: function(changedEvent){
                                // update the milestone current value based on changes in the slider
                                $('.project-evaluation-milestone-current-value', $(element).closest('ons-card'))
                                    .html(`<span style="display: inline-block; font-style: italic; margin-right: 1em;">Value Completed </span> 
                                    ${kendo.toString(kendo.parseFloat((changedEvent.value / 100) * kendo.parseFloat(dbQueryResult.docs[element._ptracker_index].AMOUNT)), "n2")}`);
                            }
                        });
                        aSlider.appendTo(element);
                        element._ptracker_slider = aSlider;
                    });

                    // create the Viewer widget used to view the project evaluation photos
                    utopiasoftware[utopiasoftware_app_namespace].controller.
                        projectEvaluationPageViewModel.pictureViewer =
                        new Viewer($('#project-evaluation-page .project-evaluation-images-container').get(0),
                            {inline: false,
                                toolbar: {
                                    prev: {
                                        show: true,
                                        size: 'large',
                                    },
                                    next: {
                                        show: true,
                                        size: 'large',
                                    },
                                    zoomIn: {
                                        show: true,
                                        size: 'large',
                                    },
                                    zoomOut: {
                                        show: true,
                                        size: 'large',
                                    },
                                    oneToOne: {
                                        show: true,
                                        size: 'large',
                                    },
                                    reset: {
                                        show: true,
                                        size: 'large',
                                    },
                                    play: {
                                        show: false,
                                        size: 'large',
                                    },
                                    rotateLeft: {
                                        show: false,
                                        size: 'large',
                                    },
                                    rotateRight: {
                                        show: false,
                                        size: 'large',
                                    },
                                    flipHorizontal: {
                                        show: false,
                                        size: 'large',
                                    },
                                    flipVertical: {
                                        show: false,
                                        size: 'large',
                                    }
                                },
                                backdrop: 'static',
                                shown: function(){ // event is triggered when Picture Viewer is shown
                                    // indicate that the picture viewer widget is showing
                                    utopiasoftware[utopiasoftware_app_namespace].controller.
                                        projectEvaluationPageViewModel.isPictureViewerShowing = true;
                                },
                                hidden: function(){ // event is triggered when Picture Viewer is hidden
                                    // indicate that the picture viewer widget is hidden
                                    utopiasoftware[utopiasoftware_app_namespace].controller.
                                        projectEvaluationPageViewModel.isPictureViewerShowing = false;
                                }});

                    // hide the page preloader
                    $('#project-evaluation-page .page-preloader').css("display", "none");
                    // show the items that are to be displayed
                    $('#project-evaluation-page .project-evaluation-instructions, #project-evaluation-page .content').
                    css("display", "block");
                    $('#project-evaluation-page #project-evaluation-next-button').
                    css("display", "inline-block");
                }
                catch (e) {
                    // hide the page preloader
                    $('#project-evaluation-page .page-preloader').css("display", "none");
                    // hide the items that are not to be displayed
                    $('#project-evaluation-page .project-evaluation-instructions, #project-evaluation-page .content').
                    css("display", "none");
                    $('#project-evaluation-page #project-evaluation-prev-button, #project-evaluation-page #project-evaluation-next-button').
                    css("display", "none");
                    // display the message to inform user that there are no milestones available for the project
                    $('#project-evaluation-page .no-milestone-found').css("display", "block");
                }
                finally{
                    // hide the loader
                    $('#loader-modal').get(0).hide();
                }
            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // adjust the window/view-port settings for when the soft keyboard is displayed
            window.SoftInputMode.set('adjustPan'); // let the window/view-port 'pan' when the soft keyboard is displayed
        },


        /**
         * method is triggered when page is hidden
         */
        pageHide: function(){
            // adjust the window/view-port settings for when the soft keyboard is displayed
            // window.SoftInputMode.set('adjustResize'); // let the view 'resize' when the soft keyboard is displayed

            // REMOVE the app background transparency, map np longer showing
            $('html, body').removeClass('utopiasoftware-transparent');

            // check if Map already exists and is ready to be used
            if(utopiasoftware[utopiasoftware_app_namespace].controller.
                    projectEvaluationPageViewModel.projectEvaluationMap &&
                utopiasoftware[utopiasoftware_app_namespace].controller.
                    projectEvaluationPageViewModel.projectEvaluationMap._ptracker_isMapReady === true){
            // hide the map object
            utopiasoftware[utopiasoftware_app_namespace].controller.
                projectEvaluationPageViewModel.projectEvaluationMap.setVisible(false);
            }
        },

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function(){
            // destroy the pictures Viewer widget instance
            if(utopiasoftware[utopiasoftware_app_namespace].controller.
                projectEvaluationPageViewModel.pictureViewer){
            utopiasoftware[utopiasoftware_app_namespace].controller.
                projectEvaluationPageViewModel.pictureViewer.destroy();
            }
            // reset other object properties
            utopiasoftware[utopiasoftware_app_namespace].controller.
                projectEvaluationPageViewModel.projectMilestones = null;
            utopiasoftware[utopiasoftware_app_namespace].controller.
                projectEvaluationPageViewModel.projectPicturesUrls = [null];
            utopiasoftware[utopiasoftware_app_namespace].controller.
                projectEvaluationPageViewModel.hasProjectEvaluationStarted = false;

            // check if Map already exists and is ready to be used
            if(utopiasoftware[utopiasoftware_app_namespace].controller.
                    projectEvaluationPageViewModel.projectEvaluationMap &&
                utopiasoftware[utopiasoftware_app_namespace].controller.
                    projectEvaluationPageViewModel.projectEvaluationMap._ptracker_isMapReady === true){
            utopiasoftware[utopiasoftware_app_namespace].controller.
                projectEvaluationPageViewModel.projectEvaluationMap.remove();
            }

            utopiasoftware[utopiasoftware_app_namespace].controller.
                projectEvaluationPageViewModel.projectEvaluationMap = null;
            utopiasoftware[utopiasoftware_app_namespace].controller.
                projectEvaluationPageViewModel.projectGeoPosition = null;

            // destroy slider widgets created
            $('#project-evaluation-page .project-evaluation-slider').
            each(function(index, element){
                // destroy the slider widget attached to this element
                element._ptracker_slider.destroy();
                element._ptracker_slider = null;
            });
        },


        /**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */
        async backButtonClicked(){

            // check if the side menu is open
            if($('ons-splitter').get(0).right.isOpen){ // side menu open, so close it
                $('ons-splitter').get(0).right.close();
                return; // exit the method
            }

            // check if the Picture Viewer widget is showing
            if(utopiasoftware[utopiasoftware_app_namespace].controller.
                projectEvaluationPageViewModel.isPictureViewerShowing === true){ // Picture Viewer is showing
                // hide it
                utopiasoftware[utopiasoftware_app_namespace].controller.
                    projectEvaluationPageViewModel.pictureViewer.hide();
                return; // exit
            }

            // check if project evaluation has already started
           if(// update the project evaluation started flag to indicate evaluation has started
               utopiasoftware[utopiasoftware_app_namespace].controller.
                   projectEvaluationPageViewModel.hasProjectEvaluationStarted === true){ // evaluation has started

               // inform user that leaving this page will mean that current evaluation data is lost. does user want to leave?
               let leaveProjectEvaluation = await ons.notification.confirm('',
                   {title: '<ons-icon icon="md-alert-triangle" style="color: #3f51b5" size="33px"></ons-icon> <span style="color: #3f51b5; display: inline-block; margin-left: 1em;">Warning</span>',
                       messageHTML: `You have NOT completed the evaluation. If you leave now, all evaluation data will be cancelled.<br><br> Do you want to leave the project evaluation?`,
                       buttonLabels: ['No', 'Yes'], modifier: 'utopiasoftware-alert-dialog'});

               if(leaveProjectEvaluation == 0){ // user does not want to project evaluation, so exit method now
                   return; // exit method
               }
           }

            // move to the project evaluation page
            $('#app-main-navigator').get(0).popPage();
        },

        /**
         * method is used to control the behaviour of the picture speed dials
         *
         * @param pictureNumber {Integer} holds the number/position of the picture.
         * The position of pictures starts from 1 (i.e. 1-based counting)
         */
        pictureSpeedDialClicked(pictureNumber){

            // handler conditions for each picture speed-dial
            switch(pictureNumber){ // determine what to do based on the picture number value

                case 1:
                    // check if the speed-dial widget that was clicked is currently opened
                    if(!$('#project-evaluation-page #project-evaluation-picture-speed-dial-1').get(0).isOpen()){ // speed-dial is open
                        // close all other picture speed-dials
                        $('#project-evaluation-page #project-evaluation-picture-speed-dial-2').get(0).hideItems();
                        $('#project-evaluation-page #project-evaluation-picture-speed-dial-3').get(0).hideItems();
                    }
                    break;

                case 2:
                    if(!$('#project-evaluation-page #project-evaluation-picture-speed-dial-2').get(0).isOpen()){ // speed-dial is open
                        // close all other picture speed-dials
                        $('#project-evaluation-page #project-evaluation-picture-speed-dial-1').get(0).hideItems();
                        $('#project-evaluation-page #project-evaluation-picture-speed-dial-3').get(0).hideItems();
                    }
                    break;

                case 3:
                    if(!$('#project-evaluation-page #project-evaluation-picture-speed-dial-3').get(0).isOpen()){ // speed-dial is open
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
        async pictureCaptureButtonClicked(pictureNumber){

            var permissionStatuses = null; // holds the statuses of the runtime permissions requested

            try{
                // request runtime permissions to use device's camera
                permissionStatuses =  await new Promise(function(resolve, reject){
                    cordova.plugins.diagnostic.requestRuntimePermissions(resolve, reject,[
                        cordova.plugins.diagnostic.permission.CAMERA
                    ]);
                });

                // check if the user has given permission to use the device's camera
                if((!permissionStatuses) ||
                    permissionStatuses[cordova.plugins.diagnostic.permission.CAMERA] !==
                    cordova.plugins.diagnostic.permissionStatus.GRANTED){
                    throw "error - no runtime permissions";
                }

                // disable screen orientation lock
                screen.orientation.unlock();

                // open the device camera app and capture a photo
                let imageUrl = await new Promise(function(resolve, reject){
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

                // check what picture number the camera was used for and then display it
                switch(pictureNumber){
                    case 1:
                        // store the image url in the correct picturesUrls array index
                        utopiasoftware[utopiasoftware_app_namespace].controller.
                            projectEvaluationPageViewModel.projectPicturesUrls[pictureNumber] = imageUrl;
                        // update the image src for the correct project picture, so that picture can be displayed
                        $('#project-evaluation-page #project-evaluation-picture-1').attr("src", imageUrl);
                        break;

                    case 2:
                        // store the image url in the correct picturesUrls array index
                        utopiasoftware[utopiasoftware_app_namespace].controller.
                            projectEvaluationPageViewModel.projectPicturesUrls[pictureNumber] = imageUrl;
                        // update the image src for the correct project picture, so that picture can be displayed
                        $('#project-evaluation-page #project-evaluation-picture-2').attr("src", imageUrl);
                        break;

                    case 3:
                        // store the image url in the correct picturesUrls array index
                        utopiasoftware[utopiasoftware_app_namespace].controller.
                            projectEvaluationPageViewModel.projectPicturesUrls[pictureNumber] = imageUrl;
                        // update the image src for the correct project picture, so that picture can be displayed
                        $('#project-evaluation-page #project-evaluation-picture-3').attr("src", imageUrl);
                        break;
                }

                // update the project evaluation started flag to indicate evaluation has started
                utopiasoftware[utopiasoftware_app_namespace].controller.
                    projectEvaluationPageViewModel.hasProjectEvaluationStarted = true;

                // update the picture viewer widget
                utopiasoftware[utopiasoftware_app_namespace].controller.
                    projectEvaluationPageViewModel.pictureViewer.update();
            }
            catch(err){
                // inform the user of the error
                window.plugins.toast.showWithOptions({
                    message: "Photo Capture Failed - " + err,
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
            }
            finally {
                // lock the device orientation back to 'portrait'
                screen.orientation.lock('portrait');
            }
        },

        /**
         * method is used to delete/remove project evaluation photos from the collection and display
         *
         * @param pictureNumber {Integer} holds the number/position of the picture.
         * The position of pictures starts from 1 (i.e. 1-based counting)
         */
        async deletePictureButtonClicked(pictureNumber){

            // check if the selected photo has been changed from the default (no photo)
            if(! utopiasoftware[utopiasoftware_app_namespace].controller.
                projectEvaluationPageViewModel.projectPicturesUrls[pictureNumber]){ // the photo is in the default
                // since the photo is in the default, there is no need to delete photo. so exit
                return; // exit
            }

            // ask user to confirm photo delete
            let deletePhoto = await ons.notification.confirm('Do you want to delete the photo?',
                {title: '<ons-icon icon="md-delete" style="color: #3f51b5" size="33px"></ons-icon> <span style="color: #3f51b5; display: inline-block; margin-left: 1em;">Delete Photo</span>',
                buttonLabels: ['No', 'Yes'], modifier: 'utopiasoftware-alert-dialog'});

            if(deletePhoto == 0){ // user does not want to delete photo, so exit method now
                return; // exit method
            }

            // remove the image url in the correct picturesUrls array index
            utopiasoftware[utopiasoftware_app_namespace].controller.
                projectEvaluationPageViewModel.projectPicturesUrls[pictureNumber] = null;
            // update the image src to the "no photo" display
            $('#project-evaluation-page #project-evaluation-picture-' + pictureNumber).
            attr("src", "css/app-images/project-evaluation-photo-placeholder.png");

            // update the picture viewer widget
            utopiasoftware[utopiasoftware_app_namespace].controller.
            projectEvaluationPageViewModel.pictureViewer.update();
        },

        /**
         * method is used to retrieve the project location by using the current GPS location of the device
         *
         * @returns {Promise<void>}
         */
        async getProjectGeoLocationButtonClicked(){

            var permissionStatuses = null; // holds the statuses of the runtime permissions requested

            try{
                // request runtime permissions to use device's GPS
                permissionStatuses =  await new Promise(function(resolve, reject){
                    cordova.plugins.diagnostic.requestRuntimePermissions(resolve, reject,[
                        cordova.plugins.diagnostic.permission.ACCESS_FINE_LOCATION
                    ]);
                });

                // check if the user has given permission to use the device's GPS
                if((!permissionStatuses) ||
                    permissionStatuses[cordova.plugins.diagnostic.permission.ACCESS_FINE_LOCATION] !==
                    cordova.plugins.diagnostic.permissionStatus.GRANTED){
                    throw "error - no location permission";
                }

                // check if the device GPS is enabled
                let isGPSEnabled = await new Promise(function(resolve, reject){
                    cordova.plugins.diagnostic.isGpsLocationEnabled(resolve, reject);
                });

                if(isGPSEnabled === false){ // GPS NOT ENABLED
                    // inform user to enable location on device
                    await ons.notification.alert('',
                        {title: '<ons-icon icon="md-pin" style="color: #3f51b5" size="33px"></ons-icon> <span style="color: #3f51b5; display: inline-block; margin-left: 1em;">Location Service</span>',
                            messageHTML: `You need to enable you device location service to capture the project location. <br>Switch to Location Settings or enable the location service directly?`,
                            buttonLabels: ['Proceed'], modifier: 'utopiasoftware-alert-dialog'});

                    // turn on the user's location services automatically
                    isGPSEnabled = await new Promise(function(resolve, reject){
                        cordova.plugins.locationAccuracy.request(function(){resolve(true)}, function(){resolve(false)},
                            cordova.plugins.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
                    });
                    if(isGPSEnabled === false){ // GPS IS STILL NOT ENABLED
                        // switch to the Location Settings screen, so user can manually enable Location Services
                        cordova.plugins.diagnostic.switchToLocationSettings();

                        return; // exit method
                    }
                }

                // if method get here, GPS has been successfully enabled and app has authorisation to use it
                // show the circular progress to indicate app has started working on getting user gps
                $('#project-evaluation-page #project-evaluation-gps-progress').css("display", "block");
                // get project's current location using device's gps geolocation
                let geoPosition = await new Promise(function(resolve, reject){
                    navigator.geolocation.getCurrentPosition(resolve,
                        reject,
                        {enableHighAccuracy: true, timeout: 300000, maximumAge: 5000});
                });
                utopiasoftware[utopiasoftware_app_namespace].controller.
                    projectEvaluationPageViewModel.projectGeoPosition = geoPosition; // assign the retrieved geo position object to its appropriate object property

                // flag that progress evaluation has started
                utopiasoftware[utopiasoftware_app_namespace].controller.
                    projectEvaluationPageViewModel.hasProjectEvaluationStarted = true;

                // make the app background transparent, so the map can show
                $('html, body').addClass('utopiasoftware-transparent');

                // update the location tag info displayed at the bottom of screen
                $('#project-evaluation-page #project-evaluation-gps-location-tag').
                    html(`Location: ${geoPosition.coords.latitude},${geoPosition.coords.longitude}`);

                // check if Map already exists and is ready to be used
                if(utopiasoftware[utopiasoftware_app_namespace].controller.
                    projectEvaluationPageViewModel.projectEvaluationMap &&
                    utopiasoftware[utopiasoftware_app_namespace].controller.
                        projectEvaluationPageViewModel.projectEvaluationMap._ptracker_isMapReady === true){

                    // map has previously been created and is ready for use
                    utopiasoftware[utopiasoftware_app_namespace].controller.
                        projectEvaluationPageViewModel.projectEvaluationMap.setVisible(true); // make map visible

                    // hide circular progress display
                    $('#project-evaluation-page #project-evaluation-gps-progress').css("display", "none");

                    // animate the map camera
                    await new Promise(function(resolve, reject){
                        utopiasoftware[utopiasoftware_app_namespace].controller.
                        projectEvaluationPageViewModel.projectEvaluationMap.animateCamera({
                            target: {lat: geoPosition.coords.latitude,
                                lng: geoPosition.coords.longitude}
                        }, function(){resolve();});
                    });

                    // clear all previous content displayed on the map
                    await new Promise(function(resolve, reject){
                        utopiasoftware[utopiasoftware_app_namespace].controller.
                            projectEvaluationPageViewModel.projectEvaluationMap.clear(function(){resolve()});
                    });

                    let projectMarker = utopiasoftware[utopiasoftware_app_namespace].controller.
                    projectEvaluationPageViewModel.projectEvaluationMap.addMarker({
                        position: {
                            "lat": utopiasoftware[utopiasoftware_app_namespace].controller.
                                projectEvaluationPageViewModel.projectGeoPosition.coords.latitude,
                            "lng": utopiasoftware[utopiasoftware_app_namespace].controller.
                                projectEvaluationPageViewModel.projectGeoPosition.coords.longitude
                        },
                        icon: '#00D5C3',
                        'title': $('#app-main-navigator').get(0).topPage.data.projectData.TITLE.toLocaleUpperCase(),
                        animation: plugin.google.maps.Animation.BOUNCE
                    });
                    // display marker info window
                    projectMarker.showInfoWindow();

                    return; // exit method
                }

                // generate the geo map for the project evaluation
                utopiasoftware[utopiasoftware_app_namespace].controller.
                    projectEvaluationPageViewModel.projectEvaluationMap =
                    plugin.google.maps.Map.getMap($('#project-evaluation-page #project-evaluation-map').get(0), {
                    'mapType': plugin.google.maps.MapTypeId.ROADMAP,
                    'camera' : {
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
                utopiasoftware[utopiasoftware_app_namespace].controller.
                projectEvaluationPageViewModel.projectEvaluationMap.one(plugin.google.maps.event.MAP_READY, function() {
                    // hide circular progress display
                    $('#project-evaluation-page #project-evaluation-gps-progress').css("display", "none");
                    // flag an internal property that indicates the the map is ready to be used
                    utopiasoftware[utopiasoftware_app_namespace].controller.
                        projectEvaluationPageViewModel.projectEvaluationMap._ptracker_isMapReady = true;
                    // disable the ability to click on the map
                    utopiasoftware[utopiasoftware_app_namespace].controller.
                        projectEvaluationPageViewModel.projectEvaluationMap.setClickable(false);

                    // add a marker to identify the project's location on the map
                    let projectMarker = utopiasoftware[utopiasoftware_app_namespace].controller.
                        projectEvaluationPageViewModel.projectEvaluationMap.addMarker({
                        position: {
                            "lat": utopiasoftware[utopiasoftware_app_namespace].controller.
                                projectEvaluationPageViewModel.projectGeoPosition.coords.latitude,
                            "lng": utopiasoftware[utopiasoftware_app_namespace].controller.
                                projectEvaluationPageViewModel.projectGeoPosition.coords.longitude
                        },
                        icon: '#00D5C3',
                        'title': $('#app-main-navigator').get(0).topPage.data.projectData.TITLE.toLocaleUpperCase(),
                        animation: plugin.google.maps.Animation.BOUNCE
                    });
                    // display marker info window
                    projectMarker.showInfoWindow();
                });
            }
            catch(err){
                // inform the user of the error
                window.plugins.toast.showWithOptions({
                    message: "Location Capture Failed - " + (err.message || err),
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
            }
        },

        /**
         * method is triggered when the "project evaluation carousel" is changed
         * @param event
         */
        async carouselChanged(event){
            // change the css display the prev fab button
            $('#project-evaluation-page #project-evaluation-prev-button').css("display", "inline-block");
            // hide the bottom toolbar of the page
            $('#project-evaluation-page ons-bottom-toolbar').css("display", "none");

            // REMOVE the app background transparency, map np longer showing
            $('html, body').removeClass('utopiasoftware-transparent');

            // update the stay of the the fab "prev" or "next" buttons
             // check if the carousel is at the last item
            if(event.originalEvent.activeIndex ===
                event.originalEvent.carousel.itemCount - 1) { // this is the last carousel item, so hide the next slide button
                // hide the next fab button
                $('#project-evaluation-page #project-evaluation-next-button').css("transform", "scale(0)");
            }
            else if(event.originalEvent.activeIndex === 0) { // this is the first carousel item, so hide the prev slide button
                // hide the prev fab button
                $('#project-evaluation-page #project-evaluation-prev-button').css("transform", "scale(0)");
            }
            else { // this is not the first or last item
                $('#project-evaluation-page #project-evaluation-prev-button,#project-evaluation-page #project-evaluation-next-button')
                    .css("transform", "scale(1)");
            }

            // update the primary instruction and the milestone badge
            if(event.originalEvent.activeIndex < utopiasoftware[utopiasoftware_app_namespace].controller.
                projectEvaluationPageViewModel.projectMilestones.length) // the carousel active index is less than the number of project milestones
            {
                // change the primary instructions
                $('#project-evaluation-page #project-evaluation-primary-instruction').
                html('Evaluate the milestones of project completion on a scale of 0 - 100%');
                // change the milestone number
                $('#project-evaluation-page #project-evaluation-milestone-badge').html(`Milestone ${event.originalEvent.activeIndex + 1}`);
                return;
            }
            if(event.originalEvent.activeIndex == utopiasoftware[utopiasoftware_app_namespace].controller.
                projectEvaluationPageViewModel.projectMilestones.length) // the carousel active index is at the picture capture point
            {
                // change the primary instructions
                $('#project-evaluation-page #project-evaluation-primary-instruction').
                html('Capture the project progress in photos');
                // change the milestone number
                $('#project-evaluation-page #project-evaluation-milestone-badge').html(`Project Photos`);

                // check if Map already exists and is ready to be used
                if(utopiasoftware[utopiasoftware_app_namespace].controller.
                        projectEvaluationPageViewModel.projectEvaluationMap &&
                    utopiasoftware[utopiasoftware_app_namespace].controller.
                        projectEvaluationPageViewModel.projectEvaluationMap._ptracker_isMapReady === true){
                    // make the map invisible
                    utopiasoftware[utopiasoftware_app_namespace].controller.
                    projectEvaluationPageViewModel.projectEvaluationMap.setVisible(false);
                }

                return;
            }
            if(event.originalEvent.activeIndex == utopiasoftware[utopiasoftware_app_namespace].controller.
                projectEvaluationPageViewModel.projectMilestones.length + 1) // the carousel active index is at the geolocation capture point
            {
                // change the primary instructions
                $('#project-evaluation-page #project-evaluation-primary-instruction').
                html('Capture the project geographical location');
                // change the milestone number
                $('#project-evaluation-page #project-evaluation-milestone-badge').html(`Project Location`);

                // check if Map already exists and is ready to be used
                if(utopiasoftware[utopiasoftware_app_namespace].controller.
                        projectEvaluationPageViewModel.projectEvaluationMap &&
                    utopiasoftware[utopiasoftware_app_namespace].controller.
                        projectEvaluationPageViewModel.projectEvaluationMap._ptracker_isMapReady === true){
                    // make the app background transparent, so the map can show
                    $('html, body').addClass('utopiasoftware-transparent');
                    // make the map visible
                    utopiasoftware[utopiasoftware_app_namespace].controller.
                        projectEvaluationPageViewModel.projectEvaluationMap.setVisible(true);
                }
                return;
            }
            if(event.originalEvent.activeIndex == utopiasoftware[utopiasoftware_app_namespace].controller.
                projectEvaluationPageViewModel.projectMilestones.length + 2) // the carousel active index is at the project remarks point
            {
                // change the primary instructions
                $('#project-evaluation-page #project-evaluation-primary-instruction').
                html('Provide any remarks on the project evaluation (optional)');
                // change the milestone number
                $('#project-evaluation-page #project-evaluation-milestone-badge').html(`Project Evaluation Remarks`);

                // display the page toolbar
                await Promise.
                resolve(kendo.fx($('#project-evaluation-page ons-bottom-toolbar')).slideIn("up").duration(150).play());
                $('#project-evaluation-page ons-bottom-toolbar').css("display", "block");

                // check if Map already exists and is ready to be used
                if(utopiasoftware[utopiasoftware_app_namespace].controller.
                        projectEvaluationPageViewModel.projectEvaluationMap &&
                    utopiasoftware[utopiasoftware_app_namespace].controller.
                        projectEvaluationPageViewModel.projectEvaluationMap._ptracker_isMapReady === true){
                    // make the map invisible
                    utopiasoftware[utopiasoftware_app_namespace].controller.
                    projectEvaluationPageViewModel.projectEvaluationMap.setVisible(false);
                }
                return;
            }

        },


        /**
         * method is triggered when the "prev button" for the carousel is clicked
         */
        prevButtonClicked(){
            $('#project-evaluation-page #project-evaluation-carousel').get(0).prev();
        },

        /**
         * method is triggered when the "next button" for the carousel is clicked
         */
        nextButtonClicked(){
            // get the carousel used for the project evaluation
            var carousel = $('#project-evaluation-page #project-evaluation-carousel').get(0);

            // check which carousel index the user is on
            if(carousel.getActiveIndex() === utopiasoftware[utopiasoftware_app_namespace].controller.
                projectEvaluationPageViewModel.projectMilestones.length) // the user is on the picture capture carousel index
            {
                // check if any photos have been taken at all
                if(utopiasoftware[utopiasoftware_app_namespace].controller.
                    projectEvaluationPageViewModel.projectPicturesUrls.length === 1){ // if the length of array is 1, no photos have been taken at all
                    // inform the user of the validation error
                    window.plugins.toast.showWithOptions({
                        message: `Pictures not captured for project evaluation. Please take photo`,
                        duration: 4000,
                        position: "center",
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

                    return; // exit method
                }

                // loop through the photos for the project and check if all project photos have been taken
                for(let index = 1; index < 4; index++){

                    // check if the photo in this index has been taken OR not
                    if(!utopiasoftware[utopiasoftware_app_namespace].controller.
                        projectEvaluationPageViewModel.projectPicturesUrls[index]){

                        // inform the user of the validation error
                        window.plugins.toast.showWithOptions({
                            message: `Picture ${index} not captured for project evaluation. Please take photo`,
                            duration: 4000,
                            position: "center",
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

                        return; // exit method
                    } // end of if
                } // end of for loop
            }

            if(carousel.getActiveIndex() === utopiasoftware[utopiasoftware_app_namespace].controller.
                projectEvaluationPageViewModel.projectMilestones.length + 1) // the user is on the project location capture carousel index
            {
                // check if the geo location in this index has been taken OR not
                if(!utopiasoftware[utopiasoftware_app_namespace].controller.
                    projectEvaluationPageViewModel.projectGeoPosition){

                    // inform the user of validation error
                    window.plugins.toast.showWithOptions({
                        message: `Project Location not captured for project evaluation. Please capture location`,
                        duration: 4000,
                        position: "center",
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

                    return; // exit method
                }
            }

            // ALL VALIDATION SUCCESSFUL. Move to the next carousel item
            carousel.next();
        },

        /**
         * method is triggered when the "Save Report" Button is clicked
         */
        async saveReportButtonClicked(){

            // inform the user that saving report is taking place
            $('#loader-modal-message').html("Saving Report...");
            $('#loader-modal').get(0).show(); // show loader

            // collect all data to be saved
            var projectEvaluationReportData = {milestonesEvaluations: []}; // variable holds the project evaluation report data
            // get the jQuery collection of sliders
            var jQuerySliderElements = $('#project-evaluation-page .project-evaluation-slider');

            // get the score of all milestones evaluated
            for(let index = 0; index < utopiasoftware[utopiasoftware_app_namespace].controller.
                projectEvaluationPageViewModel.projectMilestones.length; index++){
                let milestoneEvaluation = {milestoneId: utopiasoftware[utopiasoftware_app_namespace].controller.
                        projectEvaluationPageViewModel.projectMilestones[index].BOQID,
                milestoneTitle: utopiasoftware[utopiasoftware_app_namespace].controller.
                    projectEvaluationPageViewModel.projectMilestones[index].CATEGORY,
                    milestoneRate: utopiasoftware[utopiasoftware_app_namespace].controller.
                        projectEvaluationPageViewModel.projectMilestones[index].RATE,
                milestoneScore: jQuerySliderElements.eq(index).get(0)._ptracker_slider.value};

                // add the milestoneEvaluation data to the collection
                projectEvaluationReportData.milestonesEvaluations.push(milestoneEvaluation);
            }

            // attach the project data to the project evaluation report data
            projectEvaluationReportData.projectData = $('#app-main-navigator').get(0).topPage.data.projectData;
            // attach the project evalution report's geo location
            projectEvaluationReportData.projectGeoPosition = {
                latitude: utopiasoftware[utopiasoftware_app_namespace].controller.
                    projectEvaluationPageViewModel.projectGeoPosition.coords.latitude,
            longitude: utopiasoftware[utopiasoftware_app_namespace].controller.
                projectEvaluationPageViewModel.projectGeoPosition.coords.longitude};
            // attach the projection evalution report's additional remarks
            projectEvaluationReportData.reportRemarks = $('#project-evaluation-page #project-evaluation-remarks').val().trim();

            // create a unique report title/id for the evaluation report
            let dateStamp = new Date();
            projectEvaluationReportData.title = `${projectEvaluationReportData.projectData.PROJECTID}-Report-${dateStamp.getTime()}`;
            // add other metadata to the evaluation report
            projectEvaluationReportData.dateStamp = dateStamp.getTime();
            projectEvaluationReportData.sortingDate = [kendo.toString(dateStamp, "yyyy"), kendo.toString(dateStamp, "MM"),
                kendo.toString(dateStamp, "dd"), kendo.toString(dateStamp, "HH"), kendo.toString(dateStamp, "mm")];
            projectEvaluationReportData.formattedDate = kendo.toString(dateStamp, "yyyy-MM-dd HH:mm:ss");
            projectEvaluationReportData.evaluatedBy = utopiasoftware[utopiasoftware_app_namespace].model.userDetails.
                                                        userDetails.username;
            projectEvaluationReportData._id = projectEvaluationReportData.title;
            projectEvaluationReportData.TYPE = "saved report";

            try {
                var attachments = {}; // object to hold all the project evaluation picture attachments to be saved

                // attach all saved project photos to the saved evaluation report data
                for(let index = 1; index < 4; index++){

                    // convert the project photos to blobs
                    let fileEntry = await new Promise(function(resolve, reject){
                        window.resolveLocalFileSystemURL(utopiasoftware[utopiasoftware_app_namespace].controller.
                            projectEvaluationPageViewModel.projectPicturesUrls[index], resolve, reject);
                    }); // get a FileEntry object

                    let file = await new Promise(function(resolve, reject){
                        fileEntry.file(resolve, reject);
                    }); // get a file object

                    let fileBlob = await new Promise(function(resolve, reject){
                        let fileReader = new FileReader();
                        fileReader.onloadend = function(){
                            if(this.error){ // an error occurred
                                reject(this.error); // reject the promise
                            }
                            // resolve to the Blob object
                            resolve(new Blob([new Uint8Array(this.result)], {type: 'image/jpeg'}));
                        };

                        fileReader.readAsArrayBuffer(file);
                    }); // get the blob object for the picture file

                    // attach the image to the database document
                    attachments[`picture${index}.jpg`] = {
                        "content_type": "image/jpeg",
                        data: fileBlob
                    };
                }

                // join all the attachments to the project evaluation report data
                projectEvaluationReportData._attachments = attachments;
                // save the project evaluation report data
                await utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.bulkDocs([projectEvaluationReportData]);

                // hide loader
                await $('#loader-modal').get(0).hide();
                // inform user the evaluation report was successfully saved
                await ons.notification.alert('This evaluation report has been saved successfully',
                    {title: '<ons-icon icon="fa-check" style="color: #00B2A0;" size="25px"></ons-icon> <span style="color: #00B2A0; display: inline-block; margin-left: 1em;">Evaluation Report Saved</span>',
                        buttonLabels: ['OK'], modifier: 'utopiasoftware-alert-dialog'});

                // flag to the app that you are going back to a page that needs to be refreshed
                window.sessionStorage.setItem("utopiasoftware-edpms-refresh-page", "yes");
                // move back to the project search page
                $('#app-main-navigator').get(0).resetToPage("search-project-page.html", {pop: true});

            }
            catch(err){
                $('#loader-modal').get(0).hide();
                ons.notification.alert(`saving evaluation report sheet failed. Please try again. ${err.message || ""}`, {title: '<span style="color: red">Saving Report Failed</span>',
                    buttonLabels: ['OK'], modifier: 'utopiasoftware-alert-dialog'});
            }
            finally{
                // hide loader
                $('#loader-modal').get(0).hide();
            }


        }

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
        pageInit: function(event){

            var $thisPage = $(event.target); // get the current page shown
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();

            //function is used to initialise the page if the app is fully ready for execution
            async function loadPageOnAppReady(){
                // check to see if onsen is ready and if all app loading has been completed
                if(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false){
                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                    return;
                }

                // listen for the back button event
                $('#app-main-navigator').get(0).topPage.onDeviceBackButton =
                    utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.backButtonClicked;

                // listen for the infinite scroll event on the page
                $('#app-main-navigator').get(0).topPage.onInfiniteScroll =
                    utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.pageInfiniteScroll;

                // add method to handle the loading action of the pull-to-refresh widget
                $('#view-reports-pull-hook', $thisPage).get(0).onAction =
                    utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.pagePullHookAction;

                // register listener for the pull-to-refresh widget
                $('#view-reports-pull-hook', $thisPage).on("changestate", function(event){

                    // check the state of the pull-to-refresh widget
                    switch (event.originalEvent.state){
                        case 'initial':
                            // update the displayed icon
                            $('#view-reports-pull-hook-fab', event.originalEvent.pullHook).
                            html('<ons-icon icon="fa-long-arrow-down" size="24px" style="color: #FFFFFF"></ons-icon>');
                            break;

                        case 'preaction':

                            $('#view-reports-pull-hook-fab', event.originalEvent.pullHook).
                            html('<ons-icon icon="fa-long-arrow-up" size="24px" style="color: #FFFFFF"></ons-icon>');
                            break;

                        case 'action':
                            $('#view-reports-pull-hook-fab', event.originalEvent.pullHook).
                            html('<ons-icon icon="md-utopiasoftware-icon-spinner" size="24px" spin style="color: #FFFFFF"></ons-icon>');
                            break;
                    }
                });

                // show the page preloader
                $('#view-reports-page .page-preloader').css("display", "block");
                // hide the items that are not to be displayed
                $('#view-reports-page .no-report-found, ' +
                    '#view-reports-page .view-reports-load-error, #view-reports-page #view-reports-list').
                css("display", "none");

                // pick the reports that have been saved by user to-date in descending order
                try{

                    let dbQueryResult = await utopiasoftware[utopiasoftware_app_namespace].projectEvaluationReportData.
                    loadProjectEvaluationReports(false,
                        utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.reportPageSize,
                        utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.skip, true,
                        Date.now(), new Date(2018, 0, 1).getTime());

                    // check if any saved reports were returned
                    if(dbQueryResult.rows.length == 0) { // no saved report found
                        // inform the user that no saved reports are available
                        $('#view-reports-page .page-preloader').css("display", "none");
                        // hide the items that are not to be displayed
                        $('#view-reports-page .view-reports-load-error, #view-reports-page #view-reports-list').
                        css("display", "none");
                        // show the no reports messages
                        $('#view-reports-page .no-report-found').css("display", "block");
                        return;
                    }

                    // update the properties of the View-Model
                    utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.
                        skip += dbQueryResult.rows.length;
                    utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.
                        totalReports = dbQueryResult.total_rows;

                    // create the report list content
                    let viewReportListContent = "";
                    for(let index = 0; index < dbQueryResult.rows.length; index++)
                    {
                        viewReportListContent += `
                        <ons-list-item modifier="longdivider" tappable lock-on-drag="true" 
                        data-utopiasoftware-ptracker-report-id="${dbQueryResult.rows[index].value._id}" 
                        data-utopiasoftware-ptracker-report-rev="${dbQueryResult.rows[index].value._rev}"
                           onclick="utopiasoftware[utopiasoftware_app_namespace].controller.
                           viewReportsPageViewModel.viewReportListItemClicked(this, event)">
                            <div class="left">
                                <ons-icon icon="md-utopiasoftware-icon-document-text" size="46px" class="list-item__icon" style="color: #3F51B5" fixed-width></ons-icon>
                            </div>
                            <div class="center" style="margin-left: 1em">
                                <span class="list-item__title" style="color: #3F51B5">${dbQueryResult.rows[index].value._id}</span>
                                <span class="list-item__subtitle">Project: ${dbQueryResult.rows[index].value.projectId}</span>
                                <span class="list-item__subtitle">Evaluated By: ${utopiasoftware[utopiasoftware_app_namespace].model.userDetails.userDetails.username}</span>
                                <span class="list-item__subtitle" style="font-size: 0.6em">
                                ${kendo.toString(new Date(dbQueryResult.rows[index].value.dateStamp), "MMMM d, yyyy h:mm tt")}
                                </span>
                            </div>
                            <div class="right">
                                <ons-fab modifier="mini" style="background-color: transparent; color: #f30000" 
                                onclick="utopiasoftware[utopiasoftware_app_namespace].controller.
                                viewReportsPageViewModel.reportDeleteButtonClicked('${dbQueryResult.rows[index].value._id}', 
                                '${dbQueryResult.rows[index].value._rev}')">
                                    <ons-icon icon="md-delete">
                                    </ons-icon>
                                </ons-fab>
                                <ons-checkbox modifier="login-checkbox" value="delete" 
                                onclick="utopiasoftware[utopiasoftware_app_namespace].controller.
                                viewReportsPageViewModel.reportCheckBoxClicked(this, '${dbQueryResult.rows[index].value._id}', 
                                '${dbQueryResult.rows[index].value._rev}')"></ons-checkbox>
                            </div>
                        </ons-list-item>`;
                    } // end of for loop

                    // append generated list content to the view-reports
                    $('#view-reports-page #view-reports-list').html(viewReportListContent);


                    // hide the page preloader
                    $('#view-reports-page .page-preloader').css("display", "none");
                    // hide the items that are not to be displayed
                    $('#view-reports-page .no-report-found, #view-reports-page .view-reports-load-error').
                    css("display", "none");
                    // display the view reports list
                    $('#view-reports-page #view-reports-list').css("display", "block");
                }
                catch (e) {

                    // hide the page preloader
                    $('#view-reports-page .page-preloader').css("display", "none");
                    // hide the items that are not to be displayed
                    $('#view-reports-page .no-report-found, #view-reports-page #view-reports-list').
                    css("display", "none");
                    // display the error message to user
                    $('#view-reports-page .view-reports-load-error').css("display", "block");

                }
                finally{
                    // hide the loader
                    $('#loader-modal').get(0).hide();
                }
            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // adjust the window/view-port settings for when the soft keyboard is displayed
            window.SoftInputMode.set('adjustPan'); // let the window/view-port 'pan' when the soft keyboard is displayed
        },


        /**
         * method is triggered when page is hidden
         */
        pageHide: function(){
            // adjust the window/view-port settings for when the soft keyboard is displayed
            // window.SoftInputMode.set('adjustResize'); // let the view 'resize' when the soft keyboard is displayed

        },

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function(){

            // reset the object properties to their default values
            utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.
                skip = 0;
            utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.
                totalReports = 0;
            // empty the collection of selected/checked reports
            utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.
            selectedReportsCollectionMap.clear();

            // uncheck the Bulk Delete checkbox in the Additional Menu Popover
            $('#view-reports-bulk-delete-checkbox').get(0).checked = false;
        },


        /**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */
        async backButtonClicked(){

            // check if the side menu is open
            if($('ons-splitter').get(0).right.isOpen){ // side menu open, so close it
                $('ons-splitter').get(0).right.close();
                return; // exit the method
            }

            // check if the view-reports-additional-menu-popover is visible
            if($('#view-reports-additional-menu-popover').get(0).visible){ // popover menu is currently visible
                // hide the popover menu
                $('#view-reports-additional-menu-popover').get(0).hide();
            }

            // move to the project evaluation page
            $('#app-main-navigator').get(0).popPage();
        },

        /**
         * method is triggered when the delete fab button is clicked
         *
         * @returns {Promise<void>}
         */
        async reportDeleteButtonClicked(docId, docRevision){

            // ask user to confirm evaluation report delete
            let deleteReport = await ons.notification.confirm('Do you want to delete the report?',
                {title: '<ons-icon icon="md-delete" style="color: #3f51b5" size="33px"></ons-icon> <span style="color: #3f51b5; display: inline-block; margin-left: 1em;">Delete Report</span>',
                    buttonLabels: ['No', 'Yes'], modifier: 'utopiasoftware-alert-dialog'});

            if(deleteReport == 0){ // user does not want to delete report, so exit method now
                return; // exit method
            }

            var jQueryListItem = $(`#view-reports-page #view-reports-list ons-list-item[data-utopiasoftware-ptracker-report-id="${docId}"]`);

            //remove the list item from view with an animation
            await Promise.resolve(kendo.fx(jQueryListItem).slideIn("right").duration(400).reverse());
            // remove the element from the list item altogether
            jQueryListItem.remove();

            try {
                // remove the evaluation report from database
                await utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.remove(docId, docRevision);

                // inform the user that evaluation report has been delete
                // display a toast to the user
                ons.notification.toast(`<ons-icon icon="md-delete" size="28px" style="color: #00D5C3"></ons-icon> <span style="text-transform: capitalize; display: inline-block; margin-left: 1em">Report Deleted</span>`, {timeout: 2500});
            }
            catch(err){

            }
        },


        async reportCheckBoxClicked(checkboxElement, docId, docRevision){

            // check if the clicked checkbox is in a checked state or not
            if(checkboxElement.checked === true){ // the clicked checkbox is in a checked state
                // add the unique report id attached to the clicked checkbox to the collection of selected reports
                utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.
                    selectedReportsCollectionMap.set(docId, {_id: docId, _rev: docRevision, _deleted: true});

            }
            else{ // the clicked checkbox is in an unchecked state
                // remove the unique report id attached to the clicked checkbox from the collection of selected reports
                utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.
                selectedReportsCollectionMap.delete(docId);
            }
        },

        /**
         * method is triggered on page infinite scroll
         * @param doneCallBack {function}
         *
         * @returns {Promise<void>}
         */
        async pageInfiniteScroll(doneCallBack){
            // append the loader icon/indicator to the view-reports lists
            $('#view-reports-page #view-reports-list').
            append(`<ons-list-item modifier="nodivider" lock-on-drag="true" class="list-view-infinite-loader">
                <div class="left">
                </div>
                <div class="center">
                    <div style="width: 100%; text-align: center">
                        <ons-icon icon="md-utopiasoftware-icon-spinner" spin size="42px" class="list-item__icon" style="color: #00D5C3"></ons-icon>
                    </div>
                </div>
                <div class="right">
                </div>
            </ons-list-item>`);

            // load additional reports to the page
            try{
                // check if there if this is the last set/page of reports or not
                if(utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.skip >=
                    utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.totalReports){
                    // remove the loader icon/indicator to the view-reports lists
                    $('#view-reports-page #view-reports-list .list-view-infinite-loader').remove();
                    doneCallBack();
                    // this is the last set/page of reports. so no need to load any more
                    return;
                }

                // pick the reports that have been saved by user to-date in descending order (Note the skip value)
                let dbQueryResult = await utopiasoftware[utopiasoftware_app_namespace].projectEvaluationReportData.
                loadProjectEvaluationReports(false,
                    utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.reportPageSize,
                    utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.skip, true,
                    Date.now(), new Date(2018, 0, 1).getTime());

                // check if any saved reports were returned
                if(dbQueryResult.rows.length == 0) { // no saved report found
                    // remove the loader icon/indicator to the view-reports lists
                    $('#view-reports-page #view-reports-list .list-view-infinite-loader').remove();
                    doneCallBack();
                    // no report data was returned, so exit method
                    return;
                }

                // update the properties of the View-Model
                utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.
                    skip += dbQueryResult.rows.length;
                utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.
                    totalReports = dbQueryResult.total_rows;

                // create the report list content
                let viewReportListContent = "";
                for(let index = 0; index < dbQueryResult.rows.length; index++)
                {
                    viewReportListContent += `
                        <ons-list-item modifier="longdivider" tappable lock-on-drag="true" 
                        data-utopiasoftware-ptracker-report-id="${dbQueryResult.rows[index].value._id}" 
                        data-utopiasoftware-ptracker-report-rev="${dbQueryResult.rows[index].value._rev}"
                           onclick="utopiasoftware[utopiasoftware_app_namespace].controller.
                           viewReportsPageViewModel.viewReportListItemClicked(this, event)">
                            <div class="left">
                                <ons-icon icon="md-utopiasoftware-icon-document-text" size="46px" class="list-item__icon" style="color: #3F51B5" fixed-width></ons-icon>
                            </div>
                            <div class="center" style="margin-left: 1em">
                                <span class="list-item__title" style="color: #3F51B5">${dbQueryResult.rows[index].value._id}</span>
                                <span class="list-item__subtitle">Project: ${dbQueryResult.rows[index].value.projectId}</span>
                                <span class="list-item__subtitle">Evaluated By: ${utopiasoftware[utopiasoftware_app_namespace].model.userDetails.userDetails.username}</span>
                                <span class="list-item__subtitle" style="font-size: 0.6em">
                                ${kendo.toString(new Date(dbQueryResult.rows[index].value.dateStamp), "MMMM d, yyyy h:mm tt")}
                                </span>
                            </div>
                            <div class="right">
                                <ons-fab modifier="mini" style="background-color: transparent; color: #f30000" 
                                onclick="utopiasoftware[utopiasoftware_app_namespace].controller.
                                viewReportsPageViewModel.reportDeleteButtonClicked('${dbQueryResult.rows[index].value._id}', 
                                '${dbQueryResult.rows[index].value._rev}')">
                                    <ons-icon icon="md-delete">
                                    </ons-icon>
                                </ons-fab>
                                <ons-checkbox modifier="login-checkbox" value="delete" 
                                onclick="utopiasoftware[utopiasoftware_app_namespace].controller.
                                viewReportsPageViewModel.reportCheckBoxClicked(this, '${dbQueryResult.rows[index].value._id}', 
                                '${dbQueryResult.rows[index].value._rev}')"></ons-checkbox>
                            </div>
                        </ons-list-item>`;
                } // end of for loop

                // remove the loader icon/indicator to the view-reports lists
                $('#view-reports-page #view-reports-list .list-view-infinite-loader').remove();
                // append generated list content to the view-reports
                $('#view-reports-page #view-reports-list').append(viewReportListContent);
                doneCallBack();
            }
            catch (e) {
                // remove the loader icon/indicator to the view-reports lists
                $('#view-reports-page #view-reports-list .list-view-infinite-loader').remove();
                doneCallBack();
                // display message to inform user of load error
                ons.notification.toast(`<ons-icon icon="md-alert-circle" size="28px" style="color: yellow"></ons-icon> <span style="text-transform: capitalize; display: inline-block; margin-left: 1em; color: yellow">Loading Error. Try Again</span>`, {timeout: 3000});
            }
        },

        /**
         * method is triggered when the pull-hook on the page is active
         *
         * @param doneCallBack
         * @returns {Promise<void>}
         */
        async pagePullHookAction(doneCallBack = function(){}){
            // disable pull-to-refresh widget till loading is done
            $('#view-reports-page #view-reports-pull-hook').attr("disabled", true);
            // empty the collection of selected/checked reports
            utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.
            selectedReportsCollectionMap.clear();

            // reload reports to the page. start from the 1st
            try{

                // pick the reports that have been saved by user to-date in descending order (Note the skip value)
                let dbQueryResult = await utopiasoftware[utopiasoftware_app_namespace].projectEvaluationReportData.
                loadProjectEvaluationReports(false,
                    utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.reportPageSize, 0, true,
                    Date.now(), new Date(2018, 0, 1).getTime());

                // check if any saved reports were returned
                if(dbQueryResult.rows.length == 0) { // no saved report found
                    // enable pull-to-refresh widget
                    $('#view-reports-page #view-reports-pull-hook').removeAttr("disabled");
                    // hide the items that are not to be displayed
                    $('#view-reports-page .view-reports-load-error, #view-reports-page #view-reports-list').
                    css("display", "none");
                    // show the no reports messages
                    $('#view-reports-page .no-report-found').css("display", "block");
                    // inform ONSEN that the refresh action is completed
                    doneCallBack();
                    return;
                }

                // update the properties of the View-Model
                utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.
                    skip = dbQueryResult.rows.length;
                utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.
                    totalReports = dbQueryResult.total_rows;

                // create the report list content
                let viewReportListContent = "";
                for(let index = 0; index < dbQueryResult.rows.length; index++)
                {
                    viewReportListContent += `
                        <ons-list-item modifier="longdivider" tappable lock-on-drag="true" 
                        data-utopiasoftware-ptracker-report-id="${dbQueryResult.rows[index].value._id}" 
                        data-utopiasoftware-ptracker-report-rev="${dbQueryResult.rows[index].value._rev}"
                           onclick="utopiasoftware[utopiasoftware_app_namespace].controller.
                           viewReportsPageViewModel.viewReportListItemClicked(this, event)">
                            <div class="left">
                                <ons-icon icon="md-utopiasoftware-icon-document-text" size="46px" class="list-item__icon" style="color: #3F51B5" fixed-width></ons-icon>
                            </div>
                            <div class="center" style="margin-left: 1em">
                                <span class="list-item__title" style="color: #3F51B5">${dbQueryResult.rows[index].value._id}</span>
                                <span class="list-item__subtitle">Project: ${dbQueryResult.rows[index].value.projectId}</span>
                                <span class="list-item__subtitle">Evaluated By: ${utopiasoftware[utopiasoftware_app_namespace].model.userDetails.userDetails.username}</span>
                                <span class="list-item__subtitle" style="font-size: 0.6em">
                                ${kendo.toString(new Date(dbQueryResult.rows[index].value.dateStamp), "MMMM d, yyyy h:mm tt")}
                                </span>
                            </div>
                            <div class="right">
                                <ons-fab modifier="mini" style="background-color: transparent; color: #f30000" 
                                onclick="utopiasoftware[utopiasoftware_app_namespace].controller.
                                viewReportsPageViewModel.reportDeleteButtonClicked('${dbQueryResult.rows[index].value._id}', 
                                '${dbQueryResult.rows[index].value._rev}')">
                                    <ons-icon icon="md-delete">
                                    </ons-icon>
                                </ons-fab>
                                <ons-checkbox modifier="login-checkbox" value="delete" 
                                onclick="utopiasoftware[utopiasoftware_app_namespace].controller.
                                viewReportsPageViewModel.reportCheckBoxClicked(this, '${dbQueryResult.rows[index].value._id}', 
                                '${dbQueryResult.rows[index].value._rev}')"></ons-checkbox>
                            </div>
                        </ons-list-item>`;
                } // end of for loop

                // enable pull-to-refresh widget
                $('#view-reports-page #view-reports-pull-hook').removeAttr("disabled");
                // append generated list content to the view-reports
                $('#view-reports-page #view-reports-list').html(viewReportListContent);
                // hide the items that are not to be displayed
                $('#view-reports-page .no-report-found, #view-reports-page .view-reports-load-error').
                css("display", "none");
                // display the view reports list
                $('#view-reports-page #view-reports-list').css("display", "block");
                // inform ONSEN that the refresh action is completed
                doneCallBack();
            }
            catch (e) {
                // enable pull-to-refresh widget
                $('#view-reports-page #view-reports-pull-hook').removeAttr("disabled");
                doneCallBack();
            }
        },

        /**
         * method is triggered when any of the list items on the view report lisat is clicked
         * @param listItemElement {HTMLElement} the list item that was clicked
         * @param event {Event}
         *
         * @returns {Promise<void>}
         */
        async viewReportListItemClicked(listItemElement, event){

            if($(event.target).closest('ons-fab', listItemElement).is('ons-fab')){ // check if it is the delete fab that has been clicked
                return; // exit. the checkbox was clicked, so take no further action
            }

            if($(event.target).closest('ons-checkbox', listItemElement).is('ons-checkbox')){ // check if it is the checkbox that has been clicked
                return; // exit. the checkbox was clicked, so take no further action
            }

            var jQueryListItem = $(listItemElement); // convert the list item to a jquery object and get required data attributes

            // push the evaluation report page into view
            $('#app-main-navigator').get(0).pushPage("evaluation-report-page.html", {animation: "slide-md",
                data: {reportDetails: {id: jQueryListItem.attr('data-utopiasoftware-ptracker-report-id'),
                                        rev: jQueryListItem.attr('data-utopiasoftware-ptracker-report-rev')}}});
        },

        /**
         * method is triggered when the bulk delete option is clicked from the
         * Addition Menu Popover List
         * @returns {Promise<void>}
         */
        async bulkDeletePopOverListItemClicked(){

            // hide the Additional Menu Popover
            await Promise.resolve($('#view-reports-additional-menu-popover').get(0).hide());

            // check if the bulk delete checkbox is checked or not
            if($('#view-reports-bulk-delete-checkbox').get(0).checked === true){ // checkbox is checked
                // hide all the delete buttons displayed on the view-reports-list and show the checkboxes
                $('#view-reports-page #view-reports-list').removeClass('show-delete').addClass('hide-delete');
                // show the Bulk Delete button
                await Promise.
                resolve(kendo.fx($('#view-reports-page #view-reports-bottom-toolbar-bulk-delete-block')).
                slideIn("up").duration(400).play());
                $('#view-reports-page #view-reports-bottom-toolbar-bulk-delete-block').css("display", "block");
            }
            else{ // checkbox is NOT checked

                // uncheck ALL previously checked checkboxes on the view-reports list
                $('#view-reports-page #view-reports-list ons-checkbox').
                each(function(index, element){
                    element.checked = false;
                });

                // empty the collection of selected/checked reports
                utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.
                    selectedReportsCollectionMap.clear();

                // show all the delete buttons displayed on the view-reports-list and hide the checkboxes
                $('#view-reports-page #view-reports-list').removeClass('hide-delete').addClass('show-delete');
                // hide the Bulk Delete button
                await Promise.
                resolve(kendo.fx($('#view-reports-page #view-reports-bottom-toolbar-bulk-delete-block')).
                slideIn("up").duration(400).reverse());
                $('#view-reports-page #view-reports-bottom-toolbar-bulk-delete-block').css("display", "none");
            }
        },

        /**
         * method is triggered when the Delete bottom toolbar button is clicked
         * @returns {Promise<void>}
         */
        async bulkDeleteButtonClicked(){

            // get the collection of selected reports for deletion
            let selectedReportArray = [...utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.
                selectedReportsCollectionMap].map(function(currentValue, index){
                return currentValue[1];
            });

            if(selectedReportArray.length === 0){ //  there are no selected reports to delete, so exit the method
                await ons.notification.alert('Please, select reports to be deleted',
                    {title: '<ons-icon icon="md-info" style="color: #3f51b5" size="33px"></ons-icon> <span style="color: #3f51b5; display: inline-block; margin-left: 1em;">No Reports Selected</span>',
                        buttonLabels: ['OK'], modifier: 'utopiasoftware-alert-dialog'});
                return; // exit method
            }

            // ask user to confirm evaluation report delete
            let deleteReport = await ons.notification.confirm('Do you want to delete the selected reports?',
                {title: '<ons-icon icon="md-delete" style="color: #3f51b5" size="33px"></ons-icon> <span style="color: #3f51b5; display: inline-block; margin-left: 1em;">Delete Report</span>',
                    buttonLabels: ['No', 'Yes'], modifier: 'utopiasoftware-alert-dialog'});

            if(deleteReport == 0){ // user does not want to delete any report
                return; // exit method
            }

            try{
                // show the page preloader
                $('#view-reports-page .page-preloader').css("display", "block");
                await utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.bulkDocs(selectedReportArray);
                // get a collection of the list items that match the selected reports
                selectedReportArray.forEach(function(arrayObj, index){
                    selectedReportArray[index] =
                        $(`#view-reports-page #view-reports-list ons-list-item[data-utopiasoftware-ptracker-report-id="${arrayObj._id}"]`).
                        get(0);
                });

                // remove the collection of elements from the list item
                $(selectedReportArray).remove();
                // clear/empty the selected reports collection
                utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.selectedReportsCollectionMap.
                clear();
                // hide the page preloader
                $('#view-reports-page .page-preloader').css("display", "none");

                // disable the bulk delete checkbox and other bulk delete setup
                $('#view-reports-bulk-delete-checkbox').get(0).checked = false;
                await utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.
                bulkDeletePopOverListItemClicked();

                // display a toast to the user
                await ons.notification.toast(`<ons-icon icon="md-delete" size="28px" style="color: #00D5C3"></ons-icon> <span style="text-transform: capitalize; display: inline-block; margin-left: 1em">${selectedReportArray.length} ${selectedReportArray.length === 1 ? "Report": "Reports"} Deleted</span>`, {timeout: 2500});
                selectedReportArray = [];

            }
            catch(err){
                console.log("BULK DELETE ERROR", err);
                // hide the page preloader
                $('#view-reports-page .page-preloader').css("display", "none");
                // display message to inform user of load error
                ons.notification.toast(`<ons-icon icon="md-alert-circle" size="28px" style="color: yellow"></ons-icon> <span style="text-transform: capitalize; display: inline-block; margin-left: 1em; color: yellow">Bulk Delete Failed</span>`, {timeout: 3000});
            }

        }
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
        pageInit: function(event){

            var $thisPage = $(event.target); // get the current page shown
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();

            //function is used to initialise the page if the app is fully ready for execution
            async function loadPageOnAppReady(){
                // check to see if onsen is ready and if all app loading has been completed
                if(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false){
                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                    return;
                }

                // listen for the back button event
                $('#app-main-navigator').get(0).topPage.onDeviceBackButton =
                    utopiasoftware[utopiasoftware_app_namespace].controller.evaluationReportPageViewModel.backButtonClicked;

                // show the page preloader
                $('#evaluation-report-page .page-preloader').css("display", "block");
                // hide the items that are not to be displayed
                $('#evaluation-report-page .no-report-found, ' +
                    '#evaluation-report-page .evaluation-report-load-error, #evaluation-report-page #evaluation-report-list').
                css("display", "none");
                $('#evaluation-report-page #evaluation-report-delete-fab').attr("disabled", true);

                // pick the evaluation report to delete
                try{

                    let evaluationReport = await utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.get(
                        $('#app-main-navigator').get(0).topPage.data.reportDetails.id,
                        {attachments: true, binary: true}
                    );

                    // get the object urls for the 3 project evaluation photos
                    utopiasoftware[utopiasoftware_app_namespace].controller.
                        evaluationReportPageViewModel.projectPicture1Url = window.URL.
                    createObjectURL(evaluationReport._attachments['picture1.jpg'].data);
                    // get the object urls for the 3 project evaluation photos
                    utopiasoftware[utopiasoftware_app_namespace].controller.
                        evaluationReportPageViewModel.projectPicture2Url = window.URL.
                    createObjectURL(evaluationReport._attachments['picture2.jpg'].data);
                    // get the object urls for the 3 project evaluation photos
                    utopiasoftware[utopiasoftware_app_namespace].controller.
                        evaluationReportPageViewModel.projectPicture3Url = window.URL.
                    createObjectURL(evaluationReport._attachments['picture3.jpg'].data);

                    // create the evaluation report list content
                    let evaluationReportListContent = `
                    <ons-list-header>Report Title</ons-list-header>
                    <ons-list-item modifier="longdivider" lock-on-drag="true"
                                   onclick="">
                        <div class="center" style="">
                            <span class="list-item__title" style="color: #3F51B5; text-transform: uppercase">${evaluationReport.title}</span>
                        </div>
                    </ons-list-item>
                    
                    <ons-list-header>Project Title</ons-list-header>
                    <ons-list-item modifier="longdivider" lock-on-drag="true"
                                   onclick="">
                        <div class="center" style="">
                            <span class="list-item__title" style="color: #3F51B5; text-transform: uppercase">${evaluationReport.projectData.TITLE}</span>
                        </div>
                    </ons-list-item>
                    
                    <ons-list-header>Project ID</ons-list-header>
                    <ons-list-item modifier="longdivider" lock-on-drag="true"
                                   onclick="">
                        <div class="center" style="">
                            <span class="list-item__title" style="color: #3F51B5; text-transform: uppercase">${evaluationReport.projectData.PROJECTID}</span>
                        </div>
                    </ons-list-item>
                    
                    <ons-list-header>Project Milestones</ons-list-header>
                    <ons-list-item modifier="longdivider" lock-on-drag="true" expandable
                                   onclick="">
                        <div class="center" style="">
                            <span class="list-item__title" style="color: #3F51B5;">Milestone Progress Evaluation</span>
                        </div>
                        <div class="expandable-content">
                            <div class="row">`;
                    for(let index = 0; index < evaluationReport.milestonesEvaluations.length; index++){
                        evaluationReportListContent += `
                        <div class="col-xs-9" style="text-transform: capitalize">
                        ${evaluationReport.milestonesEvaluations[index].milestoneTitle}</div>
                        <div class="col-xs-3" style="text-align: left; padding-left: 1em;">
                        ${evaluationReport.milestonesEvaluations[index].milestoneScore}%</div>`;
                    }

                    evaluationReportListContent += `
                        </div>
                        </div>
                    </ons-list-item>

                    <ons-list-header>Project Photos</ons-list-header>
                    <ons-list-item modifier="longdivider" lock-on-drag="true" expandable
                                   onclick="">
                        <div class="center" style="">
                            <span class="list-item__title" style="color: #3F51B5;">View Photos</span>
                        </div>
                        <div class="expandable-content">
                            <div class="row">
                                <div class="col-xs-6" style="padding: 0.5em;">
                                    <img src="${utopiasoftware[utopiasoftware_app_namespace].controller.
                                    evaluationReportPageViewModel.projectPicture1Url}" style="width: 100%; border: 2px darkgray groove">
                                </div>
                                <div class="col-xs-6" style="padding: 0.5em;">
                                    <img src="${utopiasoftware[utopiasoftware_app_namespace].controller.
                                evaluationReportPageViewModel.projectPicture2Url}" style="width: 100%; border: 2px darkgray groove">
                                </div>
                                <div class="col-xs-6" style="padding: 0.5em;">
                                    <img src="${utopiasoftware[utopiasoftware_app_namespace].controller.
                                evaluationReportPageViewModel.projectPicture3Url}" style="width: 100%; border: 2px darkgray groove">
                                </div>
                            </div>
                        </div>
                    </ons-list-item>
                    
                    <ons-list-header>Project Location</ons-list-header>
                    <ons-list-item modifier="longdivider" lock-on-drag="true"
                                   onclick="">
                        <div class="center" style="">
                            <span class="list-item__title" style="color: #3F51B5;">${evaluationReport.projectGeoPosition.latitude},${evaluationReport.projectGeoPosition.longitude}</span>
                        </div>
                    </ons-list-item>
        
                    <ons-list-header>Evaluation Remarks</ons-list-header>
                    <ons-list-item modifier="longdivider" lock-on-drag="true"
                                   onclick="">
                        <div class="center" style="">
                            <span class="list-item__title" style="color: #3F51B5;">${evaluationReport.reportRemarks.replace(/\n/ig, "<br>")}</span>
                        </div>
                    </ons-list-item>
        
                    <ons-list-header>Evaluation By</ons-list-header>
                    <ons-list-item modifier="longdivider" lock-on-drag="true"
                                   onclick="">
                        <div class="center" style="">
                            <span class="list-item__title" style="color: #3F51B5;">${evaluationReport.evaluatedBy}</span>
                        </div>
                    </ons-list-item>
        
                    <ons-list-header>Evaluation Date</ons-list-header>
                    <ons-list-item modifier="longdivider" lock-on-drag="true"
                                   onclick="">
                        <div class="center" style="">
                            <span class="list-item__title" style="color: #3F51B5;">${kendo.toString(new Date(evaluationReport.dateStamp), "MMMM d, yyyy h:mm tt")}</span>
                        </div>
                    </ons-list-item>`;

                    // append generated list content to the evaluation report
                    $('#evaluation-report-page #evaluation-report-list').html(evaluationReportListContent);


                    // hide the page preloader
                    $('#evaluation-report-page .page-preloader').css("display", "none");
                    // hide the items that are not to be displayed
                    $('#evaluation-report-page .no-report-found, #evaluation-report-page .evaluation-report-load-error').
                    css("display", "none");
                    // display the view reports list
                    $('#evaluation-report-page #evaluation-report-list').css("display", "block");
                    $('#evaluation-report-page #evaluation-report-delete-fab').removeAttr("disabled");
                }
                catch (e) {

                    // hide the page preloader
                    $('#evaluation-report-page .page-preloader').css("display", "none");
                    // hide the items that are not to be displayed
                    $('#evaluation-report-page .no-report-found, #evaluation-report-page #evaluation-report-list').
                    css("display", "none");
                    $('#evaluation-report-page #evaluation-report-delete-fab').attr("disabled", true);
                    // display the error message to user
                    $('#evaluation-report-page .evaluation-report-load-error').css("display", "block");

                }
                finally{
                    // hide the loader
                    $('#loader-modal').get(0).hide();
                }
            }

        },

        /**
         * method is triggered when page is shown
         */
        pageShow: function(){
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // adjust the window/view-port settings for when the soft keyboard is displayed
            window.SoftInputMode.set('adjustPan'); // let the window/view-port 'pan' when the soft keyboard is displayed
        },


        /**
         * method is triggered when page is hidden
         */
        pageHide: function(){
            // adjust the window/view-port settings for when the soft keyboard is displayed
            // window.SoftInputMode.set('adjustResize'); // let the view 'resize' when the soft keyboard is displayed

        },

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: function(){
            // destroy all picture object urls created for this page
            window.URL.revokeObjectURL(
            utopiasoftware[utopiasoftware_app_namespace].controller.
                evaluationReportPageViewModel.projectPicture1Url);
            window.URL.revokeObjectURL(
                utopiasoftware[utopiasoftware_app_namespace].controller.
                    evaluationReportPageViewModel.projectPicture2Url);
            window.URL.revokeObjectURL(
                utopiasoftware[utopiasoftware_app_namespace].controller.
                    evaluationReportPageViewModel.projectPicture3Url);
        },


        /**
         * method is triggered when the device back button is clicked OR a similar action is triggered
         */
        async backButtonClicked(){

            // check if the side menu is open
            if($('ons-splitter').get(0).right.isOpen){ // side menu open, so close it
                $('ons-splitter').get(0).right.close();
                return; // exit the method
            }

            // move to the view report page
            $('#app-main-navigator').get(0).popPage();
        },

        /**
         * method is triggered when the delete fab button is clicked
         *
         * @returns {Promise<void>}
         */
        async reportDeleteButtonClicked(fabElement = {},
                                        docId = $('#app-main-navigator').get(0).topPage.data.reportDetails.id,
                                        docRevision = $('#app-main-navigator').get(0).topPage.data.reportDetails.rev){

            if(fabElement.disabled === true){ // if the delete fab button is disabled, do nothing
                return;
            }

            // ask user to confirm evaluation report delete
            let deleteReport = await ons.notification.confirm('Do you want to delete the report?',
                {title: '<ons-icon icon="md-delete" style="color: #3f51b5" size="33px"></ons-icon> <span style="color: #3f51b5; display: inline-block; margin-left: 1em;">Delete Report</span>',
                    buttonLabels: ['No', 'Yes'], modifier: 'utopiasoftware-alert-dialog'});

            if(deleteReport == 0){ // user does not want to delete report, so exit method now
                return; // exit method
            }

            // display the page preloader
            $('#evaluation-report-page .page-preloader').css("display", "block");

            // remove the evaluation report from database
            await utopiasoftware[utopiasoftware_app_namespace].model.appDatabase.remove(docId, docRevision);

            // move to the view report page
            await $('#app-main-navigator').get(0).popPage();

            // get the list item corresponding to the evaluation report being deleted
            var jQueryListItem = $(`#view-reports-page #view-reports-list ons-list-item[data-utopiasoftware-ptracker-report-id="${docId}"]`);

            // remove the element from the list item altogether
            jQueryListItem.remove();

            // inform the user that evaluation report has been delete
            // display a toast to the user
            await ons.notification.toast(`<ons-icon icon="md-delete" size="28px" style="color: #00D5C3"></ons-icon> <span style="text-transform: capitalize; display: inline-block; margin-left: 1em">Report Deleted</span>`, {timeout: 2500});
        }
    },

    /**
     * this is the view model for the collator page
     */
    collatorPageViewModel : {

        electionDataArray : [],

        /**
         * event is triggered when page is initialised
         */
        pageInit: async function(event){
            var $thisPage = $(event.target); // get the current page shown
            // disable the swipeable feature for the app splitter
            $('ons-splitter-side').removeAttr("swipeable");

            // call the function used to initialise the app page if the app is fully loaded
            loadPageOnAppReady();

            //function is used to initialise the page if the app is fully ready for execution
            async function loadPageOnAppReady(){
                // check to see if onsen is ready and if all app loading has been completed
                if(!ons.isReady() || utopiasoftware[utopiasoftware_app_namespace].model.isAppReady === false){
                    setTimeout(loadPageOnAppReady, 500); // call this function again after half a second
                    return;
                }

                // initialise the SENATORIAL DISTRICT DROPDOWN LIST
                new ej.dropdowns.DropDownLis({
                    dataSource: utopiasoftware[utopiasoftware_app_namespace].controller.
                        collatorPageViewModel.electionDataArray[0],
                    enabled: true,
                    floatLabelType: 'Auto',
                    fields: {text: "doc.senatorial_description", value: "doc.senatorial_code"},
                    placeholder: "Senatorial Districts"
                }).appendTo('#collator-page-senatorial-districts');
            }
        },

        /**
         * method is triggered when page is shown
         */
        pageShow: async function(){},

        /**
         * method is triggered when page is hidden
         */
        pageHide: async function(){},

        /**
         * method is triggered when page is destroyed
         */
        pageDestroy: async function(){}
    }

};


