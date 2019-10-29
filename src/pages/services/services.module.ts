import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServicesPage } from './services';
import { IonTextAvatar } from 'ionic-text-avatar';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [
    ServicesPage,
    IonTextAvatar
  ],
  imports: [
    IonicPageModule.forChild(ServicesPage),
    PipesModule
  ],
  exports : [
    ServicesPage
  ]
})
export class ServicesPageModule {}
