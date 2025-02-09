(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[2],{

/***/ "./src/app/pages/images/add-image-folder/add-image-folder.component.css":
/*!******************************************************************************!*\
  !*** ./src/app/pages/images/add-image-folder/add-image-folder.component.css ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".uploadBtn{\n    margin:0px;\n    position:relative;\n    overflow:hidden;\n}\n\n.uploadInput{\n    position: absolute;\n    top: 0;\n    right: 0;\n    margin: 0;\n    padding: 0;\n    font-size: 20px;\n    cursor: pointer;\n    opacity: 0;\n    overflow: hidden;\n}\n\n.mat-bar{   \n    height:20px;  \n    width: 100%;    \n}\n\n.toastAlert{\n    width:420px;\n}\n\n.toastAlert a{\n    text-decoration:underline;\n}\n\n.uploadMore{\n    cursor: pointer;\n    text-decoration: underline;\n}\n\n@media screen and (min-width:600px) {\n    .mat-bar{\n        width:50%;\n    }    \n}\n\n"

/***/ }),

/***/ "./src/app/pages/images/add-image-folder/add-image-folder.component.html":
/*!*******************************************************************************!*\
  !*** ./src/app/pages/images/add-image-folder/add-image-folder.component.html ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"errorMsgs\" class=\"alert alert-block alert-danger\"> \n  <ul class=\"m-0\" [ngStyle]=\"{'padding-left':'20px'}\"> \n    <li *ngFor=\"let warning of errorMsgs\">\n      {{warning}}\n    </li> \n  </ul> \n</div>\n\n<h4 class=\"mb-4 text-center\">Upload Images</h4>\n<form [formGroup]=\"folderUpForm\" (ngSubmit)=\"onSubmit()\">\n  <div class=\"form-group\">\n    <input formControlName=\"title\" class=\"form-input p-1 mb-2\" placeholder=\"Title\">        \n  </div>\n  <div class=\"form-group\">\n    <input formControlName=\"description\" class=\"form-input p-1 mb-2\" placeholder=\"Images Description\">\n  </div>\n              \n  <div class=\"form-group d-flex flex-column align-items-start\">         \n    <div class=\"uploadBtn btn btn-primary my-2\">\n      <span>Upload Folder(s)</span>\n      <input type=\"file\" directory webkitdirectory multiple class=\"uploadInput\"\n              [disabled]=\"progressVal===100\" (change)=\"getImageFolder($event.target)\"\n      >\n    </div>\n    <small class=\"align-self-start\">*supported image formats are .jpeg, .png and .bmp</small>\n  </div>                    \n  \n  <button [disabled]=\"!title.valid || !fileTypeCheck || files.length===0 || progressVal>0\" type=\"submit\" class=\"btn btn-custom hover-shadow px-4 my-2\">Submit</button>\n\n  <p *ngIf=\"fileTypeCheck===false\" class=\"form-text text-danger font-italic font-weight-bold mt-3 text-center\">Your files include unsupported format.</p>                              \n          \n  <div class=\"d-flex w-100 align-items-center align-self-start mt-2\">\n    <div class=\"my-3 mr-3 font-weight-bold\" *ngIf=\"0<progressVal && progressVal<100\">Uploading...</div>\n    <div class=\"my-2 mr-2\" *ngIf = \"progressVal>0\">{{progressVal}}% complete</div>\n    <ng-template [ngIf]=\"0<progressVal && progressVal<100\">\n      <mat-progress-bar class=\"mat-bar my-2 progressBar\" [value]=\"progressVal\">        \n      </mat-progress-bar>\n    </ng-template>        \n    <div class=\"my-3\" *ngIf=\"progressVal===100\">\n      <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"25\" height=\"25\" fill=\"green\" class=\"bi bi-check2-circle\" viewBox=\"0 0 16 16\">\n        <path d=\"M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z\"/>\n        <path d=\"M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z\"/>\n      </svg>            \n    </div>\n    <div class=\"ml-5\" *ngIf=\"progressVal==100 && !createdJobId\">\n      <a (click)=\"uploadMore()\" class=\"uploadMore\">Upload More</a>      \n    </div>    \n  </div>\n\n  <!-- <div *ngIf=\"progressVal===100\"  class=\"alert alert-success toastAlert mt-2 mb-0\" role=\"alert\">\n    <div class=\"d-flex justify-content-between align-items-center\">\n      <span>Upload completed successfully</span>\n      <span>              \n        <a (click)=\"uploadMore()\" class=\"uploadMore\">\n          Upload More\n        </a>                            \n      </span>\n    </div>\n  </div>               -->\n\n  <ng-template [ngIf]=\"files && progressVal!==100\">\n    <ul class=\"mt-3\">                        \n      <li *ngFor=\"let item of fileNames\" class=\"mb-2\">{{item}}</li>            \n    </ul> \n\n    <div class=\"mt-4\" *ngIf=\"fileTypeCheck\">          \n      <p class=\"font-weight-bold\" *ngIf=\"subDir.length>0; else oneDir\">\n        The following Root directorie(s), will be used as the Job name (total: 1):\n      </p>\n      <ng-template #oneDir>\n        <p class=\"font-weight-bold\">\n          Root directorie(s), will be used as the Job and Image project name, (total: 1):\n        </p>\n      </ng-template>          \n      <ul>\n        <li class=\"mb-2\">{{rootDir}}</li>            \n      </ul>\n    </div>\n    \n    <div class=\"mt-4\" *ngIf=\"subDir.length>0\">\n      <p class=\"font-weight-bold\">Sub directorie(s), will be used as Image project(s) name(s), (total: {{subDir.length}}):</p>\n      <ul>\n        <li *ngFor=\"let item of subDir\" class=\"mb-2\">{{item}}</li>            \n      </ul>\n    </div>\n  </ng-template>                                            \n</form>\n\n\n\n\n\n\n"

/***/ }),

