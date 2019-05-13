import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, Events } from 'ionic-angular';
import { ToastAndLoadProvider } from '../../providers/AlertandLoader';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { FirebaseApp } from 'angularfire2';
import { WindowProvider } from '../../providers/window/window';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export class LogInfo {
  public state = "Login";
  public Email: string = "";
  public Password: string = "";
  public Phone: string = "";
  public Name: string = "";
  public RePassword: string = "";
  public image_url: string = "";

  get Credentials() {
    let creds = {
      Email: this.Email,
      Password: this.Password
    }
    return creds
  }

  get userDataStore() {
    let data = {
      "ProfileImg": this.image_url,
      "Email": this.Email,
      "Id": "",
      "Name": this.Name,
      "Phone": this.Phone
    }
    return data
  }

  isPhoneNumberValid() {
    var pattern = /^\+[0-9\s\-\(\)]+$/;
    var phoneNumber = '+52' + this.Phone;
    return phoneNumber.search(pattern) !== -1;
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}

export class Phone {
  Country: string;
  Area: string;
  Prefix: string;
  line: string;

  get e164() {
    const num = this.Country.toString() + this.Area.toString() + this.Prefix.toString() + this.line.toString()
    return `+${num}`;
  }
}

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {

  @ViewChild('recaptcha-container') captchaRef: ElementRef;

  Email: string = "";
  Password: string = "";
  counter = 0;
  private unregister: any;

  phoneNumber = new Phone();
  verificationCode: string;
  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;

  public user = new LogInfo();
  state = "Login";
  allowed = true;

  constructor(public navCtrl: NavController, public navParams: NavParams, private load_and_toast: ToastAndLoadProvider,
    private firebaseAuth: AngularFireAuth,
    private auth: AuthServiceProvider, private platform: Platform, private alertCtrl: AlertController,
    private firebase: FirebaseApp,
    private events: Events,
    private win: WindowProvider) {
  }

  ionViewDidLoad() {
    this.unregister = this.platform.registerBackButtonAction(() => { })
    const db = this.firebase.database().ref();
    db.child("RegisterAllowed").once("child_added").then((snap) => {
      console.log(`${snap.key}`);
      if (snap.val() == true) {
        this.allowed = true;
      } else {
        this.allowed = false;
      }
    })
  }

  ngOnInit() {

  

  }

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
            this.logIn();
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


  private logIn() {
    this.load_and_toast.dismissLoader();
    this.unregister();
    this.events.publish("LogIn");
    this.navCtrl.pop();
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

  verificationId: any;
  codeSent = false;

  sendLoginCode() {
    const num = this.phoneNumber.e164;
    this.codeSent = true;
    console.log(num);
    this.load_and_toast.presentLoader();
    (<any>window).FirebasePlugin.verifyPhoneNumber(num, 60, (credential) => {
      console.log(credential);
      this.load_and_toast.dismissLoader();
      this.verificationId = credential.verificationId;
    }, () => this.load_and_toast.presetToast("No se pudo Iniciar Session"));
  }


  verifyLoginCode() {
    var signInCredential = firebase.auth.PhoneAuthProvider.credential(this.verificationId,this.verificationCode);
    firebase.auth().signInWithCredential(signInCredential).then(()=>{    
      console.log(signInCredential);
      setTimeout(()=>{
        this.load_and_toast.dismissLoader();
        this.load_and_toast.presetToast('OTP Verified');
      },2000);
      this.navCtrl.setRoot('RoleSelectionPage');
    }).catch(()=>{
      this.load_and_toast.dismissLoader();
      this.load_and_toast.presetToast('OTP Failed');
      console.log('Erorr in OTP');
    });
  }

  keyTab(event, max) {
    let element = event.srcElement.nextElementSibling;

    console.log(event.target.value.length, max)
    // get the sibling element

    if (element == null)   // check if its null
      return;
    else if (event.target.value.length == max) {
      element.focus();
    }
  }




}
