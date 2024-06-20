import {Muscle} from "../muscles/muscles.data";

export interface ExerciseProjection {
  id: number;
  name: string;
  description: string;
  url: string;
  muscleInvolved: Muscle;
  version: number;
}
