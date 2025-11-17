import GeneralModal from '@/components/ui/general-modal';
import { styles } from '@/style/global';
import Entypo from '@expo/vector-icons/Entypo';
import Octicons from '@expo/vector-icons/Octicons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, GestureResponderEvent, Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from './ui/icon-symbol';

export default function Ribbon() {
    type ModalState = "Upload" | "Search" | "Options" | "";
    const iconSize: number = 50;
    const [modalVisible, setModalVisible] = useState(false);
    const [modalState, setModalState] = useState<ModalState>("");
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    const pickMedia = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Permission to access camera roll is required!");
            return;
        }
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsMultipleSelection: true,
                quality: 1,
            });
            if (!result.canceled) {
                const uris = result.assets.map(asset => asset.uri);
                setSelectedImages(uris);
            }
        } catch (error) {
            console.log("Error picking media:", error);
            Alert.alert("Error picking media");
        }
    };
    const handleUploadPress = () => {
        setSelectedImages([]);
        setModalVisible(true);
        setModalState("Upload");
    };
    const handleUpload = () => {
        Alert.alert('Upload Complete');
        setModalVisible(false);
    };
    function handleSettingsPress(event: GestureResponderEvent): void {
        router.push("/settings");
    }
    function handleSearchPress(event: GestureResponderEvent): void {
        router.push("/vault")
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
            <View style={styles.containerRibbon}>
             
                <View style={styles.textStack}>
                    <Text style={styles.titleLeft}>CyberVault</Text>
                    <Text style={styles.subtitleLeft}>Personal data protection app</Text>
                </View>
                
                <View style={{ marginLeft: 'auto', flexDirection: 'row', gap: 5 }}>
                    <Pressable onPress={handleUploadPress} style={styles.iconShroudIsolated}>
                        <Octicons name="upload" size={30} color="white" />
                    </Pressable>
                    <Pressable onPress={handleSearchPress} style={styles.iconShroud}>
                        <Entypo name="magnifying-glass" size={30} color="#ffffffff" />
                    </Pressable>
                    <Pressable onPress={handleSettingsPress} style={styles.iconShroud}>
                        <IconSymbol size={30} name="gear" color="#ffffffff" />
                    </Pressable>
                </View>
            </View>
            
            <GeneralModal visible={modalVisible} onClose={() => setModalVisible(false)}>
                {modalState === 'Upload' && (
                    <>
                        <Text style={styles.titleRibbon}>Upload</Text>
                        <TouchableOpacity style={styles.fileButton} onPress={pickMedia}>
                            <Text style={styles.blackButtonText}>Choose File</Text>
                        </TouchableOpacity>
                        {selectedImages.length > 0 ? (
                            <>
                                <FlatList
                                    data={selectedImages}
                                    keyExtractor={(item, index) => index.toString()}
                                    numColumns={2}
                                    style={styles.imagesContainer}
                                    showsVerticalScrollIndicator={true}
                                    contentContainerStyle={{ justifyContent: 'center', flexGrow: 0 }}
                                    renderItem={({ item }) => <Image source={{ uri: item }} style={styles.image} />}
                                />
                                <TouchableOpacity style={styles.blackButton} onPress={handleUpload}>
                                    <Text style={styles.blackButtonText}>Upload</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <Text style={styles.subtitleBlack}>No Images Selected</Text>
                        )}
                    </>
                )}
                {modalState === 'Search' && <Text style={styles.title}>{modalState}</Text>}
                {modalState === 'Options' && <Text style={styles.title}>{modalState}</Text>}
            </GeneralModal>
        </SafeAreaView>
    );
}