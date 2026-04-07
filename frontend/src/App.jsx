import React, { useState } from 'react';


// Import Vistas (Components)
import LoginView from './vistas/auth/LoginView';
import RegisterView from './vistas/auth/RegisterView';
import ShopView from './vistas/shop/ShopView';
import PaymentModal from './vistas/shop/PaymentModal';
import PanelClienteGYMTRACK from './vistas/PanelClienteGYMTRACK';

function App() {
  // --- Controller Logic (State & Handlers) ---
  const [view, setView] = useState('login'); // Por defecto iniciar en el login
  const [step, setStep] = useState(1);
  const [userAuth, setUserAuth] = useState(null);

  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '', direccion: '', edad: '', correo: '', eps: '', pass: '', contacto: '', familiar: '',
    sexo: '', peso: '', estatura: '',
    salud: 'Excelente', cirugia: 'No', cirugiaDetalle: '', condiciones: [], medicamentos: 'No', medicamentosDetalle: '', lesion: 'No', lesionDetalle: '', frecuencia: '3-4 veces por semana', sueno: '7-8',
    disclaimer: false
  });

  const handleInputChange = (e) => {
    let { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? (checked !== undefined ? checked : value) : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const toggleCondition = (cond) => {
    setFormData(prev => {
      let nextCondiciones = [...prev.condiciones];

      if (cond === 'Ninguna') {
        // If selecting "Ninguna", clear everything else
        nextCondiciones = prev.condiciones.includes('Ninguna') ? [] : ['Ninguna'];
      } else {
        // If selecting anything else, remove "Ninguna"
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
    setView('panel_cliente');
  };

  // --- View Rendering ---
  return (
    <div className="App">
      {view === 'panel_cliente' && <PanelClienteGYMTRACK setView={setView} userAuth={userAuth} />}

      {view === 'login' && <LoginView setView={setView} setUserAuth={setUserAuth} />}

      {view === 'register' && (

        <RegisterView
          step={step}
          setStep={setStep}
          formData={formData}
          handleInputChange={handleInputChange}
          toggleCondition={toggleCondition}
          setView={setView}
        />
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
