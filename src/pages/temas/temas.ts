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
  type: string = ""

  constructor(public navCtrl: NavController,
    private users: UsersProvider, private content: ContentLoaderService, public navParams: NavParams) {
      let data = this.navParams.get('Type');
      console.log(data);
      if (data != null) {
        this.temas$ = of([]);
      
        this.temas$ = this.content.getObjectList(`Desmanchado/${data}`);
        console.log(this.temas$);
        if (data === 'Tint') {
          this.type = "Tintorería";
          console.log('Change Label');
        }
        else {
          this.type = "Lavandería";
        }
      } else {
        this.type = "Temas";

        this.temas$ = this.content.getObjectList(`InductryInquiry/AllInquiries`);
      }
  }


  ionViewWillEnter() {

  }

  openTema(tema) {
    if (this.type == 'Temas') {
      this.navCtrl.push("TemaPage", {
        Key: tema
      });
    }else {
      this.navCtrl.push("TemaPage",{
        Key : null,
        Tema : tema
      });
    }
  }

  createTema() {
    this.navCtrl.push("UploadPage", {
      Type: 1
    })
  }

}
