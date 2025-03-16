'use client';

import { useState } from 'react';
import { Team, Judge, TeamRole, Room } from '@/types/debate';
import RoomTable from './RoomTable';

export default function Page() {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: '1',
      name: 'Team Alpha',
      role: TeamRole.OpeningGovernment,
      speakers: [
        { id: '1a', name: 'Speaker A1' },
        { id: '1b', name: 'Speaker A2' },
      ],
    },
    {
      id: '2',
      name: 'Team Beta',
      role: TeamRole.OpeningOpposition,
      speakers: [
        { id: '2a', name: 'Speaker B1' },
        { id: '2b', name: 'Speaker B2' },
      ],
    },
    {
      id: '3',
      name: 'Team Gamma',
      role: TeamRole.ClosingGovernment,
      speakers: [
        { id: '3a', name: 'Speaker C1' },
        { id: '3b', name: 'Speaker C2' },
      ],
    },
    {
      id: '4',
      name: 'Team Delta',
      role: TeamRole.ClosingOpposition,
      speakers: [
        { id: '4a', name: 'Speaker D1' },
        { id: '4b', name: 'Speaker D2' },
      ],
    },
  ]);
  const [judges, setJudges] = useState<Judge[]>([
    { id: '1', name: 'Judge A' },
    { id: '2', name: 'Judge B' },
    { id: '3', name: 'Judge C' },
    { id: '4', name: 'Judge D' },
    { id: '5', name: 'Judge E' },
    { id: '6', name: 'Judge F' },
    { id: '7', name: 'Judge G' },
    { id: '8', name: 'Judge H' },
  ]);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Replace with your actual API endpoints
  //       const teamsResponse = await fetch('/api/teams');
  //       const judgesResponse = await fetch('/api/judges');

  //       if (!teamsResponse.ok || !judgesResponse.ok) {
  //         throw new Error('Failed to fetch data');
  //       }

  //       const teamsData = await teamsResponse.json();
  //       const judgesData = await judgesResponse.json();

  //       setTeams(teamsData);
  //       setJudges(judgesData);
  //     } catch (err) {
  //       setError('Error fetching data. Please try again later.');
  //       console.error(err);

  //       // Temporarily use mock data for development
  //       setTeams([
  //         {
  //           id: '1',
  //           name: 'Team Alpha',
  //           role: TeamRole.OpeningGovernment,
  //           speakers: [
  //             { id: '1a', name: 'Speaker A1' },
  //             { id: '1b', name: 'Speaker A2' },
  //           ],
  //         },
  //         {
  //           id: '2',
  //           name: 'Team Beta',
  //           role: TeamRole.OpeningOpposition,
  //           speakers: [
  //             { id: '2a', name: 'Speaker B1' },
  //             { id: '2b', name: 'Speaker B2' },
  //           ],
  //         },
  //         {
  //           id: '3',
  //           name: 'Team Gamma',
  //           role: TeamRole.ClosingGovernment,
  //           speakers: [
  //             { id: '3a', name: 'Speaker C1' },
  //             { id: '3b', name: 'Speaker C2' },
  //           ],
  //         },
  //         {
  //           id: '4',
  //           name: 'Team Delta',
  //           role: TeamRole.ClosingOpposition,
  //           speakers: [
  //             { id: '4a', name: 'Speaker D1' },
  //             { id: '4b', name: 'Speaker D2' },
  //           ],
  //         },
  //         // Add more mock teams as needed
  //       ]);

  //       setJudges([
  //         { id: '1', name: 'Judge A' },
  //         { id: '2', name: 'Judge B' },
  //         { id: '3', name: 'Judge C' },
  //         { id: '4', name: 'Judge D' },
  //         { id: '5', name: 'Judge E' },
  //         { id: '6', name: 'Judge F' },
  //         { id: '7', name: 'Judge G' },
  //         { id: '8', name: 'Judge H' },
  //       ]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const handleSaveRooms = async (rooms: Room[]) => {
    try {
      // Validate room setup before saving
      const incompleteRooms = rooms.filter(
        room =>
          !room.ogTeamId ||
          !room.ooTeamId ||
          !room.cgTeamId ||
          !room.coTeamId ||
          !room.chairJudgeId,
      );

      if (incompleteRooms.length > 0) {
        if (
          !confirm(
            `${incompleteRooms.length} room(s) have incomplete assignments. Continue anyway?`,
          )
        ) {
          return;
        }
      }

      // Update team roles based on their positions in rooms
      const updatedTeams = [...teams];

      rooms.forEach(room => {
        if (room.ogTeamId) {
          const teamIndex = updatedTeams.findIndex(t => t.id === room.ogTeamId);
          if (teamIndex >= 0) {
            updatedTeams[teamIndex] = {
              ...updatedTeams[teamIndex],
              role: TeamRole.OpeningGovernment,
            };
          }
        }

        if (room.ooTeamId) {
          const teamIndex = updatedTeams.findIndex(t => t.id === room.ooTeamId);
          if (teamIndex >= 0) {
            updatedTeams[teamIndex] = {
              ...updatedTeams[teamIndex],
              role: TeamRole.OpeningOpposition,
            };
          }
        }

        if (room.cgTeamId) {
          const teamIndex = updatedTeams.findIndex(t => t.id === room.cgTeamId);
          if (teamIndex >= 0) {
            updatedTeams[teamIndex] = {
              ...updatedTeams[teamIndex],
              role: TeamRole.ClosingGovernment,
            };
          }
        }

        if (room.coTeamId) {
          const teamIndex = updatedTeams.findIndex(t => t.id === room.coTeamId);
          if (teamIndex >= 0) {
            updatedTeams[teamIndex] = {
              ...updatedTeams[teamIndex],
              role: TeamRole.ClosingOpposition,
            };
          }
        }
      });

      setTeams(updatedTeams);

      // Replace with your actual API endpoint
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rooms),
      });

      if (!response.ok) {
        throw new Error('Failed to save rooms');
      }

      alert('Rooms saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Error saving rooms. Please try again.');
    }
  };

  if (error) {
    return <div className='p-4 text-red-500'>{error}</div>;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
      <div className='container max-w-full mx-auto px-4 py-8'>
        <header className='max-w-7xl mx-auto mb-8'>
          <h1 className='text-3xl md:text-4xl font-bold text-slate-800 mb-2'>
            Round Management
          </h1>
          <p className='text-slate-600'>
            Organize teams and judges into debate rooms
          </p>
        </header>

        <div className='bg-white rounded-xl shadow-md overflow-hidden'>
          <RoomTable teams={teams} judges={judges} onSave={handleSaveRooms} />
        </div>
      </div>
    </div>
  );
}
