import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ContentProvider } from '../../providers/content/content';
import { UsersProvider } from '../../providers/users/users';
import { TemasDeIndustriaProvider } from '../../providers/temas-de-industria/temas-de-industria';
import { ToastAndLoadProvider } from '../../providers/AlertandLoader';
import { PostPicture } from '../../providers/ImageUploadRouting';

/**
 * Generated class for the UploadPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-upload',
  templateUrl: 'upload.html',
})
export class UploadPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private content: ContentProvider,
    private user: UsersProvider, private temas:TemasDeIndustriaProvider, private loader:ToastAndLoadProvider,
  private camera:PostPicture) {
    this.imgURL = "";
    this.message = "";
    this.title = "";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadPage');
    if (this.navParams.get("Type") != null) {
      this.uploadType = this.navParams.get("Type");
    }
  }

  imgURL = "";
  message = "";
  title = "";

  uploadType = 0;

  postData() {
    this.loader.presentLoader();
    if (this.message != "" && this.imgURL != "") {
      if (this.uploadType == 0) {
        let data = {
          "Img": this.imgURL,
          "Message": this.message
        }
        this.content.postPicture(this.user.userID, data);
      }else if (this.title != "") {
        let data = {
          "Img": this.imgURL,
          "Message": this.message,
          "Title": this.title
        }
        this.temas.postTema(data).then(() => {
          this.loader.dismissLoader();
          this.navCtrl.pop();
        });
      }
    } else {

    }
  }

  openGallery() {
    this.camera.openGallery().then((url:string) => {
      this.imgURL = url;
    });
  }

}
