import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGrafikoni } from '../grafikoni.model';
import { GrafikoniService } from '../service/grafikoni.service';

@Component({
  templateUrl: './grafikoni-delete-dialog.component.html',
})
export class GrafikoniDeleteDialogComponent {
  grafikoni?: IGrafikoni;

  constructor(protected grafikoniService: GrafikoniService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.grafikoniService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
