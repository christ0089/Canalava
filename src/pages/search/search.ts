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
  icons: string = '';
  state = '';
  anuncio$: Observable<any[]>;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private anuncios: AdProvider,
    private inAppBrowser: InAppBrowser,
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
    this.state = $event._value;
    this.dataArray$ = this.contentService.getObjectList(this.state, 'isBusiness', true, 10);
  }

  getItems(searchbar) {
    var name = searchbar.srcElement.value;
    if (name == '') {
      this.dataArray$ = this.contentService.getObjectList(this.state, 'isBusiness', true, 20);
      return;
    }
    this.dataArray$ = this.contentService.getObjectList(this.state, 'isBusiness', true).map((data: any[]) => {
      return data.filter(data => {
        if (data.Name.toLowerCase().indexOf(name.toLowerCase()) > -1) {
          return true;
        }
        return false;
      })
    })
  }

  async onChange($event) {
    console.log($event);
    if ($event > 0) {
      this.dataArray$ = await this.contentService.getObjectList(this.state, 'Type', $event, 20);
      return;
    }
    this.dataArray$ = this.contentService.getObjectList(this.state, 'isBusiness', true, 20);
  }

  openWebsite(anuncio) {
    this.inAppBrowser.create(anuncio);
  }

}
