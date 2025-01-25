import React, { useRef, useState } from 'react';
import { Pressable, View } from 'react-native';

interface RadioButtonProps {
  isOnInit: boolean;
}

const RadioButton = ({ isOnInit }: RadioButtonProps) => {
  const [isOn, setIsOn] = useState(isOnInit);

  const toggleHandler = () => {
    console.log(isOn)
    console.log('pressed');
    setIsOn(!isOn);
  }

  return (
    <Pressable className="mt-6" onPress={ toggleHandler }>
      <View className={ `h-4 w-4 rounded-lg border-2 border-black-500 ${ isOn ? "bg-black" : "" }`} />
    </Pressable>
  )
}

export default RadioButton;