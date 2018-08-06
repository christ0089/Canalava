import { NgModule } from '@angular/core';
import { UserViewComponent } from './user-view/user-view';
import { ContentviewComponent } from './contentview/contentview';
//import { ChatBubbleComponent } from './chat-bubble/chat-bubble';
import { IonicModule } from 'ionic-angular';
@NgModule({
    declarations: [
        UserViewComponent,
        ContentviewComponent,
        //      ChatBubbleComponent
    ],
    imports: [
        IonicModule
    ],
    exports: [
        UserViewComponent,
        ContentviewComponent,
        //   ChatBubbleComponent
    ]
})
export class ComponentsModule { }
