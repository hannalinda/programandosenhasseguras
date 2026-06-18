document.addEventListener('DOMContentLoaded', () => {
    // 1. Selecionar todos os elementos da tela
    const passwordDisplay = document.getElementById('password-display');
    const btnGenerate = document.getElementById('btn-generate');
    const btnCopy = document.getElementById('btn-copy');
    const lengthSlider = document.getElementById('length-slider');
    const lengthVal = document.getElementById('length-val');
    
    const uppercaseCheck = document.getElementById('include-uppercase');
    const lowercaseCheck = document.getElementById('include-lowercase');
    const numbersCheck = document.getElementById('include-numbers');
    const symbolsCheck = document.getElementById('include-symbols');

    // 2. Bancos de caracteres permitidos
    const caracteres = {
        maiusculas: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        minusculas: 'abcdefghijklmnopqrstuvwxyz',
        numeros: '0123456789',
        simbolos: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    // 3. Atualizar o número do comprimento na tela quando arrastar o slider
    lengthSlider.addEventListener('input', (e) => {
        lengthVal.textContent = e.target.value;
    });

    // 4. FUNÇÃO QUE GERA A SENHA SEGURA DE VERDADE
    function gerarSenhaSegura() {
        let caracteresPermitidos = '';

        // Verifica o que o usuário marcou para incluir na senha
        if (uppercaseCheck.checked) caracteresPermitidos += caracteres.maiusculas;
        if (lowercaseCheck.checked) caracteresPermitidos += caracteres.minusculas;
        if (numbersCheck.checked) caracteresPermitidos += caracteres.numeros;
        if (symbolsCheck.checked) caracteresPermitidos += caracteres.simbolos;

        // Pega o tamanho atual do slider
        const tamanhoSenha = parseInt(lengthSlider.value);

        // Se o usuário desmarcar todas as caixas, avisa ele
        if (caracteresPermitidos.length === 0) {
            passwordDisplay.value = '';
            passwordDisplay.placeholder = 'Marque pelo menos uma opção!';
            return;
        }

        let senhaGerada = '';
        
        // Usando Criptografia Avançada (Crypto API) para máxima segurança
        const valoresAleatorios = new Uint32Array(tamanhoSenha);
        window.crypto.getRandomValues(valoresAleatorios);

        for (let i = 0; i < tamanhoSenha; i++) {
            // Escolhe um caractere de forma totalmente imprevisível e segura
            const indiceAleatorio = valoresAleatorios[i] % caracteresPermitidos.length;
            senhaGerada += caracteresPermitidos[indiceAleatorio];
        }

        // Coloca a senha gerada dentro do campo de texto
        passwordDisplay.value = senhaGerada;
    }

    // 5. FUNÇÃO PARA COPIAR A SENHA
    btnCopy.addEventListener('click', () => {
        const senha = passwordDisplay.value;
        
        if (!senha || senha === 'Marque pelo menos uma opção!') return;

        // Copia para a área de transferência do computador/celular
        navigator.clipboard.writeText(senha).then(() => {
            // Muda o ícone temporariamente para dar um feedback visual de sucesso
            const iconeOriginal = btnCopy.textContent;
            btnCopy.textContent = '✅';
            
            setTimeout(() => {
                btnCopy.textContent = iconeOriginal;
            }, 1500);
        }).catch(err => {
            console.error('Erro ao copiar a senha: ', err);
        });
    });

    // 6. Ativar o botão de gerar quando for clicado
    btnGenerate.addEventListener('click', gerarSenhaSegura);

    // 7. Gera uma senha automaticamente assim que você abre o site
    gerarSenhaSegura();
});