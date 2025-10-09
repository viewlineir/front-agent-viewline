/// وضعیت برگزاری کلی کلاس
export enum ClassStatusType {
    /// در حال انتظار
    Pending = 1,
    /// در حال برگذاری
    DarHaleBarGozari = 2,
    /// پایان یافته
    Finished = 3,
    /// لغو شد
    Cancelled = 4
}

export enum ClassStatusWithoutNumberType {
    /// در حال انتظار
    Pending = 'Pending',
    /// در حال برگذاری
    DarHaleBarGozari = 'DarHaleBarGozari',
    /// پایان یافته
    Finished = 'Finished',
    /// لغو شد
    Cancelled = 'Cancelled'
}