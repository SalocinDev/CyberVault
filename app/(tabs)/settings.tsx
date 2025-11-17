import { styles } from '@/style/global';
import React from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function Settings() {
    
    return (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <View style={styles.container}>
                <Text style={styles.textWhite}> Settings Page </Text>
            </View>
        </ScrollView>
    );
}
