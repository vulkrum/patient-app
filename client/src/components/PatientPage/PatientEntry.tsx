import { Box, Paper, Typography, List, ListItem, Divider } from "@mui/material";
import { Entry, Diagnosis, HealthCheckRating, EntryType } from "../../types";

import { MedicalServices, Work, LocalHospital } from "@mui/icons-material";
import { assertNever } from "../../utils";

type Props = {
  entry: Entry;
  diagnoses: Diagnosis[];
};

const style = {
  py: 0,
  mt: "0.5em",
  mb: "0.5em",
  width: "100%",
  maxWidth: 360,
  borderRadius: 1,
  border: "1px solid",
  borderColor: "divider",
  backgroundColor: "background.paper",
};

const PatientEntry = ({ entry, diagnoses }: Props) => {
  const findDiagnosis = (code: string) => {
    const diagnosis = diagnoses.find((d) => d.code === code);
    if (diagnosis) return diagnosis.name;
  };

  const getTypeLabel = (entry: Entry) => {
    switch (entry.type) {
      case EntryType.HealthCheck:
        return <MedicalServices />;
      case EntryType.OccupationalHealthcare:
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Work sx={{ mr: "0.5em" }} /> {entry.employerName}
          </Box>
        );
      case EntryType.Hospital:
        return <LocalHospital />;
      default:
        assertNever(entry);
    }
  };

  const getExtraFields = (entry: Entry) => {
    switch (entry.type) {
      case EntryType.HealthCheck:
        return (
          <Typography>
            Health check rating: {HealthCheckRating[entry.healthCheckRating]}
          </Typography>
        );
      case EntryType.OccupationalHealthcare:
        if (!entry.sickLeave) return null;
        return (
          <Box>
            <Typography>
              Sick leave start date: {entry.sickLeave.startDate}
            </Typography>
            <Typography>
              Sick leave end date: {entry.sickLeave.endDate}
            </Typography>
          </Box>
        );
      case EntryType.Hospital:
        return (
          <Box>
            <Typography>Discharge date: {entry.discharge.date}</Typography>
            <Typography>
              Discharge criteria: {entry.discharge.criteria}
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: "1em", mb: "1em" }}>
      <Typography
        component="div"
        sx={{ display: "flex", alignItems: "center" }}
      >
        <Box sx={{ mr: "0.5em" }}>{entry.date}</Box>
        {getTypeLabel(entry)}
      </Typography>
      <Typography>
        <em>{entry.description}</em>
      </Typography>
      {entry.diagnosisCodes && (
        <List sx={style}>
          {entry.diagnosisCodes?.map((code) => {
            return (
              <Box key={entry.id + code}>
                <Typography component={ListItem} sx={{ display: "list-item" }}>
                  <Box sx={{ color: "#ba000d" }}>{code}</Box>{" "}
                  {findDiagnosis(code)}
                </Typography>
                <Divider component="li" />
              </Box>
            );
          })}
        </List>
      )}
      {getExtraFields(entry)}
      <Typography>Diagnosed by {entry.specialist}</Typography>
    </Paper>
  );
};

export default PatientEntry;
