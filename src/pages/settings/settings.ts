import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';
import { InAppBrowser } from '@ionic-native/in-app-browser';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private userData: UsersProvider,
    private inAppBrowser: InAppBrowser) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  signOut() {
    this.navCtrl.pop();
    this.userData.signOut();
  }

  openWebsite(path: string) {
    console.log(path);
    if (path == "Canalava") {
      this.inAppBrowser.create("https://www.canalava.org.mx")
    } else if (path == "Privacy") {
      this.inAppBrowser.create("https://https://canalava.org.mx/AVISO-DE-PRIVACIDAD.html")
    } else if (path == "Terms") {
      this.inAppBrowser.create("https://www.canalava.org.mx")
    } else {
      this.inAppBrowser.create("https://www.canalava.org.mx")

    }

  }


}
