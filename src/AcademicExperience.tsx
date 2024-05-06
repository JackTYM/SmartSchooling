import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,

} from 'react-native';
import React, { useState } from 'react';
import Checkbox from '@react-native-community/checkbox';
import SelectDropdown from 'react-native-select-dropdown';

import Button from './components/Button';
import Input from './components/Input';
import Spacing from './components/Spacing';
import { GetData, StoreData } from './utils/Storage';

function AcademicExperience({ navigation }: any): React.JSX.Element {
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
  
    const updateClasses = (key: any, field: any, text: any) => {
      const newList = GetData("AcademicExperience.Classes").map((item: { key: any; }) => {
        if (item.key === key) {
          return { ...item, [field]: text };
        }
  
        return item;
      });

      StoreData("AcademicExperience.Classes", newList);
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
                  onChangeText={text => StoreData("AcademicExperience.Stats.GPA.Weighted", text)}
                  value={GetData("AcademicExperience.Stats.GPA.Weighted")}
                />
                <Text style={styles.label}>{'Weighted'}</Text>
              </View>
              <View style={styles.inputContainer} key={'Unweighted'}>
                <TextInput
                  style={styles.box}
                  onChangeText={text => StoreData("AcademicExperience.Stats.GPA.Unweighted", text)}
                  value={GetData("AcademicExperience.Stats.GPA.Unweighted")}
                />
                <Text style={styles.label}>{'Unweighted'}</Text>
              </View>
              <View style={styles.inputContainer} key={''}></View>
              <View style={styles.inputContainer} key={'9'}>
                <TextInput
                  style={styles.box}
                  onChangeText={text => StoreData("AcademicExperience.Stats.GPA.9", text)}
                  value={GetData("AcademicExperience.Stats.GPA.9")}
                />
                <Text style={styles.label}>{'9'}</Text>
              </View>
              <View style={styles.inputContainer} key={'10'}>
                <TextInput
                  style={styles.box}
                  onChangeText={text => StoreData("AcademicExperience.Stats.GPA.10", text)}
                  value={GetData("AcademicExperience.Stats.GPA.10")}
                />
                <Text style={styles.label}>{'10'}</Text>
              </View>
              <View style={styles.inputContainer} key={'11'}>
                <TextInput
                  style={styles.box}
                  onChangeText={text => StoreData("AcademicExperience.Stats.GPA.11", text)}
                  value={GetData("AcademicExperience.Stats.GPA.11")}
                />
                <Text style={styles.label}>{'11'}</Text>
              </View>
              <View style={styles.inputContainer} key={'12'}>
                <TextInput
                  style={styles.box}
                  onChangeText={text => StoreData("AcademicExperience.Stats.GPA.12", text)}
                  value={GetData("AcademicExperience.Stats.GPA.12")}
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
                  onChangeText={text => StoreData("AcademicExperience.Stats.ACT.Score", text)}
                  value={GetData("AcademicExperience.Stats.ACT.Score")}
                />
                <Text style={styles.label}>{'Score'}</Text>
              </View>
              <View style={styles.inputContainer} key={''}></View>
              <View style={styles.inputContainer} key={'English'}>
                <TextInput
                  style={styles.box}
                  onChangeText={text => StoreData("AcademicExperience.Stats.ACT.English", text)}
                  value={GetData("AcademicExperience.Stats.ACT.English")}
                />
                <Text style={styles.label}>{'English'}</Text>
              </View>
              <View style={styles.inputContainer} key={'Math'}>
                <TextInput
                  style={styles.box}
                  onChangeText={text => StoreData("AcademicExperience.Stats.ACT.Math", text)}
                  value={GetData("AcademicExperience.Stats.ACT.Math")}
                />
                <Text style={styles.label}>{'Math'}</Text>
              </View>
              <View style={styles.inputContainer} key={'Reading'}>
                <TextInput
                  style={styles.box}
                  onChangeText={text => StoreData("AcademicExperience.Stats.ACT.Reading", text)}
                  value={GetData("AcademicExperience.Stats.ACT.Reading")}
                />
                <Text style={styles.label}>{'Reading'}</Text>
              </View>
              <View style={styles.inputContainer} key={'Science'}>
                <TextInput
                  style={styles.box}
                  onChangeText={text => StoreData("AcademicExperience.Stats.ACT.Science", text)}
                  value={GetData("AcademicExperience.Stats.ACT.Science")}
                />
                <Text style={styles.label}>{'Science'}</Text>
              </View>
              <View style={styles.inputContainer} key={'Writing'}>
                <TextInput
                  style={styles.box}
                  onChangeText={text => StoreData("AcademicExperience.Stats.ACT.Writing", text)}
                  value={GetData("AcademicExperience.Stats.ACT.Writing")}
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
                  onChangeText={text => StoreData("AcademicExperience.Stats.SAT.Score", text)}
                  value={GetData("AcademicExperience.Stats.SAT.Score")}
                />
                <Text style={styles.label}>{'Score'}</Text>
              </View>
              <View style={styles.inputContainer} key={''}></View>
              <View style={styles.inputContainer} key={'Math'}>
                <TextInput
                  style={styles.box}
                  onChangeText={text => StoreData("AcademicExperience.Stats.SAT.Math", text)}
                  value={GetData("AcademicExperience.Stats.SAT.Math")}
                />
                <Text style={styles.label}>{'Math'}</Text>
              </View>
              <View style={styles.inputContainer} key={'Reading'}>
                <TextInput
                  style={styles.box}
                  onChangeText={text => StoreData("AcademicExperience.Stats.SAT.Reading", text)}
                  value={GetData("AcademicExperience.Stats.SAT.Reading")}
                />
                <Text style={styles.label}>{'Reading'}</Text>
              </View>
              <View style={styles.inputContainer} key={'Writing'}>
                <TextInput
                  style={styles.box}
                  onChangeText={text => StoreData("AcademicExperience.Stats.SAT.Writing", text)}
                  value={GetData("AcademicExperience.Stats.SAT.Writing")}
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
  
            {GetData("AcademicExperience.Classes").map((elective: { key: React.Key | null | undefined; name: string | undefined; isAp: any; gradeOrScore: any; }, index: number) => (
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
                  onValueChange={(checked: any) =>
                    updateClasses(elective.key, 'isAp', checked)
                  }
                />
                <SelectDropdown
                  data={['A', 'B', 'C', 'D', 'F']}
                  onSelect={(selectedItem: any, _: any) => {
                    updateClasses(elective.key, 'gradeOrScore', selectedItem);
                  }}
                  defaultButtonText={elective.gradeOrScore}
                  buttonStyle={[styles.dropdownButton, { width: '15%' }]}
                  buttonTextAfterSelection={(selectedItem: any, _: any) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item: any, _: any) => {
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

const styles = StyleSheet.create({
    label: {
        fontSize: 24,
        fontWeight: 'bold',
        marginRight: 10,
        marginLeft: 10,
        marginTop: "10%",
    },
    inputContainer: {
        flexDirection: 'column',
        marginHorizontal: 2,
        marginBottom: 10,
        alignItems: 'center',
    },
    box: {
        borderWidth: 1,
        borderColor: '#000',
        padding: 10,
        width: 50,
        textAlign: 'center',
    },
    container: {
        width: 355,
        height: 355,
        justifyContent: 'center'
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
      title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
      },
      inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
      electiveRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
      },
      electiveBox: {
        flex: 1,
      },
      checkbox: {
        margin: 15,
        width: 30,
        height: 30,
      },
      dropdownButton: {
        width: '30%',
        height: 40,
        backgroundColor: '#FFF',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#000',
      },
      addButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
      },
      addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
      },
});

export default AcademicExperience;