import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessagePage } from './message';
import { MessagesPage } from '../messages/messages';
//import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    MessagePage,
  ],
  imports: [
  //  ComponentsModule,
    IonicPageModule.forChild(MessagePage),
  ],
  exports: [
    MessagePage
  ]
})
export class MessagePageModule {}