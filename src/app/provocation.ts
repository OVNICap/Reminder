import { RawChallenge } from './challenge';

export interface RawProvocation {
  challenge?: RawChallenge;
  created_at: string;
  due_date: string;
  id: string;
  reward: string;
  room: string;
  __typename: string;
}
