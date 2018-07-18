import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseApp } from '../../../node_modules/angularfire2';

/**
 * Generated class for the ServicesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-services',
  templateUrl: 'services.html',
})
export class ServicesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  getData(type) {
    this.navCtrl.push("EventManagerPage", {
      Type : type
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ServicesPage');
  }



}
