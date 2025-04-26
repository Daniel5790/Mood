import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useForm, Controller, FieldError } from 'react-hook-form';
import { styles } from '../styles/registerStyles';
import { register as registerUser } from '../services/authService';
import { useNavigation } from '@react-navigation/native';
import { RegisterScreenProps } from '../types/react-navigation.d';

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  secretQuestion: string;
  secretAnswer: string;
}

type FormFields = keyof FormData;

export default function RegisterScreen() {
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: { // Valores iniciales para todos los campos
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      secretQuestion: '',
      secretAnswer: ''
    }
  });

  const navigation = useNavigation<RegisterScreenProps['navigation']>();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await registerUser(data);
      Alert.alert('¡Registro exitoso!', 'Ahora puedes iniciar sesión', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const fields: { name: FormFields; placeholder: string; secure?: boolean }[] = [
    { name: 'firstName', placeholder: 'Nombre' },
    { name: 'lastName', placeholder: 'Apellido' },
    { name: 'username', placeholder: 'Usuario' },
    { name: 'password', placeholder: 'Contraseña', secure: true },
    { name: 'secretQuestion', placeholder: 'Pregunta secreta (ej. Nombre de tu mascota)' },
    { name: 'secretAnswer', placeholder: 'Respuesta secreta', secure: true }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>

      {fields.map(({ name, placeholder, secure }) => (
        <Controller
          key={name}
          control={control}
          name={name}
          rules={{
            required: `${placeholder} es requerido`,
            ...(name === 'password' && { 
              minLength: { 
                value: 6, 
                message: 'Mínimo 6 caracteres' 
              } 
            }),
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <TextInput
                style={[styles.input, errors[name] && { borderColor: 'red' }]}
                placeholder={placeholder}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry={!!secure}
              />
              {errors[name] && (
                <Text style={{ color: 'red' }}>
                  {(errors[name] as FieldError)?.message}
                </Text>
              )}
            </View>
          )}
        />
      ))}

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Registrarse</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}