import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import { UsersProvider } from '../users/users';

/*
  Generated class for the MessagesServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MessagesServiceProvider {

  constructor(public http: HttpClient, private firebase: FirebaseApp, private userConent: UsersProvider) {
    console.log('Hello MessagesServiceProvider Provider');
  }

  public convos = {};
  public key: string[] = [];

  getMessagesUserConvos() {
    const db = this.firebase.database().ref();
    const id = this.userConent.selectedID;
    this.key = []
    this.convos = {}
    db.child("Messages").child(id).on("value", (snapchot) => {
      snapchot.forEach((child) => {
        var toID = child.key
        if (this.key.indexOf(child.key) == -1) {
          this.key.push(child.key);
        }
        db.child("Messages").child(id).child(toID).once("value", (messages) => {
          console.log(messages.val());
          let key = []
          let value = "";

          messages.forEach(element => {
            key.push(element.val())
            return false;
          })
          key = key.sort((a, b) => { return b - a });

          messages.forEach(element => {
            if (element.val() == key[0]) {
              value = element.key
            }
            return false;
          })

          db.child("MessagesBranch").child("Messages").child(value).once("value").then((message) => {
            let data = message.val();
            this.convos[toID] = data;
            
          })
        })
        return false;
      })
    });

  }


  postMessage(message) {
    const db = this.firebase.database().ref();
    message.Timestamp = Date.now();
    return new Promise((resolve, reject) => {
      let ref = db.child("MessagesBranch").child("Messages").push()
      let key = ref.key
      const postMessege = ref.set(message);
      const recieverMessage = db.child("Messages").child(message.Receiver).child(message.Sender).update({ [key]: Date.now() });
      const senderMessage = db.child("Messages").child(message.Sender).child(message.Receiver).update({ [key]: Date.now() })
      Promise.all([postMessege, recieverMessage, senderMessage]).then(() => {
        return resolve();
      }).catch((error) => {
        return reject(error);
      })
    })
  }

}
