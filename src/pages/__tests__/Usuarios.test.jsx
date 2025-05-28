import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Usuarios from '../Usuarios';
import { userService, authService } from '../../services/api';

// Mock the services
jest.mock('../../services/api', () => ({
  userService: {
    getAll: jest.fn(() => Promise.resolve([]))
  },
  authService: {
    register: jest.fn(),
    logout: jest.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Usuarios Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() => 'fake-token');
  });

  it('permite crear un nuevo usuario', async () => {
    authService.register.mockResolvedValue({ success: true });

    render(
      <BrowserRouter>
        <Usuarios />
      </BrowserRouter>
    );

    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText('Usuario'), {
      target: { value: 'newuser' },
    });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Correo'), {
      target: { value: 'new@test.com' },
    });

    // Submit the form
    fireEvent.click(screen.getByText('Agregar Usuario'));

    // Check if the register function was called with correct data
    expect(authService.register).toHaveBeenCalledWith({
      usuario: 'newuser',
      contrasena: 'password123',
      correo_electronico: 'new@test.com',
    });
  });
}); 