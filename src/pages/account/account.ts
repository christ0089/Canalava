import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController } from 'ionic-angular';
import { ContentProvider } from '../../providers/content/content';
import { UsersProvider } from '../../providers/users/users';

/**
 * Generated class for the AccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage { 
  displayMode: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, private content:ContentProvider, private userData: UsersProvider,
  private actionSheetCtrl:ActionSheetController, private modalCtrl:ModalController) {
    this.displayMode = "List";
  }


  selected = 0;

  ionViewDidLoad() {
    this.userData.getCurrentSession();
  }

  addImage(){
    this.navCtrl.push('UploadPage');
  }

  onChange(event) {
    this.selected = event;
    this.userData.setSelectedAccount(this.selected);
  }

  openSettings() {
    this.navCtrl.push("SettingsPage", {
      Type : 0
    })
  }

  openPhoto(content) {
    this.navCtrl.push("PhotoPage", {
      Content: content,
      ID : this.userData.userID
    })
  }

  presentActionSheet(content) {
    console.log("OpenActionScheet");
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your album',
      buttons: [
        {
          text: 'Borrar',
          role: 'destructive',
          handler: () => {
            this.content.deletePicture(content.Key, this.userData.selectedID).then(() =>{
              this.navCtrl.pop();
            });
          }
        },
        {
          text: 'Editar',
          handler: () => {
            this.navCtrl.push("PhotoPage", {
              Content: content,
              ID : this.userData.userID,
              isEditEnabled : true
            })
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Archive clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  giveLike(content) {
    if (content.isImageLiked == false) {
      content.isImageLiked = true;
      content.likeNumber++;
    } else {
      content.isImageLiked = false;
      content.likeNumber--;
    }
    this.content.postLike(content.ID, this.userData.userID, content.isImageLiked).catch(() => {
      if (content.isImageLiked == false) {
        content.isImageLiked = true;
        content.likeNumber++;
      } else {
        content.isImageLiked = false;
        content.likeNumber--;
      }
    })
  }

  editData() {
    let user: any = this.userData.getSelectedAccount();
    let data = {
      "Name": user.Name,
      "Phone": user.Phone,
      "Img": user.Img,
      "isPhonePublic": user.isPhonePublic,
    }
    let profileModal = this.modalCtrl.create("EditPage", {
      UserData : data
    });
    profileModal.present();
  }
}
