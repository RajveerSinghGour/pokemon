import React from 'react';
import './Modal.css'; // Import your CSS for modal
import './Responsive.css';

const Modal = ({ isOpen, onClose, pokemon }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{pokemon.name}</h2>
        <img src={pokemon.image} alt={pokemon.name} />
        <p>Types: {pokemon.types.join(', ')}</p>
        <p>Height: {pokemon.height / 10} m</p> {/* Assuming height is in decimeters */}
        <p>Weight: {pokemon.weight / 10} kg</p> {/* Assuming weight is in hectograms */}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
