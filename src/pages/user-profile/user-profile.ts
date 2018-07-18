import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ContentProvider } from '../../providers/content/content';
import { UsersProvider } from '../../providers/users/users';

/**
 * Generated class for the UserProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {

  userData = {
    "Name": "",
    "Phone": "",
    "Img": "",
    "isPhonePublic": "",
    "Key": ""
  };
  DataImgs = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private content: ContentProvider, private user_data:UsersProvider) {

    
  }

  ionViewDidLoad() {
    this.userData = this.navParams.get('data');
    this.DataImgs = this.content.getProfileContent(this.userData.Key, this.user_data.userID);
  }

  openMessages() {
    this.navCtrl.push("MessagePage", {
      key : this.userData.Key
    });
  }

  openPhoto(content) {
    this.navCtrl.push("PhotoPage", {
      Content: content,
      ID : this.userData.Key
    })
  }

  giveLike(content) {
    if (content.isImageLiked == false) {
      content.isImageLiked = true;
      content.likeNumber++;
    } else {
      content.isImageLiked = false;
      content.likeNumber--;
    }
    this.content.postLike(content.ID, this.user_data.userID, content.isImageLiked).catch(() => {
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
