import { useState, SyntheticEvent } from "react";
import { assertNever } from "../../utils";

import {
  TextField,
  InputLabel,
  Box,
  MenuItem,
  Select,
  Grid,
  Button,
  SelectChangeEvent,
} from "@mui/material";

import {
  Discharge,
  EntryFormValues,
  EntryType,
  SickLeave,
  HealthCheckRating,
} from "../../types";

type Props = {
  onCancel: () => void;
  onSubmit: (values: EntryFormValues) => void;
};

type EntryTypeOption = {
  value: EntryType;
  label: string;
};

const entryTypeOptions: EntryTypeOption[] = Object.values(EntryType).map(
  (v) => ({
    value: v,
    label: v.toString(),
  })
);

type HealthCheckOption = {
  value: HealthCheckRating;
  label: string;
};

const healthCheckRatingOptions: HealthCheckOption[] = [
  { value: HealthCheckRating.Healthy, label: "Healthy" },
  { value: HealthCheckRating.LowRisk, label: "LowRisk" },
  { value: HealthCheckRating.HighRisk, label: "HighRisk" },
  { value: HealthCheckRating.CriticalRisk, label: "CriticalRisk" },
];
const AddEntryForm = ({ onCancel, onSubmit }: Props) => {
  const [description, setDescription] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [entryType, setEntryType] = useState<EntryType>(EntryType.HealthCheck);
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [discharge, setDischarge] = useState<Discharge>({
    date: "",
    criteria: "",
  });
  const [employerName, setEmployerName] = useState("");
  const [sickLeave, setSickLeave] = useState<SickLeave>({
    startDate: "",
    endDate: "",
  });
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(
    HealthCheckRating.Healthy
  );

  const onEntryTypeChange = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if (typeof event.target.value === "string") {
      const value = event.target.value;
      const entryType = Object.values(EntryType).find(
        (t) => t.toString() === value
      );
      if (entryType) {
        setEntryType(entryType);
      }
    }
  };

  const onHealthCheckRatingChange = (event: SelectChangeEvent<string>) => {
    const findValue = healthCheckRatingOptions.find(
      (r) => r.label === event.target.value
    );

    if (findValue) {
      setHealthCheckRating(findValue.value);
    }
  };

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    onSubmit({
      description,
      specialist,
      diagnosisCodes,
      type: entryType,
      discharge,
      employerName,
      sickLeave,
      healthCheckRating,
      date: "",
    });
  };

  const getExtraFields = () => {
    switch (entryType) {
      case EntryType.Hospital:
        return (
          <>
            <TextField
              label="Discharge Date"
              placeholder="YYYY-MM-DD"
              fullWidth
              onChange={({ target }) =>
                setDischarge({ ...discharge, date: target.value })
              }
            />
            <TextField
              label="Discharge Criteria"
              fullWidth
              onChange={({ target }) =>
                setDischarge({ ...discharge, criteria: target.value })
              }
            />
          </>
        );
      case EntryType.OccupationalHealthcare:
        return (
          <>
            <TextField
              label="Employer Name"
              fullWidth
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
            />
            <TextField
              label="Sick Leave Start Date"
              placeholder="YYYY-MM-DD"
              fullWidth
              onChange={({ target }) =>
                setSickLeave({ ...sickLeave, startDate: target.value })
              }
            />
            <TextField
              label="Sick Leave End Date"
              placeholder="YYYY-MM-DD"
              fullWidth
              onChange={({ target }) =>
                setSickLeave({ ...sickLeave, endDate: target.value })
              }
            />
          </>
        );
      case EntryType.HealthCheck:
        return (
          <Box>
            <Select
              label="Health Check Rating"
              fullWidth
              value={HealthCheckRating[healthCheckRating]}
              onChange={onHealthCheckRatingChange}
            >
              {healthCheckRatingOptions.map((option) => {
                return (
                  <MenuItem key={option.value} value={option.label}>
                    {option.label}
                  </MenuItem>
                );
              })}
            </Select>
          </Box>
        );
      default:
        assertNever(entryType);
    }
  };

  return (
    <div>
      <form onSubmit={addEntry}>
        <InputLabel sx={{ mt: "1em" }}>Entry Type</InputLabel>
        <Select
          label="Entry Type"
          value={entryType}
          fullWidth
          onChange={onEntryTypeChange}
          sx={{ mb: "1em" }}
        >
          {entryTypeOptions.map((option) => (
            <MenuItem key={option.label} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        <TextField
          label="Description"
          fullWidth
          onChange={({ target }) => setDescription(target.value)}
        />
        <TextField
          label="Specialist"
          fullWidth
          onChange={({ target }) => setSpecialist(target.value)}
        />
        <TextField
          label="Diagnosis Codes"
          placeholder="Separate by comma"
          fullWidth
          onChange={({ target }) =>
            setDiagnosisCodes(target.value.replace(/\s/g, "").split(","))
          }
        />
        {getExtraFields()}

        <Grid>
          <Grid item>
            <Button
              color="secondary"
              variant="contained"
              style={{ float: "left" }}
              type="button"
              onClick={onCancel}
            >
              Cancel
            </Button>
          </Grid>
          <Grid item>
            <Button
              style={{
                float: "right",
              }}
              type="submit"
              variant="contained"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default AddEntryForm;
