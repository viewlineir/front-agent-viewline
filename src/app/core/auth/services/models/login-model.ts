export interface LoginModel {
    flagSendCode: boolean,
    sendCodeMessage: string;
    twoFactorAuth: boolean;
    twoFactorHash: string;
}
