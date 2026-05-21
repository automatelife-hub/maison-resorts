import { Metadata } from 'next';
import JournalClient from './JournalClient';

export const metadata: Metadata = {
  title: 'Editorial Journal | Maison Resorts',
  description: 'Sanctuaries, conscious luxury, and heritage travel. Read the stories of arrival from Maison Resorts.',
};

export default function JournalPage() {
  return <JournalClient />;
}
