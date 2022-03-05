import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IGrafikoni, Grafikoni } from '../grafikoni.model';
import { GrafikoniService } from '../service/grafikoni.service';

@Component({
  selector: 'jhi-grafikoni-update',
  templateUrl: './grafikoni-update.component.html',
})
export class GrafikoniUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    region: [],
    promet: [],
  });

  constructor(protected grafikoniService: GrafikoniService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ grafikoni }) => {
      this.updateForm(grafikoni);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const grafikoni = this.createFromForm();
    if (grafikoni.id !== undefined) {
      this.subscribeToSaveResponse(this.grafikoniService.update(grafikoni));
    } else {
      this.subscribeToSaveResponse(this.grafikoniService.create(grafikoni));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGrafikoni>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(grafikoni: IGrafikoni): void {
    this.editForm.patchValue({
      id: grafikoni.id,
      region: grafikoni.region,
      promet: grafikoni.promet,
    });
  }

  protected createFromForm(): IGrafikoni {
    return {
      ...new Grafikoni(),
      id: this.editForm.get(['id'])!.value,
      region: this.editForm.get(['region'])!.value,
      promet: this.editForm.get(['promet'])!.value,
    };
  }
}
