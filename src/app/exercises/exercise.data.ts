import {Muscle, MuscleGroup} from "./muscles/muscles.data";

export interface ExerciseListItemProjection {
  id: number;
  name: string;
  muscleInvolved: string;
}

export interface ExerciseSearchCriteria {
  name?: string;
  muscle?: Muscle;
  muscleGroup?: MuscleGroup;
  page?: number;
  pageSize?: number;
  sort?: string;
}

export interface ExerciseCreateData {
  name: string;
  description: string;
  url: string;
  muscleInvolved: Muscle;
}

export interface ExerciseEditData extends ExerciseCreateData {
  id: number;
}




