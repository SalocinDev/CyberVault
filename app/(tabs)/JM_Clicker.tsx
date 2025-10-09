import JmClicker from "@/assets/images/JmClicker.jpg";
import { Button } from "@/components/clickable-button";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ButtonScreen() {
    const [value, setValue] = useState(0);
    const [base, setBase] = useState(1);
    const [baseMult, setBaseMult] = useState(1);
    const [idleBase, setIdleBase] = useState(0);
    const [costToUpgradeAdd, setCostToUpgradeAdd] = useState(10);
    const [costToUpgradeMult, setCostToUpgradeMult] = useState(50);
    const [costForIdle, setCostForIdle] = useState(100);
    const [hasClicked, setHasClicked] = useState(false);
    const [clickCombo, setClickCombo] = useState(1);
    const [idleCombo, setIdleCombo] = useState(0);
    const [clickCounter, setClickCounter] = useState(0);

    const increment = () => {
        setValue((prev) => prev + base * baseMult * clickCombo);
        setHasClicked(true);
        setClickCounter(3);
    };

    useEffect(() => {
        const idleMult = setInterval(() => {
            if (clickCounter === 0 && !hasClicked) {
                setIdleCombo((prev) => Math.min(prev + 1, 10));
            }
            if (hasClicked) {
                setIdleCombo((prev) => prev * 0);
            }
        }, 1000);

        return () => clearInterval(idleMult);
    }, [clickCounter, hasClicked]);

    useEffect(() => {
        const comboInterval = setInterval(() => {
            if (hasClicked && clickCounter > 0) {
                setClickCombo((prev) => Math.min(prev + 1, 5));
                setClickCounter((prev) => prev - 1);
            } else {
                setClickCombo(1);
                setHasClicked(false);
            }
        }, 1000);

        return () => clearInterval(comboInterval);
    }, [hasClicked, clickCounter]);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (idleBase > 0) {
                if (idleCombo >= 10) {
                    setValue((prev) => prev + idleBase * (idleCombo || 1) * 100);
                }
                setValue((prev) => prev + idleBase * (idleCombo || 1));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [idleBase, idleCombo]);

    const upgradeAdd = () => {
        if (value >= costToUpgradeAdd) {
            setValue((prev) => prev - costToUpgradeAdd);
            setBase((prev) => prev + 1.01);
            setCostToUpgradeAdd((prev) => prev * 1.01 + 5);
        }
    };

    const upgradeMult = () => {
        if (value >= costToUpgradeMult) {
            setValue((prev) => prev - costToUpgradeMult);
            setBaseMult((prev) => prev + 0.11);
            setCostToUpgradeMult((prev) => prev * 1.02 + 25);
        }
    };

    const idleUpgrade = () => {
        if (value >= costForIdle) {
            setValue((prev) => prev - costForIdle);
            setIdleBase((prev) => prev + 1.50);
            setCostForIdle((prev) => prev * 1.01 + 50);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>JM Clicker</Text>
            <Text style={styles.text}>{value.toFixed(2)}</Text>

            <Button onPress={increment} image={JmClicker} height={200} width={200} />

            <Text style={styles.text}>Click Combo: {clickCombo}</Text>
            <Text style={styles.text}>Idle Combo: {idleCombo >= 10 ? idleCombo * 10 : idleCombo}</Text>
            <Text style={styles.text}>Upgrade Add ({base.toFixed(1)}): {costToUpgradeAdd.toFixed(1)}</Text>
            <Button title="Upgrade" onPress={upgradeAdd} height={50} />

            <Text style={styles.text}>Upgrade Mult ({baseMult.toFixed(1)}): {costToUpgradeMult.toFixed(1)}</Text>
            <Button title="Upgrade" onPress={upgradeMult} height={50} />

            <Text style={styles.text}>Idle ({idleBase.toFixed(1)} × {idleCombo >= 10 ? idleCombo * 10 : idleCombo}/sec): {costForIdle.toFixed(1)} </Text>
            <Button title="Idle Upgrade" onPress={idleUpgrade} height={50} />
        </View>
    );
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
