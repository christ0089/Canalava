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
  public key = [];

  getMessagesUserConvos() {
    const db = this.firebase.database().ref();
    const id = this.userConent.selectedID;
    db.child("Messages").child(id).on("value", (snapchot) => {
      snapchot.forEach((child) => {
        console.log("Message Call");
        var toID = child.key
        this.key.push(child.key);
        db.child("Messages").child(id).child(toID).on("value", (messages) => {
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
    let key = ""
    return new Promise((resolve, reject) => {
      let ref = db.child("MessagesBranch").child("Messages").push()
      key = ref.key
      ref.set({
        "Message": message.Message,
        "Receiver": message.Receiver,
        "Sender": message.Sender,
        "Timestamp": Date.now()
      }).then(() => {
        db.child("Messages").child(message.Receiver).child(message.Sender).update({
          [key]: Date.now()
        }).catch((error) => {
          return reject(error);
        })
        db.child("Messages").child(message.Sender).child(message.Receiver).update({
          [key]: Date.now()
        }).catch((error) => {
          return reject(error);
        })
        return resolve();
      }).catch((error) => {
        return reject(error);
      })
    })
  }

}
