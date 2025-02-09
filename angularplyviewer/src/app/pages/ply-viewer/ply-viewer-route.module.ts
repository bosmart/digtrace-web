import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlyviewerComponent } from './plyviewer/plyviewer.component';


const routes:Routes = [
   {
      path:"",
      component:PlyviewerComponent,      
   }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PlyViewerRouteModule { }
