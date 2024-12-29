import { IBasicUserInfo } from './User';

interface IResponseData {
  error: boolean;
  message: string;
  statusCode: number;
  errorCodeForClient: string;
  data: any;
}

export type { IResponseData, IBasicUserInfo };
