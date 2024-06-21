export interface UserId {
  keycloakId: string;
}

export interface MenteeProjection {
  firstname: string;
  lastname: string;
  dateOfBirth: Date;
  phone: string;
  email: string;
  gender: string;
  height: number;
  userId: { keycloakId: string };
  firstLogin: boolean;
  active: boolean;
}

export interface WorkoutPlan {
  id: number;
  name: string;
  dateRange: {
    from: string;
    to: string;
  };
  report: {
    id: number | null;
    reviewed: boolean | null;
  };
  version: number
}

export class MenteeSearchCriteria {
  firstname: string | null = null;
  lastname: string | null = null;
  email: string | null = null;
  gender: string | null = null;
  page: number = 0;
  pageSize: number = 5;
  sort: string = 'lastname,asc';
}

export interface WorkoutPlanUpdateDto {
  id: number;
  version: number;
  name: string;
  category: string;
  startDate: Date;
  durationInWeeks: number;
}

