// Variáveis globais
let currentClient = null;
let html5QrcodeScanner = null;
let currentScreen = 'initialScreen';

// Elementos da interface
const elements = {
    clientArea: document.getElementById('clientArea'),
    adminArea: document.getElementById('adminArea'),
    initialScreen: document.getElementById('initialScreen'),
    registerScreen: document.getElementById('registerScreen'),
    mainScreen: document.getElementById('mainScreen'),
    adminLoginScreen: document.getElementById('adminLoginScreen'),
    adminMenuScreen: document.getElementById('adminMenuScreen'),
    generateQRScreen: document.getElementById('generateQRScreen'),
    checkPointsScreen: document.getElementById('checkPointsScreen'),
    settingsScreen: document.getElementById('settingsScreen'),
    qrCodeContainer: document.getElementById('qrCodeContainer')
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Configurar tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Ativar tab clicada e desativar outras
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar área correspondente
            if (tabName === 'client') {
                elements.clientArea.classList.remove('hidden');
                elements.adminArea.classList.add('hidden');
                showScreen('initialScreen');
            } else {
                elements.clientArea.classList.add('hidden');
                elements.adminArea.classList.remove('hidden');
                showScreen('adminLoginScreen');
            }
        });
    });
    
    // Formulários do cliente
    document.getElementById('cpfForm').addEventListener('submit', checkCPF);
    document.getElementById('registerForm').addEventListener('submit', registerClient);
    
    // Formulários do admin
    document.getElementById('adminLoginForm').addEventListener('submit', adminLogin);
    document.getElementById('qrForm').addEventListener('submit', generateQRCode);
    document.getElementById('premiumsForm').addEventListener('submit', savePremiums);
    
    // Botões de navegação
    document.getElementById('generateQRBtn').addEventListener('click', () => showScreen('generateQRScreen'));
    document.getElementById('checkPointsBtn').addEventListener('click', () => showScreen('checkPointsScreen'));
    document.getElementById('settingsBtn').addEventListener('click', () => showScreen('settingsScreen'));
    document.getElementById('adminLogoutBtn').addEventListener('click', adminLogout);
    
    // Botões de voltar
    document.getElementById('backToMenuBtn').addEventListener('click', () => showScreen('adminMenuScreen'));
    document.getElementById('backToMenuBtn2').addEventListener('click', () => showScreen('adminMenuScreen'));
    document.getElementById('backToMenuBtn3').addEventListener('click', () => showScreen('adminMenuScreen'));
    
    // Botão de escanear QR Code
    document.getElementById('scanQRBtn').addEventListener('click', openQRScanner);
});

// Funções de navegação
function showScreen(screenName) {
    // Oculta todas as telas
    Object.keys(elements).forEach(key => {
        if (key.includes('Screen')) {
            elements[key].classList.add('hidden');
        }
    });
    
    // Mostra a tela solicitada
    elements[screenName].classList.remove('hidden');
    currentScreen = screenName;
}

// Funções do cliente
function checkCPF(e) {
    e.preventDefault();
    const cpf = document.getElementById('cpf').value;
    
    // Simulação de verificação de CPF
    if (cpf === '12345678900') {
        // CPF existe, mostrar tela principal
        currentClient = {
            name: 'João Silva',
            cpf: cpf,
            points: 7,
            visits: 7
        };
        updateClientUI();
        showScreen('mainScreen');
    } else {
        // CPF não existe, mostrar tela de cadastro
        document.getElementById('clientCpf').value = cpf;
        showScreen('registerScreen');
    }
}

function registerClient(e) {
    e.preventDefault();
    const name = document.getElementById('clientName').value;
    const cpf = document.getElementById('clientCpf').value;
    
    // Simulação de cadastro
    currentClient = {
        name: name,
        cpf: cpf,
        points: 0,
        visits: 0
    };
    
    updateClientUI();
    showScreen('mainScreen');
}

function updateClientUI() {
    if (!currentClient) return;
    
    document.getElementById('welcomeMessage').textContent = `Olá, ${currentClient.name}!`;
    document.getElementById('pointsCount').textContent = currentClient.points;
    document.getElementById('visitsCount').textContent = currentClient.visits;
}

function openQRScanner() {
    const modal = new bootstrap.Modal(document.getElementById('qrScannerModal'));
    modal.show();
    
    // Inicializar o scanner de QR Code
    if (!html5QrcodeScanner) {
        html5QrcodeScanner = new Html5Qrcode("reader");
    }
    
    html5QrcodeScanner.start(
        { facingMode: "environment" },
        {
            fps: 10,
            qrbox: { width: 250, height: 250 }
        },
        (decodedText, decodedResult) => {
            // QR Code lido com sucesso
            console.log(`QR Code lido: ${decodedText}`);
            html5QrcodeScanner.stop();
            modal.hide();
            
            // Simulação de resgate de pontos
            alert(`QR Code lido com sucesso! Pontos adicionados.`);
            currentClient.points++;
            currentClient.visits++;
            updateClientUI();
            
            // Adicionar ao histórico
            const today = new Date();
            const dateStr = `${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`;
            const orderNum = `#${Math.floor(100 + Math.random() * 900)}`;
            
            const historyItem = document.createElement('div');
            historyItem.className = 'visit-item';
            historyItem.innerHTML = `<strong>${dateStr}</strong> | Pedido ${orderNum}`;
            
            document.getElementById('historyList').prepend(historyItem);
        },
        (errorMessage) => {
            // Erro ignorado para não poluir o console
        }
    ).catch(err => {
        console.error("Erro ao iniciar scanner:", err);
    });
    
    // Parar o scanner quando o modal for fechado
    document.getElementById('qrScannerModal').addEventListener('hidden.bs.modal', function() {
        if (html5QrcodeScanner && html5QrcodeScanner.isScanning) {
            html5QrcodeScanner.stop();
        }
    });
}

// Funções do admin
function adminLogin(e) {
    e.preventDefault();
    const user = document.getElementById('adminUser').value;
    const password = document.getElementById('adminPassword').value;
    
    // Simulação de login
    if (user === 'admin' && password === 'admin') {
        showScreen('adminMenuScreen');
    } else {
        alert('Usuário ou senha inválidos!');
    }
}

function adminLogout() {
    showScreen('adminLoginScreen');
}

function generateQRCode(e) {
    e.preventDefault();
    const orderNumber = document.getElementById('orderNumber').value;
    const orderValue = document.getElementById('orderValue').value;
    
    // Gerar QR Code
    elements.qrCodeContainer.classList.remove('hidden');
    document.getElementById('qrcode').innerHTML = '';
    
    // Simulação de dados do QR Code (em uma aplicação real, viria do backend)
    const qrData = `DECKBAR-${orderNumber}-${orderValue}-${Date.now()}`;
    
    new QRCode(document.getElementById('qrcode'), {
        text: qrData,
        width: 200,
        height: 200
    });
    
    // Simular expiração após 30 segundos
    setTimeout(() => {
        elements.qrCodeContainer.classList.add('hidden');
        alert('QR Code expirado. Gere um novo código.');
    }, 30000);
}

function savePremiums(e) {
    e.preventDefault();
    // Simulação de salvamento
    alert('Configurações de prêmios salvas com sucesso!');
}
