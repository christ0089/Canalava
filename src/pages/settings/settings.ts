import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ToastAndLoadProvider } from '../../providers/AlertandLoader';

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

  constructor(public navCtrl: NavController,
    private auth: AuthServiceProvider,
    private snackBar: ToastAndLoadProvider,
     public navParams: NavParams, private userData: UsersProvider,
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
      this.inAppBrowser.create("https://canalava.org.mx")
    } else if (path == "Privacy") {
      this.inAppBrowser.create("https://canalava.org.mx/AVISO-DE-PRIVACIDAD.html")
    } else if (path == "Terms") {
      this.inAppBrowser.create("https://canalava.org.mx/Terminos-y-condiciones.html")
    }
  }

  changePassword() {
    this.auth.afAuth.auth.sendPasswordResetEmail(this.auth.afAuth.auth.currentUser.email).then(() => {
      this.snackBar.presetToast('Se ha enviado un correo para cambiar la contraseña');
    });
  }


}
