import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGrafikoni, getGrafikoniIdentifier } from '../grafikoni.model';

export type EntityResponseType = HttpResponse<IGrafikoni>;
export type EntityArrayResponseType = HttpResponse<IGrafikoni[]>;

@Injectable({ providedIn: 'root' })
export class GrafikoniService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/grafikonis');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(grafikoni: IGrafikoni): Observable<EntityResponseType> {
    return this.http.post<IGrafikoni>(this.resourceUrl, grafikoni, { observe: 'response' });
  }

  update(grafikoni: IGrafikoni): Observable<EntityResponseType> {
    return this.http.put<IGrafikoni>(`${this.resourceUrl}/${getGrafikoniIdentifier(grafikoni) as number}`, grafikoni, {
      observe: 'response',
    });
  }

  partialUpdate(grafikoni: IGrafikoni): Observable<EntityResponseType> {
    return this.http.patch<IGrafikoni>(`${this.resourceUrl}/${getGrafikoniIdentifier(grafikoni) as number}`, grafikoni, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGrafikoni>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGrafikoni[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addGrafikoniToCollectionIfMissing(
    grafikoniCollection: IGrafikoni[],
    ...grafikonisToCheck: (IGrafikoni | null | undefined)[]
  ): IGrafikoni[] {
    const grafikonis: IGrafikoni[] = grafikonisToCheck.filter(isPresent);
    if (grafikonis.length > 0) {
      const grafikoniCollectionIdentifiers = grafikoniCollection.map(grafikoniItem => getGrafikoniIdentifier(grafikoniItem)!);
      const grafikonisToAdd = grafikonis.filter(grafikoniItem => {
        const grafikoniIdentifier = getGrafikoniIdentifier(grafikoniItem);
        if (grafikoniIdentifier == null || grafikoniCollectionIdentifiers.includes(grafikoniIdentifier)) {
          return false;
        }
        grafikoniCollectionIdentifiers.push(grafikoniIdentifier);
        return true;
      });
      return [...grafikonisToAdd, ...grafikoniCollection];
    }
    return grafikoniCollection;
  }
}
