import { Injectable } from '@angular/core';
import {
	CanActivate,
	Router,
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	CanLoad,
	Route
} from '@angular/router';

import { ValidationAuthTokenUser } from './validate-auth-token';
import { AuthGuardPermission } from './models/auth-guard-permission';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
	constructor(
		private router: Router,
		private validateAuthToken: ValidationAuthTokenUser
	) { }

	canLoad(route: Route): boolean {
		const permissionData = route.data['permission'] as AuthGuardPermission;
		if (Array.isArray(permissionData.permittedRoles)) {
			const isInRole = this.validateAuthToken.isAuthUserInRole(
				permissionData.permittedRoles[0]
			);
			if (isInRole) {
				return true;
			} else {
				return false;
			}
		} 
		return false;
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
		if (!this.validateAuthToken.isLoggedIn()) {
			this.isLogOut(state);
			return false;
		}

		const permissionData = route.data['permission'] as AuthGuardPermission;
		if (!permissionData) {
			return true;
		}

		if (
			Array.isArray(permissionData.deniedRoles) &&
			Array.isArray(permissionData.permittedRoles)
		) {
			throw new Error(
				'Dont set both \'deniedRoles\' and \'permittedRoles\' in route data.'
			);
		}

		if (Array.isArray(permissionData.permittedRoles)) {
			const isInRole = this.validateAuthToken.isAuthUserInRole(
				permissionData.permittedRoles[0]
			);
			if (isInRole) {
				return true;
			}

			this.showAccessDenied(state);
			return false;
		}

		if (Array.isArray(permissionData.deniedRoles)) {
			const isInRole = this.validateAuthToken.isAuthUserInRole(
				permissionData.deniedRoles[0]
			);
			if (!isInRole) {
				return true;
			}

			this.showAccessDenied(state);
			return false;
		}
	}

	private showAccessDenied(state: RouterStateSnapshot) {
		this.router.navigate(['/accessDenied']);
	}

	private isLogOut(state: RouterStateSnapshot) {
		this.router.navigate(['/auth/login']);
	}
}