/***/ "./src/app/pages/images/add-image-folder/add-image-folder.component.ts":
/*!*****************************************************************************!*\
  !*** ./src/app/pages/images/add-image-folder/add-image-folder.component.ts ***!
  \*****************************************************************************/
/*! exports provided: AddImageFolderComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddImageFolderComponent", function() { return AddImageFolderComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var src_app_services_api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/api.service */ "./src/app/services/api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




let AddImageFolderComponent = class AddImageFolderComponent {
    constructor(fb, apiService, router) {
        this.fb = fb;
        this.apiService = apiService;
        this.router = router;
        this.directories = {};
        this.progressVal = 0;
    }
    ngOnInit() {
        this.folderUpForm = this.fb.group({
            title: [''],
            description: [''],
            imageFolder: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required]]
        });
    }
    getImageFolder(target) {
        this.files = target.files;
        let regex = /png|jpeg|jpg|bmp/i;
        this.fileTypeCheck = true;
        this.directories = {};
        this.fileNames = [];
        this.progressVal = 0;
        this.subDir = [];
        for (let i = 0; i < this.files.length; i++) {
            this.fileTypeCheck = regex.test(this.files[i].type.split('/').pop());
            if (this.fileTypeCheck == false) {
                return null;
            }
            this.directories[`${i}_${this.files[i].name}`] = this.files[i]['webkitRelativePath'];
        }
        this.fileNames = Object.values(this.directories);
        this.rootDir = this.fileNames[0].split('/')[0];
        this.subDir = this.fileNames.filter(item => {
            if (item.split('/').length > 2) {
                return item.split('/')[1];
            }
        })
            .map(item => item.split('/')[1])
            .filter((item, index, arr) => {
            return item != arr[index - 1] && item;
        });
        this.folderUpForm.patchValue({
            imageFolder: this.files
        });
        this.imageFolder.updateValueAndValidity();
    }
    get title() {
        return this.folderUpForm.get('title');
    }
    get description() {
        return this.folderUpForm.get('description');
    }
    get imageFolder() {
        return this.folderUpForm.get('imageFolder');
    }
    onSubmit() {
        if (this.fileTypeCheck) {
            let formData = new FormData();
            formData.append("title", this.title.value);
            formData.append("description", this.description.value);
            formData.append("directories", JSON.stringify(this.directories));
            for (let file of this.imageFolder.value) {
                formData.append("file_field", file);
            }
            let otherOptions = {
                reportProgress: true,
                observe: 'events'
            };
            this.apiService.callApi('/api/image-collection/create/', 'POST', formData, {}, false, otherOptions)
                .subscribe({
                next: (ab) => {
                    let loadingRate = Math.round(ab['total'] && ab['loaded'] * 100 / ab['total']);
                    if (loadingRate) {
                        this.progressVal = loadingRate;
                    }
                    if (ab['type'] == 4) {
                        this.createdJobId = ab['body'].data.job_id;
                        if (this.createdJobId) {
                            this.router.navigateByUrl(`/jobs/job-description/${ab['body'].data.job_id}`);
                        }
                        else {
                            this.errorMsgs = ['job not created'];
                        }
                    }
                }
            });
        }
    }
    uploadMore() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigateByUrl(this.router.url);
    }
};
AddImageFolderComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-add-image-folder',
        template: __webpack_require__(/*! ./add-image-folder.component.html */ "./src/app/pages/images/add-image-folder/add-image-folder.component.html"),
        styles: [__webpack_require__(/*! ./add-image-folder.component.css */ "./src/app/pages/images/add-image-folder/add-image-folder.component.css")]
    }),
    __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"], src_app_services_api_service__WEBPACK_IMPORTED_MODULE_3__["ApiService"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
], AddImageFolderComponent);



/***/ }),

