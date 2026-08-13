export type TrafficState = 'NORMAL' | 'MODERATE' | 'HEAVY' | 'SEVERE' | 'EMERGENCY' | 'INCIDENT';

export type UserRole = 'CITIZEN' | 'TRAFFIC_AUTHORITY' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  badgeNumber?: string;
  department?: string;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Intersection {
  id: string;
  name: string;
  location: LatLng;
  status: TrafficState;
  vehicleCount: number;
  averageSpeed: number; // km/h
  queueLength: number;  // meters
  laneOccupancy: number; // percentage 0-100
  signalId?: string;
  currentCycle?: number; // seconds
  greenTime?: number;
  lastUpdated: string;
}

export interface Incident {
  id: string;
  title: string;
  type: 'ACCIDENT' | 'CONSTRUCTION' | 'ROAD_CLOSURE' | 'WEATHER' | 'HAZARD' | 'OTHER';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'REPORTED' | 'VERIFIED' | 'DISPATCHED' | 'RESOLVED';
  location: LatLng;
  address: string;
  description: string;
  imageUrl?: string;
  reportedAt: string;
  verifiedAt?: string;
  assignedOfficer?: string;
}

export interface EmergencyVehicle {
  id: string;
  code: string;
  type: 'AMBULANCE' | 'FIRE_TRUCK' | 'POLICE';
  status: 'IDLE' | 'EN_ROUTE' | 'ON_SCENE';
  currentLocation: LatLng;
  destination: LatLng;
  destinationName: string;
  etaNormal: number; // minutes
  etaOptimized: number; // minutes
  timeSaved: number; // minutes
  speed: number; // km/h
  activeGreenCorridor: boolean;
  upcomingSignals: { signalId: string; name: string; status: 'PREPARING' | 'GREEN' | 'PASSED' }[];
}

export interface TrafficSignal {
  id: string;
  name: string;
  location: LatLng;
  mode: 'FIXED' | 'ADAPTIVE_AI' | 'MANUAL_OVERRIDE';
  currentPhase: 'NORTH_SOUTH_GREEN' | 'EAST_WEST_GREEN' | 'ALL_RED';
  phaseRemaining: number; // seconds
  cycleLength: number; // seconds
  northSouthGreen: number;
  eastWestGreen: number;
  recommendedNorthSouthGreen?: number;
  recommendedEastWestGreen?: number;
  aiRecommendationId?: string;
}

export interface AIRecommendation {
  id: string;
  signalId: string;
  intersectionName: string;
  currentNorthSouthGreen: number;
  recommendedNorthSouthGreen: number;
  currentEastWestGreen: number;
  recommendedEastWestGreen: number;
  estimatedDelayReduction: number; // percentage
  confidence: number; // 0 - 1.0
  reasoning: string[];
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface TrafficPrediction {
  id: string;
  intersectionId: string;
  intersectionName: string;
  horizonMinutes: 15 | 30 | 60;
  predictedState: TrafficState;
  predictedVehicleCount: number;
  confidenceScore: number;
  contributingFactors: string[];
  generatedAt: string;
}

export interface PlannedRoute {
  id: string;
  name: string;
  isRecommended: boolean;
  distanceKm: number;
  etaMinutes: number;
  delayMinutes: number;
  overallState: TrafficState;
  geometry: LatLng[];
  recommendationReason?: string;
  incidentsOnRoute: number;
}

export interface AssistantQueryResponse {
  query: string;
  answer: string;
  factors: string[];
  timestamp: string;
  sources: string[];
}

export interface CitizenReportPayload {
  type: string;
  location: LatLng;
  address: string;
  description: string;
  image?: File;
}

export interface APIErrorResponse {
  message: string;
  code: string;
  errors?: Record<string, string[]>;
}
