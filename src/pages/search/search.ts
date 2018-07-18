import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  isMessaging: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private userContent: UsersProvider) {
    this.isMessaging = false;
    if (navParams.get('isMessaging') == true) {
      this.isMessaging = true;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
  }

  openAccount(user) {
    if (this.isMessaging == false) {
      this.navCtrl.push("UserProfilePage", {
        data : user
      });
    }
    if (this.isMessaging == true) {
      this.navCtrl.push("MessagePage", {
        key : user.Key
      });
    }
  }

  getItems(searchbar) {
    var name = searchbar.srcElement.value;
    this.userContent.getUser(name);
  }
}
