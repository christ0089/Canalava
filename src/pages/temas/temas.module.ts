import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TemasPage } from './temas';
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  declarations: [
    TemasPage,
  ],
  imports: [
    IonicPageModule.forChild(TemasPage),
    IonicImageLoader
  ],
})
export class TemasPageModule {}
