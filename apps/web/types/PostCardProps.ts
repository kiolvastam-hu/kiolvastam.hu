import { KeyedMutator } from 'swr';

export type PostCardProps = {
  short: boolean;
  hideUser?: boolean;
  hideBook?: boolean;
  hideTags?: boolean;
  mutate?: KeyedMutator<any> | any;
  onlyShow?: 'opinion' | 'summary';
};
