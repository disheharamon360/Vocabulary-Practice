// GLOBAL VARIABLES
let vocabData = JSON.parse(localStorage.getItem('vocabData')) || [];
let flipState = 'bangla'; // flip all default

// DOM ELEMENTS
const singleModeBtn = document.getElementById('singleModeBtn');
const bulkModeBtn = document.getElementById('bulkModeBtn');
const singleInput = document.getElementById('singleInput');
const bulkInput = document.getElementById('bulkInput');
const addCardBtn = document.getElementById('addCardBtn');
const addBulkBtn = document.getElementById('addBulkBtn');
const cardsContainer = document.getElementById('cardsContainer');
const searchBar = document.getElementById('searchBar');
const sortOptions = document.getElementById('sortOptions');
const flipAllBtn = document.getElementById('flipAllBtn');
const englishInput = document.getElementById('englishWord');
const banglaInput = document.getElementById('banglaWord');
const exampleInput = document.getElementById('exampleSentence');

const exampleSidebar = document.getElementById('exampleSidebar');
const exampleContent = document.getElementById('exampleContent');
const closeSidebar = document.getElementById('closeSidebar');
const bulkTextarea = document.getElementById('bulkTextarea');

// SAVE TO LOCALSTORAGE
function saveData(){
  localStorage.setItem('vocabData', JSON.stringify(vocabData));
}

// MODE SWITCHING
singleModeBtn.addEventListener('click', () => {
  singleModeBtn.classList.add('active');
  bulkModeBtn.classList.remove('active');
  singleInput.style.display = 'flex';
  bulkInput.style.display = 'none';
});

bulkModeBtn.addEventListener('click', () => {
  bulkModeBtn.classList.add('active');
  singleModeBtn.classList.remove('active');
  singleInput.style.display = 'none';
  bulkInput.style.display = 'flex';
});

// ADD SINGLE CARD
addCardBtn.addEventListener('click', () => {
  const eng = englishInput.value.trim();
  const ban = banglaInput.value.trim();
  const ex = exampleInput.value.trim();
  if(!eng || !ban) return alert('English and Bangla words are required!');
  vocabData.unshift({english: eng, bangla: ban, example: ex});
  saveData();
  englishInput.value = '';
  banglaInput.value = '';
  exampleInput.value = '';
  renderCards();
});

// ADD BULK CARDS
addBulkBtn.addEventListener('click', () => {
  const bulkText = bulkTextarea.value.trim();
  if(!bulkText) return;
  const entries = bulkText.split(',');
  entries.forEach(item => {
    const parts = item.split('=');
    if(parts.length === 2){
      vocabData.unshift({english: parts[0].trim(), bangla: parts[1].trim(), example: ''});
    }
  });
  saveData();
  bulkTextarea.value = '';
  renderCards();
});

// RENDER CARDS
function renderCards(data = vocabData){
  cardsContainer.innerHTML = '';
  data.forEach((vocab, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">${flipState==='bangla'? vocab.english : vocab.bangla}</div>
        <div class="card-back">${flipState==='bangla'? vocab.bangla : vocab.english}</div>
      </div>
      <div class="card-menu">⋮
        <div class="card-options">
          <button class="editBtn">Edit</button>
          <button class="exampleBtn">Show Example</button>
          <button class="removeBtn">Remove</button>
        </div>
      </div>
    `;
    cardsContainer.appendChild(card);

    const menu = card.querySelector('.card-menu');
    const options = card.querySelector('.card-options');

    // MENU LOGIC
    menu.addEventListener('click', (e) => {
      e.stopPropagation();
      options.style.display = options.style.display==='block' ? 'none' : 'block';
    });

    // REMOVE CARD
    card.querySelector('.removeBtn').addEventListener('click', () => {
      vocabData.splice(index,1);
      saveData();
      renderCards();
    });

    // SHOW EXAMPLE
    card.querySelector('.exampleBtn').addEventListener('click', () => {
      exampleContent.textContent = vocab.example || 'No example provided.';
      exampleSidebar.classList.add('active');
    });

    // EDIT CARD
    card.querySelector('.editBtn').addEventListener('click', () => {
      const newEng = prompt('Edit English Word:', vocab.english);
      const newBan = prompt('Edit Bangla Word:', vocab.bangla);
      const newEx = prompt('Edit Example Sentence:', vocab.example);
      if(newEng && newBan){
        vocabData[index] = {english:newEng, bangla:newBan, example:newEx || ''};
        saveData();
        renderCards();
      }
    });
  });
}

// CLOSE SIDEBAR
closeSidebar.addEventListener('click', () => {
  exampleSidebar.classList.remove('active');
});

// SEARCH FUNCTIONALITY
searchBar.addEventListener('input', () => {
  const query = searchBar.value.toLowerCase();
  const filtered = vocabData.filter(v => v.english.toLowerCase().includes(query) || v.bangla.toLowerCase().includes(query));
  renderCards(filtered);
});

// SORT FUNCTIONALITY
sortOptions.addEventListener('change', () => {
  let sorted = [...vocabData];
  if(sortOptions.value==='newest') sorted = vocabData;
  else if(sortOptions.value==='oldest') sorted = [...vocabData].reverse();
  else if(sortOptions.value==='random') sorted.sort(()=> Math.random()-0.5);
  renderCards(sorted);
});

// FLIP ALL FUNCTIONALITY
flipAllBtn.addEventListener('click', () => {
  flipState = flipState==='bangla' ? 'english' : 'bangla';
  flipAllBtn.textContent = flipState==='bangla' ? 'Flip all to Bangla' : 'Flip all to English';
  renderCards();
});

// CLOSE MENU ON CLICK OUTSIDE
document.addEventListener('click', () => {
  document.querySelectorAll('.card-options').forEach(opt => opt.style.display='none');
});

// INITIAL RENDER
renderCards();
