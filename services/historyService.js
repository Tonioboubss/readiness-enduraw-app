import { supabase } from "./supabase";
import { getCurrentUser } from "./authService";

/**
 * Récupère les derniers check-ins de l'utilisateur.
 */
export async function getRecentCheckins(limit = 30) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("No authenticated user");
  }

  const { data, error } = await supabase
    .from("daily_checkins")
    .select("*")
    .eq("user_id", user.id)
    .order("checkin_date", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Récupère les snapshots des derniers check-ins.
 */
export async function getRecentSnapshots(limit = 30) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("No authenticated user");
  }

  const { data, error } = await supabase
    .from("daily_checkins")
    .select(`
      id,
      checkin_date,
      status,
      daily_snapshots (
        id,
        snapshot_json,
        created_at
      )
    `)
    .eq("user_id", user.id)
    .order("checkin_date", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Récupère les scores des derniers check-ins.
 */
export async function getRecentScores(limit = 30) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("No authenticated user");
  }

  const { data, error } = await supabase
    .from("daily_checkins")
    .select(`
      id,
      checkin_date,
      score_results (
        score_key,
        score_label,
        value_number,
        score_version,
        created_at
      )
    `)
    .eq("user_id", user.id)
    .order("checkin_date", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data;
}

const AXIS_META = {
  energy: { label: "Energy", icon: "⚡" },
  recovery: { label: "Recovery", icon: "🌙" },
  mental_availability: { label: "Mental", icon: "🧠" },
  physical_aptitude: { label: "Physical", icon: "🏃" },
  confidence: { label: "Confidence", icon: "🛡️" },
  ambition: { label: "Ambition", icon: "⛰️" },
};

function average(values) {
  const clean = values.filter((v) => v != null && !Number.isNaN(v));
  if (clean.length === 0) return null;
  return clean.reduce((sum, v) => sum + v, 0) / clean.length;
}

function scoreFromGap(gap) {
  if (gap == null) return null;

  // gap 0 = 100%, gap 100 = 0%
  return Math.max(0, Math.min(100, Math.round(100 - gap) / 100));
}

function computeBodyAwareness(validSnapshots) {
  if (validSnapshots.length < 3) {
    return {
      score: null,
      correlations: [],
    };
  }

  const recent = validSnapshots.slice(-3);

  const dayJ = recent[0];
  const dayJ1 = recent[1];
  const dayJ2 = recent[2];

  const axisResults = Object.keys(AXIS_META).map((axis) => {
    const perceptionJ = dayJ?.readiness_axes?.[axis];

    const sensorJ1 = dayJ1?.sensor_axes?.[axis];
    const sensorJ2 = dayJ2?.sensor_axes?.[axis];

    const gapJ1 =
      perceptionJ == null || sensorJ1 == null
        ? null
        : Math.abs(perceptionJ - sensorJ1);

    const gapJ2 =
      perceptionJ == null || sensorJ2 == null
        ? null
        : Math.abs(perceptionJ - sensorJ2);

    const j1Score = scoreFromGap(gapJ1);
    const j2Score = scoreFromGap(gapJ2);

    return {
      key: axis,
      label: AXIS_META[axis].label,
      icon: AXIS_META[axis].icon,
      j1: j1Score,
      j3: j2Score,
    };
  });

  const globalScore = Math.round(
    (average(
      axisResults.flatMap((axis) => [axis.j1, axis.j3])
    ) ?? 0) * 100
  );

  return {
    score: globalScore,
    correlations: axisResults,
  };
}

/**
 * Historique complet pour Body History.
 */
export async function getBodyHistory(limit = 30, pseudo = null) {
  const normalizedPseudo = pseudo?.trim?.().toLowerCase?.() ?? null;

  let query = supabase
    .from("daily_checkins")
    .select(`
      id,
      pseudo,
      checkin_date,
      status,
      completed_at,
      score_results (
        score_key,
        score_label,
        value_number,
        score_version
      ),
      daily_snapshots (
        snapshot_json,
        created_at
      )
    `)
    .eq("status", "completed")
    .order("checkin_date", { ascending: true })
    .limit(limit);

  if (normalizedPseudo) {
    query = query.eq("pseudo", normalizedPseudo);
  }

const { data, error } = await query;

  if (error) {
    throw error;
  }

  const rows = data || [];

  const labels = rows.map((item, index) => {
    const remaining = rows.length - 1 - index;
  
    if (remaining === 0) return "Today";
    if (remaining === 1) return "D-1";
  
    return `D-${remaining}`;
  });

  const snapshots = rows.map((item) => {
    const relation = item.daily_snapshots;

    if (Array.isArray(relation)) {
      return relation[0]?.snapshot_json ?? null;
    }

    return relation?.snapshot_json ?? null;
  });
  
  const validSnapshots = snapshots.filter(
    (s) => s?.scores && s?.readiness_axes && s?.sensor_axes
  );
  
  const hasEnoughForBodyAwareness = validSnapshots.length >= 3;
  
  const bodyAwareness = computeBodyAwareness(validSnapshots);
  
  const gap = snapshots.map((s) => {
    const value = s?.scores?.absolute_gap ?? null;
    return value == null ? null : Number(value);
  });
  
  const body = snapshots.map((s, index) => {
    if (!hasEnoughForBodyAwareness) return null;
  
    // On affiche le score seulement sur le dernier point
    if (index === snapshots.length - 1) {
      return bodyAwareness.score;
    }
  
    return null;
  });
  
  return {
    snapshots,
    labels,
    body,
    gap,
    hasEnoughForBodyAwareness,
    latestBodyScore: bodyAwareness.score,
    correlations: bodyAwareness.correlations,
  };
}
/**
 * Récupère le Daily Snapshot du jour.
 */
