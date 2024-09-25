import { States } from './Estates';
export type EventLocation = 'Presencial' | 'Online';

export interface ScheduledEvent {
  id: number;
  title?: string;
  description?: string;
  local: EventLocation;
  city?: string;
  state: States;
  neighborhood?: string;
  image?: string;
  createdAt: Date;
  updateAt: Date;
  eventDate?: Date;
  occurred: boolean;
  slug?: string;
  typeEventId: number;
}
