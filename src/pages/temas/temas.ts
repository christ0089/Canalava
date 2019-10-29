import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TemasDeIndustriaProvider } from '../../providers/temas-de-industria/temas-de-industria';
import { DatePipe } from '@angular/common';
import { UsersProvider } from '../../providers/users/users';
import { ContentLoaderService } from '../../providers/content/content-loader.service';
import { Observable } from 'rxjs';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
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
  temas$: Observable<any[]>;
  title: string = ""

  constructor(public navCtrl: NavController,
    private users: UsersProvider, private content: ContentLoaderService, public navParams: NavParams) {
    this.title = "Temas";
  }


  ionViewWillEnter() {


    this.temas$ = this.content.getObjectList(`InductryInquiry/FullInquiry`);

  }

  openTema(tema) {
    this.navCtrl.push("TemaPage", {
      tema: tema
    });

  }

  createTema() {
    this.navCtrl.push("UploadPage", {
      Type: 1
    })
  }

}
