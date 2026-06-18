document.addEventListener('DOMContentLoaded', () => {
    const passwordDisplay = document.getElementById('password-display');
    const btnGenerate = document.getElementById('btn-generate');
    const btnCopy = document.getElementById('btn-copy');
    const btnToggle = document.getElementById('btn-toggle');
    const lengthSlider = document.getElementById('length-slider');
    const lengthVal = document.getElementById('length-val');
    const strengthText = document.getElementById('strength-text');
    const bars = document.querySelectorAll('.strength-meter .bar');
    const historyList = document.getElementById('history-list');
    const toast = document.getElementById('toast-notification');

    const uCheck = document.getElementById('include-uppercase');
    const lCheck = document.getElementById('include-lowercase');
    const nCheck = document.getElementById('include-numbers');
    const sCheck = document.getElementById('include-symbols');

    const dictionary = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    let history = [];

    // Muda visualizador numérico
    lengthSlider.addEventListener('input', (e) => {
        lengthVal.textContent = e.target.value;
        generateSecurePassword();
    });

    // Criptografia Segura Nativa (Web Crypto API)
    function secureRandomIndex(max) {
        const randomBuffer = new Uint32Array(1);
        window.crypto.getRandomValues(randomBuffer);
        return randomBuffer[0] % max;
    }

    function generateSecurePassword() {
        let characterPool = '';
        if (uCheck.checked) characterPool += dictionary.uppercase;
        if (lCheck.checked) characterPool += dictionary.lowercase;
        if (nCheck.checked) characterPool += dictionary.numbers;
        if (sCheck.checked) characterPool += dictionary.symbols;

        const size = parseInt(lengthSlider.value);

        if (characterPool.length === 0) {
            passwordDisplay.value = '';
            passwordDisplay.placeholder = 'Selecione uma opção!';
            updateBars(0);
            return;
        }

        let generated = '';
        for (let i = 0; i < size; i++) {
            generated += characterPool[secureRandomIndex(characterPool.length)];
        }

        passwordDisplay.value = generated;
        calculateEntropy(generated, size);
    }

    // Avaliador de Segurança
    function calculateEntropy(pass, len) {
        let score = 0;
        if (len >= 12) score++;
        if (len >= 18) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[a-z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;

        if (len < 10 || score <= 2) {
            updateBars(1, 'Segurança Crítica', 'var(--status-critical)');
        } else if (score <= 4) {
            updateBars(2, 'Segurança Moderada', 'var(--status-warn)');
        } else if (score <= 5) {
            updateBars(3, 'Segurança Avançada', 'var(--status-good)');
        } else {
            updateBars(4, 'Nível Militar (Inquebrável)', 'var(--status-god)');
        }
    }

    function updateBars(level, message = 'Nula', color = '#222') {
        strengthText.textContent = `Força: ${message}`;
        strengthText.style.color = level === 0 ? 'var(--text-slate)' : color;

        bars.forEach((bar, idx) => {
            if (idx < level) {
                bar.style.background = color;
                bar.style.boxShadow = `0 0 8px ${color}`;
            } else {
                bar.style.background = 'rgba(255, 255, 255, 0.05)';
                bar.style.boxShadow = 'none';
            }
        });
    }

    // Copiar e disparar Toast
    function copyValue() {
        if (!passwordDisplay.value) return;
        navigator.clipboard.writeText(passwordDisplay.value).then(() => {
            triggerToast();
            addHistory(passwordDisplay.value);
        });
    }

    function triggerToast() {
        toast.classList.add('active');
        setTimeout(() => toast.classList.remove('active'), 2000);
    }

    // Gerenciador de Histórico Local da Sessão
    function addHistory(pass) {
        if (history.includes(pass)) return;
        history.unshift(pass);
        if (history.length > 3) history.pop(); // Mantém apenas os 3 últimos
        renderHistory();
    }

    function renderHistory() {
        historyList.innerHTML = '';
        history.forEach(pass => {
            const li = document.createElement('li');
            // Esconde partes da senha no painel de histórico por segurança visual
            li.textContent = pass.substring(0, 4) + '••••••••' + pass.substring(pass.length - 2);
            li.addEventListener('click', () => {
                navigator.clipboard.writeText(pass);
                triggerToast();
            });
            historyList.appendChild(li);
        });
    }

    // Revelar / Ocultar Senha (Olho)
    btnToggle.addEventListener('click', () => {
        if (passwordDisplay.type === 'password') {
            passwordDisplay.type = 'text';
            btnToggle.textContent = '🙈';
        } else {
            passwordDisplay.type = 'password';
            btnToggle.textContent = '👁️';
        }
    });

    // Eventos ativos
    [uCheck, lCheck, nCheck, sCheck].forEach(c => c.addEventListener('change', generateSecurePassword));
    btnGenerate.addEventListener('click', generateSecurePassword);
    btnCopy.addEventListener('click', copyValue);

    // Bootstrap
    generateSecurePassword();
});