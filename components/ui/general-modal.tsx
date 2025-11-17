import React from 'react';
import { Modal, View, TouchableWithoutFeedback, StyleSheet, TouchableOpacity, Text } from 'react-native';

type GeneralModalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  dismissOnBackdropPress?: boolean;
  animationType?: 'none' | 'slide' | 'fade';
  showCloseButton?: boolean;
};

export default function GeneralModal({
  visible,
  onClose,
  children,
  dismissOnBackdropPress = true,
  animationType = 'fade',
  showCloseButton = true,
}: GeneralModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType={animationType}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {dismissOnBackdropPress && (
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>
        )}
        <View style={styles.content}>
          
          {children}
          {showCloseButton && (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          )}
         
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    
  },
  childrenContent:{
    display: 'flex',
    flexDirection: 'row'
  },  
  closeButton: {
  marginTop: 5,  
  width: 100,
  paddingVertical: 10,
  alignSelf: 'flex-end',
  borderRadius: 10,
  backgroundColor: '#111827',
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 4,
  elevation: 3,
},

  closeText: {
    fontSize: 16,
    color: '#ffffffff',
    textAlign: 'center',
  },
});
