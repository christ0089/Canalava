import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, Events } from 'ionic-angular';
import { ToastAndLoadProvider } from '../../providers/AlertandLoader';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { FirebaseApp } from 'angularfire2';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private load_and_toast: ToastAndLoadProvider,
    private auth: AuthServiceProvider, private platform: Platform, private alertCtrl: AlertController,
    private firebase: FirebaseApp, private events: Events) {
  }

  ionViewDidLoad() {
    this.unregister = this.platform.registerBackButtonAction(() => {
    })
  }

  Email: string = "";
  Password: string = "";
  counter = 0;
  private unregister: any;

  LoginWithEmail() {
    this.load_and_toast.presentLoader();
    let credentials = {
      email: this.Email,
      password: this.Password
    };
    let authData = this.auth;
    authData.signInWithEmail(credentials)
      .then(
        (returnedUser) => {
          if (authData.afAuth.auth.currentUser.emailVerified == false && authData.afAuth.auth.currentUser.uid != "kiCJPCT9GPTEYd1sP9tgP2nzgg63") {
            this.load_and_toast.dismissLoader();
            authData.afAuth.auth.currentUser.sendEmailVerification();
            this.load_and_toast.presetToast("Activa tu cuenta, te enviamos un correo electronico verificalo");
            this.auth.afAuth.auth.signOut();
          } else {
            this.load_and_toast.dismissLoader();
            this.unregister();
            this.events.publish("LogIn");
            this.navCtrl.pop();
          }
        },
        error => {
          this.load_and_toast.dismissLoader();
          this.errorHandler(error);
        }
      ).catch((error) => {
        this.errorHandler(error);
      });
  }

  //Error Handler
  errorHandler(error) {
    if (this.counter == 3) {
      this.openAlerForReset();
    } else {
      this.counter++;
    }
    this.load_and_toast.presetToast("No se pudo Iniciar Session");
  }

  openAlerForReset() {
    const confirm = this.alertCtrl.create({
      title: 'Numero maximo de Intentos',
      message: 'Quieres que te enviemos un email para resetear tu constraseña?',
      buttons: [
        {
          text: 'Rechazar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            this.firebase.auth().sendPasswordResetEmail(this.Email).then(() => {
              this.load_and_toast.presetToast("Se ha enviado un email para cambiar la contraseña");
            });
          }
        }
      ]
    });
    confirm.present();
  }

}