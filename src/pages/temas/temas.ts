import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TemasDeIndustriaProvider } from '../../providers/temas-de-industria/temas-de-industria';
import { DatePipe } from '@angular/common';
import { UsersProvider } from '../../providers/users/users';
/**
 * Generated class for the TemasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-temas',
  templateUrl: 'temas.html',
})
export class TemasPage {

  constructor(public navCtrl: NavController,
    private users: UsersProvider, public navParams: NavParams, private temas: TemasDeIndustriaProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TemasPage');
    this.temas.getIndustryTopicSimple();
  }

  openTema(tema) {
    console.log(tema);
    this.navCtrl.push("TemaPage",{
      Key : tema 
    });
  }

  createTema() {
    this.navCtrl.push("UploadPage", {
      Type : 1
    })
  }

}
