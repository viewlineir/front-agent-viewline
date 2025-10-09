export interface IReshteListItemModel {
    id: number;
    title: string;
    published: boolean;
    createdDateUtc: string;
    creator: string;
    creatorEmail: string;
    lastChangeDateUtc: string;
    lastChangeBy: string;
    lastChangeByEmail: string;
}