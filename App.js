import React, { useState } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { Ionicons } from "@expo/vector-icons"

import HomeScreen from "./screens/HomeSreen"
import DetailScreen from "./screens/DetailsScreen"
import BookingScreen from "./screens/BookingScreen"
import ProfileScreen from "./screens/ProfileScreen"
import LoginScreen from "./screens/LoginScreen"
import ServiceScreen from "./screens/ServiceScreen"
import { GestureHandlerRootView } from "react-native-gesture-handler"

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
const Drawer = createDrawerNavigator()

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetailScreen"
        component={DetailScreen}
        options={{ title: "Chi tiết" }}
      />
    </Stack.Navigator>
  )
}

const BottomTabs = ({ isLoggedIn }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: "home",
            Booking: "calendar",
            Profile: "person",
            Login: "log-in",
          }
          return <Ionicons name={icons[route.name]} size={size} color={color} />
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Booking" component={BookingScreen} />
      {isLoggedIn ? (
        <Tab.Screen name="Profile" component={ProfileScreen} />
      ) : (
        <Tab.Screen name="Login" component={LoginScreen} />
      )}
    </Tab.Navigator>
  )
}

const DrawerNavigator = ({ isLoggedIn }) => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home">
        {() => <BottomTabs isLoggedIn={isLoggedIn} />}
      </Drawer.Screen>
      <Drawer.Screen name="Service" component={ServiceScreen} />
    </Drawer.Navigator>
  )
}

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <DrawerNavigator isLoggedIn={isLoggedIn} />
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}

export default App
