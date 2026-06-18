const passwordDisplay = document.getElementById('password-display');
const btnToggleVisibility = document.getElementById('btn-toggle-visibility');
const btnCopy = document.getElementById('btn-copy');
const btnGenerate = document.getElementById('btn-generate');

const lengthSlider = document.getElementById('length-slider');
const lengthVal = document.getElementById('length-val');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const toast = document.getElementById('toast');

const checkboxes = document.querySelectorAll('.options-grid input');

const chars = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// Gera números aleatórios criptograficamente seguros de verdade
function getRandomSecureIndex(max) {
    const randomBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(randomBuffer);
    return randomBuffer[0] % max;
}

function generatePassword() {
    let allowedChars = '';
    
    if (document.getElementById('include-uppercase').checked) allowedChars += chars.uppercase;
    if (document.getElementById('include-lowercase').checked) allowedChars += chars.lowercase;
    if (document.getElementById('include-numbers').checked) allowedChars += chars.numbers;
    if (document.getElementById('include-symbols').checked) allowedChars += chars.symbols;

    const passwordLength = parseInt(lengthSlider.value);

    if (allowedChars.length === 0) {
        passwordDisplay.value = '';
        passwordDisplay.placeholder = "Escolha uma opção!";
        updateStrength(0);
        return;
    }

    let password = '';
    for (let i = 0; i < passwordLength; i++) {
        const index = getRandomSecureIndex(allowedChars.length);
        password += allowedChars[index];
    }

    passwordDisplay.value = password;
    evaluateStrength(password, passwordLength);
}

// Medidor de complexidade inteligente
function evaluateStrength(password, length) {
    let score = 0;
    
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    // Mapeamento de score para força
    if (length < 10 || score <= 2) {
        updateStrength(1, 'Fraca', 'fraca');
    } else if (score <= 4) {
        updateStrength(2, 'Média', 'media');
    } else {
        updateStrength(3, 'Forte', 'forte');
    }
}

function updateStrength(level, label = '-', className = '') {
    strengthBar.className = 'strength-bar ' + className;
    if (level === 0) {
        strengthText.textContent = 'Força: -';
    } else {
        strengthText.textContent = `Força: ${label}`;
    }
}

// Copiar com API de Clipboard e animação de Toast
function copyToClipboard() {
    const password = passwordDisplay.value;
    if (!password) return;

    navigator.clipboard.writeText(password).then(() => {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    });
}

// Alternar entre ver a senha e ocultar (bolinhas)
btnToggleVisibility.addEventListener('click', () => {
    if (passwordDisplay.type === 'password') {
        passwordDisplay.type = 'text';
        btnToggleVisibility.textContent = '🙈';
    } else {
        passwordDisplay.type = 'password';
        btnToggleVisibility.textContent = '👁️';
    }
});

// Eventos em tempo real (Reatividade)
lengthSlider.addEventListener('input', (e) => {
    lengthVal.textContent = e.target.value;
    generatePassword();
});

checkboxes.forEach(cb => cb.addEventListener('change', generatePassword));
btnGenerate.addEventListener('click', generatePassword);
btnCopy.addEventListener('click', copyToClipboard);

// Inicialização automática
window.addEventListener('DOMContentLoaded', generatePassword);