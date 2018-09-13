import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { AuthServiceProvider } from '../auth-service/auth-service';
import { ContentProvider } from '../content/content';
import { FirebaseApp } from 'angularfire2';
import { Events } from 'ionic-angular';
import { FcmProvider } from '../messages-service/fcm';


/*
  Generated class for the UsersProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
export class UsersProvider {

  userID: string = "";
  public users = [];

  selectedID: string = "";
  selectedValue: number = 0;

  public userData = []

  constructor(public http: Http, private auth: AuthServiceProvider, private content: ContentProvider,
    private firebase: FirebaseApp, private events: Events) {
  }

  getCurrentSession() {
    this.auth.afAuth.authState.subscribe(user => {
      if (user == null) {
        this.signOut();
      } else {
        if (user.emailVerified == true || user.uid != null) {
          this.userID = user.uid;
          this.selectedID = this.userID;
          this.loadData();         
        }
      }
    });
  }

  signOut() {
    let eventLoop = this.events;
    this.auth.signOut().then(() => {
      eventLoop.publish("LogOut");
    });
  }

  loadData() {
    this.content.getContent();
    this.content.getUserContent(this.selectedID);
    this.getProfileData(this.userID).then((data : { Name: string, Phone: string, Img:string, isPhonePublic: boolean, Key: string}) => {
      this.userData = [data];
    })
    this.getBusiness();
    this.funcLoadUserData();
  }

  getBusiness() {
    let data = [];
    return new Promise((resolve, reject) => {
      console.log(this.userID);
      this.firebase.database().ref().child("BusinesID").child(this.userID).once("value").then((snapchot) => {

        if (snapchot.val() == null) {
          return
        }
        snapchot.forEach((child) => {
          console.log(child.key);
          var values = child.key

          this.getProfileData(values).then((business) => {
            data.push(business)
            this.userData = this.userData.concat(data);
          })
        })

      }).then(() => {
        return resolve(this.userData);
      }).catch((error) => {
        return reject(error);
      })
    })
  }

  funcLoadUserData() {
    const db = this.firebase.database().ref();
    let dataArray = [];

    let userID = this.userID;
    db.child("UserData").once("value").then((snapchot) => {
      snapchot.forEach(function (child) {
        let data = child.val();
        if (child.key == userID) {
          return
        }
        var userData = {
          "Name": data.Name,
          "Phone": data.Phone,
          "Img": data.ProfileImg,
          isPhonePublic: data.isPhonePublic,
          "Key": child.key
        }
        dataArray.push(userData);
      });
    });
    this.users = dataArray;
  }

  getSelectedAccount() {
    return this.userData[this.selectedValue];
  }

  setSelectedAccount(value: number) {
    this.selectedValue = value;
    this.selectedID = this.getSelectedAccount().Key
    this.content.getUserContent(this.selectedID);
  }

  getProfileData(key) {
    const db = this.firebase.database().ref();
    var profileData = {};
    return new Promise((success, reject) => {
      db.child("UserData").child(key).once("value").then((snapchot) => {
        let data = snapchot.val();
        profileData = {
          "Name": data.Name,
          "Phone": data.Phone,
          "Img": data.ProfileImg,
          "isPhonePublic": data.isPhonePublic,
          "Key": snapchot.key
        }
        return success(profileData);
      })
    })
  }

  updateUserData(userData) {
    const db = this.firebase.database().ref();
    return new Promise((success, reject) => {
      console.log(userData)
      db.child("UserData").child(this.selectedID).update({
        "Name": userData.Name,
        "Phone": userData.Phone,
        "ProfileImg": userData.Img,
        "isPhonePublic": userData.isPhonePublic,
      }).then(() => {
        this.userData[this.selectedValue] = userData;
        this.content.getContent();
        return success();
      }).catch((error) => {
        return reject(error);
      })
    })
  }

  getUser(Name: string) {
    if (!Name) {
      this.funcLoadUserData();
      return;
    }
    this.users = this.users.filter(user => {
      if (Name && user.Name) {
        if (user.Name.toLowerCase().indexOf(Name.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  getUserImage(id) {
    console.log(id);
    if (id == this.selectedID) {
      return this.userData[this.selectedValue].Img;
    } else if (id == this.userID) {
      return this.userData[0].Img;
    }
    else {
      let user = this.users.filter(user => {
        if (id == user.Key) {
          return true;
        }
      });
      return user[0].Img;
    }
  }

  getUserName(id) {
    if (id == this.selectedID) {
      return this.userData[this.selectedValue].Name;
    } else if (id == this.userID) {
      return this.userData[0].Name;
    }
    else {
      let user = this.users.filter(user => {
        if (id == user.Key) {
          return true;
        }
      });
      return user[0].Name;
    }
  }
}
