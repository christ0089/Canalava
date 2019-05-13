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
    if (type == 0) //Asesoria 
    {
      this.title = "Asesorias"
    }else if (type == 1) { //Eventos
      this.title = "Eventos"
      this.firebase.database().ref().child("Events/EventsList").orderByChild('Timestamp').startAt(Date.now()).on("child_added", function(snapchot){
        let data = snapchot.val();
        console.log(data);
        array.push(data);
        array = array.sort((a,b) => b.Timestamp - a.Timestamp)
      })
      return 
    }else
     {
      this.title = "Capacitacion"
    }
    this.firebase.database().ref().child(`Events/${this.title}`).orderByChild('Timestamp').startAt(Date.now()).on("child_added", function(snapchot){
      let data = snapchot.val();
      console.log(data);
      array.push(data);
      array = array.sort((a,b) => b.Timestamp - a.Timestamp)
    })
  }

  openTema(tema) {
    console.log(tema);
    this.navCtrl.push("TemaPage",{
      Key : null,
      Tema : tema
    });
  }


  ionViewDidLoad() {
    this.getData(this.navParams.get("Type"), this.contentArray);
  }



}
