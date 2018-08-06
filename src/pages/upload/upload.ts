import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ContentProvider } from '../../providers/content/content';
import { UsersProvider } from '../../providers/users/users';
import { TemasDeIndustriaProvider } from '../../providers/temas-de-industria/temas-de-industria';
import { ToastAndLoadProvider } from '../../providers/AlertandLoader';
import { PostPicture } from '../../providers/post-picture';

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
    private user: UsersProvider, private temas: TemasDeIndustriaProvider, private loader: ToastAndLoadProvider,
    private camera: PostPicture) {
    this.imgURL = "";
    this.message = "";
    this.title = "";
  }

  ionViewDidLoad() {
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
    if (this.uploadType == 0 && this.message != "" && this.imgURL != "") {
      this.camera.postPicture(this.imgURL, "Users/Posts" + this.user.userID).then((url: string) => {
        let data = {
          "Img": url,
          "Message": this.message
        }
        this.content.postPicture(this.user.userID, data).then(() => {
          this.loader.dismissLoader();
          this.navCtrl.pop();
        }).catch((error) => {
          this.loader.dismissLoader();
          this.loader.presetToast(error);
        });
      }).catch((error) => {
        this.loader.dismissLoader();
        this.loader.presetToast(error);
      });
    } else if (this.message != "" && this.imgURL != "" && this.title != "") {
      this.camera.postPicture(this.imgURL, "Users/Temas" + this.user.userID).then((url: string) => {
        let data = {
          "Img": url,
          "Message": this.message,
          "Title": this.title
        }
        this.temas.postTema(data).then(() => {
          this.loader.dismissLoader();
          this.navCtrl.pop();
        }).catch((error) => {
          this.loader.dismissLoader();
          this.loader.presetToast(error);
        });
      }).catch((error) => {
        this.loader.dismissLoader();
        this.loader.presetToast(error);
      });
    } else {
      this.loader.dismissLoader();
      this.loader.presetToast("Favor de Llenar todos los campos o escoger una imagen");
    }
  }


  openGallery() {
    this.camera.openGallery().then((url: string) => {
      this.imgURL = url;
    });
  }

}
