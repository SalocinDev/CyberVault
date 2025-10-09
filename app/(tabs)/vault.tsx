import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import { styles } from '@/style/global'

const screenWidth = Dimensions.get('window').width;

export default function Vault () {
    const [securedFiles, setSecuredFiles] = useState(0)
    const [passwordStored, setPasswordStored] = useState(0)
    const [breachDetections, setBreachDetections] = useState(0)

    const iconSize : number = 50;
    return (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <View style={styles.container}>
                <View style={styles.capsule}>
                    <Text style={styles.textWelcome}>Media Vault</Text>
                    <Text style={styles.textWelcomeSubtitle}>Secure storage for photos & videos</Text>
                    <View style={styles.capsuleCenter}>
                        <View style={styles.capsuleChild}>
                            <IconSymbol size={iconSize} name="doc.text" color="#ffffffff" />
                            <Text style={styles.title}>{securedFiles}</Text>
                            <Text style={styles.subtitle}>Secured Media</Text>
                        </View>
                        <View style={styles.capsuleChild}>
                            <IconSymbol size={iconSize} name="key.fill" color="#ffffffff" />
                            <Text style={styles.title}>{passwordStored}</Text>
                            <Text style={styles.subtitle}>Passwords</Text>
                        </View>
                        <View style={styles.capsuleChild}>
                            <IconSymbol size={iconSize} name="alarm.fill" color="#ffffffff" />
                            <Text style={styles.title}>{breachDetections}</Text>
                            <Text style={styles.subtitle}>Detections</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.containerLeft}>
                    <Text style={styles.textBlack}>My Albums</Text>
                </View>
            </View>
        </ScrollView>
    )
}