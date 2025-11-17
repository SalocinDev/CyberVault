import { styles } from '@/style/global';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, GestureResponderEvent, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

const screenWidth = Dimensions.get('window').width;

export default function Home() {
    type PasswordEntry = {
        id: number;
        website: string;
        email: string;
        password: string;
        category: string;
        dateAdded: string;
    };
    interface BreachEntry {
        id: number;
        email: string;
        breaches: string[];
        dateAdded: string;
    }
    const [photos, setPhotos] = useState(0);
    const [videos, setVideos] = useState(0);
    const [securedFiles, setSecuredFiles] = useState(0);
    const [passwordStored, setPasswordStored] = useState(0);
    const [breachDetections, setBreachDetections] = useState(0);
    const iconSize: number = 50;
    const router = useRouter();

    const loadSecuredPhotos = async () => {
        try {
            const stored = await SecureStore.getItemAsync('securedPhotos');
        if (stored) {
            const parsed = JSON.parse(stored);
            setPhotos(parsed.length);
        } else {
            setPhotos(0);
        }
        } catch (error) {
            console.error("Failed to load secured photos:", error);
        }
    };
    const loadSecuredVideos = async () => {
        try {
            const storedVideos = await SecureStore.getItemAsync('securedVideos');
            if (storedVideos) {
                const parsedVideos = JSON.parse(storedVideos);
                setVideos(parsedVideos.length);
            } else {
                setVideos(0);
            }
        } catch (error) {
            console.error("Failed to load secured videos:", error);
        }
    };
    const loadPasswords = async () => {
        try {
            const stored = await SecureStore.getItemAsync('passwords');
            const list: PasswordEntry[] = stored ? JSON.parse(stored) : [];

            setPasswordStored(list.length);
        } catch (error) {
            console.error('Failed to load passwords:', error);
        }
    };

    const loadBreaches = async () => {
          try {
            const stored = await SecureStore.getItemAsync("breach_searches");
            const list: BreachEntry[] = stored ? JSON.parse(stored) : [];
            const totalBreaches = list.reduce((acc, entry) => acc + (entry.breaches?.length || 0), 0);
            setBreachDetections(totalBreaches);
          } catch (error) {
            console.error("Failed to load breaches:", error);
          }
    };
    
    useEffect(() => {
        setSecuredFiles(photos + videos);
    }, [photos, videos]);

    useFocusEffect(
        useCallback(() => {
            loadSecuredPhotos();
            loadSecuredVideos();
            loadPasswords();
            loadBreaches();
        }, [])
    );

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
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <View style={styles.container}>

                <View style={styles.capsule}>
                    <Text style={styles.textWelcome}>Welcome to CyberVault!</Text>
                    <Text style={styles.textWelcomeSubtitle}>Your complete digital security solution</Text>
                </View>

                <View style={styles.capsuleContainerCenter}>
                    <View style={styles.capsuleChild}>

                        {/* File Symbol */}
                        <View style={styles.documentIcon}>
                        <Ionicons name="document-text-outline" size={iconSize} color="#BC13FE" />
                        </View>
                        
                        <Text style={styles.title}>{securedFiles}</Text>
                        <Text style={styles.subtitle}>Secured Media</Text>

                    </View>

                    <View style={styles.capsuleChild}>
                        {/* Key Symbol */}
                        <View style={styles.keyIcon}>
                        <Feather name="key" size={iconSize} color="#39FF14" />
                        </View>
                        <Text style={styles.title}>{passwordStored}</Text>
                        <Text style={styles.subtitle}>Passwords</Text>
                    </View>
                    <View style={styles.capsuleChild}>
                        {/* Detection Symbol */}
                        <View style={styles.breachIcon}>
                        <Ionicons name="warning-outline" size={iconSize} color="#FF073A" />
                        </View>
                        <Text style={styles.title}>{breachDetections}</Text>
                        <Text style={styles.subtitle}>Detections</Text>
                        
                    </View>
                </View>
                
                <View style={styles.capsuleContainerLeft}>
                    <Text style={styles.textWhite2}> Core Features: </Text>

                    <TouchableOpacity style={styles.vaultCard} onPress={handleGotoSecureStorage}>
                        <View style={styles.iconDocument}>
                        <Ionicons name="document-text-outline" size={iconSize} color="#BC13FE" />
                        </View>

                        <View style={styles.textContainer}>
                        <Text style={styles.title}>Secure Vault</Text>
                        <Text style={styles.subtitle}>End-to-end encrypted media storage with password protection</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity  style={styles.vaultCard} onPress={handleGotoPasswordManager}>

                        <View style={styles.iconKey}>
                        <Feather name="key" size={iconSize} color="#39FF14" />
                        </View>

                        <View style={styles.textContainer}>
                        <Text style={styles.title}>Password Manager</Text>
                        <Text style={styles.subtitle}>Generate, store, and manage strong passwords securely</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity  style={styles.vaultCard} onPress={handleGotoBreachDetection}>
                        <View style={styles.iconBreach}>
                        <Ionicons name="warning-outline" size={iconSize} color="#FF073A" />
                        </View>

                        <View style={styles.textContainer}>
                        <Text style={styles.title}>Breach Monitor</Text>
                        <Text style={styles.subtitle}>Real-time alerts when your data appears in breach</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}