/***/ "./src/app/pages/images/add-image/add-image.component.css":
/*!****************************************************************!*\
  !*** ./src/app/pages/images/add-image/add-image.component.css ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".mat-bar{   \n    height:20px;  \n    width: 100%;    \n}\n\n.toastAlert{\n    width:450px;\n}\n\n.toastAlert a{\n    text-decoration:underline;\n}\n\n.uploadAgain{\n    cursor: pointer;\n}\n\n@media screen and (min-width:600px) {\n    .mat-bar{\n        width:50%;\n    }    \n}"

/***/ }),

/***/ "./src/app/pages/images/add-image/add-image.component.html":
/*!*****************************************************************!*\
  !*** ./src/app/pages/images/add-image/add-image.component.html ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ng-template [ngIf]=\"showComponent\">\n  <h4 class=\"mb-5 text-center\">Add Images</h4>\n  <form [formGroup]=\"imageUploadForm\" (ngSubmit)=\"onSubmit()\">\n    <div class=\"form-group d-flex flex-column\">    \n      <input [disabled]=\"progressVal===100\" (change)=\"getImage($event.target)\" \n            type=\"file\" multiple class=\"py-2\" accept=\"image/png, image/jpeg, image/bmp\"\n      >    \n      <small class=\"align-self-start\">*supported image formats are .jpeg, .png and .bmp</small>\n    </div>\n    <button [disabled]=\"!files || progressVal>0\" type=\"submit\" class=\"btn btn-custom px-4 my-2 hover-shadow\">Upload</button>                              \n                \n    <div class=\"d-flex w-100 align-items-center align-self-start mt-2\">\n      <div class=\"my-3 mr-3 font-weight-bold\" *ngIf=\"0<progressVal && progressVal<100\">\n        Uploading...\n      </div>\n      <div class=\"my-2 mr-2\" *ngIf = \"progressVal>0\">\n        {{progressVal}}% complete\n      </div>\n      <mat-progress-bar class=\"mat-bar my-2\" *ngIf=\"0<progressVal && progressVal<100\" [value]=\"progressVal\" ></mat-progress-bar>\n      <div class=\"my-3\" *ngIf=\"progressVal===100\">\n        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"25\" height=\"25\" fill=\"green\" class=\"bi bi-check2-circle\" viewBox=\"0 0 16 16\">\n          <path d=\"M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z\"/>\n          <path d=\"M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z\"/>\n        </svg>\n      </div>\n    </div>\n\n    <div *ngIf=\"progressVal===100\"  class=\"alert alert-success toastAlert mt-2 mb-0\" role=\"alert\">\n      <div class=\"d-flex justify-content-between align-items-center\">\n        <span>Upload completed successfully</span>\n        <span>              \n          <a (click)=\"uploadAgain()\" class=\"uploadAgain\">\n            Upload More\n          </a>                            \n        </span>\n      </div>\n    </div>       \n  </form> \n</ng-template>\n\n<div *ngIf=\"!showComponent\" class=\"text-center mt-4\">\n  {{errorMsg}}\n</div>"

/***/ }),

/***/ "./src/app/pages/images/add-image/add-image.component.ts":
/*!***************************************************************!*\
  !*** ./src/app/pages/images/add-image/add-image.component.ts ***!
  \***************************************************************/
/*! exports provided: AddImageComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AddImageComponent", function() { return AddImageComponent; });
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





let AddImageComponent = class AddImageComponent {
    constructor(fb, apiService, router, activatedRoute, dataSharingService) {
        this.fb = fb;
        this.apiService = apiService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.dataSharingService = dataSharingService;
        this.progressVal = 0;
    }
    ngOnInit() {
        this.imageUploadForm = this.fb.group({
            imageInput: [null]
        });
        this.activatedRoute.paramMap.subscribe(params => {
            this.imgCollectionId = params.get('id');
            this.apiService.callApi(`/api/image-collection/${this.imgCollectionId}/update`)
                .subscribe({
                next: res => {
                    this.showComponent = res['code'] == 200 && true;
                },
                error: res => {
                    this.errorMsg = res.error.errors[0];
                    this.showComponent = false;
                }
            });
        });
    }
    getImage(target) {
        this.files = target.files;
        this.progressVal = 0;
        this.imageUploadForm.patchValue({ imageInput: this.files });
        this.imageInput.updateValueAndValidity();
    }
    get imageInput() {
        return this.imageUploadForm.get('imageInput');
    }
    uploadAgain() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigateByUrl(this.router.url);
    }
    onSubmit() {
        let fd = new FormData();
        for (let file of this.imageInput.value) {
            fd.append("images", file);
        }
        let otherOptions = {
            reportProgress: true,
            observe: 'events'
        };
        this.apiService.callApi(`/api/image-collection/${this.imgCollectionId}/image/add/`, 'POST', fd, {}, false, otherOptions)
            .subscribe((ab) => {
            let loadingRate = Math.round(ab['total'] && ab['loaded'] * 100 / ab['total']);
            if (loadingRate) {
                this.progressVal = loadingRate;
            }
            else if (ab['type'] == 4) {
                this.router.navigateByUrl(`/images/view-images/${this.imgCollectionId}`);
            }
        });
    }
};
AddImageComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-add-image',
        template: __webpack_require__(/*! ./add-image.component.html */ "./src/app/pages/images/add-image/add-image.component.html"),
        styles: [__webpack_require__(/*! ./add-image.component.css */ "./src/app/pages/images/add-image/add-image.component.css")]
    }),
    __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"], src_app_services_api_service__WEBPACK_IMPORTED_MODULE_3__["ApiService"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"], src_app_services_data_sharing_service__WEBPACK_IMPORTED_MODULE_4__["DataSharingService"]])
], AddImageComponent);



