import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'grafikoni',
        data: { pageTitle: 'Grafikonis' },
        loadChildren: () => import('./grafikoni/grafikoni.module').then(m => m.GrafikoniModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
