import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGrafikoni } from '../grafikoni.model';

@Component({
  selector: 'jhi-grafikoni-detail',
  templateUrl: './grafikoni-detail.component.html',
})
export class GrafikoniDetailComponent implements OnInit {
  grafikoni: IGrafikoni | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ grafikoni }) => {
      this.grafikoni = grafikoni;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
