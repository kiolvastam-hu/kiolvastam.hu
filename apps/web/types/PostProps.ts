import {CommentProps } from 'types/CommentProps'


export type PostProps = {
  id: string;
  book: {
    title: string;
    author: string;
    cover_url: string;
    pub_year: number;
    moly_id: number;
    moly_url: string;
  };
  user: {
    username: string;
    id: string;
  };
  tags: string[];
  opinion: string;
  summary: string;
  private: boolean;
  showComments: boolean;
  createdAt: string;
  updatedAt: string;
  comments: CommentProps[];
  likeCount: number;
  liked: boolean;
};
