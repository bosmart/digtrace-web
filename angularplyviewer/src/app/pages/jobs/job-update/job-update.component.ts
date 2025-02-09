import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';

@Component({
  selector: 'app-job-update',
  templateUrl: './job-update.component.html',
  styleUrls: ['./job-update.component.css']
})
export class JobUpdateComponent implements OnInit {

  constructor(private apiService: ApiService, private fb: FormBuilder, private router:Router, private activatedRoute:ActivatedRoute, private dataSharingService: DataSharingService) { }

  jobUpdateForm: FormGroup

  imageCollections
  genModels=[['Global','GLB'],['Sequential','SEQ']]
  surfaceRecons=[['Poisson Reconstruction','PR'],['SSD Reconstruction','SR']]
  jobPriorities=[['High','H'],['Medium','M'],['Low','L']]
  showComponent
  errorMsg
  updateSubmitErrors
  
  allAlerts:boolean=false
  jobId

  headers= {
    "Content-Type":"application/json"
  }

  filterItem(itemsArray,value){
    return itemsArray.filter(item=>item[1]===value)
  }

  ngOnInit() {    
    this.activatedRoute.paramMap.subscribe(params=>{
      this.updateSubmitErrors = ""
      this.jobId = params.get('id')    
      this.jobUpdateForm = this.fb.group({
        jobName:['',[Validators.required,Validators.minLength(1)]],
        jobDesc:[''],
        selectImageCollection:[null,[Validators.required]],
        selectGenModel:[null,[Validators.required]],
        checkFocalLen:[false],
        focalLen:[''],
        selectSurfaceRecon:[null,[Validators.required]],
        surfaceReconDepth:['',[Validators.required]],       
        checkSurfaceReconColor:[false],
        poissonSampleRate:[''],
        checkPoissonReconDensity:[false],
        ssdReconDegree:[''],
        checkSurfaceTrim:[false],
        surfaceTrimThreshold:[''],
        checkPolygonMesh:[false],
        surfaceTrimSmooth:[''],
        jobNote:[''],
        selectJobPriority:[null,[Validators.required]]
       })
      
      this.apiService.callApi(`/api/job/${this.jobId}/update/`,'GET')
      .subscribe({
        next:res=>{
         this.showComponent = res['code']==200 && true
         let data=res['data']         
         this.imageCollections = data.userImagesCollection                
         let selectedImages = this.imageCollections.filter(item=>item.selected===true).map(item=>item.id)
         
         this.jobUpdateForm.patchValue({
          jobName:data.job_name,
          jobDesc:data.job_description,
          selectImageCollection:selectedImages,
          selectGenModel:data.gen_model,
          checkFocalLen:data.force_focal_len_calc,
          focalLen:data.focal_len,
          selectSurfaceRecon:data.surface_recon,
          surfaceReconDepth:data.surface_recon_depth,
          checkSurfaceReconColor:data.surface_recon_colour,
          poissonSampleRate:data.poisson_recon_sample_per_node,
          checkPoissonReconDensity:data.poisson_recon_density,
          ssdReconDegree:data.ssd_recon_degree,
          checkSurfaceTrim:data.surface_trim,
          surfaceTrimThreshold:data.surface_trim_trim_threshold,
          checkPolygonMesh:data.surface_trim_polygon_mesh,
          surfaceTrimSmooth:data.surface_trim_smooth,
          jobNote:data.job_note,
          selectJobPriority:data.job_priority
         })
         this.jobUpdateForm.updateValueAndValidity() 
        },
        error:res=>{
          this.errorMsg=res.error.errors[0]
          this.showComponent=false
        }          
      })
      this.jobUpdateForm.controls['checkSurfaceReconColor'].disable()  
    })
  }

  get jobName(){
    return this.jobUpdateForm.get('jobName')
  }
  get selectImageCollection(){
    return this.jobUpdateForm.get('selectImageCollection')
  }
  get selectGenModel(){
    return this.jobUpdateForm.get('selectGenModel')
  }
  get selectSurfaceRecon(){
    return this.jobUpdateForm.get('selectSurfaceRecon')
  }
  get surfaceReconDepth(){
    return this.jobUpdateForm.get('surfaceReconDepth')
  }
  get selectJobPriority(){
    return this.jobUpdateForm.get('selectJobPriority')
  }

  updateJob(){
    if(this.jobUpdateForm.invalid){
      this.allAlerts = true
      return null
    }
    
    let payloadData={
      job_name: this.jobUpdateForm.value.jobName,
      job_description: this.jobUpdateForm.value.jobDesc,
      userImagesCollection: this.jobUpdateForm.value.selectImageCollection, 
      gen_model: this.jobUpdateForm.value.selectGenModel,
      force_focal_len_calc: this.jobUpdateForm.value.checkFocalLen,
      focal_len: this.jobUpdateForm.value.focalLen,
      surface_recon:this.jobUpdateForm.value.selectSurfaceRecon,
      surface_recon_depth:this.jobUpdateForm.value.surfaceReconDepth,           
      surface_recon_colour: this.jobUpdateForm.value.checkSurfaceReconColor,      
      poisson_recon_sample_per_node: this.jobUpdateForm.value.poissonSampleRate,
      poisson_recon_density: this.jobUpdateForm.value.checkPoissonReconDensity,
      ssd_recon_degree: this.jobUpdateForm.value.ssdReconDegree,
      surface_trim: this.jobUpdateForm.value.checkSurfaceTrim,
      surface_trim_trim_threshold: this.jobUpdateForm.value.surfaceTrimThreshold,
      surface_trim_polygon_mesh: this.jobUpdateForm.value.checkPolygonMesh,
      surface_trim_smooth: this.jobUpdateForm.value.surfaceTrimSmooth,
      job_note: this.jobUpdateForm.value.jobNote,
      job_priority: this.jobUpdateForm.value.selectJobPriority
    }        
    
    this.apiService.callApi(`/api/job/${this.jobId}/update/`,'POST',JSON.stringify(payloadData),this.headers)
    .subscribe({
      next:res=>{            
        this.dataSharingService.changeData('jobUpdated')   
        this.router.navigate([`/jobs/job-description/${this.jobId}`])        
      },
      error:res=>{      
        this.updateSubmitErrors = res.error.errors       
        window.scroll(0,0) 
      }
    })
  }
}
