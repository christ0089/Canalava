import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FirebaseApp } from 'angularfire2';


declare var google; 
/*
  Generated class for the GoogleMapsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GoogleMapsProvider {

  constructor(public http: HttpClient, private firebase: FirebaseApp) {
    console.log('Hello GoogleMapsProvider Provider');
  }


  getAddresses(map, id ) {
    console.log(id);
    this.firebase.database().ref().child("BusinessAddress").child(id).once("value").then((snapchot) => {
      console.log(snapchot);
      snapchot.forEach((address) => {
        console.log(address.val());
        this.firebase.database().ref().child("AddressBook").child(address.key).once("value").then((location) => {
          console.log(location.val());
          this.addMarkers(map, location.val())
        })
      })
    }).catch((error) => {
      console.log(error);
    })
  }

  addMarkers(map, address) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function(results, status) {
      if (status === 'OK') {
        map.setCenter(results[0].geometry.location);
        var marker = new google.maps.Marker({
          map: map,
          animation: google.maps.Animation.DROP,
          position: results[0].geometry.location
        });
        console.log(marker);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
 
  }

}
