import { Component, OnInit, ViewChild } from "@angular/core";
import { Observable, Subject, Subscription } from "rxjs";
import { SaavanService } from "src/services/saavan.service";
import {
  debounce,
  debounceTime,
  distinctUntilChanged,
  map,
} from "rxjs/operators";
import { AddSongService } from "src/services/add-song.service";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit {
  results$: Observable<any>;
  subject = new Subject();
  addThisSong;
  subscription: Subscription;
  searchsong;
  songResult;
  albumResult;
  topResult;
  artistResult;
  playlistResult;
  topQuery;
  constructor(
    private _saavan: SaavanService,
    private _addSong: AddSongService
  ) {}

  ngOnInit() {
    this.results$ = this.subject.pipe(
      debounceTime(1000),
      map((searchText) => {
        if (searchText === "") {
          this.songResult = [];
        } else {
          this.searchsong = searchText;
          this._saavan.searchSong(searchText).subscribe((seachREsult: any) => {
            // console.log('searchAPI', seachREsult['data']);
            // this.albumResult = seachREsult["data"].albums.results;
            // this.artistResult = seachREsult["data"].artists.results;
            // this.playlistResult = seachREsult["data"].playlists.results;
            this.songResult = seachREsult.data.results;
            // this.topQuery = seachREsult["data"].topQuery.results;
          });
          this._saavan.searchAlbum(searchText).subscribe((seachREsult: any) => {
            // console.log('searchAPI', seachREsult['data']);
            this.albumResult = seachREsult["data"].results;
            // this.artistResult = seachREsult.data.results;
            // this.playlistResult = seachREsult["data"].playlists.results;
            // this.topQuery = seachREsult["data"].topQuery.results;
          });
          this._saavan.searchAlbum(searchText).subscribe((seachREsult: any) => {
            this.playlistResult = seachREsult["data"].results;
          });
        }
      })
    );
  }

  findSong(name: any) {
    const searchText = name ? name.target.value : "";
    this.subject.next(searchText);
  }

  getsong(songinfo) {
    this._addSong.changeMessage(songinfo, "any");
  }

  viewall() {
    // console.log("p");
  }
  gettop(data, playlist?) {
    if (playlist) {
      this._saavan.getPlaylist(data.id).subscribe((data) => {
        // console.log(data['data']);
        this._addSong.addAlbum(data["data"].songs);
      });
    } else {
      // console.log('top', data);
      this._saavan.getAlbum(data.id).subscribe((data) => {
        // console.log(data['data']);
        this._addSong.addAlbum(data["data"].songs);
      });
    }
  }
}
