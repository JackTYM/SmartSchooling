import React, { useState, useEffect, useRef } from 'react';
import {
    // SafeAreaView,
    ScrollView,
    //StatusBar,
    StyleSheet,
    Text,
    View,
    // useColorScheme,
    TouchableOpacity,
    TextInput,
    Image,
    Button,
    ActivityIndicator,
    DimensionValue,
} from 'react-native';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import {
    createNativeStackNavigator,
} from '@react-navigation/native-stack';
import SelectDropdown from 'react-native-select-dropdown';
import Checkbox from '@react-native-community/checkbox';
import { captureRef } from 'react-native-view-shot';
import Share, { Social } from 'react-native-share';
import { launchImageLibrary } from 'react-native-image-picker';
import { FFmpegKit } from 'ffmpeg-kit-react-native';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import AcademicExperienceImage from './logos/AcademicExperience.png';
import CommunityServiceImage from './logos/CommunityService.png';
import ExtracurricularsImage from './logos/Extracurriculars.png';
import WorkExperienceImage from './logos/WorkExperience.png';
import Icon from 'react-native-vector-icons/FontAwesome';

var storageJson = {
    Name: 'NAME',
    School: 'SCHOOL',
    Year: '2024',
    ProfilePicture:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png',
    AcademicExperience: {
        Classes: [
            {
                key: Date.now(),
                value: '',
                name: '',
                type: '',
                gradeOrScore: 'A',
                isAp: false,
            },
        ],
        Stats: {
            GPA: {
                Weighted: '',
                Unweighted: '',
                9: '',
                10: '',
                11: '',
                12: '',
            },
            ACT: {
                Score: '',
                English: '',
                Math: '',
                Reading: '',
                Science: '',
                Writing: '',
            },
            SAT: {
                Score: '',
                Math: '',
                Reading: '',
                Writing: '',
            },
        },
    },
    Extracurriculars: {
        Clubs: [{ key: Date.now() + 1, value: '', name: '', role: '' }],
        Sports: [{ key: Date.now() + 2, value: '', type: '' }],
        Arts: [{ key: Date.now() + 3, value: '', type: '' }],
    },
    CommunityService: [
        { key: Date.now() + 4, value: '', hours: '0', location: '' },
        { key: Date.now() + 5, value: '', hours: '0', location: '' },
        { key: Date.now() + 6, value: '', hours: '0', location: '' },
        { key: Date.now() + 7, value: '', hours: '0', location: '' },
    ],
    WorkExperience: {
        Experiences: [
            {
                key: Date.now() + 8,
                value: '',
                jobTitle: '',
                start: '',
                end: '',
            },
        ],
        Skills: [
            {
                key: Date.now() + 9,
                value: '',
                skill: '',
                expertise: 'Beginner',
            },
        ],
    },
};

const calculateTotalHours = () => {
    let sum = 0;
    storageJson.CommunityService.forEach(item => {
        sum += Number(item.hours);
    });
    return sum;
};

const storeData = async () => {
    try {
        const jsonValue = JSON.stringify(storageJson);
        await AsyncStorage.setItem('@FBLAStorage', jsonValue);
    } catch (e) {
        // saving error
        console.error('Error storing data', e);
    }
};

// Function to get data
const getData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@FBLAStorage');
        if (jsonValue != null) {
            storageJson = JSON.parse(jsonValue);
        }
    } catch (e) {
        // error reading value
        console.error('Error retrieving data', e);
    }
};

getData();

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen
                    name="AcademicExperience"
                    component={AcademicExperience}
                />
                <Stack.Screen
                    name="Extracurriculars"
                    component={Extracurriculars}
                />
                <Stack.Screen
                    name="CommunityService"
                    component={CommunityService}
                />
                <Stack.Screen name="WorkExperience" component={WorkExperience} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

type SpacingProps = {
    height: DimensionValue;
};

const Spacing = (props: SpacingProps) => {
    return (
        <View style={{ height: props.height }}></View>
    );
}

