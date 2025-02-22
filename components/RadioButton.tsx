import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import { supabase } from '@/lib/supabase';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface RadioButtonProps {
  isOnInit: boolean;
  goalId: string;
  date: string;
  style: string;
}

const RadioButton = ({ isOnInit, goalId, date, style }: RadioButtonProps) => {
  const [isOn, setIsOn] = useState(isOnInit);
  const firstUpdate = useRef(true);

  const insertComplete = async () => {
    const { error } = await supabase
      .from('Complete')
      .insert({
        date,
        goalId,
      });
  }

  const deleteComplete = async () => {
    const { error } = await supabase
      .from('Complete')
      .delete()
      .eq('goalId', goalId)
      .eq('date', date);
  }

  const toggleHandler = async () => {
    if (isOn) {
      deleteComplete();
    } else {
      insertComplete();
    }

    setIsOn(!isOn);
  }

  return (
    <Pressable className={ style } onPress={ toggleHandler } hitSlop={ 20 }>
      {isOn ? <FontAwesome name="star" size={16} />
      : <View className={ `h-4 w-4 rounded-lg border-2 border-black-500`} />
      }
    </Pressable>
  )
}

export default RadioButton;