'use client';

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Round, Judge, OralAdjudication } from '@/types/debate';

// Dynamically import react-media-recorder to ensure it only runs on the client side
const ReactMediaRecorder = dynamic(
  () => import('react-media-recorder').then(mod => mod.ReactMediaRecorder),
  { ssr: false },
);

interface OralAdjudicationRecorderProps {
  round: Round;
  judge: Judge;
  onAdjudicationComplete: (adjudication: OralAdjudication) => void;
}

const OralAdjudicationRecorder: React.FC<OralAdjudicationRecorderProps> = ({
  round,
  judge,
  onAdjudicationComplete,
}) => {
  const [time, setTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<string | null>(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleStopRecording = async (stopRecording: () => void) => {
    stopRecording();
    stopTimer();
    setTime(0);
  };

  const resetRecordingHandler = () => {
    stopTimer();
    setTime(0);
    startTimeRef.current = null;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className='flex flex-col space-y-2 p-3 border rounded-md bg-yellow-50'>
      <div className='flex items-center justify-between'>
        <div className='font-medium'>Judge: {judge.name}</div>
        <div className='text-sm text-gray-500'>Oral Adjudication</div>
      </div>

      <div className='text-2xl font-bold text-center'>{formatTime(time)}</div>

      <ReactMediaRecorder
        audio
        onStop={async (blobUrl, blob) => {
          stopTimer();

          if (blobUrl) {
            try {
              // Create the adjudication object with the audio blob
              const adjudication: OralAdjudication = {
                recordingUrl: blobUrl,
                roundId: round.id,
                judgeId: judge.id,
                audioBlob: blob,
              };

              onAdjudicationComplete(adjudication);
            } catch (error) {
              console.error('Error processing audio blob:', error);
            }
          }
        }}
        render={({
          startRecording,
          stopRecording,
          pauseRecording,
          resumeRecording,
          mediaBlobUrl,
          status,
        }) => (
          <>
            <div className='flex space-x-2 justify-center'>
              {status !== 'recording' ? (
                <button
                  onClick={() => {
                    startRecording();
                    startTimeRef.current = new Date().toISOString();
                    setTime(0);
                    startTimer();
                  }}
                  className='px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700'>
                  Start
                </button>
              ) : (
                <button
                  onClick={() => {
                    pauseRecording();
                    stopTimer();
                  }}
                  className='px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700'>
                  Pause
                </button>
              )}

              {status === 'paused' && (
                <button
                  onClick={() => {
                    resumeRecording();
                    startTimer();
                  }}
                  className='px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700'>
                  Resume
                </button>
              )}

              {status === 'recording' && (
                <button
                  onClick={() => {
                    handleStopRecording(stopRecording);
                  }}
                  className='px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700'>
                  Stop
                </button>
              )}

              <button
                onClick={resetRecordingHandler}
                className='px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700'
                disabled={status === 'recording' || time === 0}>
                Reset
              </button>
            </div>

            {mediaBlobUrl && (
              <div className='mt-2'>
                <audio controls src={mediaBlobUrl} className='w-full' />
              </div>
            )}
          </>
        )}
      />
    </div>
  );
};

export default OralAdjudicationRecorder;
