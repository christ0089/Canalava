import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PostPicture } from '../../providers/post-picture';
import { UsersProvider } from '../../providers/users/users';
import { ToastAndLoadProvider } from '../../providers/AlertandLoader';
import { User } from '../../Models/User';

/**
 * Generated class for the EditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html',
})
export class EditPage {
  user_data: User;
  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: PostPicture,
    private userData: UsersProvider, private toastCtrl: ToastAndLoadProvider) {
    this.user_data = navParams.get("UserData");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPage');
  }

  saveData() {
    this.toastCtrl.presentLoader()
    if (this.user_data.Name == "") {
      this.toastCtrl.dismissLoader();
      this.toastCtrl.presetToast("Necesitas un Nombre");
    }
    else if (this.user_data.Img == this.userData.getSelectedAccount().Img){
      this.userData.updateUserData(this.user_data).then(() => {
        this.toastCtrl.dismissLoader();
        this.closeModal();
      }).catch((error) => {
        this.toastCtrl.dismissLoader();
        this.toastCtrl.presetToast(error);
      });
    } else {
      this.camera.postPicture(this.user_data.Img, "Users" + this.userData.userID).then((url:string)=> {
        this.user_data.Img = url;
        this.userData.updateUserData(this.user_data).then(() => {
          this.toastCtrl.dismissLoader();
          this.closeModal();
        }).catch((error) => {
          this.toastCtrl.dismissLoader();
          this.toastCtrl.presetToast(error);
        });
      }).catch((error) => {
        this.toastCtrl.dismissLoader();
        this.toastCtrl.presetToast(error);
      });
    }
  }

  openGallery() {
    this.camera.openGallery().then((url: string) => {
      this.user_data.Img = url;
    });
  }

  closeModal() {
    this.navCtrl.pop();
  }
}
