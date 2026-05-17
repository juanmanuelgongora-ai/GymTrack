import React, { useState } from 'react';
import { useUser } from './logica/UserContext';

// Import Vistas (Components)
import LoginView from './vistas/auth/LoginView';
import RegisterView from './vistas/auth/RegisterView';
import RegisterEntrenadorView from './vistas/auth/RegisterEntrenadorView';
import ShopView from './vistas/shop/ShopView';
import PanelAdminGYMTRACK from './vistas/PanelAdminGYMTRACK';
import PaymentModal from './vistas/shop/PaymentModal';
import ReceiptModal from './vistas/shop/ReceiptModal';
import PanelClienteGYMTRACK from './vistas/PanelClienteGYMTRACK';
import PanelEntrenadorGYMTRACK from './vistas/PanelEntrenadorGYMTRACK';
import ExpiredMembresiaView from './vistas/auth/ExpiredMembresiaView';

const API_URL = '/api';

const initialFormData = {
  nombre: '', direccion: '', edad: '', correo: '', eps: '', pass: '', contacto: '', familiar: '',
  sexo: '', peso: '', estatura: '', objetivo_principal: '',
  salud: 'Excelente', cirugia: 'No', cirugiaDetalle: '', condiciones: [], medicamentos: 'No', medicamentosDetalle: '', lesion: 'No', lesionDetalle: '', frecuencia: '3-4 veces por semana', sueno: '7-8',
  disclaimer: false
};

