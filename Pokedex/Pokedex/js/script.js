const gallery = document.getElementById('character-gallery');
const loadingIndicator = document.getElementById('loading');
const noResultsMessage = document.getElementById('no-results');
const searchInput = document.getElementById('search-input');
const modal = document.getElementById('modal');
const modalCloseBtn = document.getElementById('modal-close');
const backToTopBtn = document.getElementById('back-to-top');
const loadMoreBtn = document.getElementById('load-more-btn');

const generationFilterContainer = document.getElementById('generation-filter-buttons');
const typeFilterContainer = document.getElementById('type-filter-buttons');

const carouselViewport = document.getElementById('carousel-viewport');
const carouselPrevBtn = document.getElementById('carousel-prev');
const carouselNextBtn = document.getElementById('carousel-next');

let allPokemonDetails = [];
let displayedPokemonCount = 0;
const POKEMON_PER_PAGE = 20;
let activeGeneration = 'all';
let activeType = 'all';

const generationRanges = {
    1: { start: 1, end: 151 },
    2: { start: 152, end: 251 },
    3: { start: 252, end: 386 }
};
const statTranslations = { 'hp': 'HP', 'attack': 'Ataque', 'defense': 'Defesa', 'special-attack': 'Ataque Esp.', 'special-defense': 'Defesa Esp.', 'speed': 'Velocidade' };
const typeTranslations = { 'normal': 'Normal', 'fire': 'Fogo', 'water': 'Água', 'grass': 'Planta', 'electric': 'Elétrico', 'ice': 'Gelo', 'fighting': 'Lutador', 'poison': 'Veneno', 'ground': 'Terra', 'flying': 'Voador', 'psychic': 'Psíquico', 'bug': 'Inseto', 'rock': 'Pedra', 'ghost': 'Fantasma', 'dragon': 'Dragão', 'dark': 'Sombrio', 'steel': 'Aço', 'fairy': 'Fada' };
const abilityTranslations = { 'overgrow': 'Crescimento', 'chlorophyll': 'Clorofila', 'blaze': 'Chama', 'solar-power': 'Poder Solar', 'torrent': 'Torrente', 'rain-dish': 'Prato de Chuva', 'shield-dust': 'Pó de Escudo', 'run-away': 'Fuga', 'static': 'Estática', 'lightning-rod': 'Para-raios', 'keen-eye': 'Olho Aguçado', 'tangled-feet': 'Pés Confusos', 'shed-skin': 'Troca de Pele', 'compound-eyes': 'Olhos Compostos', 'swarm': 'Enxame', 'intimidate': 'Intimidação', 'guts': 'Entranhas', 'stench': 'Fedor', 'drizzle': 'Chuvisco', 'speed-boost': 'Aumento de Velocidade' };
const typeIcons = { 'fire': `<svg viewBox="0 0 24 24"><path d="M13.1,3.42C13.1,3.42 15,2 17,2C19,2 21,4 21,6C21,8 18.5,10.55 18.5,10.55C18.5,10.55 21,11.5 21,13.5C21,15.5 19,17.5 17,17.5C15,17.5 13,15.5 13,15.5C13,15.5 13,17.5 11,17.5C9,17.5 7,15.5 7,13.5C7,11.5 10.5,6.5 10.5,6.5C10.5,6.5 8,11 8,13C8,15 6,16.5 4.5,16.5C3,16.5 2,15 2,13C2,11 4.5,5.5 4.5,5.5C4.5,5.5 3,9.5 3,11C3,12.5 2,13 2,13C2,13 3,5 7.5,3.5C12,2 13.1,3.42 13.1,3.42Z" /></svg>`, 'water': `<svg viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,19.5A7.5,7.5 0 0,1 4.5,12C4.5,12 8,2 12,2C16,2 19.5,12 19.5,12A7.5,7.5 0 0,1 12,19.5M12,6A1,1 0 0,0 11,7A1,1 0 0,0 12,8A1,1 0 0,0 13,7A1,1 0 0,0 12,6Z" /></svg>`, 'grass': `<svg viewBox="0 0 24 24"><path d="M12,2L17,7H15.5C17.5,7 19,8.5 19,10.5V12H17.5V10.5C17.5,9.6 16.6,8.7 15.7,8.5C15.9,8.8 16,9.1 16,9.5C16,11 14.5,12 13,12H12V14H14C14,14 15,14 15,15C15,16 14,16 14,16H12V17.5C13.1,17.5 14,18.4 14,19.5C14,20.6 13.1,21.5 12,21.5C10.9,21.5 10,20.6 10,19.5C10,18.3 11,17.5 11,17.5V16H9C9,16 8,16 8,15C8,14 9,14 9,14H11V12H9.5C8,12 6.5,11 6.5,9.5C6.5,8.4 7.2,7.5 8.3,7.2C8.1,7.8 8,8.5 8,9C8,10.7 9.3,12 11,12H12V8H11C9,8 7,6 7,4H5L12,2Z" /></svg>`, 'electric': `<svg viewBox="0 0 24 24"><path d="M11,4L6,13H10V20L15,11H11V4Z" /></svg>`, 'ice': `<svg viewBox="0 0 24 24"><path d="M12,2L8,6.5L12,11L16,6.5L12,2M12,13L8,17.5L12,22L16,17.5L12,13M2,12L6.5,16L11,12L6.5,8L2,12M13,12L17.5,16L22,12L17.5,8L13,12Z" /></svg>`, 'fighting': `<svg viewBox="0 0 24 24"><path d="M19,3L15,5L17,9L13,11L11,7L7,9L9,13L5,15L3,19H5L8,16L11,19L14,16H18L16,13L19,11L21,15H23V3H19Z" /></svg>`, 'poison': `<svg viewBox="0 0 24 24"><path d="M17,9H15V11H17V9M19,12C19,13.1 18.1,14 17,14C15.9,14 15,13.1 15,12C15,10.9 15.9,10 17,10C18.1,10 19,10.9 19,12M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M7,9H9V11H7V9M5,12C5,10.9 5.9,10 7,10C8.1,10 9,10.9 9,12C9,13.1 8.1,14 7,14C5.9,14 5,13.1 5,12M12,6C10.9,6 10,6.9 10,8C10,9.1 10.9,10 12,10C13.1,10 14,9.1 14,8C14,6.9 13.1,6 12,6Z" /></svg>`, 'ground': `<svg viewBox="0 0 24 24"><path d="M2,12H4V14H2V12M6,12H8V14H6V12M10,12H12V14H10V12M14,10H16V12H14V10M18,10H20V12H18V10M2,16H4V18H2V16M6,16H8V18H6V16M10,16H12V18H10V16M14,14H16V16H14V14M18,14H20V16H18V14M2,20H22V22H2V20Z" /></svg>`, 'flying': `<svg viewBox="0 0 24 24"><path d="M21,12A5,5 0 0,0 17,7.17V4H15V9H14A5,5 0 0,0 9,14H7V12A3,3 0 0,1 4,9A3,3 0 0,1 7,6V5A4,4 0 0,0 3,9A4,4 0 0,0 7,13V15H9A6,6 0 0,1 15,21H17V19A4,4 0 0,0 21,15A4,4 0 0,0 17,11V10.83A5,5 0 0,0 21,12Z" /></svg>`, 'psychic': `<svg viewBox="0 0 24 24"><path d="M12,10A2,2 0 0,0 10,12C10,13.11 10.9,14 12,14C13.11,14 14,13.11 14,12A2,2 0 0,0 12,10M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20Z" /></svg>`, 'bug': `<svg viewBox="0 0 24 24"><path d="M12,2L9,5V11H15V5L12,2M10,12V13A1,1 0 0,0 11,14H13A1,1 0 0,0 14,13V12H10M11,15V16H13V15H11M10,17V18H14V17H10M8,19V20H16V19H8M7,21V22H17V21H7Z" /></svg>`, 'rock': `<svg viewBox="0 0 24 24"><path d="M12,2L2,12L12,22L22,12L12,2Z" /></svg>`, 'ghost': `<svg viewBox="0 0 24 24"><path d="M12,2A9,9 0 0,0 3,11V22H21V11A9,9 0 0,0 12,2M9,13A1.5,1.5 0 0,1 7.5,14.5A1.5,1.5 0 0,1 6,13A1.5,1.5 0 0,1 7.5,11.5A1.5,1.5 0 0,1 9,13M15,13A1.5,1.5 0 0,1 13.5,14.5A1.5,1.5 0 0,1 12,13A1.5,1.5 0 0,1 13.5,11.5A1.5,1.5 0 0,1 15,13Z" /></svg>`, 'dragon': `<svg viewBox="0 0 24 24"><path d="M17.45,2.45L21.3,6.3L22.7,4.89L19.11,1.29L17.45,2.45M14,4L12,2L10,4L12,6L14,4M6.3,2.7L2.45,6.55L3.89,7.96L7.7,4.11L6.3,2.7M4,10L2,12L4,14L6,12L4,10M2.7,17.7L6.55,21.55L7.96,20.11L4.11,16.3L2.7,17.7M10,20L12,22L14,20L12,18L10,20M17.7,21.3L21.55,17.45L20.11,16.04L16.3,19.9L17.7,21.3M20,14L22,12L20,10L18,12L20,14Z" /></svg>`, 'dark': `<svg viewBox="0 0 24 24"><path d="M12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>`, 'steel': `<svg viewBox="0 0 24 24"><path d="M12,2L9,5V11H15V5L12,2M21,12L19,15L13,18V22H11V18L5,15L3,12L5,9L11,6V12H13V6L19,9L21,12Z" /></svg>`, 'fairy': `<svg viewBox="0 0 24 24"><path d="M12,2L9,5L12,8L15,5L12,2M12,9L9,12L12,15L15,12L12,9M2,12L5,9L8,12L5,15L2,12M16,12L19,9L22,12L19,15L16,12M12,16L9,19L12,22L15,19L12,16Z" /></svg>`, 'normal': `<svg viewBox="0 0 24 24"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>`, };

