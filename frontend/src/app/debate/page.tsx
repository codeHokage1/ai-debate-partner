import React from 'react';
import { Round, TeamRole } from '@/types/debate';
import DebateManager from './DebateManager';

const round: Round = {
  id: 'round1',
  name: 'Round 1',
  location: 'Art Lecture Hall',
  judges: [
    { id: 'judge1', name: 'Qareebah' },
    { id: 'judge2', name: 'Mitchel' },
    { id: 'judge3', name: 'Chair - Olamide' },
  ],
  teams: [
    {
      id: 'og',
      name: 'Unilorin A',
      role: TeamRole.OpeningGovernment,
      speakers: [
        { id: 'og1', name: 'Alex Olafisoye' },
        { id: 'og2', name: 'Owolabi Victor' },
      ],
    },
    {
      id: 'oo',
      name: 'Veritas B',
      role: TeamRole.OpeningOpposition,
      speakers: [
        { id: 'oo1', name: 'Victor Moses' },
        { id: 'oo2', name: 'Adewoye Favour' },
      ],
    },
    {
      id: 'cg',
      name: 'OAU A',
      role: TeamRole.ClosingGovernment,
      speakers: [
        { id: 'cg1', name: 'David Samson' },
        { id: 'cg2', name: 'Emmanuel Adebayo' },
      ],
    },
    {
      id: 'co',
      name: 'Unilag B',
      role: TeamRole.ClosingOpposition,
      speakers: [
        { id: 'co1', name: 'Ganiyat Fasasi' },
        { id: 'co2', name: 'Obadimu Daniel' },
      ],
    },
  ],
};

export default function Page() {
  return (
    <div className='max-w-6xl mx-auto p-4'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-center'>BP Debate Session</h1>
      </div>

      <DebateManager round={round} teams={round.teams} />
    </div>
  );
}
