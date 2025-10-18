import { Routes } from '@angular/router';
import { DashboardResolverService } from '../pages/dashboard/services/dashboard-resolver.service';

export const ThemeRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./theme.component').then(c => c.ThemeComponent),
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () => import('../pages/dashboard/dashboard.component').then(c => c.DashboardComponent),
                resolve: {
                    data: DashboardResolverService
                }
            },
            {
                path: 'finance',
                loadChildren: () => import('../pages/finance-page/finance-page.routes').then(r => r.FinancePageRoutes),
                resolve: {
                    data: DashboardResolverService
                },
            },
        ]
    }
];