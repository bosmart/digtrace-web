import { NgModule } from '@angular/core';

import { CommonSharedModule } from 'src/app/shared/common-shared.module';
import { SharedSidebarModule } from 'src/app/shared/shared-sidebar.module';
import { ImagesRouteModule } from './images-route.module';

import { ImagesRootComponent } from './images-root/images-root.component';
import { AddImageComponent } from './add-image/add-image.component';
import { AddImageFolderComponent } from './add-image-folder/add-image-folder.component';
import { ChangeImageInfoComponent } from './change-image-info/change-image-info.component';
import { ViewImagesComponent } from './view-images/view-images.component';
import { MatSharedModule } from 'src/app/shared/mat-shared.module';


@NgModule({
  imports: [        
    CommonSharedModule,
    SharedSidebarModule,    
    ImagesRouteModule,          
    MatSharedModule
  ],
  declarations: [
    ImagesRootComponent,
    AddImageComponent,
    AddImageFolderComponent,
    ChangeImageInfoComponent,    
    ViewImagesComponent,             
  ],
  providers:[]
})
export class ImagesModule { }
