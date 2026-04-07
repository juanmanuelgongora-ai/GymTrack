import React, { useState } from 'react';
import Icons from '../../logica/Icons';

const RegisterView = ({ step, setStep, formData, handleInputChange, toggleCondition, setView, handleRegister }) => {
    const [errors, setErrors] = useState({});

    const validateStep = (currentStep) => {
        const newErrors = {};
        if (currentStep === 1) {
            if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
            if (!formData.correo.trim()) {
                newErrors.correo = 'El correo es obligatorio.';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
                newErrors.correo = 'Ingrese un correo válido.';
            }
            if (!formData.pass) {
                newErrors.pass = 'La contraseña es obligatoria.';
            } else if (formData.pass.length < 6) {
                newErrors.pass = 'Mínimo 6 caracteres.';
            }
            if (!formData.edad) {
                newErrors.edad = 'La edad es obligatoria.';
            } else if (isNaN(formData.edad) || Number(formData.edad) < 12 || Number(formData.edad) > 100) {
                newErrors.edad = 'Edad debe ser entre 12 y 100.';
            }
            if (!formData.contacto.trim()) newErrors.contacto = 'El número de contacto es obligatorio.';
        } else if (currentStep === 2) {
            if (!formData.sexo) newErrors.sexo = 'Seleccione su sexo.';
            if (!formData.peso) {
                newErrors.peso = 'El peso es obligatorio.';
            } else if (isNaN(formData.peso) || Number(formData.peso) <= 0) {
                newErrors.peso = 'Ingrese un peso válido.';
            }
            if (!formData.estatura) {
                newErrors.estatura = 'La estatura es obligatoria.';
            } else if (isNaN(formData.estatura) || Number(formData.estatura) <= 0) {
                newErrors.estatura = 'Ingrese una estatura válida.';
            }
            if (!formData.objetivo_principal) newErrors.objetivo_principal = 'Seleccione un objetivo.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        setErrors({});
        if (step > 1) setStep(step - 1);
        else setView('login');
    };

    const handleSubmit = () => {
        if (step === 3 && formData.disclaimer) {
            handleRegister();
        }
    };

    const fieldError = (name) => errors[name] ? (
        <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: 3, display: 'block' }}>{errors[name]}</span>
    ) : null;

    const errorStyle = (name) => errors[name] ? { borderColor: '#ef4444' } : {};

    return (
        <div className="auth-card">
            <div className="logo-container">
                <div className="logo-box"><Icons.Dumbbell /></div>
                <div className="logo-text">GYM TRACK</div>
            </div>
            <h1 className="main-title">Sesión de registro</h1>
            <div className="stepper-container">
                <div className={`step-item ${step === 1 ? 'active' : ''}`}><div className="step-circle">1</div><span>Información personal</span></div>
                <div className="step-line"></div>
                <div className={`step-item ${step === 2 ? 'active' : ''}`}><div className="step-circle">2</div><span>Datos físicos</span></div>
                <div className="step-line"></div>
                <div className={`step-item ${step === 3 ? 'active' : ''}`}><div className="step-circle">3</div><span>Salud</span></div>
            </div>

            {step === 1 && (
                <div className="form-grid">
                    {[
                        { label: 'Ingrese su nombre', name: 'nombre', placeholder: 'ej: Juan Manuel Lopez', icon: <Icons.User /> },
                        { label: 'Ingrese su dirección', name: 'direccion', placeholder: 'Ej: Calle 12 Bis #12-23', icon: <Icons.Map /> },
                        { label: 'Ingrese su edad', name: 'edad', placeholder: 'ej: 18' },
                        { label: 'Ingrese su correo', name: 'correo', placeholder: 'tu@email.com', icon: <Icons.Mail /> },
                        { label: 'Seleccione su EPS', name: 'eps', isSelect: true, options: ["Seleccione...", "Sura", "Sanitas", "Compensar", "Coomeva", "Nueva EPS"] },
                        { label: 'Ingrese su contraseña', name: 'pass', placeholder: '••••••••', icon: <Icons.Lock />, type: 'password' },
                        { label: 'Ingrese su número de contacto', name: 'contacto', placeholder: 'Ej: 31666666', icon: <Icons.Phone /> },
                        { label: 'Ingrese número de familiar', name: 'familiar', placeholder: 'Ej: 31211111', icon: <Icons.Users /> },
                    ].map((f, i) => (
                        <div key={i} className="field-group">
                            <label className="field-label">{f.label}</label>
                            <div className="input-with-icon">
                                {f.icon && <div className="input-icon">{f.icon}</div>}
                                {f.isSelect ? (
                                    <select
                                        name={f.name}
                                        value={formData[f.name]}
                                        onChange={(e) => { handleInputChange(e); setErrors(prev => ({ ...prev, [f.name]: undefined })); }}
                                        className={`input-element ${!f.icon ? 'no-icon' : ''}`}
                                        style={errorStyle(f.name)}
                                    >
                                        {f.options.map(opt => (
                                            <option key={opt} value={opt === "Seleccione..." ? "" : opt}>{opt}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        name={f.name}
                                        type={f.type || 'text'}
                                        value={formData[f.name]}
                                        onChange={(e) => { handleInputChange(e); setErrors(prev => ({ ...prev, [f.name]: undefined })); }}
                                        className={`input-element ${!f.icon ? 'no-icon' : ''}`}
                                        placeholder={f.placeholder}
                                        style={errorStyle(f.name)}
                                    />
                                )}
                            </div>
                            {fieldError(f.name)}
                        </div>
                    ))}
                </div>
            )}

            {step === 2 && (
                <div className="form-grid">
                    <div className="field-group">
                        <label className="field-label">Objetivo principal</label>
                        <select name="objetivo_principal" value={formData.objetivo_principal || ''} onChange={(e) => { handleInputChange(e); setErrors(prev => ({ ...prev, objetivo_principal: undefined })); }} className="input-element no-icon" style={errorStyle('objetivo_principal')}>
                            <option value="">Seleccione...</option>
                            <option value="Bajar de peso">Bajar de peso</option>
                            <option value="Ganar masa muscular">Ganar masa muscular</option>
                            <option value="Mantenimiento">Mantenimiento</option>
                        </select>
                        {fieldError('objetivo_principal')}
                    </div>
                    <div className="field-group">
                        <label className="field-label">Seleccione su sexo</label>
                        <select name="sexo" value={formData.sexo} onChange={(e) => { handleInputChange(e); setErrors(prev => ({ ...prev, sexo: undefined })); }} className="input-element no-icon" style={errorStyle('sexo')}>
                            <option value="">Seleccione...</option>
                            <option value="M">Masculino</option>
                            <option value="F">Femenino</option>
                        </select>
                        {fieldError('sexo')}
                    </div>
                    <div className="field-group">
                        <label className="field-label">Ingrese su peso (kg)</label>
                        <input name="peso" value={formData.peso} onChange={(e) => { handleInputChange(e); setErrors(prev => ({ ...prev, peso: undefined })); }} className="input-element no-icon" placeholder="ej: 70" style={errorStyle('peso')} />
                        {fieldError('peso')}
                    </div>
                    <div className="field-group">
                        <label className="field-label">Ingrese su estatura (cm)</label>
                        <input name="estatura" value={formData.estatura} onChange={(e) => { handleInputChange(e); setErrors(prev => ({ ...prev, estatura: undefined })); }} className="input-element no-icon" placeholder="ej: 175" style={errorStyle('estatura')} />
                        {fieldError('estatura')}
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="selection-container">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                        <div>
                            <p className="question-text">¿Cómo describiría su estado de salud actual?</p>
                            <div className="options-grid">
                                {['Excelente', 'Bueno', 'Regular', 'Malo'].map(o => (
                                    <div key={o} className={`option-chip ${formData.salud === o ? 'selected' : ''}`} onClick={() => handleInputChange({ target: { name: 'salud', value: o } })}>{o}</div>
                                ))}
                            </div>
                            <p className="question-text">¿Ha tenido alguna cirugía en los últimos 12 meses?</p>
                            <div className="options-grid">
                                {['No', 'Sí'].map(o => <div key={o} className={`option-chip ${formData.cirugia === o ? 'selected' : ''}`} onClick={() => handleInputChange({ target: { name: 'cirugia', value: o } })}>{o}</div>)}
                            </div>
                            {formData.cirugia === 'Sí' && <input name="cirugiaDetalle" value={formData.cirugiaDetalle} onChange={handleInputChange} className="input-element no-icon detail-input" placeholder="¿Qué cirugía tuvo?" />}
                            <p className="question-text">¿Está tomando medicamentos actualmente?</p>
                            <div className="options-grid">
                                {['No', 'Sí'].map(o => <div key={o} className={`option-chip ${formData.medicamentos === o ? 'selected' : ''}`} onClick={() => handleInputChange({ target: { name: 'medicamentos', value: o } })}>{o}</div>)}
                            </div>
                            {formData.medicamentos === 'Sí' && <input name="medicamentosDetalle" value={formData.medicamentosDetalle} onChange={handleInputChange} className="input-element no-icon detail-input" placeholder="¿Qué medicamentos?" />}
                        </div>
                        <div>
                            <p className="question-text">¿Ha sido diagnosticado con alguna de estas?</p>
                            <div className="options-grid">
                                {['Problemas cardíacos', 'Presión arterial alta', 'Presión arterial baja', 'Ninguna'].map(o => (
                                    <div key={o} className={`option-chip ${formData.condiciones.includes(o) ? 'selected' : ''}`} onClick={() => toggleCondition(o)}>{o}</div>
                                ))}
                            </div>
                            <p className="question-text">¿Tiene alguna lesión actual?</p>
                            <div className="options-grid">
                                {['No', 'Sí'].map(o => <div key={o} className={`option-chip ${formData.lesion === o ? 'selected' : ''}`} onClick={() => handleInputChange({ target: { name: 'lesion', value: o } })}>{o}</div>)}
                            </div>
                            {formData.lesion === 'Sí' && <input name="lesionDetalle" value={formData.lesionDetalle} onChange={handleInputChange} className="input-element no-icon detail-input" placeholder="¿Qué lesión?" />}
                            <p className="question-text">¿Frecuencia de actividad física?</p>
                            <div className="options-grid">
                                {['Nunca', '1-2 veces', '3-4 veces', '5 o más'].map(o => (
                                    <div key={o} className={`option-chip ${formData.frecuencia === o ? 'selected' : ''}`} onClick={() => handleInputChange({ target: { name: 'frecuencia', value: o } })}>{o}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <p className="question-text">Horas promedio de sueño por día</p>
                    <div className="options-grid" style={{ marginBottom: 32 }}>
                        {['Menos de 5', '5-6', '7-8', 'Más de 8'].map(o => <div key={o} className={`option-chip ${formData.sueno === o ? 'selected' : ''}`} onClick={() => handleInputChange({ target: { name: 'sueno', value: o } })}>{o}</div>)}
                    </div>
                    <div className="disclaimer-container">
                        <div className={`checkbox-custom ${formData.disclaimer ? 'checked' : ''}`} onClick={() => handleInputChange({ target: { name: 'disclaimer', checked: !formData.disclaimer, type: 'checkbox' } })}>
                            {formData.disclaimer && <Icons.Check />}
                        </div>
                        <p className="disclaimer-text">Confirmación que la información proporcionada es verdadera y autorizo su uso para la planificación de mi entrenamiento y seguimiento de salud.</p>
                    </div>
                </div>
            )}

            <div className="button-row">
                <button className="btn-secondary" onClick={handleBack}>Regresar</button>
                <button className="btn-primary" disabled={step === 3 && !formData.disclaimer} onClick={() => step < 3 ? handleNext() : handleSubmit()}>
                    {step === 3 ? 'Registrarse' : 'Continuar'}
                </button>
            </div>

            <div className="footer-link">¿Tienes cuenta? <span onClick={() => setView('login')}>Inicia sesión aquí</span></div>
        </div>
    );
};

export default RegisterView;
