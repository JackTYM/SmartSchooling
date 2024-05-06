import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Image, StyleSheet, StyleProp, TextInput, TextStyle } from 'react-native';
import { StoreData, GetData } from '../utils/Storage';
type InputProps = {
    jsonPath: string;
    style: StyleProp<TextStyle>;
};

const Input = (props: InputProps) => {
    const [inputValue, setInputValue] = useState(GetData(props.jsonPath));

    useEffect(() => {
        // Fetch the initial value from the external source and set it as the input value
        const initialValue = GetData(props.jsonPath);
        setInputValue(initialValue);
    }, [props.jsonPath]);

    return (
        <TextInput
            style={props.style}
            onChangeText={text => {
                StoreData(props.jsonPath, text);
                setInputValue(text);
            }}
            value={GetData(props.jsonPath)}
        />
    );
}

export default Input;