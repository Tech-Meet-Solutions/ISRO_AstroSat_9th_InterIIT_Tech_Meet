import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ObjectComponent } from './object/object.component';

// Specifies the route-component mapping
const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'object/:id', component: ObjectComponent },
  { path: '**', redirectTo: '', },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
