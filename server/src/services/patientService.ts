import { v1 as uuid } from "uuid";
import patients from "../../data/patients";
import {
  Patient,
  NonSensitivePatient,
  NewPatient,
  Entry,
  NewEntry,
} from "../types";

const getPatients = (): Patient[] => {
  return patients;
};

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const findById = (id: string): Patient | undefined => {
  const entry = patients.find((p) => p.id === id);
  return entry;
};

const addPatient = (entry: NewPatient): NewPatient => {
  const newPatientEntry = {
    id: uuid(),
    ...entry,
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const addEntry = (patient: Patient, newEntry: NewEntry) => {
  const entry: Entry = {
    ...newEntry,
    id: uuid(),
  };

  const updatedPatient = { ...patient, entries: patient.entries.concat(entry) };
  const index = patients.findIndex((p) => p.id === patient.id);
  patients[index] = updatedPatient;

  return updatedPatient;
};

export default {
  getPatients,
  getNonSensitivePatients,
  findById,
  addPatient,
  addEntry,
};