/***/ }),

/***/ "./src/app/pages/images/change-image-info/change-image-info.component.css":
/*!********************************************************************************!*\
  !*** ./src/app/pages/images/change-image-info/change-image-info.component.css ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/pages/images/change-image-info/change-image-info.component.html":
/*!*********************************************************************************!*\
  !*** ./src/app/pages/images/change-image-info/change-image-info.component.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "  <ng-template [ngIf]=\"showComponent\">\n    <h4 class=\"mb-4 text-center\">Update Image Project Informations</h4>\n    <form [formGroup]=\"changeInfoForm\" (ngSubmit)=\"onSubmit()\">\n      <div class=\"form-group\">\n        <input type=\"text\" class=\"form-input p-1 mb-2\" formControlName=\"title\" placeholder=\"Title*\">\n        <small *ngIf=\"title.invalid && (title.touched || allAlerts)\" class=\"ml-1 text-danger\">Title is needed</small>\n      </div>    \n      <div class=\"form-group\">\n        <input type=\"text\" class=\"form-input p-1 mb-2\" formControlName=\"description\" placeholder=\"Images Description*\">\n        <small *ngIf=\"description.invalid && (description.touched || allAlerts)\" class=\"ml-1 text-danger\">Description is needed</small>\n      </div>\n      <button type=\"submit\" class=\"btn btn-custom px-4 mb-2 hover-shadow\">Update</button>\n    </form>\n  </ng-template>\n\n  <div *ngIf=\"!showComponent\" class=\"text-center mt-4\">\n    {{errorMsg}}\n  </div>\n\n"

/***/ }),

/***/ "./src/app/pages/images/change-image-info/change-image-info.component.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/pages/images/change-image-info/change-image-info.component.ts ***!
  \*******************************************************************************/
/*! exports provided: ChangeImageInfoComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChangeImageInfoComponent", function() { return ChangeImageInfoComponent; });
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





let ChangeImageInfoComponent = class ChangeImageInfoComponent {
    constructor(fb, apiService, router, activatedRoute, dataSharingService) {
        this.fb = fb;
        this.apiService = apiService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.dataSharingService = dataSharingService;
        this.allAlerts = false;
    }
    ngOnInit() {
        this.activatedRoute.paramMap.subscribe(params => {
            this.id = params.get('id');
            this.changeInfoForm = this.fb.group({
                title: [[''], [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].minLength(1)]],
                description: [[''], [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].minLength(1)]]
            });
            this.apiService.callApi(`/api/image-collection/${this.id}/update/`)
                .subscribe({
                next: res => {
                    this.changeInfoForm.patchValue({ title: res['data'].title, description: res['data'].description });
                    this.showComponent = res['code'] == 200 && true;
                },
                error: res => {
                    this.errorMsg = res.error.errors[0];
                    this.showComponent = false;
                }
            });
        });
    }
    get title() {
        return this.changeInfoForm.get('title');
    }
    get description() {
        return this.changeInfoForm.get('description');
    }
    onSubmit() {
        if (this.changeInfoForm.invalid) {
            this.allAlerts = true;
            return null;
        }
        let body = {
            title: this.title.value,
            description: this.description.value
        };
        this.apiService.callApi(`/api/image-collection/${this.id}/update/`, 'PUT', body)
            .subscribe({
            next: res => {
                this.dataSharingService.changeData('imageInfoChanged');
                this.router.navigate([`images/view-images/${this.id}`]);
            },
            error: res => console.error(res)
        });
    }
};
ChangeImageInfoComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-change-image-info',
        template: __webpack_require__(/*! ./change-image-info.component.html */ "./src/app/pages/images/change-image-info/change-image-info.component.html"),
        styles: [__webpack_require__(/*! ./change-image-info.component.css */ "./src/app/pages/images/change-image-info/change-image-info.component.css")]
    }),
    __metadata("design:paramtypes", [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"], src_app_services_api_service__WEBPACK_IMPORTED_MODULE_3__["ApiService"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"], src_app_services_data_sharing_service__WEBPACK_IMPORTED_MODULE_4__["DataSharingService"]])
], ChangeImageInfoComponent);



/***/ }),

