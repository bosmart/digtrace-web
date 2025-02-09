import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagesRootComponent } from './pages-root/pages-root.component';
import { AccountSettingsComponent } from './others/account-settings/account-settings.component';
import { HelpComponent } from './others/help/help.component';
import { UserProfileComponent } from './others/user-profile/user-profile.component';


const routes: Routes = [
  {
    path:'', 
    component:PagesRootComponent,  
    children:[         
        {
          path: 'images',
          loadChildren: './images/images.module#ImagesModule'          
        },
        {
          path:'jobs',
          loadChildren: './jobs/jobs.module#JobsModule'          
        },             
        {
          path:'models',
          loadChildren: './models/models.module#ModelsModule'          
        },
        {
          path:'ply-viewer',
          loadChildren: './ply-viewer/ply-viewer.module#PlyViewerModule'          
        },                  
        {
          path:'account-settings',
          component:AccountSettingsComponent
        },
        {
          path:'help',
          component:HelpComponent
        },     
        {
          path:'user-profile',
          component:UserProfileComponent
        },                              
        {
          path: '',
          redirectTo:'jobs',
          pathMatch:'full'
        }        
    ]    
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
