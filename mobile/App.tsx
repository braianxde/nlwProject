import React from 'react';
import { StatusBar} from 'react-native';
import { Roboto_400Regular, Roboto_500Medium} from '@expo-google-fonts/roboto';
import { Ubuntu_700Bold, useFonts} from '@expo-google-fonts/ubuntu';
import { AppLoading } from 'expo';

import Routes from './src/routes';

export default function App() {

  const [fonstLoaded] = useFonts({Ubuntu_700Bold, Roboto_400Regular, Roboto_500Medium});

  if(!fonstLoaded){
    return <AppLoading/>  
  }

  return (
    <>
    <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/>
    <Routes />
    </>
  );
}

