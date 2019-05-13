import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';

/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  tab1Root: string = 'MainFeedPage';
  tab2Root: string = 'SearchPage';
  tab3Root: string = 'MessagesPage';
  tab4Root: string = 'ServicesPage';
  tab5Root: string = 'AccountPage';

  constructor(public navCtrl: NavController,
    public navParams: NavParams, private events: Events, private userData: UsersProvider, public modalCtrl: ModalController) {
    this.subscribeLogin();
    this.events.subscribe("LogIn", () => {
      this.subscribeLogin();
      userData.getCurrentSession();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

  subscribeLogin() {
    this.events.subscribe("LogOut", () => {
      let profileModal = this.modalCtrl.create("LoginPage");
      profileModal.present();
      this.events.unsubscribe("LogOut");
    });

  }

}
