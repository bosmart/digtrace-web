import { NgModule } from '@angular/core';

import { CommonSharedModule } from '../shared/common-shared.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MatSharedModule } from '../shared/mat-shared.module';

import { PagesRootComponent } from './pages-root/pages-root.component';
import { MainMenuComponent } from './common/main-menu/main-menu.component';
import { AccountSettingsComponent } from './others/account-settings/account-settings.component';
import { HelpComponent } from './others/help/help.component';
import { CreateMainComponent } from './ply-viewer/components/create-main/create-main.component';
import { UserProfileComponent } from './others/user-profile/user-profile.component';
import { SharedSidebarModule } from '../shared/shared-sidebar.module';


@NgModule({
  imports: [    
    CommonSharedModule,
    PagesRoutingModule,  
    MatSharedModule,    
    SharedSidebarModule,         
  ],
  declarations: [
    PagesRootComponent,
    MainMenuComponent,    
    AccountSettingsComponent,
    HelpComponent,
    UserProfileComponent,         
  ],
  providers:[CreateMainComponent]
})
export class PagesModule { }
