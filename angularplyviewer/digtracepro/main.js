(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _guards_can_load_guard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./guards/can-load.guard */ "./src/app/guards/can-load.guard.ts");
/* harmony import */ var _guards_auth_pages_guard__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./guards/auth-pages.guard */ "./src/app/guards/auth-pages.guard.ts");
/* harmony import */ var _more_components_terms_conditions_terms_conditions_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./more-components/terms-conditions/terms-conditions.component */ "./src/app/more-components/terms-conditions/terms-conditions.component.ts");
/* harmony import */ var _more_components_about_about_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./more-components/about/about.component */ "./src/app/more-components/about/about.component.ts");
/* harmony import */ var _more_components_contact_contact_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./more-components/contact/contact.component */ "./src/app/more-components/contact/contact.component.ts");
/* harmony import */ var _more_components_page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./more-components/page-not-found/page-not-found.component */ "./src/app/more-components/page-not-found/page-not-found.component.ts");
/* harmony import */ var _auth_auth_root_auth_root_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./auth/auth-root/auth-root.component */ "./src/app/auth/auth-root/auth-root.component.ts");
/* harmony import */ var _auth_password_reset_password_reset_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./auth/password-reset/password-reset.component */ "./src/app/auth/password-reset/password-reset.component.ts");
/* harmony import */ var _auth_register_register_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./auth/register/register.component */ "./src/app/auth/register/register.component.ts");
/* harmony import */ var _auth_login_login_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./auth/login/login.component */ "./src/app/auth/login/login.component.ts");
/* harmony import */ var _auth_change_password_change_password_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./auth/change-password/change-password.component */ "./src/app/auth/change-password/change-password.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};













const routes = [
    { path: 'contact', component: _more_components_contact_contact_component__WEBPACK_IMPORTED_MODULE_6__["ContactComponent"] },
    { path: 'terms-conditions', component: _more_components_terms_conditions_terms_conditions_component__WEBPACK_IMPORTED_MODULE_4__["TermsConditionsComponent"] },
    { path: 'about', component: _more_components_about_about_component__WEBPACK_IMPORTED_MODULE_5__["AboutComponent"] },
    {
        path: 'auth',
        component: _auth_auth_root_auth_root_component__WEBPACK_IMPORTED_MODULE_8__["AuthRootComponent"],
        canActivateChild: [_guards_auth_pages_guard__WEBPACK_IMPORTED_MODULE_3__["AuthPagesGuard"]],
        children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: 'login', component: _auth_login_login_component__WEBPACK_IMPORTED_MODULE_11__["LoginComponent"] },
            { path: 'register', component: _auth_register_register_component__WEBPACK_IMPORTED_MODULE_10__["RegisterComponent"] },
            { path: 'forgot-password', component: _auth_password_reset_password_reset_component__WEBPACK_IMPORTED_MODULE_9__["PasswordResetComponent"] },
            { path: 'change-password/:token', component: _auth_change_password_change_password_component__WEBPACK_IMPORTED_MODULE_12__["ChangePasswordComponent"] }
        ],
    },
    {
        path: '',
        loadChildren: () => __webpack_require__.e(/*! import() */ 1).then(__webpack_require__.bind(null, /*! ./pages/pages.module */ "./src/app/pages/pages.module.ts")).then(m => m.PagesModule),
        canLoad: [_guards_can_load_guard__WEBPACK_IMPORTED_MODULE_2__["CanLoadGuard"]]
    },
    { path: '**', component: _more_components_page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_7__["PageNotFoundComponent"] },
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
    })
], AppRoutingModule);



/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<router-outlet></router-outlet>\n"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
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

let AppComponent = class AppComponent {
    constructor() { }
    ngOnInit() { }
};
AppComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-root',
        template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
        styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
    }),
    __metadata("design:paramtypes", [])
], AppComponent);



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm2015/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm2015/animations.js");
/* harmony import */ var _shared_common_shared_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./shared/common-shared.module */ "./src/app/shared/common-shared.module.ts");
/* harmony import */ var _shared_mat_shared_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./shared/mat-shared.module */ "./src/app/shared/mat-shared.module.ts");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var ngx_notification__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-notification */ "./node_modules/ngx-notification/fesm2015/ngx-notification.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _more_components_terms_conditions_terms_conditions_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./more-components/terms-conditions/terms-conditions.component */ "./src/app/more-components/terms-conditions/terms-conditions.component.ts");
/* harmony import */ var _more_components_about_about_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./more-components/about/about.component */ "./src/app/more-components/about/about.component.ts");
/* harmony import */ var _more_components_contact_contact_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./more-components/contact/contact.component */ "./src/app/more-components/contact/contact.component.ts");
/* harmony import */ var _more_components_page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./more-components/page-not-found/page-not-found.component */ "./src/app/more-components/page-not-found/page-not-found.component.ts");
/* harmony import */ var _auth_auth_root_auth_root_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./auth/auth-root/auth-root.component */ "./src/app/auth/auth-root/auth-root.component.ts");
/* harmony import */ var _auth_auth_menu_auth_menu_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./auth/auth-menu/auth-menu.component */ "./src/app/auth/auth-menu/auth-menu.component.ts");
/* harmony import */ var _auth_auth_footer_auth_footer_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./auth/auth-footer/auth-footer.component */ "./src/app/auth/auth-footer/auth-footer.component.ts");
/* harmony import */ var _auth_login_login_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./auth/login/login.component */ "./src/app/auth/login/login.component.ts");
/* harmony import */ var _auth_register_register_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./auth/register/register.component */ "./src/app/auth/register/register.component.ts");
/* harmony import */ var _auth_password_reset_password_reset_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./auth/password-reset/password-reset.component */ "./src/app/auth/password-reset/password-reset.component.ts");
/* harmony import */ var _auth_change_password_change_password_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./auth/change-password/change-password.component */ "./src/app/auth/change-password/change-password.component.ts");
/* harmony import */ var _shared_components_delete_image_modal_delete_image_modal_component__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./shared/components/delete-image-modal/delete-image-modal.component */ "./src/app/shared/components/delete-image-modal/delete-image-modal.component.ts");
/* harmony import */ var _shared_components_delete_job_modal_delete_job_modal_component__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./shared/components/delete-job-modal/delete-job-modal.component */ "./src/app/shared/components/delete-job-modal/delete-job-modal.component.ts");
/* harmony import */ var _shared_components_delete_image_project_modal_delete_image_project_modal_component__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./shared/components/delete-image-project-modal/delete-image-project-modal.component */ "./src/app/shared/components/delete-image-project-modal/delete-image-project-modal.component.ts");
/* harmony import */ var _shared_components_confirm_job_submit_confirm_job_submit_component__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./shared/components/confirm-job-submit/confirm-job-submit.component */ "./src/app/shared/components/confirm-job-submit/confirm-job-submit.component.ts");
/* harmony import */ var _shared_components_confirm_logout_confirm_logout_component__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./shared/components/confirm-logout/confirm-logout.component */ "./src/app/shared/components/confirm-logout/confirm-logout.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
























