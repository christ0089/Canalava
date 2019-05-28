import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TemasPage } from './temas';
import { IonicImageLoader } from 'ionic-image-loader';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    TemasPage,
  ],
  imports: [
    IonicPageModule.forChild(TemasPage),
    IonicImageLoader,
    PipesModule
  ],
})
export class TemasPageModule {}
