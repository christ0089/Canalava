import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DocumentViewer, DocumentViewerOptions} from '@ionic-native/document-viewer';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private document:DocumentViewer) {

  }

  getData(type) {
    this.navCtrl.push("EventManagerPage", {
      Type : type
    })
  }

  openDocument(){
    const options: DocumentViewerOptions = {
      title: 'My PDF'
    }
    
    this.document.viewDocument("assets/Beneficios.pdf", 'application/pdf', options)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServicesPage');
  }



}
