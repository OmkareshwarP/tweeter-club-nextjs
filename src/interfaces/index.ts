import { IAuthUserInfo, IUserInfo } from './User';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface IResponseData {
  error: boolean;
  message: string;
  statusCode: number;
  errorCodeForClient: string;
  data: any;
}

export type { IResponseData, IAuthUserInfo, IUserInfo };
