import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MarkerService } from './marker.service';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MapComponent } from './map/map.component';

@NgModule({
  declarations: [AppComponent, MapComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [MarkerService],
  bootstrap: [AppComponent],
})
export class AppModule {}
