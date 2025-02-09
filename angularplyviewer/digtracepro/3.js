(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[3],{

/***/ "./src/app/pages/jobs/associated-jobs/associated-jobs.component.css":
/*!**************************************************************************!*\
  !*** ./src/app/pages/jobs/associated-jobs/associated-jobs.component.css ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/pages/jobs/associated-jobs/associated-jobs.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/pages/jobs/associated-jobs/associated-jobs.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container mt-4\" *ngIf=\"showComponent\">\n    \n  <div *ngIf=\"jobSubmitErrors\" class=\"alert alert-block alert-danger\"> \n    <ul class=\"m-0\" [ngStyle]=\"{'padding-left':'20px'}\"> \n      <li *ngFor=\"let warning of jobSubmitErrors\">\n        {{warning}}\n      </li> \n    </ul> \n  </div>\n\n  <h4 class=\"text-center font-weight-bold mb-5\" [ngStyle]=\"{'text-decoration':'underline'}\">\n    Associated Jobs/Group Jobs\n  </h4>\n\n  <div *ngFor=\"let job of groupJobsInfo\" class=\"mt-1 mb-4\">\n    <h5 class=\"text-center mb-3\"><strong>Job Name: </strong>{{job.job_name}}</h5>\n    <p class=\"d-flex justify-content-center\">\n      <span class=\"mr-3\"><strong>Job Created: </strong>{{job.job_date_created}}</span>\n      <span class=\"ml-3\"><strong>Job Updated: </strong>{{job.job_date_updated}}</span>\n    </p>   \n\n    <div class=\"row d-flex justify-content-center mb-3\">\n      <button name=\"viewDetailBtn\" routerLink=\"/jobs/job-description/{{jobId}}\" type=\"submit\" class=\"btn btn-outline-custom mx-1 mx-md-3 my-2\">        \n        View Detail\n      </button>\n      <button name=\"jobDeleteBtn\" (click)=\"deleteJob()\" name=\"deleteBtn\" type=\"submit\" class=\"btn btn-outline-danger mx-1 mx-md-3 my-2\">\n        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-trash\" viewBox=\"0 0 16 16\">\n          <path d=\"M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z\"/>\n          <path fill-rule=\"evenodd\" d=\"M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z\"/>\n        </svg>\n        Delete\n      </button>\n      <button name=\"jobModifyBtn\" routerLink=\"/jobs/update-job/{{jobId}}\" type=\"submit\" class=\"btn btn-outline-custom mx-1 mx-md-3 my-2\">\n        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-pencil\" viewBox=\"0 0 16 16\">\n          <path d=\"M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z\"/>\n        </svg>\n        Modify\n      </button>\n      <button name=\"jobSubmitBtn\" type=\"submit\" (click)=\"jobSubmit(job)\" class=\"btn btn-outline-custom mx-1 mx-md-3 my-2\">\n        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-box-arrow-in-right\" viewBox=\"0 0 16 16\">\n          <path fill-rule=\"evenodd\" d=\"M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z\"/>\n          <path fill-rule=\"evenodd\" d=\"M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z\"/>\n        </svg>\n        Submit\n      </button>\n    </div>\n\n    <div *ngFor=\"let collection of job.userImagesCollection\" class=\"mb-4\">        \n      <p><strong>Image Project Name: </strong>{{collection.title}}</p>\n      <p><strong>Image Project Uploaded Date: </strong>{{collection.date_uploaded}}</p>                  \n      <div class=\"row\">            \n        <div class=\"col-6 col-md-3 col-lg-2 gallery-img\" *ngFor=\"let imageData of collection.images\">\n          <a [href]=\"apiRoot + imageData.image\">\n            <img [src]=\"apiRoot+imageData.image_thumbnail\" class=\"img-thumbnail mb-4 position-relative\">\n          </a>\n          <button class=\"btn btn-danger btn-sm rounded-0 position-absolute delete-btn\" (click)=\"deleteImage(imageData)\">\n            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-trash\" viewBox=\"0 0 16 16\">\n              <path d=\"M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z\"/>\n              <path fill-rule=\"evenodd\" d=\"M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z\"/>\n            </svg>\n          </button>\n        </div>          \n      </div>\n      <button class=\"btn btn-custom\" *ngIf=\"collection.has_more_images\"\n              routerLink=\"/images/view-images/{{collection.id}}\"\n      >\n        View More\n      </button>          \n    </div> \n    <ng-template [ngIf]=\"groupJobsInfo.indexOf(job)<groupJobsInfo.length-1\">\n      <hr/>\n    </ng-template>\n  </div>  \n</div>\n\n<div *ngIf=\"!showComponent\" class=\"text-center mt-4\">\n  {{errorMsg}}\n</div>"

/***/ }),

/***/ "./src/app/pages/jobs/associated-jobs/associated-jobs.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/pages/jobs/associated-jobs/associated-jobs.component.ts ***!
  \*************************************************************************/
/*! exports provided: AssociatedJobsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AssociatedJobsComponent", function() { return AssociatedJobsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm2015/material.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var src_app_services_api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/api.service */ "./src/app/services/api.service.ts");
/* harmony import */ var src_app_services_data_sharing_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/services/data-sharing.service */ "./src/app/services/data-sharing.service.ts");
/* harmony import */ var src_app_shared_components_confirm_job_submit_confirm_job_submit_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/shared/components/confirm-job-submit/confirm-job-submit.component */ "./src/app/shared/components/confirm-job-submit/confirm-job-submit.component.ts");
/* harmony import */ var src_app_shared_components_delete_job_modal_delete_job_modal_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/shared/components/delete-job-modal/delete-job-modal.component */ "./src/app/shared/components/delete-job-modal/delete-job-modal.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







let AssociatedJobsComponent = class AssociatedJobsComponent {
    constructor(apiService, router, activatedRoute, snackBar, dialog, dataSharingService) {
        this.apiService = apiService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this.dataSharingService = dataSharingService;
    }
    ngOnInit() {
        this.apiRoot = this.apiService.apiRoot;
        this.activatedRoute.paramMap.subscribe(params => {
            this.jobId = params.get('id');
            this.apiService.callApi(`/api/job/${this.jobId}/group-jobs/`)
                .subscribe({
                next: res => {
                    this.groupJobsInfo = res['data'];
                    this.showComponent = res['code'] == 200 && true;
                },
                error: res => {
                    this.errorMsg = res.error.errors[0];
                    this.showComponent = false;
                }
            });
        });
    }
    deleteJob() {
        this.dialog.open(src_app_shared_components_delete_job_modal_delete_job_modal_component__WEBPACK_IMPORTED_MODULE_6__["DeleteJobModalComponent"]).afterClosed()
            .subscribe(res => {
            if (res === 'confirm') {
                this.apiService.callApi(`/api/job/${this.jobId}/delete/`, 'DELETE')
                    .subscribe({
                    next: res => {
                        this.snackBar.open('Job successfully deleted', "Dismiss", {
                            duration: 3000,
                            horizontalPosition: 'right',
                            verticalPosition: 'bottom',
                            panelClass: ['snackbar-delete']
                        });
                        this.dataSharingService.changeData('jobDeleted');
                        this.apiService.callApi(`/api/job/${this.jobId}/group-jobs/`)
                            .subscribe(res => {
                            this.groupJobsInfo = res['data'];
                        });
                    },
                    error: res => console.log(res)
                });
            }
        });
    }
    jobSubmit(job) {
        let headers = { "Content-Type": "application/json" };
        this.dialog.open(src_app_shared_components_confirm_job_submit_confirm_job_submit_component__WEBPACK_IMPORTED_MODULE_5__["ConfirmJobSubmitComponent"], {
            data: {
                jobId: this.jobId
            }
        }).afterClosed()
            .subscribe(res => {
            if (res.value === 'confirm') {
                let body = {
                    "job_submit": res.checkValue,
                    "job_id": this.jobId
                };
                this.apiService.callApi(`/api/job/${this.jobId}/submit/`, 'POST', body, headers)
                    .subscribe({
                    next: res => {
                        this.snackBar.open('Job submission successful', "Dismiss", {
                            duration: 3000,
                            horizontalPosition: 'center',
                            verticalPosition: 'bottom',
                            panelClass: ['snackbar-submit']
                        });
                        this.router.navigateByUrl(`/jobs/job-description/${this.jobId}`);
                    },
                    error: res => {
                        this.jobSubmitErrors = res.error.errors;
                        window.scroll(0, 0);
                    }
                });
            }
        });
    }
};
AssociatedJobsComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-associated-jobs',
        template: __webpack_require__(/*! ./associated-jobs.component.html */ "./src/app/pages/jobs/associated-jobs/associated-jobs.component.html"),
        styles: [__webpack_require__(/*! ./associated-jobs.component.css */ "./src/app/pages/jobs/associated-jobs/associated-jobs.component.css")]
    }),
    __metadata("design:paramtypes", [src_app_services_api_service__WEBPACK_IMPORTED_MODULE_3__["ApiService"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"], _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatSnackBar"], _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialog"], src_app_services_data_sharing_service__WEBPACK_IMPORTED_MODULE_4__["DataSharingService"]])
], AssociatedJobsComponent);



