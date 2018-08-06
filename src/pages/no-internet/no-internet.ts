import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { InternetProvider } from '../../providers/internet';

/**
 * Generated class for the NoInternetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-no-internet',
  templateUrl: 'no-internet.html',
})
export class NoInternetPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public InternetProvider: InternetProvider, private toastCtrl:ToastController, private viewCtrl:ViewController) {

  }
  tryagain() {
    let ref = this.viewCtrl.pageRef();
    if (ref.nativeElement.localName == 'page-no-internet') {
      console.log('success');
    }

    if (this.InternetProvider.networkConnected == true && ref.nativeElement.localName == 'page-no-internet') {
      let toast = this.toastCtrl.create({
        message: 'Conectado a la Red',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      this.InternetProvider.setRootPage();
    }
    else {
      let toast = this.toastCtrl.create({
        message: 'No hay Coneccion',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad NoInternetPage');
  }

}
