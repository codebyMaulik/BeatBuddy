import { Component, OnInit } from '@angular/core';
import { map, Subscription, timer } from 'rxjs';
import { AddSongService } from 'src/services/add-song.service';
import { SaavanService } from 'src/services/saavan.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['../demo-styling.scss']
})
export class AppComponent implements OnInit {
  title = 'beatbuddy';

  trending;
  playlist;
  charts;
  topAlbums;
  Slidercurrent: number = 0;
  timerSubscription: Subscription;
  constructor(
    private _saavan: SaavanService,
    private _addSong: AddSongService
  ) {}

  ngOnInit() {
    this._saavan.getTrending().subscribe((data) => {
      console.log(data['data']);
      this.trending = data['data'].trending.albums;
      this.playlist = data['data'].playlists;
      this.charts = data['data'].charts;
      this.topAlbums = data['data'].albums;
    });
    this.timerSubscription = timer(0, 5000)
      .pipe(
        map(() => {
          // this.Slidercurrent++; // load data
        })
      )
      .subscribe();
  }
  getsong(albuminfo) {
    this._saavan.getAlbum(albuminfo.id).subscribe((data) => {
      // console.log(data['data'].songs);
      this._addSong.addAlbum(data['data'].songs);
    });
  }
  getPlaylist(playlistInfo) {
    console.log(playlistInfo.id);
    this._saavan.getPlaylist(playlistInfo.id).subscribe((data) => {
      // console.log(data['data'].songs);
      this._addSong.addAlbum(data['data'].songs);
    });
  }
  getCharts(chart) {
    console.log(chart);
    this._saavan.getPlaylist(chart.id).subscribe((data) => {
      // console.log(data['data'].songs);
      this._addSong.addAlbum(data['data'].songs);
    });
  }
  getTopAlbums(chart) {
    console.log(chart);
    this._saavan.getPlaylist(chart.id).subscribe((data) => {
      // console.log(data['data'].songs);
      this._addSong.addAlbum(data['data'].songs);
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
