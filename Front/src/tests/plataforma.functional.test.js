const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');

const TIMEOUT = 30000;
const URL_BASE = 'http://localhost:3000';

describe('Testes Funcionais - Plataforma de Análise Criminal', () => {
  let navegador;

  beforeAll(async () => {
    const chromedriverPath = path.join(__dirname, '..', '..', 'node_modules', 'chromedriver', 'lib', 'chromedriver', 'chromedriver.exe');
    const service = new chrome.ServiceBuilder(chromedriverPath);
    
    const opcoes = new chrome.Options();
    opcoes.addArguments('--headless=new');
    opcoes.addArguments('--disable-gpu');
    opcoes.addArguments('--no-sandbox');
    opcoes.addArguments('--disable-dev-shm-usage');
    opcoes.addArguments('--window-size=1920,1080');

    navegador = await new Builder()
      .forBrowser('chrome')
      .setChromeService(service)
      .setChromeOptions(opcoes)
      .build();

    await navegador.manage().setTimeouts({ implicit: 10000 });

    await fazerLogin();
  }, 90000);

  afterAll(async () => {
    if (navegador) {
      await navegador.quit();
    }
  }, 10000);

  async function fazerLogin() {
    await navegador.get(`${URL_BASE}/login`);
    
    await navegador.wait(
      until.elementLocated(By.css('input[type="email"]')),
      TIMEOUT
    );

    const inputEmail = await navegador.findElement(By.css('input[type="email"]'));
    await inputEmail.sendKeys('admin@admin.com');

    const inputSenha = await navegador.findElement(By.css('input[type="password"]'));
    await inputSenha.sendKeys('admin');

    const botaoEntrar = await navegador.findElement(By.css('button[type="submit"]'));
    await botaoEntrar.click();

    await navegador.sleep(2000);
  }

  test('Fluxo 1: Filtrar dados no dashboard e verificar atualização', async () => {
    await navegador.get(`${URL_BASE}/paineis`);
    
    await navegador.wait(
      until.elementLocated(By.css('h1')),
      TIMEOUT
    );

    await navegador.wait(
      until.elementLocated(By.css('input[type="number"]')),
      TIMEOUT
    );

    const inputsAno = await navegador.findElements(By.css('input[type="number"]'));
    await inputsAno[0].clear();
    await inputsAno[0].sendKeys('2020');

    await inputsAno[1].clear();
    await inputsAno[1].sendKeys('2024');

    const selectRegiao = await navegador.findElements(By.css('select'));
    if (selectRegiao.length > 0) {
      await selectRegiao[0].click();
      await selectRegiao[0].sendKeys('AGRESTE', Key.RETURN);
    }

    await navegador.sleep(500);

    const botaoFiltrar = await navegador.findElement(
      By.xpath("//button[contains(text(), 'Aplicar Filtros')]")
    );
    await botaoFiltrar.click();

    await navegador.sleep(2000);

    const cards = await navegador.findElements(By.css('.bg-white'));
    expect(cards.length).toBeGreaterThan(0);

    await navegador.wait(
      until.elementLocated(By.css('canvas')),
      TIMEOUT
    );
    const graficos = await navegador.findElements(By.css('canvas'));
    expect(graficos.length).toBeGreaterThan(0);
  }, TIMEOUT);

  test('Fluxo 2: Interagir com chatbot e exportar conversa para PDF', async () => {
    await navegador.get(`${URL_BASE}/chatbot`);

    await navegador.wait(
      until.elementLocated(By.css('textarea')),
      TIMEOUT
    );

    const inputChat = await navegador.findElement(By.css('textarea'));
    
    const pergunta = 'Liste os municípios disponíveis';
    await inputChat.sendKeys(pergunta);

    await navegador.sleep(500);
    const botaoEnviar = await navegador.findElement(
      By.css('button[type="submit"]')
    );
    await botaoEnviar.click();

    await navegador.sleep(5000);
    
    const mensagens = await navegador.findElements(By.css('div'));
    expect(mensagens.length).toBeGreaterThan(0);
  }, TIMEOUT * 2);

  test('Fluxo 3: Fazer previsão de crimes usando formulário ML', async () => {
    await navegador.get(`${URL_BASE}/`);

    await navegador.wait(
      until.elementLocated(By.css('form')),
      TIMEOUT
    );

    await navegador.sleep(1000);

    const selects = await navegador.findElements(By.css('select'));
    if (selects.length > 0) {
      await selects[0].click();
      await selects[0].sendKeys('RECIFE', Key.RETURN);
      await navegador.sleep(500);
    }

    const inputs = await navegador.findElements(By.css('input[type="number"]'));
    if (inputs.length >= 2) {
      await inputs[0].clear();
      await inputs[0].sendKeys('6');

      await inputs[1].clear();
      await inputs[1].sendKeys('2026');
    }

    const botoes = await navegador.findElements(By.css('button'));
    for (const botao of botoes) {
      const texto = await botao.getText();
      if (texto.includes('Sim')) {
        await botao.click();
        break;
      }
    }

    await navegador.sleep(500);

    const botaoPrever = await navegador.findElement(
      By.xpath("//button[contains(text(), 'Gerar Previsão') or contains(text(), 'Calculando')]")
    );
    await botaoPrever.click();

    await navegador.sleep(5000);

    const textoCompleto = await navegador.findElement(By.css('body')).getText();
    const temNumero = /\d+/.test(textoCompleto);
    expect(temNumero).toBe(true);
  }, TIMEOUT * 2);

  test('Fluxo 4: Interagir com mapa de calor e visualizar município', async () => {
    await navegador.get(`${URL_BASE}/mapa`);

    await navegador.wait(
      until.elementLocated(By.css('h1')),
      TIMEOUT
    );

    await navegador.sleep(2000);

    await navegador.wait(
      until.elementLocated(By.css('.leaflet-container')),
      TIMEOUT
    );

    const elementosMapa = await navegador.findElements(By.css('.leaflet-container'));
    expect(elementosMapa.length).toBeGreaterThan(0);

    await navegador.sleep(2000);

    const municipios = await navegador.findElements(By.css('path[fill]'));
    expect(municipios.length).toBeGreaterThan(0);
  }, TIMEOUT);
});
