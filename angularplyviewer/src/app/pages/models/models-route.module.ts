import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModelsRootComponent } from './models-root/models-root.component';


const routes:Routes = [
   {
      path:"",
      component:ModelsRootComponent,      
   }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ModelsRouteModule { }
