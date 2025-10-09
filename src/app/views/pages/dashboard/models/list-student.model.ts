export interface IListStudentModel {
    studentFirstName: string;
    studentLastName: string;
    createdDateTime: string;
    orderId: number;
    discountCode: string;
    orderStatus: number;
    orderInstallmentPaidCountAndTotalCount: string;
    agentShareFromDebtInstallments: number;
    agentShareFromPayments: number;
    agentShareTotal: number;
}