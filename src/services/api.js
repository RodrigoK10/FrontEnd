import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Crear instancia de axios
const api = axios.create({
    baseURL: API_URL
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Error en el interceptor:', error);
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Error en la respuesta:', {
            status: error.response?.status,
            data: error.response?.data,
            error: error.message
        });
        return Promise.reject(error.response?.data || error);
    }
);

// Servicios de autenticación
export const authService = {
    login: async (usuario, contrasena) => {
        try {
            console.log('Enviando petición de login:', { usuario, contrasena });
            const response = await api.post('/auth/login', {
                usuario: usuario,
                contrasena: contrasena
            });
            console.log('Respuesta de login:', response.data);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                if (response.data.user) {
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                }
            }
            return response.data;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                if (response.data.user) {
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                }
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

// Servicios de usuarios
export const userService = {
    getAll: async () => {
        try {
            const response = await api.get('/usuarios');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    getById: async (id) => {
        try {
            const response = await api.get(`/usuarios/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    create: async (userData) => {
        try {
            console.log('Creando nuevo usuario:', userData);
            const response = await api.post('/usuarios', userData);
            return response.data;
        } catch (error) {
            console.error('Error al crear usuario:', error);
            throw error.response?.data || error;
        }
    },

    update: async (id, userData) => {
        try {
            const response = await api.put(`/usuarios/${id}`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`/usuarios/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default api; 