/***/ }),

/***/ "./src/app/pages/jobs/job-create/job-create.component.css":
/*!****************************************************************!*\
  !*** ./src/app/pages/jobs/job-create/job-create.component.css ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/pages/jobs/job-create/job-create.component.html":
/*!*****************************************************************!*\
  !*** ./src/app/pages/jobs/job-create/job-create.component.html ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container card card-body shadow fs-14\">\n  \n  <div *ngIf=\"jobCreateErrors\" class=\"alert alert-block alert-danger\"> \n    <ul class=\"m-0\" [ngStyle]=\"{'padding-left':'20px'}\"> \n      <li *ngFor=\"let warning of jobCreateErrors\">\n        {{warning}}\n      </li> \n    </ul> \n  </div>\n\n  <h4 class=\"mb-4 text-center\">Create a new job</h4>\n  <form [formGroup]=\"jobCreateForm\" (ngSubmit)=\"submitJob()\">\n    <div class=\"row\">\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group mb-4\">\n          <label for=\"jobName\">Job name*</label>\n          <input type=\"text\" class=\"form-control border border-custom fs-14\" formControlName=\"jobName\">          \n          <small *ngIf=\"jobName.invalid && (jobName.touched || allAlerts)\"\n                  class=\"text-danger ml-1\"\n          >\n              Job name is required\n          </small>\n        </div>\n      </div>\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group mb-4\">\n          <label for=\"jobDesc\">Job description</label>\n          <input type=\"text\" class=\"form-control border border-custom fs-14\" formControlName=\"jobDesc\">\n        </div>\n      </div>\n    </div>\n  \n    <div class=\"row\">\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group mb-4\">\n          <label for=\"selectImageCollection\">Image project*</label>\n          <select multiple formControlName=\"selectImageCollection\" class=\"form-control border border-custom fs-14\">\n            <option value=\"\" [disabled]=\"true\">Choose a Image Project</option>\n            <option *ngFor=\"let collection of imageCollections\" [ngValue]=\"collection.id\">\n              {{collection.title}}\n            </option>\n          </select>\n          <small class=\"form-text text-muted\">Hold control and left-click to select mutiple. To unselect also hold control and left-click.</small>\n          <small *ngIf=\"selectImageCollection.invalid && (selectImageCollection.touched || allAlerts)\"\n                 class=\"text-danger ml-1\"\n          >\n          You need to select at least one image poject.\n          </small>\n        </div>\n      </div>\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group mb-4\">\n          <label for=\"selectGenModel\">Gen model*</label>\n          <select formControlName=\"selectGenModel\" class=\"form-control border border-custom fs-14\">\n            <option value=\"\">Choose a Generator Model</option>\n            <option *ngFor=\"let model of genModels\" [ngValue]=\"model[1]\">\n              {{model[0]}}\n            </option>\n          </select>\n          <small *ngIf=\"selectGenModel.invalid && (selectGenModel.touched || allAlerts)\"\n           class=\"text-danger ml-1\"\n          >\n          You need to select a generation model\n          </small>\n        </div>\n      </div>\n    </div>\n  \n    <div class=\"row\">\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group form-check mb-4\">\n          <input type=\"checkbox\" class=\"form-check-input\" formControlName=\"checkFocalLen\">\n          <label class=\"form-check-label\" for=\"checkFocalLen\">Force focal len calc</label>\n          <small class=\"form-text text-muted\">Calculate focal len even if sensor size exists in the database</small>\n        </div>\n      </div>\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group mb-4\">\n          <label for=\"focalLen\">Focal len</label>\n          <input type=\"text\" class=\"form-control border border-custom fs-14\" formControlName=\"focalLen\" >\n          <small class=\"form-text text-muted\">Only if force focal len calculation is false</small>\n        </div>\n      </div>\n    </div>\n  \n    <div class=\"row\">\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group mb-4\">\n          <label for=\"selectSurfaceRecon\">Surface recon*</label>\n          <select class=\"form-control border border-custom fs-14\" formControlName=\"selectSurfaceRecon\">\n            <option value=\"\">Choose Surface Recon</option>\n            <option *ngFor=\"let recon of surfaceRecons\" [ngValue]=\"recon[1]\">\n              {{recon[0]}}\n            </option>\n          </select>\n          <small *ngIf=\"selectSurfaceRecon.invalid && (selectSurfaceRecon.touched || allAlerts)\"\n           class=\"text-danger ml-1\"\n          >\n          You need to select Surface reconstruction\n          </small>\n        </div>\n      </div>\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group mb-4\">\n          <label for=\"surfaceReconDepth\">Surface recon depth*</label>\n          <input type=\"text\" class=\"form-control border border-custom fs-14\" formControlName=\"surfaceReconDepth\">\n          <small *ngIf=\"surfaceReconDepth.invalid && (surfaceReconDepth.touched || allAlerts)\"\n           class=\"text-danger ml-1\"\n          >\n          You need to select surface reconstruction depth\n          </small>\n        </div>\n      </div>\n    </div>\n  \n    <div class=\"row\">\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group form-check mb-4\">\n          <input type=\"checkbox\" class=\"form-check-input\" formControlName=\"checkSurfaceReconColor\">\n          <label class=\"form-check-label\" for=\"surfaceReconColour\">Surface recon colour</label>\n          <small class=\"form-text text-muted\">Whether or not to have colour on the surface recon ply</small>\n        </div>\n      </div>\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group mb-4\">\n          <label for=\"poissonSampleRate\">Poisson recon sample per node </label>\n          <input type=\"text\" class=\"form-control border border-custom fs-14\" formControlName=\"poissonSampleRate\">\n          <small class=\"form-text text-muted\">Only if PoissonRecon is selected</small>\n        </div>\n      </div>\n    </div>\n  \n    <div class=\"row\">\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group form-check mb-4\">\n          <input type=\"checkbox\" class=\"form-check-input\" formControlName=\"checkPoissonReconDensity\">\n          <label class=\"form-check-label\" for=\"checkPoissonReconDensity\">Poisson recon density</label>\n          <small class=\"form-text text-muted\">Only if PoissonRecon is selected. Select to output density if you wish to trim</small>\n        </div>\n      </div>\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group mb-4\">\n          <label for=\"ssdReconDegree\">Ssd recon degree</label>\n          <input type=\"text\" class=\"form-control border border-custom fs-14\" formControlName=\"ssdReconDegree\">\n          <small class=\"form-text text-muted\">Only if SSDRecon is selected</small>\n        </div>\n      </div>\n    </div>\n  \n    <div class=\"row\">\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group form-check mb-4\">\n          <input type=\"checkbox\" class=\"form-check-input\" formControlName=\"checkSurfaceTrim\">\n          <label class=\"form-check-label\" for=\"checkSurfaceTrim\">Surface trim</label>\n          <small class=\"form-text text-muted\">Trim surface? Only valid for Poisson reconstruction with density output</small>\n        </div>\n      </div>\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group mb-4\">\n          <label for=\"surfaceTrimThreshold\">Surface trim trim threshold</label>\n          <input type=\"text\" class=\"form-control border border-custom fs-14\" formControlName=\"surfaceTrimThreshold\">\n          <small class=\"form-text text-muted\">Only if Surface trim is selected</small>\n        </div>\n      </div>\n    </div>\n  \n    <div class=\"row\">\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group form-check mb-4\">\n          <input type=\"checkbox\" class=\"form-check-input\" formControlName=\"checkPolygonMesh\">\n          <label class=\"form-check-label\" for=\"checkPolygonMesh\">Surface trim polygon mesh</label>\n          <small class=\"form-text text-muted\">Only if Surface trim is selected</small>\n        </div>\n      </div>\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group mb-4\">\n          <label for=\"surfaceTrimSmooth\">Surface trim smooth</label>\n            <input type=\"text\" class=\"form-control border border-custom fs-14\" formControlName=\"surfaceTrimSmooth\">\n          <small class=\"form-text text-muted\">Only if Surface trim is selected</small>\n        </div>\n      </div>\n    </div>\n  \n    <div class=\"row\">\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group mb-4\">\n          <label for=\"jobNote\">Job note</label>\n          <input type=\"text\" class=\"form-control border border-custom fs-14\" formControlName=\"jobNote\">\n        </div>\n      </div>\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group mb-4\">\n          <label for=\"selectJobPriority\">Job priority*</label>\n          <select class=\"form-control border border-custom fs-14\" formControlName=\"selectJobPriority\">\n            <option value=\"\">Choose Job Priority</option>\n            <option *ngFor=\"let jobPriority of jobPriorities\" [ngValue]=\"jobPriority[1]\">\n              {{jobPriority[0]}}\n            </option>\n          </select>\n          <small *ngIf=\"selectJobPriority.invalid && (selectJobPriority.touched || allAlerts)\"\n                  class=\"text-danger ml-1\"\n          >\n          You need to select a job priority\n          </small>\n        </div>\n      </div>\n    </div>\n    <div class=\"row\">\n      <button type=\"submit\" class=\"btn btn-outline-custom w-25 mx-auto my-4\">\n        Create\n      </button>\n    </div>\n  </form>    \n</div>\n"

/***/ }),

