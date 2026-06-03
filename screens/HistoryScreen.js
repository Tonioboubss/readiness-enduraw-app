import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Svg, { Circle, Polyline, Line, Text as SvgText } from "react-native-svg";

const { width } = Dimensions.get("window");

const bodyScore = 84;

const historyData = {
  "7D": {
    labels: ["D-6", "D-5", "D-4", "D-3", "D-2", "D-1", "D"],
    body: [62, 66, 71, 73, 78, 81, 84],
    gap: [25, 22, 18, 15, 12, 9, 7],
  },
  "15D": {
    labels: ["1", "3", "5", "7", "9", "11", "13", "15"],
    body: [55, 59, 63, 66, 70, 75, 80, 84],
    gap: [30, 27, 25, 21, 18, 14, 10, 7],
  },
  "30D": {
    labels: ["1", "5", "10", "15", "20", "25", "30"],
    body: [48, 52, 60, 65, 71, 78, 84],
    gap: [35, 31, 27, 23, 18, 12, 7],
  },
};

const correlations = [
  { label: "Energy", icon: "⚡", j1: 0.82, j3: 0.71 },
  { label: "Recovery", icon: "🌙", j1: 0.76, j3: 0.65 },
  { label: "Mental", icon: "🧠", j1: 0.69, j3: 0.58 },
  { label: "Physical", icon: "🏃", j1: 0.74, j3: 0.63 },
  { label: "Confidence", icon: "🛡️", j1: 0.67, j3: 0.55 },
  { label: "Ambition", icon: "⛰️", j1: 0.61, j3: 0.49 },
];

export default function History() {
  const [period, setPeriod] = useState("7D");
  const data = historyData[period];

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>BODY AWARENESS</Text>
          <Text style={styles.subtitle}>
            How well your feelings predict your physiology
          </Text>
        </View>

        <View style={styles.mainLayout}>
          <View style={styles.leftColumn}>
            <View style={styles.scoreCard}>
              <Text style={styles.cardTitle}>1. BODY AWARENESS SCORE</Text>
              <Text style={styles.cardSubtitle}>Predictive self-awareness</Text>

              <View style={styles.scoreRow}>
                <AwarenessGauge value={bodyScore} />

                <View style={styles.scoreTextBlock}>
                  <Text style={styles.scoreStatus}>EXCELLENT</Text>
                  <Text style={styles.bodyText}>
                    Your internal signals are strongly aligned with your body
                    data.
                  </Text>
                  <Text style={styles.bigGreen}>↗ +8</Text>
                  <Text style={styles.mutedText}>vs last week</Text>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.chartHeader}>
                <View>
                  <Text style={styles.cardTitle}>3. EVOLUTION TRACKING</Text>
                  <Text style={styles.cardSubtitle}>
                    Score and perception gap
                  </Text>
                </View>

                <View style={styles.periodRow}>
                  {["7D", "15D", "30D"].map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.periodButton,
                        period === item && styles.periodButtonActive,
                      ]}
                      onPress={() => setPeriod(item)}
                    >
                      <Text
                        style={[
                          styles.periodText,
                          period === item && styles.periodTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <MiniLineChart
                labels={data.labels}
                body={data.body}
                gap={data.gap}
              />

              <View style={styles.legend}>
                <Text style={styles.legendGreen}>● Body Score</Text>
                <Text style={styles.legendOrange}>● Mean Gap</Text>
              </View>
            </View>
          </View>

          <View style={styles.rightColumn}>
            <View style={styles.correlationCard}>
              <Text style={styles.cardTitle}>4. BODY AWARENESS AXES</Text>
              <Text style={styles.cardSubtitle}>
                Feeling prediction power at J+1 and J+3
              </Text>

              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderDimension}>Axis</Text>
                <Text style={styles.tableHeaderValue}>J+1</Text>
                <Text style={styles.tableHeaderValue}>J+3</Text>
              </View>

              {correlations.map((item) => (
                <CorrelationRow key={item.label} item={item} />
              ))}

              <View style={styles.readingBox}>
                <Text style={styles.readingTitle}>HOW TO READ</Text>
                <Text style={styles.readingText}>
                  Higher correlation means your feeling is a better predictor of
                  future physiological data.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function AwarenessGauge({ value }) {
  const size = 118;
  const center = size / 2;
  const radius = 44;
  const strokeWidth = 8;
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
      </View>
    </View>
  );
}

