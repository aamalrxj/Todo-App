import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../store';
import { restoreSession } from '../store/authSlice';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import TaskListScreen from '../screens/TaskListScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import { AuthStackParamList, AppStackParamList } from '../types/navigation';
import { colors } from '../utils/theme';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

const RootNavigator = () => {
  const dispatch = useAppDispatch();
  const { token, initializing } = useAppSelector(s => s.auth);

  // On startup, check whether the user is already logged in
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  // Show a spinner while we check for a saved session
  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token ? (
        // Logged in: show the app screens
        <AppStack.Navigator
  screenOptions={{
    headerStyle: { backgroundColor: colors.background },
    headerShadowVisible: false,
    headerTintColor: colors.primary,
    headerTitleStyle: { fontWeight: '800', color: colors.text },
    contentStyle: { backgroundColor: colors.background },
  }}>
  <AppStack.Screen name="Tasks" component={TaskListScreen} options={{ title: 'TaskFlow' }} />
  <AppStack.Screen name="AddTask" component={AddTaskScreen} options={{ title: 'New Task' }} />
</AppStack.Navigator>
      ) : (
        // Logged out: show login/register
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;