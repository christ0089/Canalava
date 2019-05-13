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

  constructor(public navCtrl: NavController, public navParams: NavParams, private document: DocumentViewer
    , private toast: ToastAndLoadProvider, private platform: Platform,
    private inAppBrowser: InAppBrowser) {

  }

  getData(type) {
    this.navCtrl.push("EventManagerPage", {
      Type: type
    })
  }

  openTema() {
    this.navCtrl.push("TemasPage", {
    })
  }

  openDocument() {
    const options: DocumentViewerOptions = {
      title: 'Beneficios'
    }
    let toast = this.toast;

    var address = "assets/Beneficios.pdf";
    if (this.platform.is('android')) {
      this.inAppBrowser.create("https://canalava.org.mx/Beneficios.html")
      return 
    }
    this.document.viewDocument(address, 'application/pdf', options, function onShow() { }, function onClose() { }, function onMissingApp(appId, installer) {
      if (confirm("No tienes un visor de PDF, Quieres Instalar uno?" +
        + appId + " for Android?")) {
        installer();
      }
    },
      function onError(error) { toast.presetToast("Error al abrir archivo" + error) })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServicesPage');
  }

  openMagazine() {
    this.inAppBrowser.create("https://canalava.org.mx/Revista.html")
    //this.toast.presetToast("No Revista Disponible en este momento");
  }

}
