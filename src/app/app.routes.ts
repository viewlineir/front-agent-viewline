import { Routes } from '@angular/router';
import { AuthGuard } from './core/auth/services';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./views/theme/theme.routes').then(r => r.ThemeRoutes),
        canActivate: [AuthGuard],
    },
    {
        path: 'auth',
        loadChildren: () => import('./views/pages/auth/auth.routes').then(r => r.AuthRoutes)
    },
];
