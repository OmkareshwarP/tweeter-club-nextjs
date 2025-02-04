interface IPost {
  userId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  imageMediaFiles: string | null;
}

export type { IPost };
