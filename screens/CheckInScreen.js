import { useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Pressable, PanResponder } from "react-native";
import Svg, { Polygon, Path, Circle, Text as SvgText, } from "react-native-svg";

import { COLORS, RADIUS } from "../constants/theme";
import ProgressSteps from "../components/ProgressSteps";

export default function CheckInScreen({ navigation }) {
  const [energy, setEnergy] = useState(72);
  const [mental, setMental] = useState(66);
  const [confidence, setConfidence] = useState(73);

  const score = Math.round((energy + mental + confidence) / 3);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </Pressable>

        <Text style={styles.header}>MORNING CHECK-IN</Text>

        <View style={{ width: 34 }} />
      </View>

      <ProgressSteps currentStep={1} />

      <View style={styles.cardsRow}>
        <EnergyCard energy={energy} setEnergy={setEnergy} />
        <MentalCard mental={mental} setMental={setMental} />
        <MountainCard value={confidence} onValueChange={setConfidence} />
      </View>

      <View style={styles.scoreCard}>
        <View>
          <Text style={styles.scoreTitle}>TODAY’S SCORE</Text>
          <Text style={styles.scoreSub}>Average of your signals</Text>
        </View>

        <Text style={styles.score}>
          {score}
          <Text style={styles.scoreMax}>/100</Text>
        </Text>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() =>
          navigation.navigate("DailyPrint", {
            score,
            energy,
            mental,
            confidence,
          })
        }
      >
        <Text style={styles.primaryButtonText}>GENERATE MY DAILY PRINT →</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.cancelText}>CANCEL</Text>
      </TouchableOpacity>
    </View>
  );
}

