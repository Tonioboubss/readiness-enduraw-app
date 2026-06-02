import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "./screens/HomeScreen";
import CheckInScreen from "./screens/CheckInScreen";
import CheckOutScreen from "./screens/CheckOutScreen";
import DailyPrintScreen from "./screens/DailyPrintScreen";
import HistoryScreen from "./screens/HistoryScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#05070A" },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CheckIn" component={CheckInScreen} />
        <Stack.Screen name="CheckOut" component={CheckOutScreen} />
        <Stack.Screen name="DailyPrint" component={DailyPrintScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}