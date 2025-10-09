import React, { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as ImagePicker from 'expo-image-picker';
import { Button } from 'react-native';
import { FlatList } from 'react-native';
import { styles } from '@/style/global';

export default function Ribbon() {
    type ModalState = "Upload" | "Search" | "Options" | "";
    const iconSize: number = 50;
    const [modalVisible, setModalVisible] = useState(false);
    const [modalState, setModalState] = useState<ModalState>("");
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    const pickImages = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            Alert.alert("Permission to access camera roll is required!");
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            const uris = result.assets.map(asset => asset.uri);
            setSelectedImages(uris);
        }
    };

    const handleUploadPress = () => {
        setSelectedImages([]);
        setModalVisible(true);
        setModalState("Upload");
    };

    const handleSearchPress = () => {
        setModalVisible(true);
        setModalState("Search");
    };

    const handleOptionsPress = () => {
        setModalVisible(true);
        setModalState("Options");
    };

    const handleUpload = () => {
        Alert.alert('Upload Complete');
        setModalVisible(false);
    };

    function renderModalContent(state: string) {
        switch (state) {
            case "Upload":
                return (
                    <>
                        <Text style={styles.titleRibbon}>Upload</Text>
                        <TouchableOpacity style={styles.blackButton} onPress={pickImages}>
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
                                    renderItem={({ item }) => (
                                        <Image source={{ uri: item }} style={styles.image} />
                                    )}
                                />
                                <TouchableOpacity style={styles.blackButton} onPress={handleUpload}>
                                    <Text style={styles.blackButtonText}>Upload</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <Text style={styles.subtitleBlack}>No Images Selected</Text>
                        )}
                    </>
                );
            case "Search":
                return <Text style={styles.title}>{modalState}</Text>;
            case "Options":
                return <Text style={styles.title}>{modalState}</Text>;
            default:
                return <Text>Unknown modal state.</Text>;
        }
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
            <View style={styles.containerRibbon}>
                <View style={styles.textStack}>
                    <Text style={styles.titleLeft}>CyberVault</Text>
                    <Text style={styles.subtitleLeft}>Personal data protection app</Text>
                </View>
                <View style={{ marginLeft: 'auto', flexDirection: 'row', gap: 12 }}>
                    <Pressable onPress={handleUploadPress} style={styles.iconShroud}>
                        <IconSymbol size={iconSize} name="square.and.arrow.down.fill" color="#ffffffff" />
                    </Pressable>
                    <Pressable onPress={handleSearchPress} style={styles.iconShroud}>
                        <IconSymbol size={iconSize} name="magnifyingglass" color="#ffffffff" />
                    </Pressable>
                    <Pressable onPress={handleOptionsPress} style={styles.iconShroud}>
                        <IconSymbol size={iconSize} name="ellipsis" color="#ffffffff" />
                    </Pressable>
                </View>
            </View>
            <Modal
                visible={modalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                        <View style={styles.modalOverlayTouchableArea} />
                    </TouchableWithoutFeedback>
                    <View
                        style={styles.modalContent}
                        onStartShouldSetResponder={() => true}
                    >
                        {renderModalContent(modalState)}

                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <View>
                                <Text style={{ color: 'black', marginTop: 20 }}>Close</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}