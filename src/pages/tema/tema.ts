import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';
import { TemasDeIndustriaProvider } from '../../providers/temas-de-industria/temas-de-industria';
import { ToastAndLoadProvider } from '../../providers/AlertandLoader';

/**
 * Generated class for the TemaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tema',
  templateUrl: 'tema.html',
})
export class TemaPage {

  tema = {
    "Title": "",
    "Message": "",
    "MainPhoto": "/assets/imgs/Unknown.png",
    "Author": "",
    "AuthorImg": "",
    "Date": "",
    "PostedBy": ""
  };

  comment = "";
  commentsArray = [];
  id : any = null;

  isEditEnabled = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userData: UsersProvider,
    private temas: TemasDeIndustriaProvider, private alertController: ToastAndLoadProvider,
    private actionSheetCtrl: ActionSheetController) {
    this.isEditEnabled = false;
    let key = this.navParams.get("Key");
    console.log(key);
    if (key != null) {
      this.id = key.Key

      this.userData.getProfileData(key.PostedBy).then((data: any) => {
        console.log(data);
        temas.getIndustryTopicSpecific(key.Key).then((tema_download: any) => {
          this.tema = {
            "Title": tema_download.Title,
            "Message": tema_download.Text,
            "MainPhoto": tema_download.MainPhoto,
            "Author": data.Name,
            "AuthorImg": data.Img,
            "Date": key.Timestamp,
            "PostedBy": key.PostedBy
          }
        })
      })

    }else {
      let tema = this.navParams.get("Tema");

      tema.Description = tema.Description.split("\\n").join("\n")
      this.id = null;
      console.log(tema);
      this.tema = {
        "Title": tema.Title,
        "Message": tema.Description,
        "MainPhoto": tema.Img,
        "Author": "Canalava",
        "AuthorImg": "https://firebasestorage.googleapis.com/v0/b/canalava-353c7.appspot.com/o/Icon.png?alt=media&token=6c3a295c-e9e0-43ba-8b8b-75b4d548e647",
        "Date": tema.Timestamp,
        "PostedBy": ""
      }
    }

  }

  ionViewDidLoad() {
    if (this.id == null) {
      return
    }
    this.temas.getCommentsOnInquiry(this.id).then((comments: any) => {
      this.commentsArray = comments;
    })
    console.log('ionViewDidLoad TemaPage');
  }

  postComment() {
    this.temas.postComments(this.comment, this.id).then(() => {
      console.log(this.commentsArray);
      this.comment = "";
    }).catch((error) => {
      this.alertController.presetToast("error")
    })
  }

  editTema() {
    console.log("OpenActionScheet");
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your album',
      buttons: [
        {
          text: 'Borrar',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
          }
        },
        {
          text: 'Editar',
          handler: () => {
            this.isEditEnabled = true;
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

  saveMessage() {
    this.temas.updateTema(this.tema.Title,this.tema.Message,this.id).then(() => {
      this.isEditEnabled = false;
    }).catch((error) => {
      this.alertController.presetToast("Error al actualizar");
    }) 
  }

}
