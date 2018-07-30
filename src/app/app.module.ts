import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import * as Services from '../services/index';


import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    { provide: Services.IDesktopUtilitiesToken, useClass: Services.DesktopUtilities }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
