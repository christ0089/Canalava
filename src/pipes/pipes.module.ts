import { NgModule } from '@angular/core';
import { DocPipe } from './doc/doc';
import { LetterPipe } from './firstLetters/letters';
@NgModule({
	declarations: [DocPipe, LetterPipe],
	imports: [],
	exports: [DocPipe, LetterPipe]
})
export class PipesModule {}