/***/ "./src/app/pages/images/images-root/images-root.component.css":
/*!********************************************************************!*\
  !*** ./src/app/pages/images/images-root/images-root.component.css ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".sidebarBefore{\n    display:flex;    \n    transition:all .5s;\n}\n.sidebarAfter{    \n    display:none;\n    transition:all .5s;\n}\n.toggleBtn{\n    position:absolute;         \n    padding:5px;\n    border:none;\n    background:none;\n    display:flex;\n    justify-content: center;\n    align-items: center;\n}\n.outletStyle{\n    margin:0px 50px;  \n}"

/***/ }),

/***/ "./src/app/pages/images/images-root/images-root.component.html":
/*!*********************************************************************!*\
  !*** ./src/app/pages/images/images-root/images-root.component.html ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<section class=\"mt-5\">\n  <div class=\"container-fluid\">\n    <div class=\"row\">                 \n      <app-sidebar class=\"card card-body bg-light shadow sidebar\" [showToggleBtn]=\"true\"\n                  [ngClass]=\"ngClassSidebar\" (toggleBtn)=\"toggleBtnAction()\"\n      >\n      </app-sidebar>    \n      <div class=\"mt-4\" [ngClass]=\"ngClassContent\">\n        <button *ngIf=\"showSidebarBtn\" type=\"button\" #sidebarToggleBtn class=\"toggleBtn\"\n                (click)=\"closeSidebar()\" [ngStyle]=\"{'margin-top':'5px'}\"\n        >\n          <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\" fill=\"#17a2b8\" class=\"bi bi-arrow-right-square-fill\" viewBox=\"0 0 16 16\">\n            <path d=\"M0 14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v12zm4.5-6.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5a.5.5 0 0 1 0-1z\"/>\n          </svg>\n        </button>               \n        <div [ngClass]=\"showSidebarBtn && 'outletStyle'\" [ngStyle]=\"{'margin-top':'8px'}\">\n          <router-outlet></router-outlet>                                \n        </div>         \n      </div>\n    </div>\n  </div>\n</section>\n\n"

/***/ }),

/***/ "./src/app/pages/images/images-root/images-root.component.ts":
/*!*******************************************************************!*\
  !*** ./src/app/pages/images/images-root/images-root.component.ts ***!
  \*******************************************************************/
/*! exports provided: ImagesRootComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImagesRootComponent", function() { return ImagesRootComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var src_app_services_data_sharing_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/services/data-sharing.service */ "./src/app/services/data-sharing.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


let ImagesRootComponent = class ImagesRootComponent {
    constructor(dataSharingService) {
        this.dataSharingService = dataSharingService;
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
        this.dataSharingService.changeData('toggleCanvasSize');
    }
};
ImagesRootComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-images-root',
        template: __webpack_require__(/*! ./images-root.component.html */ "./src/app/pages/images/images-root/images-root.component.html"),
        styles: [__webpack_require__(/*! ./images-root.component.css */ "./src/app/pages/images/images-root/images-root.component.css")]
    }),
    __metadata("design:paramtypes", [src_app_services_data_sharing_service__WEBPACK_IMPORTED_MODULE_1__["DataSharingService"]])
], ImagesRootComponent);



/***/ }),

/***/ "./src/app/pages/images/images-route.module.ts":
/*!*****************************************************!*\
  !*** ./src/app/pages/images/images-route.module.ts ***!
  \*****************************************************/
/*! exports provided: ImagesRouteModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImagesRouteModule", function() { return ImagesRouteModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _add_image_folder_add_image_folder_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./add-image-folder/add-image-folder.component */ "./src/app/pages/images/add-image-folder/add-image-folder.component.ts");
/* harmony import */ var _add_image_add_image_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./add-image/add-image.component */ "./src/app/pages/images/add-image/add-image.component.ts");
/* harmony import */ var _change_image_info_change_image_info_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./change-image-info/change-image-info.component */ "./src/app/pages/images/change-image-info/change-image-info.component.ts");
/* harmony import */ var _images_root_images_root_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./images-root/images-root.component */ "./src/app/pages/images/images-root/images-root.component.ts");
/* harmony import */ var _view_images_view_images_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./view-images/view-images.component */ "./src/app/pages/images/view-images/view-images.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







const routes = [
    {
        path: "",
        component: _images_root_images_root_component__WEBPACK_IMPORTED_MODULE_5__["ImagesRootComponent"],
        children: [
            { path: 'add-image/:id', component: _add_image_add_image_component__WEBPACK_IMPORTED_MODULE_3__["AddImageComponent"] },
            { path: 'add-image-folder', component: _add_image_folder_add_image_folder_component__WEBPACK_IMPORTED_MODULE_2__["AddImageFolderComponent"] },
            { path: 'change-image-info/:id', component: _change_image_info_change_image_info_component__WEBPACK_IMPORTED_MODULE_4__["ChangeImageInfoComponent"] },
            { path: 'view-images/:id', component: _view_images_view_images_component__WEBPACK_IMPORTED_MODULE_6__["ViewImagesComponent"] },
            {
                path: '',
                loadChildren: () => __webpack_require__.e(/*! import() */ 0).then(__webpack_require__.bind(null, /*! ../ply-viewer/ply-viewer.module */ "./src/app/pages/ply-viewer/ply-viewer.module.ts")).then(m => m.PlyViewerModule)
            }
        ]
    }
];
let ImagesRouteModule = class ImagesRouteModule {
};
ImagesRouteModule = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
    })
], ImagesRouteModule);



