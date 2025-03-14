'use client';

import React, { useState, useEffect } from 'react';
import { Team, DebatePosition, Speech, TeamRole } from '@/types/debate';
import SpeechRecorder from './SpeechRecorder';

interface DebateRecorderProps {
  team: Team;
  onTeamUpdate: (updatedTeam: Team) => void;
  onSpeechComplete: (speech: Speech) => void;
}

const DebateRecorder: React.FC<DebateRecorderProps> = ({
  team,
  onTeamUpdate,
  onSpeechComplete,
}) => {
  // Local state to track selected speakers for each role
  const [localTeam, setLocalTeam] = useState<Team>(team);

  // Update local state when the team prop changes
  useEffect(() => {
    setLocalTeam(team);
  }, [team]);

  // // Check if any speakers have been assigned to positions
  // const hasAssignedSpeakers = (team: Team): boolean => {
  //   switch (team.role) {
  //     case TeamRole.OpeningGovernment:
  //       return !!team.pm || !!team.dpm;
  //     case TeamRole.OpeningOpposition:
  //       return !!team.lo || !!team.dlo;
  //     case TeamRole.ClosingGovernment:
  //       return !!team.mg || !!team.gw;
  //     case TeamRole.ClosingOpposition:
  //       return !!team.mo || !!team.ow;
  //     default:
  //       return false;
  //   }
  // };

  const handleRoleChange = (role: keyof Team, speakerId: string) => {
    if (!speakerId) {
      // Handle empty selection
      const updatedTeam = { ...localTeam, [role]: undefined };
      setLocalTeam(updatedTeam);
      onTeamUpdate(updatedTeam);
      return;
    }

    const selectedSpeaker = team.speakers.find(s => s.id === speakerId);
    if (!selectedSpeaker) return;

    // Create a copy of the team to update
    const updatedTeam = { ...localTeam, [role]: selectedSpeaker };

    // If a speaker is assigned to a position, auto-assign the other speaker to the other position
    if (team.speakers.length === 2) {
      const otherSpeaker = team.speakers.find(s => s.id !== speakerId);

      if (otherSpeaker) {
        switch (team.role) {
          case TeamRole.OpeningGovernment:
            if (role === 'pm') updatedTeam.dpm = otherSpeaker;
            if (role === 'dpm') updatedTeam.pm = otherSpeaker;
            break;
          case TeamRole.OpeningOpposition:
            if (role === 'lo') updatedTeam.dlo = otherSpeaker;
            if (role === 'dlo') updatedTeam.lo = otherSpeaker;
            break;
          case TeamRole.ClosingGovernment:
            if (role === 'mg') updatedTeam.gw = otherSpeaker;
            if (role === 'gw') updatedTeam.mg = otherSpeaker;
            break;
          case TeamRole.ClosingOpposition:
            if (role === 'mo') updatedTeam.ow = otherSpeaker;
            if (role === 'ow') updatedTeam.mo = otherSpeaker;
            break;
        }
      }
    }

    setLocalTeam(updatedTeam);
    onTeamUpdate(updatedTeam);
  };

  // Render appropriate inputs based on team role
  const renderSpeakerSelections = () => {
    switch (team.role) {
      case TeamRole.OpeningGovernment:
        return (
          <>
            <div className='flex items-center justify-between mb-4'>
              <label className='block text-sm font-medium text-gray-700'>
                Prime Minister (PM)
              </label>
              <select
                value={localTeam.pm?.id || ''}
                onChange={e => handleRoleChange('pm', e.target.value)}
                className='block w-1/2 p-2 border border-gray-300 rounded-md shadow-sm'>
                <option value=''>Select Speaker</option>
                {team.speakers.map(speaker => (
                  <option key={speaker.id} value={speaker.id}>
                    {speaker.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='flex items-center justify-between mb-4'>
              <label className='block text-sm font-medium text-gray-700'>
                Deputy Prime Minister (DPM)
              </label>
              <select
                value={localTeam.dpm?.id || ''}
                onChange={e => handleRoleChange('dpm', e.target.value)}
                className='block w-1/2 p-2 border border-gray-300 rounded-md shadow-sm'>
                <option value=''>Select Speaker</option>
                {team.speakers.map(speaker => (
                  <option key={speaker.id} value={speaker.id}>
                    {speaker.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        );

      case TeamRole.OpeningOpposition:
        return (
          <>
            <div className='flex items-center justify-between mb-4'>
              <label className='block text-sm font-medium text-gray-700'>
                Leader of Opposition (LO)
              </label>
              <select
                value={localTeam.lo?.id || ''}
                onChange={e => handleRoleChange('lo', e.target.value)}
                className='block w-1/2 p-2 border border-gray-300 rounded-md shadow-sm'>
                <option value=''>Select Speaker</option>
                {team.speakers.map(speaker => (
                  <option key={speaker.id} value={speaker.id}>
                    {speaker.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='flex items-center justify-between mb-4'>
              <label className='block text-sm font-medium text-gray-700'>
                Deputy Leader of Opposition (DLO)
              </label>
              <select
                value={localTeam.dlo?.id || ''}
                onChange={e => handleRoleChange('dlo', e.target.value)}
                className='block w-1/2 p-2 border border-gray-300 rounded-md shadow-sm'>
                <option value=''>Select Speaker</option>
                {team.speakers.map(speaker => (
                  <option key={speaker.id} value={speaker.id}>
                    {speaker.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        );

      case TeamRole.ClosingGovernment:
        return (
          <>
            <div className='flex items-center justify-between mb-4'>
              <label className='block text-sm font-medium text-gray-700'>
                Member of Government (MG)
              </label>
              <select
                value={localTeam.mg?.id || ''}
                onChange={e => handleRoleChange('mg', e.target.value)}
                className='block w-1/2 p-2 border border-gray-300 rounded-md shadow-sm'>
                <option value=''>Select Speaker</option>
                {team.speakers.map(speaker => (
                  <option key={speaker.id} value={speaker.id}>
                    {speaker.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='flex items-center justify-between mb-4'>
              <label className='block text-sm font-medium text-gray-700'>
                Government Whip (GW)
              </label>
              <select
                value={localTeam.gw?.id || ''}
                onChange={e => handleRoleChange('gw', e.target.value)}
                className='block w-1/2 p-2 border border-gray-300 rounded-md shadow-sm'>
                <option value=''>Select Speaker</option>
                {team.speakers.map(speaker => (
                  <option key={speaker.id} value={speaker.id}>
                    {speaker.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        );

      case TeamRole.ClosingOpposition:
        return (
          <>
            <div className='flex items-center justify-between mb-4'>
              <label className='block text-sm font-medium text-gray-700'>
                Member of Opposition (MO)
              </label>
              <select
                value={localTeam.mo?.id || ''}
                onChange={e => handleRoleChange('mo', e.target.value)}
                className='block w-1/2 p-2 border border-gray-300 rounded-md shadow-sm'>
                <option value=''>Select Speaker</option>
                {team.speakers.map(speaker => (
                  <option key={speaker.id} value={speaker.id}>
                    {speaker.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='flex items-center justify-between mb-4'>
              <label className='block text-sm font-medium text-gray-700'>
                Opposition Whip (OW)
              </label>
              <select
                value={localTeam.ow?.id || ''}
                onChange={e => handleRoleChange('ow', e.target.value)}
                className='block w-1/2 p-2 border border-gray-300 rounded-md shadow-sm'>
                <option value=''>Select Speaker</option>
                {team.speakers.map(speaker => (
                  <option key={speaker.id} value={speaker.id}>
                    {speaker.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  // Render speech recorders for selected speakers
  const renderSpeechRecorders = () => {
    const speakers = [];

    switch (team.role) {
      case TeamRole.OpeningGovernment:
        if (localTeam.pm)
          speakers.push({
            speaker: localTeam.pm,
            position: DebatePosition.PrimeMinister,
          });
        if (localTeam.dpm)
          speakers.push({
            speaker: localTeam.dpm,
            position: DebatePosition.DeputyPrimeMinister,
          });
        break;
      case TeamRole.OpeningOpposition:
        if (localTeam.lo)
          speakers.push({
            speaker: localTeam.lo,
            position: DebatePosition.LeaderOfOpposition,
          });
        if (localTeam.dlo)
          speakers.push({
            speaker: localTeam.dlo,
            position: DebatePosition.DeputyLeaderOfOpposition,
          });
        break;
      case TeamRole.ClosingGovernment:
        if (localTeam.mg)
          speakers.push({
            speaker: localTeam.mg,
            position: DebatePosition.MemberOfGovernment,
          });
        if (localTeam.gw)
          speakers.push({
            speaker: localTeam.gw,
            position: DebatePosition.GovernmentWhip,
          });
        break;
      case TeamRole.ClosingOpposition:
        if (localTeam.mo)
          speakers.push({
            speaker: localTeam.mo,
            position: DebatePosition.MemberOfOpposition,
          });
        if (localTeam.ow)
          speakers.push({
            speaker: localTeam.ow,
            position: DebatePosition.OppositionWhip,
          });
        break;
    }

    return (
      <div className='mt-6 grid gap-4 grid-cols-1 md:grid-cols-2'>
        {speakers.map(({ speaker, position }) => (
          <SpeechRecorder
            key={`${speaker.id}-${position}`}
            speaker={speaker}
            position={position}
            teamId={team.id}
            onSpeechComplete={onSpeechComplete}
          />
        ))}
      </div>
    );
  };

  return (
    <div className='mb-8 p-6 rounded-lg shadow-md bg-white'>
      <h2 className='text-xl font-bold text-gray-800 mb-4'>{team.name}</h2>
      <div className='mb-6'>{renderSpeakerSelections()}</div>
      {renderSpeechRecorders()}
    </div>
  );
};

export default DebateRecorder;
