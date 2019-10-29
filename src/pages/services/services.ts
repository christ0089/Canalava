import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ToastAndLoadProvider } from '../../providers/AlertandLoader';

import { ContentLoaderService } from '../../providers/content/content-loader.service';
import { map } from 'rxjs/operator/map';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
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

  arrayProvider = [
    { name: 'Lavandería', icon: 'appname-customicon1', path: 'Main' },
    { name: 'Tintorería', icon: 'appname-customicon2', path: 'Main' },
    { name: 'Blanqueo', icon: 'appname-customicon5', path: 'Secondary/Blanqueo' },
    { name: 'Simbología', icon: 'appname-customicon5', path: 'Secondary/Simbología' },
    { name: 'Fibras', icon: 'appname-customicon4', path: 'Main-Fibras' },
    { name: 'Glosario', icon: 'book', path: 'Secondary/Glosario' },
  ]

  array$: Observable<any[]>;
  title = "Manchas";
  path = "";
  key = "";
  color = "#5AC0DD";
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private contentProvider: ContentLoaderService,
    private toast: ToastAndLoadProvider) {

  }

  getData(type) {
    if (type.path == 'data') {
      this.navCtrl.insert(this.navCtrl.length(), "TemaPage", {
        Type: type,
        key: this.key,
        path: this.path + '/' + type.name
      })
      return;
    }
    if (type.path == 'Main-Fibras' ||type.path == "Secondary/Blanqueo" || type.path == 'Secondary/Glosario' ||  type.path == 'Secondary/Glosario' || type.path == "Secondary/Simbología") {
      this.key = type.name;
    }
    if (type.path == 'Main') {
      this.key = type.name;
      this.navCtrl.push("ServicesPage", {
        type: type,
        key: this.key,
        path: ''
      })
      return;
    }
    this.navCtrl.push("ServicesPage", {
      type: type,
      key: this.key,
      path: this.path == "" ? type.name : this.path + '/' + type.name
    })
  }

  ionViewWillLoad() {
    if (this.navParams.get('type') != null) {
      console.log(this.navParams.get('key'));
      let type = this.navParams.get('type');
      this.key = this.navParams.get('key');
      this.path = `${this.navParams.get('path')}`
      this.title = type.name;
      this.array$ = of([]);
      this.array$ = this.contentProvider.getObjectList<any[]>(`Desmanchado/${type.path}`)

      if (this.key == "Blanqueo") {
        this.color = '#A08FE8';
      }
      if (this.key == "Tintorería") {
        this.color = '#8FE899';
      }

      return;
    }
    this.array$ = of(this.arrayProvider);

  }


}
