import {View,Text,StyleSheet,ScrollView,Dimensions,TouchableOpacity,Pressable} from "react-native";
import Svg, { Circle, Polygon, Line, Text as SvgText } from "react-native-svg";

import React, { useEffect, useState } from "react";
import { getTodaySnapshot, getYesterdaySnapshot } from "../services/historyService";
import ProgressSteps from "../components/ProgressSteps";

const { width } = Dimensions.get("window");
function getReadinessStatus(score) {
  if (score >= 75) {
    return {
      label: "HIGH",
      color: "#91d94f",
      text: "Your body and mind look ready to perform.",
    };
  }

  if (score >= 50) {
    return {
      label: "MODERATE",
      color: "#ff8500",
      text: "You show a balanced but not optimal readiness state.",
    };
  }

  if (score >= 25) {
    return {
      label: "LOW",
      color: "#ffb020",
      text: "Your readiness is limited today. Adjust intensity with care.",
    };
  }

  return {
    label: "VERY LOW",
    color: "#ff4b3e",
    text: "Your signals show a strong readiness limitation today.",
  };
}

function getGapStatus(gap) {
  if (gap <= -50) {
    return {
      label: "Strong underestimation",
      color: "#ff4b3e",
      title: "You strongly underestimate your capacities today.",
      desc: "Your subjective signals are far below what your sensor data suggests.",
    };
  }

  if (gap < -20) {
    return {
      label: "Soft underestimation",
      color: "#ff8a80",
      title: "You underestimate your capacities today.",
      desc: "Your subjective signals sit below your current sensor baseline.",
    };
  }

  if (gap <= 20) {
    return {
      label: "Aligned",
      color: "#cbd5e1",
      title: "Your perception and sensors are aligned today.",
      desc: "Your subjective signals match your current objective data quite well.",
    };
  }

  if (gap <= 50) {
    return {
      label: "Soft overestimation",
      color: "#93c5fd",
      title: "You slightly overestimate your capacities today.",
      desc: "Your subjective signals sit above your current sensor baseline.",
    };
  }

  return {
    label: "Strong overestimation",
    color: "#3b82f6",
    title: "You strongly overestimate your capacities today.",
    desc: "Your subjective signals are far above what your sensor data suggests.",
  };
}

function formatSigned(value) {
  if (value === null || value === undefined) return "--";
  return value > 0 ? `+${value}` : `${value}`;
}

