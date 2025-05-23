import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService, authService } from '../services/api';

export default function Usuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    usuario: '',
    contrasena: '',
    correo_electronico: '',
  });
  const [error, setError] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [usuarioEditado, setUsuarioEditado] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
    obtenerUsuarios();
  }, [navigate]);

  const obtenerUsuarios = async () => {
    try {
      const data = await userService.getAll();
      setUsuarios(data);
      setError('');
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/login');
      }
      setError('Error al obtener usuarios');
    }
  };

  const agregarUsuario = async () => {
    try {
      setError('');
      if (!nuevoUsuario.usuario || !nuevoUsuario.contrasena || !nuevoUsuario.correo_electronico) {
        setError('Por favor complete todos los campos');
        return;
      }

      await authService.register(nuevoUsuario);
      setNuevoUsuario({ usuario: '', contrasena: '', correo_electronico: '' });
      obtenerUsuarios();
    } catch (error) {
      console.error('Error al agregar usuario:', error);
      setError(error.message || 'Error al agregar usuario');
    }
  };

  const eliminarUsuario = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este usuario?')) {
      try {
        setError('');
        await userService.delete(id);
        obtenerUsuarios();
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        setError('Error al eliminar usuario');
      }
    }
  };

  const empezarEdicion = (usuario) => {
    setEditandoId(usuario.id_usuario);
    setUsuarioEditado({ ...usuario, contrasena: '' });
    setError('');
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setUsuarioEditado({});
    setError('');
  };

  const guardarEdicion = async () => {
    try {
      setError('');
      const datosActualizados = { ...usuarioEditado };
      if (!datosActualizados.contrasena) {
        delete datosActualizados.contrasena;
      }
      await userService.update(editandoId, datosActualizados);
      setEditandoId(null);
      obtenerUsuarios();
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      setError('Error al actualizar usuario');
    }
  };

  const cerrarSesion = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
            <button
              onClick={cerrarSesion}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-900"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Formulario para agregar usuario */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Agregar nuevo usuario</h3>
          {error && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 rounded-md p-3">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <input
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Usuario"
              value={nuevoUsuario.usuario}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, usuario: e.target.value })}
            />
            <input
              type="password"
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Contraseña"
              value={nuevoUsuario.contrasena}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, contrasena: e.target.value })}
            />
            <input
              type="email"
              className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Correo"
              value={nuevoUsuario.correo_electronico}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, correo_electronico: e.target.value })}
            />
          </div>
          <button
            onClick={agregarUsuario}
            className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Agregar Usuario
          </button>
        </div>

        {/* Lista de usuarios */}
        <div className="bg-white shadow rounded-lg">
          <ul className="divide-y divide-gray-200">
            {usuarios.map((u) => (
              <li key={u.id_usuario} className="px-6 py-4">
                {editandoId === u.id_usuario ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <input
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      value={usuarioEditado.usuario}
                      onChange={(e) => setUsuarioEditado({ ...usuarioEditado, usuario: e.target.value })}
                    />
                    <input
                      type="password"
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Nueva contraseña (opcional)"
                      value={usuarioEditado.contrasena || ''}
                      onChange={(e) => setUsuarioEditado({ ...usuarioEditado, contrasena: e.target.value })}
                    />
                    <input
                      type="email"
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      value={usuarioEditado.correo_electronico}
                      onChange={(e) => setUsuarioEditado({ ...usuarioEditado, correo_electronico: e.target.value })}
                    />
                    <div className="col-span-3 flex gap-2">
                      <button
                        onClick={guardarEdicion}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={cancelarEdicion}
                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{u.usuario}</p>
                      <p className="text-sm text-gray-500">{u.correo_electronico}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => empezarEdicion(u)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarUsuario(u.id_usuario)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
