import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';
import { TemasDeIndustriaProvider } from '../../providers/temas-de-industria/temas-de-industria';
import { ToastAndLoadProvider } from '../../providers/AlertandLoader';
import { Tema } from '../../Models/Tema';
import { Observable } from 'rxjs';
import { of } from 'rxjs/observable/of';
import { AngularFireDatabase } from 'angularfire2/database';
import { ContentLoaderService } from '../../providers/content/content-loader.service';
import { map } from 'rxjs/operators';
import { take } from 'rxjs/operator/take';

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

  tema$: Observable<Tema>
  comment = "";
  commentsArray = [];
  id: any = null;
  words = [];
  isEditEnabled = false;
  customImage = false;
  isTema = false;

  @ViewChild('editor') editor: ElementRef;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userData: UsersProvider,
    private database: ContentLoaderService,
    private temas: TemasDeIndustriaProvider,
    private alertController: ToastAndLoadProvider,
    private actionSheetCtrl: ActionSheetController) {
    this.isEditEnabled = false;
    
    let key = this.navParams.get("key");
    let data_1 = this.navParams.get("tema");
    let path = this.navParams.get("path");
    if (data_1 != null) {
      this.id = data_1.key;
      const userData = this.userData.getProfileData(data_1.PostedBy);
      const tema = temas.getIndustryTopicSpecific(data_1.key);
      Promise.all([userData, tema]).then((data: any) => {
        let tema: Tema = {
          "Title": data[1].Topic,
          "Message": data[1].Description,
          "MainPhoto": data[1].Image,
          "Author": data[0].Name,
          "AuthorImg": data[0].Img,
          "Date": data_1.Timestamp,
          "PostedBy": data_1.PostedBy
        }
        this.tema$ = of(tema);
      })
    } else {
      console.log(key, path);
      if (key == "Simbología") {
        this.customImage == true;
      }
      this.tema$ = this.database.getObjectList(`Desmanchado/${key}`, "filter", path).pipe(map((data: any[]) => {
        if (data[0] == null) {
          this.navCtrl.pop().then(() => {
            this.alertController.presetToast("No se encontro archivo");
          })
        }
        console.log(JSON.stringify(data[0]));
        let description:string = data[0].Description//split("\\n").join("\n");
        description = description.replace("Ã³", 'ó');
        //description = description.split("/").join('');
        description = description.split("Ã³").join('ó')
        description = description.split("Ã¡").join('á')
      
        if(data[0].Words != null && key != "Glosario" && key != "Fibras") {
          this.isTema = true;
          this.words = [];
          let keys = Object.keys(data[0].Words);
          keys.forEach(element => {
            this.words.push(data[0].Words[element]['name']);
          });
        }
        let tema = {
          "Title": data[0].Topic,
          "Message": description,
          "MainPhoto": data[0].Image,
          "Author": "Canalava",
          "AuthorImg": "https://firebasestorage.googleapis.com/v0/b/canalava-353c7.appspot.com/o/Icon.png?alt=media&token=6c3a295c-e9e0-43ba-8b8b-75b4d548e647",
          "Date": data[0].Timestamp,
          "PostedBy": ""
        }
        return tema;
      }));
    }
  }

  ionViewDidLoad() {
    if (this.id != null) {
      this.temas.getCommentsOnInquiry(this.id).then((comments: any) => {
        this.commentsArray = comments;
      })
    }
  }

  postComment() {
    if (this.comment == "") {
      return;
    }
    this.temas.postComments(this.comment, this.id).then(() => {
      console.log(this.commentsArray);
      this.comment = "";
    }).catch((error) => {
      this.alertController.presetToast("Error")
    })
  }

  openGlosario() {
    this.navCtrl.push("ServicesPage", {
      type: {name : 'Glosario', path: 'Secondary/Glosario'},
      key: 'Glosario',
      path: 'Glosario'
    })
  }

  editTema() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your album',
      buttons: [
        {
          text: 'Borrar',
          role: 'destructive',
          handler: () => {
            this.database.deleteData("InductryInquiry/FullInquiry/" + this.id).then(() => {
              this.navCtrl.pop();
            });
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

  saveMessage(tema: Tema) {
    console.log(this.id, tema.Message);
    this.temas.updateTema(tema.Title, tema.Message, this.id).then(() => {
      this.isEditEnabled = false;
    }).catch((error) => {
      this.alertController.presetToast(error);
    })
  }

}
