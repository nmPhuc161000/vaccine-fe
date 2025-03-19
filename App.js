import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "./screens/HomeSreen"; 
import DetailScreen from "./screens/DetailsScreen";
import BookingScreen from "./screens/BookingScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LoginScreen from "./screens/LoginScreen";
import ServiceScreen from "./screens/ServiceScreen";
import TeamScreen from "./screens/TeamScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RegisterScreen from "./screens/RegisterScreen"

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

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
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "Đăng ký" }}
      />
    </Stack.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }} // Ẩn header nếu không cần thiết
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "Đăng ký" }} // Hiển thị tiêu đề "Đăng ký"
      />
    </Stack.Navigator>
  );
};

const BottomTabs = ({ isLoggedIn, setIsLoggedIn }) => {
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
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
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
        <Tab.Screen
          name="Profile"
          children={() => <ProfileScreen setIsLoggedIn={setIsLoggedIn} />}
        />
      ) : (
        <Tab.Screen
          name="Login"
          children={() => <AuthStack />} // Sử dụng AuthStack thay vì LoginScreen
        />
      )}
    </Tab.Navigator>
  );
};

const DrawerNavigator = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen 
        name="Home" 
        options={{ title: "Trang chủ" }}
      >
        {() => <BottomTabs isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}
      </Drawer.Screen>
      <Drawer.Screen 
        name="ServiceGuide" 
        component={ServiceScreen} 
        options={{ title: "Cẩm nang tiêm phòng" }} 
      />
      <Drawer.Screen 
        name="Team" 
        component={TeamScreen} 
        options={{ title: "Đội ngũ chuyên gia" }} 
      />
    </Drawer.Navigator>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <DrawerNavigator isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;