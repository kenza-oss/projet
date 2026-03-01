import React, { useState } from 'react';
import CategorySelector from '../components/CategorySelector';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Select from 'react-select';
import countryList from 'country-list';

const steps = ['Entreprise', 'Documents', 'Exportation', 'Finalisation'];

const ProducerRegister = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    companyName: '',
    activity: '',
    email: '',
    phone: '',
    whatsapp: '',
    country: null,
    city: '',
    address1: '',
    address2: '',
    rcNumber: '',
    nifNumber: '',
    certifications: [],
    techSheets: [],
    minExportQuantity: '',
    monthlyCapacity: '',
    yearlyCapacity: '',
    targetMarkets: [],
    exportCategories: [],
    description: '',
  });
  const [globalError, setGlobalError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

const countryOptions = countryList.getData()
  .map(country => ({
    value: country.code,
    label: country.name
  }))
  .sort((a, b) => a.label.localeCompare(b.label, 'en', { sensitivity: 'base' }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    setValidationErrors(prev => ({ ...prev, [name]: false }));
    setGlobalError('');
  };

  const handlePhoneChange = (value, name) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationErrors(prev => ({ ...prev, [name]: false }));
    setGlobalError('');
  };

  const handleCountryChange = (selectedOption) => {
    setFormData(prev => ({ ...prev, country: selectedOption }));
    setValidationErrors(prev => ({ ...prev, country: false }));
    setGlobalError('');
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: [...files] }));
    setValidationErrors(prev => ({ ...prev, [name]: false }));
    setGlobalError('');
  };

  const handleCategorySelect = (selected) => {
    setFormData(prev => ({ ...prev, exportCategories: selected }));
    setValidationErrors(prev => ({ ...prev, exportCategories: false }));
    setGlobalError('');
  };

  const isEmailValid = (email) => /^\S+@\S+\.\S+$/.test(email);

  const validateStep = () => {
    const newErrors = {};
    
    if (step === 0) {
      if (!formData.companyName) newErrors.companyName = true;
      if (!formData.activity) newErrors.activity = true;
      if (!formData.email || !isEmailValid(formData.email)) newErrors.email = true;
      if (!formData.phone) newErrors.phone = true;
      if (!formData.whatsapp) newErrors.whatsapp = true;
      if (!formData.country) newErrors.country = true;
      if (!formData.city) newErrors.city = true;
      if (!formData.address1) newErrors.address1 = true;
    }
    
    if (step === 1) {
      if (!formData.rcNumber) newErrors.rcNumber = true;
      if (!formData.nifNumber) newErrors.nifNumber = true;
    }
    
    if (step === 2) {
      if (!formData.minExportQuantity) newErrors.minExportQuantity = true;
      if (!formData.monthlyCapacity) newErrors.monthlyCapacity = true;
      if (!formData.yearlyCapacity) newErrors.yearlyCapacity = true;
      if (formData.exportCategories.length === 0) newErrors.exportCategories = true;
    }
    
    if (step === 3) {
      if (!formData.description || formData.description.length < 10) newErrors.description = true;
    }

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getInputClass = (fieldName) => 
    `border px-3 py-2 rounded w-full ${validationErrors[fieldName] ? 'border-red-500' : 'border-gray-300'}`;

  const handleNext = () => {
    if (!validateStep()) {
      setGlobalError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setStep(step + 1);
    setGlobalError('');
  };

  const handlePrev = () => {
    setStep(step - 1);
    setGlobalError('');
    setValidationErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep()) {
      setGlobalError('Veuillez remplir tous les champs obligatoires');
      return;
    }
    alert('Inscription envoyée !');
    //send to API
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-center mb-6">Inscription Producteur</h1>

      {/* Stepper */}
      <div className="flex justify-between mb-8">
        {steps.map((label, i) => (
          <div key={i} className="flex-1 text-center">
            <div className={`w-10 h-10 mx-auto mb-1 flex items-center justify-center rounded-full text-white font-bold 
              ${step === i ? 'bg-blue-600' : step > i ? 'bg-green-500' : 'bg-gray-300'}`}>
              {i + 1}
            </div>
            <p className={`text-sm ${step === i ? 'text-blue-600' : 'text-gray-500'}`}>{label}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1 */}
        {step === 0 && (
          <div className="space-y-6">
            {/* Company Information */}
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom entreprise *</label>
                  <input
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={getInputClass('companyName')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Activité principale *</label>
                  <input
                    name="activity"
                    value={formData.activity}
                    onChange={handleChange}
                    className={getInputClass('activity')}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Informations de Contact</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={getInputClass('email')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                  <PhoneInput
                    international
                    value={formData.phone}
                    onChange={(value) => handlePhoneChange(value, 'phone')}
                    className={getInputClass('phone')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp *</label>
                  <PhoneInput
                    international
                    value={formData.whatsapp}
                    onChange={(value) => handlePhoneChange(value, 'whatsapp')}
                    className={getInputClass('whatsapp')}
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b pb-2">Localisation</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pays *</label>
                  <Select
                    options={countryOptions}
                    value={formData.country}
                    onChange={handleCountryChange}
                    className={`react-select-container ${validationErrors.country ? 'border-red-500' : ''}`}
                    classNamePrefix="react-select"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={getInputClass('city')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse ligne 1 *</label>
                  <input
                    name="address1"
                    value={formData.address1}
                    onChange={handleChange}
                    className={getInputClass('address1')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse ligne 2 (optionnelle)</label>
                  <input
                    name="address2"
                    value={formData.address2}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded w-full border-gray-300"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">Documents Officiels</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">N° RC *</label>
                <input
                  name="rcNumber"
                  value={formData.rcNumber}
                  onChange={handleChange}
                  className={getInputClass('rcNumber')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">N° NIF *</label>
                <input
                  name="nifNumber"
                  value={formData.nifNumber}
                  onChange={handleChange}
                  className={getInputClass('nifNumber')}
                />
              </div>
            </div>

            <h2 className="text-xl font-semibold border-b pb-2">Fichiers</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Certifications (PDF)</label>
                <input 
                  name="certifications" 
                  type="file" 
                  multiple 
                  accept=".pdf" 
                  onChange={handleFileChange} 
                  className="border px-3 py-2 rounded w-full border-gray-300"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fiches techniques (PDF)</label>
                <input 
                  name="techSheets" 
                  type="file" 
                  multiple 
                  accept=".pdf" 
                  onChange={handleFileChange} 
                  className="border px-3 py-2 rounded w-full border-gray-300"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">Capacités de Production</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantité minimale *</label>
                <input
                  name="minExportQuantity"
                  value={formData.minExportQuantity}
                  onChange={handleChange}
                  className={getInputClass('minExportQuantity')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacité mensuelle *</label>
                <input
                  name="monthlyCapacity"
                  value={formData.monthlyCapacity}
                  onChange={handleChange}
                  className={getInputClass('monthlyCapacity')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Capacité annuelle *</label>
                <input
                  name="yearlyCapacity"
                  value={formData.yearlyCapacity}
                  onChange={handleChange}
                  className={getInputClass('yearlyCapacity')}
                />
              </div>
            </div>

            <h2 className="text-xl font-semibold border-b pb-2">Marchés et Catégories</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marchés cibles</label>
                <select
                  name="targetMarkets"
                  multiple
                  className="border px-3 py-2 rounded w-full border-gray-300"
                  onChange={handleChange}
                >
                  <option value="Afrique">Afrique</option>
                  <option value="Europe">Europe</option>
                  <option value="Amérique du Nord">Amérique du Nord</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégories exportables *</label>
                <CategorySelector
                  onSelect={handleCategorySelect}
                  className={validationErrors.exportCategories ? 'border-red-500' : ''}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2">Description de l'Entreprise</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                name="description"
                rows="4"
                className={getInputClass('description')}
                value={formData.description}
                onChange={handleChange}
                placeholder="Décrivez votre entreprise, produits, marché visé..."
              />
            </div>
          </div>
        )}

        {/* Global error message */ }
        {globalError && (
          <div className="text-red-500 font-medium text-center p-2 border border-red-500 rounded">
            {globalError}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between pt-6">
          {step > 0 && (
            <button type="button" onClick={handlePrev} className="px-5 py-2 bg-gray-300 hover:bg-gray-400 rounded text-gray-700">
              ⬅
            </button>
          )}
          {step < steps.length - 1 ? (
            <button type="button" onClick={handleNext} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              ➡
            </button>
          ) : (
            <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
              Envoyer
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProducerRegister;