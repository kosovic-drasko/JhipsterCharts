import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { GrafikoniService } from '../service/grafikoni.service';
import { IGrafikoni, Grafikoni } from '../grafikoni.model';

import { GrafikoniUpdateComponent } from './grafikoni-update.component';

describe('Grafikoni Management Update Component', () => {
  let comp: GrafikoniUpdateComponent;
  let fixture: ComponentFixture<GrafikoniUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let grafikoniService: GrafikoniService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [GrafikoniUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(GrafikoniUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GrafikoniUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    grafikoniService = TestBed.inject(GrafikoniService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const grafikoni: IGrafikoni = { id: 456 };

      activatedRoute.data = of({ grafikoni });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(grafikoni));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Grafikoni>>();
      const grafikoni = { id: 123 };
      jest.spyOn(grafikoniService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grafikoni });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: grafikoni }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(grafikoniService.update).toHaveBeenCalledWith(grafikoni);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Grafikoni>>();
      const grafikoni = new Grafikoni();
      jest.spyOn(grafikoniService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grafikoni });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: grafikoni }));
      saveSubject.complete();

      // THEN
      expect(grafikoniService.create).toHaveBeenCalledWith(grafikoni);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Grafikoni>>();
      const grafikoni = { id: 123 };
      jest.spyOn(grafikoniService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ grafikoni });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(grafikoniService.update).toHaveBeenCalledWith(grafikoni);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
