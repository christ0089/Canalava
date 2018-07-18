import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MainFeedPage } from './main-feed';

@NgModule({
  declarations: [
    MainFeedPage,
  ],
  imports: [
    IonicPageModule.forChild(MainFeedPage),
  ],
  exports: [
    MainFeedPage
  ]
})
export class MainFeedPageModule {}
