export enum EOrderStatusType {
    // در انتظار پرداخت
    Pending = 1,

    // پرداخت شده
    Paid = 2,

    // لغو پرداخت
    Faild = 3,

    // اقساطی با پرداخت اولیه
    InstallmentsWithInitialPayment = 4,

    // کنسل شده
    Canceled = 5
}