import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssociatedJobsComponent } from './associated-jobs/associated-jobs.component';

import { JobCreateComponent } from './job-create/job-create.component';
import { JobDescriptionComponent } from './job-description/job-description.component';
import { JobUpdateComponent } from './job-update/job-update.component';
import { JobsRootComponent } from './jobs-root/jobs-root.component';

const routes:Routes = [
  {
    path:"",
    component:JobsRootComponent,
    children:[
      {path:'update-job/:id',component:JobUpdateComponent},
      {path:'create-job',component:JobCreateComponent},
      {path:'job-description/:id',component:JobDescriptionComponent},
      {path:'associated-jobs/:id',component:AssociatedJobsComponent},
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

export class JobsRouteModule { }
