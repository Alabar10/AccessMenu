import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MenuPage from './src/screens/MenuPage';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [userData, setUserData] = useState(null);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" options={{ headerShown: false }}>
          {props => (
            <LoginScreen
              {...props}
              onLoginSuccess={(user) => {
                setUserData(user);
                props.navigation.replace('Menu', { user });
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Register" options={{ title: 'Register' }}>
          {props => (
            <RegisterScreen
              {...props}
              onRegisterSuccess={() => props.navigation.goBack()}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Menu" options={{ headerShown: false }}>
          {props => <MenuPage {...props} user={props.route.params.user} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
