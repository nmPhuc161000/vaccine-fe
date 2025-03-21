import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, Text } from "react-native";
import HomeScreen from "./screens/HomeSreen";
import DetailScreen from "./screens/DetailsScreen";
import BookingScreen from "./screens/BookingScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LoginScreen from "./screens/LoginScreen";
import ServiceScreen from "./screens/ServiceScreen";
import TeamScreen from "./screens/TeamScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RegisterScreen from "./screens/RegisterScreen";
import { useNavigation } from "@react-navigation/native";
import UpdateChildProfileScreen from "./screens/UpdateChildProfileScreen";
import VacxinList from "./screens/VacxinList";
import AddBookingScreen from "./screens/AddBookingScreen";
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        animation: "fade",
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetailScreen"
        component={DetailScreen}
        options={{ title: "Chi tiết", tabBarStyle: { display: "none" } }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "Đăng ký" }}
      />
      <Stack.Screen
        name="UpdateChildProfile"
        component={UpdateChildProfileScreen}
        options={{ title: "Cập nhật hồ sơ trẻ em" }}
      />
      <Stack.Screen
        name="AddBooking"
        component={AddBookingScreen}
        options={{ title: "Đặt lịch" }}
      />
    </Stack.Navigator>
  );
};

const AuthStack = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="Login"
        options={({ navigation }) => ({
          title: "Đăng nhập",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="black" style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          ),
        })}
      >
        {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "Đăng ký" }}
      />
    </Stack.Navigator>
  );
};

const ProfileStack = ({ setIsLoggedIn }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ProfileMain"
        children={() => <ProfileScreen setIsLoggedIn={setIsLoggedIn} />}
      />
      <Stack.Screen
        name="UpdateChildProfile"
        component={UpdateChildProfileScreen}
        options={{ title: "Cập nhật hồ sơ trẻ em" }}
      />
    </Stack.Navigator>
  );
};

const BottomTabs = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: "home",
            Booking: "calendar",
            Profile: "person",
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarLabel: ({ focused, color }) => {
          const labels = {
            Home: "Trang chủ",
            Booking: "Đặt lịch",
            Profile: "Hồ sơ",
          };
          return (
            <Text style={{ color, fontSize: 12 }}>
              {labels[route.name]}
            </Text>
          );
        },
        tabBarButton: ({ onPress, ...props }) => (
          <TouchableOpacity
            {...props}
            onPress={(e) => {
              if (route.name === "Home") {
                onPress(e);
              } else if (isLoggedIn) {
                onPress(e);
              } else {
                navigation.navigate("Auth", { screen: "Login" });
              }
            }}
          />
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
          return {
            tabBarStyle: routeName === 'DetailScreen' ? { display: 'none' } : {},
          };
        }}
      />

      <Tab.Screen name="Booking" component={BookingScreen} />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        initialParams={{ setIsLoggedIn }}
      />
    </Tab.Navigator>
  );
};

const DrawerNavigator = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigation = useNavigation();

  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Home"
        options={{ title: "Trang chủ" }}
        listeners={{
          drawerItemPress: () => {
            // Reset trạng thái về tab Home trong BottomTabs
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: "Home",
                  state: {
                    routes: [{ name: "Home" }], // Reset về HomeScreen trong HomeStack
                  },
                },
              ],
            });
          },
        }}
      >
        {() => <BottomTabs isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
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
      <Drawer.Screen
        name="Auth"
        options={{ headerShown: false }}
      >
        {() => <AuthStack isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="VacxinList"
        component={VacxinList}
        options={{ title: "Danh mục vắc xin" }}
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