import React from "react";
import { NavigationContainer } from '@react-navigation/native'; 
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './Assets/Screens/SplashScreen'
import LoginScreen from './Assets/Screens/LoginScreen'
import SignupScreen from './Assets/Screens/SignupScreen'
import DashboardScreen from './Assets/Screens/DashboardScreen'
import StartConversation from './Assets/Screens/StartConversation'


const Stack = createNativeStackNavigator();
const App=()=>{

return(
   <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        {/* Auth Flow */}
        <Stack.Screen name="Splash" component={SplashScreen} />
         <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
           <Stack.Screen name="home" component={DashboardScreen} />
           <Stack.Screen name="InputOutput" component={StartConversation}/>
        
      </Stack.Navigator>
    </NavigationContainer>
);

}
export default App;
