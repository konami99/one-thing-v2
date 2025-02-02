import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useRouter } from 'expo-router'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { getUserData } from '../services/userService'
import { LogBox } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import "../global.css"

LogBox.ignoreLogs(['Warning: TNodeChildrenRenderer', 'Warning: MemoizedTNodeRenderer', 'Warning: TRenderEngineProvider']); // Ignore log notification by message

const _layout = () => {
	const [isConnected, setConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthProvider>
      <MainLayout />
			{!isConnected && (
        <View className='flex flex-1 w-full bottom-0 bg-[#b52424] absolute items-center justify-center pb-1.5 px-2'>
          <Text className='text-[#fff] text-center font-bold text-2xl'>
            You are offline
          </Text>
          <Text className='text-[#fff] text-center'>
            Try connect with internet or come back later
          </Text>
        </View>
      )}
    </AuthProvider>
  )
}

const MainLayout = ()=>{
	const {setAuth, setUserData} = useAuth();
	const router = useRouter();

	useEffect(() => {
		// triggers automatically when auth state changes
		supabase.auth.onAuthStateChange((_event, session) => {
		console.log('session: ', session);
		if (session) {
			setAuth(session?.user);
			updateUserData(session?.user); // update user like image, phone, bio
			router.replace("./home");
		} else {
			setAuth(null);
			router.replace('../welcome')
		}
		})
	}, []);

	const updateUserData = async (user: any)=>{
		let res = await getUserData(user.id);
		if(res.success) setUserData(res.data);
	}

	return (
		<Stack 
			screenOptions={{
				headerShown: false
			}}
		/>
	)
}

export default _layout