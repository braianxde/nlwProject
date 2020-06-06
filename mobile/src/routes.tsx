import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../src/pages/Home';
import Points from '../src/pages/Points';
import Detail from '../src/pages/Detail';

const appStack = createStackNavigator();

const Routes = () => {
    return (
        <NavigationContainer>
            <appStack.Navigator headerMode="none" screenOptions={{cardStyle: {backgroundColor: '#f0f0f5'}}}>
                <appStack.Screen name="Home" component={Home}/>
                <appStack.Screen name="Detail" component={Detail}/>
                <appStack.Screen name="Points" component={Points}/>
            </appStack.Navigator>
        </NavigationContainer>
    );
};

export default Routes;