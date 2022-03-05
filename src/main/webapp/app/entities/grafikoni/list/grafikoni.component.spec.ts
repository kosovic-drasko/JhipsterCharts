import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { GrafikoniService } from '../service/grafikoni.service';

import { GrafikoniComponent } from './grafikoni.component';

describe('Grafikoni Management Component', () => {
  let comp: GrafikoniComponent;
  let fixture: ComponentFixture<GrafikoniComponent>;
  let service: GrafikoniService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [GrafikoniComponent],
    })
      .overrideTemplate(GrafikoniComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GrafikoniComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(GrafikoniService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.grafikonis?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
