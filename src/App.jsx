import React, { useState } from 'react';


// Import Vistas (Components)
import LoginView from './vistas/auth/LoginView';
import RegisterView from './vistas/auth/RegisterView';
import ShopView from './vistas/shop/ShopView';
import PaymentModal from './vistas/shop/PaymentModal';

function App() {
  // --- Controller Logic (State & Handlers) ---
  const [view, setView] = useState('login');
  const [step, setStep] = useState(1);
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

  const handlePaymentConfirm = () => {
    alert('¡Pago completado!');
    setShowPayment(false);
    setView('login');
  };

  // --- View Rendering ---
  return (
    <div className="App">
      {view === 'login' && <LoginView setView={setView} />}

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
