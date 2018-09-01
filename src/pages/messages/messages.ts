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

  constructor(public navCtrl: NavController, public navParams: NavParams, private messages: MessagesServiceProvider, private users: UsersProvider) {
    if (this.messageKeys.length == 0) {
      this.messages.getMessagesUserConvos().then((data) => {
        this.convos = data;
        this.getMessageData(data);
      });
    } 
  }

  messageKeys = [];
  convos = {};

  ionViewDidLoad() {

  }

  getMessageData(data) {
    this.messageKeys = Object.keys(data).reverse();
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
