import GeneralModal from '@/components/ui/general-modal';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { generateSecureString } from '@/functions/genRandom';
import { styles } from '@/style/global';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import * as Clipboard from 'expo-clipboard';
import * as SecureStore from 'expo-secure-store';
import Foundation from '@expo/vector-icons/Foundation';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

import React, { useEffect, useState } from 'react';
import { Alert, GestureResponderEvent, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Passwords() {
    type ModalState = "AddPassword" | "ViewPassword" | "AddCategory" | "CategoryOptions" | "";
    type PasswordEntry = {
        id: number;
        website: string;
        email: string;
        password: string;
        category: string;
        dateAdded: string;
    };
    const [passwordCount, setPasswordCount] = useState<number>(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCategory, setSearchCategory] = useState('All');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalState, setModalState] = useState<ModalState>("");
    const [categories, setCategories] = useState([
    'Social', 'Work', 'Finance', 'Entertainment', 'Other'
    ]);
    const [newCategory, setNewCategory] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Other');
    const [selectedCategoryForOptions, setSelectedCategoryForOptions] = useState<string | null>(null);
    const [renameCategoryValue, setRenameCategoryValue] = useState('');
    const [website, setWebsite] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [genPasswordNumbers, setGenPasswordNumbers] = useState<boolean>(true)
    const [genPasswordLetters, setGenPasswordLetters] = useState<boolean>(true)
    const [genPasswordSymbols, setGenPasswordSymbols] = useState<boolean>(true)
    const [genPasswordLength, setGenPasswordLength] = useState<number>(16)
    const [passwordList, setPasswordList] = useState<PasswordEntry[]>([]);
    const [selectedPassword, setSelectedPassword] = useState<PasswordEntry | null>(null);
    const [showChangeModal, setShowChangeModal] = useState(false);
    const [newPasswordValue, setNewPasswordValue] = useState('');
    const [isActive, setIsActive] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const iconSize: number = 50;
    
    const loadPasswords = async () => {
        try {
            const stored = await SecureStore.getItemAsync('passwords');
            const list: PasswordEntry[] = stored ? JSON.parse(stored) : [];
            setPasswordList(list);

            setPasswordCount(list.length);
        } catch (error) {
            console.error('Failed to load passwords:', error);
        }
    };

    useEffect(() => {
        loadPasswords();
    }, []);

    const generatePassword = async () => {
    try {
        if (!genPasswordNumbers && !genPasswordLetters && !genPasswordSymbols) {
            return Alert.alert('Please enable an Option!')
        }
        const generatedPassword = await await generateSecureString(genPasswordLength, { numbers: genPasswordNumbers, letters: genPasswordLetters, symbols: genPasswordSymbols });
        setPassword(generatedPassword);
    } catch (error) {
        console.error('Password generation failed:', error);
        Alert.alert('Error', 'Failed to generate password.');
    }
    };

    const filteredPasswords = passwordList.filter((entry) => {
        const matchesQuery =
            entry.website.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entry.email.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
            searchCategory === 'All' || entry.category === searchCategory;

        return matchesQuery && matchesCategory;
    });

    const handleSave = async () => {
        try {
            if (!website && !email && !password) {
                return Alert.alert("Incomplete, please try again")
            }
            const newEntry = {
            id: Date.now(),
            website,
            email,
            password,
            category: selectedCategory,
            dateAdded: new Date().toISOString(),
            };
            const stored = await SecureStore.getItemAsync('passwords');
            const existing = stored ? JSON.parse(stored) : [];

            const updated = [...existing, newEntry];

            await SecureStore.setItemAsync('passwords', JSON.stringify(updated));

            Alert.alert('Password Saved', `Site: ${website}\nPassword: ${password}`);
            setWebsite('');
            setPassword('');
            setModalVisible(false);
            loadPasswords()
        } catch (error) {
            console.error('Save failed:', error);
            Alert.alert('Error', 'Failed to save password.');
        }
    };

    const handleSearch = (text: string) => {
        setSearchQuery(text);
    };

    function openModal(state: ModalState) {
        setModalState(state);
        setModalVisible(true);
    };

    function handleToggleNumber(event: GestureResponderEvent): void {
        if (!genPasswordNumbers) {
            setGenPasswordNumbers(true);
            return;
        }
        if (genPasswordNumbers) {
            setGenPasswordNumbers(false);
            return;
        }
    }

    function handleToggleLetter(event: GestureResponderEvent): void {
        if (!genPasswordLetters) {
            setGenPasswordLetters(true);
            return;
        }
        if (genPasswordLetters) {
            setGenPasswordLetters(false);
            return;
        }
    }

    function handleToggleSymbol(event: GestureResponderEvent): void {
        if (!genPasswordSymbols) {
            setGenPasswordSymbols(true);
            return;
        }
        if (genPasswordSymbols) {
            setGenPasswordSymbols(false);
            return;
        }
    }

    const openViewModal = (item: PasswordEntry) => {
        setSelectedPassword(item);
        setModalState("ViewPassword");
        setModalVisible(true);
    };

    const confirmDelete = (id: number) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this password? This action cannot be undone.",
            [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => handleDeletePassword(id) }
            ]
        );
    };

    const handleDeletePassword = async (id: number) => {
    try {
        const stored = await SecureStore.getItemAsync('passwords');
        const existing: PasswordEntry[] = stored ? JSON.parse(stored) : [];
        const updated = existing.filter((entry) => entry.id !== id);
        await SecureStore.setItemAsync('passwords', JSON.stringify(updated));
        Alert.alert('Password removed');
        setModalVisible(false);
        loadPasswords();
    } catch (error) {
        console.error('Delete failed:', error);
        Alert.alert('Error', 'Failed to delete password.');
    }
    };

    const handlePasswordOptions = (entry: PasswordEntry) => {
    Alert.alert(
        "Password Options",
        "Choose an action for this password.",
        [
        {
            text: "Generate New Password",
            onPress: async () => {
            try {
                const newPass = await generateSecureString(genPasswordLength, {
                numbers: genPasswordNumbers,
                letters: genPasswordLetters,
                symbols: genPasswordSymbols,
                });
                const stored = await SecureStore.getItemAsync("passwords");
                const existing: PasswordEntry[] = stored ? JSON.parse(stored) : [];
                const updated = existing.map((p) =>
                p.id === entry.id ? { ...p, password: newPass } : p
                );
                await SecureStore.setItemAsync("passwords", JSON.stringify(updated));
                setSelectedPassword({ ...entry, password: newPass });
                loadPasswords();
                Alert.alert("New password generated!");
            } catch (error) {
                console.error("Password generation failed:", error);
                Alert.alert("Error", "Failed to generate new password.");
            }
            },
        },
        {
            text: "Change Password",
            onPress: () => {
            setNewPasswordValue(entry.password);
            setShowChangeModal(true);
            },
        },
        {
            text: "Copy Password",
            onPress: async () => {
            await Clipboard.setStringAsync(entry.password);
            Alert.alert("Copied!", "Password copied to clipboard.");
            },
        },
        { text: "Cancel", style: "cancel" },
        ]
    );
    };

    const evaluatePasswordStrength = (pwd: string) => {
        let score = 0;
        if (!pwd) return { label: '', color: '#000' };
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[\W_]/.test(pwd)) score++;

        if (score <= 1) return { label: 'Weak', color: '#E74C3C' };
        if (score === 2 || score === 3) return { label: 'Medium', color: '#F1C40F' };
        if (score === 4) return { label: 'Strong', color: '#2ECC71' };
        return { label: '', color: '#000' };
    };

    const handleSaveCategory = () => {
        if (!newCategory.trim()) return Alert.alert("Please enter a category name");

        if (categories.includes(newCategory.trim())) {
            return Alert.alert("Category already exists");
        }

        setCategories([...categories, newCategory.trim()]);
        setSelectedCategory(newCategory.trim());
        setNewCategory('');
        setModalVisible(false);
        Alert.alert("Category added!");
    };

    const handleRenameCategory = () => {
        if (!renameCategoryValue.trim() || !selectedCategoryForOptions) return;

        if (categories.includes(renameCategoryValue.trim())) {
            return Alert.alert("Category already exists");
        }

        setCategories(categories.map(c => c === selectedCategoryForOptions ? renameCategoryValue.trim() : c));
        if (searchCategory === selectedCategoryForOptions) setSearchCategory(renameCategoryValue.trim());
        setSelectedCategoryForOptions(null);
        setRenameCategoryValue('');
        setModalVisible(false);
        Alert.alert("Category renamed!");
        };

    const handleDeleteCategory = () => {
        if (!selectedCategoryForOptions) return;

        // Remove passwords associated with this category
        const updatedPasswords = passwordList.map(p =>
            p.category === selectedCategoryForOptions ? { ...p, category: "Other" } : p
        );
        setPasswordList(updatedPasswords);

        setCategories(categories.filter(c => c !== selectedCategoryForOptions));
        if (searchCategory === selectedCategoryForOptions) setSearchCategory("All");

        setSelectedCategoryForOptions(null);
        setModalVisible(false);
        Alert.alert("Category deleted!");
    };

    return (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <View style={styles.container}>
                
                <View style={styles.capsule}>
                    <Text style={styles.textWelcome}>Password Manager</Text>
                    <Text style={styles.textWelcomeSubtitle}>
                        Generate, store, and manage strong passwords securely
                    </Text>
                     <TouchableOpacity style={styles.iconTopRight} onPress={() => openModal("AddPassword")}>
                        <MaterialCommunityIcons name="key-plus" size={45} color="white" />
                    </TouchableOpacity>
                     
                </View>
                <View style={styles.capsuleContainerCenterPassword}>
                    <View style={styles.capsuleChildPassword}>
                    <Text style={styles.titlePassword}>{passwordCount}</Text>
                    
                    </View>
                    <View style={styles.titleStored}>
                        <Text style={styles.subtitlePassword}>Passwords Stored</Text>
                        
                    </View>
                </View>
                <View style={styles.containerSearch}>
                <View style={styles.searchContainer}>
                    <IconSymbol name="magnifyingglass" size={25} color="#888" style={styles.searchIcon}/>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search Passwords..."
                        placeholderTextColor="#888"
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                </View>

                <View style={styles.containerCategory}>  
                <View style={styles.containerHorizontal}>
                    <TouchableOpacity 
                        style={styles.categoryButton} 
                        onPress={() => {
                            setModalState("AddCategory"); 
                            setModalVisible(true)}}
                    >
                        <Text style={{ color: 'white' }}>+ Add Category</Text>
                    </TouchableOpacity>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollViewHorizontal}>
                        {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={styles.categoryButton}
                            onPress={() => setSearchCategory(cat)}
                            onLongPress={() => {
                            setSelectedCategoryForOptions(cat);
                            setRenameCategoryValue(cat);
                            setModalState("CategoryOptions");
                            setModalVisible(true);
                            }}
                        >
                            <Text style={{ color: 'white' }}>{cat}</Text>
                        </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                </View>
                </View>
                       
                <View style={styles.containerCenter}>
                    <Text style={styles.subtitleBlack}>
                        Current search: {searchQuery} | Category: {searchCategory}
                    </Text>
                </View>

                <View style={styles.passwordGridContainer}>
                {passwordList.length === 0 ? (
                    <View style={styles.containerCenter}>
                        <Text style={styles.subtitleBlack}>No passwords saved yet.</Text>
                    </View>
                ) : (
                    <View style={styles.passwordGrid}>
                    {filteredPasswords.length === 0 ? (
                        <View style={styles.containerCenter}>
                            <Text style={styles.subtitleBlack}>No matching passwords.</Text>
                        </View>
                    ) : (
                        filteredPasswords.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.passwordCard}
                                onPress={() => openViewModal(item)}
                            >
                                <Text style={styles.passwordWebsite}>{item.website}</Text>
                                <Text style={styles.passwordCategory}>{item.category}</Text>
                                <Text style={styles.passwordDate}>
                                    {new Date(item.dateAdded).toLocaleDateString()}
                                </Text>
                            </TouchableOpacity>
                        ))
                    )}
                    </View>
                )}
                </View>
            </View>
            <GeneralModal visible={modalVisible} onClose={() => setModalVisible(false)}>
                {modalState === 'AddPassword' && (
                    <>
                        <Text style={styles.titleRibbon}>Add Password</Text>
                        <Text style={styles.subtitleBlack}>Website / Service</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter website or service"
                            placeholderTextColor="#999"
                            value={website}
                            onChangeText={setWebsite}
                        />
                        <Text style={styles.subtitleBlack}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Email"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <Text style={styles.subtitleBlack}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter password"
                            placeholderTextColor="#999"
                            // secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                        {password ? (
                        <Text style={{ ...styles.passwordEvaluation, color: evaluatePasswordStrength(password).color }}>
                        Strength: {evaluatePasswordStrength(password).label}
                        </Text>
                        ) : null}
                        <View style={styles.containerGenerate}>
                        <Text style={styles.titleRibbonGenerate}>Generate Password?</Text>
                        <TouchableOpacity style={styles.generateButton} onPress={generatePassword}>
                            <Text style={styles.blackButtonTextSmall}>Generate</Text>
                        </TouchableOpacity>
                        </View>

                            <View style={styles.containerHorizontalPassword}>
                                <TouchableOpacity
                                    style={[
                                        styles.flexButton,
                                        genPasswordNumbers ? styles.numberButtonActive : styles.numberButtonInactive,
                                    ]}
                                    onPress={handleToggleNumber}
                                    >
                                    <Text style={styles.blackButtonTextSmall}>
                                        Number: {genPasswordNumbers ? "True" : "False"}
                                    </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                    style={[
                                        styles.flexButton,
                                        genPasswordLetters ? styles.letterButtonActive : styles.letterButtonInactive,
                                    ]}
                                    onPress={handleToggleLetter}
                                    >
                                    <Text style={styles.blackButtonTextSmall}>
                                        Letter: {genPasswordLetters ? "True" : "False"}
                                    </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                    style={[
                                        styles.flexButton,
                                        genPasswordSymbols ? styles.symbolButtonActive : styles.symbolButtonInactive,
                                    ]}
                                    onPress={handleToggleSymbol}
                                    >
                                    <Text style={styles.blackButtonTextSmall}>
                                        Symbol: {genPasswordSymbols ? "True" : "False"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        <Text style={styles.subtitleCategory}>Category</Text>
                            <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedCategory}
                                onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                                style={styles.picker}
                                dropdownIconColor="black"
                            >
                                {categories.map((cat) => (
                                <Picker.Item key={cat} label={cat} value={cat} />
                                ))}
                            </Picker>
                        </View>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.blackButtonText}>Save</Text>
                        </TouchableOpacity>
                    </>
                )}
                {modalState === "ViewPassword" && selectedPassword && (
                    <>
                        <Text style={styles.titleRibbon}>View Password</Text>
                        <Text style={styles.subtitleBlack}>Website / Service</Text>
                        <Text style={styles.inputDisabled}>{selectedPassword.website}</Text>
                        <Text style={styles.subtitleBlack}>Email</Text>
                        <Text style={styles.inputDisabled}>{selectedPassword.email}</Text>
                        <Text style={styles.subtitleBlack}>Password</Text>
                        <TouchableOpacity onPress={() => handlePasswordOptions(selectedPassword)}>
                            <Text style={[styles.inputDisabled, { color: '#3498db' }]}>
                                {selectedPassword.password}
                            </Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 12, color: '#aaa', textAlign: 'center' }}>
                        Tap the password for options
                        </Text>
                        <Text style={styles.subtitleBlack}>Category</Text>
                        <Text style={styles.inputDisabled}>{selectedPassword.category}</Text>
                        <Text style={styles.subtitleBlack}>Date Added</Text>
                        <Text style={styles.inputDisabled}>
                        {new Date(selectedPassword.dateAdded).toLocaleString()}
                        </Text>
                        <TouchableOpacity
                        style={[styles.blackButton, { backgroundColor: '#E74C3C' }]}
                        onPress={() => confirmDelete(selectedPassword.id)}
                        >
                        <Text style={styles.blackButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </>
                    )}
                    {modalState === "AddCategory" && (
                        <>
                            <Text style={styles.titleRibbon}>Add New Category</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Category name"
                                placeholderTextColor="#999"
                                value={newCategory}
                                onChangeText={setNewCategory}
                            />
                            <TouchableOpacity style={styles.saveButton} onPress={handleSaveCategory}>
                                <Text style={styles.blackButtonText}>Save</Text>
                            </TouchableOpacity>
                        </>
                    )}
                    {modalState === "CategoryOptions" && selectedCategoryForOptions && (
                    <>
                        <Text style={styles.titleRibbon}>Category Options</Text>
                        <Text style={styles.subtitleBlack}>Rename Category</Text>
                        <TextInput
                        style={styles.input}
                        value={renameCategoryValue}
                        onChangeText={setRenameCategoryValue}
                        />
                        <TouchableOpacity style={styles.saveButton} onPress={handleRenameCategory}>
                        <Text style={styles.blackButtonText}>Rename</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        style={[styles.saveButton, { backgroundColor: '#E74C3C', marginTop: 10 }]}
                        onPress={handleDeleteCategory}
                        >
                        <Text style={styles.blackButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </>
                    )}
            </GeneralModal>
            <GeneralModal visible={showChangeModal} onClose={() => setShowChangeModal(false)}>
                <Text style={styles.titleRibbon}>Change Password</Text>
                <Text style={styles.subtitleBlack}>Enter a new password:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="New password"
                    placeholderTextColor="#999"
                    value={newPasswordValue}
                    onChangeText={setNewPasswordValue}
                />
                <View style={styles.containerHorizontal}>
                    <TouchableOpacity
                    style={[styles.blackButton, styles.flexButton]}
                    onPress={() => setShowChangeModal(false)}
                    >
                    <Text style={styles.blackButtonTextSmall}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style={[styles.blackButton, styles.flexButton]}
                    onPress={async () => {
                        try {
                        if (!selectedPassword) return;
                        const stored = await SecureStore.getItemAsync("passwords");
                        const existing: PasswordEntry[] = stored ? JSON.parse(stored) : [];
                        const updated = existing.map((p) =>
                            p.id === selectedPassword.id ? { ...p, password: newPasswordValue } : p
                        );
                        await SecureStore.setItemAsync("passwords", JSON.stringify(updated));
                        setSelectedPassword({ ...selectedPassword, password: newPasswordValue });
                        loadPasswords();
                        setShowChangeModal(false);
                        Alert.alert("Password updated!");
                        } catch (error) {
                        console.error("Password update failed:", error);
                        Alert.alert("Error", "Failed to update password.");
                        }
                    }}
                    >
                    <Text style={styles.blackButtonTextSmall}>Save</Text>
                    </TouchableOpacity>
                </View>
                </GeneralModal>
        </ScrollView>
    );
}
