import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MessagesServiceProvider } from '../../providers/messages-service/messages-service';
import { UsersProvider } from '../../providers/users/users';
import { DatePipe } from '@angular/common';
/**
 * Generated class for the MessagesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
     private messages: MessagesServiceProvider, private users: UsersProvider) {
    if (this.messages.key.length == 0) {
      this.messages.getMessagesUserConvos()
    } 
  }
  ionViewDidLoad() {
  }


  getMessage(key) {
    if (key == null) {
      return ""
    }
    if (this.messages.convos[key].Message == null) {
      return ""
    }
    let message = this.messages.convos[key].Message
    return  message != null ? message : "" 
  }


  openMessages(messageKey) {
    this.navCtrl.push("MessagePage", {
      key : messageKey
    });
  }

  searchUser() {
    this.navCtrl.push("SearchPage", {
      isMessaging : true
    });
  }
}
