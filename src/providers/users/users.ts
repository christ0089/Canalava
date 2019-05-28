import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { AuthServiceProvider } from '../auth-service/auth-service';
import { ContentProvider } from '../content/content';
import { FirebaseApp } from 'angularfire2';
import { Events } from 'ionic-angular';
import { FcmProvider } from '../messages-service/fcm';

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
    this.content.getUserContent(this.selectedID);
    this.getProfileData(this.userID).then((data : { Name: string, Phone: string, Img:string, isPhonePublic: boolean, Key: string}) => {
      this.userData = [data];
      //this.loadData();
    }).then(() => {
      this.getBusiness();
    }).then(() => {
      this.funcLoadUserData();
    })
  
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
    db.child("UserData").limitToFirst(40).once("value").then((snapchot) => {
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

  loadUsers(name, query) {
    const db = this.firebase.database().ref();
    
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
      db.child("UserData").child(this.selectedID).update({
        "Name": userData.Name,
        "Phone": userData.Phone,
        "ProfileImg": userData.Img,
        "isPhonePublic": userData.isPhonePublic,
      }).then(() => {
        this.userData[this.selectedValue] = userData;
        return success();
      }).catch((error) => {
        return reject(error);
      })
    })
  }

// Purpose: Set the Array of Users in Search Bar 
// Paramater: Takes the Name or Business from Search Bar
// Result: Sets Filtered Users Lists or Unfiltered List depending on Field Name
  getUser(Name: string) {
    if (!Name) {
      this.funcLoadUserData();
      return;
    }
    this.users = this.users.filter(user => {
      if (Name == user.Name) {
        if (user.Name.toLowerCase().indexOf(Name.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

// Purpose: Returns the User's Image based on his ID
// Paramater: Takes the UID of the User to Query
// Result: Returns the Single user Image of Query
  getUserImage(id) {
    if (id == this.selectedID) {
      return this.userData[this.selectedValue].Img != null ? this.userData[this.selectedValue].Img : "https://firebasestorage.googleapis.com/v0/b/canalava-353c7.appspot.com/o/Icon.png?alt=media&token=6c3a295c-e9e0-43ba-8b8b-75b4d548e647" ;
    } else if (id == this.userID) {
      return this.userData[0].Img != null ? this.userData[0].Img : "https://firebasestorage.googleapis.com/v0/b/canalava-353c7.appspot.com/o/Icon.png?alt=media&token=6c3a295c-e9e0-43ba-8b8b-75b4d548e647" ;
    }
    else {
      let user = this.users.filter(user => {
        if (id == user.Key) {
          return true;
        }
        return false;
      });
      if (user[0] == null) {
        this.getProfileData(id).then((user : any) => {
          this.users.push(user);
          return user.ProfileImg == null? user.ProfileImg : "https://firebasestorage.googleapis.com/v0/b/canalava-353c7.appspot.com/o/Icon.png?alt=media&token=6c3a295c-e9e0-43ba-8b8b-75b4d548e647";
        }) 
      }
      return user[0] != null ? user[0].Img : "https://firebasestorage.googleapis.com/v0/b/canalava-353c7.appspot.com/o/Icon.png?alt=media&token=6c3a295c-e9e0-43ba-8b8b-75b4d548e647";
    }
  }

  getSpecificUser(id) {
    return this.getProfileData(id)
  }

// Purpose: Returns the User's Name based on his ID
// Paramater: Takes the UID of the User to Query
// Result: Returns the Single User Name from Query
  getUserName(id) {
    if (id == this.selectedID) {
      return this.userData[this.selectedValue].Name != null? this.userData[this.selectedValue].Name : "" ;
    } else if (id == this.userID) {
      return this.userData[0].Name != null? this.userData[0].Name: "" ;
    }
    else {
      let user = this.users.filter(user => {
        if (id == user.Key) {
          return true;
        }
        return false;
      });
      return user[0] != null? user[0].Name : "" ;
    }
  }
}
