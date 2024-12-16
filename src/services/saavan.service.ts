import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: "root",
})
export class SaavanService {
  constructor(private _httpclient: HttpClient) {}
  jiosaavaUrl = "https://beatbuddy.vercel.app/";
  searchSong(query: any) {
    let searchurl = this.jiosaavaUrl + "search/songs?query=" + encodeURI(query);
    // console.log(searchurl);
    return this._httpclient.get(searchurl);
  }

  getsong(query: any) {
    let encodeUrl = "https://saavn.dev/api/songs/" + encodeURI(query);
    return this._httpclient.get(encodeUrl);
  }

  getTrending() {
    let encodeUrl = this.jiosaavaUrl + "modules?language=hindi,english";
    return this._httpclient.get(encodeUrl);
  }

  getAlbum(query: any) {
    let encodeUrl = this.jiosaavaUrl + "albums?id=" + encodeURI(query);
    return this._httpclient.get(encodeUrl);
  }
  getPlaylist(query: any) {
    let encodeUrl = this.jiosaavaUrl + "playlists?id=" + encodeURI(query);
    console.log(encodeUrl);
    return this._httpclient.get(encodeUrl);
  }
}