let AppModule = class AppModule {
};
AppModule = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        declarations: [
            _app_component__WEBPACK_IMPORTED_MODULE_7__["AppComponent"],
            _more_components_terms_conditions_terms_conditions_component__WEBPACK_IMPORTED_MODULE_8__["TermsConditionsComponent"],
            _more_components_about_about_component__WEBPACK_IMPORTED_MODULE_9__["AboutComponent"],
            _more_components_contact_contact_component__WEBPACK_IMPORTED_MODULE_10__["ContactComponent"],
            _more_components_page_not_found_page_not_found_component__WEBPACK_IMPORTED_MODULE_11__["PageNotFoundComponent"],
            _auth_auth_root_auth_root_component__WEBPACK_IMPORTED_MODULE_12__["AuthRootComponent"],
            _auth_auth_menu_auth_menu_component__WEBPACK_IMPORTED_MODULE_13__["AuthMenuComponent"],
            _auth_auth_footer_auth_footer_component__WEBPACK_IMPORTED_MODULE_14__["AuthFooterComponent"],
            _auth_login_login_component__WEBPACK_IMPORTED_MODULE_15__["LoginComponent"],
            _auth_register_register_component__WEBPACK_IMPORTED_MODULE_16__["RegisterComponent"],
            _auth_password_reset_password_reset_component__WEBPACK_IMPORTED_MODULE_17__["PasswordResetComponent"],
            _auth_change_password_change_password_component__WEBPACK_IMPORTED_MODULE_18__["ChangePasswordComponent"],
            _shared_components_delete_image_modal_delete_image_modal_component__WEBPACK_IMPORTED_MODULE_19__["DeleteImageModalComponent"],
            _shared_components_delete_image_project_modal_delete_image_project_modal_component__WEBPACK_IMPORTED_MODULE_21__["DeleteImageProjectModalComponent"],
            _shared_components_delete_job_modal_delete_job_modal_component__WEBPACK_IMPORTED_MODULE_20__["DeleteJobModalComponent"],
            _shared_components_confirm_job_submit_confirm_job_submit_component__WEBPACK_IMPORTED_MODULE_22__["ConfirmJobSubmitComponent"],
            _shared_components_confirm_logout_confirm_logout_component__WEBPACK_IMPORTED_MODULE_23__["ConfirmLogoutComponent"]
        ],
        entryComponents: [
            _shared_components_delete_image_modal_delete_image_modal_component__WEBPACK_IMPORTED_MODULE_19__["DeleteImageModalComponent"],
            _shared_components_delete_image_project_modal_delete_image_project_modal_component__WEBPACK_IMPORTED_MODULE_21__["DeleteImageProjectModalComponent"],
            _shared_components_delete_job_modal_delete_job_modal_component__WEBPACK_IMPORTED_MODULE_20__["DeleteJobModalComponent"],
            _shared_components_confirm_job_submit_confirm_job_submit_component__WEBPACK_IMPORTED_MODULE_22__["ConfirmJobSubmitComponent"],
            _shared_components_confirm_logout_confirm_logout_component__WEBPACK_IMPORTED_MODULE_23__["ConfirmLogoutComponent"]
        ],
        imports: [
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
            _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_2__["BrowserAnimationsModule"],
            _app_routing_module__WEBPACK_IMPORTED_MODULE_5__["AppRoutingModule"],
            _shared_common_shared_module__WEBPACK_IMPORTED_MODULE_3__["CommonSharedModule"],
            _shared_mat_shared_module__WEBPACK_IMPORTED_MODULE_4__["MatSharedModule"],
            ngx_notification__WEBPACK_IMPORTED_MODULE_6__["NgxNotificationModule"],
        ],
        bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_7__["AppComponent"]]
    })
], AppModule);



/***/ }),

/***/ "./src/app/auth/auth-footer/auth-footer.component.css":
/*!************************************************************!*\
  !*** ./src/app/auth/auth-footer/auth-footer.component.css ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/auth/auth-footer/auth-footer.component.html":
/*!*************************************************************!*\
  !*** ./src/app/auth/auth-footer/auth-footer.component.html ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "    \n<div class=\"col-md-6 col-sm-12 footer-text\">\n  <small>Copyright &copy; 2021 DigTraceWeb. All rights reserved.</small>\n</div>\n<div class=\"col-md-6 col-sm-12\">\n  <ul class=\"float-md-right footer-menu\">\n    <li><a routerLink=\"/about\"><small>About</small></a></li>\n    <li><a routerLink=\"/contact\"><small>Contact</small></a></li>\n    <li><a routerLink=\"/terms-conditions\"><small>Terms & Conditions</small></a></li>\n  </ul>\n</div>\n    \n\n"

/***/ }),

/***/ "./src/app/auth/auth-footer/auth-footer.component.ts":
/*!***********************************************************!*\
  !*** ./src/app/auth/auth-footer/auth-footer.component.ts ***!
  \***********************************************************/
/*! exports provided: AuthFooterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthFooterComponent", function() { return AuthFooterComponent; });
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

let AuthFooterComponent = class AuthFooterComponent {
    constructor() { }
    ngOnInit() {
    }
};
AuthFooterComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-auth-footer',
        template: __webpack_require__(/*! ./auth-footer.component.html */ "./src/app/auth/auth-footer/auth-footer.component.html"),
        styles: [__webpack_require__(/*! ./auth-footer.component.css */ "./src/app/auth/auth-footer/auth-footer.component.css")]
    }),
    __metadata("design:paramtypes", [])
], AuthFooterComponent);



/***/ }),

/***/ "./src/app/auth/auth-menu/auth-menu.component.css":
/*!********************************************************!*\
  !*** ./src/app/auth/auth-menu/auth-menu.component.css ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/auth/auth-menu/auth-menu.component.html":
/*!*********************************************************!*\
  !*** ./src/app/auth/auth-menu/auth-menu.component.html ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "  <a class=\"navbar-brand\" routerLink=\"\"><img src=\"../../../assets/icons/logo.png\" width=\"30px\" height=\"30px\"/>DigTraceWeb</a> \n  <button class=\"navbar-toggler border-0\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbarSupportedContent\" aria-controls=\"navbarSupportedContent\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\n    <span class=\"\">\n      <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" fill=\"currentColor\" class=\"bi bi-list\" viewBox=\"0 0 16 16\">\n        <path fill-rule=\"evenodd\" d=\"M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z\"/>\n      </svg>\n    </span>\n  </button>\n\n  <div class=\"collapse navbar-collapse\" id=\"navbarSupportedContent\">\n    <ul class=\"navbar-nav ml-auto\">\n      <li class=\"nav-item mx-2\">\n        <a class=\"nav-link fs-14\" routerLink=\"/auth/login\">Sign in</a>\n      </li>\n      <li class=\"nav-item mx-2\">\n        <a class=\"nav-link fs-14\" routerLink=\"/auth/register\">Create an account</a>\n      </li>\n    </ul>\n  </div>  "

/***/ }),

/***/ "./src/app/auth/auth-menu/auth-menu.component.ts":
/*!*******************************************************!*\
  !*** ./src/app/auth/auth-menu/auth-menu.component.ts ***!
  \*******************************************************/
/*! exports provided: AuthMenuComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthMenuComponent", function() { return AuthMenuComponent; });
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

let AuthMenuComponent = class AuthMenuComponent {
    constructor() { }
    ngOnInit() {
    }
};
AuthMenuComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-auth-menu',
        template: __webpack_require__(/*! ./auth-menu.component.html */ "./src/app/auth/auth-menu/auth-menu.component.html"),
        styles: [__webpack_require__(/*! ./auth-menu.component.css */ "./src/app/auth/auth-menu/auth-menu.component.css")]
    }),
    __metadata("design:paramtypes", [])
], AuthMenuComponent);



/***/ }),

/***/ "./src/app/auth/auth-root/auth-root.component.css":
/*!********************************************************!*\
  !*** ./src/app/auth/auth-root/auth-root.component.css ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/auth/auth-root/auth-root.component.html":
/*!*********************************************************!*\
  !*** ./src/app/auth/auth-root/auth-root.component.html ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"body-bg body-bg-align\">\n  <nav class=\"navbar navbar-expand-lg navbar-dark bg-custom-s1 fixed-top\">\n    <app-auth-menu class=\"container\"></app-auth-menu>\n  </nav>\n  \n  <router-outlet></router-outlet>  \n\n  <footer class=\"bg-gray py-3 pb-md-0 fixed-bottom\">\n    <div class=\"container-md\">\n       <app-auth-footer class=\"row\"></app-auth-footer>\n    </div>\n  </footer>  \n</div>\n\n\n"

/***/ }),

/***/ "./src/app/auth/auth-root/auth-root.component.ts":
/*!*******************************************************!*\
  !*** ./src/app/auth/auth-root/auth-root.component.ts ***!
  \*******************************************************/
