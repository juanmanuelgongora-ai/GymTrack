import React, { useState } from 'react';

// Import Vistas (Components)
import LoginView from './vistas/auth/LoginView';
import RegisterView from './vistas/auth/RegisterView';
import RegisterEntrenadorView from './vistas/auth/RegisterEntrenadorView';
import ShopView from './vistas/shop/ShopView';
import PaymentModal from './vistas/shop/PaymentModal';
import PanelClienteGYMTRACK from './vistas/PanelClienteGYMTRACK';

const API_URL = '/api';

function App() {
  // --- Session State ---
  const [token, setToken] = useState(() => localStorage.getItem('gymtrack_token') || null);
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('gymtrack_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [view, setView] = useState(() => {
    const savedToken = localStorage.getItem('gymtrack_token');
    const savedUser = localStorage.getItem('gymtrack_user');
    return (savedToken && savedUser) ? (localStorage.getItem('gymtrack_view') || 'panelCliente') : 'login';
  });
  const [step, setStep] = useState(1);
  const [userAuth, setUserAuth] = useState(null);
  const [notification, setNotification] = useState(null);
  const [pendingNotification, setPendingNotification] = useState(false);
  const [clientTab, setClientTab] = useState(() => localStorage.getItem('gymtrack_tab') || 'inicio');

  const handleSetClientTab = (tab) => {
    setClientTab(tab);
    localStorage.setItem('gymtrack_tab', tab);
  };

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
    setClientTab('inicio');
    setView('panelCliente');

    if (pendingNotification) {
      setNotification({
        title: '¡Tu rutina está lista!',
        message: 'La IA ha generado tu plan personalizado de entrenamiento.',
        actionText: 'Ir a Mi Rutina'
      });
      setPendingNotification(false);
    }
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
    setClientTab('inicio'); // Reiniciar pestaña siempre al iniciar sesión
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
          objetivo_principal: formData.objetivo_principal,
          frecuencia: formData.frecuencia
        })
      });
      const data = await response.json();
      if (response.ok) {
        // Generate AI Routine
        try {
          const aiResponse = await fetch(`${API_URL}/rutinas/generar`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${data.access_token}`
            },
            body: JSON.stringify({
              objetivo: formData.objetivo_principal,
              frecuencia: formData.frecuencia,
              equipamiento: 'Gimnasio completo',
              salud: formData.salud,
              lesiones: formData.lesion === 'Sí' ? formData.lesionDetalle : 'No',
              condiciones: formData.condiciones,
              genero: formData.sexo,
              peso: formData.peso,
              estatura: formData.estatura,
              edad: formData.edad
            })
          });
          if (aiResponse.ok) {
            setPendingNotification(true);
          }
        } catch (e) {
          console.error('Error generando rutina:', e);
        }

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
        <PanelClienteGYMTRACK
          setView={handleSetView}
          token={token}
          userData={userData}
          userAuth={userAuth}
          onLogout={handleLogout}
          activeTab={clientTab}
          setActiveTab={handleSetClientTab}
        />
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

      {notification && (
        <div style={{
          position: 'fixed', bottom: '20px', right: '20px', backgroundColor: 'rgba(20, 20, 22, 0.95)',
          border: '1px solid #ff6b35', borderRadius: '12px', padding: '20px', zIndex: 9999,
          boxShadow: '0 10px 30px rgba(255, 107, 53, 0.2)', color: 'white', maxWidth: '320px',
          animation: 'fadeIn 0.5s ease'
        }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#ff6b35', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>✨</span> {notification.title}
          </h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#a1a1aa' }}>{notification.message}</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="primary-btn"
              style={{ flex: 1, padding: '8px' }}
              onClick={() => {
                setNotification(null);
                setClientTab('rutina');
                handleSetView('panelCliente');
              }}
            >
              {notification.actionText}
            </button>
            <button
              className="secondary-btn"
              style={{ padding: '8px', border: 'none' }}
              onClick={() => setNotification(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="footer-text">© 2026 GYM TRACK. Todos los derechos reservados.</div>
    </div>
  );
}

export default App;
