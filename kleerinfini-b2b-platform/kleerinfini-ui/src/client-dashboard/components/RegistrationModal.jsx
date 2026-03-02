import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  FaUser, FaEnvelope, FaLock, FaBuilding,
  FaPhone, FaGlobe, FaLanguage, FaIndustry, FaLink
} from "react-icons/fa";
import toast from "react-hot-toast";
import registerBg from "../../assets/register_bg_1.png";
import "../../App.css";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

const schema = yup.object().shape({
  nom: yup.string().required("form.nomRequired"),
  prenom: yup.string().required("form.prenomRequired"),
  email: yup.string().email("form.invalidEmail").required("form.emailRequired"),
  password: yup.string().min(6).required("form.passwordRequired"),
  societe: yup.string().required("form.societeRequired"),
  telephone: yup.string().required("form.telephoneRequired"),
  pays: yup.string().required("form.paysRequired"),
  secteur: yup.string().required("form.secteurRequired"),
  langue: yup.string().required("form.langueRequired"),
  siteweb: yup.string().url("form.invalidURL").notRequired(),
});

export default function RegistrationModal() {
  const { t } = useTranslation();
  const { registerClient } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Création du compte...");
    try {
      // Adapt payload to what backend expects (usually snake_case)
      const payload = {
        role: 'client',
        first_name: data.prenom,
        last_name: data.nom,
        email: data.email,
        password: data.password,
        company_name: data.societe,
        phone: data.telephone,
        country: data.pays,
        sector: data.secteur,
        language: data.langue,
        website: data.siteweb
      };

      await registerClient(payload);
      toast.success(t("form.success"), { id: toastId });
      // Optional: Redirect to login or auto-login
      setTimeout(() => window.location.href = '/login', 2000);

    } catch (error) {
      console.error(error);
      toast.error(t("form.error") || "Erreur lors de l'inscription. Vérifiez vos données.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="registration-container">
      <img
        src={registerBg}
        alt="Registration Background"
        className="background-video fixed object-cover opacity-30"
      />

      <div className="form-wrapper">
        <h2 className="form-title">{t("form.registerTitle")}</h2>
        <p className="form-subtitle">
          {t("form.registerSubtitle")}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
          <Input icon={<FaUser />} label={t("form.nom")} name="nom" register={register} error={errors.nom} required />
          <Input icon={<FaUser />} label={t("form.prenom")} name="prenom" register={register} error={errors.prenom} required />
          <Input icon={<FaEnvelope />} label={t("form.email")} name="email" register={register} error={errors.email} type="email" required />
          <Input icon={<FaLock />} label={t("form.password")} name="password" register={register} error={errors.password} type="password" required />
          <Input icon={<FaPhone />} label={t("form.telephone")} name="telephone" register={register} error={errors.telephone} required />
          <Input icon={<FaBuilding />} label={t("form.societe")} name="societe" register={register} error={errors.societe} required />
          <Input icon={<FaGlobe />} label={t("form.pays")} name="pays" register={register} error={errors.pays} required />
          <Input icon={<FaIndustry />} label={t("form.secteur")} name="secteur" register={register} error={errors.secteur} required />

          <div className="form-group">
            <label className="form-label">
              <FaLanguage className="icon" /> {t("form.langue")} <span style={{ color: 'red' }}>*</span>
            </label>
            <select {...register("langue")} className="form-input">
              <option value="">-- {t("form.choose")} --</option>
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
            <p className="form-error">{t(errors.langue?.message)}</p>
          </div>

          <Input icon={<FaLink />} label={t("form.siteweb")} name="siteweb" register={register} error={errors.siteweb} />

          <button type="submit" className="submit-button">
            {t("form.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({ icon, label, name, register, error, type = "text", required = false }) {
  const { t } = useTranslation();
  return (
    <div className="form-group">
      <label className="form-label">
        {icon} {label} {required && <span style={{ color: 'red' }}>*</span>}
      </label>
      <input
        type={type}
        {...register(name)}
        className="form-input"
      />
      <p className="form-error">{t(error?.message)}</p>
    </div>
  );
}