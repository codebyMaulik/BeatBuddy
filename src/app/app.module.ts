import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchComponent } from '../components/search/search.component';
import { HttpClientModule } from '@angular/common/http';
import { MiniPlayerComponent } from '../components/mini-player/mini-player.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    MiniPlayerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
