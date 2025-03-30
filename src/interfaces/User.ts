interface IAuthUserInfo {
  userId: string;
  username: string;
  name: string;
  profilePictureMediaId: string;
  followingCount: number;
  followersCount: number;
}

interface IUserInfo {
  userId: string;
  username: string;
  name: string;
  profilePictureMediaId: string;
  headerPictureMediaId: string;
  followersCount: number;
  followingCount: number;
  bio: string;
  location: string;
  website: string;
  dob: string;
  socialLinks: string[];
  createdAt: number;
}

export type { IAuthUserInfo, IUserInfo };
