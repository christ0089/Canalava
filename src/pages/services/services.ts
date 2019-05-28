import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import { ToastAndLoadProvider } from '../../providers/AlertandLoader';
import { InAppBrowser } from '@ionic-native/in-app-browser';
/**
 * Generated class for the ServicesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-services',
  templateUrl: 'services.html',
})
export class ServicesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private toast: ToastAndLoadProvider) {

  }

  getData(type) {
    this.navCtrl.push("TemasPage", {
      Type: type
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServicesPage');
  }


}
