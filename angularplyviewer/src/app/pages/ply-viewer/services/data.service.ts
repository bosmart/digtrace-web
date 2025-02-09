import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private messageSource = new BehaviorSubject([]);
  currentMessage:any = this.messageSource.asObservable();

  private messageSourceForDjango = new BehaviorSubject('default message');
  currentMessageForDjango:any = this.messageSourceForDjango.asObservable();

  constructor(){}

  changeMessage( message: any ){    
    this.messageSource.next(message );    
  }

  getMessage(){
    return this.currentMessage
  }

  changeMessageToLoadDjangoPlyFile( message: any ) {
    this.messageSourceForDjango.next(message);
    // console.log(message)
  }

  getMessageToLoadDjangoPlyFile(){
    return this.currentMessageForDjango
  }

  

}
