import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MainFeedPage } from './main-feed';
import { IonicImageLoader } from 'ionic-image-loader';
import { PipesModule } from '../../pipes/pipes.module'

@NgModule({
  declarations: [
    MainFeedPage,
  ],
  imports: [
    IonicPageModule.forChild(MainFeedPage),
    IonicImageLoader,
    PipesModule
  ],
  exports: [
    MainFeedPage
  ]
})
export class MainFeedPageModule {}
