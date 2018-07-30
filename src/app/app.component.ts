import { Component, Inject } from '@angular/core';
import * as Services from '../services/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor(
    @Inject(Services.IDesktopUtilitiesToken) private desktopUtilities: Services.IDesktopUtilities) {

  }

  openFile() {
    this.desktopUtilities.ShowOpenDialog((file: string) => {
      alert(`Selected file: ${file}`);
    });
  }

  saveFile() {
    this.desktopUtilities.ShowSaveDialog((file: string) => {
      alert(`Save file to: ${file}`);
    });
  }

}