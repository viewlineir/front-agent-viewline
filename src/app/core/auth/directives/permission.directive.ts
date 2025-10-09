import { Directive, ElementRef, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
	selector: '[uaccess]',
	inputs: ['permission']
})
export class PermissionDirective implements OnInit {
	_dval = 'green';
	permission: string;

	constructor(
		private _ref: ElementRef,
		private authServise: AuthService
	) { }

	async ngOnInit() {
		// console.log(await !this.authServise.isAuthUserInRole(this.permission))
		const cehckHasRole = await this.authServise.isAuthUserInRole(this.permission);
		if (cehckHasRole === false) {
			this._ref.nativeElement.classList.add('hide');
		}
	}
}
