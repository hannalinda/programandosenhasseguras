// --- Seleção de Elementos do DOM ---
const passwordDisplay = document.getElementById('password-display');
const btnCopy = document.getElementById('btn-copy');
const btnGenerate = document.getElementById('btn-generate');
const lengthSlider = document.getElementById('length-slider');
const lengthVal = document.getElementById('length-val');

const includeUppercase = document.getElementById('include-uppercase');
const includeLowercase = document.getElementById('include-lowercase');
const includeNumbers = document.getElementById('include-numbers');
const includeSymbols = document.getElementById('include-symbols');

// --- Dicionários de Caracteres ---
const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// --- Funções Auxiliares ---

// Atualiza o valor do comprimento exibido na tela
function updateSliderValue(e) {
    lengthVal.textContent = e.target.value;
}

// Gera a senha baseada nas configurações escolhidas
function generatePassword() {
    let allowedChars = '';
    let password = '';

    // Combina os conjuntos de caracteres habilitados
    if (includeUppercase.checked) allowedChars += charSets.uppercase;
    if (includeLowercase.checked) allowedChars += charSets.lowercase;
    if (includeNumbers.checked) allowedChars += charSets.numbers;
    if (includeSymbols.checked) allowedChars += charSets.symbols;

    // Se nenhuma opção estiver marcada, avisa e para
    if (allowedChars === '') {
        passwordDisplay.value = '';
        passwordDisplay.placeholder = 'Escolha pelo menos uma opção!';
        return;
    }

    const passwordLength = parseInt(lengthSlider.value);

    // Gera a senha aleatória
    for (let i = 0; i < passwordLength; i++) {
        const randomIndex = Math.floor(Math.random() * allowedChars.length);
        password += allowedChars[randomIndex];
    }

    // Exibe a senha gerada
    passwordDisplay.value = password;
}

// Copia a senha para a área de transferência
async function copyToClipboard() {
    const password = passwordDisplay.value;

    if (!password || password === 'Escolha pelo menos uma opção!') return;

    try {
        await navigator.clipboard.writeText(password);
        
        // Feedback visual rápido no botão de copiar
        btnCopy.innerHTML = '<span class="icon">✅</span>';
        btnCopy.title = 'Copiado!';
        
        setTimeout(() => {
            btnCopy.innerHTML = '<span class="icon">📋</span>';
            btnCopy.title = 'Copiar senha';
        }, 1500);

    } catch (err) {
        console.error('Erro ao copiar a senha: ', err);
    }
}

// --- Ouvintes de Eventos (Event Listeners) ---
lengthSlider.addEventListener('input', updateSliderValue);
btnGenerate.addEventListener('click', generatePassword);
btnCopy.addEventListener('click', copyToClipboard);

// --- Inicialização ---

// Gera uma senha automaticamente ao carregar a página
window.addEventListener('DOMContentLoaded', generatePassword);