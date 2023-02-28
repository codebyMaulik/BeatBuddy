import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddSongService {
  mymethod$: Observable<any>;
  private MyMEthodSubject = new Subject<any>();

  album$: Observable<any>;
  private AlbumSubject = new Subject<any>();

  constructor() {
    this.mymethod$ = this.MyMEthodSubject.asObservable();
    this.album$ = this.AlbumSubject.asObservable();
  }

  changeMessage(data) {
    console.log(data);
    this.MyMEthodSubject.next(data);
    // this.messageSource.next(message);
  }

  addAlbum(data) {
    // console.log('album-service', data);
    this.AlbumSubject.next(data);
  }
}