/***/ "./src/app/pages/jobs/job-create/job-create.component.ts":
/*!***************************************************************!*\
  !*** ./src/app/pages/jobs/job-create/job-create.component.ts ***!
  \***************************************************************/
/*! exports provided: JobCreateComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JobCreateComponent", function() { return JobCreateComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var src_app_services_api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/api.service */ "./src/app/services/api.service.ts");
/* harmony import */ var src_app_services_data_sharing_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/services/data-sharing.service */ "./src/app/services/data-sharing.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





let JobCreateComponent = class JobCreateComponent {
    constructor(apiService, fb, router, dataSharingService) {
        this.apiService = apiService;
        this.fb = fb;
        this.router = router;
        this.dataSharingService = dataSharingService;
        this.genModels = [['Global', 'GLB'], ['Sequential', 'SEQ']];
        this.surfaceRecons = [['Poisson Reconstruction', 'PR'], ['SSD Reconstruction', 'SR']];
        this.jobPriorities = [['High', 'H'], ['Medium', 'M'], ['Low', 'L']];
        this.allAlerts = false;
        this.headers = {
            "Content-Type": "application/json"
        };
    }
    ngOnInit() {
        this.jobCreateForm = this.fb.group({
            jobName: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].minLength(1)]],
            jobDesc: [''],
            selectImageCollection: [[], [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]],
            selectGenModel: ['GLB', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]],
            checkFocalLen: [true],
            focalLen: [''],
            selectSurfaceRecon: ['PR', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]],
            surfaceReconDepth: ['10', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]],
            checkSurfaceReconColor: [true],
            poissonSampleRate: ['1.0'],
            checkPoissonReconDensity: [false],
            ssdReconDegree: ['2'],
            checkSurfaceTrim: [false],
            surfaceTrimThreshold: ['0.5'],
            checkPolygonMesh: [false],
            surfaceTrimSmooth: ['5'],
            jobNote: [''],
            selectJobPriority: ['M', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]]
        });
        this.apiService.callApi('/api/job/create/', 'GET')
            .subscribe(res => {
            let data = res['data'];
            this.imageCollections = res['data'].userImagesCollection;
            //  this.jobCreateForm.patchValue({
            //    selectGenModel:data.gen_model,
            //    checkFocalLen:data.force_focal_len_calc,
            //    selectSurfaceRecon:data.surface_recon,
            //     surfaceReconDepth:data.surface_recon_depth,
            //     checkSurfaceReconColor:data.surface_recon_colour,
            //     poissonSampleRate:data.poisson_recon_sample_per_node,          
            //     ssdReconDegree:data.ssd_recon_degree,          
            //     surfaceTrimThreshold:data.surface_trim_trim_threshold,          
            //     surfaceTrimSmooth:data.surface_trim_smooth,          
            //     selectJobPriority:data.job_priority
            //  })
            //  this.jobCreateForm.updateValueAndValidity()
        });
        this.dataSharingService.getData().subscribe(res => {
            if (res.imageId) {
                this.jobCreateForm.patchValue({
                    selectImageCollection: [+res.imageId]
                });
                this.jobCreateForm.updateValueAndValidity();
            }
        });
    }
    get jobName() {
        return this.jobCreateForm.get('jobName');
    }
    get selectImageCollection() {
        return this.jobCreateForm.get('selectImageCollection');
    }
    get selectGenModel() {
        return this.jobCreateForm.get('selectGenModel');
    }
    get selectSurfaceRecon() {
        return this.jobCreateForm.get('selectSurfaceRecon');
    }
    get surfaceReconDepth() {
        return this.jobCreateForm.get('surfaceReconDepth');
    }
    get selectJobPriority() {
        return this.jobCreateForm.get('selectJobPriority');
    }
    submitJob() {
        if (this.jobCreateForm.invalid) {
            this.allAlerts = true;
            return null;
        }
        this.payloadData = {
            job_name: this.jobCreateForm.value.jobName,
            job_description: this.jobCreateForm.value.jobDesc,
            userImagesCollection: this.jobCreateForm.value.selectImageCollection,
            gen_model: this.jobCreateForm.value.selectGenModel,
            force_focal_len_calc: this.jobCreateForm.value.checkFocalLen,
            focal_len: this.jobCreateForm.value.focalLen,
            surface_recon: this.jobCreateForm.value.selectSurfaceRecon,
            surface_recon_depth: this.jobCreateForm.value.surfaceReconDepth,
            surface_recon_colour: this.jobCreateForm.value.checkSurfaceReconColor,
            poisson_recon_sample_per_node: this.jobCreateForm.value.poissonSampleRate,
            poisson_recon_density: this.jobCreateForm.value.checkPoissonReconDensity,
            ssd_recon_degree: this.jobCreateForm.value.ssdReconDegree,
            surface_trim: this.jobCreateForm.value.checkSurfaceTrim,
            surface_trim_trim_threshold: this.jobCreateForm.value.surfaceTrimThreshold,
            surface_trim_polygon_mesh: this.jobCreateForm.value.checkPolygonMesh,
            surface_trim_smooth: this.jobCreateForm.value.surfaceTrimSmooth,
            job_note: this.jobCreateForm.value.jobNote,
            job_priority: this.jobCreateForm.value.selectJobPriority
        };
        this.apiService.callApi('/api/job/create/', 'POST', JSON.stringify(this.payloadData), this.headers)
            .subscribe({
            next: res => {
                this.dataSharingService.changeData('jobCreated');
                this.router.navigate([`/jobs/job-description/${res['data'].job_id}`]);
            },
            error: res => {
                this.jobCreateErrors = res.error.errors;
                window.scroll(0, 0);
            }
        });
    }
};
JobCreateComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-job-create',
        template: __webpack_require__(/*! ./job-create.component.html */ "./src/app/pages/jobs/job-create/job-create.component.html"),
        styles: [__webpack_require__(/*! ./job-create.component.css */ "./src/app/pages/jobs/job-create/job-create.component.css")]
    }),
    __metadata("design:paramtypes", [src_app_services_api_service__WEBPACK_IMPORTED_MODULE_3__["ApiService"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"], src_app_services_data_sharing_service__WEBPACK_IMPORTED_MODULE_4__["DataSharingService"]])
], JobCreateComponent);



/***/ }),

