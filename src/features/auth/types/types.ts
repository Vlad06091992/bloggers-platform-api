export type AuthCreateModel = {
   loginOrEmail:string
   password:string
};

export type ConfirmationCode = {code:string}

export type ResendingEmail = {email:string}

export type RefreshTokensModel =  {
accessToken:string
};