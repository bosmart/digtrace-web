import { CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ResizableModule } from 'angular-resizable-element';
import { CommonSharedModule } from 'src/app/shared/common-shared.module';
import { MatSharedModule } from 'src/app/shared/mat-shared.module';
import { PlyViewerRouteModule} from './ply-viewer-route.module'
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxPaginationModule } from "ngx-pagination";


import { DjangoJobsComponent } from './components/django-jobs/django-jobs.component';
import { DjangoauthenticationComponent } from './components/djangoauthentication/djangoauthentication.component';
import { JobsComponent } from './components/jobs/jobs.component';
import { PlyviewerComponent } from './plyviewer/plyviewer.component';
import { CompareMainComponent } from './components/compare-main/compare-main.component';
import { CreateMainComponent } from './components/create-main/create-main.component';
import { LandmarkComponent } from './components/landmark/landmark.component';
import { MeasureMainComponent } from './components/measure-main/measure-main.component';
import { ProjectLibraryComponent } from './components/project-library/project-library.component';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { CookieService } from 'ngx-cookie-service';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
}

@NgModule({
  imports: [    
    CommonSharedModule,    
    PlyViewerRouteModule,
    MatSharedModule,
    DragDropModule,
    ResizableModule, 
    NgxPaginationModule,
    PerfectScrollbarModule,          
    NgxSpinnerModule,    
  ],
  declarations: [
    PlyviewerComponent,
    CompareMainComponent,
    CreateMainComponent,
    DjangoJobsComponent,
    DjangoauthenticationComponent,
    JobsComponent,
    LandmarkComponent,
    MeasureMainComponent,
    ProjectLibraryComponent
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers:[
    {
        provide: PERFECT_SCROLLBAR_CONFIG,
        useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,             
    },
    CookieService,    
  ]
   
})
export class PlyViewerModule { }
