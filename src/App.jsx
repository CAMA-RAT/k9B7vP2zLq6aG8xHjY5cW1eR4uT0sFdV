import React, { useState, useMemo } from 'react';

// --- Componente de Icono para feedback visual ---
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto text-green-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto text-red-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);


// --- Preguntas del examen basadas en el documento POE ---
const quizQuestions = [
    {
        question: "¿Con qué frecuencia se debe llenar el formato de monitoreo mecánico MAS-F-REG-100?",
        options: ["Una vez al día, por la mañana.", "Dos veces dentro del horario laboral (A.M. y P.M.).", "Una vez por semana.", "Solo cuando hay una falla."],
        answer: "Dos veces dentro del horario laboral (A.M. y P.M.).",
    },
    {
        question: "¿Qué herramienta está permitida para llenar el formato?",
        options: ["Lápiz, para poder borrar.", "Cualquier tipo de pluma.", "Únicamente pluma de tinta indeleble (azul).", "Marcador permanente."],
        answer: "Únicamente pluma de tinta indeleble (azul).",
    },
    {
        question: "Si comete un error al escribir en la bitácora, ¿cuál es el procedimiento correcto?",
        options: ["Usar líquido corrector.", "Tachar la información y escribir al lado.", "Arrancar la hoja y empezar de nuevo.", "Notificar, anotar al pie de página el valor correcto con fecha, iniciales y recabar firmas."],
        answer: "Notificar, anotar al pie de página el valor correcto con fecha, iniciales y recabar firmas.",
    },
    {
        question: "Al encontrar un valor fuera del rango establecido, ¿cuál es el primer paso a seguir?",
        options: ["Ajustar el equipo inmediatamente.", "Interrumpir el llenado y notificar al supervisor por el medio más rápido.", "Esperar al final del turno para reportarlo.", "Anotarlo y continuar con las demás mediciones."],
        answer: "Interrumpir el llenado y notificar al supervisor por el medio más rápido.",
    },
    {
        question: "Para documentar una desviación en la bitácora, ¿qué se debe hacer sobre el valor incorrecto?",
        options: ["Subrayarlo con color azul.", "Encerrarlo en un círculo.", "Dibujar un asterisco (*) en color rojo.", "No hacer nada especial, solo anotarlo en comentarios."],
        answer: "Dibujar un asterisco (*) en color rojo.",
    },
    {
        question: "¿Qué información es crucial proveer al notificar una desviación al supervisor?",
        options: ["Número de punto, descripción del parámetro, valor medido y hora.", "Solo el nombre del equipo que falló.", "Una posible solución al problema.", "La temperatura ambiente del cuarto."],
        answer: "Número de punto, descripción del parámetro, valor medido y hora.",
    },
    {
        question: "¿Quién debe firmar la bitácora al final del turno para validar los registros del día?",
        options: ["Solamente el Técnico de Barrera.", "El Gerente de Operaciones.", "El Supervisor de Barrera.", "Nadie, las firmas son semanales."],
        answer: "El Supervisor de Barrera.",
    },
    {
        question: "La firma del Gerente de Operaciones en la bitácora se realiza con una frecuencia:",
        options: ["Diaria", "Semanal", "Mensual", "Anual"],
        answer: "Semanal",
    },
    {
        question: "Una anotación con 'OK' en el formato se utiliza para:",
        options: ["Datos que requieren una lectura numérica (Tipo A).", "Verificar si los equipos están encendidos/apagados (Tipo B).", "Parámetros que están dentro del rango de operación esperado (Tipo C).", "Indicar que una tarea se completó."],
        answer: "Parámetros que están dentro del rango de operación esperado (Tipo C).",
    },
    {
        question: "¿Cuál es uno de los propósitos principales del POE MAS-POE-011?",
        options: ["Definir los salarios del personal técnico.", "Establecer un protocolo claro de acción ante desviaciones.", "Asignar los horarios de vacaciones.", "Controlar el inventario de refacciones."],
        answer: "Establecer un protocolo claro de acción ante desviaciones.",
    },
];