export default function DailyPrintScreen({ navigation, route }) {
  const initialSnapshot = route?.params?.snapshot || null;
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [yesterdaySnapshot, setYesterdaySnapshot] = useState(null);

  useEffect(() => {
      loadSnapshot();
  }, []);

  async function loadSnapshot() {
    try {
      const data = await getTodaySnapshot();
      console.log("TODAY SNAPSHOT", JSON.stringify(data, null, 2));
      setSnapshot(data);
      const today = await getTodaySnapshot();
      const yesterday = await getYesterdaySnapshot();
      console.log("YESTERDAY SNAPSHOT",
        JSON.stringify(yesterday, null, 2));
      setSnapshot(today);
      setYesterdaySnapshot(yesterday);
    } catch (error) {
      console.log("LOAD DAILY SNAPSHOT ERROR:", error);
    }
  }

  if (!snapshot) {
    return (
      <View style={styles.screen}>
        <Text style={{ color: "white" }}>
          Loading Daily Print...
        </Text>
      </View>
    );
  }

  const dimensions = [
    {
      label: "Energy",
      shortLabel: "ENERGY",
      icon: "⚡",
      score: snapshot.readiness_axes.energy,
      sensor: snapshot.sensor_axes.energy,
      delta: snapshot.perception_gap.axes.energy.signed_gap,
      yesterday:
      yesterdaySnapshot ? snapshot.readiness_axes.energy -
          yesterdaySnapshot.readiness_axes.energy : 0,
      },
  
    {
      label: "Recovery",
      shortLabel: "RECOVERY",
      icon: "🌙",
      score: snapshot.readiness_axes.recovery,
      sensor: snapshot.sensor_axes.recovery,
      delta: snapshot.perception_gap.axes.recovery.signed_gap,
      yesterday:
      yesterdaySnapshot ? snapshot.readiness_axes.recovery -
          yesterdaySnapshot.readiness_axes.recovery : 0,
      },
  
    {
      label: "Mental Availability",
      shortLabel: "MENTAL",
      icon: "🧠",
      score: snapshot.readiness_axes.mental_availability,
      sensor: snapshot.sensor_axes.mental_availability,
      delta: snapshot.perception_gap.axes.mental_availability.signed_gap,
      delta: snapshot.perception_gap.axes.mental_availability.signed_gap,
      yesterday:
      yesterdaySnapshot ? snapshot.readiness_axes.mental_availability -
          yesterdaySnapshot.readiness_axes.mental_availability : 0,
      },
  
    {
      label: "Physical Aptitude",
      shortLabel: "PHYSICAL",
      icon: "🏃",
      score: snapshot.readiness_axes.physical_aptitude,
      sensor: snapshot.sensor_axes.physical_aptitude,
      delta: snapshot.perception_gap.axes.physical_aptitude.signed_gap,
      yesterday:
      yesterdaySnapshot ? snapshot.readiness_axes.physical_aptitude -
          yesterdaySnapshot.readiness_axes.physical_aptitude : 0,
      },
  
    {
      label: "Confidence",
      shortLabel: "CONFIDENCE",
      icon: "🛡️",
      score: snapshot.readiness_axes.confidence,
      sensor: snapshot.sensor_axes.confidence,
      delta: snapshot.perception_gap.axes.confidence.signed_gap,
      yesterday:
      yesterdaySnapshot ? snapshot.readiness_axes.confidence -
          yesterdaySnapshot.readiness_axes.confidence : 0,
      },
  
    {
      label: "Ambition",
      shortLabel: "AMBITION",
      icon: "⛰️",
      score: snapshot.readiness_axes.ambition,
      sensor: snapshot.sensor_axes.ambition,
      delta: snapshot.perception_gap.axes.ambition.signed_gap,
      yesterday:
      yesterdaySnapshot ? snapshot.readiness_axes.ambition -
          yesterdaySnapshot.readiness_axes.ambition : 0,
      },
  ];

  const readinessDelta = yesterdaySnapshot
  ? snapshot.scores.readiness_score -
  yesterdaySnapshot.scores.readiness_score : 0;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topBar}>
        <Pressable
          style={styles.backContainer}
          onPress={() => navigation.navigate("CheckIn2", { readOnly: true })}
        >
          <Text style={styles.back}>←</Text>
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>DAILY FOOTPRINT</Text>
            <ProgressSteps currentStep={3} completedSteps={[1, 2, 3]} />
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.historyTopButton}
            onPress={() => navigation.navigate("History")}
          >
            <Text style={styles.historyTopButtonText}>
              HISTORY
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.layout}>
          <View style={styles.leftColumn}>
            <ReadinessCard snapshot={snapshot}
            dimensions={dimensions}
            readinessDelta={readinessDelta}/>
          </View>

          <View style={styles.rightColumn}>
            <RadarCard snapshot={snapshot} dimensions={dimensions}/>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

function ReadinessCard({snapshot, dimensions, readinessDelta }) {
  
  const readinessStatus = getReadinessStatus(
    snapshot.scores.readiness_score
  );

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>1. TODAY READINESS INDEX</Text>
      <Text style={styles.cardSubtitle}>
        Subjective index based on your collected signals
      </Text>

      <View style={styles.readinessTop}>
        <ReadinessGauge value={snapshot.scores.readiness_score} />

        <View style={styles.readinessText}>
          <Text style={styles.bodyText}>
            {readinessStatus.text}
          </Text>
          <Text style={readinessDelta >= 0 ? styles.bigGreen : styles.red}>
            {readinessDelta >= 0 ? "↗ +" : "↘ "} {readinessDelta}
          </Text>
          <Text style={styles.mutedText}>vs D-1</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>DIMENSIONS ANALYSIS</Text>

      {dimensions.map((item) => (
        <DimensionRow key={item.label} item={item} />
      ))}

      <Text style={styles.footerNote}>
        Subjectives grades based on your morning check-in answers.
      </Text>
    </View>
  );
}

function DimensionRow({ item }) {
  const positive = item.yesterday >= 0;

  return (
    <View style={styles.dimensionRow}>
      <View style={styles.iconBox}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>

      <View style={styles.dimensionText}>
        <Text style={styles.dimensionLabel}>{item.label}</Text>
        <Text style={styles.dimensionDesc}>{item.description}</Text>
      </View>

      <View style={styles.scoreBlock}>
        <Text
          style={[
            styles.dimensionScore,
            item.score >= 70 ? styles.green : styles.orange,
          ]}
        >
          {item.score}
          <Text style={styles.small}> /100</Text>
        </Text>
      </View>

      <View style={styles.trendBlock}>
        <Text style={positive ? styles.green : styles.red}>
          {positive ? "↑ +" : "↓ "}
          {item.yesterday}
        </Text>
        <Text style={styles.mutedSmall}>vs D-1</Text>
      </View>
    </View>
  );
}

