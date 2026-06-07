import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Svg, { Circle, Polyline, Line, Text as SvgText } from "react-native-svg";
import { getBodyHistory } from "../services/historyService";

const { width } = Dimensions.get("window");

export default function History({ navigation, route, session }) {
  const [period, setPeriod] = useState("7D");
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const pseudo = session?.pseudo || route?.params?.pseudo;
  
        const result = await getBodyHistory(30, pseudo);
  
        setHistory(result);
      } catch (e) {
        console.log("History loading error:", e);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [session?.pseudo, route?.params?.pseudo]);

  const realLabels = history?.labels || [];
  const realBody = history?.body || [];
  const realGap = history?.gap || [];

  const data = {
    labels: realLabels.slice(-Number(period.replace("D", ""))),
    body: realBody.slice(-Number(period.replace("D", ""))),
    gap: realGap.slice(-Number(period.replace("D", ""))),
  };

  const canShowBodyAwareness = history?.hasEnoughForBodyAwareness;
  const bodyScore = history?.latestBodyScore ?? null;  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        
      <View style={styles.header}>
        <View style={styles.headerSide}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("DailyPrint", {
                pseudo: session?.pseudo || route?.params?.pseudo,
                checkinDate: session?.checkinDate || route?.params?.checkinDate,
              })
            }
          >
            <Text style={styles.headerIcon}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.headerCenter}>
          <Text style={styles.title}>
            BODY <Text style={styles.awAccent}>AW</Text>ARENESS
          </Text>

          <Text style={styles.subtitle}>
            How well your feelings predict your physiology ?
          </Text>
        </View>

        <View style={styles.headerSide} />
      </View>

        <View style={styles.mainLayout}>
          <View style={styles.leftColumn}>
            <View style={styles.scoreCard}>
              <Text style={styles.cardTitle}>1. BODY AWARENESS SCORE</Text>
              <Text style={styles.cardSubtitle}>Predictive self shape awareness :
              Your recent feelings are being compared with sensor data from the following days. </Text>

              <View style={styles.scoreRow}>
                {canShowBodyAwareness && bodyScore != null ? (
                  <AwarenessGauge value={bodyScore} />
                ) : (
                  <View style={styles.placeholderGauge}>
                    <Text style={styles.placeholderText}>—</Text>
                    <Text style={styles.placeholderSub}>Need 3 days</Text>
                  </View>
                )}

                <View style={styles.scoreTextBlock}>

                <Text style={styles.bigGreen}>
                  {canShowBodyAwareness
                    ? "3-DAY WINDOW"
                    : "3 CHECK-IN DAYS REQUIRED"}
                </Text>

                <Text style={styles.mutedText}>
                  Perception D-2 vs Sensors Data from D-1 & D-Day !
                </Text>
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
                <Text style={styles.legendGreen}>● Body Awareness</Text>
                <Text style={styles.legendOrange}>● Mean Perception Gap</Text>
              </View>
            </View>
          </View>

          <View style={styles.rightColumn}>
            <View style={styles.correlationCard}>
              <Text style={styles.cardTitle}>2. BODY AWARENESS AXES</Text>
              <Text style={styles.cardSubtitle}>
                Indexes regarding D-1 and Today
              </Text>

              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderDimension}>Axis</Text>
                <Text style={styles.tableHeaderValue}>D-1</Text>
                <Text style={styles.tableHeaderValue}>Today</Text>
              </View>

              {history?.hasEnoughForBodyAwareness &&
              (history?.correlations || []).length > 0 ? (
                (history?.correlations || []).map((item) => (
                  <CorrelationRow key={item.label} item={item} />
                ))
              ) : (
                <View style={styles.readingBox}>
                  <Text style={styles.readingTitle}>BUILDING BASELINE</Text>
                  <Text style={styles.readingText}>
                    Body Awareness needs 3 completed snapshots to compare perception D-2 with
                    sensors D-1 and D-Day.
                  </Text>
                </View>
              )}

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

        <TouchableOpacity
          style={styles.homeFooterButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.homeFooterText}>
            Return Home
          </Text>
        </TouchableOpacity>

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
      
        if (!body?.length || !gap?.length || !labels?.length) {
          return (
            <View style={styles.chartBox}>
              <Text style={styles.emptyChartText}>
                No history yet. Complete your first daily snapshots.
              </Text>
            </View>
          );
        }
      
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
      
        const cleanBody = body;
        const cleanGap = gap;;

        const bodyPoints = cleanBody.map((v, i) =>
          v == null ? null : mapPoint(v, i, cleanBody)
        );

        const gapPoints = cleanGap.map((v, i) =>
          v == null ? null : mapPoint(v, i, cleanGap)
        );
      
        const pointsToString = (points) =>
        points.filter(Boolean).map((p) => `${p.x},${p.y}`).join(" ");
      
        return (
          <View style={styles.chartBox}>
            <Svg width="100%" height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
            {[0, 25, 50, 75, 100].map((level) => {
              const y =
                chartHeight -
                paddingY -
                (level / 100) * (chartHeight - paddingY * 2);

              return (
                <React.Fragment key={level}>
                  <Line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="#223244"
                    strokeWidth="1"
                  />

                  <SvgText
                    x={8}
                    y={y + 3}
                    fill="#94a3b8"
                    fontSize="8"
                    textAnchor="start"
                  >
                    {level}
                  </SvgText>
                </React.Fragment>
              );
            })}
      
            {bodyPoints.filter(Boolean).length > 1 && (
              <Polyline
                points={pointsToString(bodyPoints.filter(Boolean))}
                fill="none"
                stroke="#91d94f"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {bodyPoints.map((p, index) => {
              if (!p) return null;

              return (
                <Circle
                  key={`body-point-${index}`}
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill="#91d94f"
                />
              );
            })}
      
          {gapPoints.filter(Boolean).length > 1 && (
            <Polyline
              points={pointsToString(gapPoints.filter(Boolean))}
              fill="none"
              stroke="#ff8500"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
      
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

      <Text style={styles.correlationValue}>
        {item.j1 == null ? "—" : item.j1.toFixed(2)}
      </Text>

      <Text
        style={[
          styles.correlationValue,
          item.j3 != null && item.j3 < 0.6 ? styles.orange : styles.green
        ]}
      >
        {item.j3 == null ? "—" : item.j3.toFixed(2)}
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

  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  
  homeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  
  headerIcon: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
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
  placeholderGauge: {
    width: 118,
    height: 118,
    borderRadius: 59,
    borderWidth: 2,
    borderColor: "#243447",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.025)",
  },
  
  placeholderText: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "900",
  },
  
  placeholderSub: {
    color: "#94a3b8",
    fontSize: 10,
    marginTop: 2,
  },
  emptyChartText: {
    color: "#94a3b8",
    fontSize: 11,
    textAlign: "center",
  },
  awAccent: {
    color: "#ff8500",
  },
  homeFooterButton: {
    marginTop: 18,
    alignSelf: "center",
    backgroundColor: "#ff8500",
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 14,
  },
  
  homeFooterText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  
  headerSide: {
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  
  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  
  headerIcon: {
    color: "#ffffff",
    fontSize: 26,
    fontWeight: "700",
  },
  
  awAccent: {
    color: "#ff8500",
  },
});