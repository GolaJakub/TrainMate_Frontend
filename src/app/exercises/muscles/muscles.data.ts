export enum Muscle {
  BICEPS = 'BICEPS',
  TRICEPS = 'TRICEPS',
  FOREARM = 'FOREARM',
  FRONTAL_DELTOID = 'FRONTAL_DELTOID',
  MIDDLE_DELTOID = 'MIDDLE_DELTOID',
  REAR_DELTOID = 'REAR_DELTOID',
  UPPER_CHEST = 'UPPER_CHEST',
  MIDDLE_CHEST = 'MIDDLE_CHEST',
  LOWER_CHEST = 'LOWER_CHEST',
  LATS = 'LATS',
  RHOMBOID = 'RHOMBOID',
  DELTOID = 'DELTOID',
  TRAPEZIUS = 'TRAPEZIUS',
  LOWER_BACK = 'LOWER_BACK',
  HAMSTRINGS = 'HAMSTRINGS',
  GLUTES = 'GLUTES',
  CALVES = 'CALVES',
  QUADS = 'QUADS',
  OBLIQUE = 'OBLIQUE',
  ABS = 'ABS'
}

export enum MuscleGroup {
  ARMS = 'ARMS',
  SHOULDERS = 'SHOULDERS',
  CHEST = 'CHEST',
  BACK = 'BACK',
  LEGS = 'LEGS',
  STOMACH = 'STOMACH'
}

export const muscleGroupsValues: MuscleGroup[] = Object.values(MuscleGroup);

export const muscleToMuscleGroupMap: Map<Muscle, MuscleGroup> = new Map([
  [Muscle.BICEPS, MuscleGroup.ARMS],
  [Muscle.TRICEPS, MuscleGroup.ARMS],
  [Muscle.FOREARM, MuscleGroup.ARMS],
  [Muscle.FRONTAL_DELTOID, MuscleGroup.SHOULDERS],
  [Muscle.MIDDLE_DELTOID, MuscleGroup.SHOULDERS],
  [Muscle.REAR_DELTOID, MuscleGroup.SHOULDERS],
  [Muscle.UPPER_CHEST, MuscleGroup.CHEST],
  [Muscle.MIDDLE_CHEST, MuscleGroup.CHEST],
  [Muscle.LOWER_CHEST, MuscleGroup.CHEST],
  [Muscle.LATS, MuscleGroup.BACK],
  [Muscle.RHOMBOID, MuscleGroup.BACK],
  [Muscle.DELTOID, MuscleGroup.BACK],
  [Muscle.TRAPEZIUS, MuscleGroup.BACK],
  [Muscle.LOWER_BACK, MuscleGroup.BACK],
  [Muscle.HAMSTRINGS, MuscleGroup.LEGS],
  [Muscle.GLUTES, MuscleGroup.LEGS],
  [Muscle.CALVES, MuscleGroup.LEGS],
  [Muscle.QUADS, MuscleGroup.LEGS],
  [Muscle.OBLIQUE, MuscleGroup.STOMACH],
  [Muscle.ABS, MuscleGroup.STOMACH]
]);

