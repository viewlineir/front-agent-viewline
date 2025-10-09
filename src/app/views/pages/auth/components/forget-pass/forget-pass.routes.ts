import { Routes } from '@angular/router';

export const ForgetPassRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./forget-pass.component').then(c => c.ForgetPassComponent),
        children: [
            {
                path: '',
                redirectTo: 'send-code',
                pathMatch: 'full'
            },
            {
                path: 'send-code',
                loadComponent: () => import('./components/send-code/send-code.component').then(c => c.SendCodeComponent)
            },
            {
                path: 'verify-code',
                loadComponent: () => import('./components/verify-code/verify-code.component').then(c => c.VerifyCodeComponent)
            },
            {
                path: 'change-pass',
                loadComponent: () => import('./components/change-password/change-password.component').then(c => c.ChangePasswordComponent)
            },
        ]
    }
];
