export interface PersonalInfo {
  firstname: string,
  lastname: string,
  dateOfBirth: Date,
  phone: string,
  email: string,
  gender: string,
  height: string,
  weight: string,
}

export interface UserData {
  id: number;
  personalInfo: PersonalInfo;
  active: boolean;
  role: string;
  firstLogin: boolean;
}

export interface MenteeData {
  email: string;
  firstname: string;
  lastname: string;
  dateOfBirth: Date;
  phone: string;
  gender: string;
  height: number;
}
