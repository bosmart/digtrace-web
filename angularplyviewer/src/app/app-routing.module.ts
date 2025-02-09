import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CanLoadGuard } from './guards/can-load.guard';
import { AuthPagesGuard } from './guards/auth-pages.guard';

import { TermsConditionsComponent } from './more-components/terms-conditions/terms-conditions.component';
import { AboutComponent } from './more-components/about/about.component';
import { ContactComponent } from './more-components/contact/contact.component';
import { PageNotFoundComponent } from './more-components/page-not-found/page-not-found.component';
import { AuthRootComponent } from './auth/auth-root/auth-root.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';

const routes: Routes = [             
  {path:'contact', component:ContactComponent},
  {path:'terms-conditions', component:TermsConditionsComponent},
  {path:'about', component:AboutComponent},  
  { 
    path:'auth', 
    component:AuthRootComponent,    
    canActivateChild:[AuthPagesGuard],     
    children:[
      {path:'', redirectTo:'login',pathMatch:'full'},
      {path:'login',component:LoginComponent},
      {path:'register',component:RegisterComponent},
      {path:'forgot-password',component:PasswordResetComponent},
      {path:'change-password/:token', component:ChangePasswordComponent}         
    ],
  },    
  { 
    path:'', 
    loadChildren: './pages/pages.module#PagesModule',  
    canLoad:[CanLoadGuard]      
  },
  {path:'**', component:PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
