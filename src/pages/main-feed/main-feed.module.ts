import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MainFeedPage } from './main-feed';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    MainFeedPage,
  ],
  imports: [
    IonicPageModule.forChild(MainFeedPage),
    IonicImageLoader,
  ],
  exports: [
    MainFeedPage
  ]
})
export class MainFeedPageModule {}
