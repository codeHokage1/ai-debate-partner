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
import { FaUsers, FaUser } from 'react-icons/fa';

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
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4'>
          <div className='flex items-center gap-2'>
            <FaUsers className='h-5 w-5 text-indigo-600' />
            <h3 className='text-xl font-semibold text-slate-800'>
              {team.role}
            </h3>
          </div>

          <div className='flex items-center gap-2 px-4 py-3 bg-indigo-50 rounded-lg'>
            <input
              type='checkbox'
              id={`ironman-${team.id}`}
              checked={ironMan}
              onChange={handleIronManChange}
              className='h-5 w-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500'
            />
            <label
              htmlFor={`ironman-${team.id}`}
              className='text-indigo-700 font-medium'>
              Iron Man Mode
            </label>
          </div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          {roles.map((role: keyof Team) => (
            <div key={role} className='mb-4'>
              <label className='block text-sm font-medium text-slate-700 mb-2'>
                {getRoleLabel(role)}
              </label>
              <div className='relative'>
                <select
                  value={(localTeam[role] as Speaker)?.id || ''}
                  onChange={e => handleRoleChange(role, e.target.value)}
                  className={`block w-full pl-4 pr-10 py-3 text-base border-slate-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                    ironMan && role !== roles[0]
                      ? 'bg-slate-100 cursor-not-allowed'
                      : 'bg-white'
                  }`}
                  disabled={ironMan && role !== roles[0]}>
                  <option value=''>Select a Speaker</option>
                  {team.speakers.map(speaker => (
                    <option key={speaker.id} value={speaker.id}>
                      {speaker.name}
                    </option>
                  ))}
                </select>
                <FaUser className='absolute right-4 top-3.5 h-4 w-4 text-slate-400 pointer-events-none' />
              </div>
            </div>
          ))}
        </div>
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
    <div className='mb-8 card-custom'>
      <div className='card-header-custom'>
        <h2 className='text-xl font-bold text-white'>{team.name}</h2>
      </div>

      <div className='card-body-custom'>
        <div className='mb-8'>{renderSpeakerSelections()}</div>
        {renderSpeechRecorders()}
      </div>
    </div>
  );
};

export default DebateRecorder;
