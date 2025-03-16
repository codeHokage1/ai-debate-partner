'use client';

import React, { useState, useEffect } from 'react';
import {
  Team,
  DebatePosition,
  Speech,
  TeamRole,
  Speaker,
} from '@/types/debate';
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
  const [localTeam, setLocalTeam] = useState<Team>(team);
  const [ironMan, setIronMan] = useState(team.ironMan || false);

  useEffect(() => {
    setLocalTeam(team);
    setIronMan(team.ironMan || false);
  }, [team]);

  const handleRoleChange = (role: keyof Team, speakerId: string) => {
    const selectedSpeaker = team.speakers.find(s => s.id === speakerId);
    if (!selectedSpeaker) return;

    const updatedTeam = {
      ...localTeam,
      [role]: selectedSpeaker,
      ironMan,
    };

    if (ironMan) {
      const otherRole = getOtherRole(role);
      (updatedTeam[otherRole as keyof Team] as Speaker) = selectedSpeaker;
    }

    setLocalTeam(updatedTeam);
    onTeamUpdate(updatedTeam);
  };

  const getOtherRole = (role: keyof Team) => {
    switch (role) {
      case 'pm':
        return 'dpm';
      case 'dpm':
        return 'pm';
      case 'lo':
        return 'dlo';
      case 'dlo':
        return 'lo';
      case 'mg':
        return 'gw';
      case 'gw':
        return 'mg';
      case 'mo':
        return 'ow';
      case 'ow':
        return 'mo';
      default:
        return role;
    }
  };

  const handleIronManChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIronMan(isChecked);
    const pmSpeaker = localTeam.pm;
    const updatedTeam = {
      ...localTeam,
      ironMan: isChecked,
      dpm: isChecked ? pmSpeaker : localTeam.dpm,
      lo: isChecked ? pmSpeaker : localTeam.lo,
      dlo: isChecked ? pmSpeaker : localTeam.dlo,
      mg: isChecked ? pmSpeaker : localTeam.mg,
      gw: isChecked ? pmSpeaker : localTeam.gw,
      mo: isChecked ? pmSpeaker : localTeam.mo,
      ow: isChecked ? pmSpeaker : localTeam.ow,
    };
    setLocalTeam(updatedTeam);
    onTeamUpdate(updatedTeam);
  };

  const renderSpeakerSelections = () => {
    const roles: (keyof Team)[] = getRolesByTeamRole(team.role);

    return (
      <>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-xl font-semibold'>{team.role}</h2>
          <div className='flex items-center '>
            <input
              type='checkbox'
              id={`ironman-${team.id}`}
              checked={ironMan}
              onChange={handleIronManChange}
              className='mr-2 h-4 w-4'
            />
            <label htmlFor={`ironman-${team.id}`} className='text-xl'>
              Iron Man
            </label>
          </div>
        </div>

        {roles.map((role: keyof Team) => (
          <div key={role} className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              {getRoleLabel(role)}
            </label>
            <select
              value={(localTeam[role] as Speaker)?.id || ''}
              onChange={e => handleRoleChange(role, e.target.value)}
              className={`w-full p-2 border border-gray-300 rounded-md ${
                ironMan && role !== roles[0] ? 'cursor-not-allowed' : ''
              }`}
              disabled={ironMan && role !== roles[0]}>
              <option value=''>Select a Speaker</option>
              {team.speakers.map(speaker => (
                <option key={speaker.id} value={speaker.id}>
                  {speaker.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </>
    );
  };

  const getRolesByTeamRole = (teamRole: TeamRole): (keyof Team)[] => {
    switch (teamRole) {
      case TeamRole.OpeningGovernment:
        return ['pm', 'dpm'];
      case TeamRole.OpeningOpposition:
        return ['lo', 'dlo'];
      case TeamRole.ClosingGovernment:
        return ['mg', 'gw'];
      case TeamRole.ClosingOpposition:
        return ['mo', 'ow'];
      default:
        return [];
    }
  };

  const getRoleLabel = (role: keyof Team) => {
    switch (role) {
      case 'pm':
        return 'Prime Minister (PM)';
      case 'dpm':
        return 'Deputy Prime Minister (DPM)';
      case 'lo':
        return 'Leader of Opposition (LO)';
      case 'dlo':
        return 'Deputy Leader of Opposition (DLO)';
      case 'mg':
        return 'Member of Government (MG)';
      case 'gw':
        return 'Government Whip (GW)';
      case 'mo':
        return 'Member of Opposition (MO)';
      case 'ow':
        return 'Opposition Whip (OW)';
      default:
        return '';
    }
  };

  const renderSpeechRecorders = () => {
    const speakers: { speaker: Speaker; position: DebatePosition }[] = [];

    const roles = getRolesByTeamRole(team.role) as (keyof Team)[];
    roles.forEach(role => {
      if (localTeam[role]) {
        speakers.push({
          speaker: localTeam[role] as Speaker,
          position: getDebatePosition(role),
        });
      }
    });

    return (
      <div className='mt-6 grid gap-4 grid-cols-1 md:grid-cols-2'>
        {speakers.map(
          ({
            speaker,
            position,
          }: {
            speaker: Team['speakers'][number];
            position: DebatePosition;
          }) => (
            <SpeechRecorder
              key={`${speaker.id}-${position}`}
              speaker={speaker}
              position={position}
              teamId={team.id}
              onSpeechComplete={onSpeechComplete}
            />
          ),
        )}
      </div>
    );
  };

  const getDebatePosition = (role: keyof Team): DebatePosition => {
    switch (role) {
      case 'pm':
        return DebatePosition.PrimeMinister;
      case 'dpm':
        return DebatePosition.DeputyPrimeMinister;
      case 'lo':
        return DebatePosition.LeaderOfOpposition;
      case 'dlo':
        return DebatePosition.DeputyLeaderOfOpposition;
      case 'mg':
        return DebatePosition.MemberOfGovernment;
      case 'gw':
        return DebatePosition.GovernmentWhip;
      case 'mo':
        return DebatePosition.MemberOfOpposition;
      case 'ow':
        return DebatePosition.OppositionWhip;
      default:
        return DebatePosition.PrimeMinister;
    }
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