function EnergyCard({ energy, setEnergy }) {
        const sliderHeight = 170;
      
        const updateEnergy = (y) => {
          const clampedY = Math.max(0, Math.min(y, sliderHeight));
          let newValue = Math.round(100 - (clampedY / sliderHeight) * 100);
      
          if (newValue <= 3) newValue = 0;
          if (newValue >= 97) newValue = 100;
      
          setEnergy(newValue);
        };
      
        const panResponder = useRef(
          PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (event) => {
              updateEnergy(event.nativeEvent.locationY);
            },
            onPanResponderMove: (event) => {
              updateEnergy(event.nativeEvent.locationY);
            },
          })
        ).current;
      
        return (
          <View style={styles.verticalCard}>
            <Text style={styles.cardTitleSmall}>1. ENERGY</Text>
            <Text style={styles.questionSmall}>How much Energy in store ?</Text>
      
            <View style={styles.energySliderZone} {...panResponder.panHandlers}>
              <View style={styles.batteryCap} />
      
              <View style={styles.batteryShell}>
                <View style={[styles.batteryFill, { height: `${energy}%` }]} />
      
                <View
                  style={[
                    styles.batteryHandle,
                    { bottom: `${Math.max(0, Math.min(energy, 96))}%` },
                  ]}
                />
      
                <Text style={styles.batteryPercent}>{Math.round(energy)}%</Text>
              </View>
            </View>
          </View>
        );
      }

      function MentalCard({ mental, setMental }) {
        const targetSize = 155;
        const center = targetSize / 2;
        const maxRadius = 65;
      
        const [markerPosition, setMarkerPosition] = useState({
          x: center,
          y: center - ((100 - mental) / 100) * maxRadius,
        });
      
        const getMentalWord = (value) => {
          if (value >= 80) return "FOCUSED";
          if (value >= 60) return "AVAILABLE";
          if (value >= 40) return "NEUTRAL";
          if (value >= 20) return "SCATTERED";
          return "OVERLOADED";
        };
      
        const updateMentalFromTouch = (x, y) => {
          const dx = x - center;
          const dy = y - center;
          const distance = Math.sqrt(dx * dx + dy * dy);
      
          const clampedDistance = Math.min(distance, maxRadius);
          const angle = Math.atan2(dy, dx);
      
          const markerX = center + Math.cos(angle) * clampedDistance;
          const markerY = center + Math.sin(angle) * clampedDistance;
      
          let newValue = Math.round(100 - (clampedDistance / maxRadius) * 100);
      
          if (newValue >= 95) newValue = 100;
          if (newValue <= 5) newValue = 0;
      
          setMarkerPosition({
            x: markerX,
            y: markerY,
          });
      
          setMental(newValue);
        };
      
        const panResponder = useRef(
          PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (event) => {
              updateMentalFromTouch(
                event.nativeEvent.locationX,
                event.nativeEvent.locationY
              );
            },
            onPanResponderMove: (event) => {
              updateMentalFromTouch(
                event.nativeEvent.locationX,
                event.nativeEvent.locationY
              );
            },
          })
        ).current;
      
        return (
          <View style={styles.verticalCard}>
            <Text style={styles.cardTitleSmall}>2. MENTAL</Text>
            <Text style={styles.questionSmall}>Where is your attention today?</Text>
      
            <Text style={styles.mentalWord}>{getMentalWord(mental)}</Text>
      
            <View style={styles.targetZone} {...panResponder.panHandlers}>
              <Svg
                width={targetSize}
                height={targetSize}
                viewBox={`0 0 ${targetSize} ${targetSize}`}
              >
                {[65, 52, 39, 26, 13].map((radius) => (
                  <Circle
                    key={radius}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.22)"
                    strokeWidth="1.5"
                  />
                ))}
      
                <Path
                  d={`M${center} 8 L${center} ${targetSize - 8}`}
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="1"
                  strokeDasharray="4 5"
                />
      
                <Path
                  d={`M8 ${center} L${targetSize - 8} ${center}`}
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="1"
                  strokeDasharray="4 5"
                />
      
                <Circle cx={center} cy={center} r="16" fill="#FF7A00" opacity="0.22" />
                <Circle cx={center} cy={center} r="7" fill="#FF7A00" opacity="0.95" />
      
                <Circle
                  cx={markerPosition.x}
                  cy={markerPosition.y}
                  r="13"
                  fill="#FF7A00"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                />
      
                <Circle
                  cx={markerPosition.x}
                  cy={markerPosition.y}
                  r="5"
                  fill="#FFFFFF"
                />
      
                <SvgText
                  x={markerPosition.x}
                  y={Math.max(14, markerPosition.y - 18)}
                  fill="#FF7A00"
                  fontSize="13"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {`${Math.round(mental)}%`}
                </SvgText>
              </Svg>
            </View>
          </View>
        );
      }

      function MountainCard({ value, onValueChange }) {
        const width = 150;
        const height = 135;
      
        // Ligne de crête : chaque point correspond à une position possible du curseur.
        const ridgePoints = [
          { x: 12, y: 122 },
          { x: 28, y: 92 },
          { x: 42, y: 105 },
          { x: 58, y: 58 },
          { x: 72, y: 76 },
          { x: 88, y: 30 },
          { x: 104, y: 68 },
          { x: 122, y: 46 },
          { x: 140, y: 122 },
        ];
      
        const getPointOnRidge = (percent) => {
          const t = Math.max(0, Math.min(percent, 100)) / 100;
          const scaledIndex = t * (ridgePoints.length - 1);
          const index = Math.floor(scaledIndex);
          const nextIndex = Math.min(index + 1, ridgePoints.length - 1);
          const localT = scaledIndex - index;
      
          const p1 = ridgePoints[index];
          const p2 = ridgePoints[nextIndex];
      
          return {
            x: p1.x + (p2.x - p1.x) * localT,
            y: p1.y + (p2.y - p1.y) * localT,
          };
        };
      
        const getValueFromPoint = (point) => {
                const minY = 30;   // pic le plus haut
                const maxY = 122;  // creux / base
              
                const valueFromHeight = Math.round(
                  ((maxY - point.y) / (maxY - minY)) * 100
                );
              
                return Math.max(0, Math.min(valueFromHeight, 100));
              };
              
              const getClosestValueFromTouch = (touchX) => {
                const clampedX = Math.max(12, Math.min(touchX, 140));
              
                let closestPoint = ridgePoints[0];
                let minDistance = Infinity;
              
                ridgePoints.forEach((point) => {
                  const distance = Math.abs(point.x - clampedX);
              
                  if (distance < minDistance) {
                    minDistance = distance;
                    closestPoint = point;
                  }
                });
              
                return getValueFromPoint(closestPoint);
              };
      
        const updateConfidence = (x) => {
          const newValue = getClosestValueFromTouch(x);
          onValueChange(newValue);
        };
      
        const panResponder = useRef(
          PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (event) => {
              updateConfidence(event.nativeEvent.locationX);
            },
            onPanResponderMove: (event) => {
              updateConfidence(event.nativeEvent.locationX);
            },
          })
        ).current;
      
        const marker = ridgePoints.reduce((closest, point) => {
                const pointValue = getValueFromPoint(point);
                const closestValue = getValueFromPoint(closest);
              
                return Math.abs(pointValue - value) < Math.abs(closestValue - value)
                  ? point
                  : closest;
              }, ridgePoints[0]);
      
              const getTrailPlace = (value) => {
                if (value < 20) return "Annecy Lake";
                if (value < 40) return "Chamonix Valley";
                if (value < 60) return "Taïbit Ridge";
                if (value < 80) return "Piton des Neiges Crest";
                return "Mont Blanc Summit";
              };

        return (
          <View style={styles.verticalCard}>
            <Text style={styles.cardTitleSmall}>3. PHYSICAL CONFIDENCE</Text>
            <Text style={styles.questionSmall}>How do you rate your athletic power ?</Text>
      
            <View style={styles.mountainZoneCompact} {...panResponder.panHandlers}>
              <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                {/* Mountain body */}
                <Polygon
                  points="8,125 28,92 42,105 58,58 72,76 88,30 104,68 122,46 144,125"
                  fill="#64748B"
                  opacity="0.95"
                />
      
                {/* Left shadow faces */}
                <Polygon
                  points="8,125 28,92 42,105 52,125"
                  fill="#111827"
                  opacity="0.7"
                />
                <Polygon
                  points="42,125 58,58 72,76 78,125"
                  fill="#111827"
                  opacity="0.55"
                />
      
                {/* Right shadow faces */}
                <Polygon
                  points="78,125 88,30 104,68 108,125"
                  fill="#1F2937"
                  opacity="0.75"
                />
                <Polygon
                  points="108,125 122,46 144,125"
                  fill="#1F2937"
                  opacity="0.65"
                />
      
                {/* Snow peaks */}
                <Polygon points="58,58 51,73 61,67 69,78" fill="#F8FAFC" opacity="0.95" />
                <Polygon points="88,30 78,52 91,45 101,62" fill="#F8FAFC" opacity="0.98" />
                <Polygon points="122,46 112,65 124,58 132,74" fill="#F8FAFC" opacity="0.9" />
      
                {/* Ridge line */}
                <Path
                  d="M12 122 L28 92 L42 105 L58 58 L72 76 L88 30 L104 68 L122 46 L140 122"
                  stroke="#E5E7EB"
                  strokeWidth="2"
                  opacity="0.7"
                  fill="none"
                />
      
                {/* Confidence marker */}
                <Circle
                  cx={marker.x}
                  cy={marker.y}
                  r="11"
                  fill="#FF7A00"
                  stroke="#FFFFFF"
                  strokeWidth="3"
                />
                <Circle cx={marker.x} cy={marker.y} r="4" fill="#FFFFFF" />

                <SvgText
                  x={marker.x}
                  y={Math.max(14, marker.y - 18)}
                  fill="#FF7A00"
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                  >
                  {`${Math.round(value)}%`}
                </SvgText>
              </Svg>
            </View>
      
            <Text style={styles.trailPlace}>{getTrailPlace(value)}</Text>
          </View>
        );
      }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 18,
  },

  topBar: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  back: {
    color: COLORS.text,
    fontSize: 34,
    fontWeight: "300",
  },

  header: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  cardsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },

  verticalCard: {
    flex: 1,
    minHeight: 260,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardTitleSmall: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "900",
    textAlign: "center",
  },

  questionSmall: {
    color: COLORS.muted,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
    marginTop: 6,
  },

  verticalSlider: {
    width: 10,
    height: 135,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 100,
    justifyContent: "flex-end",
    marginVertical: 12,
  },

  verticalFill: {
    width: 10,
    backgroundColor: COLORS.orange,
    borderRadius: 100,
  },

  verticalThumb: {
    position: "absolute",
    left: -12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.orange,
    borderWidth: 3,
    borderColor: "#FFD29A",
    zIndex: 2,
  },

  mountainZoneCompact: {
    width: 150,
    height: 135,
    alignItems: "center",
    justifyContent: "center",
  },

  miniLabel: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: "800",
    textAlign: "center",
  },

  miniLabelActive: {
    color: COLORS.orange,
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center",
  },

  scoreCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  scoreTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "900",
  },

  scoreSub: {
    color: COLORS.muted,
    marginTop: 4,
    fontSize: 12,
  },

  score: {
    color: COLORS.orange,
    fontSize: 38,
    fontWeight: "900",
  },

  scoreMax: {
    color: COLORS.text,
    fontSize: 20,
  },

  primaryButton: {
    backgroundColor: COLORS.orange,
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
  },

  primaryButtonText: {
    color: "#05070A",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 0.5,
  },

  cancelButton: {
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  cancelText: {
    color: COLORS.text,
    textAlign: "center",
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: 1,
  },

  sliderTouchZone: {
        width: 70,
        height: 150,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 6,
      },
      
      gaugeTouchZone: {
        width: 170,
        height: 170,
        alignItems: "center",
        justifyContent: "center",
      },

      mentalWord: {
        color: COLORS.orange,
        fontSize: 13,
        fontWeight: "900",
        letterSpacing: 0.8,
        textAlign: "center",
        marginTop: 8,
        marginBottom: 4,
      },

      trailPlace: {
        color: COLORS.orange,
        fontSize: 11,
        fontWeight: "900",
        letterSpacing: 0.4,
        textAlign: "center",
        marginTop: 4,
      },

      mentalPercentFloating: {
        position: "absolute",
        left: 28,
        color: COLORS.orange,
        fontSize: 14,
        fontWeight: "900",
      },
      
      energySliderZone: {
        height: 170,
        width: 120,
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop: 8,
      },

      batteryCap: {
        width: 36,
        height: 8,
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        backgroundColor: "rgba(255,255,255,0.22)",
        borderWidth: 1,
        borderColor: COLORS.border,
        borderBottomWidth: 0,
      },
      
      batteryShell: {
        width: 88,
        height: 162,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.28)",
        backgroundColor: "rgba(255,255,255,0.05)",
        overflow: "hidden",
        justifyContent: "flex-end",
        alignItems: "center",
      },
      
      batteryFill: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: COLORS.orange,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
      },
      
      batteryHandle: {
        position: "absolute",
        width: 96,
        height: 5,
        borderRadius: 100,
        backgroundColor: "#FFFFFF",
        opacity: 0.9,
        zIndex: 3,
      },
      
      batteryPercent: {
        color: COLORS.text,
        fontSize: 24,
        fontWeight: "900",
        zIndex: 4,
      },

      targetZone: {
        width: 155,
        height: 155,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
      },
      
      mentalWord: {
        color: COLORS.orange,
        fontSize: 13,
        fontWeight: "900",
        letterSpacing: 0.8,
        textAlign: "center",
        marginTop: 8,
      },
});