function App() {
  const { token, userData, saveSession, updateUser, logout } = useUser();

  const [view, setView] = useState(() => {
    try {
      const savedToken = localStorage.getItem('gymtrack_token');
      const savedUser = localStorage.getItem('gymtrack_user');
      if (savedToken && savedUser && savedUser !== 'undefined') {
        const savedView = localStorage.getItem('gymtrack_view');
        return savedView ? savedView : 'panelCliente';
      }
      return 'login';
    } catch (error) {
      console.error('Error accessing local storage:', error);
      return 'login';
    }
  });

  const [step, setStep] = useState(1);
  const [notification, setNotification] = useState(null);
  const [pendingNotification, setPendingNotification] = useState(false);
  const [clientTab, setClientTab] = useState(() => localStorage.getItem('gymtrack_tab') || 'inicio');
  const [autoStartPlan, setAutoStartPlan] = useState(null);

  const handleSetClientTab = (tab) => {
    setClientTab(tab);
    localStorage.setItem('gymtrack_tab', tab);
  };

  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [formData, setFormData] = useState(initialFormData);

  const handleSetView = React.useCallback((newView) => {
    if (newView === 'register') {
      setFormData(initialFormData);
      setStep(1);
    }
    localStorage.setItem('gymtrack_view', newView);
    setView(newView);
  }, []);

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
    logout();
    handleSetView('login');
  };

  React.useEffect(() => {
    if (userData && userData.rol === 'cliente' && view === 'panelCliente') {
      const isExpired = userData.cliente?.vencimiento_membresia && new Date(userData.cliente.vencimiento_membresia) < new Date();
      if (isExpired) {
        handleSetView('expiredMembresia');
      }
    }
  }, [userData, view, handleSetView]);

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

  const handlePaymentConfirm = async (method, cardData) => {
    try {
      const response = await fetch(`${API_URL}/membresia/renovar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plan_nombre: selectedPlan.name,
          meses: selectedPlan.duration.includes('mes') ? parseInt(selectedPlan.duration) : 1,
          monto: selectedPlan.price,
          metodo_pago: method,
          detalles_pago: cardData
        })
      });

      const resData = await response.json();

      if (response.ok) {
        if (method !== 'transferencia') {
          localStorage.setItem('gymtrack_preferred_payment', method);
        }

        updateUser(resData.user);

        if (resData.transaccion) {
          setCurrentTransaction(resData.transaccion);
          setShowReceipt(true);
        } else {
          // Fallback if transaction isn't returned for some reason
          alert(`¡Membresía renovada exitosamente con ${method.toUpperCase()}!`);
          setClientTab('inicio');
          handleSetView('panelCliente');
        }

        setShowPayment(false);

        if (pendingNotification && resData.transaccion?.estado !== 'pendiente') {
          setNotification({
            title: '¡Tu rutina está lista!',
            message: 'La IA ha generado tu plan personalizado de entrenamiento.',
            actionText: 'Ir a Mi Rutina'
          });
          setPendingNotification(false);
        }
      } else {
        alert('Error en el pago: ' + (resData.message || 'No se pudo procesar la transacción.'));
      }
    } catch (error) {
      console.error('Error procesando pago:', error);
      alert('Error de conexión con el servidor.');
    }
  };

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

    let targetView = 'panelCliente';
    if (data.user.rol === 'entrenador') {
      targetView = 'panelEntrenador';
    } else if (data.user.rol === 'admin') {
      targetView = 'panelAdmin';
    }

    setClientTab('inicio');
    saveSession(data.access_token, data.user);

    if (data.user.rol === 'cliente' && !data.membresia_activa) {
      targetView = 'expiredMembresia';
    }

    handleSetView(targetView);
    return data;
  };

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
          frecuencia: formData.frecuencia,
          condicion_medica: JSON.stringify({
            salud: formData.salud,
            cirugia: formData.cirugia === 'Sí' ? formData.cirugiaDetalle : 'No',
            medicamentos: formData.medicamentos === 'Sí' ? formData.medicamentosDetalle : 'No',
            condiciones: formData.condiciones,
            lesion: formData.lesion === 'Sí' ? formData.lesionDetalle : 'No',
            sueno: formData.sueno
          })
        })
      });
      const data = await response.json();
      if (response.ok) {
        try {
          await fetch(`${API_URL}/rutinas/generar`, {
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
          setPendingNotification(true);
        } catch (e) {
          console.error('Error generando rutina:', e);
        }

        saveSession(data.access_token, data.user);
        handleSetView('shop');
      } else {
        alert('Error de registro: ' + (data.message || JSON.stringify(data.errors)));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('No se pudo conectar al servidor.');
    }
  };

  const handleRegisterEntrenador = async (entrenadorData) => {
    try {
      const nameParts = entrenadorData.nombre.trim().split(' ');
      const nombre = nameParts[0] || 'Desconocido';
      const apellido = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '.';

      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('apellido', apellido);
      formData.append('email', entrenadorData.correo);
      formData.append('password', entrenadorData.password);
      formData.append('rol', 'entrenador');
      formData.append('edad', entrenadorData.edad);
      formData.append('genero', entrenadorData.sexo);
      formData.append('contacto', entrenadorData.contacto);
      formData.append('direccion', entrenadorData.direccion);
      formData.append('emergencia', entrenadorData.emergencia);
      formData.append('especialidad', entrenadorData.especialidad);
      formData.append('experiencia', entrenadorData.experiencia);
      formData.append('certificacion', entrenadorData.certificacion);
      formData.append('capacidad_maxima', entrenadorData.capacidad_maxima);
      formData.append('objetivos', entrenadorData.objetivos);

      if (entrenadorData.certificacion_archivo) {
        formData.append('certificacion_archivo', entrenadorData.certificacion_archivo);
      }
      formData.append('horarios', JSON.stringify(entrenadorData.horarios));
      formData.append('tipos_entrenamiento', JSON.stringify(entrenadorData.tipos_entrenamiento));

      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        alert('Registro completado. Tu solicitud ha sido enviada al administrador y se encuentra pendiente de aprobación. Serás notificado cuando se tome una decisión.');
        handleSetView('login');
      } else {
        alert('Error de registro: ' + (data.message || JSON.stringify(data.errors)));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('No se pudo conectar al servidor.');
    }
  };

  return (
    <div className="App">
      {view === 'login' && <LoginView setView={handleSetView} onLogin={handleLogin} />}

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
          onLogout={handleLogout}
          activeTab={clientTab}
          setActiveTab={handleSetClientTab}
          autoStartPlan={autoStartPlan}
          setAutoStartPlan={setAutoStartPlan}
        />
      )}

      {view === 'panelEntrenador' && (
        <PanelEntrenadorGYMTRACK
          setView={handleSetView}
          onLogout={handleLogout}
        />
      )}

      {view === 'panelAdmin' && (
        <PanelAdminGYMTRACK onLogout={handleLogout} />
      )}

      {view === 'expiredMembresia' && (
        <ExpiredMembresiaView
          userData={userData}
          transaction={currentTransaction}
          onLogout={handleLogout}
          onGoToShop={() => handleSetView('shop')}
        />
      )}

      {view === 'shop' && (
        <ShopView
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          setShowPayment={setShowPayment}
          setView={handleSetView}
          onLogout={handleLogout}
        />
      )}

      {showPayment && (
        <PaymentModal
          plan={selectedPlan}
          onClose={() => setShowPayment(false)}
          onConfirm={handlePaymentConfirm}
        />
      )}

      {showReceipt && (
        <ReceiptModal
          transaction={currentTransaction}
          plan={selectedPlan}
          onClose={() => {
            setShowReceipt(false);
            if (currentTransaction?.estado === 'pendiente') {
              handleSetView('expiredMembresia');
            } else {
              setClientTab('inicio');
              handleSetView('panelCliente');
            }
          }}
        />
      )}

      {notification && (
        <div className="notification-toast">
          <h3>✨ {notification.title}</h3>
          <p>{notification.message}</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="primary-btn" onClick={() => {
              setNotification(null);
              if (currentTransaction?.estado === 'pendiente' || (userData?.rol === 'cliente' && !userData?.membresia_activa)) {
                handleSetView('expiredMembresia');
              } else {
                setClientTab('rutina');
                handleSetView('panelCliente');
              }
            }}>
              {notification.actionText}
            </button>
            <button className="secondary-btn" onClick={() => setNotification(null)}>✕</button>
          </div>
        </div>
      )}

      <div className="footer-text">© 2026 GYM TRACK. Todos los derechos reservados.</div>
    </div>
  );
}

export default App;