/*! exports provided: AuthRootComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthRootComponent", function() { return AuthRootComponent; });
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

let AuthRootComponent = class AuthRootComponent {
    constructor() { }
    ngOnInit() {
    }
};
AuthRootComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-auth-root',
        template: __webpack_require__(/*! ./auth-root.component.html */ "./src/app/auth/auth-root/auth-root.component.html"),
        styles: [__webpack_require__(/*! ./auth-root.component.css */ "./src/app/auth/auth-root/auth-root.component.css")]
    }),
    __metadata("design:paramtypes", [])
], AuthRootComponent);



/***/ }),

/***/ "./src/app/auth/change-password/change-password.component.css":
/*!********************************************************************!*\
  !*** ./src/app/auth/change-password/change-password.component.css ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".label{\n    color: white;\n}"

/***/ }),

/***/ "./src/app/auth/change-password/change-password.component.html":
/*!*********************************************************************!*\
  !*** ./src/app/auth/change-password/change-password.component.html ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"card col-md-4 form-area-lg shadow-lg mx-auto mt-150\">\n  <h4 class=\"text-light mb-3 text-center\"><strong>Set New Password</strong></h4>\n  <!-- <p class=\"text-light mb-4 text-center\">Enter your email to get started</p> -->\n\n  <form>\n    <label class=\"label\">Password</label>\n    <div class=\"form-group\">\n      <input #password=\"ngModel\" ngModel type=\"password\" name=\"password\"\n             class=\"text-light form-input mb-2\" placeholder=\"Password\">\n    </div>\n\n    <label class=\"label\">Retype Password</label>\n    <div class=\"form-group\">\n      <input #re_password=\"ngModel\" (change)=\"checkPassword(password,re_password)\" ngModel type=\"password\" name=\"re_password\"\n             class=\"text-light form-input mb-2\" placeholder=\"Retype Password\">\n             <p *ngIf=\"alertMessage\" class=\"alert-danger text-left\">{{alertMessage}}</p>\n    </div>\n    \n\n    <div *ngIf=\"errorMessage\" class=\"alert alert-danger fade show text-center\">\n      <small>{{errorMessage}}</small>      \n    </div>\n    <div *ngIf=\"successMessage\" class=\"alert alert-success show text-center\">\n      <small>{{successMessage}}</small>      \n    </div>\n\n    <button type=\"submit\" [disabled]=\"buttonDisable\" class=\"btn btn-custom btn-sm mb-2 w-100\" \n    (click)=\"setNewPassword(password, re_password)\">Submit</button>\n  </form>\n</div>"

/***/ }),

/***/ "./src/app/auth/change-password/change-password.component.ts":
/*!*******************************************************************!*\
  !*** ./src/app/auth/change-password/change-password.component.ts ***!
  \*******************************************************************/
/*! exports provided: ChangePasswordComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChangePasswordComponent", function() { return ChangePasswordComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var src_app_services_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/services/api.service */ "./src/app/services/api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let ChangePasswordComponent = class ChangePasswordComponent {
    constructor(apiService, router, activatedRoute) {
        this.apiService = apiService;
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.buttonDisable = false;
    }
    ngOnInit() {
        this.activatedRoute.paramMap.subscribe(params => {
            this.token = params.get('token');
        });
    }
    checkPassword(password, re_password) {
        if (password.value != re_password.value && re_password != "") {
            this.alertMessage = "password doesn't match";
        }
        else {
            this.alertMessage = null;
        }
    }
    setNewPassword(password, re_password) {
        this.errorMessage = null;
        this.successMessage = null;
        this.buttonDisable = true;
        let data = {
            password: password.value,
            re_password: re_password.value
        };
        console.log(this.token);
        console.log(data);
        let headers = {
            "Authorization": "Bearer " + this.token,
            "Content-Type": "application/json"
        };
        this.apiService.callApi('/api/user/change-password/', 'POST', JSON.stringify(data), headers, true)
            .subscribe({
            next: (response) => {
                console.log(response);
                this.successMessage = response["message"];
                // localStorage.setItem('digtrace',JSON.stringify({token:res["token"]["access"],username:res["username"]}))
                // this.router.navigateByUrl('/')                            
            },
            error: (response) => {
                console.log(response);
                if (response) {
                    if (response.status == 401) {
                        this.errorMessage = "Your password-reset link is not valid";
                    }
                    else {
                        this.errorMessage = response.error["errors"][0];
                        console.log(response.error);
                        this.buttonDisable = false;
                    }
                }
            },
            complete: () => console.log('Password updated successfully')
        });
    }
};
ChangePasswordComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-change-password',
        template: __webpack_require__(/*! ./change-password.component.html */ "./src/app/auth/change-password/change-password.component.html"),
        styles: [__webpack_require__(/*! ./change-password.component.css */ "./src/app/auth/change-password/change-password.component.css")]
    }),
    __metadata("design:paramtypes", [src_app_services_api_service__WEBPACK_IMPORTED_MODULE_2__["ApiService"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"]])
], ChangePasswordComponent);



/***/ }),

/***/ "./src/app/auth/login/login.component.css":
/*!************************************************!*\
  !*** ./src/app/auth/login/login.component.css ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/auth/login/login.component.html":
/*!*************************************************!*\
  !*** ./src/app/auth/login/login.component.html ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div [ngStyle]=\"{'height':'80vh'}\">\n  <div class=\"container form-area shadow-lg\">\n    <h4 class=\"text-light mb-4 text-center\">Sign in to your account</h4>\n    <form>\n      <div class=\"form-group\">\n        <input #username=\"ngModel\" ngModel type=\"text\" name=\"username\"\n               class=\"text-light form-input mb-2\" placeholder=\"Username/Email\">\n      </div>\n      <div class=\"form-group\">\n        <input #password=\"ngModel\" ngModel type=\"password\" name=\"password\"\n               class=\"text-light form-input mb-2\" placeholder=\"Password\">\n      </div>\n      <div class=\"form-group form-check text-center\">\n        <input required form-control #loginCheck=\"ngModel\" ngModel type=\"checkbox\" name=\"loginCheck\" class=\"form-check-input\">\n        <label class=\"form-check-label text-light mb-2\" for=\"exampleCheck1\">Remember me</label>\n      </div>\n      \n      <div *ngIf=\"errorMsg\" class=\"alert alert-danger fade show text-center\">\n        <small>{{errorMsg}}</small>      \n      </div>\n      <button type=\"submit\" class=\"btn btn-custom btn-sm mb-2 w-100\" \n              (click)=\"loginOnClick(username,password,loginCheck)\"\n      >\n        Sign in\n      </button>\n      <div class=\"mt-4 text-center\">\n        <a routerLink=\"/auth/forgot-password\" class=\"text-light fs-14\">Forgot Password? Click Here</a>\n      </div>\n    </form>\n  </div>\n</div>\n"

/***/ }),

/***/ "./src/app/auth/login/login.component.ts":
/*!***********************************************!*\
  !*** ./src/app/auth/login/login.component.ts ***!
  \***********************************************/
/*! exports provided: LoginComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginComponent", function() { return LoginComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var src_app_services_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/services/api.service */ "./src/app/services/api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let LoginComponent = class LoginComponent {
    constructor(apiService, router) {
        this.apiService = apiService;
        this.router = router;
    }
    ngOnInit() {
    }
    loginOnClick(username, password, loginCheck) {
        let loginInfo = {
            username_email: username.value,
            password: password.value
        };
        let headers = {
            "Content-Type": "application/json"
        };
        this.apiService.callApi('/api/user/login/', 'POST', JSON.stringify(loginInfo), headers, true)
            .subscribe({
            next: (res) => {
                this.setToken(res['token']['access'], res['username'], 86400000);
                this.router.navigateByUrl('/');
            },
            error: (err) => {
                if (err) {
                    this.errorMsg = "Invalid username/password";
                    console.log(err);
                }
            },
            complete: () => console.log('Successfully Logged in')
        });
    }
    setToken(token, userName, duration) {
        let expiryDate = new Date().getTime() + duration;
        let tokenData = { token, userName, expiryDate };
        localStorage.setItem('digtrace', JSON.stringify(tokenData));
    }
};
LoginComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-login',
        template: __webpack_require__(/*! ./login.component.html */ "./src/app/auth/login/login.component.html"),
        styles: [__webpack_require__(/*! ./login.component.css */ "./src/app/auth/login/login.component.css")]
    }),
    __metadata("design:paramtypes", [src_app_services_api_service__WEBPACK_IMPORTED_MODULE_2__["ApiService"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
], LoginComponent);



/***/ }),

