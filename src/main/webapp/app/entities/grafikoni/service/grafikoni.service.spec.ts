import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGrafikoni, Grafikoni } from '../grafikoni.model';

import { GrafikoniService } from './grafikoni.service';

describe('Grafikoni Service', () => {
  let service: GrafikoniService;
  let httpMock: HttpTestingController;
  let elemDefault: IGrafikoni;
  let expectedResult: IGrafikoni | IGrafikoni[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(GrafikoniService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      region: 'AAAAAAA',
      promet: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Grafikoni', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Grafikoni()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Grafikoni', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          region: 'BBBBBB',
          promet: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Grafikoni', () => {
      const patchObject = Object.assign(
        {
          region: 'BBBBBB',
        },
        new Grafikoni()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Grafikoni', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          region: 'BBBBBB',
          promet: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Grafikoni', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addGrafikoniToCollectionIfMissing', () => {
      it('should add a Grafikoni to an empty array', () => {
        const grafikoni: IGrafikoni = { id: 123 };
        expectedResult = service.addGrafikoniToCollectionIfMissing([], grafikoni);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(grafikoni);
      });

      it('should not add a Grafikoni to an array that contains it', () => {
        const grafikoni: IGrafikoni = { id: 123 };
        const grafikoniCollection: IGrafikoni[] = [
          {
            ...grafikoni,
          },
          { id: 456 },
        ];
        expectedResult = service.addGrafikoniToCollectionIfMissing(grafikoniCollection, grafikoni);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Grafikoni to an array that doesn't contain it", () => {
        const grafikoni: IGrafikoni = { id: 123 };
        const grafikoniCollection: IGrafikoni[] = [{ id: 456 }];
        expectedResult = service.addGrafikoniToCollectionIfMissing(grafikoniCollection, grafikoni);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(grafikoni);
      });

      it('should add only unique Grafikoni to an array', () => {
        const grafikoniArray: IGrafikoni[] = [{ id: 123 }, { id: 456 }, { id: 89460 }];
        const grafikoniCollection: IGrafikoni[] = [{ id: 123 }];
        expectedResult = service.addGrafikoniToCollectionIfMissing(grafikoniCollection, ...grafikoniArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const grafikoni: IGrafikoni = { id: 123 };
        const grafikoni2: IGrafikoni = { id: 456 };
        expectedResult = service.addGrafikoniToCollectionIfMissing([], grafikoni, grafikoni2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(grafikoni);
        expect(expectedResult).toContain(grafikoni2);
      });

      it('should accept null and undefined values', () => {
        const grafikoni: IGrafikoni = { id: 123 };
        expectedResult = service.addGrafikoniToCollectionIfMissing([], null, grafikoni, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(grafikoni);
      });

      it('should return initial array if no Grafikoni is added', () => {
        const grafikoniCollection: IGrafikoni[] = [{ id: 123 }];
        expectedResult = service.addGrafikoniToCollectionIfMissing(grafikoniCollection, undefined, null);
        expect(expectedResult).toEqual(grafikoniCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
