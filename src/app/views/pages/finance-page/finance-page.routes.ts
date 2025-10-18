import { Routes } from '@angular/router';

export const FinancePageRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./finance-page.component').then(c => c.FinancePageComponent),
    }
];