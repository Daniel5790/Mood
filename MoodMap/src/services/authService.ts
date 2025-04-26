import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Asegúrate que esta URL coincida exactamente con tu backend
const API_URL = 'http://localhost:9001/api/auth';

interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  secretQuestion: string;
  secretAnswer: string;
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const register = async (userData: UserData) => {
  try {
    console.log('Enviando datos de registro:', JSON.stringify(userData, null, 2));
    
    const response = await api.post('/register', userData);

    console.log('Registro exitoso:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Detalles del error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    if (error.response) {
      // Manejo específico de errores
      switch (error.response.status) {
        case 400:
          if (error.response.data === 'El nombre de usuario ya existe') {
            throw new Error('Este nombre de usuario ya está registrado. Por favor elige otro.');
          } else {
            throw new Error('Datos inválidos. Verifica la información ingresada.');
          }
        case 500:
          throw new Error('Error interno del servidor. Intenta nuevamente más tarde.');
        default:
          throw new Error(error.response.data?.message || `Error en el registro (${error.response.status})`);
      }
    } else if (error.request) {
      throw new Error('No se pudo conectar al servidor. Verifica tu conexión a internet.');
    } else {
      throw new Error('Error al configurar la petición: ' + error.message);
    }
  }
};

export const login = async (username: string, password: string) => {
  try {
    const response = await api.post('/login', { username, password });
    await AsyncStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error: any) {
    console.error('Error en login:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
  }
};