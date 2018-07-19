import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PostPicture } from '../../providers/ImageUploadRouting';
import { UsersProvider } from '../../providers/users/users';
import { ToastAndLoadProvider } from '../../providers/AlertandLoader';

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
  user_data : any
  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: PostPicture, 
    private userData:UsersProvider, private toastCtrl:ToastAndLoadProvider) {
    this.user_data = userData.userData;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPage');
  }

  saveData() {
    if (this.user_data.Name == "") {
      this.toastCtrl.presetToast("Necesitas un Nombre");
    }else {
      this.userData.updateUserData(this.user_data).then(() => {
        this.closeModal();
      }).catch((error) => {
        this.toastCtrl.presetToast(error);
      })
    }
  }

  openGallery() {
    this.camera.openGallery().then((url:string) => {
      this.user_data.Img = url;
    });
  }

  closeModal() {
    this.navCtrl.pop();
  }
}
