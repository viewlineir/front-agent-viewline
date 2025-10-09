import { TablePager } from './table-pager';

export interface TablePagingIndex<T> {
	records: T[];
	totalCount: number;
	pager: TablePager;
}

