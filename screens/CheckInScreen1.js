import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  PanResponder,
} from "react-native";
import Svg, {
  Polygon,
  Path,
  Circle,
  Text as SvgText,
} from "react-native-svg";

import { COLORS, RADIUS } from "../constants/theme";
import ProgressSteps from "../components/ProgressSteps";
import { getTodayAnswers } from "../services/answerService";

export default function CheckInScreen1({ navigation, route }) {
  const readOnly = route?.params?.readOnly === true;

  const [energy, setEnergy] = useState(route?.params?.checkin1Values?.energy ?? null);
  const [mental, setMental] = useState(route?.params?.checkin1Values?.mental ?? null);
  const [physicalAptitude, setPhysicalAptitude] = useState(route?.params?.checkin1Values?.physicalAptitude ?? null);
  const [confidence, setConfidence] = useState(route?.params?.checkin1Values?.confidence ?? null);

  const checkin2Values = route?.params?.checkin2Values || null;

  useEffect(() => {
    const values = route?.params?.checkin1Values;
  
    if (!readOnly && values) {
      setEnergy(values.energy ?? null);
      setMental(values.mental ?? null);
      setPhysicalAptitude(values.physicalAptitude ?? null);
      setConfidence(values.confidence ?? null);
    }
  }, [route?.params?.checkin1Values]);

  useEffect(() => {
    if (readOnly) {
      loadReadonlyAnswers();
    }
    }, [readOnly]);

  const loadReadonlyAnswers = async () => {
    try {
      const savedAnswers = await getTodayAnswers();

      const getValue = (key, fallback) => {
        const answer = savedAnswers.find((item) => item.signal_key === key);
        return answer ? Number(answer.value_number) : fallback;
      };

      setEnergy(getValue("energy", energy));
      setMental(getValue("mental_availability", mental));
      setPhysicalAptitude(getValue("physical_aptitude", physicalAptitude));
      setConfidence(getValue("confidence", confidence));
    } catch (error) {
      console.log("LOAD CHECKIN1 READONLY ERROR:", error);
    }
  };

  const validValues = [
    energy,
    mental,
    physicalAptitude,
    confidence,
  ].filter((value) => value !== null);

  const score =
  validValues.length > 0
    ? Math.round(
        validValues.reduce((sum, value) => sum + value, 0) /
          validValues.length
      )
    : null;

  const goToCheckIn2 = () => {
    if (readOnly) {
      navigation.navigate("CheckIn2", {
        readOnly: true,
      });
      return;
    }

    navigation.navigate("CheckIn2", {
      readOnly: false,
      checkin1Values: {
        energy,
        mental,
        physicalAptitude,
        confidence,
      },
      checkin2Values,
      checkin1Answers: [
        {
          signal_key: "energy",
          signal_label: "Energy",
          screen: "checkin1",
          category: "readiness",
          value_number: energy,
        },
        {
          signal_key: "mental_availability",
          signal_label: "Mental Availability",
          screen: "checkin1",
          category: "readiness",
          value_number: mental,
        },
        {
          signal_key: "physical_aptitude",
          signal_label: "Physical Aptitude",
          screen: "checkin1",
          category: "readiness",
          value_number: physicalAptitude,
        },
        {
          signal_key: "confidence",
          signal_label: "Confidence",
          screen: "checkin1",
          category: "readiness",
          value_number: confidence,
        },
      ],
    });
  };

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

      {readOnly && (
        <Text style={styles.readOnlyBanner}>
          READ ONLY — TODAY'S CHECK-IN IS LOCKED
        </Text>
      )}

      <View style={styles.cardsRow}>
        <EnergyCard
          energy={energy}
          setEnergy={setEnergy}
          disabled={readOnly}
        />

        <MentalCard
          mental={mental}
          setMental={setMental}
          disabled={readOnly}
        />

        <MountainCard
          value={physicalAptitude}
          onValueChange={setPhysicalAptitude}
          disabled={readOnly}
        />

        <SunConfidenceCard
          value={confidence}
          onValueChange={setConfidence}
          disabled={readOnly}
        />
      </View>

      <View style={styles.scoreCard}>
        <View>
          <Text style={styles.scoreTitle}>TODAY’S SCORE</Text>
          <Text style={styles.scoreSub}>
            Average of your main signals
          </Text>
        </View>

        <Text style={styles.score}>
          {score ?? "--"}
          <Text style={styles.scoreMax}>/100</Text>
        </Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>
            {readOnly ? "Back" : "Cancel"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={goToCheckIn2}
        >
          <Text style={styles.continueButtonText}>
            {readOnly
              ? "Continue Review"
              : "Continue Morning Check-In"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function EnergyCard({ energy, setEnergy, disabled }) {
  const sliderHeight = 170;

  const updateEnergy = (y) => {
    if (disabled) return;

    const clampedY = Math.max(0, Math.min(y, sliderHeight));
    let newValue = Math.round(100 - (clampedY / sliderHeight) * 100);

    if (newValue <= 3) newValue = 0;
    if (newValue >= 97) newValue = 100;

    setEnergy(newValue);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: (event) => {
        updateEnergy(event.nativeEvent.locationY);
      },
      onPanResponderMove: (event) => {
        updateEnergy(event.nativeEvent.locationY);
      },
    })
  ).current;

  return (
    <View style={[styles.verticalCard, disabled && styles.disabledCard]}>
      <Text style={styles.cardTitleSmall}>1. ENERGY LEVEL</Text>
      <Text style={styles.questionSmall}>How much Energy in store ?</Text>

      <View style={styles.energySliderZone} {...panResponder.panHandlers}>
        <View style={styles.batteryCap} />

        <View style={styles.batteryShell}>
          <View style={[styles.batteryFill, { height: `${energy ?? 0}%` }]} />

          {energy !== null && (
            <>
          <View
            style={[
              styles.batteryHandle,
              { bottom: `${Math.max(0, Math.min(energy, 96))}%` },
            ]}
          />
          <Text style={styles.batteryPercent}>{Math.round(energy)}%</Text>
          </>
          )}
        </View>

      </View>
    </View>
  );
}

function MentalCard({ mental, setMental, disabled }) {
  const targetSize = 155;
  const center = targetSize / 2;
  const maxRadius = 65;

  const [markerPosition, setMarkerPosition] = useState({
    x: center,
    y: center,
  });

  const getMentalWord = (value) => {
    if (value >= 80) return "FOCUSED";
    if (value >= 60) return "AVAILABLE";
    if (value >= 40) return "NEUTRAL";
    if (value >= 20) return "SCATTERED";
    return "OVERLOADED";
  };

  const updateMentalFromTouch = (x, y) => {
    if (disabled) return;
  
    const dx = x - center;
    const dy = y - center;
    const distance = Math.sqrt(dx * dx + dy * dy);
  
    const clampedDistance = Math.min(distance, maxRadius);
  
    let markerX = x;
    let markerY = y;
  
    if (distance > maxRadius) {
      const angle = Math.atan2(dy, dx);
      markerX = center + Math.cos(angle) * maxRadius;
      markerY = center + Math.sin(angle) * maxRadius;
    }
  
    let newValue = Math.round(
      100 - (clampedDistance / maxRadius) * 100
    );
  
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
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
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
    <View style={[styles.verticalCard, disabled && styles.disabledCard]}>
      <Text style={styles.cardTitleSmall}>2. MENTAL AVAILABILITY</Text>
      <Text style={styles.questionSmall}>Where is your attention today?</Text>
      
      {mental !== null && (
      <Text style={styles.mentalWord}>{getMentalWord(mental)}</Text>)}

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
          
          {mental !== null && (
            <>
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
        </> )}
        </ Svg>
      </View>
    </View>
  );
}

function MountainCard({ value, onValueChange, disabled }) {
  const width = 150;
  const height = 135;

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

  const getValueFromPoint = (point) => {
    const minY = 30;
    const maxY = 122;

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

  const updatePhysicalAptitude = (x) => {
    if (disabled) return;

    const newValue = getClosestValueFromTouch(x);
    onValueChange(newValue);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: (event) => {
        updatePhysicalAptitude(event.nativeEvent.locationX);
      },
      onPanResponderMove: (event) => {
        updatePhysicalAptitude(event.nativeEvent.locationX);
      },
    })
  ).current;

  const marker =
  value !== null
    ? ridgePoints.reduce((closest, point) => {
        const pointValue = getValueFromPoint(point);
        const closestValue = getValueFromPoint(closest);

        return Math.abs(pointValue - value) <
          Math.abs(closestValue - value)
          ? point
          : closest;
      }, ridgePoints[0])
    : null;

  const getTrailPlace = (value) => {
    if (value < 20) return "Annecy Lake";
    if (value < 40) return "Chamonix Valley";
    if (value < 60) return "Taïbit Ridge";
    if (value < 80) return "Piton des Neiges Crest";
    return "Mont Blanc Summit";
  };

  return (
    <View style={[styles.verticalCard, disabled && styles.disabledCard]}>
      <Text style={styles.cardTitleSmall}>3. PHYSICAL APTITUDE</Text>
      <Text style={styles.questionSmall}>
        How physically capable do you feel today?
      </Text>

      <View style={styles.mountainZoneCompact} {...panResponder.panHandlers}>
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <Polygon
            points="8,125 28,92 42,105 58,58 72,76 88,30 104,68 122,46 144,125"
            fill="#64748B"
            opacity="0.95"
          />

          <Polygon points="8,125 28,92 42,105 52,125" fill="#111827" opacity="0.7" />
          <Polygon points="42,125 58,58 72,76 78,125" fill="#111827" opacity="0.55" />
          <Polygon points="78,125 88,30 104,68 108,125" fill="#1F2937" opacity="0.75" />
          <Polygon points="108,125 122,46 144,125" fill="#1F2937" opacity="0.65" />

          <Polygon points="58,58 51,73 61,67 69,78" fill="#F8FAFC" opacity="0.95" />
          <Polygon points="88,30 78,52 91,45 101,62" fill="#F8FAFC" opacity="0.98" />
          <Polygon points="122,46 112,65 124,58 132,74" fill="#F8FAFC" opacity="0.9" />

          <Path
            d="M12 122 L28 92 L42 105 L58 58 L72 76 L88 30 L104 68 L122 46 L140 122"
            stroke="#E5E7EB"
            strokeWidth="2"
            opacity="0.7"
            fill="none"
          />

          {marker !== null && (
            <>
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
          </>
          )}
        </Svg>
      </View>

      {value !== null && (
      <Text style={styles.trailPlace}>{getTrailPlace(value)}</Text>
      )}
    </View>
  );
}