function MiniLineChart({ labels, body, gap }) {
        const chartWidth = width - 18 * 2 - 10 - 205 - 28;
        const chartHeight = 165;
        const paddingX = 20;
        const paddingY = 18;
      
        const maxLabels = labels.length;
        const step = maxLabels > 7 ? Math.ceil(maxLabels / 6) : 1;
      
        const mapPoint = (value, index, values) => {
          const x =
            paddingX +
            (index * (chartWidth - paddingX * 2)) / Math.max(values.length - 1, 1);
      
          const y =
            chartHeight -
            paddingY -
            (value / 100) * (chartHeight - paddingY * 2);
      
          return { x, y };
        };
      
        const bodyPoints = body.map((v, i) => mapPoint(v, i, body));
        const gapPoints = gap.map((v, i) => mapPoint(v, i, gap));
      
        const pointsToString = (points) =>
          points.map((p) => `${p.x},${p.y}`).join(" ");
      
        return (
          <View style={styles.chartBox}>
            <Svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
              {[0, 25, 50, 75, 100].map((level) => {
                const y =
                  chartHeight -
                  paddingY -
                  (level / 100) * (chartHeight - paddingY * 2);
      
                return (
                  <Line
                    key={level}
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="#223244"
                    strokeWidth="1"
                  />
                );
              })}
      
              <Polyline
                points={pointsToString(bodyPoints)}
                fill="none"
                stroke="#91d94f"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
      
              <Polyline
                points={pointsToString(gapPoints)}
                fill="none"
                stroke="#ff8500"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
      
              {labels.map((label, index) => {
                const shouldShow =
                  index === 0 ||
                  index === labels.length - 1 ||
                  index % step === 0;
      
                if (!shouldShow) return null;
      
                const x =
                  paddingX +
                  (index * (chartWidth - paddingX * 2)) /
                    Math.max(labels.length - 1, 1);
      
                return (
                  <SvgText
                    key={`${label}-${index}`}
                    x={x}
                    y={chartHeight - 2}
                    fill="#94a3b8"
                    fontSize="8"
                    textAnchor="middle"
                  >
                    {label}
                  </SvgText>
                );
              })}
            </Svg>
          </View>
        );
      }

function CorrelationRow({ item }) {
  return (
    <View style={styles.correlationRow}>
      <View style={styles.dimensionCell}>
        <Text style={styles.correlationIcon}>{item.icon}</Text>
        <Text style={styles.dimensionLabel}>{item.label}</Text>
      </View>

      <Text style={styles.correlationValue}>{item.j1.toFixed(2)}</Text>

      <Text
        style={[
          styles.correlationValue,
          item.j3 < 0.6 ? styles.orange : styles.green,
        ]}
      >
        {item.j3.toFixed(2)}
      </Text>
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

  mainLayout: {
        flexDirection: "row",
        gap: 10,
        width: "100%",
      },
      
      leftColumn: {
        flex: 1,
        gap: 12,
        minWidth: 0,
      },
      
      rightColumn: {
        width: 205,
      },

  card: {
    backgroundColor: "#06121d",
    borderWidth: 1,
    borderColor: "#243447",
    borderRadius: 12,
    padding: 14,
  },

  scoreCard: {
    backgroundColor: "#06121d",
    borderWidth: 1,
    borderColor: "#243447",
    borderRadius: 12,
    padding: 14,
  },

  correlationCard: {
        backgroundColor: "#06121d",
        borderWidth: 1,
        borderColor: "#243447",
        borderRadius: 12,
        padding: 12,
        flex: 1,
        minHeight: 404,
      },

  cardTitle: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
  },

  cardSubtitle: {
    color: "#cbd5e1",
    fontSize: 11,
    marginTop: 4,
    marginBottom: 8,
  },

  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  gaugeBox: {
    width: 118,
    height: 118,
    alignItems: "center",
    justifyContent: "center",
  },

  gaugeCenter: {
    position: "absolute",
    alignItems: "center",
  },

  gaugeValue: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "900",
  },

  gaugeTotal: {
    color: "#cbd5e1",
    fontSize: 12,
  },

  scoreTextBlock: {
    flex: 1,
  },

  scoreStatus: {
    color: "#91d94f",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 4,
  },

  bodyText: {
    color: "#f8fafc",
    fontSize: 11,
    lineHeight: 16,
  },

  bigGreen: {
    color: "#91d94f",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 6,
  },

  mutedText: {
    color: "#94a3b8",
    fontSize: 10,
  },

  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },

  periodRow: {
    flexDirection: "row",
    backgroundColor: "#02070d",
    borderRadius: 8,
    padding: 3,
    borderWidth: 1,
    borderColor: "#243447",
  },

  periodButton: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },

  periodButtonActive: {
    backgroundColor: "#a855f7",
  },

  periodText: {
    color: "#94a3b8",
    fontSize: 10,
    fontWeight: "800",
  },

  periodTextActive: {
    color: "#ffffff",
  },

  chartBox: {
    height: 165,
    marginTop: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  legend: {
    flexDirection: "row",
    gap: 14,
    marginTop: 6,
  },

  legendGreen: {
    color: "#91d94f",
    fontSize: 11,
    fontWeight: "700",
  },

  legendOrange: {
    color: "#ff8500",
    fontSize: 11,
    fontWeight: "700",
  },

  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#243447",
    paddingBottom: 6,
    marginBottom: 6,
  },

  tableHeaderDimension: {
    flex: 1.8,
    color: "#94a3b8",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },

  tableHeaderValue: {
    flex: 0.7,
    color: "#94a3b8",
    fontSize: 10,
    fontWeight: "800",
    textAlign: "right",
  },

  correlationRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.025)",
    borderWidth: 1,
    borderColor: "#223244",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginBottom: 7,
  },

  dimensionCell: {
    flex: 1.8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  correlationIcon: {
    fontSize: 15,
  },

  dimensionLabel: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },

  correlationValue: {
    flex: 0.7,
    color: "#91d94f",
    textAlign: "right",
    fontSize: 13,
    fontWeight: "900",
  },

  readingBox: {
    borderWidth: 1,
    borderColor: "#26384b",
    borderRadius: 10,
    padding: 9,
    backgroundColor: "rgba(255,255,255,0.025)",
    marginTop: 6,
  },

  readingTitle: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 4,
  },

  readingText: {
    color: "#cbd5e1",
    fontSize: 10,
    lineHeight: 14,
  },

  green: {
    color: "#91d94f",
  },

  orange: {
    color: "#ff8500",
  },
});