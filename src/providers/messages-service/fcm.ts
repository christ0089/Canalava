import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Firebase } from '@ionic-native/firebase'
import { FirebaseApp } from 'angularfire2';

/*
  Generated class for the FcmProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FcmProvider {

  constructor(public http: HttpClient, private platform: Platform, 
    private firebaseAngular: FirebaseApp, private firebase: Firebase) {
    console.log('Hello FcmProvider Provider');
  }

  async getToken(id) {
    if (this.platform.is('ios')) {
      this.firebase.getToken().then((currentToken) => {
        this.saveToken(currentToken, id);
      });
      const perm = await this.firebase.grantPermission();
    } else if (this.platform.is('android')) {
      this.firebase.getToken().then((currentToken) => {
        this.saveToken(currentToken, id);
      });
    }
  }

  saveToken(token, id ) {
      if (!token) return;
      this.firebaseAngular.database().ref().child('MessagesBranch').child('FCMTokens').update({
        [id] : token
      })
  }

  listenToNotification() {
    console.log(this.platform);
    return this.firebase.onNotificationOpen();
  }
}
