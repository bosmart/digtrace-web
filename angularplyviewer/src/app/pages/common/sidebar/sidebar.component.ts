import { Component, Input, OnInit, Output } from '@angular/core';
import { Router} from '@angular/router';
import { EventEmitter } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { DataSharingService } from 'src/app/services/data-sharing.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {  

  @Input() showToggleBtn
  @Output() toggleBtn = new EventEmitter()
  
  listInfo
  itemName
  plusBtnPath
  subPath
  searchFilterStr
  totalPages:number  
  totalItems:number  
  itemActive
  lastPath
  toggleBtnVisible:boolean=true

  constructor(private router:Router,private apiService:ApiService, private dataSharingService: DataSharingService) {}
  
  ngOnInit(): void {  
          
    this.itemName = this.router.url.split('/')[1].slice(0,-1)    
    this.plusBtnPath = this.itemName==='image' ? '/images/add-image-folder' : '/jobs/create-job'
    
    this.subPath = this.itemName === 'image' ? 'image-collection' : 'job'        

    this.apiService.callApi(`/api/${this.subPath}/list/`)
    .subscribe({
      next:res=>{        
        this.listInfo=res['data']   
        this.totalPages = res['total_page_count']   
        this.totalItems = res['total_items']             
        this.lastPath = `/api/${this.subPath}/list/`                       
        this.itemActive = 1
      },
      error:res=>{
        console.log(res)            
      }
    })
    this.dataSharingService.getData().subscribe(data=>{      
      if(data=='pressFilterBtn'){
        this.toggleBtnVisible = !this.toggleBtnVisible
      }            
      else if(data=='imageDeleted' || data == 'jobDeleted' || data == 'image-collectionDeleted' || data == 'imageInfoChanged' || data=='jobCreated' || data=='jobUpdated'){        
        this.getList(this.lastPath)        
      }      
    })
  }

  closeSidebar(){
    this.toggleBtn.emit()    
    this.dataSharingService.changeData('toggleCanvasSize')
  }

  onSearchFilter($event){
    this.searchFilterStr = $event    
    this.apiService.callApi(`/api/${this.subPath}/list/${this.searchFilterStr}`)
    .subscribe({
      next:res=>{
        this.listInfo=res['data']   
        this.totalItems = res['total_items']
        this.totalPages = res['total_page_count']                
        this.lastPath = `/api/${this.subPath}/list/${this.searchFilterStr}`        
        this.itemActive = 1        
      },
      error:res=>{
        console.log(res)            
      }
    })
  }

  getList(path){            
    this.apiService.callApi(path)
    .subscribe({
      next:res=>{
        this.listInfo=res['data'] 
        this.lastPath = path  
        this.totalItems = res['total_items']    
      },
      error:res=>{
        console.log(res)            
      }
    })
  }

  plusBtnClick(){
    this.router.navigateByUrl(this.plusBtnPath)
  }
  
  getThisPage(pageNum){
    if(pageNum !==this.itemActive){
      this.itemActive = pageNum
      this.getList(`/api/${this.subPath}/list/?page=${pageNum}`)      
    }    
  }    

  getArray(val){
    let arr = []
    for(let i=1; i<=val; i++){
      arr.push(i)
    }
    return arr
  }
}
