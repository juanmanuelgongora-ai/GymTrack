import React, { useState } from 'react';
import Icons from '../../logica/Icons';

const RegisterEntrenadorView = ({ setView, handleRegister }) => {
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        nombre: '',
        edad: '',
        sexo: '',
        contacto: '',
        direccion: '',
        correo: '',
        password: '',
        emergencia: '',
        especialidad: '',
        experiencia: '',
        certificacion: '',
        horarios: [],
        tipos_entrenamiento: [],
        capacidad_maxima: '',
        objetivos: '',
        acepta_terminos: false
    });

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;
        setFormData((prev) => ({ ...prev, [name]: finalValue }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const toggleArrayItem = (field, value) => {
        setFormData((prev) => {
            const arr = prev[field];
            if (arr.includes(value)) {
                return { ...prev, [field]: arr.filter(item => item !== value) };
            } else {
                return { ...prev, [field]: [...arr, value] };
            }
        });
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validateStep = (currentStep) => {
        const newErrors = {};
        if (currentStep === 1) {
            if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
            if (!formData.correo.trim()) {
                newErrors.correo = 'El correo es obligatorio.';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
                newErrors.correo = 'Ingrese un correo válido.';
            }
            if (!formData.password) {
                newErrors.password = 'La contraseña es obligatoria.';
            } else if (formData.password.length < 6) {
                newErrors.password = 'Mínimo 6 caracteres.';
            }
            if (!formData.edad) {
                newErrors.edad = 'La edad es obligatoria.';
            } else if (isNaN(formData.edad) || Number(formData.edad) < 18 || Number(formData.edad) > 70) {
                newErrors.edad = 'Edad debe ser entre 18 y 70.';
            }
            if (!formData.sexo) newErrors.sexo = 'Seleccione su sexo.';
            if (!formData.contacto.trim()) newErrors.contacto = 'El contacto es obligatorio.';
        } else if (currentStep === 2) {
            if (!formData.especialidad.trim()) newErrors.especialidad = 'La especialidad es obligatoria.';
            if (!formData.experiencia) {
                newErrors.experiencia = 'La experiencia es obligatoria.';
            } else if (isNaN(formData.experiencia) || Number(formData.experiencia) < 0) {
                newErrors.experiencia = 'Ingrese un valor válido.';
            }
            if (!formData.certificacion.trim()) newErrors.certificacion = 'La certificación es obligatoria.';
        } else if (currentStep === 3) {
            if (formData.horarios.length === 0) newErrors.horarios = 'Seleccione al menos un horario.';
            if (formData.tipos_entrenamiento.length === 0) newErrors.tipos_entrenamiento = 'Seleccione al menos un tipo.';
            if (!formData.capacidad_maxima) {
                newErrors.capacidad_maxima = 'La capacidad es obligatoria.';
            } else if (isNaN(formData.capacidad_maxima) || Number(formData.capacidad_maxima) < 1) {
                newErrors.capacidad_maxima = 'Ingrese un valor válido.';
            }
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

    const handleSubmit = async () => {
        if (!formData.acepta_terminos) {
            setErrors({ acepta_terminos: 'Debes aceptar los términos y condiciones.' });
            return;
        }
        if (handleRegister) {
            handleRegister(formData);
        }
    };

    const isOptionSelected = (field, value) => formData[field].includes(value);

    const fieldError = (name) => errors[name] ? (
        <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>{errors[name]}</span>
    ) : null;

    const inputStyle = (name) => ({
        width: '100%', padding: '12px', borderRadius: '8px', background: '#2c2c2e',
        border: errors[name] ? '1px solid #ef4444' : '1px solid #3a3a3c',
        color: '#fff', boxSizing: 'border-box'
    });

    return (
        <div style={{ backgroundColor: '#111', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', color: '#fff' }}>
            <div className="logo-container" style={{ marginBottom: 20 }}>
                <div style={{ background: '#ff6b35', borderRadius: '12px', padding: '10px', display: 'flex' }}>
                    <Icons.Dumbbell color="#fff" />
                </div>
                <h2 style={{ marginLeft: 10, color: '#ff6b35' }}>GYM TRACK</h2>
            </div>

            <h1 style={{ color: '#ff6b35', fontSize: '2rem', marginBottom: '8px' }}>Registro de Entrenador</h1>
            <p style={{ color: '#888', marginBottom: '30px' }}>Únete a nuestro equipo de profesionales fitness</p>

            {/* ProgressBar */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px', width: '100%', maxWidth: '600px', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: step >= 1 ? '#ff6b35' : '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>1</div>
                    <span style={{ marginLeft: 8, fontSize: '14px', color: step >= 1 ? '#fff' : '#666' }}>Información personal</span>
                    <div style={{ height: 1, background: step >= 2 ? '#ff6b35' : '#333', flex: 1, margin: '0 10px' }}></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: step >= 2 ? '#ff6b35' : '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>2</div>
                    <span style={{ marginLeft: 8, fontSize: '14px', color: step >= 2 ? '#fff' : '#666' }}>Información profesional</span>
                    <div style={{ height: 1, background: step >= 3 ? '#ff6b35' : '#333', flex: 1, margin: '0 10px' }}></div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: step === 3 ? '#ff6b35' : '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>3</div>
                    <span style={{ marginLeft: 8, fontSize: '14px', color: step === 3 ? '#fff' : '#666' }}>Disponibilidad</span>
                </div>
            </div>

            <div style={{ background: '#1c1c1e', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '800px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                {step === 1 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#ccc' }}>Ingrese su nombre completo</label>
                            <input name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="ej: Roberto Martín Gómez" style={inputStyle('nombre')} />
                            {fieldError('nombre')}
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#ccc' }}>Ingrese su dirección</label>
                            <input name="direccion" value={formData.direccion} onChange={handleInputChange} placeholder="Ej: Calle 45 #23-15" style={inputStyle('direccion')} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#ccc' }}>Ingrese su edad</label>
                            <input name="edad" value={formData.edad} onChange={handleInputChange} placeholder="ej: 28" style={inputStyle('edad')} />
                            {fieldError('edad')}
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#ccc' }}>Ingrese su correo electrónico</label>
                            <input name="correo" type="email" value={formData.correo} onChange={handleInputChange} placeholder="tu@email.com" style={inputStyle('correo')} />
                            {fieldError('correo')}
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#ccc' }}>Seleccione su sexo</label>
                            <select name="sexo" value={formData.sexo} onChange={handleInputChange} style={inputStyle('sexo')}>
                                <option value="">Seleccione...</option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                            </select>
                            {fieldError('sexo')}
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#ccc' }}>Ingrese su contraseña</label>
                            <input name="password" type="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" style={inputStyle('password')} />
                            {fieldError('password')}
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#ccc' }}>Ingrese su número de contacto</label>
                            <input name="contacto" value={formData.contacto} onChange={handleInputChange} placeholder="Ej: 3166666666" style={inputStyle('contacto')} />
                            {fieldError('contacto')}
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#ccc' }}>Teléfono de emergencia</label>
                            <input name="emergencia" value={formData.emergencia} onChange={handleInputChange} placeholder="Ej: 3121111111" style={inputStyle('emergencia')} />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#ccc' }}>Especialidad principal</label>
                            <input name="especialidad" value={formData.especialidad} onChange={handleInputChange} placeholder="ej: Fuerza y Acondicionamiento" style={inputStyle('especialidad')} />
                            {fieldError('especialidad')}
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#ccc' }}>Años de experiencia</label>
                            <input name="experiencia" type="number" value={formData.experiencia} onChange={handleInputChange} placeholder="ej: 8" style={inputStyle('experiencia')} />
                            {fieldError('experiencia')}
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#ccc' }}>Certificación más alta / Título</label>
                            <input name="certificacion" value={formData.certificacion} onChange={handleInputChange} placeholder="ej: Personal Trainer SENA" style={inputStyle('certificacion')} />
                            {fieldError('certificacion')}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#ccc' }}>Horarios disponibles</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                                {['L-V (Mañana)', 'L-V (Tarde)', 'L-V (Noche)', 'Sábado (Mañana)', 'Sábado (Tarde)', 'Domingos'].map(h => (
                                    <div key={h} onClick={() => toggleArrayItem('horarios', h)} style={{ padding: '10px', background: isOptionSelected('horarios', h) ? 'rgba(255, 107, 53, 0.2)' : '#2c2c2e', border: isOptionSelected('horarios', h) ? '1px solid #ff6b35' : '1px solid #3a3a3c', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', fontSize: '12px' }}>
                                        {h}
                                    </div>
                                ))}
                            </div>
                            {fieldError('horarios')}
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#ccc' }}>Tipos de entrenamiento que imparte</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                                {['Sesiones Individuales', 'Entrenamiento Grupal', 'Online/Virtual', 'Entrenamiento en Casa', 'Boot Camps', 'Clases Especializadas'].map(t => (
                                    <div key={t} onClick={() => toggleArrayItem('tipos_entrenamiento', t)} style={{ padding: '10px', background: isOptionSelected('tipos_entrenamiento', t) ? 'rgba(255, 107, 53, 0.2)' : '#2c2c2e', border: isOptionSelected('tipos_entrenamiento', t) ? '1px solid #ff6b35' : '1px solid #3a3a3c', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', fontSize: '12px' }}>
                                        {t}
                                    </div>
                                ))}
                            </div>
                            {fieldError('tipos_entrenamiento')}
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#ccc' }}>Capacidad máxima de clientes</label>
                            <input name="capacidad_maxima" type="number" value={formData.capacidad_maxima} onChange={handleInputChange} placeholder="ej: 20" style={inputStyle('capacidad_maxima')} />
                            {fieldError('capacidad_maxima')}
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', color: '#ccc' }}>Objetivos profesionales</label>
                            <textarea name="objetivos" value={formData.objetivos} onChange={handleInputChange} placeholder="Describa brevemente sus objetivos como entrenador personal..." rows={3} style={{ ...inputStyle('objetivos'), resize: 'none' }}></textarea>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '8px', border: errors.acepta_terminos ? '1px solid #ef4444' : '1px solid #333' }}>
                            <input type="checkbox" name="acepta_terminos" checked={formData.acepta_terminos} onChange={handleInputChange} id="terms" style={{ marginRight: '10px', width: '20px', height: '20px', accentColor: '#ff6b35' }} />
                            <label htmlFor="terms" style={{ fontSize: '13px', color: '#aaa', lineHeight: '1.4' }}>Confirmación que la información proporcionada es verdadera, acepto los términos y condiciones del gimnasio y me comprometo a mantener los estándares profesionales.</label>
                        </div>
                        {fieldError('acepta_terminos')}
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
                    <button onClick={handleBack} style={{ padding: '12px 30px', background: 'transparent', border: '1px solid #3a3a3c', color: '#fff', borderRadius: '8px', cursor: 'pointer' }}>
                        Regresar
                    </button>
                    {step < 3 ? (
                        <button onClick={handleNext} style={{ padding: '12px 40px', background: '#ff6b35', border: 'none', color: '#fff', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                            Continuar
                        </button>
                    ) : (
                        <button onClick={handleSubmit} disabled={!formData.acepta_terminos} style={{ padding: '12px 40px', background: formData.acepta_terminos ? '#d6541f' : '#555', border: 'none', color: '#fff', borderRadius: '8px', fontWeight: 'bold', cursor: formData.acepta_terminos ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            ✓ Enviar solicitud
                        </button>
                    )}
                </div>

                <div style={{ textAlign: 'center', marginTop: '30px', fontSize: '14px', color: '#666' }}>
                    ¿Ya tienes cuenta? <span onClick={() => setView('login')} style={{ color: '#ff6b35', cursor: 'pointer' }}>Inicia sesión aquí</span>
                </div>
            </div>
            <div style={{ marginTop: 'auto', paddingTop: '20px', fontSize: '12px', color: '#444' }}>© 2026 GYM TRACK. Todos los derechos reservados.</div>
        </div>
    );
};

export default RegisterEntrenadorView;