/***/ "./src/app/auth/password-reset/password-reset.component.css":
/*!******************************************************************!*\
  !*** ./src/app/auth/password-reset/password-reset.component.css ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".btn-success-msg{\n    background-color: cornflowerblue;\n    color:white;\n    border-radius: 5px;\n}\n\n.btn-success-msg:hover{\n    opacity: .8;    \n}"

/***/ }),

/***/ "./src/app/auth/password-reset/password-reset.component.html":
/*!*******************************************************************!*\
  !*** ./src/app/auth/password-reset/password-reset.component.html ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div [ngStyle]=\"{'height':'80vh'}\">\n  <div class=\"container form-area-lg shadow-lg mx-auto\" *ngIf=\"!successMessage\">\n    <h4 class=\"text-light mb-3 text-center\"><strong>Having trouble signing in?</strong></h4>\n    <p class=\"text-light mb-4 text-center\">Enter your email to get started</p>\n    <form>\n      <div class=\"form-group\">\n        <input type=\"text\" #email=\"ngModel\" ngModel type=\"text\" name=\"email\" \n        class=\"text-light form-input mb-1\" id=\"forgotInputEmail\" placeholder=\"Email Address\">      \n        <small *ngIf=\"errorMessage\" class=\"text-center text-danger mt-2\">{{errorMessage}}</small>            \n      </div>       \n      <button type=\"submit\" [disabled]=\"buttonDisable\" class=\"btn btn-custom btn-sm mb-2 w-100\" \n      (click)=\"sendResetPasswordMail(email)\">Continue</button>\n    </form>\n  </div>\n  \n  \n  <div *ngIf=\"successMessage\" class=\"form-area-lg bg-gray shadow-lg show mx-auto\">\n    <div class=\"text-white text-center\">\n      {{successMessage}}\n    </div> \n    <button routerLink=\"/login\" class=\"d-flex mx-auto mt-4 px-4 py-2 btn btn-success-msg\">\n      Log in\n    </button>  \n  </div> \n</div>   \n"

/***/ }),

/***/ "./src/app/auth/password-reset/password-reset.component.ts":
/*!*****************************************************************!*\
  !*** ./src/app/auth/password-reset/password-reset.component.ts ***!
  \*****************************************************************/
/*! exports provided: PasswordResetComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PasswordResetComponent", function() { return PasswordResetComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var src_app_services_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/services/api.service */ "./src/app/services/api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let PasswordResetComponent = class PasswordResetComponent {
    constructor(apiService, router) {
        this.apiService = apiService;
        this.router = router;
        this.buttonDisable = false;
    }
    sendResetPasswordMail(email) {
        this.errorMessage = null;
        this.successMessage = null;
        this.buttonDisable = true;
        let data = {
            email: email.value,
        };
        let headers = {
            "Content-Type": "application/json"
        };
        this.apiService.callApi('/api/user/reset-password/', 'POST', JSON.stringify(data), headers, true)
            .subscribe({
            next: (response) => {
                console.log(response);
                this.successMessage = response["message"];
                // localStorage.setItem('digtrace',JSON.stringify({token:res["token"]["access"],username:res["username"]}))
                // this.router.navigateByUrl('/')                            
            },
            error: (response) => {
                if (response) {
                    this.errorMessage = response.error["errors"][0];
                    console.log(response.error);
                    this.buttonDisable = false;
                }
            },
            complete: () => console.log('A password reset link sent to your email')
        });
    }
    ngOnInit() {
    }
};
PasswordResetComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-password-reset',
        template: __webpack_require__(/*! ./password-reset.component.html */ "./src/app/auth/password-reset/password-reset.component.html"),
        styles: [__webpack_require__(/*! ./password-reset.component.css */ "./src/app/auth/password-reset/password-reset.component.css")]
    }),
    __metadata("design:paramtypes", [src_app_services_api_service__WEBPACK_IMPORTED_MODULE_2__["ApiService"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
], PasswordResetComponent);



/***/ }),

/***/ "./src/app/auth/register/register.component.css":
/*!******************************************************!*\
  !*** ./src/app/auth/register/register.component.css ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/auth/register/register.component.html":
/*!*******************************************************!*\
  !*** ./src/app/auth/register/register.component.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"container form-area-lg shadow-lg\" [ngStyle]=\"{'margin-bottom':'80px'}\">\n  <h4 class=\"text-light mb-2 text-center\">Create a new account</h4>\n  <form [formGroup]=\"registerForm\" (ngSubmit)=\"registerOnSubmit()\">\n    <div class=\"form-group\">\n      <input type=\"text\" class=\"text-light form-input w-48\" placeholder=\"First Name\"\n             formControlName=\"firstName\"\n      >\n      <input type=\"text\" class=\"text-light form-input w-48 float-right\" \n             formControlName=\"lastName\" placeholder=\"Last Name\"\n      >\n    </div>    \n    <div class=\"form-group\">\n      <input type=\"text\" class=\"text-light form-input\" placeholder=\"Username*\" \n             formControlName=\"userName\"\n      >     \n      <small *ngIf=\"userName.invalid && allAlerts\" class=\"text-danger ml-1\">\n          Username is required\n      </small>\n    </div>\n    <div class=\"form-group\">\n      <input type=\"text\" class=\"text-light form-input\" placeholder=\"Institute*\" \n             formControlName=\"institute\"\n      >\n      <small *ngIf=\"institute.invalid && allAlerts\" class=\"text-danger ml-1\">\n        Institute name is required\n      </small>\n    </div>\n    <div class=\"form-group\">\n      <input type=\"email\" class=\"text-light form-input\" placeholder=\"Email*\" \n             formControlName=\"email\"\n      >\n      <small *ngIf=\"email.invalid && allAlerts\" class=\"text-danger ml-1\">\n        Email is required\n      </small>\n    </div>\n    <div class=\"form-group\">\n      <input type=\"password\" class=\"text-light form-input mb-2\" placeholder=\"Password*\" \n             formControlName=\"password\"\n      >\n      <small *ngIf=\"password.invalid && allAlerts\" class=\"text-danger ml-1 mb-2\">\n        Password is required\n      </small>\n      <small class=\"text-light passwordList\">\n        <ul>\n          <li>Your passwordword can't be too similar to your other personal information.</li>\n          <li>Your passwordword must contain at least 8 characters.</li>\n          <li>Your passwordword can't be a commonly used password.</li>\n          <li>Your passwordword can't be entirely numeric.</li>\n        </ul>\n      </small>      \n      <input type=\"password\" class=\"text-light form-input mb-1\" placeholder=\"Confirm Password*\" \n             formControlName=\"confirmPassword\"\n      >  \n      <small *ngIf=\"confirmPassword.invalid && allAlerts\" class=\"text-danger ml-1\">\n        Password has to be confirmed\n      </small>    \n    </div>\n    <div class=\"form-group form-check text-center mt-4\">\n      <input type=\"checkbox\" class=\"form-check-input\" formControlName=\"registerCheck\">\n      <label class=\"form-check-label text-light\" for=\"registerCheck\">I agree to the terms & conditions</label>      \n      <small *ngIf=\"registerCheck.invalid && allAlerts\" class=\"text-danger ml-1 d-block mt-2\">\n        You must agree to the terms and conditions first\n      </small>\n    </div>            \n    <button type=\"submit\" class=\"btn btn-custom btn-sm w-100 mt-4\">\n      Register\n    </button>    \n    <div class=\"mt-2 text-center\">\n      <a routerLink=\"/auth/login\" class=\"text-light fs-14\">Already have an account? Sign in</a>\n    </div>\n  </form>\n</div>"

/***/ }),

