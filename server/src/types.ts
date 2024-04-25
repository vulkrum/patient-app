export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
}

export enum EntryType {
  HealthCheck = "HealthCheck",
  OccupationalHealthcare = "OccupationalHealthcare",
  Hospital = "Hospital",
}

export type Diagnosis = {
  code: string;
  name: string;
  latin?: string;
};

export type Patient = {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[];
};

type BaseEntry = {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis["code"]>;
};

type HealthCheckEntry = BaseEntry & {
  type: EntryType.HealthCheck;
  healthCheckRating: HealthCheckRating;
};

export type SickLeave = {
  startDate: string;
  endDate: string;
};

type OccupationalHealthcareEntry = BaseEntry & {
  type: EntryType.OccupationalHealthcare;
  employerName: string;
  sickLeave?: SickLeave;
};

export type Discharge = {
  date: string;
  criteria: string;
};

type HospitalEntry = BaseEntry & {
  type: EntryType.Hospital;
  discharge: Discharge;
};

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

type UnionOmit<T, K extends string | number | symbol> = T extends unknown
  ? Omit<T, K>
  : never;
export type NonSensitivePatient = Omit<Patient, "ssn" | "entries">;
export type NewPatient = Omit<Patient, "id">;
export type NewEntry = UnionOmit<Entry, "id">;
export type NewBaseEntry = Omit<BaseEntry, "id">;