/***/ }),

/***/ "./src/app/pages/images/images.module.ts":
/*!***********************************************!*\
  !*** ./src/app/pages/images/images.module.ts ***!
  \***********************************************/
/*! exports provided: ImagesModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImagesModule", function() { return ImagesModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var src_app_shared_common_shared_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/shared/common-shared.module */ "./src/app/shared/common-shared.module.ts");
/* harmony import */ var src_app_shared_shared_sidebar_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/shared/shared-sidebar.module */ "./src/app/shared/shared-sidebar.module.ts");
/* harmony import */ var _images_route_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./images-route.module */ "./src/app/pages/images/images-route.module.ts");
/* harmony import */ var _images_root_images_root_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./images-root/images-root.component */ "./src/app/pages/images/images-root/images-root.component.ts");
/* harmony import */ var _add_image_add_image_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./add-image/add-image.component */ "./src/app/pages/images/add-image/add-image.component.ts");
/* harmony import */ var _add_image_folder_add_image_folder_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./add-image-folder/add-image-folder.component */ "./src/app/pages/images/add-image-folder/add-image-folder.component.ts");
/* harmony import */ var _change_image_info_change_image_info_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./change-image-info/change-image-info.component */ "./src/app/pages/images/change-image-info/change-image-info.component.ts");
/* harmony import */ var _view_images_view_images_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./view-images/view-images.component */ "./src/app/pages/images/view-images/view-images.component.ts");
/* harmony import */ var src_app_shared_mat_shared_module__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/app/shared/mat-shared.module */ "./src/app/shared/mat-shared.module.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};










let ImagesModule = class ImagesModule {
};
ImagesModule = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
        imports: [
            src_app_shared_common_shared_module__WEBPACK_IMPORTED_MODULE_1__["CommonSharedModule"],
            src_app_shared_shared_sidebar_module__WEBPACK_IMPORTED_MODULE_2__["SharedSidebarModule"],
            _images_route_module__WEBPACK_IMPORTED_MODULE_3__["ImagesRouteModule"],
            src_app_shared_mat_shared_module__WEBPACK_IMPORTED_MODULE_9__["MatSharedModule"]
        ],
        declarations: [
            _images_root_images_root_component__WEBPACK_IMPORTED_MODULE_4__["ImagesRootComponent"],
            _add_image_add_image_component__WEBPACK_IMPORTED_MODULE_5__["AddImageComponent"],
            _add_image_folder_add_image_folder_component__WEBPACK_IMPORTED_MODULE_6__["AddImageFolderComponent"],
            _change_image_info_change_image_info_component__WEBPACK_IMPORTED_MODULE_7__["ChangeImageInfoComponent"],
            _view_images_view_images_component__WEBPACK_IMPORTED_MODULE_8__["ViewImagesComponent"],
        ],
        providers: []
    })
], ImagesModule);



/***/ }),

/***/ "./src/app/pages/images/view-images/view-images.component.css":
/*!********************************************************************!*\
  !*** ./src/app/pages/images/view-images/view-images.component.css ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".pageStyle{\n    cursor: pointer;\n}\n\ntable {    \n    border-collapse: collapse;\n    width: 100%;\n  }\n\ntd, th {\n    border: 1px solid #dddddd;\n    text-align: left;\n    padding: 8px;\n}\n  "

/***/ }),

