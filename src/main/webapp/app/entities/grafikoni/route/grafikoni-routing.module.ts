import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GrafikoniComponent } from '../list/grafikoni.component';
import { GrafikoniDetailComponent } from '../detail/grafikoni-detail.component';
import { GrafikoniUpdateComponent } from '../update/grafikoni-update.component';
import { GrafikoniRoutingResolveService } from './grafikoni-routing-resolve.service';

const grafikoniRoute: Routes = [
  {
    path: '',
    component: GrafikoniComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GrafikoniDetailComponent,
    resolve: {
      grafikoni: GrafikoniRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GrafikoniUpdateComponent,
    resolve: {
      grafikoni: GrafikoniRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GrafikoniUpdateComponent,
    resolve: {
      grafikoni: GrafikoniRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(grafikoniRoute)],
  exports: [RouterModule],
})
export class GrafikoniRoutingModule {}
