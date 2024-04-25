import {
  NewPatient,
  Gender,
  Entry,
  NewEntry,
  NewBaseEntry,
  EntryType,
  Diagnosis,
  HealthCheckRating,
  SickLeave,
  Discharge,
} from "./types";

const isNumber = (num: unknown): num is number => {
  return typeof num === "number" || num instanceof Number;
};

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseString = (string: unknown, field: string): string => {
  if (!isString(string)) {
    throw new Error(`Incorrect ${field}: ${string}`);
  }
  return string;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error(`Incorrect date: ${date}`);
  }
  return date;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((g) => g.toString())
    .includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error(`Incorrect gender: ${gender}`);
  }

  return gender;
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnosis["code"]> => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    // assume data is in correct form
    return [] as Array<Diagnosis["code"]>;
  }

  return object.diagnosisCodes as Array<Diagnosis["code"]>;
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
  return Object.values(HealthCheckRating)
    .map((r) => Number(r))
    .includes(param);
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (!isNumber(rating) || !isHealthCheckRating(rating)) {
    throw new Error(`Incorrect rating: ${rating}`);
  }

  return rating;
};

const parseSickLeave = (sickLeave: unknown): SickLeave => {
  if (
    typeof sickLeave === "object" &&
    sickLeave &&
    "startDate" in sickLeave &&
    "endDate" in sickLeave
  ) {
    return {
      startDate: parseDate(sickLeave.startDate),
      endDate: parseDate(sickLeave.endDate),
    };
  }

  throw new Error(`Incorrect sick leave: ${sickLeave}`);
};

const parseDischarge = (discharge: unknown): Discharge => {
  if (
    typeof discharge === "object" &&
    discharge &&
    "date" in discharge &&
    "criteria" in discharge
  ) {
    return {
      date: parseDate(discharge.date),
      criteria: parseString(discharge.criteria, "criteria"),
    };
  }

  throw new Error(`Incorrect discharge: ${discharge}`);
};

export const toNewEntry = (object: unknown): NewEntry => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if ("description" in object && "specialist" in object && "type" in object) {
    const baseEntry: NewBaseEntry = {
      date: new Date().toISOString().slice(0, 10),
      description: parseString(object.description, "description"),
      specialist: parseString(object.specialist, "specialist"),
      diagnosisCodes: parseDiagnosisCodes(object),
    };

    if (
      object.type === EntryType.HealthCheck &&
      "healthCheckRating" in object
    ) {
      const healthCheckEntry: NewEntry = {
        ...baseEntry,
        type: EntryType.HealthCheck,
        healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
      };
      return healthCheckEntry;
    }

    if (
      object.type === EntryType.OccupationalHealthcare &&
      "employerName" in object &&
      "sickLeave" in object
    ) {
      const occupationalHealthcareEntry: NewEntry = {
        ...baseEntry,
        type: EntryType.OccupationalHealthcare,
        employerName: parseString(object.employerName, "employer name"),
        sickLeave: parseSickLeave(object.sickLeave),
      };
      return occupationalHealthcareEntry;
    }

    if (object.type === EntryType.Hospital && "discharge" in object) {
      const hospitalEntry: NewEntry = {
        ...baseEntry,
        type: EntryType.Hospital,
        discharge: parseDischarge(object.discharge),
      };
      return hospitalEntry;
    }
  }

  throw new Error("Incorrect data: some fields are missing");
};

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (
    "name" in object &&
    "dateOfBirth" in object &&
    "ssn" in object &&
    "gender" in object &&
    "occupation" in object &&
    "entries" in object
  ) {
    const newPatient: NewPatient = {
      name: parseString(object.name, "name"),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseString(object.ssn, "string"),
      gender: parseGender(object.gender),
      occupation: parseString(object.occupation, "occupation"),
      entries: object.entries as Entry[],
    };

    return newPatient;
  }

  throw new Error("Incorrect data: some fields are missing");
};
