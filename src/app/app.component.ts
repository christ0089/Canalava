import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { InternetProvider } from '../providers/internet';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:string  = 'TabsPage';

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    public InternetProvider: InternetProvider, private network: Network) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      this.InternetProvider.networkConnected = true;
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      console.log(this.network.type)
      setTimeout(() => {
        if (this.rootPage == 'NoInternetPage') {
          this.rootPage = 'TabsPage';
          console.log('wifi');
        }

        if (this.network.type === '4g') {
          if (this.rootPage == 'NoInternetPage') {
            this.rootPage = 'TabsPage';
            console.log('4g');
          }
        }
        if (this.network.type === '3g') {
          if (this.rootPage == 'NoInternetPage') {
            this.rootPage = 'TabsPage';
            console.log('3g');
          }
        }
        if (this.network.type === '2g') {
          if (this.rootPage == 'NoInternetPage') {
            this.rootPage = 'TabsPage';
            console.log('2g');
          }
        }

      }, 3000);
    });

    
    this.network.onDisconnect().subscribe(() => {
      if (this.rootPage != 'NoInternetPage') {
        this.rootPage = 'NoInternetPage';
        this.InternetProvider.networkConnected = false;
        console.log('network Disconnected!');
      }
    });
  }
}

