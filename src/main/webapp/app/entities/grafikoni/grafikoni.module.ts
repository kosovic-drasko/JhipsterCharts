import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GrafikoniComponent } from './list/grafikoni.component';
import { GrafikoniDetailComponent } from './detail/grafikoni-detail.component';
import { GrafikoniUpdateComponent } from './update/grafikoni-update.component';
import { GrafikoniDeleteDialogComponent } from './delete/grafikoni-delete-dialog.component';
import { GrafikoniRoutingModule } from './route/grafikoni-routing.module';

@NgModule({
  imports: [SharedModule, GrafikoniRoutingModule],
  declarations: [GrafikoniComponent, GrafikoniDetailComponent, GrafikoniUpdateComponent, GrafikoniDeleteDialogComponent],
  entryComponents: [GrafikoniDeleteDialogComponent],
})
export class GrafikoniModule {}
