import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { AuthServiceProvider } from '../auth-service/auth-service';
import { ContentProvider } from '../content/content';
import { FirebaseApp } from 'angularfire2';
import { Events } from 'ionic-angular';

/*
  Generated class for the UsersProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UsersProvider {

  userID: string = "";
  public users = [];

  public userData = {
    "Name": "",
    "Phone": "",
    "Img": "",
    "isPhonePublic": ""
  }

  constructor(public http: Http, private auth: AuthServiceProvider, private content: ContentProvider, 
    private firebase: FirebaseApp, private events:Events) {

  }


  getCurrentSession() {
    this.auth.afAuth.authState.subscribe(user => {
      console.log("LogIn Attempt",);
      if (user == null) {
        this.signOut();
      } else {
        this.userID = user.uid;
        if (user.emailVerified == true || user.uid == "kiCJPCT9GPTEYd1sP9tgP2nzgg63") {
          this.loadData();
        }else {
          this.signOut();
        }
      }
    });
  }

  signOut() {
    let eventLoop = this.events;
    this.auth.signOut().then(() => {
      console.log("LogOut");
      eventLoop.publish("LogOut");
    });
  }

  loadData() {
    this.auth.afAuth.authState.subscribe(user => {
      this.userID = user.uid;
      this.content.getContent();
      this.content.getUserContent(this.userID);
      this.getUserData();
      this.funcLoadUserData();
    });
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
          "isPhonePublic": data.isPhonePublic,
          "Key": child.key
        }
        dataArray.push(userData);
      });
    });
    this.users = dataArray;
  }

  getUserData() {
    const db = this.firebase.database().ref()
    db.child("UserData").child(this.userID).once("value").then((snapchot) => {
      let data = snapchot.val();
      this.userData = {
        "Name": data.Name,
        "Phone": data.Phone,
        "Img": data.ProfileImg,
        "isPhonePublic": data.isPhonePublic
      }
    })
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

  getUser(Name:string) {
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
    if (id == this.userID) {
      return this.userData.Img;
    }else {
      let user = this.users.filter(user => {
        if (id == user.Key) {
         return true;
        }
      });
      console.log(id, user);
      return user[0].Img;
    }
  }

  getUserName(id) {
    if (id == this.userID) {
      return this.userData.Name;
    }else {
      let user = this.users.filter(user => {
        if (id == user.Key) {
         return true;
        }
      });
      console.log(id, user);
      return user[0].Name;
    }

  }

}
