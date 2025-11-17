import GeneralModal from '@/components/ui/general-modal';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { styles } from '@/style/global';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { useVideoPlayer, VideoView } from 'expo-video';

export default function Vault() {
    type ModalState = "UploadPhoto" | "ViewPhoto" | "UploadVideo" | "ViewVideo" | "";
    type ModalOptionsState = "PhotoOptions" | "VideoOptions" | "";
    type ModalConfirmState = "ClearImages" | "ClearVideos" | "DeleteImage" | "DeleteVideo" | "";

    const [photosStored, setPhotosStored] = useState<number>(0);
    const [videosStored, setVideosStored] = useState<number>(0);

    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modalState, setModalState] = useState<ModalState>("");
    const [modalOptionsVisible, setModalOptionsVisible] = useState<boolean>(false);
    const [modalOptionsState, setModalOptionsState] = useState<ModalOptionsState>("");
    const [modalConfirmVisible, setModalConfirmVisible] = useState<boolean>(false);
    const [modalConfirmState, setModalConfirmState] = useState<ModalConfirmState>("");

    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
    const [photosUploaded, setPhotosUploaded] = useState<string[]>([]);
    const [videosUploaded, setVideosUploaded] = useState<string[]>([]);
    const [imageSelected, setImageSelected] = useState("");
    const [videoSelected, setVideoSelected] = useState<string>("");
    const [videoThumbnails, setVideoThumbnails] = useState<{ [key: string]: string }>({});
    const iconSize: number = 50;

    const loadSecuredPhotos = async () => {
        try {
        const stored = await SecureStore.getItemAsync('securedPhotos');
        if (stored) {
            const parsed = JSON.parse(stored);
            setPhotosUploaded(parsed);
            setPhotosStored(parsed.length);
        } else {
            setPhotosUploaded([]);
            setPhotosStored(0);
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
                setVideosUploaded(parsedVideos);
                setVideosStored(parsedVideos.length);
            } else {
                setVideosUploaded([]);
                setVideosStored(0);
            }
        } catch (error) {
            console.error("Failed to load secured videos:", error);
        }
    };

    useEffect(() => {
        loadSecuredPhotos();
        loadSecuredVideos();
    }, [photosUploaded, videosUploaded]);

    const player = useVideoPlayer(videoSelected, (player) => {
        player.play();
        player.loop = false;
    });

    const generateThumbnails = async (videos: string[]) => {
        const thumbs: { [key: string]: string } = { ...videoThumbnails };
        for (const uri of videos) {
            try {
            const { uri: thumbUri } = await VideoThumbnails.getThumbnailAsync(uri, { time: 0 });
            thumbs[uri] = thumbUri;
            } catch (e) {
            console.warn('Failed to generate thumbnail for', uri, e);
            thumbs[uri] = ''; // fallback
            }
        }
        setVideoThumbnails(thumbs);
    };

    useEffect(() => {
        const generateSelectedThumbnails = async () => {
            const thumbs: { [key: string]: string } = {};
            for (const uri of selectedVideos) {
            try {
                const { uri: thumbUri } = await VideoThumbnails.getThumbnailAsync(uri, { time: 0 });
                thumbs[uri] = thumbUri;
            } catch (e) {
                console.warn('Failed to generate thumbnail for', uri, e);
                thumbs[uri] = '';
            }
            }
            setVideoThumbnails(prev => ({ ...prev, ...thumbs }));
        };

        if (selectedVideos.length > 0) generateSelectedThumbnails();
    }, [selectedVideos]);

    useEffect(() => {
        loadSecuredVideos();
    }, [videosUploaded]);

    useEffect(() => {
        if (videosUploaded.length > 0) {
            generateThumbnails(videosUploaded);
        }
    }, [videosUploaded]);

    const pickImages = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert("Permission to access gallery is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            const uris = result.assets.map(asset => asset.uri);
            setSelectedImages(uris);

            // const text = uris.join(", ");
            // console.log(text);
        }
    };

    const pickVideos = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            Alert.alert("Permission to access gallery is required!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            const uris = result.assets.map(asset => asset.uri);
            setSelectedVideos(uris);
        }
    };

    const handleUpload = async () => {
        try {
            const stored = await SecureStore.getItemAsync('securedPhotos');
            const existing = stored ? JSON.parse(stored) : [];

            const updated = [...existing, ...selectedImages];

            await SecureStore.setItemAsync('securedPhotos', JSON.stringify(updated));

            setPhotosStored(updated.length);
            setSelectedImages([]);
            setModalVisible(false);

            Alert.alert('Upload Complete');
        } catch (error) {
            console.error("Failed to store images:", error);
            Alert.alert('Error saving photos');
        }
    };

    const handleUploadVideos = async () => {
        try {
            const stored = await SecureStore.getItemAsync('securedVideos');
            const existing = stored ? JSON.parse(stored) : [];

            const updated = [...existing, ...selectedVideos];
            await SecureStore.setItemAsync('securedVideos', JSON.stringify(updated));

            setVideosStored(updated.length);
            setSelectedVideos([]);
            setModalVisible(false);

            Alert.alert('Video Upload Complete');
        } catch (error) {
            console.error("Failed to store videos:", error);
            Alert.alert('Error saving videos');
        }
    };

    function openModal(state: ModalState) {
        setModalState(state);
        setModalVisible(true);
    }

    const clearVault = async () => {
        await SecureStore.deleteItemAsync('securedPhotos');
        setPhotosUploaded([]);
        setPhotosStored(0);
        Alert.alert('Vault cleared 🗑️');
    };

    const openImage = async () => {
        try {
            const isAvailable = await Sharing.isAvailableAsync();
            if (isAvailable) {
                await Sharing.shareAsync(imageSelected);
            } else {
                Alert.alert("Sharing not available on this device");
            }
        } catch (error) {
            // console.error("Failed to open image:", error);
            Alert.alert("Error", "Something went wrong while opening the image.");
        }
    };

    function handleImageTap(item: string): void {
        setImageSelected(item);
        setModalOptionsState("PhotoOptions");
        setModalOptionsVisible(true);
    }

    const deleteImage = async () => {
        try {
            const stored = await SecureStore.getItemAsync('securedPhotos');
            const existing = stored ? JSON.parse(stored) : [];

            const updated = existing.filter((img: string) => img !== imageSelected);

            await SecureStore.setItemAsync('securedPhotos', JSON.stringify(updated));

            setPhotosStored(updated.length);
            setSelectedImages(updated);
            setImageSelected("");
            setModalConfirmVisible(false);
            setModalOptionsVisible(false);
            Alert.alert('Deleted', 'The selected image has been removed.');
        } catch (error) {
            // console.error('Failed to delete image:', error);
            Alert.alert('Error', 'Something went wrong while deleting the image.');
        }
    };

    const clearImages = async () => {
        try {
            await SecureStore.deleteItemAsync('securedPhotos');
            setPhotosStored(0);
            setSelectedImages([]);
            setModalConfirmVisible(false);
            Alert.alert('Cleared', 'All images have been removed from the vault.');
        } catch (error) {
            Alert.alert('Error', 'Something went wrong while clearing the vault.');
            console.error('Failed to clear images:', error);
        }
    };

    const handleVideoTap = (videoUri: string) => {
        setVideoSelected(videoUri);
        setModalOptionsState("VideoOptions");
        setModalOptionsVisible(true);
    };

    const deleteVideo = async () => {
        try {
            const stored = await SecureStore.getItemAsync('securedVideos');
            const existing = stored ? JSON.parse(stored) : [];

            const updated = existing.filter((vid: string) => vid !== videoSelected);

            await SecureStore.setItemAsync('securedVideos', JSON.stringify(updated));

            setVideosStored(updated.length);
            setVideosUploaded(updated);
            setVideoSelected("");
            setModalConfirmVisible(false);
            setModalOptionsVisible(false);
            Alert.alert('Deleted', 'The selected video has been removed.');
        } catch (error) {
            Alert.alert('Error', 'Something went wrong while deleting the video.');
        }
    };

    const clearVideos = async () => {
        try {
            await SecureStore.deleteItemAsync('securedVideos');
            setVideosUploaded([]);
            setVideosStored(0);
            setModalConfirmVisible(false);
            Alert.alert('Cleared', 'All videos have been removed.');
        } catch (error) {
            Alert.alert('Error', 'Failed to clear videos');
        }
    };
    
    const handleConfirmClear = () => {
        setModalConfirmState("ClearImages");
        setModalConfirmVisible(true);
    }

    const handleConfirmDelete = () => {
        setModalConfirmState("DeleteImage");
        setModalConfirmVisible(true);
    }

    return (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <View style={styles.container}>

                <View style={styles.capsule}>
                    <Text style={styles.textWelcome}>Media Vault</Text>
                    <Text style={styles.textWelcomeSubtitle}>
                        Secure storage for photos & videos
                    </Text>

                    <View style={styles.capsuleCenter}>
                        <View style={styles.capsuleChildDocument}>
                            <View style={styles.documentIconVault}>
                            <FontAwesome name="photo" size={iconSize} color="white" />
                            </View>
                            <Text style={styles.title}>{photosStored}</Text>
                            <Text style={styles.subtitle}>Photos Stored</Text>
                        </View>
                        <View style={styles.capsuleChildKey}>
                            <View style={styles.keyIconVault}>
                            <Entypo name="folder-video" size={iconSize} color="white" />
                            </View>
                            <Text style={styles.title}>{videosStored}</Text>
                            <Text style={styles.subtitle}>Videos Stored</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.capsuleContainerLeftVault}>
                    <Text style={styles.textWhiteVault}>Core Features:</Text>

                    <View style={styles.capsuleCenter2}>
                        <TouchableOpacity style={styles.capsuleChild2} onPress={() => openModal("ViewPhoto")}>
                            <View style={styles.contentChildImage}>
                            <FontAwesome name="photo" size={iconSize} color="white" />
                            <Text style={styles.title}>View Photos</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.capsuleChild2} onPress={() => openModal("ViewVideo")}>
                            <View style={styles.contentChildVideo}>
                            <Entypo name="folder-video" size={iconSize} color="white" />
                            <Text style={styles.title}>View Videos</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.capsuleChild2} onPress={() => openModal("UploadPhoto")}>
                            <View style={styles.contentChildAddImage}>
                            <MaterialIcons name="add-photo-alternate" size={iconSize} color="white" />
                            <Text style={styles.title}>Add Photos</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.capsuleChild2} onPress={() => openModal("UploadVideo")}>
                            <View style={styles.contentChildAddVideo}>
                            <IconSymbol size={iconSize} name="video" color="#ffffffff" />
                            <Text style={styles.title}>Add Videos</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
            <GeneralModal visible={modalVisible} onClose={() => setModalVisible(false)}>
                {modalState === "UploadPhoto" && (
                    <>
                        <Text style={styles.titleRibbon}>Upload Photos</Text>
                        <TouchableOpacity style={styles.fileButton} onPress={pickImages}>
                            <Text style={styles.blackButtonText}>Choose Files</Text>
                        </TouchableOpacity>
                        {selectedImages.length > 0 ? (
                            <>
                                <FlatList
                                    data={videosUploaded}
                                    keyExtractor={(item, index) => index.toString()}
                                    numColumns={2}
                                    style={styles.imagesContainer}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => handleVideoTap(item)}>
                                        {videoThumbnails[item] ? (
                                            <Image
                                            source={{ uri: videoThumbnails[item] }}
                                            style={{ width: 120, height: 80, borderRadius: 8 }}
                                            />
                                        ) : (
                                            <View style={{ width: 120, height: 80, backgroundColor: '#444', borderRadius: 8 }} />
                                        )}
                                        <Text style={styles.subtitleBlack}>{item.split('/').pop()}</Text>
                                        </TouchableOpacity>
                                    )}
                                    />
                                <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
                                    <Text style={styles.blackButtonText}>Upload</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <Text style={styles.subtitleBlack}>No Images Selected</Text>
                        )}
                    </>
                )}
                {modalState === "ViewPhoto" && (
                <>
                <View style={styles.containerPhoto}>
                    <Text style={styles.titleRibbon}>Your Secured Photos</Text>
                    {photosStored > 0 ? (
                    <FlatList
                        data={photosUploaded}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}
                        style={styles.imagesContainer}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ justifyContent: 'center', flexGrow: 0 }}
                        renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleImageTap(item)}>
                            <Image source={{ uri: item }} style={styles.image} />
                        </TouchableOpacity>

                        )}
                    />
                    ) : (
                    <Text style={styles.subtitleBlack}>No secured photos yet</Text>
                    )}
                    </View>
                    
                    <TouchableOpacity style={styles.redButton} onPress={handleConfirmClear}>
                        
                            <Text style={styles.redButtonText}>Clear</Text>
                            <MaterialIcons name="clear" size={30} color="white" />
                        
                    </TouchableOpacity>
                </>
                )}
                {modalState === "ViewVideo" && (
                <>
                    <Text style={styles.titleRibbon}>Your Secured Videos</Text>
                    {videosStored > 0 ? (
                    <FlatList
                        data={videosUploaded}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}
                        style={styles.imagesContainer}
                        renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleVideoTap(item)}>
                            {videoThumbnails[item] ? (
                            <Image
                                source={{ uri: videoThumbnails[item] }}
                                style={{ width: 120, height: 80, borderRadius: 8 }}
                            />
                            ) : (
                            <View style={{ width: 120, height: 80, backgroundColor: '#444', borderRadius: 8, }}
                            />
                            )}
                            {/* <Text style={styles.subtitleBlack}>{item.split('/').pop()}</Text> */}
                        </TouchableOpacity>
                        )}
                    />
                    ) : (
                    <Text style={styles.subtitleBlack}>No secured videos yet</Text>
                    )}
                    <TouchableOpacity
                    style={styles.redButton}
                    onPress={() => {
                        setModalConfirmState("ClearVideos");
                        setModalConfirmVisible(true);
                    }}
                    >
                    <Text style={styles.redButtonText}>Clear All</Text>
                    </TouchableOpacity>
                </>
                )}
                {modalState === "UploadVideo" && (
                    <>
                        <Text style={styles.titleRibbon}>Upload Videos</Text>
                        <TouchableOpacity style={styles.fileButton} onPress={pickVideos}>
                            <Text style={styles.blackButtonText}>Choose Videos</Text>
                        </TouchableOpacity>
                        {selectedVideos.length > 0 ? (
                        <>
                            <FlatList
                            data={selectedVideos}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={2}
                            style={styles.imagesContainer}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => handleVideoTap(item)}>
                                {videoThumbnails[item] ? (
                                    <Image
                                    source={{ uri: videoThumbnails[item] }}
                                    style={{ width: 120, height: 80, borderRadius: 8 }}
                                    />
                                ) : (
                                    <View
                                    style={{ width: 120, height: 80, backgroundColor: '#444', borderRadius: 8 }}
                                    />
                                )}
                                {/* <Text style={styles.subtitleBlack}>{item.split('/').pop()}</Text> */}
                                </TouchableOpacity>
                            )}
                            />
                            <TouchableOpacity style={styles.blackButton} onPress={handleUploadVideos}>
                            <Text style={styles.blackButtonText}>Upload</Text>
                            </TouchableOpacity>
                        </>
                        ) : (
                        <Text style={styles.subtitleBlack}>No Videos Selected</Text>
                        )}
                    </>
                )}
                {modalState === "" && (
                    <Text style={styles.subtitleBlack}>Why are you here?</Text>
                )}
            </GeneralModal>

            <GeneralModal visible={modalOptionsVisible} onClose={() => setModalOptionsVisible(false)}>
                {modalOptionsState === "PhotoOptions" && (
                    <>
                        <Text style={styles.titleRibbon}>Photo Options</Text>
                        <View style={styles.imagesContainer}>
                            <Image source={{ uri: imageSelected }} style={styles.imageBig} />
                        </View>
                        <TouchableOpacity style={styles.blackButton} onPress={openImage}>
                            <Text style={styles.blackButtonText}>Open Image</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.redButton} onPress={handleConfirmDelete}>
                            <Text style={styles.redButtonText}>Delete Image</Text>
                        </TouchableOpacity>
                    </>
                )}
                {modalOptionsState === "VideoOptions" && (
                <>
                    <Text style={styles.titleRibbon}>Video Options</Text>
                    <VideoView
                    style={styles.imageBig}
                    player={player}
                    allowsFullscreen
                    allowsPictureInPicture
                    contentFit="contain"
                    />
                    {/* <Text style={styles.subtitleBlack}>{videoSelected.split('/').pop()}</Text> */}

                    <TouchableOpacity style={styles.blackButton} onPress={() => {/* optional share video */}}>
                    <Text style={styles.blackButtonText}>Open Video</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={styles.redButton}
                    onPress={() => {
                        setModalConfirmState("DeleteVideo");
                        setModalConfirmVisible(true);
                    }}
                    >
                    <Text style={styles.redButtonText}>Delete Video</Text>
                    </TouchableOpacity>
                </>
                )}
                {modalOptionsState === "" && (
                    <Text style={styles.subtitleBlack}>Why are you here?</Text>
                )}
            </GeneralModal>
            <GeneralModal visible={modalConfirmVisible} onClose={() => setModalConfirmVisible(false)}>
                {modalConfirmState === "ClearImages" && (
                    <TouchableOpacity style={styles.redButton} onPress={clearImages}>
                        <Text style={styles.redButtonText}>Confirm Clear?</Text>
                    </TouchableOpacity>
                )}
                {modalConfirmState === "DeleteImage" && (
                    <TouchableOpacity style={styles.redButton} onPress={deleteImage}>
                        <Text style={styles.redButtonText}>Confirm Delete?</Text>
                    </TouchableOpacity>
                )}
                {modalConfirmState === "ClearVideos" && (
                    <TouchableOpacity style={styles.redButton} onPress={clearVideos}>
                        <Text style={styles.redButtonText}>Confirm Clear Videos?</Text>
                    </TouchableOpacity>
                )}
                {modalConfirmState === "DeleteVideo" && (
                    <TouchableOpacity style={styles.redButton} onPress={deleteVideo}>
                        <Text style={styles.redButtonText}>Confirm Delete Video?</Text>
                    </TouchableOpacity>
                )}

            </GeneralModal>
        </ScrollView>
    );
}
