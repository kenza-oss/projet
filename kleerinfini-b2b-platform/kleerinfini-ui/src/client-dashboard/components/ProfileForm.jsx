// src/components/ProfileForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import clientAvatar from '../../assets/avatar.png';
import { useTranslation } from 'react-i18next';
import backgroundVideo from '../../assets/videoC.mp4';

const MyProfile = () => {
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm();
  const [activeSection, setActiveSection] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const onSubmit = (data) => {
    console.log(t('profil.updated'), data);
  };

  const onPasswordChange = (data) => {
    console.log(t('profil.passwordChanged'), data);
  };

  const confirmDeletion = () => {
    setActiveSection('delete');
  };

  const cancelDelete = () => {
    setActiveSection(null);
  };

  const deleteAccount = () => {
    console.log(t('profil.accountDeleted'));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative w-full h-full text-black">
      <video
        autoPlay
        muted
        loop
        playsInline
        className=" top-0  w-full h-full object-cover -z-10 fixed  left-64 right-0 bottom-0 bg-cover bg-center bg-no-repeat "
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>

      <div className=" min-h-screen flex items-center justify-center px-6">
        <div className="w-full">
          <h2 className="text-3xl font-bold text-orange-400 mb-6 text-center">
            {t('profil.title')}
          </h2>

          <div className="space-y-4 mb-10 max-w-xl mx-auto">
            <button
              onClick={() => setActiveSection('info')}
              className="w-full text-black bg-white py-3 px-6 rounded hover:bg-orange-600"
            >
              🔧 {t('profil.editInfo')}
            </button>
            <button
              onClick={() => setActiveSection('password')}
              className="w-full text-black bg-white py-3 px-6 rounded hover:bg-orange-600"
            >
              🔐 {t('profil.changePassword')}
            </button>
            <button
              onClick={confirmDeletion}
              className="w-full text-black bg-white py-3 px-6 rounded hover:bg-red-700"
            >
              🗑️ {t('profil.deleteAccount')}
            </button>
          </div>

          {activeSection === 'info' && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto bg-white bg-opacity-90 p-6 rounded-lg shadow-lg"
            >
              <div className="md:col-span-2 text-center">
                <label htmlFor="profileImage" className="block mb-2 font-semibold text-orange-600">
                  {t('profil.profilePicture')}
                </label>
                <div className="mx-auto w-24 h-24 rounded-full overflow-hidden border-2 border-orange-400 mb-4">
                  {profileImage ? (
                    <img src={clientAvatar} alt="Profil" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                      {t('profil.avatarPlaceholder')}
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm mx-auto"
                />
              </div>

              <input id="nom" {...register('nom')} className="input" placeholder={t('profil.lastName')} />
              <input id="prenom" {...register('prenom')} className="input" placeholder={t('profil.firstName')} />
              <input id="email" {...register('email')} type="email" className="input" placeholder={t('profil.email')} />
              <input id="telephone" {...register('telephone')} className="input" placeholder={t('profil.phone')} />
              <input id="societe" {...register('societe')} className="input" placeholder={t('profil.company')} />
              <input id="siteweb" {...register('siteweb')} className="input" placeholder={t('profil.website')} />

              <div className="md:col-span-2">
                <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded">
                  {t('profil.updateButton')}
                </button>
              </div>
            </form>
          )}

          {activeSection === 'password' && (
            <form
              onSubmit={handleSubmit(onPasswordChange)}
              className="space-y-4 max-w-lg mx-auto bg-white bg-opacity-90 p-6 rounded shadow-lg"
            >
              <input id="current" {...register('currentPassword')} type="password" className="input" placeholder={t('profil.currentPassword')} />
              <input id="new" {...register('newPassword')} type="password" className="input" placeholder={t('profil.newPassword')} />
              <input id="confirm" {...register('confirmPassword')} type="password" className="input" placeholder={t('profil.confirmPassword')} />
              <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded w-full">
                {t('profil.changePasswordButton')}
              </button>
            </form>
          )}

          {activeSection === 'delete' && (
            <div className="text-center p-6 bg-white bg-opacity-90 rounded shadow-md max-w-xl mx-auto">
              <h3 className="text-lg font-semibold mb-4">{t('profil.confirmDeleteMessage')}</h3>
              <div className="flex justify-center gap-4">
                <button onClick={deleteAccount} className="bg-red-600 text-white px-4 py-2 rounded">
                  {t('profil.confirmDelete')}
                </button>
                <button onClick={cancelDelete} className="bg-gray-300 text-black px-4 py-2 rounded">
                  {t('profil.cancel')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
