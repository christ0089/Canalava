import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';
import { ContentProvider } from '../../providers/content/content';
import { DatePipe } from '@angular/common';
import { ToastAndLoadProvider } from '../../providers/AlertandLoader';
import { ResultsProvider } from '../../providers/results/results';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AdProvider } from '../../providers/results/adProvider';
import { InAppBrowser } from '@ionic-native/in-app-browser';
/**
 * Generated class for the MainFeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-main-feed',
  templateUrl: 'main-feed.html',
})
export class MainFeedPage {

  data = [];
  content$:  Observable<any[]>;
  constructor(public navCtrl: NavController,
     public navParams: NavParams, 
     private userContent: UsersProvider,
     public content: ContentProvider,
     private results: ResultsProvider) {
    this.content$ = results.content$;

  }


  ionViewDidLoad() {
    this.userContent.getCurrentSession();

  }

  openSettings() {
    this.navCtrl.push("MessagesPage");
  }

  openAccount(key) {
    console.log(key);
    this.userContent.getProfileData(key).then((success) => {
      this.navCtrl.push("UserProfilePage", {
        data: success
      });
    });
  }
  

  giveLike(content) {
    if (content.isImageLiked == false) {
      content.isImageLiked = true;
    } else {
      content.isImageLiked = false;
    }
    console.log(content.isImageLiked);
    this.content.postLike(content.Uploader, this.userContent.userID, content.isImageLiked).catch(() => {
      if (content.isImageLiked == false) {
        content.isImageLiked = true;
      } else {
        content.isImageLiked = false;
      }
    })
  }

  doInfinite(infiniteScroll): Promise<void> { // 1
    if (!this.results.finished) { // 2
      return new Promise((resolve, reject) => {
        this.results.nextPage() // 3
          .pipe(take(1))
          .subscribe(movies => {
            console.log('Movies:', movies);
            resolve();
          });
      });
    }
    return Promise.resolve();
  }

}
