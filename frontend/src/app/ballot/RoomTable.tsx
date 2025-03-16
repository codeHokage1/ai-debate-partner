'use client';

import { useState } from 'react';
import { Team, Judge, Room } from '@/types/debate';
import RoomRow from './RoomRow';
import {
  FaPlus,
  FaTimes,
  FaCheck,
  FaExclamationTriangle,
} from 'react-icons/fa';

interface RoomTableProps {
  teams: Team[];
  judges: Judge[];
  initialRooms?: Room[];
  onSave: (rooms: Room[]) => void;
}

export default function RoomTable({
  teams,
  judges,
  initialRooms,
  onSave,
}: RoomTableProps) {
  const [rooms, setRooms] = useState<Room[]>(
    initialRooms || [
      { id: '1', name: 'Room 1' },
      { id: '2', name: 'Room 2' },
      { id: '3', name: 'Room 3' },
    ],
  );
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string[];
  }>({});

  const getAssignedTeams = (): Set<string> => {
    const assignedTeams = new Set<string>();

    rooms.forEach(room => {
      if (room.ogTeamId) assignedTeams.add(room.ogTeamId);
      if (room.ooTeamId) assignedTeams.add(room.ooTeamId);
      if (room.cgTeamId) assignedTeams.add(room.cgTeamId);
      if (room.coTeamId) assignedTeams.add(room.coTeamId);
    });

    return assignedTeams;
  };

  const getAssignedJudges = (): Set<string> => {
    const assignedJudges = new Set<string>();

    rooms.forEach(room => {
      if (room.chairJudgeId) assignedJudges.add(room.chairJudgeId);
      if (room.panelJudgeIds) {
        room.panelJudgeIds.forEach(judgeId => assignedJudges.add(judgeId));
      }
    });

    return assignedJudges;
  };

  const validateAssignments = (): boolean => {
    const errors: { [key: string]: string[] } = {};

    // Check for duplicate team assignments
    const teamCounts: { [key: string]: { count: number; rooms: string[] } } =
      {};

    rooms.forEach(room => {
      [room.ogTeamId, room.ooTeamId, room.cgTeamId, room.coTeamId].forEach(
        teamId => {
          if (teamId) {
            if (!teamCounts[teamId]) {
              teamCounts[teamId] = { count: 0, rooms: [] };
            }
            teamCounts[teamId].count++;
            teamCounts[teamId].rooms.push(room.name);
          }
        },
      );
    });

    Object.entries(teamCounts).forEach(([teamId, info]) => {
      if (info.count > 1) {
        const team = teams.find(t => t.id === teamId);
        if (team) {
          const errorMsg = `Team "${
            team.name
          }" is assigned to multiple rooms: ${info.rooms.join(', ')}`;
          if (!errors['teams']) errors['teams'] = [];
          errors['teams'].push(errorMsg);
        }
      }
    });

    // Check for duplicate chair assignments
    const chairCounts: { [key: string]: { count: number; rooms: string[] } } =
      {};

    rooms.forEach(room => {
      if (room.chairJudgeId) {
        if (!chairCounts[room.chairJudgeId]) {
          chairCounts[room.chairJudgeId] = { count: 0, rooms: [] };
        }
        chairCounts[room.chairJudgeId].count++;
        chairCounts[room.chairJudgeId].rooms.push(room.name);
      }
    });

    Object.entries(chairCounts).forEach(([judgeId, info]) => {
      if (info.count > 1) {
        const judge = judges.find(j => j.id === judgeId);
        if (judge) {
          const errorMsg = `Judge "${
            judge.name
          }" is assigned as chair in multiple rooms: ${info.rooms.join(', ')}`;
          if (!errors['judges']) errors['judges'] = [];
          errors['judges'].push(errorMsg);
        }
      }
    });

    // Check for panel judges also assigned as chairs
    rooms.forEach(room => {
      if (room.panelJudgeIds && room.chairJudgeId) {
        if (room.panelJudgeIds.includes(room.chairJudgeId)) {
          const judge = judges.find(j => j.id === room.chairJudgeId);
          if (judge) {
            const errorMsg = `Judge "${judge.name}" is assigned as both chair and panel member in room "${room.name}"`;
            if (!errors['judges']) errors['judges'] = [];
            errors['judges'].push(errorMsg);
          }
        }
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRoomUpdate = (updatedRoom: Room) => {
    setRooms(prevRooms =>
      prevRooms.map(room => (room.id === updatedRoom.id ? updatedRoom : room)),
    );
    // Clear validation errors when user makes changes
    setValidationErrors({});
  };

  const addRoom = () => {
    const newRoomId = (
      Math.max(0, ...rooms.map(r => parseInt(r.id))) + 1
    ).toString();
    setRooms([...rooms, { id: newRoomId, name: `Room ${newRoomId}` }]);
  };

  const removeRoom = (roomId: string) => {
    setRooms(rooms.filter(room => room.id !== roomId));
  };

  const handleSave = () => {
    // Validate assignments before saving
    if (!validateAssignments()) {
      // Don't proceed if there are validation errors
      return;
    }

    // Proceed with saving
    onSave(rooms);
  };

  const assignedTeams = getAssignedTeams();
  const assignedJudges = getAssignedJudges();

  return (
    <div className='p-6'>
      <h2 className='text-xl md:text-2xl font-bold text-slate-800 mb-6'>
        Room Assignments
      </h2>

      {/* Display validation errors if any */}
      {Object.keys(validationErrors).length > 0 && (
        <div className='mb-6 bg-red-50 border border-red-200 rounded-lg p-4'>
          <div className='flex items-center text-red-700 mb-2'>
            <FaExclamationTriangle className='h-5 w-5 mr-2' />
            <h3 className='font-semibold'>Please fix the following issues:</h3>
          </div>
          <ul className='list-disc pl-8 text-red-600'>
            {Object.values(validationErrors)
              .flat()
              .map((error, index) => (
                <li key={index} className='mb-1'>
                  {error}
                </li>
              ))}
          </ul>
        </div>
      )}

      <div className='overflow-x-auto mb-6 scrollbar-custom'>
        <table className='border-collapse' style={{ minWidth: '1400px' }}>
          <thead>
            <tr className='bg-slate-100'>
              <th
                className='px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider'
                style={{ width: '180px' }}>
                Room
              </th>
              <th
                className='px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider'
                style={{ width: '280px' }}>
                OG
              </th>
              <th
                className='px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider'
                style={{ width: '280px' }}>
                OO
              </th>
              <th
                className='px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider'
                style={{ width: '280px' }}>
                CG
              </th>
              <th
                className='px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider'
                style={{ width: '280px' }}>
                CO
              </th>
              <th
                className='px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider'
                style={{ width: '400px' }}>
                Panel
              </th>
              <th
                className='px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider'
                style={{ width: '280px' }}>
                Chair
              </th>
              <th
                className='px-4 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider'
                style={{ width: '100px' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-slate-200'>
            {rooms.map((room, index) => (
              <tr
                key={room.id}
                className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <RoomRow
                  room={room}
                  allTeams={teams}
                  allJudges={judges}
                  onRoomUpdate={handleRoomUpdate}
                  assignedTeams={assignedTeams}
                  assignedJudges={assignedJudges}
                  index={index}
                />
                <td className='px-4 py-2'>
                  <button
                    onClick={() => removeRoom(room.id)}
                    className='group flex items-center justify-center p-2 rounded-full text-red-500 hover:text-white hover:bg-red-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1'
                    aria-label='Remove room'
                    title='Remove room'>
                    <FaTimes className='h-5 w-5' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='flex flex-col sm:flex-row gap-4 justify-between border-t pt-6'>
        <button
          onClick={addRoom}
          className='flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-medium py-2 px-4 rounded-lg transition-colors duration-200'>
          <FaPlus className='h-4 w-4' />
          <span>Add Room</span>
        </button>

        <button
          onClick={handleSave}
          className={`flex items-center justify-center gap-2 ${
            Object.keys(validationErrors).length > 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-700'
          } text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 shadow-sm`}>
          <FaCheck className='h-4 w-4' />
          <span>Save Assignments</span>
        </button>
      </div>
    </div>
  );
}
