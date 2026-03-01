import React from 'react';
import {
  FaUser, FaEnvelope, FaLock, FaBuilding,
  FaPhone, FaGlobe, FaLanguage, FaIndustry, FaLink
} from "react-icons/fa";
import "../../App.css";

// Video Background Component
export const VideoBackground = ({ src }) => {
  return (
    <video autoPlay loop muted playsInline className="fixed top-0 left-0 w-full h-full object-cover -z-10">
      <source src={src} type="video/mp4" />
      Votre navigateur ne supporte pas la vidéo.
    </video>
  );
};

// Form Container Components
export const FormContainer = ({ children }) => {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center p-8">
      {children}
    </div>
  );
};

export const FormWrapper = ({ children }) => {
  return (
    <div className="bg-white bg-opacity-90 p-10 rounded-xl shadow-lg w-full max-w-2xl">
      {children}
    </div>
  );
};

export const FormHeader = ({ title, subtitle }) => {
  return (
    <>
      <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">{title}</h2>
      {subtitle && <p className="text-gray-600 text-center mb-8">{subtitle}</p>}
    </>
  );
};

// Form Elements
export const FormGroup = ({ children, className = '' }) => {
  return <div className={`mb-6 ${className}`}>{children}</div>;
};

export const FormLabel = ({ icon, children, required = false }) => {
  return (
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {icon && <span className="mr-2 inline-block">{icon}</span>}
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

export const FormInput = React.forwardRef(({ type = 'text', error, className = '', ...props }, ref) => {
  return (
    <>
      <input
        type={type}
        className={`w-full px-4 py-3 rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${className}`}
        ref={ref}
        {...props}
      />
      {error && <FormError message={error.message} />}
    </>
  );
});

export const FormTextarea = ({ error, className = '', ...props }) => {
  return (
    <>
      <textarea
        className={`w-full px-4 py-3 rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${className}`}
        {...props}
      />
      {error && <FormError message={error.message} />}
    </>
  );
};

export const FormSelect = ({ children, error, className = '', ...props }) => {
  return (
    <>
      <select
        className={`w-full px-4 py-3 rounded-lg border ${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <FormError message={error.message} />}
    </>
  );
};

export const FormError = ({ message }) => {
  return message ? <p className="mt-1 text-sm text-red-600">{message}</p> : null;
};

export const SubmitButton = ({ children, className = '', ...props }) => {
  return (
    <button
      type="submit"
      className={`w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Stepper Components
export const FormStepper = ({ steps, currentStep }) => {
  return (
    <div className="flex justify-between mb-10">
      {steps.map((label, i) => (
        <div key={i} className="flex-1 text-center">
          <div className={`w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-full text-white font-bold 
            ${currentStep === i ? 'bg-blue-600' : currentStep > i ? 'bg-green-500' : 'bg-gray-300'}`}>
            {i + 1}
          </div>
          <p className={`text-sm ${currentStep === i ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>{label}</p>
        </div>
      ))}
    </div>
  );
};

// Custom Input Field matching RegistrationModal
export const InputField = ({ icon, label, name, register, error, type = "text", required = false }) => {
  return (
    <FormGroup>
      <FormLabel icon={icon} required={required}>{label}</FormLabel>
      <FormInput
        type={type}
        {...register(name)}
        error={error}
      />
    </FormGroup>
  );
};