async function fetchAllPokemonDetails() {
    loadingIndicator.classList.add('show');
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=386');
        const data = await response.json();
        const detailPromises = data.results.map(p => fetch(p.url).then(res => res.json()));
        allPokemonDetails = await Promise.all(detailPromises);

        createTypeFilterButtons();
        setupCarousel();
        applyFilters();
    } catch (error) {
        console.error('Falha ao buscar dados da API:', error);
        loadingIndicator.innerHTML = '<p>Não foi possível carregar os Pokémon.</p>';
    } finally {
        loadingIndicator.classList.remove('show');
    }
}

async function fetchSpeciesDescription(pokemonId) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
        const data = await response.json();
        const ptEntries = data.flavor_text_entries.filter(entry => entry.language.name === 'pt');
        let flavorTextEntry = ptEntries.length > 0 ? ptEntries[ptEntries.length - 1] : data.flavor_text_entries.find(entry => entry.language.name === 'en');
        return flavorTextEntry ? flavorTextEntry.flavor_text.replace(/[\n\f]/g, ' ') : 'Nenhuma descrição disponível.';
    } catch (error) {
        console.error('Falha ao buscar descrição:', error);
        return 'Não foi possível carregar a descrição.';
    }
}

function createTypeFilterButtons() {
    typeFilterContainer.innerHTML = '';
    const allBtn = document.createElement('button');
    allBtn.className = 'filter-btn active';
    allBtn.dataset.type = 'all';
    allBtn.textContent = 'Todos';
    typeFilterContainer.appendChild(allBtn);

    for (const type in typeTranslations) {
        const btn = document.createElement('button');
        btn.className = 'filter-btn';
        btn.dataset.type = type;
        btn.innerHTML = `${typeIcons[type] || ''} <span>${typeTranslations[type]}</span>`;
        typeFilterContainer.appendChild(btn);
    }
}

function applyFilters() {
    searchInput.value = '';
    let filteredPokemon = allPokemonDetails;

    if (activeGeneration !== 'all') {
        const { start, end } = generationRanges[activeGeneration];
        filteredPokemon = filteredPokemon.filter(p => p.id >= start && p.id <= end);
    }

    if (activeType !== 'all') {
        filteredPokemon = filteredPokemon.filter(p => p.types.some(t => t.type.name === activeType));
    }

    gallery.innerHTML = '';
    noResultsMessage.classList.remove('show');

    if (activeGeneration === 'all' && activeType === 'all') {
        displayedPokemonCount = 0;
        displayMorePokemon();
    } else {
        loadMoreBtn.classList.remove('show');
        displayPokemon(filteredPokemon);
    }
}

function displayMorePokemon() {
    const newPokemonToShow = allPokemonDetails.slice(displayedPokemonCount, displayedPokemonCount + POKEMON_PER_PAGE);
    createPokemonCards(newPokemonToShow, true);
    displayedPokemonCount += POKEMON_PER_PAGE;
    loadMoreBtn.classList.toggle('show', displayedPokemonCount < allPokemonDetails.length && activeGeneration === 'all' && activeType === 'all');
}

function createPokemonCards(pokemons, append = false) {
    if (!append) gallery.innerHTML = '';
    pokemons.forEach(pokemon => {
        const card = document.createElement('div');
        card.className = 'character-card';
        const typesHtml = pokemon.types.map(typeInfo => {
            const typeName = typeTranslations[typeInfo.type.name] || typeInfo.type.name;
            const typeIcon = typeIcons[typeInfo.type.name] || '';
            return `<div class="type type-${typeInfo.type.name}">${typeIcon}<span>${typeName}</span></div>`;
        }).join('');
        card.innerHTML = `
            <div class="card-border-gradient"></div>
            <div class="card-image-container">
                <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" alt="Imagem de ${pokemon.name}">
                <div class="card-types">${typesHtml}</div>
            </div>
            <div class="card-body">
                <h2>${pokemon.name}</h2>
                <p>#${pokemon.id.toString().padStart(3, '0')}</p>
            </div>`;
        card.addEventListener('click', () => openModal(pokemon));
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
        gallery.appendChild(card);
    });
}

