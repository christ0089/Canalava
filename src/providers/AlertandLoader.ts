import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { LoadingController, ToastController } from 'ionic-angular';


/*
 Generated class for the StoreServiceProvider provider.

 See https://angular.io/guide/dependency-injection for more info on providers
 and Angular DI.
*/
@Injectable()
export class ToastAndLoadProvider {
    private toast: any;
    private loader: any;
    constructor(public http: Http, private loaderCtrl: LoadingController, private toastCtrl: ToastController) {
        
    }

    presentLoader() {
        this.loader = this.loaderCtrl.create({
            content: 'Porfavor espera',
        });
        this.loader.present();
    }

    dismissLoader() {
        this.loader.dismiss();
    }

    presetToast(message) {
        this.toast = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: 'bottom',
            cssClass: "toastError"
          });
      
          this.toast.onDidDismiss(() => {
            console.log('Dismissed toast');
          });
      
          this.toast.present();
    }

    dismissToast() {
        this.toast.dismiss();
    }
}