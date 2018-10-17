
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {
	private user: firebase.User;

	constructor(public afAuth: AngularFireAuth) {
		afAuth.authState.subscribe(user => {
			if (user != null) {
				this.user = user;
			}
		});
	}

	signInWithEmail(credentials) {
		console.log('Sign in with email');
		return this.afAuth.auth.signInWithEmailAndPassword(credentials.email,
			 credentials.password);
	}

	signOut() {
		return this.afAuth.auth.signOut();
	}

	registerDataAuth(Email, Password) {
		let authFirebase = firebase.auth();
		return new Promise(function (success, error) {
		  authFirebase.createUserWithEmailAndPassword(Email, Password).then(() => {
			authFirebase.currentUser.sendEmailVerification().then(() => {
			  return success("Success");
			});
		  });
		});
	}
}
