import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
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
      this.firebase.database().ref().child("InductryInquiry").child("Comments").child(id).on("child_added", (snapchot) => {
        console.log(snapchot.val());
        snapchot.forEach((child) => {
          var data = {
            "Id" : child.key,
            "Message" : child.val()
          }
          array.push(data);
          return false;
        })
        return success(array);
      }, function(error) {
        return reject(error);
      });
    })
  }

  postComments(message,key) {
    return new Promise ((success, reject) => {
      let id = this.userData.selectedID;
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
 
      var fullInquiries = this.firebase.database().ref().child("InductryInquiry").child("FullInquiry").child(key).update({
        "Description" : Message,
        "Topic" : Title
      })
      return Promise.all([fullInquiries]);

  }

  postTema(data: any) {
    return new Promise ((success, reject) => {
      let id = this.userData.userID;
      let postKey =  this.firebase.database().ref().child("InductryInquiry").child("AllInquiries").push()
      postKey.update({
        "Topic" : data.Title,
        "Timestamp" : Date.now(),
        "PostedBy" : id 
      }).then(() => {
        this.firebase.database().ref().child("InductryInquiry").child("FullInquiry").child(postKey.key).update({
          "MainPhoto" : data.Img,
          "Text" : data.Message,
          "Title" : data.Title,
          "PostedBy" : id 
        }).then(() => {
          return success();
        }).catch((error) => {
          return reject(error);
        })
      }).catch((error) => {
        return reject(error);
      })
    })
  }
    
}
