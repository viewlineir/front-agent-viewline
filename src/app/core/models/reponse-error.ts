export class ResponseError implements Error {
	name: string;
	message: string;
	stack?: string;
	data: any;
}