function Home({ navigation }: any): React.JSX.Element {
    const [name, setName] = useState(storageJson.Name);
    const [school, setSchool] = useState(storageJson.School);
    const [year, setYear] = useState(storageJson.Year);
    const [profilePicUri, setProfilePicUri] = useState(
        storageJson.ProfilePicture,
    );

    async () => {
        await getData();
        setName(storageJson.Name);
        setSchool(storageJson.School);
        setYear(storageJson.Year);
        setProfilePicUri(storageJson.ProfilePicture);
    }

    const pickImage = async () => {
        await launchImageLibrary(
            {
                mediaType: 'photo',
                selectionLimit: 1,
            },
            response => {
                if (!response.didCancel && response.assets![0].uri) {
                    setProfilePicUri(response.assets![0].uri);
                    storageJson.ProfilePicture = response.assets![0].uri;
                }
            },
        );
    };

    const renderRef = useRef<View>(null);

    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
        }
    }, [isFocused]);

    const [isLoading, setIsLoading] = useState(false);

    return (
        <>
            <View style={styles.shareHeader}>
                {isLoading && <ActivityIndicator size="large" color="#0000ff" style={{ marginRight: 10 }} />}
                <TouchableOpacity onPress={async () => {
                    setIsLoading(true);
                    const imageExport = 'file://' + await captureRef(renderRef, {
                        format: 'png',
                        quality: 1,
                    });

                    Image.getSize(imageExport, async (width, height) => {
                        const cropHeight = width * 5 / 4
                        const videoDuration = 10; // Duration in seconds
                        const videoHeight = 1350; // Height of the video
                        const scrollDistance = height - videoHeight;
                        const scrollSpeed = scrollDistance / videoDuration;

                        const outputFileName = 'output.mp4';
                        const outputPath = `${RNFS.TemporaryDirectoryPath}/${outputFileName}`;

                        const ffmpegCommand = `-y -loop 1 -i ${imageExport} -vf "crop=${width}:${cropHeight}:0:t*${scrollSpeed}" -t ${videoDuration} -c:v libx264 -pix_fmt yuv420p ${outputPath}`;

                        try {
                            setIsLoading(true);
                            let result = await FFmpegKit.execute(ffmpegCommand);
                            const returnCode = await result.getReturnCode()
                            console.log("FFmpeg process completed with return code: ", returnCode);

                            //await CameraRoll.save(outputPath, {type: "video"})

                            await Share.open({
                                url: outputPath,
                                type: 'video/mp4',
                            });

                        } catch (error) {
                            console.error("Error running FFmpeg", error);
                        }
                        setIsLoading(false);
                    });
                }}>
                    <Icon name="share-alt" size={35} color="black" style={{ marginRight: 10 }} />
                </TouchableOpacity>
                <TouchableOpacity onPress={async () => {
                    const imageExport = 'file://' + await captureRef(renderRef, {
                        format: 'png',
                        quality: 1,
                    });

                    Image.getSize(imageExport, async (width, height) => {
                        const cropHeight = width * 5 / 4
                        const videoDuration = 10; // Duration in seconds
                        const videoHeight = 1350; // Height of the video
                        const scrollDistance = height - videoHeight;
                        const scrollSpeed = scrollDistance / videoDuration;

                        const outputFileName = 'output.mp4';
                        const outputPath = `${RNFS.TemporaryDirectoryPath}/${outputFileName}`;

                        const ffmpegCommand = `-y -loop 1 -i ${imageExport} -vf "crop=${width}:${cropHeight}:0:t*${scrollSpeed}" -t ${videoDuration} -c:v libx264 -pix_fmt yuv420p ${outputPath}`;

                        try {
                            setIsLoading(true);
                            let result = await FFmpegKit.execute(ffmpegCommand);
                            const returnCode = await result.getReturnCode()
                            console.log("FFmpeg process completed with return code: ", returnCode);

                            await Share.shareSingle({
                                url: outputPath,
                                social: Social.Instagram,
                                type: 'video/mp4',
                            });

                        } catch (error) {
                            console.error("Error running FFmpeg", error);
                        }
                        setIsLoading(false);
                    });
                }}>
                    <Icon name="instagram" size={35} color="black" style={{ marginRight: 10 }} />
                </TouchableOpacity>
            </View >
            <View style={[{ alignItems: 'center', justifyContent: 'center' }]}>
                <Spacing height="5%" />
                <View style={homestyles.header}>
                    <TouchableOpacity onPress={pickImage}>
                        <Image style={styles.profilePic} source={{ uri: profilePicUri }} />
                    </TouchableOpacity>
                    <View style={homestyles.textContainer}>
                        <TextInput
                            style={styles.name}
                            onChangeText={text => {
                                setName(text);
                                storageJson.Name = text;
                                storeData();
                            }}
                            value={storageJson.Name}
                        />
                        <TextInput
                            style={styles.details}
                            onChangeText={text => {
                                setSchool(text);
                                storageJson.School = text;
                                storeData();
                            }}
                            value={school}
                        />
                        <View style={styles.yearContainer}>
                            <Text style={styles.yearText}>Class Of </Text>
                            <TextInput
                                style={[styles.details]}
                                onChangeText={text => {
                                    setYear(text);
                                    storageJson.Year = text;
                                    storeData();
                                }}
                                value={year}
                            />
                        </View>
                    </View>
                </View>

                <Spacing height="5%" />

                <View style={[homestyles.container, { display: 'flex', justifyContent: 'center', alignItems: 'center' }]}>
                    <TouchableOpacity style={[homestyles.button, { position: "absolute", width: 200, height: 200, bottom: 175, right: 175 }]} onPress={() => navigation.navigate('AcademicExperience')}>
                        <Image
                            style={{ width: "100%", height: "100%" }}
                            source={require('./assets/AcademicExperience.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={[homestyles.button, { position: "absolute", width: 200, height: 200, bottom: 175, left: 175 }]} onPress={() => navigation.navigate('Extracurriculars')}>
                        <Image
                            style={{ width: "100%", height: "100%" }}
                            source={require('./assets/Extracurriculars.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={[homestyles.button, { position: "absolute", width: 200, height: 200, top: 175, right: 175 }]} onPress={() => navigation.navigate('CommunityService')}>
                        <Image
                            style={{ width: "100%", height: "100%" }}
                            source={require('./assets/CommunityService.png')}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={[homestyles.button, { position: "absolute", width: 200, height: 200, top: 175, left: 175 }]} onPress={() => navigation.navigate('WorkExperience')}>
                        <Image
                            style={{ width: "100%", height: "100%" }}
                            source={require('./assets/WorkExperience.png')}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <>
                <View
                    ref={renderRef}
                    style={{ marginTop: '100%', backgroundColor: 'white' }}>
                    <View style={styles.header}>
                        <TouchableOpacity>
                            <Image style={styles.profilePic} source={{ uri: profilePicUri }} />
                        </TouchableOpacity>
                        <View style={styles.textContainer}>
                            <Text style={styles.name}>{name}</Text>
                            <Text style={styles.details}>{school}</Text>
                            <View style={styles.yearContainer}>
                                <Text style={styles.yearText}>Class Of </Text>
                                <Text style={[styles.details]}>{year}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <View style={styles.section}>
                            <Text style={styles.title}>Cumulative GPA</Text>
                            <View style={styles.inputRow}>
                                <View style={styles.inputContainer} key={'Weighted'}>
                                    <Text>{storageJson.AcademicExperience.Stats.GPA.Weighted}</Text>
                                    <Text style={styles.label}>{'Weighted'}</Text>
                                </View>
                                <View style={styles.inputContainer} key={'Unweighted'}>
                                    <Text>
                                        {storageJson.AcademicExperience.Stats.GPA.Unweighted}
                                    </Text>
                                    <Text style={styles.label}>{'Unweighted'}</Text>
                                </View>
                                <View style={styles.inputContainer} key={''}></View>
                                <View style={styles.inputContainer} key={'9'}>
                                    <Text>{storageJson.AcademicExperience.Stats.GPA[9]}</Text>
                                    <Text style={styles.label}>{'9'}</Text>
                                </View>
                                <View style={styles.inputContainer} key={'10'}>
                                    <Text>{storageJson.AcademicExperience.Stats.GPA[10]}</Text>
                                    <Text style={styles.label}>{'10'}</Text>
                                </View>
                                <View style={styles.inputContainer} key={'11'}>
                                    <Text>{storageJson.AcademicExperience.Stats.GPA[11]}</Text>
                                    <Text style={styles.label}>{'11'}</Text>
                                </View>
                                <View style={styles.inputContainer} key={'12'}>
                                    <Text>{storageJson.AcademicExperience.Stats.GPA[12]}</Text>
                                    <Text style={styles.label}>{'12'}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.title}>ACT Score</Text>
                            <View style={styles.inputRow}>
                                <View style={styles.inputContainer} key={'Score'}>
                                    <Text>{storageJson.AcademicExperience.Stats.ACT.Score}</Text>
                                    <Text style={styles.label}>{'Score'}</Text>
                                </View>
                                <View style={styles.inputContainer} key={''}></View>
                                <View style={styles.inputContainer} key={'English'}>
                                    <Text>
                                        {storageJson.AcademicExperience.Stats.ACT.English}
                                    </Text>
                                    <Text style={styles.label}>{'English'}</Text>
                                </View>
                                <View style={styles.inputContainer} key={'Math'}>
                                    <Text>{storageJson.AcademicExperience.Stats.ACT.Math}</Text>
                                    <Text style={styles.label}>{'Math'}</Text>
                                </View>
                                <View style={styles.inputContainer} key={'Reading'}>
                                    <Text>
                                        {storageJson.AcademicExperience.Stats.ACT.Reading}
                                    </Text>
                                    <Text style={styles.label}>{'Reading'}</Text>
                                </View>
                                <View style={styles.inputContainer} key={'Science'}>
                                    <Text>
                                        {storageJson.AcademicExperience.Stats.ACT.Science}
                                    </Text>
                                    <Text style={styles.label}>{'Science'}</Text>
                                </View>
                                <View style={styles.inputContainer} key={'Writing'}>
                                    <Text>
                                        {storageJson.AcademicExperience.Stats.ACT.Writing}
                                    </Text>
                                    <Text style={styles.label}>{'Writing'}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.title}>SAT Score</Text>
                            <View style={styles.inputRow}>
                                <View style={styles.inputContainer} key={'Score'}>
                                    <Text>{storageJson.AcademicExperience.Stats.SAT.Score}</Text>
                                    <Text style={styles.label}>{'Score'}</Text>
                                </View>
                                <View style={styles.inputContainer} key={''}></View>
                                <View style={styles.inputContainer} key={'Math'}>
                                    <Text>{storageJson.AcademicExperience.Stats.SAT.Math}</Text>
                                    <Text style={styles.label}>{'Math'}</Text>
                                </View>
                                <View style={styles.inputContainer} key={'Reading'}>
                                    <Text>
                                        {storageJson.AcademicExperience.Stats.SAT.Reading}
                                    </Text>
                                    <Text style={styles.label}>{'Reading'}</Text>
                                </View>
                                <View style={styles.inputContainer} key={'Writing'}>
                                    <Text>
                                        {storageJson.AcademicExperience.Stats.SAT.Writing}
                                    </Text>
                                    <Text style={styles.label}>{'Writing'}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <View style={styles.section}>
                            <Text style={styles.title}>Classes</Text>
                            <View style={styles.electiveLabelRow}>
                                <Text style={[{ fontSize: 12 }, styles.electiveLabel]}>
                                    Class Name
                                </Text>
                                <Text style={[{ fontSize: 12 }, styles.apLabel]}>AP</Text>
                                <Text style={[{ fontSize: 12 }, styles.gradeLabel]}>
                                    Letter Grade
                                </Text>
                            </View>

                            {storageJson.AcademicExperience.Classes.map((elective, _) => (
                                <View style={styles.electiveRow} key={elective.key}>
                                    <Text style={{ width: 40, flex: 1, padding: 10 }}>
                                        {elective.name}
                                    </Text>
                                    <Checkbox
                                        style={[styles.checkbox, { width: 30, marginRight: 15 }]}
                                        value={elective.isAp}
                                    />
                                    <Text style={[{ width: '15%', textAlign: 'center' }]}>
                                        {elective.gradeOrScore}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        <View style={styles.section}>
                            <Text style={styles.title}>Clubs</Text>
                            <View style={styles.electiveLabelRow}>
                                <Text style={[{ fontSize: 12 }, styles.clubLabel]}>Name</Text>
                                <Text style={[{ fontSize: 12 }, styles.positionLabel]}>
                                    Position
                                </Text>
                            </View>

                            {storageJson.Extracurriculars.Clubs.map((club, _) => (
                                <View style={styles.electiveRow} key={club.key}>
                                    <Text>{club.value}</Text>
                                    <Text
                                        style={[{ marginRight: 5, width: '40%', textAlign: 'center' }]}>
                                        {club.role}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.title}>Sports</Text>
                            <View style={styles.electiveLabelRow}>
                                <Text style={[{ fontSize: 12 }, styles.clubLabel]}>Name</Text>
                            </View>

                            {storageJson.Extracurriculars.Sports.map((sport, _) => (
                                <View style={styles.electiveRow} key={sport.key}>
                                    <Text>{sport.value}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.title}>The Arts</Text>
                            <View style={styles.electiveLabelRow}>
                                <Text style={[{ fontSize: 12 }, styles.clubLabel]}>Name</Text>
                            </View>

                            {storageJson.Extracurriculars.Arts.map((art, _) => (
                                <View style={styles.electiveRow} key={art.key}>
                                    <Text>{art.value}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    <View style={styles.section}>
                        <View style={styles.section}>
                            <Text style={styles.title}>Community Service</Text>
                            <View style={styles.electiveLabelRow}>
                                <Text style={[{ fontSize: 12 }, styles.companyLabel]}>
                                    Contribution
                                </Text>
                                <Text style={[{ fontSize: 12 }, styles.locLabel]}>Location</Text>
                                <Text style={[{ fontSize: 12 }, styles.hoursLabel]}>Hours</Text>
                            </View>

                            {storageJson.CommunityService.map((experience, _) => (
                                <View style={styles.electiveRow} key={experience.key}>
                                    <Text style={{ flex: 1, textAlign: 'left' }}>
                                        {experience.value}
                                    </Text>
                                    <Text
                                        style={{
                                            width: '40%',
                                            marginHorizontal: 5,
                                            textAlign: 'center',
                                        }}>
                                        {experience.location}
                                    </Text>
                                    <Text style={{ width: '10%', textAlign: 'center' }}>
                                        {experience.hours}
                                    </Text>
                                </View>
                            ))}
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text>Total Service Hours: </Text>
                                <Text style={{ marginLeft: 10 }}>{calculateTotalHours()}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.section}>
                        <View style={styles.section}>
                            <Text style={styles.title}>Employment</Text>

                            {storageJson.WorkExperience.Experiences.map((experience, _) => (
                                <View style={[{ marginBottom: 30 }]}>
                                    <View style={styles.electiveLabelRow}>
                                        <Text style={[{ fontSize: 12, width: '35%' }]}>Company</Text>
                                        <Text style={[{ fontSize: 12 }, styles.startLabel]}>Start</Text>
                                    </View>
                                    <View style={styles.electiveRow} key={experience.key}>
                                        <Text style={styles.companyBox}>{experience.value}</Text>
                                        <Text style={[styles.startBox, { textAlign: 'center' }]}>
                                            {experience.start}
                                        </Text>
                                    </View>
                                    <View style={styles.electiveLabelRow}>
                                        <Text style={[{ fontSize: 12, width: '35%' }]}>Job Title</Text>
                                        <Text style={[{ fontSize: 12 }, styles.endLabel]}>End</Text>
                                    </View>
                                    <View style={styles.electiveRow} key={experience.key + '2'}>
                                        <Text style={styles.companyBox}>{experience.jobTitle}</Text>
                                        <Text style={[styles.endBox, { textAlign: 'center' }]}>
                                            {experience.end}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.section}>
                            <Text style={styles.title}>Skills</Text>

                            {storageJson.WorkExperience.Skills.map((skill, _) => (
                                <View style={styles.electiveRow} key={skill.key}>
                                    <Text style={{ width: '60%' }}>{skill.value}</Text>
                                    <Text style={{ textAlign: 'center' }}>{skill.expertise}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </>
        </>
    );
}

const homestyles = StyleSheet.create({
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

function AcademicExperience(): React.JSX.Element {
    const [classes, setClasses] = useState(
        storageJson.AcademicExperience.Classes,
    );
    const [stats, setStats] = useState(storageJson.AcademicExperience.Stats);

    const addToList = (list: any, setList: any) => {
        setList([
            ...list,
            {
                key: Date.now(),
                name: '',
                type: '',
                role: '',
                value: '',
                gradeOrScore: 'A',
                isAp: false,
            },
        ]);
    };

    const updateStats = () => {
        storeData();
        setStats({ ...storageJson.AcademicExperience.Stats });
    };

    const updateClasses = (key: any, field: any, text: any) => {
        const newList = classes.map(item => {
            if (item.key === key) {
                return { ...item, [field]: text };
            }

            return item;
        });

        setClasses(newList);
        storageJson.AcademicExperience.Classes = newList;
        storeData();
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.section}>
                    <Text style={styles.title}>Cumulative GPA</Text>
                    <View style={styles.inputRow}>
                        <View style={styles.inputContainer} key={'Weighted'}>
                            <TextInput
                                style={styles.box}
                                onChangeText={text => {
                                    storageJson.AcademicExperience.Stats.GPA.Weighted = text;
                                    updateStats();
                                }}
                                value={stats.GPA.Weighted}
                            />
                            <Text style={styles.label}>{'Weighted'}</Text>
                        </View>
                        <View style={styles.inputContainer} key={'Unweighted'}>
                            <TextInput
                                style={styles.box}
                                onChangeText={text => {
                                    storageJson.AcademicExperience.Stats.GPA.Unweighted = text;
                                    updateStats();
                                }}
                                value={stats.GPA.Unweighted}
                            />
                            <Text style={styles.label}>{'Unweighted'}</Text>
                        </View>
                        <View style={styles.inputContainer} key={''}></View>
                        <View style={styles.inputContainer} key={'9'}>
                            <TextInput
                                style={styles.box}
                                onChangeText={text => {
                                    storageJson.AcademicExperience.Stats.GPA[9] = text;
                                    updateStats();
                                }}
                                value={stats.GPA[9]}
                            />
                            <Text style={styles.label}>{'9'}</Text>
                        </View>
                        <View style={styles.inputContainer} key={'10'}>
                            <TextInput
                                style={styles.box}
                                onChangeText={text => {
                                    storageJson.AcademicExperience.Stats.GPA[10] = text;
                                    updateStats();
                                }}
                                value={stats.GPA[10]}
                            />
                            <Text style={styles.label}>{'10'}</Text>
                        </View>
                        <View style={styles.inputContainer} key={'11'}>
                            <TextInput
                                style={styles.box}
                                onChangeText={text => {
                                    storageJson.AcademicExperience.Stats.GPA[11] = text;
                                    updateStats();
                                }}
                                value={stats.GPA[11]}
                            />
                            <Text style={styles.label}>{'11'}</Text>
                        </View>
                        <View style={styles.inputContainer} key={'12'}>
                            <TextInput
                                style={styles.box}
                                onChangeText={text => {
                                    storageJson.AcademicExperience.Stats.GPA[12] = text;
                                    updateStats();
                                }}
                                value={stats.GPA[12]}
                            />
                            <Text style={styles.label}>{'12'}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.title}>ACT Score</Text>
                    <View style={styles.inputRow}>
                        <View style={styles.inputContainer} key={'Score'}>
                            <TextInput
                                style={styles.box}
                                onChangeText={text => {
                                    storageJson.AcademicExperience.Stats.ACT.Score = text;
                                    updateStats();
                                }}
                                value={stats.ACT.Score}
                            />
                            <Text style={styles.label}>{'Score'}</Text>
                        </View>
                        <View style={styles.inputContainer} key={''}></View>
                        <View style={styles.inputContainer} key={'English'}>
                            <TextInput
                                style={styles.box}
                                onChangeText={text => {
                                    storageJson.AcademicExperience.Stats.ACT.English = text;
                                    updateStats();
                                }}
                                value={stats.ACT.English}
                            />
                            <Text style={styles.label}>{'English'}</Text>
                        </View>
                        <View style={styles.inputContainer} key={'Math'}>
                            <TextInput
                                style={styles.box}
                                onChangeText={text => {
                                    storageJson.AcademicExperience.Stats.ACT.Math = text;
                                    updateStats();
                                }}
                                value={stats.ACT.Math}
                            />
                            <Text style={styles.label}>{'Math'}</Text>
                        </View>
                        <View style={styles.inputContainer} key={'Reading'}>
                            <TextInput
                                style={styles.box}
                                onChangeText={text => {
                                    storageJson.AcademicExperience.Stats.ACT.Reading = text;
                                    updateStats();
                                }}
                                value={stats.ACT.Reading}
                            />
                            <Text style={styles.label}>{'Reading'}</Text>
                        </View>
                        <View style={styles.inputContainer} key={'Science'}>
                            <TextInput
                                style={styles.box}
                                onChangeText={text => {
                                    storageJson.AcademicExperience.Stats.ACT.Science = text;
                                    updateStats();
                                }}
                                value={stats.ACT.Science}
                            />
                            <Text style={styles.label}>{'Science'}</Text>
                        </View>
                        <View style={styles.inputContainer} key={'Writing'}>
                            <TextInput
                                style={styles.box}
                                onChangeText={text => {
                                    storageJson.AcademicExperience.Stats.ACT.Writing = text;
                                    updateStats();
                                }}
                                value={stats.ACT.Writing}
                            />
                            <Text style={styles.label}>{'Writing'}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.title}>SAT Score</Text>
                    <View style={styles.inputRow}>
                        <View style={styles.inputContainer} key={'Score'}>
                            <TextInput
                                style={styles.box}
                                onChangeText={text => {
                                    storageJson.AcademicExperience.Stats.SAT.Score = text;
                                    updateStats();
                                }}
                                value={stats.SAT.Score}
                            />
                            <Text style={styles.label}>{'Score'}</Text>
                        </View>
                        <View style={styles.inputContainer} key={''}></View>
                        <View style={styles.inputContainer} key={'Math'}>
                            <TextInput
                                style={styles.box}
                                onChangeText={text => {
                                    storageJson.AcademicExperience.Stats.SAT.Math = text;
                                    updateStats();
                                }}
                                value={stats.SAT.Math}
                            />
                            <Text style={styles.label}>{'Math'}</Text>
                        </View>
                        <View style={styles.inputContainer} key={'Reading'}>
                            <TextInput
                                style={styles.box}
                                onChangeText={text => {
                                    storageJson.AcademicExperience.Stats.SAT.Reading = text;
                                    updateStats();
                                }}
                                value={stats.SAT.Reading}
                            />
                            <Text style={styles.label}>{'Reading'}</Text>
                        </View>
                        <View style={styles.inputContainer} key={'Writing'}>
                            <TextInput
                                style={styles.box}
                                onChangeText={text => {
                                    storageJson.AcademicExperience.Stats.SAT.Writing = text;
                                    updateStats();
                                }}
                                value={stats.SAT.Writing}
                            />
                            <Text style={styles.label}>{'Writing'}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.title}>Classes</Text>
                    <View style={styles.electiveLabelRow}>
                        <Text style={[{ fontSize: 12 }, styles.electiveLabel]}>
                            Class Name
                        </Text>
                        <Text style={[{ fontSize: 12 }, styles.apLabel]}>AP</Text>
                        <Text style={[{ fontSize: 12 }, styles.gradeLabel]}>
                            Letter Grade
                        </Text>
                    </View>

                    {classes.map((elective, index) => (
                        <View style={styles.electiveRow} key={elective.key}>
                            <TextInput
                                style={[styles.box, styles.electiveBox]}
                                onChangeText={text => updateClasses(elective.key, 'name', text)}
                                value={elective.name}
                                placeholder={`Elective ${index + 1}`}
                            />
                            <Checkbox
                                style={styles.checkbox}
                                value={elective.isAp}
                                onValueChange={checked =>
                                    updateClasses(elective.key, 'isAp', checked)
                                }
                            />
                            <SelectDropdown
                                data={['A', 'B', 'C', 'D', 'F']}
                                onSelect={(selectedItem, _) => {
                                    updateClasses(elective.key, 'gradeOrScore', selectedItem);
                                }}
                                buttonStyle={[styles.dropdownButton, { width: '15%' }]}
                                buttonTextAfterSelection={(selectedItem, _) => {
                                    return selectedItem;
                                }}
                                rowTextForSelection={(item, _) => {
                                    return item;
                                }}
                                defaultValue={elective.gradeOrScore}
                            />
                        </View>
                    ))}
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => addToList(classes, setClasses)}>
                        <Text style={styles.addButtonText}>Add Elective</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

function Extracurriculars(): React.JSX.Element {
    // State for each extracurricular category
    const [clubs, setClubs] = useState(storageJson.Extracurriculars.Clubs);
    const [sports, setSports] = useState(storageJson.Extracurriculars.Sports);
    const [arts, setArts] = useState(storageJson.Extracurriculars.Arts);

    const addToList = (list: any, setList: any) => {
        setList([
            ...list,
            { key: Date.now(), name: '', type: '', role: '', value: '' },
        ]);
    };

    const updateList = (
        list: any,
        setList: any,
        key: any,
        field: any,
        text: any,
    ) => {
        const newList = list.map((item: any) => {
            if (item.key === key) {
                return { ...item, [field]: text };
            }

            return item;
        });
        setList(newList);
    };

    useEffect(() => {
        storageJson.Extracurriculars.Clubs = clubs;
        storeData();
    }, [clubs]);

    useEffect(() => {
        storageJson.Extracurriculars.Sports = sports;
        storeData();
    }, [sports]);

    useEffect(() => {
        storageJson.Extracurriculars.Arts = arts;
        storeData();
    }, [arts]);

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.section}>
                    <Text style={styles.title}>Clubs</Text>
                    <View style={styles.electiveLabelRow}>
                        <Text style={[{ fontSize: 12 }, styles.clubLabel]}>Name</Text>
                        <Text style={[{ fontSize: 12 }, styles.positionLabel]}>Position</Text>
                    </View>

                    {clubs.map((club, index) => (
                        <View style={styles.electiveRow} key={club.key}>
                            <TextInput
                                style={[styles.box, styles.electiveBox]}
                                onChangeText={text =>
                                    updateList(clubs, setClubs, club.key, 'value', text)
                                }
                                value={club.value}
                                placeholder={`Club ${index + 1}`}
                            />
                            <SelectDropdown
                                data={[
                                    'Member',
                                    'Treasurer',
                                    'Secretary',
                                    'Historian',
                                    'President',
                                    'Vice President',
                                ]}
                                onSelect={(selectedItem, _) => {
                                    updateList(clubs, setClubs, club.key, 'role', selectedItem);
                                }}
                                defaultButtonText="Position"
                                defaultValueByIndex={0}
                                buttonStyle={[styles.positionButton, { width: '40%' }]}
                                buttonTextAfterSelection={(selectedItem, _) => {
                                    return selectedItem;
                                }}
                                rowTextForSelection={(item, _) => {
                                    return item;
                                }}
                                defaultValue={club.role}
                            />
                        </View>
                    ))}
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => addToList(clubs, setClubs)}>
                        <Text style={styles.addButtonText}>Add Club</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.title}>Sports</Text>
                    <View style={styles.electiveLabelRow}>
                        <Text style={[{ fontSize: 12 }, styles.clubLabel]}>Name</Text>
                    </View>

                    {sports.map((sport, index) => (
                        <View style={styles.electiveRow} key={sport.key}>
                            <TextInput
                                style={[styles.box, styles.electiveBox]}
                                onChangeText={text =>
                                    updateList(sports, setSports, sport.key, 'value', text)
                                }
                                value={sport.value}
                                placeholder={`Sport ${index + 1}`}
                            />
                        </View>
                    ))}
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => addToList(sports, setSports)}>
                        <Text style={styles.addButtonText}>Add Sport</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.title}>The Arts</Text>
                    <View style={styles.electiveLabelRow}>
                        <Text style={[{ fontSize: 12 }, styles.clubLabel]}>Name</Text>
                    </View>

                    {arts.map((art, index) => (
                        <View style={styles.electiveRow} key={art.key}>
                            <TextInput
                                style={[styles.box, styles.electiveBox]}
                                onChangeText={text =>
                                    updateList(arts, setArts, art.key, 'value', text)
                                }
                                value={art.value}
                                placeholder={`Art ${index + 1}`}
                            />
                        </View>
                    ))}
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => addToList(arts, setArts)}>
                        <Text style={styles.addButtonText}>Add Art</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

function CommunityService(): React.JSX.Element {
    // State for each extracurricular category
    const [experiences, setExperiences] = useState(storageJson.CommunityService);

    const [totalHours, setTotalHours] = useState(0);

    const addToList = (list: any, setList: any) => {
        setList([...list, { key: Date.now(), hours: '0', location: '', value: '' }]);
    };

    const updateList = (
        list: any,
        setList: any,
        key: any,
        field: any,
        text: any,
    ) => {
        const newList = list.map((item: any) => {
            if (item.key === key) {
                return { ...item, [field]: text };
            }

            return item;
        });
        setList(newList);
    };

    useEffect(() => {
        storageJson.CommunityService = experiences;
        storeData();
    }, [experiences]);

    // useEffect to update total hours when the array changes
    useEffect(() => {
        setTotalHours(calculateTotalHours());
    }, [experiences]);

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.section}>
                    <Text style={styles.title}>Service</Text>
                    <View style={styles.electiveLabelRow}>
                        <Text style={[{ fontSize: 12 }, styles.companyLabel]}>
                            Contribution
                        </Text>
                        <Text style={[{ fontSize: 12 }, styles.locLabel]}>Location</Text>
                        <Text style={[{ fontSize: 12 }, styles.hoursLabel]}>Hours</Text>
                    </View>

                    {experiences.map((experience, index) => (
                        <View style={styles.electiveRow} key={experience.key}>
                            <TextInput
                                style={[styles.box, styles.electiveBox]}
                                onChangeText={text =>
                                    updateList(
                                        experiences,
                                        setExperiences,
                                        experience.key,
                                        'value',
                                        text,
                                    )
                                }
                                value={experience.value}
                                placeholder={`Experience ${index + 1}`}
                            />
                            <TextInput
                                style={[styles.box, styles.locationBox]}
                                onChangeText={text =>
                                    updateList(
                                        experiences,
                                        setExperiences,
                                        experience.key,
                                        'location',
                                        text,
                                    )
                                }
                                value={experience.location}
                                placeholder={``}
                            />
                            <TextInput
                                style={[styles.box, styles.hoursBox]}
                                keyboardType="numeric"
                                onChangeText={text =>
                                    updateList(
                                        experiences,
                                        setExperiences,
                                        experience.key,
                                        'hours',
                                        text,
                                    )
                                }
                                value={experience.hours}
                                placeholder={'0'}
                                maxLength={2}
                            />
                        </View>
                    ))}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text>Total Service Hours: </Text>
                        <Text style={{ marginLeft: 10 }}>{totalHours}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => addToList(experiences, setExperiences)}>
                        <Text style={styles.addButtonText}>Add Experience</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

function WorkExperience(): React.JSX.Element {
    // State for each extracurricular category
    const [experiences, setExperiences] = useState(
        storageJson.WorkExperience.Experiences,
    );
    const [skills, setSkills] = useState(storageJson.WorkExperience.Skills);

    const addToList = (list: any, setList: any) => {
        setList([
            ...list,
            {
                key: Date.now(),
                duties: '',
                start: '',
                end: '',
                skill: '',
                expertise: 'Beginner',
            },
        ]);
    };

    const updateList = (
        list: any,
        setList: any,
        key: any,
        field: any,
        text: any,
    ) => {
        const newList = list.map((item: any) => {
            if (item.key === key) {
                return { ...item, [field]: text };
            }

            return item;
        });
        setList(newList);
    };

    useEffect(() => {
        storageJson.WorkExperience.Experiences = experiences;
        storeData();
    }, [experiences]);

    useEffect(() => {
        storageJson.WorkExperience.Skills = skills;
        storeData();
    }, [skills]);

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.section}>
                    <Text style={styles.title}>Employment</Text>

                    {experiences.map((experience, index) => (
                        <View style={[{ marginBottom: 30 }]}>
                            <View style={styles.electiveLabelRow}>
                                <Text style={[{ fontSize: 12, width: '35%' }]}>Company</Text>
                                <Text style={[{ fontSize: 12 }, styles.startLabel]}>Start</Text>
                            </View>
                            <View style={styles.electiveRow} key={experience.key}>
                                <TextInput
                                    style={[styles.box, styles.companyBox]}
                                    onChangeText={text =>
                                        updateList(
                                            experiences,
                                            setExperiences,
                                            experience.key,
                                            'value',
                                            text,
                                        )
                                    }
                                    value={experience.value}
                                    placeholder={`Company ${index + 1}`}
                                />
                                <TextInput
                                    style={[styles.box, styles.startBox, { fontSize: 10 }]}
                                    onChangeText={text =>
                                        updateList(
                                            experiences,
                                            setExperiences,
                                            experience.key,
                                            'start',
                                            text,
                                        )
                                    }
                                    value={experience.start}
                                    keyboardType="numeric"
                                    maxLength={4}
                                    placeholder={`2023`}
                                />
                            </View>
                            <View style={styles.electiveLabelRow}>
                                <Text style={[{ fontSize: 12, width: '35%' }]}>Job Title</Text>
                                <Text style={[{ fontSize: 12 }, styles.endLabel]}>End</Text>
                            </View>
                            <View style={styles.electiveRow} key={experience.key + '2'}>
                                <TextInput
                                    style={[styles.box, styles.companyBox]}
                                    onChangeText={text =>
                                        updateList(
                                            experiences,
                                            setExperiences,
                                            experience.key,
                                            'jobTitle',
                                            text,
                                        )
                                    }
                                    value={experience.jobTitle}
                                    placeholder={`Job Title`}
                                />
                                <TextInput
                                    style={[styles.box, styles.endBox, { fontSize: 10 }]}
                                    onChangeText={text =>
                                        updateList(
                                            experiences,
                                            setExperiences,
                                            experience.key,
                                            'end',
                                            text,
                                        )
                                    }
                                    value={experience.end}
                                    keyboardType="numeric"
                                    maxLength={4}
                                    placeholder={`2024`}
                                />
                            </View>
                        </View>
                    ))}
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => addToList(experiences, setExperiences)}>
                        <Text style={styles.addButtonText}>Add Employment</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.title}>Skills</Text>

                    {skills.map((skill, index) => (
                        <View style={styles.electiveRow} key={skill.key}>
                            <TextInput
                                style={[styles.box, { width: '60%' }]}
                                onChangeText={text =>
                                    updateList(skills, setSkills, skill.key, 'value', text)
                                }
                                value={skill.value}
                                placeholder={`Skill ${index + 1}`}
                            />
                            <SelectDropdown
                                data={['Beginner', 'Intermediate', 'Advanced', 'Expert']}
                                onSelect={(selectedItem, _) => {
                                    updateList(
                                        skills,
                                        setSkills,
                                        skill.key,
                                        'expertise',
                                        selectedItem,
                                    );
                                }}
                                defaultButtonText="Expertise"
                                defaultValueByIndex={0}
                                buttonStyle={[styles.positionButton, { width: '40%' }]}
                                buttonTextAfterSelection={(selectedItem, _) => {
                                    return selectedItem;
                                }}
                                rowTextForSelection={(item, _) => {
                                    return item;
                                }}
                                defaultValue={skill.expertise}
                            />
                        </View>
                    ))}
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => addToList(skills, setSkills)}>
                        <Text style={styles.addButtonText}>Add Skill</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

// Define your StyleSheet here
const styles = StyleSheet.create({
    yearContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    yearText: {
        fontSize: 18,
        color: '#555',
    },
    shareHeader: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        marginBottom: -25,
        marginTop: 20
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
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    details: {
        fontSize: 18,
        color: '#555',
    },
    fillerSpace: {
        flex: 1, // This takes up all available space
    },
    sectionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 100, // Add some padding at the bottom
    },
    card: {
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#8bc4ea',
        borderRadius: 8,
        margin: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 25,
    },
    icon: {
        width: 100,
        height: 100,
    },
    sectionText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 10,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    yearSection: {
        marginVertical: 10,
    },
    yearTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    yearBoxes: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 5,
    },
    gpaSection: {
        marginVertical: 10,
    },
    gpaTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    gpaBoxes: {
        marginTop: 5,
        alignItems: 'center',
    },
    actSection: {
        marginVertical: 10,
    },
    actTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    actBoxes: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 5,
    },
    box: {
        borderWidth: 1,
        borderColor: '#000',
        padding: 10,
        width: 50,
        textAlign: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
    },
    yearInput: {
        borderWidth: 1,
        borderColor: '#000',
        padding: 10,
        marginRight: 5,
        flex: 2,
        textAlign: 'center',
    },
    schoolInput: {
        borderWidth: 1,
        borderColor: '#000',
        padding: 10,
        flex: 5,
        textAlign: 'center',
    },
    atText: {
        fontSize: 16,
        marginRight: 5,
    },
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    inputGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputContainer: {
        flexDirection: 'column',
        marginHorizontal: 2,
        marginBottom: 10,
        alignItems: 'center',
    },
    label: {
        fontSize: 10,
        marginTop: 4,
    },
    section: {
        marginBottom: 1,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    electiveBox: {
        flex: 1,
    },
    clubBox: {
        flex: 1,
    },
    addButton: {
        backgroundColor: '#215987',
        padding: 10,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    dropdownButton: {
        width: '30%',
        height: 40,
        backgroundColor: '#FFF',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#000',
    },
    apScoreBox: {
        borderWidth: 1,
        borderColor: '#000',
        padding: 10,
        width: 50,
        textAlign: 'center',
        marginBottom: 10,
        borderRadius: 4,
    },
    electiveContainer: {
        marginBottom: 20,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    electiveRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    flexInput: {
        flex: 1,
        marginRight: 10, // Add some margin for spacing between inputs
    },
    checkbox: {
        margin: 15,
        width: 30,
        height: 30,
    },
    electiveLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    electiveLabel: {
        flex: 1, // Adjust the flex values as needed
        textAlign: 'left',
    },
    apLabel: {
        width: 30,
        marginRight: 15,
        textAlign: 'center',
    },
    gradeLabel: {
        width: '15%', // Match the width of the dropdown
        textAlign: 'center',
    },
    clubLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    clubLabel: {
        flex: 1, // Adjust the flex values as needed
        textAlign: 'left',
    },
    positionLabel: {
        marginRight: 5,
        width: '40%',
        textAlign: 'center',
    },
    positionButton: {
        width: '30%',
        height: 40,
        backgroundColor: '#FFF',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#000',
        marginRight: 5,
    },
    companyLabel: {
        width: '50%',
        textAlign: 'left',
        marginRight: -5,
    },
    hoursLabel: {
        width: '10%',
        textAlign: 'center',
    },
    locLabel: {
        width: '40%',
        textAlign: 'center',
        marginRight: 5,
    },
    hoursBox: {
        width: '10%',
    },
    locationBox: {
        width: '40%',
        marginHorizontal: 5,
    },
    companyBox: {
        width: '65%',
    },
    dutiesBox: {
        width: '32%',
    },
    startBox: {
        width: '15%',
    },
    endBox: {
        width: '15%',
    },
    dutiesLabel: {
        width: '32%',
        textAlign: 'center',
        marginRight: 5,
    },
    startLabel: {
        width: '15%',
        textAlign: 'center',
        marginRight: 5,
    },
    endLabel: {
        width: '15%',
        textAlign: 'center',
    },
});

export default App;