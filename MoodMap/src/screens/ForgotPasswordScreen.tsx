import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ForgotPasswordScreenProps } from '../types/react-navigation.d';
import axios from 'axios';
import { styles } from '../styles/forgotPasswordStyles';

const API_URL = 'http://localhost:9001';

export default function ForgotPasswordScreen() {
  const [username, setUsername] = useState('');
  const [secretAnswer, setSecretAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [secretQuestion, setSecretQuestion] = useState('');
  const navigation = useNavigation<ForgotPasswordScreenProps['navigation']>();

  const handleCheckUser = async () => {
    if (!username) {
      Alert.alert('Error', 'Por favor ingresa tu nombre de usuario');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/users/${username}/secret-question`);
      setSecretQuestion(response.data.secretQuestion);
      setStep(2);
    } catch (error) {
      Alert.alert('Error', 'Usuario no encontrado');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAnswer = async () => {
    if (!secretAnswer) {
      Alert.alert('Error', 'Por favor ingresa la respuesta');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/users/${username}/verify-answer`, {
        secretAnswer
      });
      if (response.data.verified) {
        setStep(3);
      } else {
        Alert.alert('Error', 'Respuesta incorrecta');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error al verificar la respuesta');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/users/${username}/reset-password`, {
        newPassword
      });
      Alert.alert('Éxito', 'Contraseña actualizada correctamente', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Contraseña</Text>

      {step === 1 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nombre de usuario"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleCheckUser}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Continuar</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.questionText}>{secretQuestion}</Text>
          <TextInput
            style={styles.input}
            placeholder="Tu respuesta"
            value={secretAnswer}
            onChangeText={setSecretAnswer}
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleVerifyAnswer}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Verificar</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {step === 3 && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Nueva contraseña"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Actualizar Contraseña</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.linkText}>Volver al inicio de sesión</Text>
      </TouchableOpacity>
    </View>
  );
}