document.addEventListener('DOMContentLoaded', () => {
    // 1. Seleção dos elementos do DOM
    const passwordDisplay = document.getElementById('password-display');
    const btnGenerate = document.getElementById('btn-generate');
    const btnCopy = document.getElementById('btn-copy');
    const lengthSlider = document.getElementById('length-slider');
    const lengthVal = document.getElementById('length-val');
    
    const uppercaseCheck = document.getElementById('include-uppercase');
    const lowercaseCheck = document.getElementById('include-lowercase');
    const numbersCheck = document.getElementById('include-numbers');
    const symbolsCheck = document.getElementById('include-symbols');

    // 2. Dicionário de caracteres permitidos
    const caracteres = {
        maiusculas: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        minusculas: 'abcdefghijklmnopqrstuvwxyz',
        numeros: '0123456789',
        simbolos: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    // 3. Atualiza o contador visual do comprimento da senha
    lengthSlider.addEventListener('input', (e) => {
        lengthVal.textContent = e.target.value;
    });

    // 4. Função principal para geração da senha segura
    function gerarSenhaSegura() {
        let poolCaracteres = '';

        // Monta o banco de caracteres com base nas checkboxes marcadas
        if (uppercaseCheck.checked) poolCaracteres += caracteres.maiusculas;
        if (lowercaseCheck.checked) poolCaracteres += caracteres.minusculas;
        if (numbersCheck.checked) poolCaracteres += caracteres.numeros;
        if (symbolsCheck.checked) poolCaracteres += caracteres.simbolos;

        // Se nenhuma opção estiver marcada, exibe um aviso
        if (poolCaracteres.length === 0) {
            passwordDisplay.value = '';
            passwordDisplay.placeholder = 'Marque ao menos uma opção!';
            return;
        }

        const tamanhoSenha = parseInt(lengthSlider.value, 10);
        let senhaGerada = '';
        
        // Uso de criptografia segura (Crypto API) em vez de Math.random()
        const valoresAleatorios = new Uint32Array(tamanhoSenha);
        window.crypto.getRandomValues(valoresAleatorios);

        for (let i = 0; i < tamanhoSenha; i++) {
            const indiceAleatorio = valoresAleatorios[i] % poolCaracteres.length;
            senhaGerada += poolCaracteres[indiceAleatorio];
        }

        // Atualiza o input com a nova senha
        passwordDisplay.value = Math.random() > 0.5 ? verificarGarantias(senhaGerada) : senhaGerada;
        passwordDisplay.value = senhaGerada;
    }

    // 5. Função para copiar a senha para a área de transferência
    btnCopy.addEventListener('click', () => {
        const senha = passwordDisplay.value;
        
        if (!senha || senha === 'Marque ao menos uma opção!') return;

        navigator.clipboard.writeText(senha)
            .then(() => {
                const iconeOriginal = btnCopy.textContent;
                btnCopy.textContent = '✅';
                btnCopy.style.pointerEvents = 'none'; // Evita cliques duplos durante o feedback
                
                setTimeout(() => {
                    btnCopy.textContent = iconeOriginal;
                    btnCopy.style.pointerEvents = 'auto';
                }, 1500);
            })
            .catch(err => {
                console.error('Erro ao copiar a senha: ', err);
                alert('Não foi possível copiar a senha automaticamente.');
            });
    });

    // 6. Vincula os eventos de clique e mudanças de estado
    btnGenerate.addEventListener('click', gerarSenhaSegura);

    // Gera uma senha automaticamente ao carregar a página
    gerarSenhaSegura();
});