/***/ "./src/app/pages/images/view-images/view-images.component.html":
/*!*********************************************************************!*\
  !*** ./src/app/pages/images/view-images/view-images.component.html ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container\" *ngIf=\"showComponent\">\n  <div class=\"row d-flex justify-content-center\">\n    <p class=\"mx-2\"><strong>Uploaded: </strong>{{imagesInfo.date_uploaded}}</p>\n    <p class=\"mx-2\"><strong>Title: </strong>{{imagesInfo.title}}</p>\n    <p class=\"mx-2\"><strong>Description: </strong>{{imagesInfo.description}}</p>\n  </div>\n  <div class=\"row d-flex justify-content-center mb-2\">\n    <a routerLink=\"/images/change-image-info/{{imagesInfo.id}}\">\n      <button class=\"btn btn-outline-custom btn-sm m-2\">Change Title/Description</button>\n    </a>\n    <a routerLink=\"/images/add-image/{{imagesInfo.id}}\">\n      <button class=\"btn btn-outline-custom btn-sm m-2\">Add Images</button>\n    </a>\n    <a (click)=\"createImageProjectJob()\">\n      <button class=\"btn btn-outline-custom btn-sm m-2\">Create Job</button>\n    </a>\n  </div>\n\n  <div class=\"row d-flex justify-content-center\">      \n    <div *ngFor=\"let imageData of imagesCollection\" class=\"col-6 col-md-3 col-lg-2\">\n      <a [href]=\"apiRoot+imageData.image\">\n        <img [src]=\"apiRoot+imageData.image_thumbnail\" class=\"img-thumbnail mb-4 position-relative\">\n      </a>\n      <button class=\"btn btn-danger btn-sm rounded-0 position-absolute delete-btn\" (click)=\"deleteImage(imageData)\">\n        <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-trash\" viewBox=\"0 0 16 16\">\n          <path d=\"M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z\"/>\n          <path fill-rule=\"evenodd\" d=\"M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z\"/>\n        </svg>\n      </button>\n    </div>\n  </div>   \n  \n  \n  <nav class=\"mt-3 mb-2 d-flex justify-content-center\" *ngIf=\"totalPages>1\" aria-label=\"pagination in image details page\">\n    <ul class=\"pagination pagination-sm\">    \n      <ng-template [ngIf]=\"totalPages<=7\">\n        <li *ngFor=\"let page of getArray(totalPages)\" \n          class=\"page-item pageStyle\" [ngClass]=\"page === itemActive && 'active'\" \n        >\n          <a class=\"page-link\" (click)=\"getThisPage(page)\">{{page}}</a>\n        </li> \n      </ng-template>             \n      \n      <ng-template [ngIf]=\"totalPages>7\">\n        <li class=\"page-item pageStyle\" [ngClass]=\"itemActive==1 && 'active'\">\n          <a class=\"page-link\" (click)=\"getThisPage(1)\"> 1 </a>\n        </li>  \n  \n        <ng-template [ngIf]=\"itemActive>3 && totalPages-itemActive>2\">\n          <li class=\"page-item pageStyle\">\n            <a (click)=\"getThisPage(3)\" class=\"page-link\">..</a>\n          </li>\n  \n          <li *ngFor=\"let page of [itemActive-1,itemActive,itemActive+1]\" class=\"page-item pageStyle\"\n              [ngClass]=\"itemActive==page && 'active'\"\n          >\n            <a class=\"page-link\" (click)=\"getThisPage(page)\">{{page}}</a>\n          </li>\n  \n          <li class=\"page-item pageStyle\">\n            <a (click)=\"getThisPage(totalPages-2)\" class=\"page-link\">..</a>\n          </li>\n        </ng-template>    \n        \n        <ng-template [ngIf]=\"itemActive<=3\">\n          <li *ngFor=\"let page of [2,3,4]\" class=\"page-item pageStyle\"\n              [ngClass]=\"itemActive==page && 'active'\"\n          >\n            <a class=\"page-link\" (click)=\"getThisPage(page)\">{{page}}</a>\n          </li>\n          <li class=\"page-item pageStyle\">\n            <a (click)=\"getThisPage(totalPages-2)\" class=\"page-link\">..</a>\n          </li>\n        </ng-template>\n  \n        <ng-template [ngIf]=\"totalPages-itemActive<=2\">\n          <li class=\"page-item pageStyle\">\n            <a (click)=\"getThisPage(3)\" class=\"page-link\">..</a>\n          </li>\n          <li *ngFor=\"let page of [totalPages-3,totalPages-2,totalPages-1]\" \n              class=\"page-item pageStyle\" [ngClass]=\"itemActive==page && 'active'\"\n          >\n            <a class=\"page-link\" (click)=\"getThisPage(page)\">{{page}}</a>\n          </li>\n        </ng-template>\n        \n        <li *ngIf=\"totalPages!=1\" class=\"page-item pageStyle\" [ngClass]=\"itemActive==totalPages && 'active'\">\n          <a class=\"page-link\" (click)=\"getThisPage(totalPages)\"> {{totalPages}} </a>\n        </li>  \n      </ng-template>     \n    </ul>\n  </nav>\n  \n  <ng-template [ngIf]=\"plyFileJobs.length>0\">\n    \n    <h4 class=\"mt-4 text-center\">Associated Model Files</h4>\n\n    <div *ngFor=\"let job of plyFileJobs\" class=\"mt-4 mb-4\">\n      <table>\n        <tr>\n          <td class=\"pt-2\">\n            <div class=\"mb-2 ml-2\">Job Name: {{job.job_name}}</div>\n            <div class=\"mb-2 ml-2\">Date Created: {{job.date_created}}</div>\n            <div class=\"mb-2 ml-2\">Date Updated: {{job.date_updated}}</div>          \n          </td>\n          <td>           \n            <a href={{apiRoot+file.path}} *ngFor=\"let file of job.ply_files\" class=\"ml-2\">\n              {{file.title}} <br/>\n            </a> \n          </td>\n        </tr>   \n      </table>\n\n      <!-- <div class=\"col-lg-5 offset-lg-1\">\n        <p>\n          <strong>Job Name:</strong>\n          <span class=\"ml-1\">{{job.job_name}}</span>\n        </p>   \n        \n        <p>\n          <strong>Date Created</strong>\n          <span class=\"ml-1\">{{job.date_created}}</span>\n        </p>  \n  \n        <p>\n          <strong>Date Updated</strong>\n          <span class=\"ml-1\">{{job.date_updated}}</span>\n        </p>  \n      </div>\n      \n      <div class=\"col-lg-4 offset-lg-2\">\n        <p class=\"\"><strong>Ply Files</strong></p>\n        <p class=\"container row\" *ngFor=\"let file of job.ply_files\">\n          <span class=\"mr-1\">\n            {{job.ply_files.indexOf(file)+1+'.'}}\n          </span>            \n          <a href={{apiRoot+file.path}}>\n            {{file.title}}\n          </a>            \n      </p>\n      </div> -->\n\n    </div>\n  </ng-template> \n</div>\n\n<div *ngIf=\"!showComponent\" class=\"text-center mt-4\">\n  {{errorMsg}}\n</div>\n"

/***/ }),

