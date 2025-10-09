export interface IOrderItemModel {
    finalAmount: number;
    totalExclusiveDiscount: number;
    agentDiscount: number;
    paymentType: number;
    paidInstallmentsCount: number;
    unpaidInstallmentsCount: number;
    courses: [
        {
            courseId: number;
            courseName: string;
            teacherName: string;
            coursePrice: number;
            discountAmount: number;
        }
    ]
}