import { IPost } from './Post';
import { IUserAuthInfo, IUserInfo, IUserSettings } from './User';

interface IResponseData {
  error: boolean;
  message: string;
  statusCode: number;
  errorCodeForClient: string;
  data: any;
}

export type { IResponseData, IUserAuthInfo, IUserInfo, IUserSettings, IPost };