/***/ "./src/app/pages/jobs/job-description/job-description.component.css":
/*!**************************************************************************!*\
  !*** ./src/app/pages/jobs/job-description/job-description.component.css ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/pages/jobs/job-description/job-description.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/pages/jobs/job-description/job-description.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ng-template [ngIf]=\"showComponent\">\n  <div class=\"container\">\n\n    <div *ngIf=\"jobSubmitErrors\" class=\"alert alert-block alert-danger\"> \n      <ul class=\"m-0\" [ngStyle]=\"{'padding-left':'20px'}\"> \n        <li *ngFor=\"let warning of jobSubmitErrors\">\n          {{warning}}\n        </li> \n      </ul> \n    </div>\n    \n    <div class=\"card shadow\">\n      <div class=\"card-header\">\n        <div class=\"row d-flex justify-content-center\">\n          <button name=\"jobDeleteBtn\" (click)=\"deleteJob()\" name=\"deleteBtn\" type=\"submit\" class=\"btn btn-outline-danger mx-1 mx-md-3 my-2\">\n            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-trash\" viewBox=\"0 0 16 16\">\n              <path d=\"M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z\"/>\n              <path fill-rule=\"evenodd\" d=\"M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z\"/>\n            </svg>\n            Delete\n          </button>\n          <button name=\"jobModifyBtn\" routerLink=\"/jobs/update-job/{{jobId}}\" type=\"submit\" class=\"btn btn-outline-custom mx-1 mx-md-3 my-2\">\n            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-pencil\" viewBox=\"0 0 16 16\">\n              <path d=\"M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5L13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175l-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z\"/>\n            </svg>\n            Modify\n          </button>\n          <button name=\"jobSubmitBtn\" type=\"submit\" (click)=\"jobSubmit()\" \n                  class=\"btn btn-outline-custom mx-1 mx-md-3 my-2\"\n          >\n            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-box-arrow-in-right\" viewBox=\"0 0 16 16\">\n              <path fill-rule=\"evenodd\" d=\"M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z\"/>\n              <path fill-rule=\"evenodd\" d=\"M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z\"/>\n            </svg>\n            Submit\n          </button>\n          <button name=\"associatedJobsBtn\" type=\"submit\" class=\"btn btn-outline-custom mx-1 mx-md-3 my-2\"\n                  *ngIf=\"jobInfo.is_group_job_head\" routerLink=\"/jobs/associated-jobs/{{jobId}}\"\n          >            \n            Associated Jobs\n          </button>\n        </div>\n        <div *ngIf=\"jobInfo.is_group_job_head\" [ngStyle]=\"{'text-align':'center','margin-top':'5px'}\"> \n          <mark [ngStyle]=\"{'background':'#fcf8e3','padding-left':'10px'}\">(This is a group job, Click Associated Jobs for Status and PLY files)</mark>\n        </div>\n      </div>\n      \n      <div class=\"card-body\">\n        <table class=\"table table-hover mb-4\">\n          <tbody>\n            <tr *ngIf=\"jobInfo.job_meta\">\n              <td scope=\"row\">Remote job processor status</td>\n              <td>:</td>\n              <td>{{jobInfo.host_job_status}}</td>\n            </tr>\n            <tr *ngIf=\"jobInfo.job_meta\">\n              <td scope=\"row\">Remote job queue</td>\n              <td>:</td>\n              <td>{{jobInfo.host_job_queue}}</td>\n            </tr>\n            <tr>\n              <td scope=\"row\">Job name</td>\n              <td>:</td>\n              <td>{{jobInfo.job_name}}</td>\n            </tr>\n            <tr>\n              <td scope=\"row\">Job Submited?</td>\n              <td>:</td>\n              <td>{{jobInfo.job_submit}}</td>\n            </tr>\n            <tr *ngIf=\"!jobInfo.is_group_job_head\">\n              <td scope=\"row\">Job Status code</td>\n              <td>:</td>\n              <td>\n                {{jobInfo.job_status}}<br/>\n                ({{jobInfo.job_status_message}})\n              </td>\n            </tr>            \n            <!-- <tr *ngIf=\"jobInfo.job_meta\">\n              <td scope=\"row\">remote job processing status</td>\n              <td>:</td>\n              <td></td>\n            </tr> -->\n            <tr>\n              <td scope=\"row\">Job description</td>\n              <td>:</td>\n              <td>{{jobInfo.job_description}}</td>\n            </tr>\n            <tr>\n              <td scope=\"row\">Generator Model</td>\n              <td>:</td>\n              <td>{{jobInfo.gen_model}}</td>\n            </tr>\n            <tr>\n              <td scope=\"row\">Force calculate focal length</td>\n              <td>:</td>\n              <td>{{jobInfo.force_focal_len_calc}}</td>\n            </tr>\n            <tr>\n              <td scope=\"row\">Focal length</td>\n              <td>:</td>\n              <td>{{jobInfo.focal_len}}</td>\n            </tr>\n            <tr>\n              <td scope=\"row\">Reconstruct surface using</td>\n              <td>:</td>\n              <td>{{jobInfo.surface_recon}}</td>\n            </tr>\n            <tr>\n              <td scope=\"row\">Poisson recon sample per node</td>\n              <td>:</td>\n              <td>{{jobInfo.poisson_recon_sample_per_node}}</td>\n            </tr>\n            <tr>\n              <td scope=\"row\">Use Poisson recon density?</td>\n              <td>:</td>\n              <td>{{jobInfo.poisson_recon_density}}</td>\n            </tr>\n            <tr>\n              <td scope=\"row\">SSD recon degree</td>\n              <td>:</td>\n              <td>{{jobInfo.ssd_recon_degree}}</td>\n            </tr>\n            <tr>\n              <td scope=\"row\">Surface trim?</td>\n              <td>:</td>\n              <td>{{jobInfo.surface_trim}}</td>\n            </tr>\n            <tr>\n              <td scope=\"row\">Use polygon mesh for surface trimming?</td>\n              <td>:</td>\n              <td>{{jobInfo.surface_trim_polygon_mesh}}</td>\n            </tr>\n            <tr>\n              <td scope=\"row\">Smooth parameter for surface trim</td>\n              <td>:</td>\n              <td>{{jobInfo.surface_trim_smooth}}</td>\n            </tr>\n            <tr>\n              <td scope=\"row\">Job note</td>\n              <td>:</td>\n              <td>{{jobInfo.job_note}}</td>\n            </tr>\n            <tr>\n              <td scope=\"row\">Job priority level</td>\n              <td>:</td>\n              <td>{{jobInfo.job_priority}}</td>\n            </tr>\n            <tr>\n              <td scope=\"row\">Job created</td>\n              <td>:</td>\n              <td>{{jobInfo.job_date_created}}</td>\n            </tr>\n            <tr>\n              <td scope=\"row\">Job updated</td>\n              <td>:</td>\n              <td>{{jobInfo.job_date_updated}}</td>\n            </tr>\n            <tr>\n              <td scope=\"row\">Job finished?</td>\n              <td>:</td>\n              <td>{{jobInfo.job_finished}}</td>\n            </tr>\n          </tbody>\n        </table>      \n\n        <div *ngIf=\"jobInfo.ply_files.length>0\" class=\"mb-4\">\n          <p><strong>Associated Model Files: </strong></p>\n          <p class=\"container row\" *ngFor=\"let file of jobInfo.ply_files\">\n            <span class=\"mr-1\">\n              {{jobInfo.ply_files.indexOf(file)+1+'.'}}\n            </span>            \n            <a href={{apiRoot+file.path}}>\n              {{file.title}}\n            </a>            \n          </p>\n        </div>\n\n        <div *ngFor=\"let collection of jobInfo.userImagesCollection\" class=\"mb-4\">        \n          <p><strong>Image Project Name: </strong>{{collection.title}}</p>\n          <p><strong>Image Project Uploaded Date: </strong>{{collection.date_uploaded}}</p>                  \n          <div class=\"row\">            \n            <div class=\"col-6 col-md-3 col-lg-2 gallery-img\" *ngFor=\"let imageData of collection.images\">\n              <a [href]=\"apiRoot + imageData.image\">\n                <img [src]=\"apiRoot+imageData.image_thumbnail\" class=\"img-thumbnail mb-4 position-relative\">\n              </a>\n              <button class=\"btn btn-danger btn-sm rounded-0 position-absolute delete-btn\" (click)=\"deleteImage(imageData)\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-trash\" viewBox=\"0 0 16 16\">\n                  <path d=\"M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z\"/>\n                  <path fill-rule=\"evenodd\" d=\"M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z\"/>\n                </svg>\n              </button>\n            </div>          \n          </div>\n          <button class=\"btn btn-custom\" *ngIf=\"collection.has_more_images\"\n                  routerLink=\"/images/view-images/{{collection.id}}\"\n          >\n            View More\n          </button>          \n        </div>                            \n      </div>  \n    </div>\n  </div>\n</ng-template>\n\n<div *ngIf=\"!showComponent\" class=\"text-center mt-4\">\n  {{errorMsg}}\n</div>\n"

/***/ }),

