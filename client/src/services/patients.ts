import axios from "axios";
import { Patient, PatientFormValues, EntryFormValues } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(`${apiBaseUrl}/patients`);

  return data;
};

const getOne = async (id: string) => {
  const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);

  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(`${apiBaseUrl}/patients`, object);

  return data;
};

const update = async (id: string, object: EntryFormValues) => {
  const { data } = await axios.put<Patient>(
    `${apiBaseUrl}/patients/${id}`,
    object
  );

  return data;
};

export default {
  getAll,
  getOne,
  create,
  update,
};
