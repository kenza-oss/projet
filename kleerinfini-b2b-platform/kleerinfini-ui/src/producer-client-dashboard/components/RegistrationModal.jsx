import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  FaUser, FaEnvelope, FaLock, FaBuilding,
  FaPhone, FaGlobe, FaLanguage, FaIndustry, FaLink
} from "react-icons/fa";
import backgroundVideo from "../../assets/video2.mp4";
import "../../App.css";
 // Import du fichier CSS personnalisé

const schema = yup.object().shape({
  nom: yup.string().required("Nom requis"),
  prenom: yup.string().required("Prénom requis"),
  email: yup.string().email("Email invalide").required("Email requis"),
  password: yup.string().min(6).required("Mot de passe requis"),
  societe: yup.string().required("Société requise"),
  telephone: yup.string().required("Téléphone requis"),
  pays: yup.string().required("Pays requis"),
  secteur: yup.string().required("Secteur d’activité requis"),
  langue: yup.string().required("Langue requise"),
  siteweb: yup.string().url("URL invalide").notRequired(),
});

export default function RegistrationModal() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log("✅ Données envoyées :", data);
    alert("Inscription réussie !");
  };

  return (
    <div className="registration-container">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="background-video fixed"
      >
        <source src={backgroundVideo} type="video/mp4" />
        Votre navigateur ne supporte pas la vidéo.
      </video>

      <div className="form-wrapper">
        <h2 className="form-title">Inscrivez-vous</h2>
        <p className="form-subtitle">
          Pour accéder à des fiches produits détaillées, des prix négociés et un accompagnement export personnalisé.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="registration-form">
          <Input icon={<FaUser />} label="Nom" name="nom" register={register} error={errors.nom} />
          <Input icon={<FaUser />} label="Prénom" name="prenom" register={register} error={errors.prenom} />
          <Input icon={<FaEnvelope />} label="Email" name="email" register={register} error={errors.email} type="email" />
          <Input icon={<FaLock />} label="Mot de passe" name="password" register={register} error={errors.password} type="password" />
          <Input icon={<FaPhone />} label="Téléphone" name="telephone" register={register} error={errors.telephone} />
          <Input icon={<FaBuilding />} label="Société" name="societe" register={register} error={errors.societe} />
          <Input icon={<FaGlobe />} label="Pays" name="pays" register={register} error={errors.pays} />
          <Input icon={<FaIndustry />} label="Secteur d’activité" name="secteur" register={register} error={errors.secteur} />

          <div className="form-group">
            <label className="form-label">
              <FaLanguage className="icon" /> Langue préférée
            </label>
            <select {...register("langue")} className="form-input">
              <option value="">-- Choisir --</option>
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
            <p className="form-error">{errors.langue?.message}</p>
          </div>

          <Input icon={<FaLink />} label="Site web (optionnel)" name="siteweb" register={register} error={errors.siteweb} />

          <button type="submit" className="submit-button">
            S’inscrire
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({ icon, label, name, register, error, type = "text" }) {
  return (
    <div className="form-group">
      <label className="form-label">
        {icon} {label}
      </label>
      <input
        type={type}
        {...register(name)}
        className="form-input"
      />
      <p className="form-error">{error?.message}</p>
    </div>
  );
}
