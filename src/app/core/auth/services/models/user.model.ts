
import { Address } from './address.model';
import { SocialNetworks } from './social-networks.model';

export class BaseModel {
	// Edit
	_isEditMode = false;
	// Log
	_userId = 0; // Admin
	_createdDate: string;
	_updatedDate: string;
}

export class User extends BaseModel {
	id: number;
	username: string;
	password: string;
	email: string;
	accessToken: string;
	refreshToken: string;
	roles: number[];
	pic: string;
	fullname: string;
	occupation: string;
	companyName: string;
	phone: string;
	address: Address;
	socialNetworks: SocialNetworks;

	clear(): void {
		this.id = undefined;
		this.username = '';
		this.password = '';
		this.email = '';
		this.roles = [];
		this.fullname = '';
		this.accessToken = 'access-token-' + Math.random();
		this.refreshToken = 'access-token-' + Math.random();
		this.pic = './assets/images/user-register.png';
		this.occupation = '';
		this.companyName = '';
		this.phone = '';
		this.address = new Address();
		this.address.clear();
		this.socialNetworks = new SocialNetworks();
		this.socialNetworks.clear();
	}
}
