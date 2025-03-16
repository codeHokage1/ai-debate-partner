'use client';

import { useState, useEffect } from 'react';
import { Team, Judge } from '@/types/debate';
import Select, {
  StylesConfig,
  CSSObjectWithLabel,
  OptionProps,
} from 'react-select';

interface Room {
  id: string;
  name: string;
  ogTeamId?: string;
  ooTeamId?: string;
  cgTeamId?: string;
  coTeamId?: string;
  panelJudgeIds?: string[];
  chairJudgeId?: string;
}

interface RoomRowProps {
  room: Room;
  allTeams: Team[];
  allJudges: Judge[];
  onRoomUpdate: (updatedRoom: Room) => void;
  assignedTeams: Set<string>;
  assignedJudges: Set<string>;
  index: number;
}

export default function RoomRow({
  room,
  allTeams,
  allJudges,
  onRoomUpdate,
  assignedTeams,
  assignedJudges,
}: RoomRowProps) {
  const [availableTeams, setAvailableTeams] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [availableJudges, setAvailableJudges] = useState<
    Array<{ value: string; label: string }>
  >([]);

  useEffect(() => {
    // Filter out teams that are already assigned to other rooms
    const filteredTeams = allTeams
      .filter(
        team =>
          !assignedTeams.has(team.id) ||
          room.ogTeamId === team.id ||
          room.ooTeamId === team.id ||
          room.cgTeamId === team.id ||
          room.coTeamId === team.id,
      )
      .map(team => ({
        value: team.id,
        label: team.name,
      }));

    setAvailableTeams(filteredTeams);

    // Filter out judges that are already assigned to other rooms
    const filteredJudges = allJudges
      .filter(
        judge =>
          !assignedJudges.has(judge.id) ||
          room.panelJudgeIds?.includes(judge.id) ||
          room.chairJudgeId === judge.id,
      )
      .map(judge => ({
        value: judge.id,
        label: judge.name,
      }));

    setAvailableJudges(filteredJudges);
  }, [allTeams, allJudges, assignedTeams, assignedJudges, room]);

  const handleTeamChange = (
    position: 'ogTeamId' | 'ooTeamId' | 'cgTeamId' | 'coTeamId',
    selectedTeam: { value: string; label: string } | null,
  ) => {
    // Prevent assigning a team that is already assigned in another room
    if (
      selectedTeam &&
      assignedTeams.has(selectedTeam.value) &&
      room[position] !== selectedTeam.value
    ) {
      return;
    }
    const updatedRoom: Room = { ...room };
    updatedRoom[position] = selectedTeam?.value || undefined;
    onRoomUpdate(updatedRoom);
  };

  const handleChairChange = (
    selectedJudge: { value: string; label: string } | null,
  ) => {
    const updatedRoom: Room = { ...room };

    // Check if judge is already in panel for this room
    if (
      selectedJudge &&
      room.panelJudgeIds &&
      room.panelJudgeIds.includes(selectedJudge.value)
    ) {
      // Automatically remove from panel when assigned as chair
      updatedRoom.panelJudgeIds = room.panelJudgeIds.filter(
        id => id !== selectedJudge.value,
      );
    }

    updatedRoom.chairJudgeId = selectedJudge?.value || undefined;
    onRoomUpdate(updatedRoom);
  };

  const handlePanelChange = (
    selectedJudges: Array<{ value: string; label: string }>,
  ) => {
    const updatedRoom: Room = { ...room };

    // Don't allow chair judge to be in panel
    if (room.chairJudgeId) {
      const chairIncluded = selectedJudges.some(
        judge => judge.value === room.chairJudgeId,
      );
      if (chairIncluded) {
        alert(
          'The chair judge cannot also be on the panel. Please select different judges.',
        );
        return;
      }
    }

    updatedRoom.panelJudgeIds = selectedJudges.map(judge => judge.value);
    onRoomUpdate(updatedRoom);
  };

  const getSelectedTeam = (
    position: 'ogTeamId' | 'ooTeamId' | 'cgTeamId' | 'coTeamId',
  ) => {
    const teamId = room[position];
    if (!teamId) return null;

    const team = allTeams.find(t => t.id === teamId);
    return team ? { value: team.id, label: team.name } : null;
  };

  const getSelectedChair = () => {
    if (!room.chairJudgeId) return null;
    const judge = allJudges.find(j => j.id === room.chairJudgeId);
    return judge ? { value: judge.id, label: judge.name } : null;
  };

  const getSelectedPanel = () => {
    if (!room.panelJudgeIds || room.panelJudgeIds.length === 0) return [];
    return room.panelJudgeIds
      .map(judgeId => {
        const judge = allJudges.find(j => j.id === judgeId);
        return judge ? { value: judge.id, label: judge.name } : null;
      })
      .filter(item => item !== null) as Array<{ value: string; label: string }>;
  };

  const getPanelOptions = () => {
    if (!room.panelJudgeIds || room.panelJudgeIds.length === 0) return [];
    return room.panelJudgeIds
      .map(judgeId => {
        const judge = allJudges.find(j => j.id === judgeId);
        return judge ? { value: judge.id, label: judge.name } : null;
      })
      .filter(option => option !== null) as Array<{
      value: string;
      label: string;
    }>;
  };

  // Custom styles for react-select
  const selectStyles: StylesConfig<{ value: string; label: string }, false> = {
    control: base => ({
      ...base,
      borderColor: '#e2e8f0',
      minHeight: '42px',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#cbd5e1',
      },
    }),

    option: (
      base: CSSObjectWithLabel,
      state: OptionProps<{ value: string; label: string }, false>,
    ): CSSObjectWithLabel => ({
      ...base,
      backgroundColor: state.isSelected
        ? '#818cf8'
        : state.isFocused
        ? '#e0e7ff'
        : base.backgroundColor,
      padding: '8px 12px',
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      '&:active': {
        backgroundColor: '#c7d2fe',
      },
    }),

    menu: base => ({
      ...base,
      zIndex: 50,
      width: 'auto',
      minWidth: '100%',
    }),

    menuList: base => ({
      ...base,
      padding: '6px',
    }),

    placeholder: base => ({
      ...base,
      fontSize: '0.9rem',
    }),

    singleValue: base => ({
      ...base,
      fontSize: '0.9rem',
      whiteSpace: 'normal',
      wordBreak: 'break-word',
      maxWidth: '260px', // Ensure text doesn't overflow
    }),

    multiValue: base => ({
      ...base,
      backgroundColor: '#e0e7ff',
      borderRadius: '4px',
    }),

    multiValueLabel: base => ({
      ...base,
      fontSize: '0.85rem',
      color: '#4338ca',
      padding: '2px 6px',
      whiteSpace: 'normal',
      wordBreak: 'break-word',
    }),

    multiValueRemove: base => ({
      ...base,
      color: '#4338ca',
      ':hover': {
        backgroundColor: '#c7d2fe',
        color: '#4f46e5',
      },
    }),
    valueContainer: base => ({
      ...base,
      padding: '2px 8px',
      whiteSpace: 'normal',
      flexWrap: 'wrap',
    }),
  };

  return (
    <>
      <td className='px-3 py-4'>
        <input
          type='text'
          value={room.name}
          onChange={e => onRoomUpdate({ ...room, name: e.target.value })}
          className='w-full p-3 text-base border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
          placeholder='Room Name'
        />
      </td>
      <td className='px-3 py-4'>
        <Select
          instanceId={`og-team-select-${room.id}`}
          value={getSelectedTeam('ogTeamId')}
          onChange={option => handleTeamChange('ogTeamId', option)}
          options={availableTeams}
          isClearable
          placeholder='Select OG team'
          className='w-full'
          styles={selectStyles}
        />
      </td>
      <td className='px-3 py-4'>
        <Select
          instanceId={`oo-team-select-${room.id}`}
          value={getSelectedTeam('ooTeamId')}
          onChange={option => handleTeamChange('ooTeamId', option)}
          options={availableTeams}
          isClearable
          placeholder='Select OO team'
          className='w-full'
          styles={selectStyles}
        />
      </td>
      <td className='px-3 py-4'>
        <Select
          instanceId={`cg-team-select-${room.id}`}
          value={getSelectedTeam('cgTeamId')}
          onChange={option => handleTeamChange('cgTeamId', option)}
          options={availableTeams}
          isClearable
          placeholder='Select CG team'
          className='w-full'
          styles={selectStyles}
        />
      </td>
      <td className='px-3 py-4'>
        <Select
          instanceId={`co-team-select-${room.id}`}
          value={getSelectedTeam('coTeamId')}
          onChange={option => handleTeamChange('coTeamId', option)}
          options={availableTeams}
          isClearable
          placeholder='Select CO team'
          className='w-full'
          styles={selectStyles}
        />
      </td>
      <td className='px-3 py-4'>
        <Select
          instanceId={`panel-judges-select-${room.id}`}
          value={getSelectedPanel()}
          onChange={options =>
            handlePanelChange(
              options as Array<{ value: string; label: string }>,
            )
          }
          options={availableJudges}
          isMulti
          placeholder='Select panel judges'
          className='w-full'
          styles={selectStyles}
        />
      </td>
      <td className='px-3 py-4'>
        <Select
          instanceId={`chair-judge-select-${room.id}`}
          value={getSelectedChair()}
          onChange={option => handleChairChange(option)}
          options={getPanelOptions()}
          isClearable
          placeholder='Select chair judge'
          className='w-full'
          styles={selectStyles}
        />
      </td>
    </>
  );
}
