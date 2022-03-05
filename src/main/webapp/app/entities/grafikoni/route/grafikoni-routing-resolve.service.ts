import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGrafikoni, Grafikoni } from '../grafikoni.model';
import { GrafikoniService } from '../service/grafikoni.service';

@Injectable({ providedIn: 'root' })
export class GrafikoniRoutingResolveService implements Resolve<IGrafikoni> {
  constructor(protected service: GrafikoniService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGrafikoni> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((grafikoni: HttpResponse<Grafikoni>) => {
          if (grafikoni.body) {
            return of(grafikoni.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Grafikoni());
  }
}
