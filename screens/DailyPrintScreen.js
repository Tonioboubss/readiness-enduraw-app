import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Svg, { Circle, Polygon, Line, Text as SvgText } from "react-native-svg";

const { width } = Dimensions.get("window");

const dimensions = [
  {
    label: "Energy Level",
    shortLabel: "ENERGY",
    icon: "⚡",
    score: 75,
    sensor: 60,
    delta: 15,
    yesterday: 9,
    description: "",
  },
  {
    label: "Recovery Rate",
    shortLabel: "RECOVERY",
    icon: "🌙",
    score: 68,
    sensor: 88,
    delta: -20,
    yesterday: -4,
    description: "",
  },
  {
    label: "Mental Availability",
    shortLabel: "MENTAL",
    icon: "🧠",
    score: 70,
    sensor: 75,
    delta: -5,
    yesterday: 5,
    description: "",
  },
  {
    label: "Physical Shape",
    shortLabel: "PHYSICAL",
    icon: "🏃",
    score: 74,
    sensor: 64,
    delta: 10,
    yesterday: 7,
    description: "",
  },
  {
    label: "Confidence Level",
    shortLabel: "CONFIDENCE",
    icon: "🛡️",
    score: 65,
    sensor: 60,
    delta: 5,
    yesterday: -3,
    description: "",
  },
  {
    label: "Ambition Evolution",
    shortLabel: "AMBITION",
    icon: "⛰️",
    score: 78,
    sensor: 70,
    delta: 8,
    yesterday: 6,
    description: "",
  },
];

const readinessScore = Math.round(
  dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length
);

const globalDelta = Math.round(
  dimensions.reduce((sum, d) => sum + d.delta, 0) / dimensions.length
);

export default function DailyPrintScreen({ navigation }) {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>DAILY FOOTPRINT</Text>
          <Text style={styles.subtitle}>
            When your signals face your sensors data
          </Text>
        </View>

        <View style={styles.layout}>
          <View style={styles.leftColumn}>
            <ReadinessCard />
          </View>

          <View style={styles.rightColumn}>
            <RadarCard />
          </View>
        </View>

        <TouchableOpacity
          style={styles.bodyAwarenessButton}
          onPress={() => navigation.navigate("History")}
        >
        <Text style={styles.bodyAwarenessButtonText}>
        BODY AWARENESS →
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

function ReadinessCard() {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>1. TODAY READINESS INDEX</Text>
      <Text style={styles.cardSubtitle}>
        Subjective index based on your collected signals
      </Text>

      <View style={styles.readinessTop}>
        <ReadinessGauge value={readinessScore} />

        <View style={styles.readinessText}>
          <Text style={styles.bodyText}>
            Your body and mind are ready to perform !
          </Text>
          <Text style={styles.bigGreen}>↗ +6</Text>
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
          stroke="#91d94f"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          rotation="130"
          origin={`${center}, ${center}`}
        />
      </Svg>

      <View style={styles.gaugeCenter}>
        <Text style={styles.gaugeValue}>{value}</Text>
        <Text style={styles.gaugeTotal}>/100</Text>
        <Text style={styles.gaugeLabel}>ÉLEVÉ</Text>
      </View>
    </View>
  );
}

function RadarCard() {
  return (
    <View style={styles.card}>
      <View style={styles.radarHeaderRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>2. DELTAS & CONSISTENCY</Text>
          <Text style={styles.cardSubtitle}>
            Sensation vs true data
          </Text>
        </View>

        <View style={styles.globalDeltaBox}>
          <Text style={styles.globalDeltaLabel}>GLOBAL GAP</Text>
          <Text style={styles.globalDeltaValue}>
            {globalDelta > 0 ? `+${globalDelta}` : globalDelta}
          </Text>
          <Text style={styles.globalDeltaStatus}>Soft Deviation</Text>
        </View>
      </View>

      <View style={styles.coherenceMiniText}>
        <Text style={styles.coherenceMiniTitle}>
          Your underestimate softly your capacities today.
        </Text>
        <Text style={styles.coherenceMiniDesc}>
          Your signal levels seems quite below your current data.
        </Text>
      </View>

      <CoherenceScale value={globalDelta} />

      <View style={styles.legend}>
        <Text style={styles.legendItem}>● Signals</Text>
        <Text style={styles.legendItemWhite}>- - Sensors</Text>
        <Text style={styles.legendItemWhite}></Text>
      </View>

      <RadarChart data={dimensions} />

      <View style={styles.readingBox}>
        <Text style={styles.readingTitle}>HOW TO READ SIGNALS VS DATA</Text>
        <Text style={styles.readingText}>
          🟢 &gt; 10                    ⚪ -10 à +10           🔴 &lt; -10
        </Text>
      </View>
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
  const safeValue = Math.max(-30, Math.min(30, value));
  const left = `${((safeValue + 30) / 60) * 100}%`;

  return (
    <View style={styles.scaleContainer}>
      <View style={styles.scaleLine}>
        <View style={styles.redZone} />
        <View style={styles.neutralZone} />
        <View style={styles.greenZone} />

        <View style={[styles.marker, { left }]}>
          <Text style={styles.markerBubble}>
            {value > 0 ? `+${value}` : value}
          </Text>
        </View>
      </View>

      <View style={styles.scaleNumbers}>
        <Text style={styles.scaleNumber}>-30</Text>
        <Text style={styles.scaleNumber}>-15</Text>
        <Text style={styles.scaleNumber}>0</Text>
        <Text style={styles.scaleNumber}>+15</Text>
        <Text style={styles.scaleNumber}>+30</Text>
      </View>

      <View style={styles.scaleLabels}>
        <Text style={styles.redLabel}>Underestimation</Text>
        <Text style={styles.neutralLabel}>Aligned</Text>
        <Text style={styles.greenLabel}>Overfitting</Text>
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

  header: {
    marginBottom: 12,
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
    fontSize: 9,
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

  redZone: {
    flex: 1,
    backgroundColor: "#ff4b3e",
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },

  neutralZone: {
    flex: 1,
    backgroundColor: "#cbd5e1",
  },

  greenZone: {
    flex: 1,
    backgroundColor: "#91d94f",
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },

  marker: {
    position: "absolute",
    top: -6,
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: "#ffffff",
    borderWidth: 3,
    borderColor: "#a855f7",
    transform: [{ translateX: -8.5 }],
  },

  markerBubble: {
    position: "absolute",
    top: -32,
    left: -14,
    backgroundColor: "#a855f7",
    color: "#ffffff",
    fontWeight: "800",
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
});