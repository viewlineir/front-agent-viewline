export interface IListDiscountModel {
    records: IListDiscountRecordsModel[];
    totalCount: number;
}

export interface IListDiscountRecordsModel {

    discountId: number;
    discountCode: string;
    createdOnUtc: string;
    discountMultiPercentAgent: [
        {
            isPercent: boolean;
            percentOrValue: number;
        }
    ],
    discountMultiPercentStudent: [
        {
            isPercent: boolean;
            percentOrValue: number;
        }
    ],
    registerCount: number;
    incomeFromPaidAmount: number;
    incomeFromPaidAmountList: [
        {
            totalPaid: number;
            totalTax: number;
            agentPercent: number;
        },
    ]

}