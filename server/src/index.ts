import express from "express";
import cors from "cors";

import diagnosisRouter from "./routes/diagnoses";
import patientRouter from "./routes/patients";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

app.use("/api/diagnoses", diagnosisRouter);
app.use("/api/patients", patientRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
