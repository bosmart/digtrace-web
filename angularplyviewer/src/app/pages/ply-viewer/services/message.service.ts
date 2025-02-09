import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import { Observable,Subject} from 'rxjs';

@Injectable({

  providedIn: 'root'

})
export class MessageService {

    private subject = new Subject<any>();
    private message = ''


    sendMessage(message: string) {
        this.message =message;
    }

    clearMessage() {
        this.subject.next();
    }

    getMessage(){
        return this.message;
    }
}


