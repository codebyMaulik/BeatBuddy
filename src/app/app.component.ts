import { Component, OnInit } from "@angular/core";
import { map, Subscription, timer } from "rxjs";
import { AddSongService } from "src/services/add-song.service";
import { SaavanService } from "src/services/saavan.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "beatbuddy";

  trending;
  playlist;
  charts;
  topAlbums;
  Slidercurrent: number = 0;
  timerSubscription: Subscription;
  isHindi: boolean = false;
  constructor(
    private _saavan: SaavanService,
    private _addSong: AddSongService
  ) {}

  ngOnInit() {
    this.changeLanguage("english");
  }
  changeLanguage(language: any) {
    const _language = language;
    _language == "hindi" ? (this.isHindi = true) : (this.isHindi = false);
    this._saavan.getTrending(_language).subscribe((data) => {
      this.trending = {
        albums: data["data"].trending.albums,
        songs: data["data"].trending.songs,
      };
      this.playlist = data["data"].playlists;
      this.charts = data["data"].charts;
      this.topAlbums = data["data"].albums;
    });
    this.timerSubscription = timer(0, 5000)
      .pipe(
        map(() => {
          // this.Slidercurrent++; // load data
        })
      )
      .subscribe();
  }
  getSingleSong(songinfo) {
    this._addSong.changeMessage(songinfo, "any");
  }
  getsong(albuminfo) {
    this._saavan.getAlbum(albuminfo.id).subscribe((data) => {
      this._addSong.addAlbum(data["data"].songs);
    });
  }
  getPlaylist(playlistInfo) {
    this._saavan.getPlaylist(playlistInfo.id).subscribe((data) => {
      if (data["data"].songs.length == 0) {
        alert("not available");
        return;
      }
      this._addSong.addAlbum(data["data"].songs);
    });
  }
  getCharts(chart) {
    this._saavan.getPlaylist(chart.id).subscribe((data) => {
      if (data["data"].songs.length == 0) {
        alert("not available");
        return;
      }
      this._addSong.addAlbum(data["data"].songs);
    });
  }
  getTopAlbums(chart) {
    this._saavan.getPlaylist(chart.id).subscribe((data) => {
      if (data["data"].songs.length == 0) {
        alert("not available");
        return;
      }
      this._addSong.addAlbum(data["data"].songs);
    });
  }
  moveSlider(numb) {
    this.Slidercurrent = this.Slidercurrent + numb;
    if (this.Slidercurrent == this.trending.length - 1) {
      this.Slidercurrent = 0;
    }
    if (this.Slidercurrent < 0) {
      this.Slidercurrent = this.trending.length - 1;
    }
  }

  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();
  }
}