export default function App() {
    const [userData, setUserData] = useState({
        nombre: '',
        puesto: '',
        fecha: new Date().toISOString().split('T')[0],
    });
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleUserChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleAnswerChange = (questionIndex, answer) => {
        setAnswers(prev => ({ ...prev, [questionIndex]: answer }));
    };

    const score = useMemo(() => {
        return quizQuestions.reduce((total, question, index) => {
            return total + (answers[index] === question.answer ? 1 : 0);
        }, 0);
    }, [answers]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(answers).length < quizQuestions.length) {
            alert("Por favor, responde todas las preguntas antes de enviar.");
            return;
        }
        
        setShowResults(true);
        setIsSubmitting(true);

        const FORMSPREE_ENDPOINT = "https://formspree.io/f/xldllaqn";

        const finalScore = (score / quizQuestions.length) * 100;
        const submissionData = {
            ...userData,
            puntuacion: `${finalScore.toFixed(0)}% (${score}/${quizQuestions.length})`,
            respuestas: quizQuestions.map((q, i) => ({
                pregunta: q.question,
                respuesta_seleccionada: answers[i],
                es_correcta: answers[i] === q.answer ? "Sí" : "No",
            }))
        };

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });

            if (response.ok) {
                setIsSubmitted(true);
            } else {
                alert("Hubo un error al enviar tus respuestas. Por favor, inténtalo de nuevo.");
                setShowResults(false);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Hubo un error de red al enviar tus respuestas. Revisa tu conexión e inténtalo de nuevo.");
            setShowResults(false);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const resetQuiz = () => {
        setAnswers({});
        setIsSubmitted(false);
        setShowResults(false);
        setUserData({
            nombre: '',
            puesto: '',
            fecha: new Date().toISOString().split('T')[0],
        });
    };

    if (isSubmitted) {
        return (
            <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4 font-sans">
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">¡Gracias!</h1>
                    <p className="text-green-600 font-semibold text-lg mb-4">Tus respuestas fueron enviadas correctamente.</p>
                    <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-lg mb-6">
                        <p className="text-lg sm:text-xl">Tu puntuación final es:</p>
                        <p className="text-4xl sm:text-5xl font-bold my-2">{((score / quizQuestions.length) * 100).toFixed(0)}%</p>
                        <p className="text-base sm:text-lg">({score} de {quizQuestions.length} correctas)</p>
                    </div>
                    <button
                        onClick={resetQuiz}
                        className="mt-4 w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                    >
                        Realizar otro intento
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen font-sans p-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-4 sm:p-6 md:p-8">
                    
                    <header className="text-center mb-8">
                        {/* --- SECCIÓN DEL LOGO --- */}
                        {/* Reemplaza la URL de abajo con la URL de tu propio logo */}
                        <div className="inline-block bg-white-100 p-4 rounded-lg mb-6">
                            <img 
                                src="https://modelosanimales.com.mx/images/0/11703076/Logo_MAS.png" 
                                alt="MAS" 
                                className="max-h-16 sm:max-h-20 object-contain"
                            />
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Examen de Evaluación POE</h1>
                        <p className="text-gray-600 text-sm sm:text-base">Procedimiento: Llenado de Formato de Monitoreo Mecánico (MAS-POE-011)</p>
                    </header>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-gray-100 rounded-xl">
                            <div>
                                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                                <input type="text" name="nombre" id="nombre" required value={userData.nombre} onChange={handleUserChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            <div>
                                <label htmlFor="puesto" className="block text-sm font-medium text-gray-700 mb-1">Puesto</label>
                                <input type="text" name="puesto" id="puesto" required value={userData.puesto} onChange={handleUserChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            <div>
                                <label htmlFor="fecha" className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                                <input type="date" name="fecha" id="fecha" required value={userData.fecha} onChange={handleUserChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                        </div>

                        {quizQuestions.map((q, index) => (
                            <div key={index} className={`p-4 sm:p-6 mb-6 border rounded-xl transition-all duration-300 ${showResults ? (answers[index] === q.answer ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50') : 'border-gray-200'}`}>
                                <p className="font-semibold text-gray-800 mb-4">{index + 1}. {q.question}</p>
                                <div className="space-y-3">
                                    {q.options.map((option, i) => {
                                        const isSelected = answers[index] === option;
                                        const isCorrect = q.answer === option;
                                        
                                        let optionClass = "flex items-center p-3 rounded-lg border cursor-pointer transition-colors duration-200 ";
                                        if (showResults) {
                                            if (isCorrect) optionClass += "bg-green-100 border-green-300 text-green-800 font-semibold";
                                            else if (isSelected && !isCorrect) optionClass += "bg-red-100 border-red-300 text-red-800";
                                            else optionClass += "bg-white border-gray-300";
                                        } else {
                                            optionClass += isSelected ? "bg-indigo-100 border-indigo-400" : "bg-white hover:bg-gray-50";
                                        }

                                        return (
                                            <label key={i} className={optionClass}>
                                                <input
                                                    type="radio"
                                                    name={`question-${index}`}
                                                    value={option}
                                                    checked={isSelected}
                                                    onChange={() => handleAnswerChange(index, option)}
                                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                                    disabled={showResults}
                                                />
                                                <span className="ml-3 text-sm text-gray-700 flex-1">{option}</span>
                                                {showResults && isSelected && (isCorrect ? <CheckIcon /> : <XIcon />)}
                                            </label>
                                        );
                                    })}
                                </div>
                                {showResults && answers[index] !== q.answer && (
                                    <div className="mt-3 p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
                                        <strong>Respuesta correcta:</strong> {q.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        <div className="mt-8 text-center">
                            {showResults ? (
                                <div className="p-6 bg-blue-100 rounded-xl">
                                    <h3 className="text-xl sm:text-2xl font-bold text-blue-800">Puntuación Obtenida</h3>
                                    <p className="text-4xl sm:text-5xl font-bold text-blue-600 my-2">{((score / quizQuestions.length) * 100).toFixed(0)}%</p>
                                    <p className="text-lg sm:text-xl text-blue-700">({score} de {quizQuestions.length} respuestas correctas)</p>
                                </div>
                            ) : (
                                 <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-indigo-600 text-white font-bold py-3 px-12 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                    {isSubmitting ? "Enviando..." : "Ver Resultados y Enviar"}
                                 </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}