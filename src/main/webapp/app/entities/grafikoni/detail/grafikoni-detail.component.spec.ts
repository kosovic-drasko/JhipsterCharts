import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GrafikoniDetailComponent } from './grafikoni-detail.component';

describe('Grafikoni Management Detail Component', () => {
  let comp: GrafikoniDetailComponent;
  let fixture: ComponentFixture<GrafikoniDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GrafikoniDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ grafikoni: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(GrafikoniDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(GrafikoniDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load grafikoni on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.grafikoni).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
