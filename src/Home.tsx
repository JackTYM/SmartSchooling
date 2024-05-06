import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import React, { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';

import Button from './components/Button';
import Input from './components/Input';
import Spacing from './components/Spacing';
import { GetData, StoreData } from './utils/Storage';

function Home({ navigation }: any): React.JSX.Element {
    const pickImage = async () => {
        await launchImageLibrary(
            {
                mediaType: 'photo',
                selectionLimit: 1,
            },
            response => {
                if (!response.didCancel && response.assets![0].uri) {
                    StoreData("ProfilePicture", response.assets![0].uri)
                }
            },
        );
    };

    return (
        <>
            <View style={[{ alignItems: 'center', justifyContent: 'center' }]}>
                <Spacing height="5%" />
                <View style={styles.header}>
                    <TouchableOpacity onPress={pickImage}>
                        <Image style={styles.profilePic} source={{ uri: GetData("ProfilePicture") }} />
                    </TouchableOpacity>
                    <View style={styles.textContainer}>
                        <Input
                            style={styles.name}
                            jsonPath='Name'
                        />
                        <Input
                            style={styles.details}
                            jsonPath='School'
                        />
                        <View style={styles.yearContainer}>
                            <Text style={styles.yearText}>Class Of </Text>
                            <Input
                                style={[styles.details]}
                                jsonPath='Year'
                            />
                        </View>
                    </View>
                </View>

                <Spacing height="5%" />

                <View style={[styles.container, { display: 'flex', justifyContent: 'center', alignItems: 'center' }]}>
                    <TouchableOpacity style={[styles.button, { position: "absolute", width: 200, height: 200, bottom: 175, right: 175 }]} onPress={() => navigation.navigate('Academic Experience')}>
                        <Image
                            style={{ width: "100%", height: "100%" }}
                            source={require('./assets/AcademicExperience.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, { position: "absolute", width: 200, height: 200, bottom: 175, left: 175 }]}>
                        <Image
                            style={{ width: "100%", height: "100%" }}
                            source={require('./assets/Extracurriculars.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, { position: "absolute", width: 200, height: 200, top: 175, right: 175 }]}>
                        <Image
                            style={{ width: "100%", height: "100%" }}
                            source={require('./assets/CommunityService.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, { position: "absolute", width: 200, height: 200, top: 175, left: 175 }]}>
                        <Image
                            style={{ width: "100%", height: "100%" }}
                            source={require('./assets/WorkExperience.png')}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, { position: "absolute", width: 125, height: 125 }]}>
                        <Image
                            style={{ width: "100%", height: "100%" }}
                            source={require('./assets/SmartAI.png')}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -10
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 30,
    },
    profilePic: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#000',
        marginRight: 15,
    },
    textContainer: {
        flexDirection: 'column',
        justifyContent: 'space-around',
    },
    yearContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    yearText: {
        fontSize: 18,
        color: '#555',
    },
    container: {
        width: 355,
        height: 355,
        justifyContent: 'center'
    },
    flex: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    aiImageStyle: {
        width: 125,
        height: 125,
    },
    aiText: {
        textAlign: 'center',
        color: 'grey',
        fontSize: 13,
        fontWeight: 'bold',
        top: "-60%",
    },
    aiContainer: {
        position: 'absolute',
        left: '50%',
        top: '50%'
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    details: {
        fontSize: 18,
        color: '#555',
    },
});

export default Home;