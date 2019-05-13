import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseApp } from 'angularfire2';
import { UsersProvider } from '../../providers/users/users';
import { MessagesServiceProvider } from '../../providers/messages-service/messages-service';
import { ToastAndLoadProvider } from '../../providers/AlertandLoader';

/**
 * Generated class for the MessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {

  public messageKey = "";

  public test = [];

  data = {
    "Receiver" : this.messageKey,
    "Sender" : this.userData.selectedID,
    "Timestamp" : 0,
    "Message" : ""
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, private firebase:FirebaseApp,
     private userData:UsersProvider, private messageProvider:MessagesServiceProvider, private alertProvider:ToastAndLoadProvider) {
    this.getMessages(this.test);
  }

  getMessages(messageArray: Array<any>) {
    this.messageKey = this.navParams.get("key");
    let ref = this.firebase.database().ref();

    ref.child("Messages").child(this.userData.selectedID).child(this.messageKey).on("child_added", function(snapchot) {
      let key  = snapchot.key;
       ref.child("MessagesBranch").child("Messages").child(key).once("value").then((snapchotMessage) => {
        console.log(snapchotMessage.val());
        let dataMessage = snapchotMessage.val();
        var value = {
          Message: dataMessage.Message,
          Sender: dataMessage.Sender,
          Timestamp: dataMessage.Timestamp
        }

        messageArray.push(value);
      }).then(() => {
        messageArray = messageArray.sort((n1, n2) => {
          return n1.Timestamp - n2.Timestamp
        })
        console.log(messageArray);
      });
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagePage');
  }

  sendMessage() 
  {
  
    this.data.Receiver = this.messageKey;
    this.messageProvider.postMessage(this.data).then(() => {
      this.data.Message = '';
    }).catch((error) => {
      this.alertProvider.presetToast(error);
      this.data.Message = "";
    })
  }
}
