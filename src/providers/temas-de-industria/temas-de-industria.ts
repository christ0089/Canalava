import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FirebaseApp } from '../../../node_modules/angularfire2';
import { UsersProvider } from '../users/users';

/*
  Generated class for the TemasDeIndustriaProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TemasDeIndustriaProvider {

  constructor(public http: HttpClient, public firebase:FirebaseApp, private userData: UsersProvider) {
    console.log('Hello TemasDeIndustriaProvider Provider');
  }

  Inqury = [];

  getIndustryTopicSimple() {
    let tempArray = [];
    this.firebase.database().ref().child("InductryInquiry").child("AllInquiries").once("value").then((snapchot) => {
      let data = snapchot.val();
      snapchot.forEach((child) => {
        let data = child.val();
        let inquiryData = {
          "Img" : this.userData.getUserImage(data.PostedBy),
          "Name" : this.userData.getUserName(data.PostedBy),
          "PostedBy" : data.PostedBy,
          "Timestamp" : data.Timestamp,
          "Title" : data.Topic,
          "Key" : child.key
        }
        tempArray.push(inquiryData);
      })
     
    })
    this.Inqury = tempArray;
  }

  getIndustryTopicSpecific(id) {
    return new Promise ((success, reject)=> {
      this.firebase.database().ref().child("InductryInquiry").child("FullInquiry").child(id).once("value").then((snapchot) => {
        return success(snapchot.val());
      }).catch((error) => {
        return reject(error);
      });
    })
  }

  getCommentsOnInquiry(id) {
    let array = [];
    return new Promise ((success, reject)=> {
      this.firebase.database().ref().child("InductryInquiry").child("Comments").child(id).on("child_added", function(snapchot) {
        console.log(snapchot.val());
        snapchot.forEach((child) => {
          var data = {
            "Id" : child.key,
            "Message" : child.val()
          }
          array.push(data);
        })
        return success(array);
      }, function(error) {
        return reject(error);
      });
    })
  }

  postComments(message,key) {
    return new Promise ((success, reject) => {
      let id = this.userData.userID;
      let postKey =  this.firebase.database().ref().child("InductryInquiry").child("Comments").child(key).push()
      postKey.update({
        [id] : message
      }).then(() => {
        return success();
      }).catch((error)=> {
        return reject(error);
      })
    })
  }

  updateTema(Title,Message, key) {
    return new Promise ((resolve, reject) => {
      let id = this.userData.userID; 
      var allInquiries = this.firebase.database().ref().child("InductryInquiry").child("FullInquiry").child(key).update({
        "Text" : Message,
        "Title" : Title
      })
      var fullInquiry = this.firebase.database().ref().child("InductryInquiry").child("AllInquiries").child(key).update({
        "Topic" : Title
      })
      Promise.all([fullInquiry,allInquiries]).then(()=> {
        return resolve();
      }).catch((error) => {
        return reject(error);
      })
    })
  }

  postTema(data: any) {
    return new Promise ((success, reject) => {
      let id = this.userData.userID;
      let postKey =  this.firebase.database().ref().child("InductryInquiry").child("Comments").push()
      postKey.set({
        "Title" : data.Topic,
        "Message" : data.Message,
        "PostedBy" : id 
      }).then(() => {
        return success()
      })
    })
  }
    
}
