import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';
import { ContentProvider } from '../../providers/content/content';
import { DatePipe } from '@angular/common';
import { FcmProvider } from '../../providers/messages-service/fcm';
import { ToastAndLoadProvider } from '../../providers/AlertandLoader';
import { tap } from 'rxjs/operators';
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

  constructor(public navCtrl: NavController,
     public navParams: NavParams, 
     private fcm: FcmProvider,
     private userContent: UsersProvider,
     public content: ContentProvider,
     private toastCtrl: ToastAndLoadProvider) {
    this.userContent.getCurrentSession();
  }


  ionViewDidLoad() {
    /*this.fcm.listenToNotification().pipe(tap(msg => {
      this.toastCtrl.presetToast(msg.body)
     }))*/
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
      content.likeNumber++;
    } else {
      content.isImageLiked = false;
      content.likeNumber--;
    }
    this.content.postLike(content.ID, this.userContent.userID, content.isImageLiked).catch(() => {
      if (content.isImageLiked == false) {
        content.isImageLiked = true;
        content.likeNumber++;
      } else {
        content.isImageLiked = false;
        content.likeNumber--;
      }
    })
  }
}
