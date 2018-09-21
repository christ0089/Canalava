import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { ContentProvider } from '../../providers/content/content';
import { UsersProvider } from '../../providers/users/users';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
declare var google: any;
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
  map:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
     private content: ContentProvider, private googleMaps:GoogleMapsProvider,
      private user_data:UsersProvider, private platform: Platform) {

  }

  @ViewChild('googleMaps') mapRef : ElementRef;

  ionViewDidLoad() {
    this.userData = this.navParams.get('data');
    this.DataImgs = this.content.getProfileContent(this.userData.Key, this.user_data.userID);
    this.platform.ready().then(() => {
      console.log(this.mapRef);
      this.showMap();
    })
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

  showMap() {
    const location = new google.maps.LatLng(-51.507351, -0.127758)

    const options = {
      center: location,
      zoom: 10
    }

    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
    this.googleMaps.getAddresses(this.map,  this.userData.Key, this.userData.Name)
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
