import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AddSongService } from 'src/services/add-song.service';
import { SaavanService } from 'src/services/saavan.service';

@Component({
  selector: 'app-mini-player',
  templateUrl: './mini-player.component.html',
  styleUrls: ['./mini-player.component.scss']
})
export class MiniPlayerComponent implements OnInit {

  isqueAdded = false;
  songmaxtime = 0;
  soncurrenttime = 0;
  defultart =
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80';
  isPlay = false;
  isqueuOpen = false;
  queue = [];
  public getsong;
  current = 0;
  currentSong = [{ songurl: '', title: '', Artist: '', art: '' }];
  @ViewChild('audioElement', { static: false })
  public _audioRef: ElementRef;
  private audio: HTMLMediaElement;

  constructor(
    private _getsong: AddSongService,
    private _saavan: SaavanService
  ) {
    this._getsong.mymethod$.subscribe((data) => {
      console.log('mini-player', data);
      // this.getsong = data.album.id;
      this._saavan.getsong(data.id).subscribe((song) => {
        this.getsong = song['data'];
        this.queue.push(this.getsong[0]);
        if (this.queue.length <= 1) {
          this.playAudio(0);
        }
        this.animate();
      });
    });

    //getfull-album
    this._getsong.album$.subscribe((album) => {
      console.log(album);
      for (let i = 0; i < album.length; i++) {
        this.queue.push(album[i]);
      }
      this.playAudio(0);
      this.animate();
    });
  }

  ngOnInit() {}

  playAudio(index?) {
    this.current = index;
    console.log(this.queue[index]);
    this.currentSong = [];
    this.currentSong = [
      {
        songurl: this.queue[index].downloadUrl[4].link,
        title: this.queue[index].name,
        Artist: this.queue[index].primaryArtists,
        art: this.queue[index].image[1].link,
      },
    ];
    // console.log('play', this.currentSong);
    this.audio = this._audioRef.nativeElement;
    this.audio.load();
    this.audio.play();
    this.isPlay = true;
    this.audio.ontimeupdate = () => {
      this.songmaxtime = this.audio.duration;
      this.soncurrenttime = this.audio.currentTime;
      // console.log('time', this.audio.duration);
    };
  }

  openQueu() {
    this.isqueuOpen = !this.isqueuOpen;
  }
  playNextSong() {
    if (this.current === this.queue.length - 1) {
      this.current = 0;
    } else {
      this.current++;
    }
    this.isPlay = true;
    this.playAudio(this.current);
  }
  playPrevSong() {
    if (this.current === 0) {
      this.current = this.queue.length - 1;
    } else {
      this.current--;
    }
    this.isPlay = true;
    this.playAudio(this.current);
  }
  playPause(isplay?) {
    if (this.isPlay) {
      console.log('here');
      this.audio.pause();
    } else {
      console.log('there');
      this.audio.play();
    }
    this.isPlay = !this.isPlay;
  }
  remQueue(index?) {
    if (this.queue.length == 1) {
      alert('last song can not be deleted');
    } else {
      this.queue.splice(index, 1);
    }
  }
  volume(value) {
    console.log(value.target.value);
    this.audio.currentTime = value.target.value;
    // this.soncurrenttime = this.audio.currentTime;
  }
  animate() {
    this.isqueAdded = true;
    setTimeout(() => {
      this.isqueAdded = false;
    }, 500);
  }

}
