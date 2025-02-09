import { NgModule } from '@angular/core';

import { CommonSharedModule } from 'src/app/shared/common-shared.module';
import { SharedSidebarModule } from 'src/app/shared/shared-sidebar.module';
import { JobsRouteModule } from './jobs-route.module';

import { JobsRootComponent } from './jobs-root/jobs-root.component';
import { JobCreateComponent } from './job-create/job-create.component';
import { JobUpdateComponent } from './job-update/job-update.component';
import { JobDescriptionComponent } from './job-description/job-description.component';
import { AssociatedJobsComponent } from './associated-jobs/associated-jobs.component';


@NgModule({
  imports: [        
    CommonSharedModule,    
    SharedSidebarModule,    
    JobsRouteModule,    
  ],
  declarations: [
    JobsRootComponent,
    JobCreateComponent,
    JobUpdateComponent,
    JobDescriptionComponent,     
    AssociatedJobsComponent      
  ],
  providers:[]
})
export class JobsModule { }
