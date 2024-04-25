import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Patient,
  Gender,
  Diagnosis,
  EntryFormValues,
  EntryType,
  NewBaseEntry,
} from "../../types";
import patientService from "../../services/patients";
import PatientEntry from "./PatientEntry";
import axios from "axios";
import AddEntryModal from "../AddEntryModal";

import { Transgender, Male, Female } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { assertNever } from "../../utils";

type Props = {
  diagnoses: Diagnosis[];
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
};

const PatientPage = ({ diagnoses, patients, setPatients }: Props) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [patient, setPatient] = useState<Patient>();

  const { id } = useParams();

  useEffect(() => {
    const fetchPatient = async () => {
      if (!id) return;
      const patient = await patientService.getOne(id);
      setPatient(patient);
    };
    fetchPatient();
  }, [id]);

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const addEntry = async (entry: EntryFormValues) => {
    if (id) {
      try {
        const updatedPatient = await patientService.update(id, entry);
        setPatients(patients.map((p) => (p.id === id ? updatedPatient : p)));
        setPatient(updatedPatient);
        setModalOpen(false);
      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          if (e?.response?.data && typeof e?.response?.data === "string") {
            const message = e.response.data.replace(
              "Something went wrong. Error: ",
              ""
            );
            console.error(message);
            setError(message);
          } else {
            setError("Unrecognized axios error");
          }
        } else {
          console.error("Unknown error", e);
          setError("Unknown error");
        }
      }
    }
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    const newEntry: NewBaseEntry = {
      description: values.description,
      date: values.date,
      specialist: values.specialist,
      diagnosisCodes: values.diagnosisCodes,
    };

    switch (values.type) {
      case EntryType.HealthCheck:
        addEntry({
          ...newEntry,
          type: values.type,
          healthCheckRating: values.healthCheckRating,
        });
        break;
      case EntryType.OccupationalHealthcare:
        addEntry({
          ...newEntry,
          type: values.type,
          employerName: values.employerName,
          sickLeave: values.sickLeave,
        });
        break;
      case EntryType.Hospital:
        addEntry({
          ...newEntry,
          type: values.type,
          discharge: values.discharge,
        });
        break;
      default:
        assertNever(values);
    }
  };

  const getGenderIcon = () => {
    if (!patient) return;
    switch (patient.gender) {
      case Gender.Other:
        return <Transgender />;
      case Gender.Male:
        return <Male />;
      case Gender.Female:
        return <Female />;
      default:
        assertNever(patient.gender);
    }
  };

  return (
    patient && (
      <Box sx={{ mt: "2em" }}>
        <Typography variant="h4" sx={{ display: "flex", alignItems: "center" }}>
          {patient.name} {getGenderIcon()}
        </Typography>
        <Typography sx={{ mt: "0.5em" }}>ssn: {patient.ssn}</Typography>
        <Typography>occupation: {patient.occupation}</Typography>
        <Typography variant="h5" sx={{ mt: "1em", mb: "0.5em" }}>
          {patient.entries.length !== 0 ? "Entries" : ""}
        </Typography>
        {patient.entries.map((entry) => {
          return (
            <PatientEntry key={entry.id} entry={entry} diagnoses={diagnoses} />
          );
        })}
        <Button onClick={openModal} variant="contained">
          Add entry
        </Button>
        <AddEntryModal
          modalOpen={modalOpen}
          onClose={closeModal}
          onSubmit={submitNewEntry}
          error={error}
        />
      </Box>
    )
  );
};

export default PatientPage;
