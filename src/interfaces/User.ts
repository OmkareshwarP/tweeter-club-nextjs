interface IUserAuthInfo {
  userId: string;
  email: string;
  username: string;
  name: string;
  profilePictureMediaId: string | null;
}

interface IUserInfo {
  userId: string;
  username: string;
  name: string;
  createdAt: string;
  profilePictureMediaId: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  dob: string | null;
}

interface IUserSettings {
  theme: string;
}

export type { IUserAuthInfo, IUserInfo, IUserSettings };
