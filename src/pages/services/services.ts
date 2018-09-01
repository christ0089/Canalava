import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { DocumentViewer, DocumentViewerOptions} from '@ionic-native/document-viewer';
import { ToastAndLoadProvider } from '../../providers/AlertandLoader';
import { File } from '@ionic-native/file';
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
  , private toast: ToastAndLoadProvider, private platform: Platform,
private file: File) {

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
    let toast = this.toast;

    var address = "assets/Beneficios.pdf";
    if (this.platform.is('Android')) {
      address = this.file.applicationDirectory + "www/assets/Beneficios.pdf"
    }
    this.document.viewDocument(address, 'application/pdf', options, function onShow(){}, function onClose(){}, function onMissingApp(){},
    function onError(error){ toast.presetToast("Error al abrir archivo" + error) })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServicesPage');
  }



}
