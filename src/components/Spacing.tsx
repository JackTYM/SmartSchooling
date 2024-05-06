import React from 'react';
import { DimensionValue, View } from 'react-native';
type SpacingProps = {
    height: DimensionValue;
};

const Spacing = (props: SpacingProps) => {
    return (
        <View style={{height: props.height}}></View>
    );
}

export default Spacing;