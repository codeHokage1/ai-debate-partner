'use client';

import React, { useState } from 'react';
import {
  Team,
  Round,
  Speech,
  TeamRole,
  DebateSession,
  OralAdjudication,
} from '@/types/debate';
import DebateRecorder from './DebateRecorder';
import JudgesManager from './JudgesManager';

interface DebateManagerProps {
  initialSession?: DebateSession;
  round: Round;
  teams: Team[];
}

const DebateManager: React.FC<DebateManagerProps> = ({
  initialSession,
  round,
  teams: initialTeams,
}) => {
  const [session, setSession] = useState<DebateSession>(() => {
    if (initialSession) return initialSession;

    // Create default empty session
    return {
      roundId: round.id,
      topic: '',
      date: new Date().toISOString().split('T')[0],
      teams: mapTeamsToRoles(initialTeams || []),
      speeches: [],
      oralAdjudication: {} as OralAdjudication,
    };
  });

  // Map the pre-populated teams to proper TeamRole enum values
  function mapTeamsToRoles(teams: Team[]): Team[] {
    return teams.map(team => {
      let role: TeamRole;

      switch (team.id) {
        case 'og':
          role = TeamRole.OpeningGovernment;
          break;
        case 'oo':
          role = TeamRole.OpeningOpposition;
          break;
        case 'cg':
          role = TeamRole.ClosingGovernment;
          break;
        case 'co':
          role = TeamRole.ClosingOpposition;
          break;
        default:
          role = TeamRole.OpeningGovernment;
      }

      return {
        ...team,
        role,
      };
    });
  }

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleTeamUpdate = (updatedTeam: Team) => {
    setSession(prevSession => ({
      ...prevSession,
      teams: prevSession.teams.map(team =>
        team.id === updatedTeam.id ? updatedTeam : team,
      ),
    }));
  };

  const handleSpeechComplete = (speech: Speech) => {
    setSession(prevSession => ({
      ...prevSession,
      speeches: [...prevSession.speeches, speech],
    }));
  };

  const handleOralAdjudicationComplete = (adjudication: OralAdjudication) => {
    setSession(prevSession => ({
      ...prevSession,
      oralAdjudication: adjudication,
    }));
  };

  const saveDebateSession = async () => {
    // Ensure all speeches and oral adjudication are recorded
    const allSpeechesRecorded = session.teams.every(
      team =>
        team.speakers.length ===
        session.speeches.filter(speech => speech.teamId === team.id).length,
    );
    const oaRecorded = session.oralAdjudication !== null;

    if (!allSpeechesRecorded || !oaRecorded) {
      setError(
        'Please ensure all speeches and the oral adjudication are recorded before saving.',
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Create a FormData object to include audio blobs
    const formData = new FormData();
    formData.append('session', JSON.stringify(session));

    // Append each speech's audioBlob to the FormData
    session.speeches.forEach((speech, index) => {
      if (speech.audioBlob) {
        formData.append(`audio_${index}`, speech.audioBlob);
      }
    });

    // Append the oral adjudication's recordingBlob to the FormData
    if (session.oralAdjudication?.audioBlob) {
      formData.append('oa_audio', session.oralAdjudication.audioBlob);
    }

    console.log(session);
    setIsLoading(false);

    // try {
    //   const response = await fetch('/api/debates/save', {
    //     method: 'POST',
    //     body: formData,
    //   });

    //   if (!response.ok) {
    //     throw new Error('Failed to save debate session');
    //   }

    //   const data = await response.json();
    //   setSuccessMessage('Debate session saved successfully!');

    //   // Update the session with any changes from the server (like IDs)
    //   if (data.session) {
    //     setSession(data.session);
    //   }
    // } catch (err) {
    //   setError(err instanceof Error ? err.message : 'An error occurred');
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <div className='max-w-6xl mx-auto p-4'>
      <div>
        <h3 className='text-2xl font-semibold mb-4 text-center'>
          <span>{round.name}</span> - <span>{round.location}</span>
        </h3>
      </div>
      {/* Teams Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {session.teams.map(team => (
          <div key={team.id} className='bg-gray-50 p-4 rounded-lg'>
            <h2 className='text-xl font-semibold mb-2'>{team.role}</h2>
            {/* Only show the DebateRecorder if there are speakers */}
            {team.speakers.length > 0 && (
              <DebateRecorder
                team={team}
                onTeamUpdate={handleTeamUpdate}
                onSpeechComplete={handleSpeechComplete}
              />
            )}
          </div>
        ))}
      </div>

      <JudgesManager
        round={round}
        judges={round.judges}
        onOralAdjudicationComplete={handleOralAdjudicationComplete}
      />

      {/* Action Buttons */}
      <div className='mt-8 flex justify-end space-x-4'>
        <button
          type='button'
          onClick={saveDebateSession}
          className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 cursror-pointer'>
          {isLoading ? 'Saving...' : 'Save Debate Session'}
        </button>
      </div>

      {/* Status Messages */}
      {error && (
        <div className='mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md'>
          {error}
        </div>
      )}

      {successMessage && (
        <div className='mt-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-md'>
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default DebateManager;