export async function getTodaySnapshot() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("No authenticated user");
  }

  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("daily_checkins")
    .select(`
      id,
      checkin_date,
      status,
      daily_snapshots (
        snapshot_json,
        created_at
      )
    `)
    .eq("user_id", user.id)
    .eq("checkin_date", today)
    .eq("status", "completed")
    .maybeSingle();

    if (error) {
      throw error;
    }
    
    console.log("GET TODAY SNAPSHOT RAW DATA:", JSON.stringify(data, null, 2));
    
    const snapshotRelation = data?.daily_snapshots;
    
    if (Array.isArray(snapshotRelation)) {
      return snapshotRelation[0]?.snapshot_json ?? null;
    }
    
    return snapshotRelation?.snapshot_json ?? null;
}

export async function getYesterdaySnapshot() {
  const snapshots = await getRecentSnapshots(10);

  console.log(
    "RAW RECENT SNAPSHOTS",
    JSON.stringify(snapshots, null, 2)
  );

  const completedWithSnapshot = snapshots.filter((item) => {
    const relation = item.daily_snapshots;

    const hasSnapshot = Array.isArray(relation)
      ? relation.length > 0
      : !!relation?.snapshot_json;

    return item.status === "completed" && hasSnapshot;
  });

  console.log(
    "COMPLETED SNAPSHOTS",
    JSON.stringify(completedWithSnapshot, null, 2)
  );

  if (completedWithSnapshot.length < 2) {
    return null;
  }

  const yesterdayRelation =
    completedWithSnapshot[1].daily_snapshots;

  if (Array.isArray(yesterdayRelation)) {
    return yesterdayRelation[0]?.snapshot_json ?? null;
  }

  return yesterdayRelation?.snapshot_json ?? null;
}

export async function getSnapshotByCheckinId(checkinId) {
  if (!checkinId) return null;

  const { data, error } = await supabase
    .from("daily_checkins")
    .select(`
      id,
      checkin_date,
      daily_snapshots (
        snapshot_json,
        created_at
      )
    `)
    .eq("id", checkinId)
    .maybeSingle();

  if (error) throw error;

  const relation = data?.daily_snapshots;

  if (Array.isArray(relation)) {
    return relation[0]?.snapshot_json ?? null;
  }

  return relation?.snapshot_json ?? null;
}

export async function getSnapshotByPseudoAndDate(pseudo, checkinDate) {
  if (!pseudo || !checkinDate) return null;

  const normalizedPseudo = pseudo.trim().toLowerCase();

  const { data, error } = await supabase
    .from("daily_checkins")
    .select(`
      id,
      checkin_date,
      daily_snapshots (
        snapshot_json,
        created_at
      )
    `)
    .eq("pseudo", normalizedPseudo)
    .eq("checkin_date", checkinDate)
    .eq("status", "completed")
    .maybeSingle();

  if (error) throw error;

  const relation = data?.daily_snapshots;

  if (Array.isArray(relation)) {
    return relation[0]?.snapshot_json ?? null;
  }

  return relation?.snapshot_json ?? null;
}

export async function getPreviousSnapshotByPseudoAndDate(pseudo, checkinDate) {
  if (!pseudo || !checkinDate) return null;

  const normalizedPseudo = pseudo.trim().toLowerCase();

  const { data, error } = await supabase
    .from("daily_checkins")
    .select(`
      id,
      checkin_date,
      daily_snapshots (
        snapshot_json,
        created_at
      )
    `)
    .eq("pseudo", normalizedPseudo)
    .eq("status", "completed")
    .lt("checkin_date", checkinDate)
    .order("checkin_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  const relation = data?.daily_snapshots;

  if (Array.isArray(relation)) {
    return relation[0]?.snapshot_json ?? null;
  }

  return relation?.snapshot_json ?? null;
}