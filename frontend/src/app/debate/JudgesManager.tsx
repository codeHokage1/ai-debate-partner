'use client';

import React, { useState } from 'react';
import { Round, Judge, OralAdjudication } from '@/types/debate';
import OralAdjudicationRecorder from './OralAdjudicationRecorder';

interface JudgesManagerProps {
  round: Round;
  judges: Judge[];
  onOralAdjudicationComplete: (adjudication: OralAdjudication) => void;
}

const JudgesManager: React.FC<JudgesManagerProps> = ({
  round,
  judges,
  onOralAdjudicationComplete,
}) => {
  const [selectedJudge, setSelectedJudge] = useState<Judge | null>(null);

  return (
    <div className='mb-6 p-4 bg-white rounded-lg shadow-md'>
      <h2 className='text-xl font-bold mb-4'>Judges Panel</h2>

      <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Select Judge for Oral Adjudication
        </label>
        <div className='flex space-x-2'>
          <select
            value={selectedJudge?.id || ''}
            onChange={e => {
              const judge = judges.find(j => j.id === e.target.value);
              setSelectedJudge(judge || null);
            }}
            className='flex-grow p-2 border border-gray-300 rounded-md'>
            <option value=''>Select a Judge</option>
            {judges.map(judge => (
              <option key={judge.id} value={judge.id}>
                {judge.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedJudge && (
        <OralAdjudicationRecorder
          round={round}
          judge={selectedJudge}
          onAdjudicationComplete={onOralAdjudicationComplete}
        />
      )}
    </div>
  );
};

export default JudgesManager;
