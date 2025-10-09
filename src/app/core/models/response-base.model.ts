export interface IResponseBaseModel<T>{
    success: boolean
    message: string;
    result: T;
}