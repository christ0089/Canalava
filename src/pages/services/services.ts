import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DocumentViewer, DocumentViewerOptions} from '@ionic-native/document-viewer';
import { ToastAndLoadProvider } from '../../providers/AlertandLoader';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private document:DocumentViewer
  , private toast: ToastAndLoadProvider) {

  }

  getData(type) {
    this.navCtrl.push("EventManagerPage", {
      Type : type
    })
  }

  openDocument(){
    const options: DocumentViewerOptions = {
      title: 'Beneficios'
    }
    let toast = this.toast
    this.document.viewDocument('www/assets/Beneficios.pdf', 'application/pdf', options, function onShow(){}, function onClose(){}, function onMissingApp(){},
    function onError(){ toast.presetToast("Error al abrir archivo") })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServicesPage');
  }



}
