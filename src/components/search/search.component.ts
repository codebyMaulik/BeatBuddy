import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { SaavanService } from 'src/services/saavan.service';
import {
  debounce,
  debounceTime,
  distinctUntilChanged,
  map,
} from 'rxjs/operators';
import { AddSongService } from 'src/services/add-song.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  results$: Observable<any>;
  subject = new Subject();
  addThisSong:any;
  subscription: Subscription;
  searchsong:any;
  songResult:any;
  @ViewChild('seachSongName', {static : true}) searchtextbox;

  constructor(
    private _saavan: SaavanService,
    private _addSong: AddSongService
  ) { }

  ngOnInit(): void {
    this.searchtextbox.nativeElement.focus(); //focus on textbox
    this.results$ = this.subject.pipe(
      debounceTime(1000),
      map((searchText) => {
        console.log('hete');
        if (searchText === '') {
          this.songResult = [];
        } else {
          this.searchsong = searchText;
          this._saavan.searchSong(searchText).subscribe((songs) => {
            this.songResult = songs['data'].results;
          });
        }
      })
    );
    // console.log(this.results$, 'sssss');
  }
  findSong(name:any) {
    const searchText = name.target.value;
    this.subject.next(searchText);
  }
  getsong(songinfo,type) {
    // console.log(songinfo,type)
    this._addSong.changeMessage(songinfo,type);
  }
}
