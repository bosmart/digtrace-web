import { NgModule } from '@angular/core';

import { SidebarComponent } from '../pages/common/sidebar/sidebar.component';
import { CardComponent } from '../pages/common/card/card.component';
import { SidebarTopComponent } from '../pages/common/sidebar-top/sidebar-top.component';
import { CommonSharedModule } from './common-shared.module';


@NgModule({
  imports: [
    CommonSharedModule
  ],
  declarations: [
    CardComponent,
    SidebarComponent,  
    SidebarTopComponent,    
  ],
  exports:[
    CardComponent,
    SidebarComponent,  
    SidebarTopComponent  
  ]
})
export class SharedSidebarModule { }
