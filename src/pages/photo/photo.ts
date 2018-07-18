import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';
import { ContentProvider } from '../../providers/content/content';
import { ToastAndLoadProvider } from '../../providers/AlertandLoader';

/**
 * Generated class for the PhotoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html',
})
export class PhotoPage {

  content: any;
  message = "";
  id = "";
  @Input('isEditEnabled')isEditEnabled: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private userData: UsersProvider
    , private actionSheetCtrl:ActionSheetController, private contentProvider: ContentProvider,
    private alertCtrl: ToastAndLoadProvider) {
    this.content = navParams.get("Content");
    this.id = navParams.get("ID");
    this.message = this.content.Message;
    this.isEditEnabled = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhotoPage');
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Que deseas hacer?',
      buttons: [
        { 
          text: 'Borrar',
          role: 'destructive',
          handler: () => {
            console.log(this.content.Key)
            this.contentProvider.deletePicture(this.content.Key, this.userData.userID).then(() =>{
              this.navCtrl.pop();
            });
          }
        },
        {
          text: 'Editar',
          handler: () => {
            this.isEditEnabled = true
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
 
    actionSheet.present();
  }

  saveMessage() {
    this.contentProvider.editPost(this.message, this.userData.userID, this.content.Key).then(() => {
      this.navCtrl.pop();
    }).catch((error) => {
      this.alertCtrl.presetToast(error);
    })
  }

}
