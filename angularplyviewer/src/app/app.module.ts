import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonSharedModule } from './shared/common-shared.module';
import { MatSharedModule } from './shared/mat-shared.module';
import { AppRoutingModule } from './app-routing.module';
import { NgxNotificationModule } from "ngx-notification";

import { AppComponent } from './app.component';
import { TermsConditionsComponent } from './more-components/terms-conditions/terms-conditions.component';
import { AboutComponent } from './more-components/about/about.component';
import { ContactComponent } from './more-components/contact/contact.component';
import { PageNotFoundComponent } from './more-components/page-not-found/page-not-found.component';

import { AuthRootComponent } from './auth/auth-root/auth-root.component';
import { AuthMenuComponent } from './auth/auth-menu/auth-menu.component';
import { AuthFooterComponent } from './auth/auth-footer/auth-footer.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';

import { DeleteImageModalComponent } from './shared/components/delete-image-modal/delete-image-modal.component';
import { DeleteJobModalComponent } from './shared/components/delete-job-modal/delete-job-modal.component';
import { DeleteImageProjectModalComponent } from './shared/components/delete-image-project-modal/delete-image-project-modal.component';
import { ConfirmJobSubmitComponent } from './shared/components/confirm-job-submit/confirm-job-submit.component';
import { ConfirmLogoutComponent } from './shared/components/confirm-logout/confirm-logout.component';
import { LoaderComponent } from './shared/components/loader/loader.component';


@NgModule({
  declarations: [    
    AppComponent, 
    TermsConditionsComponent,
    AboutComponent,
    ContactComponent,
    PageNotFoundComponent,
    AuthRootComponent,    
    AuthMenuComponent,
    AuthFooterComponent,     
    LoginComponent,
    RegisterComponent,      
    PasswordResetComponent,  
    ChangePasswordComponent, 
    DeleteImageModalComponent,
    DeleteImageProjectModalComponent,
    DeleteJobModalComponent,  
    ConfirmJobSubmitComponent,
    ConfirmLogoutComponent,
    LoaderComponent
  ],
  entryComponents:[
    DeleteImageModalComponent,
    DeleteImageProjectModalComponent,
    DeleteJobModalComponent,
    ConfirmJobSubmitComponent,
    ConfirmLogoutComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,  
    BrowserAnimationsModule,
    AppRoutingModule,     
    CommonSharedModule,     
    MatSharedModule,
    NgxNotificationModule,    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
