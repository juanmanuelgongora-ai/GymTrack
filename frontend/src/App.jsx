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
  const [view, setView] = useState('login'); // Por defecto iniciar en el login
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [step, setStep] = useState(1);
  const [userAuth, setUserAuth] = useState(null);

  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const initialFormData = {
    nombre: '', direccion: '', edad: '', correo: '', eps: '', pass: '', contacto: '', familiar: '',
    sexo: '', peso: '', estatura: '', objetivo_principal: '',
    salud: 'Excelente', cirugia: 'No', cirugiaDetalle: '', condiciones: [], medicamentos: 'No', medicamentosDetalle: '', lesion: 'No', lesionDetalle: '', frecuencia: '3-4 veces por semana', sueno: '7-8',
    disclaimer: false
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleSetView = (newView) => {
    if (newView === 'register') {
      setFormData(initialFormData);
      setStep(1);
    }
    setView(newView);
  };

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
    handleSetView('login');
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

  const handlePaymentConfirm = async () => {
    try {
      const payload = {
        nombre: formData.nombre.split(' ')[0] || 'Usuario',
        apellido: formData.nombre.split(' ').slice(1).join(' ') || 'Prueba',
        email: formData.correo || `user${Date.now()}@email.com`,
        password: formData.pass || '123456',
        rol: 'cliente',
        edad: formData.edad,
        sexo: formData.sexo,
        peso_kg: formData.peso,
        altura_cm: formData.estatura,
        objetivo_principal: formData.salud
      };

      const res = await fetch('http://127.0.0.1:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setUserAuth({ token: data.access_token, user: data.user });
      } else {
        // Fallback to local form data if error from backend
        setUserAuth({ token: 'mock-token', user: { ...payload, cliente: payload } });
      }
    } catch {
      // Fallback fake user if backend isn't running
      let hm = parseFloat(formData.estatura) / 100;
      let p = parseFloat(formData.peso);
      let imc = (hm > 0 && p > 0) ? (p / (hm * hm)).toFixed(2) : 0;
      setUserAuth({
        token: 'mock-token',
        user: {
          nombre: formData.nombre || 'Usuario',
          apellido: '',
          email: formData.correo,
          cliente: { peso_kg: formData.peso, altura_cm: formData.estatura, edad: formData.edad, imc: imc }
        }
      });
    }

    alert('¡Pago completado!');
    setShowPayment(false);
    setView('panelCliente');
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
      {view === 'login' && <LoginView setView={handleSetView} onLogin={handleLogin} setUserAuth={setUserAuth} />}

      {view === 'register' && (
        <RegisterView
          step={step}
          setStep={setStep}
          formData={formData}
          handleInputChange={handleInputChange}
          toggleCondition={toggleCondition}
          setView={handleSetView}
          handleRegister={handleRegister}
        />
      )}

      {view === 'registerEntrenador' && (
        <RegisterEntrenadorView setView={handleSetView} handleRegister={handleRegisterEntrenador} />
      )}

      {view === 'panelCliente' && (
        <PanelClienteGYMTRACK setView={handleSetView} token={token} userData={userData} userAuth={userAuth} onLogout={handleLogout} />
      )}

      {view === 'shop' && (
        <ShopView
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          setShowPayment={setShowPayment}
          setView={handleSetView}
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
