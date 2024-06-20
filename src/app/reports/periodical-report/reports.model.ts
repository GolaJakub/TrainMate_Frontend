export interface StorageId {
  value: string;
}

export interface FileStorageDto {
  storageId?: StorageId;
  content: string;
  name: string;
  type: string;
  size: number;
}

export interface PeriodicalReportCreateDto {
  workoutPlanId?: number;
  weight: number;
  bodyFat: number;
  leftBiceps: number;
  rightBiceps: number;
  leftForearm: number
  rightForearm: number;
  leftThigh: number
  rightThigh: number
  leftCalf: number
  rightCalf: number;
  shoulders: number;
  chest: number
  waist: number
  abdomen: number
  hips: number;
  images?: FileStorageDto[]
}

export interface PeriodicalReportProjection {
  id: number;
  version: number;
  initial: boolean;
  reviewed: boolean;
  weight: number;
  bodyFat: number;
  leftBiceps: number;
  rightBiceps: number;
  leftForearm: number;
  rightForearm: number;
  leftThigh: number;
  rightThigh: number;
  leftCalf: number;
  rightCalf: number;
  shoulders: number;
  chest: number;
  waist: number;
  abdomen: number;
  hips: number;
  createdDate: string;
}
