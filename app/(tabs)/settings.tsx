import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { supabase } from "@/lib/supabase"

export default function Tab() {
  const onLogout = async() => {
    const { error } = await supabase.auth.signOut();
    if ( error) {
      Alert.alert('Sign out', 'Error signing out')
    }
  }

  return (
    <View className='flex flex-1 justify-center items-center'>
      <Pressable onPress={onLogout}>
        <View>
          <Text>Sign out</Text>
        </View>
      </Pressable>
    </View>
  );
}
