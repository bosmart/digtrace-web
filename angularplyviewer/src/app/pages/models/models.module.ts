import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedSidebarModule } from 'src/app/shared/shared-sidebar.module';
import { ModelsRootComponent } from './models-root/models-root.component';
import { CommonSharedModule } from 'src/app/shared/common-shared.module';
import { ModelsRouteModule } from './models-route.module';


@NgModule({
  imports: [
    CommonModule,
    SharedSidebarModule,
    CommonSharedModule,
    ModelsRouteModule
  ],
  declarations: [
    ModelsRootComponent
  ]
})
export class ModelsModule { }