/***/ "./src/app/auth/register/register.component.ts":
/*!*****************************************************!*\
  !*** ./src/app/auth/register/register.component.ts ***!
  \*****************************************************/
/*! exports provided: RegisterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RegisterComponent", function() { return RegisterComponent; });
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




let RegisterComponent = class RegisterComponent {
    constructor(apiService, router, fb) {
        this.apiService = apiService;
        this.router = router;
        this.fb = fb;
        this.errorMsgs = {};
    }
    ngOnInit() {
        this.registerForm = this.fb.group({
            firstName: [''],
            lastName: [''],
            userName: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].minLength(1)]],
            email: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].minLength(1)]],
            password: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].minLength(1)]],
            confirmPassword: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].minLength(1)]],
            institute: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].minLength(1)]],
            registerCheck: [false, [_angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].required, _angular_forms__WEBPACK_IMPORTED_MODULE_1__["Validators"].requiredTrue]]
        });
    }
    get userName() {
        return this.registerForm.get('userName');
    }
    get email() {
        return this.registerForm.get('email');
    }
    get password() {
        return this.registerForm.get('password');
    }
    get confirmPassword() {
        return this.registerForm.get('confirmPassword');
    }
    get institute() {
        return this.registerForm.get('institute');
    }
    get registerCheck() {
        return this.registerForm.get('registerCheck');
    }
    registerOnSubmit() {
        if (this.registerForm.invalid) {
            this.allAlerts = true;
            return null;
        }
        this.userInfo = {
            first_name: this.registerForm.value.firstName,
            last_name: this.registerForm.value.lastName,
            username: this.registerForm.value.userName,
            email: this.registerForm.value.email,
            password: this.registerForm.value.password,
            institute: this.registerForm.value.institute
        };
        let headers = {
            "Content-Type": "application/json"
        };
        this.apiService.callApi('/api/user/register/', 'POST', JSON.stringify(this.userInfo), headers, true)
            .subscribe({
            next: (res) => {
                this.router.navigateByUrl('auth/login');
            },
            error: (res) => {
                let errors = res.error.errors;
                this.errorMsgs = {
                    userName: errors.username ? errors.username[0] : '',
                    email: errors.email ? errors.email[0] : '',
                    password: errors.password ? errors.password[0] : '',
                    confirmPassword: errors.confirmPassword ? errors.confirmPassword[0] : '',
                    institute: errors.institute ? errors.institute[0] : '',
                    registerCheck: errors.registerCheck ? errors.registerCheck[0] : ''
                };
            },
            complete: () => {
                console.log('Registration Complete');
            }
        });
    }
};
RegisterComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-register',
        template: __webpack_require__(/*! ./register.component.html */ "./src/app/auth/register/register.component.html"),
        styles: [__webpack_require__(/*! ./register.component.css */ "./src/app/auth/register/register.component.css")],
    }),
    __metadata("design:paramtypes", [src_app_services_api_service__WEBPACK_IMPORTED_MODULE_3__["ApiService"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"], _angular_forms__WEBPACK_IMPORTED_MODULE_1__["FormBuilder"]])
], RegisterComponent);



/***/ }),

/***/ "./src/app/guards/auth-pages.guard.ts":
/*!********************************************!*\
  !*** ./src/app/guards/auth-pages.guard.ts ***!
  \********************************************/
/*! exports provided: AuthPagesGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthPagesGuard", function() { return AuthPagesGuard; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


let AuthPagesGuard = class AuthPagesGuard {
    constructor(router) {
        this.router = router;
    }
    canActivateChild() {
        if (localStorage.getItem('digtrace')) {
            this.router.navigateByUrl("/jobs");
            return false;
        }
        else {
            return true;
        }
    }
};
AuthPagesGuard = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
        providedIn: 'root'
    }),
    __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
], AuthPagesGuard);



/***/ }),

/***/ "./src/app/guards/can-load.guard.ts":
/*!******************************************!*\
  !*** ./src/app/guards/can-load.guard.ts ***!
  \******************************************/
/*! exports provided: CanLoadGuard */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CanLoadGuard", function() { return CanLoadGuard; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


let CanLoadGuard = class CanLoadGuard {
    constructor(router) {
        this.router = router;
    }
    canLoad() {
        if (!localStorage.getItem('digtrace')) {
            this.router.navigateByUrl('/auth/login');
        }
        else {
            return true;
        }
    }
};
CanLoadGuard = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
        providedIn: 'root'
    }),
    __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
], CanLoadGuard);



/***/ }),

/***/ "./src/app/more-components/about/about.component.css":
/*!***********************************************************!*\
  !*** ./src/app/more-components/about/about.component.css ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".main{              \n    position:relative;\n    top:100px;           \n}\n"

/***/ }),

/***/ "./src/app/more-components/about/about.component.html":
/*!************************************************************!*\
  !*** ./src/app/more-components/about/about.component.html ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div>\n    <nav class=\"navbar navbar-expand-lg navbar-dark bg-custom-s1 fixed-top\">\n      <app-auth-menu class=\"container\"></app-auth-menu>\n    </nav>\n  \n    <section class=\"container main\" [innerHtml]=\"currentPage\">\n      \n    </section>\n  \n    <footer class=\"bg-gray py-3 pb-md-0 fixed-bottom\">\n      <div class=\"container-md\">\n         <app-auth-footer class=\"row\"></app-auth-footer>\n      </div>\n    </footer>  \n  </div>"

/***/ }),

/***/ "./src/app/more-components/about/about.component.ts":
/*!**********************************************************!*\
  !*** ./src/app/more-components/about/about.component.ts ***!
  \**********************************************************/
/*! exports provided: AboutComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AboutComponent", function() { return AboutComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var src_app_services_api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/services/api.service */ "./src/app/services/api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


let AboutComponent = class AboutComponent {
    constructor(apiService) {
        this.apiService = apiService;
    }
    ngOnInit() {
        this.apiService.callApi('/digtrace/api/about/', 'GET', undefined, undefined, true)
            .subscribe(res => {
            this.templates = res['data'].pages;
            this.currentPage = this.templates[0].text;
            console.log(this.currentPage);
        });
    }
};
AboutComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-about',
        template: __webpack_require__(/*! ./about.component.html */ "./src/app/more-components/about/about.component.html"),
        styles: [__webpack_require__(/*! ./about.component.css */ "./src/app/more-components/about/about.component.css")]
    }),
    __metadata("design:paramtypes", [src_app_services_api_service__WEBPACK_IMPORTED_MODULE_1__["ApiService"]])
], AboutComponent);



/***/ }),

/***/ "./src/app/more-components/contact/contact.component.css":
/*!***************************************************************!*\
  !*** ./src/app/more-components/contact/contact.component.css ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".main{              \n    position:relative;\n    top:100px;           \n}\n"

/***/ }),

/***/ "./src/app/more-components/contact/contact.component.html":
/*!****************************************************************!*\
  !*** ./src/app/more-components/contact/contact.component.html ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div>\n    <nav class=\"navbar navbar-expand-lg navbar-dark bg-custom-s1 fixed-top\">\n      <app-auth-menu class=\"container\"></app-auth-menu>\n    </nav>\n  \n    <section class=\"container main\" [innerHtml]=\"currentPage\">\n      \n    </section>\n  \n    <footer class=\"bg-gray py-3 pb-md-0 fixed-bottom\">\n      <div class=\"container-md\">\n         <app-auth-footer class=\"row\"></app-auth-footer>\n      </div>\n    </footer>  \n</div>\n"

/***/ }),

/***/ "./src/app/more-components/contact/contact.component.ts":
/*!**************************************************************!*\
  !*** ./src/app/more-components/contact/contact.component.ts ***!
  \**************************************************************/
/*! exports provided: ContactComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ContactComponent", function() { return ContactComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var src_app_services_api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/services/api.service */ "./src/app/services/api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


