import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private userData:UsersProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

  signOut() {
    this.navCtrl.pop();
    this.userData.signOut();
  }

  openWebsite(path:string) {
    if (path == "Canalava") {
      window.open("http://oneware.com.mx", '_system', 'location=yes');
    }else if (path == "Terms") {
      window.open("http://oneware.com.mx", '_system', 'location=yes');
    }else if (path == "Security") {
      window.open("http://oneware.com.mx", '_system', 'location=yes');
    }
  }

}
