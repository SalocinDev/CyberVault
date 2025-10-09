import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, TouchableOpacity, GestureResponderEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '@/style/global'

const screenWidth = Dimensions.get('window').width;

export default function Home() {
    const [securedFiles, setSecuredFiles] = useState(0)
    const [passwordStored, setPasswordStored] = useState(0)
    const [breachDetections, setBreachDetections] = useState(0)
    const iconSize: number = 50;
    const router = useRouter();

    function handleGotoSecureStorage(event: GestureResponderEvent): void {
        router.push('/vault');
    }
    function handleGotoPasswordManager(event: GestureResponderEvent): void {
        router.push('/passwords');
    }
    function handleGotoBreachDetection(event: GestureResponderEvent): void {
        router.push('/monitor');
    }
    return (
        <ScrollView style={styles.scrollView}contentContainerStyle={styles.scrollContent}>
            <View style={styles.container}>
                <View style={styles.capsule}>
                    <Text style={styles.textWelcome}>Welcome to CyberVault!</Text>
                    <Text style={styles.textWelcomeSubtitle}>Your complete digital security solution</Text>
                </View>
                <View style={styles.capsuleContainerCenter}>
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
                <View style={styles.capsuleContainerLeft}>
                    <Text style={styles.textBlack}> Core Features: </Text>
                    <TouchableOpacity style={styles.capsuleChildLeft} onPress={handleGotoSecureStorage}>
                        <IconSymbol size={iconSize} name="doc.text" color="#ffffffff" />
                        <Text style={styles.title}>Secure Vault</Text>
                        <Text style={styles.subtitle}>End-to-end encrypted media storage with password protection</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.capsuleChildLeft} onPress={handleGotoPasswordManager}>
                        <IconSymbol size={iconSize} name="key.fill" color="#ffffffff" />
                        <Text style={styles.title}>Password Manager</Text>
                        <Text style={styles.subtitle}>Generate, store, and manage strong passwords securely</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.capsuleChildLeft} onPress={handleGotoBreachDetection}>
                        <IconSymbol size={iconSize} name="alarm.fill" color="#ffffffff" />
                        <Text style={styles.title}>Breach Monitor</Text>
                        <Text style={styles.subtitle}>Real-time alerts when your data appears in breach</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
