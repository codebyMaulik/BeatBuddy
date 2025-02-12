import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: "root",
})
export class SaavanService {
  constructor(private _httpclient: HttpClient) {}
  jiosaavaUrl = "https://beatbuddy.vercel.app/";
  jiosavn2 = "https://saavn.dev/api/";
  searchSong(query: any) {
    let searchurl =
      this.jiosaavaUrl + "search/songs?query=" + encodeURI(query) + "&limit=50";
    // console.log(searchurl);
    return this._httpclient.get(searchurl);
  }
  searchAlbum(query: any) {
    let searchurl =
      this.jiosaavaUrl + "search/albums?query=" + encodeURI(query);
    return this._httpclient.get(searchurl);
  }
  searchPlaylist(query: any) {
    let searchurl =
      this.jiosaavaUrl + "search/playlists?query=" + encodeURI(query);
    return this._httpclient.get(searchurl);
  }

  getsong(query: any) {
    let encodeUrl = "https://saavn.dev/api/songs/" + encodeURI(query);
    return this._httpclient.get(encodeUrl);
  }

  getTrending(language) {
    let encodeUrl = this.jiosaavaUrl + "modules?language=" + language;
    return this._httpclient.get(encodeUrl);
  }

  getAlbum(query: any) {
    let encodeUrl = this.jiosavn2 + "albums?id=" + encodeURI(query);
    return this._httpclient.get(encodeUrl);
  }
  getPlaylist(query: any) {
    let encodeUrl =
      this.jiosavn2 + "playlists?id=" + encodeURI(query) + "&limit=50";
    return this._httpclient.get(encodeUrl);
  }
}
