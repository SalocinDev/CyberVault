import GeneralModal from '@/components/ui/general-modal';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { styles } from '@/style/global';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function Monitor() {
  type ModalState = "SearchBreach" | "ViewBreach" | "";
  type ModalSearchResultState = "SearchSuccess" | "";
  
  interface BreachEntry {
    id: number;
    email: string;
    breaches: string[];
    dateAdded: string;
  }

  const [breachList, setBreachList] = useState<BreachEntry[]>([]);
  const [selectedBreach, setSelectedBreach] = useState<BreachEntry | null>(null);
  const [breachDetections, setBreachDetections] = useState<number>(0);
  const [modalState, setModalState] = useState<ModalState>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalSearchResultState, setModalSearchResultState] = useState<ModalSearchResultState>("");
  const [modalSearchResultVisible, setModalSearchResultVisible] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const iconSize = 50;

  // Load saved breaches on initial render
  useEffect(() => {
    const loadBreaches = async () => {
      try {
        const stored = await SecureStore.getItemAsync("breach_searches");
        const list: BreachEntry[] = stored ? JSON.parse(stored) : [];
        setBreachList(list);

        // Total breaches counter from all saved searches
        const totalBreaches = list.reduce((acc, entry) => acc + (entry.breaches?.length || 0), 0);
        setBreachDetections(totalBreaches);
      } catch (error) {
        console.error("Failed to load breaches:", error);
      }
    };
    loadBreaches();
  }, []);

  // Open modal helper
  function openModal(state: ModalState) {
    setModalState(state);
    setModalVisible(true);
  }

  // Search email
  function handleSubmitEmail() {
    if (!email) {
      Alert.alert("Missing Email!");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email Format!");
      return;
    }
    Alert.alert("Searching...");
    submitEmail(email);
  }

  function submitEmail(email: string) {
    fetch(`https://api.xposedornot.com/v1/check-email/${email}?include_details=true`)
      .then(res => res.json())
      .then(data => {
        setSearchResult(data);

        setModalVisible(false);
        setModalSearchResultState("SearchSuccess");
        setModalSearchResultVisible(true);
      })
      .catch(error => {
        console.error("Error Searching:", error);
        Alert.alert("Error Searching");
      });
  }

  // Save search securely
  const handleSaveSearch = async () => {
    if (!searchResult || !email) return;

    const breaches = searchResult.breaches?.flat() || [];
    const newEntry: BreachEntry = {
      id: Date.now(),
      email,
      breaches,
      dateAdded: new Date().toISOString(),
    };

    try {
      const stored = await SecureStore.getItemAsync("breach_searches");
      const existing: BreachEntry[] = stored ? JSON.parse(stored) : [];
      const updated = [...existing, newEntry];

      await SecureStore.setItemAsync("breach_searches", JSON.stringify(updated));
      setBreachList(updated);

      // Update counter: sum of all breaches from saved searches
      const totalBreaches = updated.reduce((acc, entry) => acc + (entry.breaches?.length || 0), 0);
      setBreachDetections(totalBreaches);

      Alert.alert("Saved Successfully");
    } catch (error) {
      console.error("Error saving breach search:", error);
      Alert.alert("Error saving search");
    }
  };

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <View style={styles.capsule}>
          <Text style={styles.textWelcome}>Breach Detection</Text>
          <Text style={styles.textWelcomeSubtitle}>Search for data breach leaks</Text>
          <TouchableOpacity style={styles.iconTopRight} onPress={() => openModal("SearchBreach")}>
            <IconSymbol name="magnifyingglass" size={iconSize} color="#ffffffff" />
          </TouchableOpacity>
        </View>

        {/* Breach counter */}
        <View style={styles.capsuleContainerCenterBreaches}>
          <View style={styles.capsuleChildBreaches}>
            <Text style={styles.titleBreaches}>{breachDetections}</Text>
            
          </View>
          <View>
            <Text style={styles.subtitlePassword}>Breach Detected</Text>
          </View>
        </View>

        {/* Saved Breach Searches Grid */}
        <View style={styles.passwordGridContainer}>
          {breachList.length === 0 ? (
            <View style={styles.containerCenter}>
              <Text style={styles.subtitleBlack}>No breach searches saved yet.</Text>
            </View>
          ) : (
            <View style={styles.passwordGrid}>
              {breachList.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.passwordCard}
                  onPress={() => {
                    setSelectedBreach(item);
                    setModalState("ViewBreach");
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.passwordWebsite}>{item.email}</Text>
                  <Text style={styles.passwordCategory}>Breaches: {item.breaches.length}</Text>
                  <Text style={styles.passwordDate}>
                    {new Date(item.dateAdded).toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Search Email Modal */}
      <GeneralModal visible={modalVisible && modalState === "SearchBreach"} onClose={() => setModalVisible(false)}>
        <View>
          <Text style={styles.subtitleBlack}>Please Input your Email</Text>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.inputSearch}
              placeholder="Enter email to search"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSubmitEmail}>
              <Feather name="search" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </GeneralModal>

      {/* Search Result Modal */}
      <GeneralModal visible={modalSearchResultVisible} onClose={() => setModalSearchResultVisible(false)}>
      {modalSearchResultState === "SearchSuccess" && (
        <View style={{ maxHeight: 400 }}> {/* Limit modal height to allow scrolling */}
          <Text style={styles.subtitleBlack}>Search Result</Text>
          {searchResult ? (
            <>
              {(() => {
                const breaches = searchResult.breaches?.flat() || [];
                return (
                  <>
                    <Text>Breaches found: {breaches.length || "None"}</Text>
                    <Text style={{ marginTop: 5 }}>Sources:</Text>

                    {breaches.length ? (
                      <FlatList
                        data={breaches}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => <Text>• {item}</Text>}
                        style={{ marginTop: 5 }}
                      />
                    ) : (
                      <Text>No breach records for this email 🎉</Text>
                    )}
                  </>
                );
              })()}
            </>
          ) : (
            <Text>Loading or no data.</Text>
          )}
          <TouchableOpacity style={styles.fileButton} onPress={handleSaveSearch}>
            <Text style={styles.blackButtonText}>Save Securely</Text>
          </TouchableOpacity>
        </View>
      )}
    </GeneralModal>

      {/* View Saved Breach Modal */}
      <GeneralModal visible={modalVisible && modalState === "ViewBreach"} onClose={() => setModalVisible(false)}>
        {selectedBreach && (
          <View>
            <Text style={styles.subtitleBlack}>Saved Breach Details</Text>
            <Text style={styles.passwordWebsite}>Email: {selectedBreach.email}</Text>
            <Text style={styles.passwordCategory}>Breaches: {selectedBreach.breaches.length}</Text>
            {selectedBreach.breaches.map((b, i) => (
              <Text key={i}>• {b}</Text>
            ))}
            <Text style={styles.passwordDate}>
              Date: {new Date(selectedBreach.dateAdded).toLocaleString()}
            </Text>
          </View>
        )}
      </GeneralModal>
    </ScrollView>
  );
}
