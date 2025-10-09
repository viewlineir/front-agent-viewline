export interface IListDiscountModel {
    records: [
        {
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
    ],
    totalCount: number;
}