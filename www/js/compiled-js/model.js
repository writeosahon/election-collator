/**
 * Created by UTOPIA SOFTWARE on 26/7/2018.
 */



// define the model namespace
utopiasoftware[utopiasoftware_app_namespace].model = {

    /**
     * property acts as a flag that indicates that all hybrid plugins and DOM content
     * have been successfully loaded. It relies on the ons.ready() method
     *
     * @type {boolean} flag for if the hybrid plugins and DOM content are ready for execution
     */
    isAppReady: false,

    /**
     * holds the pouchDB database used by the app
     */
    appDatabase: null,

    /**
     * holds the base url for reaching the application server
     */
    appBaseUrl: 'http://132.148.150.76/edpms',

    /**
     * holds the details of the currently logged in user
     */
    userDetails: null

};

// call the method to startup the app
utopiasoftware[utopiasoftware_app_namespace].controller.startup();

// listen for the initialisation of the LOGIN page
$(document).on("init", "#login-page", utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.pageInit);

// listen for when the LOGIN page is shown
$(document).on("show", "#login-page", utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.pageShow);

// listen for when the LOGIN page is hidden
$(document).on("hide", "#login-page", utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.pageHide);

// listen for when the LOGIN page is destroyed
$(document).on("destroy", "#login-page", utopiasoftware[utopiasoftware_app_namespace].controller.loginPageViewModel.pageDestroy);

// listen for the initialisation of the LOGIN page
$(document).on("init", "#search-project-page", utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.pageInit);

// listen for when the LOGIN page is shown
$(document).on("show", "#search-project-page", utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.pageShow);

// listen for when the LOGIN page is hidden
$(document).on("hide", "#search-project-page", utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.pageHide);

// listen for when the LOGIN page is destroyed
$(document).on("destroy", "#search-project-page", utopiasoftware[utopiasoftware_app_namespace].controller.searchProjectPageViewModel.pageDestroy);

// listen for the initialisation of the PROJECT EVALUATION page
$(document).on("init", "#project-evaluation-page", utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.pageInit);

// listen for when the PROJECT EVALUATION page is shown
$(document).on("show", "#project-evaluation-page", utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.pageShow);

// listen for when the PROJECT EVALUATION page is hidden
$(document).on("hide", "#project-evaluation-page", utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.pageHide);

// listen for when the PROJECT EVALUATION page is destroyed
$(document).on("destroy", "#project-evaluation-page", utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.pageDestroy);

// listen for the postchange event of the "project-evaluation-carousel" carousel from the PROJECT EVALUATION page
$(document).on("postchange", '#project-evaluation-page #project-evaluation-carousel', utopiasoftware[utopiasoftware_app_namespace].controller.projectEvaluationPageViewModel.carouselChanged);

// listen for the initialisation of the VIEW REPORTS page
$(document).on("init", "#view-reports-page", utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.pageInit);

// listen for when the VIEW REPORTS page is shown
$(document).on("show", "#view-reports-page", utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.pageShow);

// listen for when the VIEW REPORTS page is hidden
$(document).on("hide", "#view-reports-page", utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.pageHide);

// listen for when the VIEW REPORTS page is destroyed
$(document).on("destroy", "#view-reports-page", utopiasoftware[utopiasoftware_app_namespace].controller.viewReportsPageViewModel.pageDestroy);

// listen for the initialisation of the EVALUATION REPORT page
$(document).on("init", "#evaluation-report-page", utopiasoftware[utopiasoftware_app_namespace].controller.evaluationReportPageViewModel.pageInit);

// listen for when the EVALUATION REPORT page is shown
$(document).on("show", "#evaluation-report-page", utopiasoftware[utopiasoftware_app_namespace].controller.evaluationReportPageViewModel.pageShow);

// listen for when the EVALUATION REPORT page is hidden
$(document).on("hide", "#evaluation-report-page", utopiasoftware[utopiasoftware_app_namespace].controller.evaluationReportPageViewModel.pageHide);

// listen for when the EVALUATION REPORT page is destroyed
$(document).on("destroy", "#evaluation-report-page", utopiasoftware[utopiasoftware_app_namespace].controller.evaluationReportPageViewModel.pageDestroy);

// listen for the initialisation of the COLLATOR page
$(document).on("init", "#collator-page", utopiasoftware[utopiasoftware_app_namespace].controller.collatorPageViewModel.pageInit);

// listen for when the COLLATOR page is shown
$(document).on("show", "#collator-page", utopiasoftware[utopiasoftware_app_namespace].controller.collatorPageViewModel.pageShow);

// listen for when the COLLATOR REPORT page is hidden
$(document).on("hide", "#collator-page", utopiasoftware[utopiasoftware_app_namespace].controller.collatorPageViewModel.pageHide);

// listen for when the COLLATOR REPORT page is destroyed
$(document).on("destroy", "#collator-page", utopiasoftware[utopiasoftware_app_namespace].controller.collatorPageViewModel.pageDestroy);