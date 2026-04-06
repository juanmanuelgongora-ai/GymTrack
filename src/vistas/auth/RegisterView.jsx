import React from 'react';
import Icons from '../../logica/Icons';

const RegisterView = ({ step, setStep, formData, handleInputChange, toggleCondition, setView }) => (
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
                    { label: 'Seleccione su EPS', name: 'eps', placeholder: 'EPS Sanitas...' },
                    { label: 'Ingrese su contraseña', name: 'pass', placeholder: '••••••••', icon: <Icons.Lock /> },
                    { label: 'Ingrese su número de contacto', name: 'contacto', placeholder: 'Ej: 31666666', icon: <Icons.Phone /> },
                    { label: 'Ingrese número de familiar', name: 'familiar', placeholder: 'Ej: 31211111', icon: <Icons.Users /> },
                ].map((f, i) => (
                    <div key={i} className="field-group">
                        <label className="field-label">{f.label}</label>
                        <div className="input-with-icon">
                            {f.icon && <div className="input-icon">{f.icon}</div>}
                            <input name={f.name} value={formData[f.name]} onChange={handleInputChange} className={`input-element ${!f.icon ? 'no-icon' : ''}`} placeholder={f.placeholder} />
                        </div>
                    </div>
                ))}
            </div>
        )}

        {step === 2 && (
            <div className="form-grid">
                <div className="field-group"><label className="field-label">Ingrese su edad</label><input name="edad" value={formData.edad} onChange={handleInputChange} className="input-element no-icon" placeholder="ej: 18" /></div>
                <div className="field-group"><label className="field-label">Seleccione su sexo</label>
                    <select name="sexo" value={formData.sexo} onChange={handleInputChange} className="input-element no-icon">
                        <option value="">Seleccione...</option><option value="M">Masculino</option><option value="F">Femenino</option>
                    </select>
                </div>
                <div className="field-group"><label className="field-label">Ingrese su peso (kg)</label><input name="peso" value={formData.peso} onChange={handleInputChange} className="input-element no-icon" placeholder="ej: 70" /></div>
                <div className="field-group"><label className="field-label">Ingrese su estatura (cm)</label><input name="estatura" value={formData.estatura} onChange={handleInputChange} className="input-element no-icon" placeholder="ej: 175" /></div>
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
            <button className="btn-secondary" onClick={() => step > 1 ? setStep(step - 1) : setView('login')}>Regresar</button>
            <button className="btn-primary" disabled={step === 3 && !formData.disclaimer} onClick={() => step < 3 ? setStep(step + 1) : setView('shop')}>
                {step === 3 ? 'Registrarse' : 'Continuar'}
            </button>
        </div>

        <div className="footer-link">¿Tienes cuenta? <span onClick={() => setView('login')}>Inicia sesión aquí</span></div>
    </div>
);

export default RegisterView;
