import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IGrafikoni, Grafikoni } from '../grafikoni.model';
import { GrafikoniService } from '../service/grafikoni.service';

import { GrafikoniRoutingResolveService } from './grafikoni-routing-resolve.service';

describe('Grafikoni routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: GrafikoniRoutingResolveService;
  let service: GrafikoniService;
  let resultGrafikoni: IGrafikoni | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(GrafikoniRoutingResolveService);
    service = TestBed.inject(GrafikoniService);
    resultGrafikoni = undefined;
  });

  describe('resolve', () => {
    it('should return IGrafikoni returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultGrafikoni = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultGrafikoni).toEqual({ id: 123 });
    });

    it('should return new IGrafikoni if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultGrafikoni = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultGrafikoni).toEqual(new Grafikoni());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Grafikoni })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultGrafikoni = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultGrafikoni).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
