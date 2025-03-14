// @/types/debate.ts

export interface Speaker {
  id?: string;
  name: string;
}

export interface Speech {
  speakerId: string;
  teamId: string;
  position: DebatePosition;
  recordingUrl?: string;
  notes?: string;
  audioBlob: Blob;
}

export enum TeamRole {
  OpeningGovernment = 'Opening Government',
  OpeningOpposition = 'Opening Opposition',
  ClosingGovernment = 'Closing Government',
  ClosingOpposition = 'Closing Opposition',
}

export enum DebatePosition {
  // Opening Government
  PrimeMinister = 'Prime Minister',
  DeputyPrimeMinister = 'Deputy Prime Minister',

  // Opening Opposition
  LeaderOfOpposition = 'Leader of Opposition',
  DeputyLeaderOfOpposition = 'Deputy Leader of Opposition',

  // Closing Government
  MemberOfGovernment = 'Member of Government',
  GovernmentWhip = 'Government Whip',

  // Closing Opposition
  MemberOfOpposition = 'Member of Opposition',
  OppositionWhip = 'Opposition Whip',
}

export interface Team {
  id: string;
  name: string;
  role: TeamRole;
  speakers: Speaker[];

  // Speaker positions
  pm?: Speaker; // Prime Minister (Opening Government)
  dpm?: Speaker; // Deputy Prime Minister (Opening Government)
  lo?: Speaker; // Leader of Opposition (Opening Opposition)
  dlo?: Speaker; // Deputy Leader of Opposition (Opening Opposition)
  mg?: Speaker; // Member of Government (Closing Government)
  gw?: Speaker; // Government Whip (Closing Government)
  mo?: Speaker; // Member of Opposition (Closing Opposition)
  ow?: Speaker; // Opposition Whip (Closing Opposition)
}

export interface DebateSession {
  roundId: string;
  topic: string;
  teams: Team[];
  speeches: Speech[];
  oralAdjudication: OralAdjudication;
}

export interface Judge {
  id: string;
  name: string;
}

export interface Round {
  id: string;
  name: string;
  location: string;
  judges: Judge[];
  teams: Team[];
}

export interface OralAdjudication {
  judgeId: string;
  roundId: string;
  recordingUrl: string;
  notes?: string;
  audioBlob: Blob;
}
