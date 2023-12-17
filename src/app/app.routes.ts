import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { ProductComponent } from './product/product.component';
import { ScanComponent } from './scan/scan.component';
import { HistoryComponent } from './history/history.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
    canActivate: [authGuard],
  },
  {
    path: 'product/:id',
    component: ProductComponent,
    canActivate: [authGuard],
  },
  {
    path: 'scan',
    component: ScanComponent,
    canActivate: [authGuard],
  },
  {
    path: 'history',
    component: HistoryComponent,
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
