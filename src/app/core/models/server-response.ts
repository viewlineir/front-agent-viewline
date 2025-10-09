export interface ServerResponse<T> {
	success: Boolean;
	message: string;
    result: T;
}
