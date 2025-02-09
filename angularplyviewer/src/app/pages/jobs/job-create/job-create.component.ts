import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';

@Component({
  selector: 'app-job-create',
  templateUrl: './job-create.component.html',
  styleUrls: ['./job-create.component.css']
})
export class JobCreateComponent implements OnInit {

  constructor(private apiService: ApiService, private fb: FormBuilder, private router:Router, private dataSharingService: DataSharingService) { }

  jobCreateForm: FormGroup
  
  imageCollections
  genModels=[['Global','GLB'],['Sequential','SEQ']]
  surfaceRecons=[['Poisson Reconstruction','PR'],['SSD Reconstruction','SR']]
  jobPriorities=[['High','H'],['Medium','M'],['Low','L']]

  payloadData
  allAlerts:boolean=false
  jobCreateErrors

  headers= {
    "Content-Type":"application/json"
  }

  ngOnInit():void {                

    this.jobCreateForm = this.fb.group({
       jobName:['',[Validators.required,Validators.minLength(1)]],
       jobDesc:[''],
       selectImageCollection:[[],[Validators.required]],
       selectGenModel:['GLB',[Validators.required]],
       checkFocalLen:[true],
       focalLen:[''],
       selectSurfaceRecon:['PR',[Validators.required]],
       surfaceReconDepth:['10',[Validators.required]],       
       checkSurfaceReconColor:[true],
       poissonSampleRate:['1.0'],
       checkPoissonReconDensity:[false],
       ssdReconDegree:['2'],
       checkSurfaceTrim:[false],
       surfaceTrimThreshold:['0.5'],
       checkPolygonMesh:[false],
       surfaceTrimSmooth:['5'],
       jobNote:[''],
       selectJobPriority:['M',[Validators.required]]
    })       
    
    this.apiService.callApi('/api/job/create/','GET')
    .subscribe(res=>{
       let data = res['data']
       this.imageCollections = res['data'].userImagesCollection
      //  this.jobCreateForm.patchValue({
      //    selectGenModel:data.gen_model,
      //    checkFocalLen:data.force_focal_len_calc,
      //    selectSurfaceRecon:data.surface_recon,
      //     surfaceReconDepth:data.surface_recon_depth,
      //     checkSurfaceReconColor:data.surface_recon_colour,
      //     poissonSampleRate:data.poisson_recon_sample_per_node,          
      //     ssdReconDegree:data.ssd_recon_degree,          
      //     surfaceTrimThreshold:data.surface_trim_trim_threshold,          
      //     surfaceTrimSmooth:data.surface_trim_smooth,          
      //     selectJobPriority:data.job_priority
      //  })
      //  this.jobCreateForm.updateValueAndValidity()
       
    })
    
    this.dataSharingService.getData().subscribe(res=>{
      if(res.imageId){        
        this.jobCreateForm.patchValue({
          selectImageCollection: [+res.imageId]
        })
        this.jobCreateForm.updateValueAndValidity()
      }
    })    
  }

  get jobName(){
    return this.jobCreateForm.get('jobName')
  }
  get selectImageCollection(){
    return this.jobCreateForm.get('selectImageCollection')
  }
  get selectGenModel(){
    return this.jobCreateForm.get('selectGenModel')
  }
  get selectSurfaceRecon(){
    return this.jobCreateForm.get('selectSurfaceRecon')
  }
  get surfaceReconDepth(){
    return this.jobCreateForm.get('surfaceReconDepth')
  }
  get selectJobPriority(){
    return this.jobCreateForm.get('selectJobPriority')
  }

  submitJob(){      
    if(this.jobCreateForm.invalid){
      this.allAlerts = true
      return null
    }

    this.payloadData={
      job_name: this.jobCreateForm.value.jobName,
      job_description: this.jobCreateForm.value.jobDesc,
      userImagesCollection: this.jobCreateForm.value.selectImageCollection, 
      gen_model: this.jobCreateForm.value.selectGenModel,
      force_focal_len_calc: this.jobCreateForm.value.checkFocalLen,
      focal_len: this.jobCreateForm.value.focalLen,
      surface_recon:this.jobCreateForm.value.selectSurfaceRecon,
      surface_recon_depth:this.jobCreateForm.value.surfaceReconDepth,           
      surface_recon_colour: this.jobCreateForm.value.checkSurfaceReconColor,      
      poisson_recon_sample_per_node: this.jobCreateForm.value.poissonSampleRate,
      poisson_recon_density: this.jobCreateForm.value.checkPoissonReconDensity,
      ssd_recon_degree: this.jobCreateForm.value.ssdReconDegree,
      surface_trim: this.jobCreateForm.value.checkSurfaceTrim,
      surface_trim_trim_threshold: this.jobCreateForm.value.surfaceTrimThreshold,
      surface_trim_polygon_mesh: this.jobCreateForm.value.checkPolygonMesh,
      surface_trim_smooth: this.jobCreateForm.value.surfaceTrimSmooth,
      job_note: this.jobCreateForm.value.jobNote,
      job_priority: this.jobCreateForm.value.selectJobPriority
    }        

    this.apiService.callApi('/api/job/create/','POST',JSON.stringify(this.payloadData),this.headers)
    .subscribe({
      next:res=>{    
        this.dataSharingService.changeData('jobCreated')   
        this.router.navigate([`/jobs/job-description/${res['data'].job_id}`])
      },
      error:res=>{
        this.jobCreateErrors = res.error.errors
        window.scroll(0,0)
      }
    })
  }

}