function ReadinessGauge({ value }) {
  const size = 140;
  const center = size / 2;
  const radius = 54;
  const strokeWidth = 9;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference * 0.78 * (value / 100);

  return (
    <View style={styles.gaugeBox}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#26313d"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference * 0.78} ${circumference}`}
          rotation="130"
          origin={`${center}, ${center}`}
        />

        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={getReadinessStatus(value).color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          rotation="130"
          origin={`${center}, ${center}`}
        />
      </Svg>

      <View style={styles.gaugeCenter}>
        <View style={styles.gaugeValueRow}>
          <Text style={styles.gaugeValue}>{value}</Text>
          <Text style={styles.gaugeTotal}>/100</Text>
        </View>
        <Text style={[styles.gaugeLabel, { color: getReadinessStatus(value).color }]}>
          {getReadinessStatus(value).label}
        </Text>
      </View>
    </View>
  );
}

function RadarCard({snapshot, dimensions}) {
  const gapStatus = getGapStatus(snapshot.scores.global_gap);

  return (
    <View style={styles.card}>
      <View style={styles.radarHeaderRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>2. SENSATION & REALITY</Text>
          <Text style={styles.cardSubtitle}>
            A DashBoard to compare how you Feel and the Insights from Sensors. 
          </Text>
        </View>

        <View style={styles.globalDeltaBox}>
          <Text style={styles.globalDeltaLabel}>SIGNALS vs DATA</Text>
          <Text style={styles.globalDeltaValue}>
            {formatSigned(snapshot.scores.global_gap)}
          </Text>
          <Text style={[styles.globalDeltaStatus, { color: gapStatus.color }]}>
            {gapStatus.label}
          </Text>
        </View>
      </View>

      <View style={styles.coherenceMiniText}>
      <Text style={styles.coherenceMiniTitle}>{gapStatus.title}</Text>
      <Text style={styles.coherenceMiniDesc}>{gapStatus.desc}</Text>
      </View>

      <CoherenceScale value={snapshot.scores.global_gap} />

      <View style={styles.legend}>
        <Text style={styles.legendItem}>● Signals</Text>
        <Text style={styles.legendItemWhite}>- - Sensors</Text>
        <Text style={styles.legendItemWhite}></Text>
      </View>

      <RadarChart data={dimensions} />

    </View>
  );
}

function RadarChart({ data }) {
  const size = 280;
  const center = size / 2;
  const radius = 80;
  const levels = [0.25, 0.5, 0.75, 1];

  const getPoint = (index, value) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * index) / data.length;
    const r = radius * (value / 100);

    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const polygonPoints = (key) =>
    data
      .map((d, i) => {
        const p = getPoint(i, d[key]);
        return `${p.x},${p.y}`;
      })
      .join(" ");

  return (
    <View style={styles.radarWrapper}>
      <Svg width="100%" height={280} viewBox={`0 0 ${size} ${size}`}>
        {levels.map((level) => {
          const points = data
            .map((_, i) => {
              const p = getPoint(i, level * 100);
              return `${p.x},${p.y}`;
            })
            .join(" ");

          return (
            <Polygon
              key={level}
              points={points}
              fill="none"
              stroke="#283646"
              strokeWidth="1"
            />
          );
        })}

        {data.map((_, i) => {
          const p = getPoint(i, 100);

          return (
            <Line
              key={i}
              x1={center}
              y1={center}
              x2={p.x}
              y2={p.y}
              stroke="#283646"
              strokeWidth="1"
            />
          );
        })}

        <Polygon
          points={polygonPoints("sensor")}
          fill="rgba(255,255,255,0.05)"
          stroke="#d9e2ef"
          strokeWidth="2"
          strokeDasharray="6 6"
        />

        <Polygon
          points={polygonPoints("score")}
          fill="rgba(255,132,0,0.18)"
          stroke="#ff8500"
          strokeWidth="3"
        />

        {data.map((d, i) => {
          const angle = -Math.PI / 2 + (2 * Math.PI * i) / data.length;
          const labelRadius = radius + 36;
          const x = center + labelRadius * Math.cos(angle);
          const y = center + labelRadius * Math.sin(angle);

          return (
            <React.Fragment key={d.label}>
              <SvgText
                x={x}
                y={y}
                fill="#f4f7fb"
                fontSize="9"
                fontWeight="700"
                textAnchor="middle"
              >
                {d.shortLabel}
              </SvgText>

              <SvgText
                x={x}
                y={y + 14}
                fill={d.delta >= 0 ? "#91d94f" : "#ff4b3e"}
                fontSize="13"
                fontWeight="800"
                textAnchor="middle"
              >
                {d.delta >= 0 ? `+${d.delta}` : d.delta}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

function CoherenceScale({ value }) {
  const safeValue = Math.max(-100, Math.min(100, value));
  const left = `${((safeValue + 100) / 200) * 100}%`;

  return (
    <View style={styles.scaleContainer}>
      <View style={styles.scaleLine}>
        <View style={styles.strongUnderZone} />
        <View style={styles.softUnderZone} />
        <View style={styles.alignedZone} />
        <View style={styles.softOverZone} />
        <View style={styles.strongOverZone} />

        <View style={[styles.marker, { left }]}>
          <Text style={styles.markerBubble}>
            {formatSigned(value)}
          </Text>
        </View>
      </View>

      <View style={styles.scaleNumbers}>
        <Text style={styles.scaleNumber}>-100</Text>
        <Text style={styles.scaleNumber}>-50</Text>
        <Text style={styles.scaleNumber}>-20</Text>
        <Text style={styles.scaleNumber}>+20</Text>
        <Text style={styles.scaleNumber}>+50</Text>
        <Text style={styles.scaleNumber}>+100</Text>
      </View>

      <View style={styles.scaleLabels}>
        <Text style={styles.redLabel}>Strong under</Text>
        <Text style={styles.neutralLabel}>Aligned</Text>
        <Text style={styles.blueLabel}>Strong over</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#02070d",
  },

  container: {
    padding: 18,
    paddingBottom: 24,
  },

  title: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "800",
  },

  subtitle: {
    color: "#cbd5e1",
    fontSize: 13,
    marginTop: 4,
  },

  layout: {
        flexDirection: "row",
        gap: 12,
        alignItems: "stretch",
        width: "100%",
      },
      
      leftColumn: {
        flex: 0.95,
        minWidth: 0,
      },
      
      rightColumn: {
        flex: 1.35,
        minWidth: 0,
      },

  card: {
    backgroundColor: "#06121d",
    borderWidth: 1,
    borderColor: "#243447",
    borderRadius: 12,
    padding: 14,
    flex: 1,
  },

  cardTitle: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
    textTransform: "uppercase",
  },

  cardSubtitle: {
    color: "#cbd5e1",
    fontSize: 12,
    marginTop: 5,
    marginBottom: 10,
  },

  readinessTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  gaugeBox: {
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
  },

  gaugeCenter: {
    position: "absolute",
    alignItems: "center",
  },

  gaugeValue: {
    color: "#ffffff",
    fontSize: 38,
    fontWeight: "900",
  },

  gaugeTotal: {
    color: "#cbd5e1",
    fontSize: 13,
  },

  gaugeLabel: {
    color: "#91d94f",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 3,
  },

  readinessText: {
    flex: 1,
  },

  bodyText: {
    color: "#f8fafc",
    fontSize: 12,
    lineHeight: 18,
  },

  bigGreen: {
    color: "#91d94f",
    fontSize: 21,
    fontWeight: "900",
    marginTop: 8,
  },

  mutedText: {
    color: "#94a3b8",
    fontSize: 11,
  },

  divider: {
    height: 1,
    backgroundColor: "#243447",
    marginVertical: 10,
  },

  sectionTitle: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
  },

  dimensionRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.025)",
    borderWidth: 1,
    borderColor: "#223244",
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
  },

  iconBox: {
    width: 30,
  },

  icon: {
    fontSize: 20,
  },

  dimensionText: {
    flex: 1,
  },

  dimensionLabel: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "700",
  },

  dimensionDesc: {
    color: "#94a3b8",
    fontSize: 10,
    marginTop: 1,
  },

  scoreBlock: {
    width: 58,
    alignItems: "flex-end",
  },

  dimensionScore: {
    fontSize: 20,
    fontWeight: "900",
  },

  small: {
    fontSize: 8,
    color: "#94a3b8",
  },

  trendBlock: {
    width: 48,
    alignItems: "flex-end",
  },

  green: {
    color: "#91d94f",
  },

  orange: {
    color: "#ff8500",
  },

  red: {
    color: "#ff4b3e",
  },

  mutedSmall: {
    color: "#94a3b8",
    fontSize: 9,
  },

  footerNote: {
    color: "#94a3b8",
    fontSize: 10,
    marginTop: 8,
  },

  radarHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },

  globalDeltaBox: {
    minWidth: 120,
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
    backgroundColor: "rgba(168,85,247,0.08)",
  },

  globalDeltaLabel: {
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: "800",
  },

  globalDeltaValue: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "900",
    lineHeight: 36,
  },

  globalDeltaStatus: {
    color: "#ff8500",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },

  coherenceMiniText: {
    marginTop: 8,
    marginBottom: 6,
  },

  coherenceMiniTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },

  coherenceMiniDesc: {
    color: "#cbd5e1",
    fontSize: 12,
    marginTop: 3,
  },

  scaleContainer: {
    width: "100%",
    marginTop: 10,
    marginBottom: 12,
  },

  scaleLine: {
    height: 6,
    borderRadius: 8,
    flexDirection: "row",
    position: "relative",
  },

  strongUnderZone: {
    flex: 50,
    backgroundColor: "#ff4b3e",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  
  softUnderZone: {
    flex: 30,
    backgroundColor: "#ff8a80",
  },
  
  alignedZone: {
    flex: 40,
    backgroundColor: "#cbd5e1",
  },
  
  softOverZone: {
    flex: 30,
    backgroundColor: "#93c5fd",
  },
  
  strongOverZone: {
    flex: 50,
    backgroundColor: "#3b82f6",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  
  blueLabel: {
    color: "#3b82f6",
    fontSize: 9,
  },

  marker: {
    position: "absolute",
    top: -6,
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: "#ffffff",
    borderWidth: 3,
    borderColor: "#ff8500",
    transform: [{ translateX: -8.5 }],
  },
  
  markerBubble: {
    position: "absolute",
    top: -32,
    left: -14,
    backgroundColor: "#ff8500",
    color: "#031018",
    fontWeight: "900",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
    overflow: "hidden",
    fontSize: 11,
  },

  scaleNumbers: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 9,
  },

  scaleNumber: {
    color: "#cbd5e1",
    fontSize: 10,
  },

  scaleLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },

  redLabel: {
    color: "#ff4b3e",
    fontSize: 9,
  },

  neutralLabel: {
    color: "#cbd5e1",
    fontSize: 9,
  },

  greenLabel: {
    color: "#91d94f",
    fontSize: 9,
  },

  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 4,
  },

  legendItem: {
    color: "#ff8500",
    fontSize: 11,
  },

  legendItemWhite: {
    color: "#f8fafc",
    fontSize: 11,
  },

  radarWrapper: {
    alignItems: "center",
    justifyContent: "center",
    height: 280,
  },

  readingBox: {
    borderWidth: 1,
    borderColor: "#26384b",
    borderRadius: 10,
    padding: 9,
    backgroundColor: "rgba(255,255,255,0.025)",
  },

  readingTitle: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 6,
  },

  readingText: {
    color: "#cbd5e1",
    fontSize: 11,
    lineHeight: 16,
  },

  bodyAwarenessButton: {
        marginTop: 16,
        backgroundColor: "#7C3AED",
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#A855F7",
      },
      
      bodyAwarenessButtonText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "800",
        letterSpacing: 0.5,
      },

      topBar: {
        height: 72,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
      },
      
      backContainer: {
        width: 90,
        paddingLeft: 10,
        justifyContent: "center",
      },
      
      back: {
        color: "#F5F5F5",
        fontSize: 34,
        fontWeight: "300",
      },
      
      headerCenter: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      },
      
      headerTitle: {
        color: "#F5F5F5",
        fontSize: 22,
        fontWeight: "900",
        letterSpacing: 1.2,
        marginTop: 10,
      },
      
      historyTopButton: {
        width: 150,
        height: 48,
        marginRight: 10,
        borderRadius: 16,
        backgroundColor: "#FF8500",
        alignItems: "center",
        justifyContent: "center",
      },
      
      historyTopButtonText: {
        color: "#031018",
        fontSize: 13,
        fontWeight: "900",
        textTransform: "uppercase",
      },
      gaugeValueRow: {
        flexDirection: "row",
        alignItems: "flex-end",
      },
      gaugeTotal: {
        color: "#cbd5e1",
        fontSize: 13,
        marginBottom: 7,
        marginLeft: 2,
      },
});