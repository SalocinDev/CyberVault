import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function Passwords () {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Passwords Page</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        margin: 10,
    },
});
