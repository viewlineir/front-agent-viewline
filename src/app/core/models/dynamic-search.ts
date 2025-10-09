export interface DynamicSearch<T=null> {
    search: boolean;
    filters?: T;
    orderBy: string;
    orderType: string;
    page: number;
    pageSize: number;
}
