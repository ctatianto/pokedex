import React, { useEffect, useState } from 'react';
import PokemonList from './pokemonList';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Pokémon 151</h1>
      </header>
      <PokemonList />
    </div>
  );
}

export default App;
