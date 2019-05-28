import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { map } from "rxjs/operators";
import { Observable } from 'rxjs';
import { AuthServiceProvider } from '../auth-service/auth-service';

@Injectable()
export class ContentLoaderService {

  constructor(private databaseRef: AngularFireDatabase) {
  
  }

  private userID: string;

  data = [];


  getObjectList<T>(path,filterBy?: string, filter?: string | boolean, limit?: number): Observable<T[]> {
    return this.mapListKeys(this.databaseRef.list(path, ref => {
      const query = ref
      if (filterBy == null) {
        return query;
      }
      if (limit == null) {
        return query.orderByChild(filterBy).equalTo(filter)
      }
      return query.orderByChild(filterBy).equalTo(filter).limitToFirst(limit)
    }));
  }

  getObject<T>(path): Observable<T> {
    return this.mapObjectKey(this.databaseRef.object(path));
  } 

  mapListKeys<T>(list: AngularFireList<T>): Observable<T[]> {
    return list.snapshotChanges().pipe(
      map(actions =>
        actions.map(action => ({
          key: action.key,
          ...action.payload.exportVal()
        }))
      )
    );
  }

  mapObjectKey<T>(list: AngularFireObject<T>): Observable<T> {
    return list
      .snapshotChanges()
      .pipe(
        map(action => ({ key: action.key, ...action.payload.exportVal() }))
      );
  }

  postPicture(userID, data: any) {
    const firebaseDb = this.databaseRef.database.ref();
    let reference = firebaseDb.child("PublicContent").push();
    return new Promise((resolve, reject) => {
      reference.update({
        "Image": data.Img,
        "Message": data.Message,
        "Timestamp": Date.now(),
        "Uploader": userID,
        "isVideo": false,

      }).then(() => {
        let key = reference.key
        firebaseDb.child("Content").child(userID).update({
          [key]: 1
        });
        firebaseDb.child("ContentLikes").child(key).set({
          Likes: 0
        });
      }).then(() => {
        return resolve();
      }).catch((error) => {
        return reject(error)
      });
    });
  }

  postTema(id, data: any) {
    return new Promise((success, reject) => {
      let postKey = this.databaseRef.database.ref("InductryInquiry/AllInquiries").push()
      let setSmallInquiry = this.setData({
        Topic: data.Title,
        PostedBy: id,
        Timestamp : data.Timestamp,
      }, `InductryInquiry/AllInquiries/${postKey.key}`)
      let setFullInquiry =  this.updateData(data, `InductryInquiry/FullInquiry/${postKey.key}`)
      Promise.all([setFullInquiry, setSmallInquiry]).then(() => {
        return success()
      }).catch(() => {
        return reject()
      })
    })
  }

  updateData(data, path) {
    return this.databaseRef.database.ref(path).update(data);
  }

  setData(data, path) {
    return this.databaseRef.database.ref(path).set(data);
  }

  pushData(data, path) {
    return this.databaseRef.database.ref(path).push(data);
  }

  deleteData(path) {
    return this.databaseRef.database.ref().child(`${path}`).remove()
  }

  deletePicture(id, uid) {
    return new Promise((resolve, reject) => {
      let publicContent = this.deleteData(`PublicContent/${id}`).then(() => {
        this.data.splice(this.data.indexOf(id), 1)
      }).catch((error) => {
        return reject(error)
      })
      let content = this.deleteData(`Content/${uid}/${id}`)
      Promise.all([publicContent, content]).then(() => {
        return resolve();
      })
    })
  }

  editPost(post, path) {
    const firebaseDb = this.databaseRef.database.ref();
    return new Promise((resolve, reject) => {
      firebaseDb.child(path).update(post).catch((error) => {
        return reject(error)
      });
      return resolve();
    })
  }

  setBusiness(key, business, adresses?: string[]) {
    return new Promise((resolve, reject) => {
      console.log(adresses);
      let ref = this.databaseRef.database.ref().child("BusinesID").child(key)
      let refKey = ref.push()
      this.databaseRef.database.ref().child(`UserData/${refKey.key}`).set(business)
      ref.set({ [refKey.key]: 1 })
      if (adresses == null) {
        return
      }
      this.setAddresses(refKey.key, adresses);
    })
  }

  setAddresses(id, addresses: string[]) {
    console.log(addresses.length)
    addresses.forEach((address) => {
      let addressRef = this.databaseRef.database.ref().child("BusinessAddress").child(id)
      let addressKey = this.databaseRef.database.ref().child(`AddressBook`)
      
      let key2 = addressRef.push()

      let promise = [addressRef.update({ [key2.key]: 1 }), addressKey.update({ [key2.key]: address })]

      return Promise.all(promise).catch((error) => {
        console.log(error);
      })

    })
  }


}
