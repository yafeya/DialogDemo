import { Injectable, Inject, InjectionToken } from '@angular/core';

declare var electron: any;

export const IDesktopUtilitiesToken = new InjectionToken('./IDesktopUtilitiesToken');

export interface IDesktopUtilities {
    IsDesktopApp(): boolean;
    ShowSaveDialog(callback: (filename: string) => void);
    ShowOpenDialog(callback: (filename: string) => void);
    Maximum(): void;
    Minimum(): void;
    Close(): void;
}

@Injectable()
export class DesktopUtilities implements IDesktopUtilities {

    ShowSaveDialog(callback: (filename: string) => void) {
        if (this.IsDesktopApp()) {
            let dialog = this.getDialogObj();
            dialog.showSaveDialog((fileName) => {
                if (fileName === undefined){
                    console.log("You didn't save the file");
                    return;
                }
            
                callback(fileName);
            }); 
        }
    }
    
    ShowOpenDialog(callback: (filename: string) => void) {
        if (this.IsDesktopApp()) {
            let dialog = this.getDialogObj();
            dialog.showOpenDialog((fileName) => {
                if (fileName === undefined){
                    console.log("You didn't save the file");
                    return;
                }
            
                callback(fileName);
            }); 
        }
    }

    private getDialogObj(){
        let app = electron.remote;
        let dialog = app.dialog;
        return dialog;
    }

    IsDesktopApp(): boolean {
        let isDesktop = false;
        try {
            if (electron != undefined) {
                isDesktop = true;
            }
        }
        catch (error) {
            isDesktop = false;
            console.log(`This is not a electron app: ${error}`);
        }
        return isDesktop;
    }

    private mIsMaximum: boolean = false;

    Maximum(): void {
        let ipcRenderer: any;

        if (electron != undefined) {
            ipcRenderer = electron.ipcRenderer;

            if (this.mIsMaximum) {
                ipcRenderer.send('restore', 1);
                this.mIsMaximum = false;
            }
            else {
                ipcRenderer.send('maximum', 1);
                this.mIsMaximum = true;
            }
        }
    }

    Minimum(): void {
        let ipcRenderer: any;

        if (electron != undefined) {
            ipcRenderer = electron.ipcRenderer;

            ipcRenderer.send('minimum', 1);
        }
    }

    Close(): void {
        let ipcRenderer: any;

        if (electron != undefined) {
            ipcRenderer = electron.ipcRenderer;

            ipcRenderer.send('exit', 1);
        }
    }

}