/***/ "./src/app/pages/images/view-images/view-images.component.ts":
/*!*******************************************************************!*\
  !*** ./src/app/pages/images/view-images/view-images.component.ts ***!
  \*******************************************************************/
/*! exports provided: ViewImagesComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewImagesComponent", function() { return ViewImagesComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm2015/material.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var src_app_services_api_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/services/api.service */ "./src/app/services/api.service.ts");
/* harmony import */ var src_app_services_data_sharing_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/services/data-sharing.service */ "./src/app/services/data-sharing.service.ts");
/* harmony import */ var src_app_shared_components_delete_image_modal_delete_image_modal_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/shared/components/delete-image-modal/delete-image-modal.component */ "./src/app/shared/components/delete-image-modal/delete-image-modal.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






let ViewImagesComponent = class ViewImagesComponent {
    constructor(activatedRoute, apiService, router, snackBar, dialog, dataSharingService) {
        this.activatedRoute = activatedRoute;
        this.apiService = apiService;
        this.router = router;
        this.snackBar = snackBar;
        this.dialog = dialog;
        this.dataSharingService = dataSharingService;
        this.apiRoot = this.apiService.apiRoot;
        this.hPos = 'right';
        this.vPos = 'bottom';
    }
    ngOnInit() {
        this.activatedRoute.paramMap.subscribe(params => {
            this.imageId = params.get('id');
            this.apiService.callApi(`/api/image-collection/${this.imageId}/details/`)
                .subscribe({
                next: res => {
                    this.imagesInfo = res['data']['image_collection_data'];
                    this.imagesCollection = res['data']['images'];
                    this.plyFileJobs = res['data']['ply_file_jobs'];
                    this.totalPages = res['total_page_count'];
                    this.itemActive = 1;
                    this.showComponent = res['code'] == 200 && true;
                },
                error: res => {
                    this.errorMsg = res.error.errors[0];
                    this.showComponent = false;
                }
            });
        });
    }
    getThisPage(pageNum) {
        if (pageNum !== this.itemActive) {
            this.itemActive = pageNum;
            this.getImageData(pageNum);
        }
    }
    getImageData(page) {
        this.apiService.callApi(`/api/image-collection/${this.imageId}/details/?page=${page}`)
            .subscribe({
            next: res => {
                this.imagesCollection = res['data'].images;
            },
            error: res => console.log(res)
        });
    }
    deleteImage(imageData) {
        this.dialog.open(src_app_shared_components_delete_image_modal_delete_image_modal_component__WEBPACK_IMPORTED_MODULE_5__["DeleteImageModalComponent"]).afterClosed()
            .subscribe(res => {
            if (res === 'confirm') {
                this.apiService.callApi(`/api/image-collection/image/${imageData.id}/delete/`, 'DELETE')
                    .subscribe({
                    next: res => {
                        this.snackBar.open('Image successfully deleted', "Dissmiss", {
                            duration: 3000,
                            horizontalPosition: this.hPos,
                            verticalPosition: this.vPos,
                            panelClass: ['snackbar-delete']
                        });
                        this.getImageData(this.itemActive);
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
    createImageProjectJob() {
        this.router.navigateByUrl('/jobs/create-job');
        this.dataSharingService.changeData({ imageId: this.imageId });
    }
    getArray(val) {
        let arr = [];
        for (let i = 1; i <= val; i++) {
            arr.push(i);
        }
        return arr;
    }
};
ViewImagesComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-view-images',
        template: __webpack_require__(/*! ./view-images.component.html */ "./src/app/pages/images/view-images/view-images.component.html"),
        styles: [__webpack_require__(/*! ./view-images.component.css */ "./src/app/pages/images/view-images/view-images.component.css")]
    }),
    __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"], src_app_services_api_service__WEBPACK_IMPORTED_MODULE_3__["ApiService"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"], _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatSnackBar"], _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialog"], src_app_services_data_sharing_service__WEBPACK_IMPORTED_MODULE_4__["DataSharingService"]])
], ViewImagesComponent);



/***/ })

}]);
//# sourceMappingURL=2.js.map