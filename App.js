import React, { useState } from "react";

import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import CheckInScreen1 from "./screens/CheckInScreen1";
import CheckInScreen2 from "./screens/CheckInScreen2";
import CheckOutScreen from "./screens/CheckOutScreen";
import DailyPrintScreen from "./screens/DailyPrintScreen";
import HistoryScreen from "./screens/HistoryScreen";
import SessionModal from "./components/SessionModal";

const Stack = createNativeStackNavigator();

export default function App() {
  const [session, setSession] = useState(null);

  return (
    <>
      <SessionModal
        visible={!session}
        onSubmit={(value) => setSession(value)}
      />

      <NavigationContainer>
        <StatusBar style="light" />

        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#05070A" },
          }}
        >
          <Stack.Screen name="Home">
            {(props) => (
              <HomeScreen
                {...props}
                session={session}
                setSession={setSession}
              />
            )}
          </Stack.Screen>

          <Stack.Screen name="CheckIn1">
            {(props) => (
              <CheckInScreen1 {...props} session={session} />
            )}
          </Stack.Screen>

          <Stack.Screen name="CheckIn2">
            {(props) => (
              <CheckInScreen2 {...props} session={session} />
            )}
          </Stack.Screen>

          <Stack.Screen name="CheckOut">
            {(props) => (
              <CheckOutScreen {...props} session={session} />
            )}
          </Stack.Screen>

          <Stack.Screen name="DailyPrint">
            {(props) => (
              <DailyPrintScreen {...props} session={session} />
            )}
          </Stack.Screen>

          <Stack.Screen name="History">
            {(props) => (
              <HistoryScreen {...props} session={session} />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
/*
import React from "react";
import BackEndTestScreen from "./screens/BackEndTestScreen";

export default function App() {
  return <BackEndTestScreen />;
}*/