function displayPokemon(pokemonList) {
    gallery.innerHTML = '';
    noResultsMessage.classList.toggle('show', pokemonList.length === 0);
    createPokemonCards(pokemonList);
}

function setupCarousel() {
    const scrollAmount = carouselViewport.clientWidth / 1.5;
    carouselPrevBtn.addEventListener('click', () => carouselViewport.scrollBy(-scrollAmount, 0));
    carouselNextBtn.addEventListener('click', () => carouselViewport.scrollBy(scrollAmount, 0));
    carouselViewport.addEventListener('scroll', updateCarouselButtons);
    window.addEventListener('resize', updateCarouselButtons);
    updateCarouselButtons();
}

function updateCarouselButtons() {
    const { scrollLeft, scrollWidth, clientWidth } = carouselViewport;
    carouselPrevBtn.disabled = scrollLeft < 1;
    carouselNextBtn.disabled = Math.ceil(scrollLeft + clientWidth) >= scrollWidth;
}

async function openModal(pokemon) {
    document.getElementById('modal-name').textContent = pokemon.name;
    document.getElementById('modal-id').textContent = `#${pokemon.id.toString().padStart(3, '0')}`;
    document.getElementById('modal-image').src = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

    const descriptionEl = document.getElementById('modal-description');
    descriptionEl.textContent = 'Carregando descrição...';
    descriptionEl.textContent = await fetchSpeciesDescription(pokemon.id);

    document.getElementById('modal-types').innerHTML = pokemon.types.map(typeInfo => `<div class="type type-${typeInfo.type.name}">${typeIcons[typeInfo.type.name] || ''}<span>${typeTranslations[typeInfo.type.name]}</span></div>`).join('');
    document.getElementById('modal-physical-details').innerHTML = `<div class="info-item"><strong>Altura:</strong> ${pokemon.height / 10} m</div><div class="info-item"><strong>Peso:</strong> ${pokemon.weight / 10} kg</div>`;
    document.getElementById('modal-abilities').innerHTML = pokemon.abilities.map(a => `<div class="info-item">${abilityTranslations[a.ability.name] || a.ability.name}</div>`).join('');
    document.getElementById('modal-stats').innerHTML = pokemon.stats.map(s => `<div class="stat-item"><span>${statTranslations[s.stat.name]}</span><div class="stat-bar"><div class="stat-bar-inner" style="width: ${(s.base_stat / 255) * 100}%;"></div></div><strong>${s.base_stat}</strong></div>`).join('');

    modal.classList.add('show');
}

function closeModal() { modal.classList.remove('show'); }

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm === '') { applyFilters(); return; }
    const filteredPokemon = allPokemonDetails.filter(pokemon => pokemon.name.includes(searchTerm));
    loadMoreBtn.classList.remove('show');
    displayPokemon(filteredPokemon);
}

function handleGenerationFilter(event) {
    const clickedButton = event.target.closest('.filter-btn');
    if (!clickedButton) return;
    activeGeneration = clickedButton.dataset.gen;
    document.querySelectorAll('#generation-filter-buttons .filter-btn').forEach(btn => btn.classList.remove('active'));
    clickedButton.classList.add('active');
    activeType = 'all';
    document.querySelectorAll('#type-filter-buttons .filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('#type-filter-buttons .filter-btn[data-type="all"]').classList.add('active');
    carouselViewport.scrollTo({ left: 0, behavior: 'smooth' });
    applyFilters();
}

function handleTypeFilter(event) {
    const clickedButton = event.target.closest('.filter-btn');
    if (!clickedButton) return;
    activeType = clickedButton.dataset.type;
    document.querySelectorAll('#type-filter-buttons .filter-btn').forEach(btn => btn.classList.remove('active'));
    clickedButton.classList.add('active');
    applyFilters();
}

function handleScroll() {
    backToTopBtn.classList.toggle('show', window.scrollY > 300);
}

document.addEventListener('DOMContentLoaded', fetchAllPokemonDetails);
searchInput.addEventListener('input', handleSearch);
loadMoreBtn.addEventListener('click', displayMorePokemon);
generationFilterContainer.addEventListener('click', handleGenerationFilter);
typeFilterContainer.addEventListener('click', handleTypeFilter);
modalCloseBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
window.addEventListener('scroll', handleScroll);