let ContactComponent = class ContactComponent {
    constructor(apiService) {
        this.apiService = apiService;
    }
    ngOnInit() {
        this.apiService.callApi('/digtrace/api/contacts/', 'GET', undefined, undefined, true)
            .subscribe(res => {
            this.templates = res['data'].pages;
            this.currentPage = this.templates[0].text;
            console.log(this.currentPage);
        });
    }
};
ContactComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-contact',
        template: __webpack_require__(/*! ./contact.component.html */ "./src/app/more-components/contact/contact.component.html"),
        styles: [__webpack_require__(/*! ./contact.component.css */ "./src/app/more-components/contact/contact.component.css")]
    }),
    __metadata("design:paramtypes", [src_app_services_api_service__WEBPACK_IMPORTED_MODULE_1__["ApiService"]])
], ContactComponent);



/***/ }),

/***/ "./src/app/more-components/page-not-found/page-not-found.component.css":
/*!*****************************************************************************!*\
  !*** ./src/app/more-components/page-not-found/page-not-found.component.css ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/more-components/page-not-found/page-not-found.component.html":
/*!******************************************************************************!*\
  !*** ./src/app/more-components/page-not-found/page-not-found.component.html ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"d-flex flex-column items-center py-5 my-5\">\n  <h2 class=\"row m-auto\">\n    404  \n  </h2>\n  <h2 class=\"row m-auto\">\n    page not found\n  </h2>\n</div>\n"

/***/ }),

/***/ "./src/app/more-components/page-not-found/page-not-found.component.ts":
/*!****************************************************************************!*\
  !*** ./src/app/more-components/page-not-found/page-not-found.component.ts ***!
  \****************************************************************************/
/*! exports provided: PageNotFoundComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PageNotFoundComponent", function() { return PageNotFoundComponent; });
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

let PageNotFoundComponent = class PageNotFoundComponent {
    constructor() { }
    ngOnInit() {
    }
};
PageNotFoundComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-page-not-found',
        template: __webpack_require__(/*! ./page-not-found.component.html */ "./src/app/more-components/page-not-found/page-not-found.component.html"),
        styles: [__webpack_require__(/*! ./page-not-found.component.css */ "./src/app/more-components/page-not-found/page-not-found.component.css")]
    }),
    __metadata("design:paramtypes", [])
], PageNotFoundComponent);



/***/ }),

/***/ "./src/app/more-components/terms-conditions/terms-conditions.component.css":
/*!*********************************************************************************!*\
  !*** ./src/app/more-components/terms-conditions/terms-conditions.component.css ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".main{              \n    position:relative;\n    top:100px;           \n}\n"

/***/ }),

/***/ "./src/app/more-components/terms-conditions/terms-conditions.component.html":
/*!**********************************************************************************!*\
  !*** ./src/app/more-components/terms-conditions/terms-conditions.component.html ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div>\n    <nav class=\"navbar navbar-expand-lg navbar-dark bg-custom-s1 fixed-top\">\n      <app-auth-menu class=\"container\"></app-auth-menu>\n    </nav>\n  \n    <section class=\"container main\" [innerHtml]=\"currentPage\">\n      \n    </section>\n  \n    <footer class=\"bg-gray py-3 pb-md-0 fixed-bottom\">\n      <div class=\"container-md\">\n         <app-auth-footer class=\"row\"></app-auth-footer>\n      </div>\n    </footer>  \n  </div>"

/***/ }),

/***/ "./src/app/more-components/terms-conditions/terms-conditions.component.ts":
/*!********************************************************************************!*\
  !*** ./src/app/more-components/terms-conditions/terms-conditions.component.ts ***!
  \********************************************************************************/
/*! exports provided: TermsConditionsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TermsConditionsComponent", function() { return TermsConditionsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var src_app_services_api_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/services/api.service */ "./src/app/services/api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


let TermsConditionsComponent = class TermsConditionsComponent {
    constructor(apiService) {
        this.apiService = apiService;
    }
    ngOnInit() {
        this.apiService.callApi('/digtrace/api/terms-conditions/', 'GET', undefined, undefined, true)
            .subscribe(res => {
            this.templates = res['data'].pages;
            this.currentPage = this.templates[0].text;
        });
    }
};
TermsConditionsComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-terms-conditions',
        template: __webpack_require__(/*! ./terms-conditions.component.html */ "./src/app/more-components/terms-conditions/terms-conditions.component.html"),
        styles: [__webpack_require__(/*! ./terms-conditions.component.css */ "./src/app/more-components/terms-conditions/terms-conditions.component.css")]
    }),
    __metadata("design:paramtypes", [src_app_services_api_service__WEBPACK_IMPORTED_MODULE_1__["ApiService"]])
], TermsConditionsComponent);



/***/ }),

/***/ "./src/app/services/api.service.ts":
/*!*****************************************!*\
  !*** ./src/app/services/api.service.ts ***!
  \*****************************************/
/*! exports provided: ApiService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ApiService", function() { return ApiService; });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/environments/environment */ "./src/environments/environment.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




let ApiService = class ApiService {
    constructor(http, router) {
        this.http = http;
        this.router = router;
        this.apiRoot = src_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"]['apiUrl'];
    }
    // apiRoot = "http://localhost:8200"
    // apiRoot = "http://54.179.11.137:8003"
    callApi(path, method = "GET", body, headerItems, authPage, others) {
        let options = Object.assign({ body, headers: Object.assign({ "Authorization": !authPage && ("Bearer" + " " + this.getToken('digtrace')) }, headerItems) }, others);
        return this.http.request(method, this.apiRoot + path, options);
    }
    getToken(tokenName) {
        let now = new Date();
        let itemStr = localStorage.getItem(tokenName);
        if (!itemStr) {
            this.router.navigateByUrl('/auth/login');
        }
        let item = JSON.parse(itemStr);
        if (now.getTime() > item.expiryDate) {
            localStorage.removeItem('digtrace');
            this.router.navigateByUrl('auth/login');
        }
        else {
            return item.token;
        }
    }
};
ApiService = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
        providedIn: 'root'
    }),
    __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_0__["HttpClient"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
], ApiService);



/***/ }),

/***/ "./src/app/shared/common-shared.module.ts":
/*!************************************************!*\
  !*** ./src/app/shared/common-shared.module.ts ***!
  \************************************************/
/*! exports provided: CommonSharedModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CommonSharedModule", function() { return CommonSharedModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm2015/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




let CommonSharedModule = class CommonSharedModule {
};
CommonSharedModule = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
        ],
        exports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ReactiveFormsModule"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"],
        ],
    })
], CommonSharedModule);



/***/ }),

/***/ "./src/app/shared/components/confirm-job-submit/confirm-job-submit.component.css":
/*!***************************************************************************************!*\
  !*** ./src/app/shared/components/confirm-job-submit/confirm-job-submit.component.css ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".title{\n    font-size: 25px;\n    font-family: 'Times New Roman', Times, serif;\n    font-weight:bold;\n    display:flex;\n    justify-content: center;\n    align-items:center;\n    margin-top:15px;         \n}\n\n.buttons{\n    display:flex;\n    justify-content: center;   \n    margin:10px;                        \n}\n\n.buttons button{    \n    width: 160px;\n    padding-top: 8px;\n    padding-bottom: 8px;\n    border-radius: 3px;\n    border: 1px solid #00000008;\n    margin: 0px 15px;\n}\n\n.cancelBtn{\n    background:white;       \n}\n\n.cancelBtn:hover{\n    background:#ddd;    \n}\n\n.confirmBtn{\n    background: #88cc88;\n    color:white;    \n    border: 1px solid #00000008;\n}\n\n.confirmBtn:hover{\n    background: #88cc88dd;\n}\n\n\n"

/***/ }),

