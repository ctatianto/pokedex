import React, { useEffect, useState } from 'react';
import axios from 'axios';
import pokeImage from './imageSource';
import Modal from './Modal';
import './pokemonList.css'
import loader from './assets/pokeball.gif'

const PokemonList = () => {
  const [pokemon, setPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('all'); // To track selected type for filtering
  const pokemonsPerPage = 12; // 3x3 grid
  const [fade, setFade] = useState(true);
  const [types, setTypes] = useState([]); // To store all types

  // Fetch Pokémon and their types
  useEffect(() => {
    const fetchPokemon = async () => {
      const promises = [];
      for (let i = 1; i <= 151; i++) {
        promises.push(axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`));
      }

      try {
        const responses = await Promise.all(promises);
        const pokemonData = responses.map(response => ({
          id: response.data.id,
          name: response.data.name,
          image: response.data.sprites.front_default,
          sprites: response.data.sprites,
          types: response.data.types.map(type => type.type.name),
          stats: response.data.stats.map(stat => ({
            name: stat.stat.name,
            value: stat.base_stat
          }))
        }));
        setPokemon(pokemonData);

        // Extract all types from the data
        const uniqueTypes = [
          ...new Set(pokemonData.flatMap(p => p.types))
        ];
        setTypes(uniqueTypes);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  // Fetch Pokedex Description when a Pokémon is clicked
  const handlePokemonClick = async (pokemon) => {
    try {
      const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`);
      const descriptionEntry = speciesResponse.data.flavor_text_entries.find(
        (entry) => entry.language.name === 'en'
      );
      const description = descriptionEntry ? descriptionEntry.flavor_text : 'No description available.';

      setSelectedPokemon({ ...pokemon, description });
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching Pokémon species data:", error);
    }
  };

  const indexOfLastPokemon = currentPage * pokemonsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;

  // Filter Pokémon based on selected type
  const filteredPokemon = selectedType === 'all'
    ? pokemon
    : pokemon.filter(p => p.types.includes(selectedType));

  const currentPokemons = filteredPokemon.slice(indexOfFirstPokemon, indexOfLastPokemon);

  const paginate = (pageNumber) => {
    setFade(false);
    setTimeout(() => {
      setCurrentPage(pageNumber);
      setFade(true);
    }, 200); // Adjust the timeout as needed for your animation speed
  };

  if (loading) return <div className='loader'>
      <img src={loader} alt="loading..." />
  </div>;

  return (
    <div>
      <h1>Welcome</h1>

      {/* Dropdown for filtering by type */}
      <div className="dropdown">
  <label htmlFor="type-filter">Filter by Type: </label>
  <select
    id="type-filter"
    value={selectedType}
    onChange={(e) => setSelectedType(e.target.value)}
  >
    <option value="all">All</option>
    {types.map((type) => (
      <option key={type} value={type}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </option>
    ))}
  </select>
</div>

<div className={`pokemon-list ${fade ? 'visible' : ''}`}>
  <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
    {currentPokemons.map((p) => (
      <li key={p.id} onClick={() => handlePokemonClick(p)} style={{ cursor: 'pointer' }}>
        <div style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '1.1em' }}>
          {`#${p.id}`}
        </div>
        <img src={p.image} alt={p.name} style={{ width: '100px', height: '100px' }} />
        <div>
          <span>{p.name.charAt(0).toUpperCase() + p.name.slice(1)}</span>
        </div>
        <div>
          {Array.from(new Set(p.types)).map(type => (
            <span key={type} style={{ marginRight: '5px', display: 'flex', alignItems: 'center' }}>
              <img 
                src={pokeImage.typeImages[type]} 
                alt={type} 
                style={{ width: '20px', height: '20px', marginRight: '4px', marginBottom: '4px' }} 
              />
              {type}
            </span>
          ))}
        </div>
      </li>
    ))}
  </ul>
</div>


      <Pagination
        totalPokemons={filteredPokemon.length} // Use the filtered Pokémon list length
        pokemonsPerPage={pokemonsPerPage}
        paginate={paginate}
        currentPage={currentPage}
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} pokemon={selectedPokemon} />
    </div>
  );
};

// Pagination component remains unchanged
const Pagination = ({ totalPokemons, pokemonsPerPage, paginate, currentPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPokemons / pokemonsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        <li className={currentPage === 1 ? 'disabled' : ''}>
          <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
        </li>
        {pageNumbers.map(number => (
          <li key={number} className={currentPage === number ? 'active' : ''}>
            <button onClick={() => paginate(number)}>{number}</button>
          </li>
        ))}
        <li className={currentPage === pageNumbers.length ? 'disabled' : ''}>
          <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === pageNumbers.length}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default PokemonList;