/***/ "./src/app/pages/jobs/job-description/job-description.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/pages/jobs/job-description/job-description.component.ts ***!
  \*************************************************************************/
/*! exports provided: JobDescriptionComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JobDescriptionComponent", function() { return JobDescriptionComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm2015/material.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var src_app_services_api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/api.service */ "./src/app/services/api.service.ts");
/* harmony import */ var src_app_services_data_sharing_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/services/data-sharing.service */ "./src/app/services/data-sharing.service.ts");
/* harmony import */ var src_app_shared_components_confirm_job_submit_confirm_job_submit_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/shared/components/confirm-job-submit/confirm-job-submit.component */ "./src/app/shared/components/confirm-job-submit/confirm-job-submit.component.ts");
/* harmony import */ var src_app_shared_components_delete_image_modal_delete_image_modal_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/shared/components/delete-image-modal/delete-image-modal.component */ "./src/app/shared/components/delete-image-modal/delete-image-modal.component.ts");
/* harmony import */ var src_app_shared_components_delete_job_modal_delete_job_modal_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/shared/components/delete-job-modal/delete-job-modal.component */ "./src/app/shared/components/delete-job-modal/delete-job-modal.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








let JobDescriptionComponent = class JobDescriptionComponent {
    constructor(activatedRoute, apiService, router, snackBar, dialog, dataSharingService) {
        this.activatedRoute = activatedRoute;
        this.apiService = apiService;
        this.router = router;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this.dataSharingService = dataSharingService;
        this.hPos = 'right';
        this.vPos = 'bottom';
        this.apiRoot = this.apiService.apiRoot;
    }
    ngOnInit() {
        this.activatedRoute.paramMap.subscribe(params => {
            this.jobSubmitErrors = "";
            this.jobId = params.get('id');
            this.apiService.callApi(`/api/job/${params.get('id')}/details/`)
                .subscribe({
                next: res => {
                    this.jobInfo = res['data'];
                    this.showComponent = res['code'] == 200 && true;
                },
                error: res => {
                    this.errorMsg = res.error.errors[0];
                    this.showComponent = false;
                }
            });
        });
    }
    jobSubmit() {
        let headers = { "Content-Type": "application/json" };
        this.dialog.open(src_app_shared_components_confirm_job_submit_confirm_job_submit_component__WEBPACK_IMPORTED_MODULE_5__["ConfirmJobSubmitComponent"], {
            data: {
                jobId: this.jobId
            }
        }).afterClosed()
            .subscribe(res => {
            if (res.value === 'confirm') {
                let body = {
                    "job_submit": res.checkValue,
                    "job_id": this.jobId
                };
                this.apiService.callApi(`/api/job/${this.jobId}/submit/`, 'POST', body, headers)
                    .subscribe({
                    next: res => {
                        this.snackBar.open('Job submission successful', "Dismiss", {
                            duration: 3000,
                            horizontalPosition: this.hPos,
                            verticalPosition: this.vPos,
                            panelClass: ['snackbar-submit']
                        });
                        this.apiService.callApi(`/api/job/${this.jobId}/details`)
                            .subscribe({
                            next: res => {
                                this.showComponent = res['code'] == 200 && true;
                                this.jobInfo = res['data'];
                            },
                            error: res => {
                                this.errorMsg = res.error.errors[0];
                                this.showComponent = false;
                            }
                        });
                    },
                    error: res => {
                        if (res['status'] == 400) {
                            this.jobSubmitErrors = res.error.errors;
                        }
                        else {
                            this.errorMsg = res.error.errors[0];
                            this.showComponent = false;
                        }
                    }
                });
            }
        });
    }
    deleteJob() {
        this.dialog.open(src_app_shared_components_delete_job_modal_delete_job_modal_component__WEBPACK_IMPORTED_MODULE_7__["DeleteJobModalComponent"]).afterClosed()
            .subscribe(res => {
            if (res === 'confirm') {
                this.apiService.callApi(`/api/job/${this.jobId}/delete/`, 'DELETE')
                    .subscribe({
                    next: res => {
                        this.snackBar.open('Job successfully deleted', "Dismiss", {
                            duration: 3000,
                            horizontalPosition: this.hPos,
                            verticalPosition: this.vPos,
                            panelClass: ['snackbar-delete']
                        });
                        this.dataSharingService.changeData(`jobDeleted`);
                        this.router.navigate([`/jobs`]);
                    },
                    error: res => {
                        this.snackBar.open(res.error.errors[0] + '!', "", {
                            duration: 1000,
                            horizontalPosition: 'center',
                            verticalPosition: 'bottom',
                            panelClass: ['alert-warning', 'text-dark', 'snackbar-delete-denied']
                        });
                    }
                });
            }
        });
    }
    deleteImage(imageData) {
        this.dialog.open(src_app_shared_components_delete_image_modal_delete_image_modal_component__WEBPACK_IMPORTED_MODULE_6__["DeleteImageModalComponent"]).afterClosed()
            .subscribe(res => {
            if (res === 'confirm') {
                this.apiService.callApi(`/api/image-collection/image/${imageData.id}/delete/`, 'DELETE')
                    .subscribe({
                    next: res => {
                        this.snackBar.open('Image successfully deleted', "Dismiss", {
                            duration: 3000,
                            horizontalPosition: this.hPos,
                            verticalPosition: this.vPos,
                            panelClass: ['snackbar-delete']
                        });
                        this.apiService.callApi(`/api/job/${this.jobId}/details/`)
                            .subscribe({
                            next: res => {
                                this.jobInfo = res['data'];
                            },
                            error: res => console.log(res)
                        });
                        this.dataSharingService.changeData('imageDeleted');
                    },
                    error: res => {
                        this.snackBar.open(res.error.errors[0] + '!', "", {
                            duration: 1000,
                            horizontalPosition: 'center',
                            verticalPosition: 'bottom',
                            panelClass: ['alert-warning', 'text-dark', 'snackbar-delete-denied']
                        });
                    }
                });
            }
        });
    }
};
JobDescriptionComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-job-description',
        template: __webpack_require__(/*! ./job-description.component.html */ "./src/app/pages/jobs/job-description/job-description.component.html"),
        styles: [__webpack_require__(/*! ./job-description.component.css */ "./src/app/pages/jobs/job-description/job-description.component.css")]
    }),
    __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"], src_app_services_api_service__WEBPACK_IMPORTED_MODULE_3__["ApiService"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"], _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatSnackBar"], _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialog"], src_app_services_data_sharing_service__WEBPACK_IMPORTED_MODULE_4__["DataSharingService"]])
], JobDescriptionComponent);



/***/ }),

