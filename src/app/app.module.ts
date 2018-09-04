import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, ChangeDetectorRef } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { Network } from '@ionic-native/network';
import { File } from '@ionic-native/file';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { HttpModule} from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { UsersProvider } from '../providers/users/users';
import { ContentProvider } from '../providers/content/content';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { ToastAndLoadProvider } from '../providers/AlertandLoader';
import { PostPicture } from '../providers/post-picture';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { MessagesServiceProvider } from '../providers/messages-service/messages-service';
import { TemasDeIndustriaProvider } from '../providers/temas-de-industria/temas-de-industria';
import {InternetProvider} from '../providers/internet';

export const firebaseConfig = {
  apiKey: "AIzaSyBcPwfSEd-LvsCcqNByVBZzORT1vM50qSI",
  authDomain: "canalava-353c7.firebaseapp.com",
  databaseURL: "https://canalava-353c7.firebaseio.com",
  projectId: "canalava-353c7",
  storageBucket: "canalava-353c7.appspot.com",
  messagingSenderId: "562373665469"
};

@NgModule({
  declarations: [
    MyApp,

  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),  
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UsersProvider,
    ContentProvider,
    AuthServiceProvider,
    MessagesServiceProvider,
    TemasDeIndustriaProvider,
    ToastAndLoadProvider,
    PostPicture,
    InAppBrowser,
    InternetProvider,
    Camera,
    DocumentViewer,
    Network,
    File
  ]
})
export class AppModule {}
