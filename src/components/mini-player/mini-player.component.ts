import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { AddSongService } from "src/services/add-song.service";
import { SaavanService } from "src/services/saavan.service";

@Component({
  selector: "app-mini-player",
  templateUrl: "./mini-player.component.html",
  styleUrls: ["./mini-player.component.scss"],
})
export class MiniPlayerComponent implements OnInit {
  isalbum: boolean;
  isqueAdded = false;
  songmaxtime = 0;
  soncurrenttime = 0;
  defultart =
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80";
  isPlay = false;
  isqueuOpen = false;
  queue = [];
  public getsong;
  current = 0;
  currentSong = [{ songurl: "", title: "", Artist: "", art: "" }];
  @ViewChild("audioElement", { static: false })
  public _audioRef: ElementRef;
  private audio: HTMLMediaElement;

  constructor(
    private _getsong: AddSongService,
    private _saavan: SaavanService
  ) {
    //addsingle song
    this._getsong.mymethod$.subscribe((data) => {
      // console.log('mini-player', data['data'].id);
      this.isalbum = false;
      this._saavan.getsong(data["data"].id).subscribe((song) => {
        if (data.type == "play") {
          this.clearQueu();
        }
        this.getsong = song["data"];
        this.queue.push(this.getsong[0]);
        if (this.queue.length <= 1) {
          this.playAudio(0);
        }
        this.animate();
      });
    });

    //getfull-album
    this._getsong.album$.subscribe((album) => {
      // console.log(album);
      this.isalbum = true;
      this.clearQueu();
      for (let i = 0; i < album.length; i++) {
        this.queue.push(album[i]);
      }
      this.playAudio(0);
      this.animate();
    });
    // if ("mediaSession" in navigator) {
    //   this.setupMediaSession();
    // }
  }

  ngOnInit() {}

  @HostListener("document:keydown.space", ["$event"])
  onSpacebarPress(event: KeyboardEvent): void {
    event.preventDefault();
    this.playPause();
  }

  playAudio(index?) {
    this.current = index;
    this.currentSong = [];
    this.currentSong = [
      {
        songurl:
          this.queue[index].downloadUrl[4].link ||
          this.queue[index].downloadUrl[4].url,
        title: this.queue[index].name,
        Artist: this.queue[index].artists.primary[0].name,
        art: this.queue[index].image[2].url,
      },
    ];
    // console.log("current-song", this.queue[index]);
    this.setupMediaSession();
    this.audio = this._audioRef.nativeElement;
    this.audio.load();
    this.audio.src = this.currentSong[0].songurl;
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
  playPause(isplay?: boolean) {
    // If a specific isplay state is passed, use it, otherwise toggle play/pause
    if (isplay === undefined) {
      this.isPlay = !this.isPlay;
    } else {
      this.isPlay = isplay;
    }

    if (this.isPlay) {
      this.audio.play();
      if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "playing";
      }
    } else {
      this.audio.pause();
      if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "paused";
      }
    }
  }

  remQueue(index?) {
    if (this.queue.length == 1) {
      alert("last song can not be deleted");
    } else {
      this.queue.splice(index, 1);
    }
  }
  volume(value) {
    this.audio.currentTime = value.target.value;
    // this.soncurrenttime = this.audio.currentTime;
  }
  animate() {
    this.isqueAdded = true;
    setTimeout(() => {
      this.isqueAdded = false;
    }, 500);
  }

  clearQueu() {
    this.queue = [];
  }
  setupMediaSession() {
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: this.currentSong[0].title,
        // artist: this.artist,
        album: "Album Name", // You can change this dynamically
        artwork: [
          {
            src: this.currentSong[0].art,
            sizes: "512x512",
            type: "image/png",
          },
        ],
      });
      navigator.mediaSession.setActionHandler("nexttrack", () =>
        this.playNextSong()
      );
      navigator.mediaSession.setActionHandler("previoustrack", () =>
        this.playPrevSong()
      );
    }
  }
}