/***/ "./src/app/pages/jobs/job-update/job-update.component.css":
/*!****************************************************************!*\
  !*** ./src/app/pages/jobs/job-update/job-update.component.css ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/pages/jobs/job-update/job-update.component.html":
/*!*****************************************************************!*\
  !*** ./src/app/pages/jobs/job-update/job-update.component.html ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container card card-body shadow fs-14\" *ngIf=\"showComponent\">\n  <div *ngIf=\"updateSubmitErrors\" class=\"alert alert-block alert-danger\"> \n    <ul class=\"m-0\" [ngStyle]=\"{'padding-left':'20px'}\"> \n      <li *ngFor=\"let warning of updateSubmitErrors\">\n        {{warning}}\n      </li> \n    </ul> \n  </div>\n  <h4 class=\"mb-4 text-center alert\">Edit job</h4>\n  <form [formGroup]=\"jobUpdateForm\" (ngSubmit)=\"updateJob()\">\n    <div class=\"row\">\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group mb-4\">\n          <label for=\"jobName\">Job Name*</label>\n          <input formControlName=\"jobName\" type=\"text\" class=\"form-control border border-custom fs-14\" placeholder=\"Enter job name\">\n          <small *ngIf=\"jobName.invalid && (jobName.touched || allAlerts)\"\n                  class=\"text-danger ml-1\"\n          >\n              Job name is required\n          </small>\n        </div>\n      </div>\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group mb-4\">\n          <label for=\"jobDesc\">Job Description</label>\n          <input type=\"text\" class=\"form-control border border-custom fs-14\" formControlName=\"jobDesc\" placeholder=\"Enter job description\">\n        </div>\n      </div>\n    </div>\n\n    <div class=\"row\">\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group mb-4\">\n          <label for=\"selectImageCollection\">Image Project</label>\n          <select formControlName=\"selectImageCollection\" multiple class=\"form-control border border-custom fs-14\">            \n            <option *ngFor=\"let collection of imageCollections\" [ngValue]=\"collection.id\">\n              {{collection.title}}\n            </option>\n          </select>\n          <small class=\"form-text text-muted\">Hold control and left-click to select mutiple. To unselect also hold control and left-click.</small>          \n          <small *ngIf=\"selectImageCollection.invalid && (selectImageCollection.touched || allAlerts)\"\n                 class=\"text-danger ml-1\"\n          >\n          You need to select at least one image poject.\n          </small>\n        </div>\n      </div>\n\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group mb-4\">\n          <label for=\"selectGenModel\">Gen model*</label>\n          <select formControlName=\"selectGenModel\" class=\"form-control border border-custom fs-14\">            \n            <option *ngFor=\"let model of genModels\" [ngValue]=\"model[1]\">\n              {{model[0]}}\n            </option>\n          </select>\n          <small *ngIf=\"selectGenModel.invalid && (selectGenModel.touched || allAlerts)\"\n           class=\"text-danger ml-1\"\n          >\n          You need to select a generation model\n          </small>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"row\">\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group form-check mb-4\">\n          <input formControlName=\"checkFocalLen\" type=\"checkbox\" class=\"form-check-input\">\n          <label class=\"form-check-label\" for=\"checkFocalLen\">Force focal len calc</label>\n          <small class=\"form-text text-muted\">Calculate focal len even if sensor size exists in the database</small>\n        </div>\n      </div>\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group mb-4\">\n          <label for=\"focalLen\">Focal Len</label>\n          <input formControlName=\"focalLen\" type=\"text\" class=\"form-control border border-custom fs-14\">\n          <small class=\"form-text text-muted\">Only if force focal len calculation is false</small>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"row\">\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group mb-4\">\n          <label for=\"selectSurfaceRecon\">Surface recon*</label>\n          <select formControlName=\"selectSurfaceRecon\" class=\"form-control border border-custom fs-14\">            \n            <option *ngFor=\"let recon of surfaceRecons\" [ngValue]=\"recon[1]\">\n              {{recon[0]}}\n            </option>\n          </select>\n          <small *ngIf=\"selectSurfaceRecon.invalid && (selectSurfaceRecon.touched || allAlerts)\"\n           class=\"text-danger ml-1\"\n          >\n          You need to select Surface reconstruction\n          </small>\n        </div>\n      </div>\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group mb-4\">\n          <label for=\"surfaceReconDepth\">Surface recon depth*</label>\n          <input formControlName=\"surfaceReconDepth\" type=\"text\" class=\"form-control border border-custom fs-14\">\n          <small *ngIf=\"surfaceReconDepth.invalid && (surfaceReconDepth.touched || allAlerts)\"\n           class=\"text-danger ml-1\"\n          >\n          You need to select surface reconstruction depth\n          </small>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"row\">\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group form-check mb-4\">\n          <input formControlName=\"checkSurfaceReconColor\" type=\"checkbox\" class=\"form-check-input\">\n          <label class=\"form-check-label\" for=\"checkSurfaceReconColor\">Surface recon colour</label>\n          <small class=\"form-text text-muted\">Whether or not to have colour on the surface recon ply</small>\n        </div>\n      </div>\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group mb-4\">\n          <label for=\"poissonSampleRate\">Poisson recon sample per node </label>\n          <input formControlName=\"poissonSampleRate\" type=\"text\" class=\"form-control border border-custom fs-14\">\n          <small class=\"form-text text-muted\">Only if PoissonRecon is selected</small>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"row\">\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group form-check mb-4\">\n          <input formControlName=\"checkPoissonReconDensity\" type=\"checkbox\" class=\"form-check-input\">\n          <label class=\"form-check-label\" for=\"checkPoissonReconDensity\">Poisson recon density</label>\n          <small class=\"form-text text-muted\">Only if PoissonRecon is selected. Select to output density if you wish to trim</small>\n        </div>\n      </div>\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group mb-4\">\n          <label for=\"ssdReconDegree\">Ssd recon degree</label>\n          <input formControlName=\"ssdReconDegree\" type=\"text\" class=\"form-control border border-custom fs-14\">\n          <small class=\"form-text text-muted\">Only if SSDRecon is selected</small>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"row\">\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group form-check mb-4\">\n          <input formControlName=\"checkSurfaceTrim\" type=\"checkbox\" class=\"form-check-input\">\n          <label class=\"form-check-label\" for=\"checkSurfaceTrim\">Surface trim</label>\n          <small class=\"form-text text-muted\">Trim surface? Only valid for Poisson reconstruction with density output</small>\n        </div>\n      </div>\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group mb-4\">\n          <label for=\"surfaceTrimThreshold\">Surface trim threshold</label>\n          <input formControlName=\"surfaceTrimThreshold\" type=\"text\" class=\"form-control border border-custom fs-14\">\n          <small class=\"form-text text-muted\">Only if Surface trim is selected</small>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"row\">\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group form-check mb-4\">\n          <input formControlName=\"checkPolygonMesh\" type=\"checkbox\" class=\"form-check-input\">\n          <label class=\"form-check-label\" for=\"checkPolygonMesh\">Surface trim polygon mesh</label>\n          <small class=\"form-text text-muted\">Only if Surface trim is selected</small>\n        </div>\n      </div>\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group mb-4\">\n          <label for=\"surfaceTrimSmooth\">Surface trim smooth</label>\n          <input formControlName=\"surfaceTrimSmooth\" type=\"text\" class=\"form-control border border-custom fs-14\">\n          <small class=\"form-text text-muted\">Only if Surface trim is selected</small>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"row\">\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group mb-4\">\n          <label for=\"jobNote\">Job Note</label>\n          <input formControlName=\"jobNote\" type=\"text\" class=\"form-control border border-custom fs-14\" placeholder=\"Enter a job note\">\n        </div>\n      </div>\n      <div class=\"col-12 col-md-6\">\n        <div class=\"form-group mb-4\">\n          <label for=\"selectJobPriority\">Job priority*</label>\n          <select formControlName=\"selectJobPriority\" class=\"form-control border border-custom fs-14\">            \n            <option *ngFor=\"let jobPriority of jobPriorities\" [ngValue]=\"jobPriority[1]\">\n              {{jobPriority[0]}}\n            </option>\n          </select>\n          <small *ngIf=\"selectJobPriority.invalid && (selectJobPriority.touched || allAlerts)\"\n                  class=\"text-danger ml-1\"\n          >\n          You need to select a job priority\n          </small>          \n        </div>\n      </div>\n    </div>\n    <div class=\"row\">\n      <button type=\"submit\" class=\"btn btn-outline-custom w-25 mx-auto my-4\">\n        Update\n      </button>\n    </div>\n  </form>\n</div>\n\n<div *ngIf=\"!showComponent\" class=\"text-center mt-4\">\n  {{errorMsg}}\n</div>\n\n\n\n"

/***/ }),

