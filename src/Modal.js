import React from 'react';
import './Modal.css'; // Link the updated CSS
import pokeImage from './imageSource';

const Modal = ({ isOpen, onClose, pokemon }) => {
  if (!isOpen || !pokemon) return null;

  // Function to close the modal when clicking outside the modal content
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        
        {pokemon && (
          <>
            <div className="modal-header">
              <h2>{pokemon.name}</h2>
              <span>ID: #{pokemon.id}</span>
            </div>

            <div className="modal-images">
              <img src={pokemon.sprites.front_default} alt={pokemon.name} />
              <img src={pokemon.sprites.back_default} alt={pokemon.name} />
              <img src={pokemon.sprites.front_shiny} alt={pokemon.name} />
              <img src={pokemon.sprites.back_shiny} alt={pokemon.name} />
            </div>

            <div className="modal-types">
              {pokemon.types.map((type, index) => (
                <span key={index}>
                  <img src={pokeImage.typeImages[type]} alt={type} />
                  {type}
                </span>
              ))}
            </div>

            <div className="modal-description">
              <h3>Pokedex Description</h3>
              <p>{pokemon.description}</p>
            </div>
            
            <div className="stats-container">
              <h3>Stats</h3>
              <ul className="stats-list">
                {pokemon.stats.map((stat, index) => (
                  <li key={index}>
                    {`${stat.name.charAt(0).toUpperCase() + stat.name.slice(1)}: ${stat.value}`}
                  </li>
                ))}
              </ul>
            </div>

          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
