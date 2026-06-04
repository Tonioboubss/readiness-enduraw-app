import { createTodayCheckin, completeCheckin } from "./checkinService";
import { saveAnswers, getAnswers } from "./answerService";
import { saveSensorObservations, getTodaySensorObservations,} from "./sensorService";
import { saveScore, getScores } from "./scoreService";
import { saveDailySnapshot } from "./snapshotService";
import { getBodyHistory } from "./historyService";

import { generateMockSensorData } from "../utils/mockSensorGenerator";
import { calculateReadinessScore } from "../utils/readinessCalculator";
import { calculatePerceptionGapScore } from "../utils/perceptionGapCalculator";
import { calculateBodyAwarenessScore } from "../utils/bodyAwarenessCalculator";
import { buildDailySnapshot } from "../utils/snapshotBuilder";
import { calculateReadinessDimensions,} from "../utils/readinessDimensionsCalculator";

export async function submitDailyCheckin(rawAnswers) {
  if (!Array.isArray(rawAnswers) || rawAnswers.length === 0) {
    throw new Error("submitDailyCheckin requires at least one answer.");
  }

  const checkin = await createTodayCheckin();

  if (checkin.status === "completed" || checkin.locked_at) {
    throw new Error("Today's check-in is already completed and locked.");
  }

  await saveAnswers(checkin.id, rawAnswers);

  const savedAnswers = await getAnswers(checkin.id);

  const mockSensors = generateMockSensorData();
  await saveSensorObservations(mockSensors);

  const sensorObservations = await getTodaySensorObservations();

  const dimensions = calculateReadinessDimensions(savedAnswers);

  const readinessScore = calculateReadinessScore(dimensions);

  const perceptionGapScore = calculatePerceptionGapScore(
    savedAnswers,
    sensorObservations
  );

  await saveScore(checkin.id, {
    score_key: "readiness_score",
    score_label: "Readiness Score",
    value_number: readinessScore,
    score_version: "v1",
  });

  await saveScore(checkin.id, {
    score_key: "perception_gap_score",
    score_label: "Perception Gap Score",
    value_number: perceptionGapScore,
    score_version: "v1",
  });

  const historyBeforeBodyAwareness = await getBodyHistory(30);

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

  const snapshot = buildDailySnapshot({scores, dimensions,});

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