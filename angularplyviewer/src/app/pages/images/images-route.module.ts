import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddImageFolderComponent } from './add-image-folder/add-image-folder.component';
import { AddImageComponent } from './add-image/add-image.component';
import { ChangeImageInfoComponent } from './change-image-info/change-image-info.component';
import { ImagesRootComponent } from './images-root/images-root.component';
import { ViewImagesComponent } from './view-images/view-images.component';

const routes:Routes = [
   {
      path:"",
      component:ImagesRootComponent,
      children:[          
        {path: 'add-image/:id',component:AddImageComponent},
        {path: 'add-image-folder',component:AddImageFolderComponent},
        {path:'change-image-info/:id', component:ChangeImageInfoComponent},        
        {path:'view-images/:id',component:ViewImagesComponent},        
        {
          path: '', 
          loadChildren: '../ply-viewer/ply-viewer.module#PlyViewerModule'
        }             
      ]        
   }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ImagesRouteModule { }
