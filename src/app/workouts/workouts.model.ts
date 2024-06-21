export interface ExerciseItemProjection {
  id: number;
  exerciseId: number;
  repetitions: number;
  tempo: string;
  weight: number;
  rir: number;
  sets: number;
  muscleInvolved: string;
  name: string;
  description: string;
  url: string;
  reported: boolean;
  trainingUnitId: number;
  version: number;
}

export interface TrainingUnitProjection {
  id: number;
  version: number;
  dayOfWeek: string;
  weekNumber: number;
  exercises: ExerciseItemProjection[];
}

export interface SetParams {
  reportedRepetitions: number;
  reportedWeight: number;
  reportedRir: number;
  set: number;
}

export interface ReportCreateDto {
  exerciseItemId: number;
  sets: SetParams[];
  remarks: string;
  version: number;
}

export interface ExerciseReport {
  exerciseItemId: number;
  reportedSets: SetParams[];
  remarks: string;
  version: number;
}

export interface WorkoutPlanCreateDto {
  name: string;
  userId: string;
  category: string;
  startDate: Date
  durationInWeeks: number;
}

export interface WorkoutPlanProjection {
  id: number;
  version: number;
  name: string;
  category: string;
  dateRange: {
    from: string;
    to: string;
  };
  duration: number;
}

export interface ExerciseItemCreateDto {
  exerciseId: number;
  repetitions: number;
  tempo: string;
  weight: number;
  rir: number;
  sets: number;
}

export interface TrainingUnitUpdateDto {
  id: number;
  version: number;
  dayOfWeek: string;
  weekNumber: number;
  exerciseCreateDto: ExerciseItemCreateDto;
}

export interface TrainingUnitDto {
  workoutPlanId: number;
  dayOfWeek: string;
  weekNumber: number;
  exerciseCreateDto: ExerciseItemCreateDto;
}

export interface ExerciseItemUpdateDto {
  id: number;
  version: number;
  trainingUnitId: number;
  exerciseId: number;
  repetitions: number;
  tempo: string;
  weight: number;
  rir: number;
  sets: number;
}