/***/ "./src/app/shared/components/confirm-job-submit/confirm-job-submit.component.html":
/*!****************************************************************************************!*\
  !*** ./src/app/shared/components/confirm-job-submit/confirm-job-submit.component.html ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2 mat-dialog-title class=\"title\">Submit your job? This action cannot be undone</h2>\n\n<div *ngIf=\"submitModalErrors\" class=\"alert alert-block text-danger p-0\"> \n  <ul [ngStyle]=\"{'padding-left':'20px'}\"> \n    <li *ngFor=\"let warning of submitModalErrors\">\n      {{warning}}\n    </li> \n  </ul> \n</div>\n\n<div>\n  <input [ngStyle]=\"{'padding-left':'20px'}\" type=\"checkbox\" [(ngModel)]=\"submitCheck\">\n  <label for=\"submitCheck\" style=\"margin-left:10px\">Submit Job</label>\n</div>\n<div mat-dialog-actions class=\"buttons\">  \n  <button mat-button mat-dialog-close (click)=\"cancelModal()\" class=\"cancelBtn\">Cancel</button>\n  <button  mat-button mat-dialog-close (click)=\"confirmModal()\" class=\"confirmBtn\">Submit Job</button>\n</div>"

/***/ }),

/***/ "./src/app/shared/components/confirm-job-submit/confirm-job-submit.component.ts":
/*!**************************************************************************************!*\
  !*** ./src/app/shared/components/confirm-job-submit/confirm-job-submit.component.ts ***!
  \**************************************************************************************/
/*! exports provided: ConfirmJobSubmitComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConfirmJobSubmitComponent", function() { return ConfirmJobSubmitComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm2015/material.js");
/* harmony import */ var src_app_services_api_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/services/api.service */ "./src/app/services/api.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};



let ConfirmJobSubmitComponent = class ConfirmJobSubmitComponent {
    constructor(apiService, dialogRef, data) {
        this.apiService = apiService;
        this.dialogRef = dialogRef;
        this.data = data;
    }
    ngOnInit() {
        this.jobId = this.data.jobId;
        this.apiService.callApi(`/api/job/${this.jobId}/submit/`)
            .subscribe(res => {
            this.submitCheck = res['data'].job_submit;
            this.submitModalErrors = res["errors"];
        });
    }
    cancelModal() {
        this.dialogRef.close({ value: 'cancel' });
    }
    confirmModal() {
        this.dialogRef.close({
            value: 'confirm',
            checkValue: this.submitCheck
        });
    }
};
ConfirmJobSubmitComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-confirm-job-submit',
        template: __webpack_require__(/*! ./confirm-job-submit.component.html */ "./src/app/shared/components/confirm-job-submit/confirm-job-submit.component.html"),
        styles: [__webpack_require__(/*! ./confirm-job-submit.component.css */ "./src/app/shared/components/confirm-job-submit/confirm-job-submit.component.css")]
    }),
    __param(2, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
    __metadata("design:paramtypes", [src_app_services_api_service__WEBPACK_IMPORTED_MODULE_2__["ApiService"], _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object])
], ConfirmJobSubmitComponent);



/***/ }),

/***/ "./src/app/shared/components/confirm-logout/confirm-logout.component.css":
/*!*******************************************************************************!*\
  !*** ./src/app/shared/components/confirm-logout/confirm-logout.component.css ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".title{\n    font-size: 25px;\n    font-family: 'Times New Roman', Times, serif;\n    font-weight:bold;\n    display:flex;\n    justify-content: center;\n    align-items:center;\n    margin-top:15px;        \n}\n\n.buttons{\n    display:flex;\n    justify-content: center;   \n    margin-bottom:10px;                     \n}\n\n.buttons button{    \n    width: 160px;\n    padding-top: 8px;\n    padding-bottom: 8px;\n    border-radius: 3px;\n    border: 1px solid #00000008;\n    margin: 0px 15px;\n}\n\n.cancelBtn{\n    background:white;        \n}\n\n.cancelBtn:hover{\n    background:#ddd;\n}\n\n.confirmBtn{\n    background: #ff0000;\n    color:white;    \n    border: 1px solid #00000008;\n}\n\n.confirmBtn:hover{\n    background: #ff0000dd;\n}\n"

/***/ }),

/***/ "./src/app/shared/components/confirm-logout/confirm-logout.component.html":
/*!********************************************************************************!*\
  !*** ./src/app/shared/components/confirm-logout/confirm-logout.component.html ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2 mat-dialog-title class=\"title\">Are you sure you want to log out?</h2>\n<div mat-dialog-actions class=\"buttons\">\n  <button mat-button mat-dialog-close (click)=\"cancelModal()\" class=\"cancelBtn\">Cancel</button>\n  <button mat-button mat-dialog-close (click)=\"confirmModal()\" class=\"confirmBtn\">Confirm Logout</button>\n</div>\n"

/***/ }),

/***/ "./src/app/shared/components/confirm-logout/confirm-logout.component.ts":
/*!******************************************************************************!*\
  !*** ./src/app/shared/components/confirm-logout/confirm-logout.component.ts ***!
  \******************************************************************************/
/*! exports provided: ConfirmLogoutComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConfirmLogoutComponent", function() { return ConfirmLogoutComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm2015/material.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


let ConfirmLogoutComponent = class ConfirmLogoutComponent {
    constructor(dialogRef) {
        this.dialogRef = dialogRef;
    }
    ngOnInit() {
    }
    cancelModal() {
        this.dialogRef.close('cancel');
    }
    confirmModal() {
        this.dialogRef.close('confirm');
    }
};
ConfirmLogoutComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-confirm-logout',
        template: __webpack_require__(/*! ./confirm-logout.component.html */ "./src/app/shared/components/confirm-logout/confirm-logout.component.html"),
        styles: [__webpack_require__(/*! ./confirm-logout.component.css */ "./src/app/shared/components/confirm-logout/confirm-logout.component.css")]
    }),
    __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"]])
], ConfirmLogoutComponent);



/***/ }),

/***/ "./src/app/shared/components/delete-image-modal/delete-image-modal.component.css":
/*!***************************************************************************************!*\
  !*** ./src/app/shared/components/delete-image-modal/delete-image-modal.component.css ***!
  \***************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".title{\n    font-size: 25px;\n    font-family: 'Times New Roman', Times, serif;\n    font-weight:bold;\n    display:flex;\n    justify-content: center;\n    align-items:center;\n    margin-top:15px;        \n}\n\n.buttons{\n    display:flex;\n    justify-content: center;   \n    margin-bottom:10px;                     \n}\n\n.buttons button{    \n    width: 160px;\n    padding-top: 8px;\n    padding-bottom: 8px;\n    border-radius: 3px;\n    border: 1px solid #00000008;\n    margin: 0px 15px;\n}\n\n.cancelBtn{\n    background:white;        \n}\n\n.cancelBtn:hover{\n    background:#ddd;\n}\n\n.confirmBtn{\n    background: #ff0000;\n    color:white;    \n    border: 1px solid #00000008;\n}\n\n.confirmBtn:hover{\n    background: #ff0000dd;\n}\n"

/***/ }),

/***/ "./src/app/shared/components/delete-image-modal/delete-image-modal.component.html":
/*!****************************************************************************************!*\
  !*** ./src/app/shared/components/delete-image-modal/delete-image-modal.component.html ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2 mat-dialog-title class=\"title\">Delete this image?</h2>\n<div mat-dialog-actions class=\"buttons\">\n  <button mat-button mat-dialog-close (click)=\"cancelModal()\" class=\"cancelBtn\">Cancel</button>\n  <button mat-button mat-dialog-close (click)=\"deleteItem()\" class=\"confirmBtn\">Confirm Delete</button>\n</div>\n"

/***/ }),

/***/ "./src/app/shared/components/delete-image-modal/delete-image-modal.component.ts":
/*!**************************************************************************************!*\
  !*** ./src/app/shared/components/delete-image-modal/delete-image-modal.component.ts ***!
  \**************************************************************************************/
/*! exports provided: DeleteImageModalComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeleteImageModalComponent", function() { return DeleteImageModalComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm2015/material.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};


let DeleteImageModalComponent = class DeleteImageModalComponent {
    constructor(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    ngOnInit() {
    }
    cancelModal() {
        this.dialogRef.close('cancel');
    }
    deleteItem() {
        this.dialogRef.close('confirm');
    }
};
DeleteImageModalComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-delete-image-modal',
        template: __webpack_require__(/*! ./delete-image-modal.component.html */ "./src/app/shared/components/delete-image-modal/delete-image-modal.component.html"),
        styles: [__webpack_require__(/*! ./delete-image-modal.component.css */ "./src/app/shared/components/delete-image-modal/delete-image-modal.component.css")]
    }),
    __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
    __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object])
], DeleteImageModalComponent);