function SunConfidenceCard({ value, onValueChange, disabled }) {
  const sliderWidth = 120;

  const updateConfidence = (x) => {
    if (disabled) return;

    const clampedX = Math.max(0, Math.min(x, sliderWidth));
    const newValue = Math.round((clampedX / sliderWidth) * 100);
    onValueChange(newValue);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: (event) => {
        updateConfidence(event.nativeEvent.locationX);
      },
      onPanResponderMove: (event) => {
        updateConfidence(event.nativeEvent.locationX);
      },
    })
  ).current;

  const displayValue = value ?? 0;
  const opacity = value === null ? 0.18 : 0.25 + displayValue / 135;
  const rayLength = 18 + displayValue * 0.28;
  const sunRadius = 24 + displayValue * 0.08;

  return (
    <View style={[styles.verticalCard, disabled && styles.disabledCard]}>
      <Text style={styles.cardTitleSmall}>4. CONFIDENCE</Text>
      <Text style={styles.questionSmall}>
        How strongly do you believe in yourself?
      </Text>

      <View style={styles.sunZone}>
        <Svg width={130} height={120} viewBox="0 0 130 120">
          {[...Array(16)].map((_, i) => {
            const angle = (i * Math.PI * 2) / 16;
            const x1 = 65 + Math.cos(angle) * (sunRadius + 6);
            const y1 = 55 + Math.sin(angle) * (sunRadius + 6);
            const x2 = 65 + Math.cos(angle) * (sunRadius + rayLength);
            const y2 = 55 + Math.sin(angle) * (sunRadius + rayLength);

            return (
              <Path
                key={i}
                d={`M${x1} ${y1} L${x2} ${y2}`}
                stroke="#FF8500"
                strokeWidth="2"
                opacity={opacity}
              />
            );
          })}

          <Circle cx="65" cy="55" r={sunRadius} fill="#FF8500" opacity={opacity} />
          <Circle
            cx="65"
            cy="55"
            r={sunRadius * 0.72}
            fill="#FFD27A"
            opacity={opacity}
          />

        </Svg>
      </View>

      <View style={styles.confidenceSlider} {...panResponder.panHandlers}>
        <View style={styles.confidenceTrack} />
        {value !== null && (
          <>
        <View style={[styles.confidenceFill, { width: `${value ?? 0}%` }]} />
        <View
          style={[
            styles.confidenceThumb,
            { left: `${Math.max(0, Math.min(value, 96))}%` },
          ]}
          
        />
        <Text
        style={[
          styles.confidencePercent,
          {
            left: `${Math.max(0, Math.min(value, 92))}%`,
          },
        ]}
      >
        {`${Math.round(value)}%`}
      </Text>
        </>
        )}
      </View>
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

  readOnlyBanner: {
    color: COLORS.orange,
    fontSize: 11,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.6,
  },

  cardsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },

  verticalCard: {
    flex: 1,
    minHeight: 230,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },

  disabledCard: {
    opacity: 0.82,
  },

  cardTitleSmall: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },

  questionSmall: {
    color: COLORS.muted,
    fontSize: 10,
    textAlign: "center",
    lineHeight: 13,
    marginTop: 4,
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

  mentalWord: {
    color: COLORS.orange,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0.8,
    textAlign: "center",
    marginTop: 8,
  },

  targetZone: {
    width: 155,
    height: 155,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  mountainZoneCompact: {
    width: 150,
    height: 135,
    alignItems: "center",
    justifyContent: "center",
  },

  trailPlace: {
    color: COLORS.orange,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.4,
    textAlign: "center",
    marginTop: 4,
  },

  sunZone: {
    width: 130,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },

  confidenceSlider: {
    width: 120,
    height: 28,
    justifyContent: "center",
  },

  confidenceTrack: {
    position: "absolute",
    width: "100%",
    height: 5,
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  confidenceFill: {
    position: "absolute",
    height: 5,
    borderRadius: 99,
    backgroundColor: COLORS.orange,
  },

  confidenceThumb: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.orange,
    borderWidth: 2,
    borderColor: "#FFD29A",
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

  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 24,
    marginBottom: 40,
  },

  continueButton: {
    flex: 1,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#FF8500",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },

  continueButtonText: {
    color: "#031018",
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    textAlign: "center",
  },

  cancelButton: {
    width: 110,
    height: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButtonText: {
    color: "#F5F5F5",
    fontSize: 14,
    fontWeight: "800",
    textAlign: "center",
  },
  confidencePercent: {
    position: "absolute",
    bottom: 22,
    color: "#FF8500",
    fontSize: 13,
    fontWeight: "900",
    marginLeft: -14,
  },
});