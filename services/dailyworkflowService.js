import {
  createCheckinByPseudoAndDate,
  completeCheckin,
} from "./checkinService";

import { saveAnswers, getAnswers } from "./answerService";
import {
  saveSensorObservations,
  getSensorObservationsByDate,
} from "./sensorService";

import { saveScore, getScores } from "./scoreService.js";
import { saveDailySnapshot } from "./snapshotService";
import { getBodyHistory } from "./historyService";

import { generateMockSensorData } from "../utils/mockSensorGenerator";
import { calculateReadinessScore } from "../utils/readinessCalculator";
import { calculateBodyAwarenessScore } from "../utils/bodyAwarenessCalculator";
import { buildDailySnapshot } from "../utils/snapshotBuilder";
import { calculateReadinessDimensions } from "../utils/readinessDimensionsCalculator";
import { calculateSensorDimensionProxies } from "../utils/sensorDimensionProxyCalculator";
import { calculatePerceptionGapAnalysis } from "../utils/perceptionGapCalculator";
import { calculateSensorReadinessScore } from "../utils/sensorReadinessCalculator";

export async function submitDailyCheckin(rawAnswers, session = null) {
  if (!Array.isArray(rawAnswers) || rawAnswers.length === 0) {
    throw new Error("submitDailyCheckin requires at least one answer.");
  }

  if (!session?.pseudo || !session?.checkinDate) {
    throw new Error("Missing pseudo or check-in date.");
  }

  const pseudo = session.pseudo.trim().toLowerCase();
  const checkinDate = session.checkinDate;

  const checkin = await createCheckinByPseudoAndDate(
    pseudo,
    checkinDate
  );

  if (checkin.status === "completed" || checkin.locked_at) {
    throw new Error("This check-in is already completed and locked.");
  }

  await saveAnswers(checkin.id, rawAnswers);

  const savedAnswers = await getAnswers(checkin.id);

  const mockSensors = generateMockSensorData();

  await saveSensorObservations(
    mockSensors,
    pseudo,
    checkinDate
  );

  const sensorObservations = await getSensorObservationsByDate(
    checkinDate,
    pseudo
  );

  const dimensions = calculateReadinessDimensions(savedAnswers);

  const readinessScore = calculateReadinessScore(dimensions);

  const sensorAxes = calculateSensorDimensionProxies(sensorObservations);

  const sensorReadinessScore =
    calculateSensorReadinessScore(sensorAxes);

  const perceptionGapAnalysis = calculatePerceptionGapAnalysis(
    dimensions,
    sensorAxes
  );

  await saveScore(checkin.id, {
    score_key: "readiness_score",
    score_label: "Readiness Score",
    value_number: readinessScore,
    score_version: "v1",
  });

  await saveScore(checkin.id, {
    score_key: "sensor_readiness_score",
    score_label: "Sensor Readiness Score",
    value_number: sensorReadinessScore,
    value_json: sensorAxes,
    score_version: "v1",
  });

  const historyBeforeBodyAwareness = await getBodyHistory(
    30,
    pseudo
  );

  const bodyAwarenessScore = calculateBodyAwarenessScore(
    historyBeforeBodyAwareness
  );

  await saveScore(checkin.id, {
    score_key: "body_awareness_score",
    score_label: "Body Awareness Score",
    value_number: bodyAwarenessScore,
    score_version: "v1",
  });

  const scores = await getScores(checkin.id);

  const snapshot = buildDailySnapshot({
    scores,
    dimensions,
    sensorAxes,
    perceptionGapAnalysis,
  });

  console.log("DAILY SNAPSHOT", JSON.stringify(snapshot, null, 2));

  const savedSnapshot = await saveDailySnapshot(checkin.id, snapshot);

  const completedCheckin = await completeCheckin(checkin.id);

  return {
    checkin: completedCheckin,
    answers: savedAnswers,
    sensors: sensorObservations,
    scores,
    dimensions,
    snapshot: savedSnapshot,
  };
}