/***/ }),

/***/ "./src/app/shared/components/delete-image-project-modal/delete-image-project-modal.component.css":
/*!*******************************************************************************************************!*\
  !*** ./src/app/shared/components/delete-image-project-modal/delete-image-project-modal.component.css ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".title{\n    font-size: 25px;\n    font-family: 'Times New Roman', Times, serif;\n    font-weight:bold;\n    display:flex;\n    justify-content: center;\n    align-items:center;\n    margin:10px 10px 30px 10px;    \n}\n\n.buttons{\n    display:flex;\n    justify-content: center;   \n    margin-bottom:10px;                         \n}\n\n.buttons button{\n    width: 160px;\n    padding-top: 8px;\n    padding-bottom: 8px;\n    border-radius: 3px;\n    border: 1px solid #00000008;\n    margin: 0px 15px;\n}\n\n.cancelBtn{\n    background:white;    \n}\n\n.cancelBtn:hover{\n    background:#ddd;\n}\n\n.confirmBtn{\n    background: #ff0000;\n    color:white;    \n    border: 1px solid #00000008;\n}\n\n.confirmBtn:hover{\n    background: #ff0000dd;\n}\n"

/***/ }),

/***/ "./src/app/shared/components/delete-image-project-modal/delete-image-project-modal.component.html":
/*!********************************************************************************************************!*\
  !*** ./src/app/shared/components/delete-image-project-modal/delete-image-project-modal.component.html ***!
  \********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2 mat-dialog-title class=\"title\">Delete \"{{data.deleteItem}}\" image project?</h2>\n<div mat-dialog-actions class=\"buttons\">\n  <button mat-button mat-dialog-close (click)=\"cancelModal()\" class=\"cancelBtn\">Cancel</button>\n  <button mat-button mat-dialog-close (click)=\"deleteItem()\" class=\"confirmBtn\">Confirm Delete</button>\n</div>\n"

/***/ }),

/***/ "./src/app/shared/components/delete-image-project-modal/delete-image-project-modal.component.ts":
/*!******************************************************************************************************!*\
  !*** ./src/app/shared/components/delete-image-project-modal/delete-image-project-modal.component.ts ***!
  \******************************************************************************************************/
/*! exports provided: DeleteImageProjectModalComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeleteImageProjectModalComponent", function() { return DeleteImageProjectModalComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm2015/material.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};


let DeleteImageProjectModalComponent = class DeleteImageProjectModalComponent {
    constructor(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    ngOnInit() {
    }
    cancelModal() {
        this.dialogRef.close('cancel');
    }
    deleteItem() {
        this.dialogRef.close('confirm');
    }
};
DeleteImageProjectModalComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-delete-image-project-modal',
        template: __webpack_require__(/*! ./delete-image-project-modal.component.html */ "./src/app/shared/components/delete-image-project-modal/delete-image-project-modal.component.html"),
        styles: [__webpack_require__(/*! ./delete-image-project-modal.component.css */ "./src/app/shared/components/delete-image-project-modal/delete-image-project-modal.component.css")]
    }),
    __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
    __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object])
], DeleteImageProjectModalComponent);



/***/ }),

/***/ "./src/app/shared/components/delete-job-modal/delete-job-modal.component.css":
/*!***********************************************************************************!*\
  !*** ./src/app/shared/components/delete-job-modal/delete-job-modal.component.css ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".content{\n    margin:25px 0px;          \n}\n.buttons{\n    display:flex;\n    justify-content: center;   \n    margin-bottom:20px;                     \n}\n.buttons button{\n    width: 160px;\n    padding-top: 8px;\n    padding-bottom: 8px;\n    border-radius: 3px;\n    border: 1px solid #00000008;\n    margin: 0px 15px;\n}\n.cancelBtn{\n    background:white;    \n}\n.cancelBtn:hover{\n    background:#ddd;\n}\n.confirmBtn{\n    background: #ff0000;\n    color:white;    \n    border: 1px solid #00000008;\n}\n.confirmBtn:hover{\n    background: #ff0000dd;\n}\n"

/***/ }),

/***/ "./src/app/shared/components/delete-job-modal/delete-job-modal.component.html":
/*!************************************************************************************!*\
  !*** ./src/app/shared/components/delete-job-modal/delete-job-modal.component.html ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div mat-dialog-content class=\"content text-danger\">\n  <h4>Warning: Deleting this Job will DELETE all the associated MODEL FILES (e.g. PLY files)!</h4>\n  <h4>Warning: If it's a group Job, other associated Jobs will be DELETED too!</h4>\n  <h4>However, any associated Image Projects will not be deleted.</h4>      \n</div>\n<div mat-dialog-actions class=\"buttons\">\n  <button mat-button mat-dialog-close (click)=\"cancelModal()\" class=\"cancelBtn\">Cancel and Return</button>\n  <button mat-button mat-dialog-close (click)=\"deleteItem()\" class=\"confirmBtn\">Confirm Delete</button>\n</div>\n"

/***/ }),

/***/ "./src/app/shared/components/delete-job-modal/delete-job-modal.component.ts":
/*!**********************************************************************************!*\
  !*** ./src/app/shared/components/delete-job-modal/delete-job-modal.component.ts ***!
  \**********************************************************************************/
/*! exports provided: DeleteJobModalComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeleteJobModalComponent", function() { return DeleteJobModalComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm2015/material.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};


let DeleteJobModalComponent = class DeleteJobModalComponent {
    constructor(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    ngOnInit() {
    }
    cancelModal() {
        this.dialogRef.close('cancel');
    }
    deleteItem() {
        this.dialogRef.close('confirm');
    }
};
DeleteJobModalComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-delete-job-modal',
        template: __webpack_require__(/*! ./delete-job-modal.component.html */ "./src/app/shared/components/delete-job-modal/delete-job-modal.component.html"),
        styles: [__webpack_require__(/*! ./delete-job-modal.component.css */ "./src/app/shared/components/delete-job-modal/delete-job-modal.component.css")]
    }),
    __param(1, Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"])(_angular_material__WEBPACK_IMPORTED_MODULE_1__["MAT_DIALOG_DATA"])),
    __metadata("design:paramtypes", [_angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogRef"], Object])
], DeleteJobModalComponent);



/***/ }),

/***/ "./src/app/shared/mat-shared.module.ts":
/*!*********************************************!*\
  !*** ./src/app/shared/mat-shared.module.ts ***!
  \*********************************************/
/*! exports provided: MatSharedModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MatSharedModule", function() { return MatSharedModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm2015/material.js");
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/icon */ "./node_modules/@angular/material/esm2015/icon.js");
/* harmony import */ var _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/progress-bar */ "./node_modules/@angular/material/esm2015/progress-bar.js");
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/snack-bar */ "./node_modules/@angular/material/esm2015/snack-bar.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









let MatSharedModule = class MatSharedModule {
};
MatSharedModule = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
        exports: [
            _angular_material_progress_bar__WEBPACK_IMPORTED_MODULE_3__["MatProgressBarModule"],
            _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_4__["MatSnackBarModule"],
            _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDialogModule"],
            _angular_material_icon__WEBPACK_IMPORTED_MODULE_2__["MatIconModule"],
            _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatButtonModule"],
            _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatButtonToggleModule"],
            _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatSidenavModule"],
            _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatPaginatorModule"],
            _angular_material__WEBPACK_IMPORTED_MODULE_1__["MatDividerModule"]
        ]
    })
], MatSharedModule);



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
const environment = {
    production: false,
    //apiUrl:'http://54.179.11.137:8000'
    //apiUrl: 'http://13.213.40.138:8000'
    apiUrl: 'http://13.229.131.80:8000'
    //apiUrl: 'http://54.179.11.137:8003'  
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm2015/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /media/invento/Projects/Digtrace Frontend/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map