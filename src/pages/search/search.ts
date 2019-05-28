import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';
import { Observable } from 'rxjs';
import { ContentLoaderService } from '../../providers/content/content-loader.service';
import { User } from '../../Models/User';
import { AdProvider } from '../../providers/results/adProvider';
import { InAppBrowser } from '@ionic-native/in-app-browser';

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
  dataArray$: Observable<any[]>;
  icons : string = '';
  anuncio$: Observable<any[]>;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private anuncios: AdProvider,
    private inAppBrowser:InAppBrowser,
    private contentService: ContentLoaderService) {
    this.anuncio$ = anuncios.anuncio$;
  }

  ionViewDidLoad() {
    this.isMessaging = false;
    if (this.navParams.get('isMessaging') == true) {
      this.isMessaging = true;
    }
    this.dataArray$ = this.contentService.getObjectList('UserData', 'isBusiness', true, 10);
  }

  openAccount(user) {
    if (this.isMessaging == false) {
      this.navCtrl.push("UserProfilePage", {
        data: user
      });
    }
    if (this.isMessaging == true) {
      this.navCtrl.push("MessagePage", {
        key: user.key
      });
    }
  }

  segmentChanged($event) {
    console.log($event._value);
    if ($event._value == "partners") {
      this.dataArray$ = this.contentService.getObjectList('UserData', 'isBusiness', true, 10);
    }else {
      this.dataArray$ = this.contentService.getObjectList('Providers', 'isBusiness', true, 10);
    }
  }

  getItems(searchbar) {
    var name = searchbar.srcElement.value;
    if (name == '') {
      this.dataArray$ = this.contentService.getObjectList('UserData', 'isBusiness', true, 20);
      return;
    }
    this.dataArray$ = this.contentService.getObjectList('UserData', 'isBusiness', true).map((data: any[]) => {
      return data.filter(data => {
        if (data.Name.toLowerCase().indexOf(name.toLowerCase()) > -1) {
          return true;
        }
        return false;
      })
    })
  }

  openWebsite(anuncio, index) {
    if (index == null) {
      return
    }
    if (anuncio[index] != null) {
      this.inAppBrowser.create(anuncio[index].Website);
    }
  }

}
