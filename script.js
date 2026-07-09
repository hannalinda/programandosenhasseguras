// Seleção dos elementos do DOM
const passwordDisplay = document.getElementById('password-display');
const btnCopy = document.getElementById('btn-copy');
const btnGenerate = document.getElementById('btn-generate');

const lengthSlider = document.getElementById('length-slider');
const lengthVal = document.getElementById('length-val');

const includeUppercase = document.getElementById('include-uppercase');
const includeLowercase = document.getElementById('include-lowercase');
const includeNumbers = document.getElementById('include-numbers');
const includeSymbols = document.getElementById('include-symbols');

// Dicionários de caracteres
const charSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// Atualiza o número do comprimento na tela ao arrastar o slider
lengthSlider.addEventListener('input', (e) => {
    lengthVal.textContent = e.target.value;
});

// Função principal para gerar a senha
function generatePassword() {
    let allowedChars = '';
    let password = '';

    // Verifica quais opções estão marcadas e adiciona ao pool de caracteres
    if (includeUppercase.checked) allowedChars += charSets.uppercase;
    if (includeLowercase.checked) allowedChars += charSets.lowercase;
    if (includeNumbers.checked) allowedChars += charSets.numbers;
    if (includeSymbols.checked) allowedChars += charSets.symbols;

    // Se nenhuma opção estiver marcada, avisa o usuário e limpa o campo
    if (allowedChars === '') {
        passwordDisplay.value = '';
        passwordDisplay.placeholder = 'Selecione pelo menos uma opção!';
        return;
    }

    const passwordLength = parseInt(lengthSlider.value);

    // Cria a senha escolhendo caracteres aleatórios do pool
    for (let i = 0; i < passwordLength; i++) {
        const randomIndex = Math.floor(Math.random() * allowedChars.length);
        password += allowedChars[randomIndex];
    }

    // Exibe a senha gerada
    passwordDisplay.value = password;
}

// Função para copiar a senha para a área de transferência
async function copyToClipboard() {
    const password = passwordDisplay.value;

    if (!password || password === 'Selecione pelo menos uma opção!') return;

    try {
        await navigator.clipboard.writeText(password);
        
        // Feedback visual rápido no botão de copiar
        const originalIcon = btnCopy.textContent;
        btnCopy.textContent = '✅';
        btnCopy.title = 'Copiado!';
        
        setTimeout(() => {
            btnCopy.textContent = originalIcon;
            btnCopy.title = 'Copiar senha';
        }, 1500);

    } catch (err) {
        console.error('Erro ao copiar a senha: ', err);
    }
}

// Eventos dos botões
btnGenerate.addEventListener('click', generatePassword);
btnCopy.addEventListener('click', copyToClipboard);

// Gera uma senha automaticamente assim que a página carrega
window.addEventListener('DOMContentLoaded', generatePassword);