/***/ "./src/app/pages/jobs/job-update/job-update.component.ts":
/*!***************************************************************!*\
  !*** ./src/app/pages/jobs/job-update/job-update.component.ts ***!
  \***************************************************************/
/*! exports provided: JobUpdateComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JobUpdateComponent", function() { return JobUpdateComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var src_app_services_api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/api.service */ "./src/app/services/api.service.ts");
/* harmony import */ var src_app_services_data_sharing_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/services/data-sharing.service */ "./src/app/services/data-sharing.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





let JobUpdateComponent = class JobUpdateComponent {
    constructor(apiService, fb, router, activatedRoute, dataSharingService) {
        this.apiService = apiService;
        this.fb = fb;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.dataSharingService = dataSharingService;
        this.genModels = [['Global', 'GLB'], ['Sequential', 'SEQ']];
        this.surfaceRecons = [['Poisson Reconstruction', 'PR'], ['SSD Reconstruction', 'SR']];
        this.jobPriorities = [['High', 'H'], ['Medium', 'M'], ['Low', 'L']];
        this.allAlerts = false;
        this.headers = {
            "Content-Type": "application/json"
        };
    }
    filterItem(itemsArray, value) {
        return itemsArray.filter(item => item[1] === value);
    }
    ngOnInit() {
        this.activatedRoute.paramMap.subscribe(params => {
            this.updateSubmitErrors = "";
            this.jobId = params.get('id');
            this.jobUpdateForm = this.fb.group({
                jobName: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].minLength(1)]],
                jobDesc: [''],
                selectImageCollection: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]],
                selectGenModel: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]],
                checkFocalLen: [false],
                focalLen: [''],
                selectSurfaceRecon: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]],
                surfaceReconDepth: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]],
                checkSurfaceReconColor: [false],
                poissonSampleRate: [''],
                checkPoissonReconDensity: [false],
                ssdReconDegree: [''],
                checkSurfaceTrim: [false],
                surfaceTrimThreshold: [''],
                checkPolygonMesh: [false],
                surfaceTrimSmooth: [''],
                jobNote: [''],
                selectJobPriority: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]]
            });
            this.apiService.callApi(`/api/job/${this.jobId}/update/`, 'GET')
                .subscribe({
                next: res => {
                    this.showComponent = res['code'] == 200 && true;
                    let data = res['data'];
                    this.imageCollections = data.userImagesCollection;
                    let selectedImages = this.imageCollections.filter(item => item.selected === true).map(item => item.id);
                    this.jobUpdateForm.patchValue({
                        jobName: data.job_name,
                        jobDesc: data.job_description,
                        selectImageCollection: selectedImages,
                        selectGenModel: data.gen_model,
                        checkFocalLen: data.force_focal_len_calc,
                        focalLen: data.focal_len,
                        selectSurfaceRecon: data.surface_recon,
                        surfaceReconDepth: data.surface_recon_depth,
                        checkSurfaceReconColor: data.surface_recon_colour,
                        poissonSampleRate: data.poisson_recon_sample_per_node,
                        checkPoissonReconDensity: data.poisson_recon_density,
                        ssdReconDegree: data.ssd_recon_degree,
                        checkSurfaceTrim: data.surface_trim,
                        surfaceTrimThreshold: data.surface_trim_trim_threshold,
                        checkPolygonMesh: data.surface_trim_polygon_mesh,
                        surfaceTrimSmooth: data.surface_trim_smooth,
                        jobNote: data.job_note,
                        selectJobPriority: data.job_priority
                    });
                    this.jobUpdateForm.updateValueAndValidity();
                },
                error: res => {
                    this.errorMsg = res.error.errors[0];
                    this.showComponent = false;
                }
            });
            this.jobUpdateForm.controls['checkSurfaceReconColor'].disable();
        });
    }
    get jobName() {
        return this.jobUpdateForm.get('jobName');
    }
    get selectImageCollection() {
        return this.jobUpdateForm.get('selectImageCollection');
    }
    get selectGenModel() {
        return this.jobUpdateForm.get('selectGenModel');
    }
    get selectSurfaceRecon() {
        return this.jobUpdateForm.get('selectSurfaceRecon');
    }
    get surfaceReconDepth() {
        return this.jobUpdateForm.get('surfaceReconDepth');
    }
    get selectJobPriority() {
        return this.jobUpdateForm.get('selectJobPriority');
    }
    updateJob() {
        if (this.jobUpdateForm.invalid) {
            this.allAlerts = true;
            return null;
        }
        let payloadData = {
            job_name: this.jobUpdateForm.value.jobName,
            job_description: this.jobUpdateForm.value.jobDesc,
            userImagesCollection: this.jobUpdateForm.value.selectImageCollection,
            gen_model: this.jobUpdateForm.value.selectGenModel,
            force_focal_len_calc: this.jobUpdateForm.value.checkFocalLen,
            focal_len: this.jobUpdateForm.value.focalLen,
            surface_recon: this.jobUpdateForm.value.selectSurfaceRecon,
            surface_recon_depth: this.jobUpdateForm.value.surfaceReconDepth,
            surface_recon_colour: this.jobUpdateForm.value.checkSurfaceReconColor,
            poisson_recon_sample_per_node: this.jobUpdateForm.value.poissonSampleRate,
            poisson_recon_density: this.jobUpdateForm.value.checkPoissonReconDensity,
            ssd_recon_degree: this.jobUpdateForm.value.ssdReconDegree,
            surface_trim: this.jobUpdateForm.value.checkSurfaceTrim,
            surface_trim_trim_threshold: this.jobUpdateForm.value.surfaceTrimThreshold,
            surface_trim_polygon_mesh: this.jobUpdateForm.value.checkPolygonMesh,
            surface_trim_smooth: this.jobUpdateForm.value.surfaceTrimSmooth,
            job_note: this.jobUpdateForm.value.jobNote,
            job_priority: this.jobUpdateForm.value.selectJobPriority
        };
        this.apiService.callApi(`/api/job/${this.jobId}/update/`, 'POST', JSON.stringify(payloadData), this.headers)
            .subscribe({
            next: res => {
                this.dataSharingService.changeData('jobUpdated');
                this.router.navigate([`/jobs/job-description/${this.jobId}`]);
            },
            error: res => {
                this.updateSubmitErrors = res.error.errors;
                window.scroll(0, 0);
            }
        });
    }
};
JobUpdateComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-job-update',
        template: __webpack_require__(/*! ./job-update.component.html */ "./src/app/pages/jobs/job-update/job-update.component.html"),
        styles: [__webpack_require__(/*! ./job-update.component.css */ "./src/app/pages/jobs/job-update/job-update.component.css")]
    }),
    __metadata("design:paramtypes", [src_app_services_api_service__WEBPACK_IMPORTED_MODULE_3__["ApiService"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"], src_app_services_data_sharing_service__WEBPACK_IMPORTED_MODULE_4__["DataSharingService"]])
], JobUpdateComponent);



/***/ }),

/***/ "./src/app/pages/jobs/jobs-root/jobs-root.component.css":
/*!**************************************************************!*\
  !*** ./src/app/pages/jobs/jobs-root/jobs-root.component.css ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".sidebarBefore{\n    display:flex;    \n    transition:all .5s;\n}\n.sidebarAfter{    \n    display:none;\n    transition:all .5s;\n}\n.toggleBtn{\n    position:absolute;         \n    padding:5px;\n    border:none;\n    background:none;\n    display:flex;\n    justify-content: center;\n    align-items: center;\n}\n.outletStyle{\n    margin:0px 50px;  \n}"

/***/ }),

