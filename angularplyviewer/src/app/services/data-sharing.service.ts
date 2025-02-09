import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {

  private dataSource = new BehaviorSubject('')
  currentData:any = this.dataSource.asObservable()

  constructor() { }

  changeData(data: any){
    this.dataSource.next(data)    
  }

  getData(){
    return this.currentData
  }
}
