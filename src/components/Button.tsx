import React, { ReactNode } from 'react';
import { TouchableOpacity, Image, StyleSheet, StyleProp, ImageStyle } from 'react-native';

type ButtonProps = {
    image: any;
    navigation: any;
    page: string;
    style?: StyleProp<ImageStyle>;
    children?: ReactNode;
};

const Button = (props: ButtonProps) => {
    return (
        <TouchableOpacity
            key={2}
            style={[props.style, {borderWidth: 1, display: 'flex', justifyContent: 'center', alignItems: 'center'}]}
            onPress={() => props.navigation.navigate(props.page)}>
            <Image
                style={{ width: "100%", height: "100%"}}
                source={props.image}
            />
            {(props.children as ReactNode)}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({

});

export default Button;