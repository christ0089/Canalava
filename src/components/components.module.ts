import { NgModule } from '@angular/core';
import { UserViewComponent } from './user-view/user-view';
import { ContentviewComponent } from './contentview/contentview';
import { ChatBubbleComponent } from './chat-bubble/chat-bubble';
import { IonicModule } from 'ionic-angular';
import { AutoplayContentComponent } from './autoplay/autoplay';
@NgModule({
    declarations: [
        UserViewComponent,
        ContentviewComponent,
        ChatBubbleComponent,
        AutoplayContentComponent
    ],
    imports: [
        IonicModule
    ],
    exports: [
        UserViewComponent,
        ContentviewComponent,
        ChatBubbleComponent,
        AutoplayContentComponent
    ]
})
export class ComponentsModule { }
