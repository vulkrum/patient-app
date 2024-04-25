export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
}

export type Diagnosis = {
  code: string;
  name: string;
  latin?: string;
};

export enum EntryType {
  HealthCheck = "HealthCheck",
  OccupationalHealthcare = "OccupationalHealthcare",
  Hospital = "Hospital",
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

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

type OccupationalHealthcareEntry = BaseEntry & {
  type: EntryType.OccupationalHealthcare;
  employerName: string;
  sickLeave?: SickLeave;
};

type HospitalEntry = BaseEntry & {
  type: EntryType.Hospital;
  discharge: Discharge;
};

export type SickLeave = {
  startDate: string;
  endDate: string;
};

export type Discharge = {
  date: string;
  criteria: string;
};

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;

export type Patient = {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries: Entry[];
};

type UnionOmit<T, K extends string | number | symbol> = T extends unknown
  ? Omit<T, K>
  : never;
export type PatientFormValues = Omit<Patient, "id" | "entries">;
export type NewBaseEntry = Omit<BaseEntry, "id">;
export type EntryFormValues = UnionOmit<Entry, "id">;
