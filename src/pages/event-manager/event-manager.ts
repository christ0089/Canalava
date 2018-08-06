import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseApp } from 'angularfire2';

/**
 * Generated class for the EventManagerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-manager',
  templateUrl: 'event-manager.html',
})
export class EventManagerPage {
  contentArray = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private firebase:FirebaseApp) {
   
  }

  title = ""

  getData(type,array) {
    var tempArray = [];
    if (type == 0) //Asesoria 
    {
      this.title = "Asesorias"
      this.firebase.database().ref().child("Events/Asesorias").on("child_added", function(snapchot){
        let data = snapchot.val();
        console.log(data);

        array.push(data);
      })
    }else if (type == 1) { //Eventos
      this.title = "Eventos"
      this.firebase.database().ref().child("Events/EventsList").on("child_added", function(snapchot){
        let data = snapchot.val();
        console.log(data);
        array.push(data);
      })
    }else { //Capacitacion
      this.title = "Capacitacion"
      this.firebase.database().ref().child("Events/Capacitacion").on("child_added", function(snapchot){
        let data = snapchot.val();
        console.log(data);
        array.push(data);
      })
    }
  }

  ionViewDidLoad() {
    this.getData(this.navParams.get("Type"), this.contentArray);
  }



}