/***/ "./src/app/pages/jobs/jobs-root/jobs-root.component.html":
/*!***************************************************************!*\
  !*** ./src/app/pages/jobs/jobs-root/jobs-root.component.html ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section class=\"mt-5\">\n    <div class=\"container-fluid\">\n      <div class=\"row\">                 \n        <app-sidebar class=\"card card-body bg-light shadow sidebar\" [showToggleBtn]=\"true\"\n                     [ngClass]=\"ngClassSidebar\" (toggleBtn)=\"toggleBtnAction()\"\n        >\n        </app-sidebar>  \n        <div class=\"mt-4\" [ngClass]=\"ngClassContent\">\n          <button *ngIf=\"showSidebarBtn\" type=\"button\" #sidebarToggleBtn class=\"toggleBtn\"\n                (click)=\"closeSidebar()\"  [ngStyle]=\"{'margin-top':'5px'}\"\n          >             \n            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" fill=\"#17a2b8\" class=\"bi bi-arrow-right-square-fill\" viewBox=\"0 0 16 16\">\n              <path d=\"M0 14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v12zm4.5-6.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5a.5.5 0 0 1 0-1z\"/>\n            </svg>\n          </button>   \n          <div [ngClass]=\"showSidebarBtn && 'outletStyle'\" [ngStyle]=\"{'margin-top':'8px'}\">\n            <router-outlet></router-outlet>                                \n          </div>                 \n        </div>              \n      </div>\n    </div>\n</section>"

/***/ }),

/***/ "./src/app/pages/jobs/jobs-root/jobs-root.component.ts":
/*!*************************************************************!*\
  !*** ./src/app/pages/jobs/jobs-root/jobs-root.component.ts ***!
  \*************************************************************/
/*! exports provided: JobsRootComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JobsRootComponent", function() { return JobsRootComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

let JobsRootComponent = class JobsRootComponent {
    constructor() {
        this.showSidebarBtn = false;
        this.ngClassSidebar = "col-lg-3 sidebarBefore";
        this.ngClassContent = "col-lg-9 contentBefore";
    }
    ngOnInit() { }
    toggleBtnAction() {
        this.ngClassSidebar = "col-lg-0 sidebarAfter";
        this.ngClassContent = "col-lg-12 contentAfter";
        this.showSidebarBtn = true;
    }
    closeSidebar() {
        this.ngClassSidebar = "col-lg-3 sidebarBefore";
        this.ngClassContent = "col-lg-9 contentBefore";
        this.showSidebarBtn = false;
    }
};
JobsRootComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-jobs-root',
        template: __webpack_require__(/*! ./jobs-root.component.html */ "./src/app/pages/jobs/jobs-root/jobs-root.component.html"),
        styles: [__webpack_require__(/*! ./jobs-root.component.css */ "./src/app/pages/jobs/jobs-root/jobs-root.component.css")]
    }),
    __metadata("design:paramtypes", [])
], JobsRootComponent);



/***/ }),

/***/ "./src/app/pages/jobs/jobs-route.module.ts":
/*!*************************************************!*\
  !*** ./src/app/pages/jobs/jobs-route.module.ts ***!
  \*************************************************/
/*! exports provided: JobsRouteModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JobsRouteModule", function() { return JobsRouteModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _associated_jobs_associated_jobs_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./associated-jobs/associated-jobs.component */ "./src/app/pages/jobs/associated-jobs/associated-jobs.component.ts");
/* harmony import */ var _job_create_job_create_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./job-create/job-create.component */ "./src/app/pages/jobs/job-create/job-create.component.ts");
/* harmony import */ var _job_description_job_description_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./job-description/job-description.component */ "./src/app/pages/jobs/job-description/job-description.component.ts");
/* harmony import */ var _job_update_job_update_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./job-update/job-update.component */ "./src/app/pages/jobs/job-update/job-update.component.ts");
/* harmony import */ var _jobs_root_jobs_root_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./jobs-root/jobs-root.component */ "./src/app/pages/jobs/jobs-root/jobs-root.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







const routes = [
    {
        path: "",
        component: _jobs_root_jobs_root_component__WEBPACK_IMPORTED_MODULE_6__["JobsRootComponent"],
        children: [
            { path: 'update-job/:id', component: _job_update_job_update_component__WEBPACK_IMPORTED_MODULE_5__["JobUpdateComponent"] },
            { path: 'create-job', component: _job_create_job_create_component__WEBPACK_IMPORTED_MODULE_3__["JobCreateComponent"] },
            { path: 'job-description/:id', component: _job_description_job_description_component__WEBPACK_IMPORTED_MODULE_4__["JobDescriptionComponent"] },
            { path: 'associated-jobs/:id', component: _associated_jobs_associated_jobs_component__WEBPACK_IMPORTED_MODULE_2__["AssociatedJobsComponent"] },
            {
                path: '',
                loadChildren: () => __webpack_require__.e(/*! import() */ 0).then(__webpack_require__.bind(null, /*! ../ply-viewer/ply-viewer.module */ "./src/app/pages/ply-viewer/ply-viewer.module.ts")).then(m => m.PlyViewerModule)
            }
        ]
    }
];
let JobsRouteModule = class JobsRouteModule {
};
JobsRouteModule = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
    })
], JobsRouteModule);



/***/ }),

/***/ "./src/app/pages/jobs/jobs.module.ts":
/*!*******************************************!*\
  !*** ./src/app/pages/jobs/jobs.module.ts ***!
  \*******************************************/
/*! exports provided: JobsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "JobsModule", function() { return JobsModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var src_app_shared_common_shared_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/shared/common-shared.module */ "./src/app/shared/common-shared.module.ts");
/* harmony import */ var src_app_shared_shared_sidebar_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/shared/shared-sidebar.module */ "./src/app/shared/shared-sidebar.module.ts");
/* harmony import */ var _jobs_route_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./jobs-route.module */ "./src/app/pages/jobs/jobs-route.module.ts");
/* harmony import */ var _jobs_root_jobs_root_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./jobs-root/jobs-root.component */ "./src/app/pages/jobs/jobs-root/jobs-root.component.ts");
/* harmony import */ var _job_create_job_create_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./job-create/job-create.component */ "./src/app/pages/jobs/job-create/job-create.component.ts");
/* harmony import */ var _job_update_job_update_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./job-update/job-update.component */ "./src/app/pages/jobs/job-update/job-update.component.ts");
/* harmony import */ var _job_description_job_description_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./job-description/job-description.component */ "./src/app/pages/jobs/job-description/job-description.component.ts");
/* harmony import */ var _associated_jobs_associated_jobs_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./associated-jobs/associated-jobs.component */ "./src/app/pages/jobs/associated-jobs/associated-jobs.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









let JobsModule = class JobsModule {
};
JobsModule = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
        imports: [
            src_app_shared_common_shared_module__WEBPACK_IMPORTED_MODULE_1__["CommonSharedModule"],
            src_app_shared_shared_sidebar_module__WEBPACK_IMPORTED_MODULE_2__["SharedSidebarModule"],
            _jobs_route_module__WEBPACK_IMPORTED_MODULE_3__["JobsRouteModule"],
        ],
        declarations: [
            _jobs_root_jobs_root_component__WEBPACK_IMPORTED_MODULE_4__["JobsRootComponent"],
            _job_create_job_create_component__WEBPACK_IMPORTED_MODULE_5__["JobCreateComponent"],
            _job_update_job_update_component__WEBPACK_IMPORTED_MODULE_6__["JobUpdateComponent"],
            _job_description_job_description_component__WEBPACK_IMPORTED_MODULE_7__["JobDescriptionComponent"],
            _associated_jobs_associated_jobs_component__WEBPACK_IMPORTED_MODULE_8__["AssociatedJobsComponent"]
        ],
        providers: []
    })
], JobsModule);



/***/ })

}]);
//# sourceMappingURL=3.js.map