import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import {
    createNativeStackNavigator,
} from '@react-navigation/native-stack';

import Home from './Home';
import AcademicExperience from './AcademicExperience';
const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
    return (
        <NavigationContainer>
            <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Academic Experience" component={AcademicExperience} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;