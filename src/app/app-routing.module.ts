import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { HomeComponent } from './home/home.component';
import { RoleDetailsComponent } from './role-details/role-details.component';
import { RolesComponent } from './roles/roles.component';
import { DomainsComponent } from './domains/domains.component';
import { DomainDetailsComponent } from './domain-details/domain-details.component';
import { ManageComponent } from './manage/manage.component';
import { ComplianceComponent } from './compliance/compliance.component';

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent
  },
  {
    path:"domains",
    component: DomainsComponent
  },
  {
    path: 'domains/:domain',
    component: DomainDetailsComponent
  },
  {
    path: 'manage',
    component: ManageComponent
  },
  {
    path:"roles",
    component: RolesComponent
  },
  {
    path: 'roles/:role',
    component: RoleDetailsComponent
  },
  {
    path: 'roles/:Full Framework',
    component: RoleDetailsComponent
  },
  {
    path: 'compliance',
    component: ComplianceComponent
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: "**",
    redirectTo: "home",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
