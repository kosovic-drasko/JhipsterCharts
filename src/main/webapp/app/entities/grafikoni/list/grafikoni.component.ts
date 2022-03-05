import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IGrafikoni } from '../grafikoni.model';
import { GrafikoniService } from '../service/grafikoni.service';
import { GrafikoniDeleteDialogComponent } from '../delete/grafikoni-delete-dialog.component';

@Component({
  selector: 'jhi-grafikoni',
  templateUrl: './grafikoni.component.html',
})
export class GrafikoniComponent implements OnInit {
  grafikonis?: IGrafikoni[];
  isLoading = false;

  constructor(protected grafikoniService: GrafikoniService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.grafikoniService.query().subscribe({
      next: (res: HttpResponse<IGrafikoni[]>) => {
        this.isLoading = false;
        this.grafikonis = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IGrafikoni): number {
    return item.id!;
  }

  delete(grafikoni: IGrafikoni): void {
    const modalRef = this.modalService.open(GrafikoniDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.grafikoni = grafikoni;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
