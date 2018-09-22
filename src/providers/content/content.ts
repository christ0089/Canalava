import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { AuthServiceProvider } from '../auth-service/auth-service';

/*
  Generated class for the ContentProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ContentProvider {

  userContent = [];
  contentArray = [];

  constructor(public http: Http, private db: FirebaseApp, private auth:AuthServiceProvider) {
    console.log('Hello ContentProvider Provider');
  }

  async getContent() {
    let tempArray = [];
    const firebaseDb = this.db.database().ref();
    this.auth.afAuth.authState.subscribe(user => {
      if (user == null) {
        return
      }
      firebaseDb.child("PublicContent").orderByChild("Timestamp").on("child_added", function (snapchot) {
        let data = snapchot.val();

        if (snapchot.val() == null) {
          return
        }
        var isImageLiked = false;
        firebaseDb.child("ContentLikedBy").child(snapchot.key).child(user.uid).once('value').then((snapchotLiked) => {
          if (snapchotLiked.val() == null){
            return
          }else {
            isImageLiked = true;
          }
        })
        firebaseDb.child("ContentLikes").child(snapchot.key).once('value').then((snapchotLikes) => {
          let likeNumber = snapchotLikes.val();

          firebaseDb.child("UserData").child(data.Uploader).once("value").then((user_snapchot) => {
            let user_data = user_snapchot.val();
            let content = {
              ImageURL: data.Image,
              Message: data.Message,
              Timestamp: data.Timestamp,
              likeNumber: likeNumber["Likes"],
              Key : data.Uploader,
              Name: user_data.Name,
              Img: user_data.ProfileImg,
              isImageLiked : isImageLiked,
              ID : snapchot.key
            }
            tempArray.push(content);
            tempArray = tempArray.sort((a,b) => b.Timestamp - a.Timestamp);
          });
        });
      });
    })
    this.contentArray = tempArray;
  }

  getUserContent(userID) {
    this.userContent = this.getProfileContent(userID, userID)
  }

  public getProfileContent(id, uid) {
    let tempArray = [];
    const firebaseDb = this.db.database().ref();
    firebaseDb.child("Content").child(id).on("child_added", function (myContent) {
      if (myContent.val() == null) {
        return;
      }
      firebaseDb.child("PublicContent").child(myContent.key).once("value").then((snapchot) => {
        if (snapchot.val() == null) {
          return;
        }
        var isImageLiked = false;
        firebaseDb.child("ContentLikedBy").child(snapchot.key).child(uid).once('value').then((snapchotLiked) => {
          if (snapchotLiked.val() == null){
            return
          }else {
            isImageLiked = true;
          }
        })
        let data = snapchot.val();
        firebaseDb.child("ContentLikes").child(snapchot.key).once('value').then((snapchotLikes) => {
          let likeNumber = snapchotLikes.val();
          let content = {
            "ImageURL": data.Image,
            "Message": data.Message,
            "Timestamp": data.Timestamp,
            "likeNumber": likeNumber["Likes"],
            "isImageLiked" : isImageLiked,
            "ID" : myContent.key
          }
          tempArray.push(content);
          tempArray = tempArray.sort((a,b) => b.Timestamp - a.Timestamp);
        });
      }).catch((error) => {
        console.log(error);
      })
    });
    return tempArray;
  }

  postPicture(userID, data) {
    const firebaseDb = this.db.database().ref();
    let reference = firebaseDb.child("PublicContent").push();
    return new Promise((resolve, reject)=> {
      reference.update({
        "Image" : data.Img,
        "Message": data.Message,
        "Timestamp" : Date.now(),
        "Uploader" : userID
      }).then(() => {
        let key = reference.key
        firebaseDb.child("Content").child(userID).update({
          [key] : 1
        });
        firebaseDb.child("ContentLikes").child(key).set({
          Likes : 0
        });
      }).then(() => {
        this.getUserContent(userID);
        return resolve();
      }).catch((error)=> {
        return reject(error)
      });
    });

  }

  deletePicture(id, uid) {
    const firebaseDb = this.db.database().ref();
    console.log(id, uid)
    return new Promise((resolve, reject) => {
      firebaseDb.child("PublicContent").child(id).remove().catch((error)=> {
        return reject(error)
      }).then(() => {
        this.contentArray.splice(this.contentArray.indexOf(id), 1)
      });
      firebaseDb.child("Content").child(uid).child(id).remove().catch((error)=> {
        return reject(error)
      }).then(() => {
        this.userContent.splice(this.userContent.indexOf(id),1)
      });
      return resolve();
    })
  } 

  editPost(newMessage, uid, id) {
    const firebaseDb = this.db.database().ref();
    return new Promise((resolve, reject) => {
      firebaseDb.child("PublicContent").child(id).update({
        "Message": newMessage
      }).catch((error)=> {
        return reject(error)
      });
      this.getUserContent(uid);
      return resolve();
    })
  } 

  updateContent(id, isImageLiked) {
    this.db.database().ref().child("ContentLikes").child(id).once('value').then((snapchotLikes) => {
      let likeNumber = snapchotLikes.val();
      this.contentArray.filter(content => {
        if (id == content.ID) {
         content.isImageLiked = isImageLiked
         content.likeNumber - likeNumber;
        }
      });
    })
  }

  public postLike(contentID, uid, isLiked) {
    const firebaseDb = this.db.database().ref();
    return new Promise((success, reject) => {
      firebaseDb.child("ContentLikedBy").child(contentID).update({
        [uid] : isLiked
      }).then(() => {
        this.updateContent(contentID, isLiked);
        return success();
      }).catch((error) => {
        return reject(error);
      })
    })
  }

}
