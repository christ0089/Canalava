import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController, Platform } from 'ionic-angular';
import { ContentProvider } from '../../providers/content/content';
import { UsersProvider } from '../../providers/users/users';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import { ToastAndLoadProvider } from '../../providers/AlertandLoader';
import { User } from '../../Models/User';
declare var google: any;
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
  @ViewChild('googleMaps') mapRef: ElementRef;
  map: any;
  selected = 0;

  data = [];


  constructor(public navCtrl: NavController, public navParams: NavParams, private content: ContentProvider, private userData: UsersProvider,
    private actionSheetCtrl: ActionSheetController, private modalCtrl: ModalController, private platform: Platform,
    private googleMaps: GoogleMapsProvider, private toastCtrl: ToastAndLoadProvider) {
    this.displayMode = "List";
  }

  ionViewDidLoad() {
    this.userData.getCurrentSession();

    this.platform.ready().then(() => {
      console.log(this.mapRef);
      this.showMap();
    })
  }


  addImage() {
    this.navCtrl.push('UploadPage');
  }

  onChange(event) {
    this.selected = event;
    this.userData.setSelectedAccount(this.selected);
    this.data = this.content.userContent;
    this.showMap();
  }

  showMap() {
    const location = new google.maps.LatLng(19.432470, -99.16884)

    const options = {
      center: location,
      zoom: 10
    }

    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
    this.googleMaps.getAddresses(this.map, this.userData.selectedID, this.userData.getSelectedAccount().Name)
  }

  openSettings() {
    this.navCtrl.push("SettingsPage", {
      Type: 0
    })
  }

  openPhoto(content) {
    this.navCtrl.push("PhotoPage", {
      Content: content,
      ID: this.userData.userID
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
            this.content.deletePicture(content.ID, this.userData.selectedID).catch(() => {
              this.toastCtrl.presetToast("Algo Salio Mal");
            });
          }
        },
        {
          text: 'Editar',
          handler: () => {
            this.navCtrl.push("PhotoPage", {
              Content: content,
              ID: this.userData.selectedID,
              isEditEnabled: true
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
    let user: User = this.userData.getSelectedAccount();
    let profileModal = this.modalCtrl.create("EditPage", {
      UserData: user
    });
    profileModal.present();
  }
}
