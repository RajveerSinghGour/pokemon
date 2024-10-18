import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import SearchBar from './components/SearchBar';
import Modal from './components/Modal';
import './App.css';

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedHeight, setSelectedHeight] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPokemon = async () => {
    try {
      const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=151');
      const pokemonData = await Promise.all(
        response.data.results.map(async (poke) => {
          const pokeDetails = await axios.get(poke.url);
          return {
            name: pokeDetails.data.name,
            image: pokeDetails.data.sprites.front_default,
            types: pokeDetails.data.types.map((type) => type.type.name),
            height: pokeDetails.data.height,
            weight: pokeDetails.data.weight,
          };
        })
      );
      setPokemon(pokemonData);
      setFilteredPokemon(pokemonData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, []);

  useEffect(() => {
    let filtered = pokemon.filter((poke) =>
      poke.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poke.height.toString().includes(searchQuery) // Search by ID or height
    );

    if (selectedType) {
      filtered = filtered.filter((poke) => poke.types.includes(selectedType));
    }

    if (selectedHeight) {
      filtered = filtered.filter((poke) => {
        if (selectedHeight === 'short') return poke.height < 10; // 0 - 1 m
        if (selectedHeight === 'medium') return poke.height >= 10 && poke.height <= 20; // 1 - 2 m
        if (selectedHeight === 'tall') return poke.height > 20; // 2+ m
        return true;
      });
    }

    if (sortOrder === 'asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredPokemon(filtered);
  }, [searchQuery, selectedType, selectedHeight, sortOrder, pokemon]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedType('');
    setSelectedHeight('');
    setSortOrder('asc');
    setCurrentPage(1);
    setFilteredPokemon(pokemon);
  };

  const indexOfLastPokemon = currentPage * itemsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - itemsPerPage;
  const currentPokemon = filteredPokemon.slice(indexOfFirstPokemon, indexOfLastPokemon);

  return (
    <div className="container">
      <h1>Pokemon</h1>
      <SearchBar onSearch={handleSearch} searchQuery={searchQuery} />
      <div className="filters">
        <select onChange={(e) => setSelectedType(e.target.value)} value={selectedType}>
          <option value="">All Types</option>
          <option value="grass">Grass</option>
          <option value="fire">Fire</option>
          <option value="water">Water</option>
          <option value="bug">Bug</option>
          <option value="normal">Normal</option>
          <option value="electric">Electric</option>
          <option value="fairy">Fairy</option>
          <option value="fighting">Fighting</option>
          <option value="psychic">Psychic</option>
          <option value="rock">Rock</option>
          <option value="ghost">Ghost</option>
          <option value="dragon">Dragon</option>
          <option value="ice">Ice</option>
        </select>
        <select onChange={(e) => setSelectedHeight(e.target.value)} value={selectedHeight}>
          <option value="">All Heights</option>
          <option value="short">Short (0 - 1 m)</option>
          <option value="medium">Medium (1 - 2 m)</option>
          <option value="tall">Tall (2+ m)</option>
        </select>
        <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="asc">Sort A-Z</option>
          <option value="desc">Sort Z-A</option>
        </select>
      </div>
      <button className="button" onClick={handleReset}>Reset Search</button>
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <ul className="pokemon-list">
          {currentPokemon.map((poke, index) => (
            <li 
              key={index} 
              className="pokemon-card" 
              onClick={() => {
                setSelectedPokemon(poke);
                setIsModalOpen(true);
              }}
            >
              <img src={poke.image} alt={poke.name} />
              <div className="pokemon-name">{poke.name}</div>
              <div className="pokemon-types">{poke.types.join(', ')}</div>
            </li>
          ))}
        </ul>
      )}
      <div className="pagination">
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={indexOfLastPokemon >= filteredPokemon.length}>
          Next
        </button>
      </div>
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        pokemon={selectedPokemon} 
      />
    </div>
  );
}

export default App;
