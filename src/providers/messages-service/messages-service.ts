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

  convos = {};

  getMessagesUserConvos() {
    var convos = {};
    const db = this.firebase.database().ref();
    const id = this.userConent.selectedID;
    return new Promise((resolve) => {
      db.child("Messages").child(id).on("child_added", (snapchot) => {
        var toID = snapchot.key
        db.child("Messages").child(id).child(toID).once("child_added").then((messages) => {
          console.log(messages.val());
          db.child("MessagesBranch").child("Messages").child(messages.key).once("value").then((message) => {
            console.log(message.val());
            let data = message.val();
            convos[toID] = data;
          }).then(()=> {
            console.log(convos, "Data");
            return resolve(convos);    
          });
        })
      });
    });
  }


  postMessage(message) {
    const db = this.firebase.database().ref();
    let key = ""
    return new Promise((resolve, reject) => {
      let ref = db.child("MessagesBranch").child("Messages").push()
      key = ref.key
      ref.set({
        "Message" : message.Message,
        "Receiver" : message.Receiver,
        "Sender" : message.Sender,
        "Timestamp" : Date.now()
      }).then(()=> {
        db.child("Messages").child(message.Receiver).child(message.Sender).update({
          [key] : Date.now()
        })
        db.child("Messages").child(message.Sender).child(message.Receiver).update({
          [key] : Date.now()
        })
        return resolve();
      }).catch((error)=> {
        return reject(error);
      })
    })
  }

}
