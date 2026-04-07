import React, { useState, useEffect } from 'react';

// Import Vistas (Components)
import LoginView from './vistas/auth/LoginView';
import RegisterView from './vistas/auth/RegisterView';
import RegisterEntrenadorView from './vistas/auth/RegisterEntrenadorView';
import ShopView from './vistas/shop/ShopView';
import PaymentModal from './vistas/shop/PaymentModal';
import PanelClienteGYMTRACK from './vistas/PanelClienteGYMTRACK';

const API_URL = 'http://127.0.0.1:8000/api';

function App() {
  // --- Session State ---
  const [view, setView] = useState('login');
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);

  const [step, setStep] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '', direccion: '', edad: '', correo: '', eps: '', pass: '', contacto: '', familiar: '',
    sexo: '', peso: '', estatura: '', objetivo_principal: '',
    salud: 'Excelente', cirugia: 'No', cirugiaDetalle: '', condiciones: [], medicamentos: 'No', medicamentosDetalle: '', lesion: 'No', lesionDetalle: '', frecuencia: '3-4 veces por semana', sueno: '7-8',
    disclaimer: false
  });

  // --- Restore session from localStorage ---
  useEffect(() => {
    const savedToken = localStorage.getItem('gymtrack_token');
    const savedUser = localStorage.getItem('gymtrack_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUserData(JSON.parse(savedUser));
      const savedView = localStorage.getItem('gymtrack_view') || 'panelCliente';
      setView(savedView);
    }
  }, []);

  // --- Save session helper ---
  const saveSession = (accessToken, user, targetView) => {
    setToken(accessToken);
    setUserData(user);
    localStorage.setItem('gymtrack_token', accessToken);
    localStorage.setItem('gymtrack_user', JSON.stringify(user));
    localStorage.setItem('gymtrack_view', targetView);
    setView(targetView);
  };

  // --- Logout ---
  const handleLogout = async () => {
    try {
      if (token) {
        await fetch(`${API_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
      }
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
    setToken(null);
    setUserData(null);
    localStorage.removeItem('gymtrack_token');
    localStorage.removeItem('gymtrack_user');
    localStorage.removeItem('gymtrack_view');
    setView('login');
  };

  const handleInputChange = (e) => {
    let { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? (checked !== undefined ? checked : value) : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const toggleCondition = (cond) => {
    setFormData(prev => {
      let nextCondiciones = [...prev.condiciones];
      if (cond === 'Ninguna') {
        nextCondiciones = prev.condiciones.includes('Ninguna') ? [] : ['Ninguna'];
      } else {
        if (nextCondiciones.includes('Ninguna')) {
          nextCondiciones = nextCondiciones.filter(c => c !== 'Ninguna');
        }
        if (nextCondiciones.includes(cond)) {
          nextCondiciones = nextCondiciones.filter(c => c !== cond);
        } else {
          nextCondiciones.push(cond);
        }
      }
      return { ...prev, condiciones: nextCondiciones };
    });
  };

  const handlePaymentConfirm = () => {
    alert('¡Pago completado!');
    setShowPayment(false);
    setView('login');
  };

  // --- Login ---
  const handleLogin = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || JSON.stringify(data.errors) || 'Credenciales incorrectas');
    }
    const targetView = data.user.rol === 'entrenador' ? 'panelEntrenador' : 'panelCliente';
    saveSession(data.access_token, data.user, targetView);
    return data;
  };

  // --- Register Cliente ---
  const handleRegister = async () => {
    try {
      const nameParts = formData.nombre.trim().split(' ');
      const nombre = nameParts[0] || 'Desconocido';
      const apellido = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '.';

      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          nombre, apellido,
          email: formData.correo,
          password: formData.pass,
          rol: 'cliente',
          edad: formData.edad,
          genero: formData.sexo,
          peso_kg: formData.peso,
          altura_cm: formData.estatura,
          objetivo_principal: formData.objetivo_principal
        })
      });
      const data = await response.json();
      if (response.ok) {
        saveSession(data.access_token, data.user, 'shop');
      } else {
        alert('Error de registro: ' + (data.message || JSON.stringify(data.errors)));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('No se pudo conectar al servidor de Laravel. Asegúrate de que php artisan serve esté corriendo.');
    }
  };

  // --- Register Entrenador ---
  const handleRegisterEntrenador = async (entrenadorData) => {
    try {
      const nameParts = entrenadorData.nombre.trim().split(' ');
      const nombre = nameParts[0] || 'Desconocido';
      const apellido = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '.';

      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          nombre, apellido,
          email: entrenadorData.correo,
          password: entrenadorData.password,
          rol: 'entrenador',
          edad: entrenadorData.edad,
          genero: entrenadorData.sexo,
          contacto: entrenadorData.contacto,
          direccion: entrenadorData.direccion,
          emergencia: entrenadorData.emergencia,
          especialidad: entrenadorData.especialidad,
          experiencia: entrenadorData.experiencia,
          certificacion: entrenadorData.certificacion,
          horarios: entrenadorData.horarios,
          tipos_entrenamiento: entrenadorData.tipos_entrenamiento,
          capacidad_maxima: entrenadorData.capacidad_maxima,
          objetivos: entrenadorData.objetivos
        })
      });
      const data = await response.json();
      if (response.ok) {
        saveSession(data.access_token, data.user, 'panelEntrenador');
      } else {
        alert('Error de registro: ' + (data.message || JSON.stringify(data.errors)));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('No se pudo conectar al servidor de Laravel.');
    }
  };

  // --- View Rendering ---
  return (
    <div className="App">
      {view === 'login' && <LoginView setView={setView} onLogin={handleLogin} />}

      {view === 'register' && (
        <RegisterView
          step={step}
          setStep={setStep}
          formData={formData}
          handleInputChange={handleInputChange}
          toggleCondition={toggleCondition}
          setView={setView}
          handleRegister={handleRegister}
        />
      )}

      {view === 'registerEntrenador' && (
        <RegisterEntrenadorView setView={setView} handleRegister={handleRegisterEntrenador} />
      )}

      {view === 'panelCliente' && (
        <PanelClienteGYMTRACK setView={setView} token={token} userData={userData} onLogout={handleLogout} />
      )}

      {view === 'shop' && (
        <ShopView
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          setShowPayment={setShowPayment}
          setView={setView}
        />
      )}

      {showPayment && (
        <PaymentModal
          plan={selectedPlan}
          onClose={() => setShowPayment(false)}
          onConfirm={handlePaymentConfirm}
        />
      )}

      <div className="footer-text">© 2026 GYM TRACK. Todos los derechos reservados.</div>
    </div>
  );
}

export default App;
