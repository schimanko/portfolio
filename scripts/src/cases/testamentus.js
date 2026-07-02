export const testamentus = {
  logoUrl: "assets/logos/holofante/logo.jpeg",
  id: "testamentus",
  slug: "typographic-reader",
  title: _t("Building an e-reader", "Construindo um e-reader"),
  year: _t("2025 ∙ Testamentus.org", "2025 ∙ Testamentus.org"),
  audioSrc: _t("assets/audio/en/testamentus/audio-testamentus-summary.mp3", "assets/audio/pt/testamentus/pt-audio-testamentus-summary.mp3"),
  audioSrcRecruiter: _t("assets/audio/en/testamentus/audio-testamentus-dev.mp3", "assets/audio/pt/testamentus/pt-audio-testamentus-dev.mp3"),
  readTime: _t("3 min", "3 min"),
  shortDesc: _t("A privacy-first reading engine built for typographic focus.", "Um motor de leitura digital focado em privacidade e foco tipográfico."),
  aiSummary: _t("Testamentus is a reading platform optimized for long-form retention. By strictly controlling line lengths and moving data to static edge delivery, it guarantees zero visual friction and instant load times.", "Testamentus é uma plataforma de leitura otimizada para retenção a longo prazo. Ao controlar estritamente comprimentos de linha e entregar os dados de forma estática, ela garante atrito visual zero e tempos de carregamento instantâneos."),
  liveUrl: "https://testamentus.org/",
  repositoryUrl: "https://github.com/schimanko/testamentus.org",
  keyIndicators: [
    { value: "+143%", label: _t("Increase in average session duration", "Aumento na duração média da sessão") },
    { value: "US$ 5/mo", label: _t("Fixed cost for scalable infrastructure", "Custo fixo para infraestrutura escalável") },
    { value: "0.9s", label: _t("FCP Performance (100/100 PageSpeed)", "Desempenho FCP (100/100 no PageSpeed)") },
    { value: "92/100", label: _t("WCAG AA Accessibility Compliance", "Conformidade de Acessibilidade WCAG AA") }
  ],
  desc: _t(`<p class="p1">Testamentus was designed and solo-engineered to completely reinvent modern digital interaction with historical text by prioritizing extreme typographic discipline. Traditional digital reading options are heavily compromised by distracting ad networks, erratic layouts, and rigid viewports that create immediate visual friction and severe cognitive fatigue for the long-form reader.</p>

<h3>Typographic Ergonomics</h3>
<p class="p1">The core interface strips away standard web layout noise to deliver an elite, distraction-free reading column. Programmed around the tracking and fixation mechanics of human eye movement, the spatial boundaries restrict maximum line lengths, character scaling parameters, and tracking definitions. This intentional constraint eliminates subvocalization fatigue and tracking loss—where the eye loses its place moving from the end of one line to the beginning of the next—optimizing long-form reading speed.</p>

<div class="combo-asset-card"> 
  <img src="assets/cases/en/testamentus/3-2 2.png" alt="Testamentus Minimalist Interface Layout" class="case-img-rounded-full"> 
  <div class="combo-divider"></div> 
  <p class="combo-observation">Observation: Enforcing generous, intentional white space around columns shields text from side decorations, letting readers remain focused during deep reading sessions.</p> 
</div>

<h3>Frictionless Personalization</h3>
<p class="p1">To serve a broad spectrum of user reading accommodations without breaking narrative immersion, an elegant, non-disruptive configuration panel can be invoked instantly. Readers retain absolute control over text layout mechanics—adjusting font scale, line pacing, alignment, and letter spacing dynamically on the client side without triggering jarring page reflows or losing their active scroll position.</p>

<div class="combo-asset-card"> 
  <img src="assets/cases/en/testamentus/5 2.png" alt="Dynamic Typography Customization Control" class="case-img-rounded-full"> 
  <div class="combo-divider"></div> 
  <p class="combo-observation">Observation: Providing standalone, inline adjustments mutates text parameters instantly, updating legibility styles without forcing full page reloads or jumping the viewer's scroll location.</p> 
</div>

<h3>Dynamic Context Sharing (Privacy-First Growth Loop)</h3>
<p class="p1">To bridge isolated reading with word-of-mouth discovery, the application introduces an organic sharing loop activated on text selections. Instead of requiring users to manage unformatted plain text clipboard copies, selecting specific verses instantly launches an overlay module that transforms textual nodes into beautifully formatted graphic cards. By processing this entirely on the client side without forcing account registration or authentication, user privacy remains perfectly protected while removing sign-up friction entirely.</p>

<div class="combo-asset-card"> 
  <div class="combo-tabs"> 
    <button class="combo-tab active" data-target="tab-card-light">Classic Variant</button> 
    <button class="combo-tab" data-target="tab-card-dark">Contrast Variant</button> 
  </div> 

  <div class="combo-content active" data-id="tab-card-light">
    <img src="assets/cases/en/testamentus/3-2 3.png" alt="Classic Light Theme Verse Card Generation Preview" class="case-img-fluid">
    <div class="combo-divider"></div>
    <p class="combo-observation">Observation: Converting text nodes into high-fidelity image cards transforms plain text quotes into shareable visual media items, driving natural product discoverability.</p>
  </div>

  <div class="combo-content" data-id="tab-card-dark">
   <img src="assets/cases/en/testamentus/5 1.png" alt="Dark High-Contrast Interface Mode" class="case-img-fluid">
    <div class="combo-divider"></div>
    <p class="combo-observation">Observation: Packaging fluid light and dark visual states respects user ambient environments while making sure typography details maintain clean presentation bounds wherever shared.</p>
  </div>
</div>
    `, `<p class="p1">O Testamentus foi projetado e desenvolvido individualmente para reinventar completamente a interação digital moderna com textos históricos, priorizando extrema disciplina tipográfica. Opções tradicionais de leitura digital são fortemente comprometidas por redes de anúncios, layouts irregulares e viewports rígidas que criam atrito visual imediato e fadiga cognitiva severa.</p>

<h3>Ergonomia Tipográfica</h3>
<p class="p1">A interface principal remove o ruído do layout da web padrão para entregar uma coluna de leitura limpa e livre de distrações. Programada em torno das mecânicas de rastreamento e fixação ocular, os limites espaciais restringem comprimentos máximos de linha, parâmetros de dimensionamento de caracteres e definições de kerning. Essa restrição elimina a fadiga de subvocalização e a perda de rastreamento, otimizando a velocidade de leitura a longo prazo.</p>

<div class="combo-asset-card"> 
  <img src="assets/cases/pt/testamentus/3-2 2.png" alt="Layout Interface Minimalista Testamentus" class="case-img-rounded-full"> 
  <div class="combo-divider"></div> 
  <p class="combo-observation">Observação: Aplicar um espaço em branco generoso e intencional ao redor das colunas blinda o texto de decorações laterais, permitindo que os leitores mantenham o foco durante sessões profundas.</p> 
</div>

<h3>Personalização sem Atrito</h3>
<p class="p1">Para atender a um amplo espectro de necessidades de leitura sem quebrar a imersão narrativa, um painel de configuração elegante e não intrusivo pode ser acionado instantaneamente. Os leitores mantêm controle absoluto sobre a mecânica do layout, ajustando escala, ritmo, alinhamento e espaçamento das letras dinamicamente, sem recarregar a página e sem perder a posição do scroll.</p>

<div class="combo-asset-card"> 
  <img src="assets/cases/testamentus/5 2.png" alt="Controle de Personalização Dinâmica de Tipografia" class="case-img-rounded-full"> 
  <div class="combo-divider"></div> 
  <p class="combo-observation">Observação: Ajustes diretos mutam instantaneamente os parâmetros do texto, atualizando a legibilidade sem forçar recarregamentos totais da página.</p> 
</div>

<h3>Compartilhamento Dinâmico (Ciclo de Crescimento com Privacidade)</h3>
<p class="p1">Para unir a leitura isolada à  descoberta boca a boca, o aplicativo introduz um loop de compartilhamento orgânico ativado nas seleções de texto. Em vez de exigir que os usuários gerenciem cópias de texto não formatadas na área de transferência, ao selecionar versículos, um overlay instantâneo transforma nós textuais em cartões gráficos esteticamente formatados no próprio client-side. Assim, a privacidade do usuário permanece protegida, removendo completamente o atrito de inscrições e cadastros.</p>

<div class="combo-asset-card"> 
  <div class="combo-tabs"> 
    <button class="combo-tab active" data-target="tab-card-light">Variante Clássica</button> 
    <button class="combo-tab" data-target="tab-card-dark">Variante Contraste</button> 
  </div> 

  <div class="combo-content active" data-id="tab-card-light">
    <img src="assets/cases/testamentus/3-2 3.png" alt="Preview da Geração de Cartão em Tema Claro" class="case-img-fluid">
    <div class="combo-divider"></div>
    <p class="combo-observation">Observação: Converter nós de texto em cartões de alta fidelidade transforma citações planas em mídia compartilhável, impulsionando a descoberta natural do produto.</p>
  </div>

  <div class="combo-content" data-id="tab-card-dark">
   <img src="assets/cases/testamentus/5 1.png" alt="Modo Escuro de Alto Contraste" class="case-img-fluid">
    <div class="combo-divider"></div>
    <p class="combo-observation">Observação: Oferecer estados visuais claros e escuros respeita os ambientes do usuário enquanto garante que os detalhes tipográficos mantenham limites limpos onde quer que sejam compartilhados.</p>
  </div>
</div>
    `),
  descRecruiter: _t(`
    <p class="p1">This full-stack typographic delivery engine was solo-engineered to completely bypass traditional relational database lookup bottlenecks at scale. By shifting heavy relational text content queries entirely to a background pre-compilation build stage, the architecture generates immutable, flat file structures that load instantly with near-zero RAM overhead, bypassing runtime server processing completely.</p>

<div class="combo-asset-card"> 
  <div class="live-mermaid-container" data-a11y-title="Pre-Render Static Compilation Flow">
  flowchart LR
Row_1 --> Row_2

subgraph Row_1 [Offline Build Loop]
    direction TB
    MySQL[(MySQL Core Database)] --> Script[PHP Compiler Engine] --> Buffer[Memory Buffer Scope]
end

subgraph Row_2 [Edge Delivery Pipeline]
    direction TB
    DiskIO[Directory System Writer] --> FlatHTML[Compiled Flat HTML Directory Tree] --> Viewport[Client Reading Viewport]
end
  </div>
  <div class="combo-divider"></div> 
  <p class="combo-observation">Observation: Moving relational lookup operations to an offline build loop flattens hierarchical structural inputs into decentralized static paths, allowing the server to absorb heavy traffic spikes with 0ms database latency.</p> 
  <div class="combo-divider"></div> 
  <pre><code class="language-php">// Pre-compilation loop organizing raw relational records directly into clean directory structures
$dirReader = $dirChapterList . "$chapter/";
if (!is_dir($dirReader)) {
    mkdir($dirReader, 0777, true);
}
// Outputs structural text payloads straight to disk as atomic entrypoints
file_put_contents($dirReader . "index.html", $htmlReader);</code></pre> 
</div>

<h3>State Control & Storage Hydration</h3>
<p class="p1">Typographic preferences execute entirely via non-blocking operational pathways, utilizing browser storage trees to persist selections across reading sessions. Rather than relying on remote network lookups or server-side session tracking, configuration objects hydrate state directly into the DOM tree during initial parsing loops, guaranteeing an instantaneous rendering sequence.</p>

<div class="combo-asset-card"> 
  <div class="telemetry-visual"> 
    <div class="storage-card">
      <div class="storage-card-title">âš¡ Client Local Storage Hydration Interface</div>
      <div class="storage-card-bar-bg">
        <div class="storage-card-bar-fill"></div>
      </div>
    </div>
    <div class="telemetry-overlay mt-12"> 
      <span class="telemetry-pill" data-metric="load"><span class="pulse-dot"></span> Hydration Latency: 0ms</span> 
      <span class="telemetry-pill" data-metric="memory"><span class="pulse-dot bg-blue"></span> Execution Context: Isolated Client Loop</span> 
    </div> 
  </div> 
  <div class="combo-divider"></div> 
  <p class="combo-observation">Observation: Initializing system parameters from client-side configurations skips remote handshakes, maintaining smooth presentation transformations between viewports.</p> 
  <div class="combo-divider"></div> 
  <pre><code class="language-javascript">// Synchronous state retrieval and typography property hydration logic from overlayreader.js
function loadSettings() {
  const savedSettings = JSON.parse(localStorage.getItem('textSettings'));
  if (savedSettings) return savedSettings;
  // Fail-safe engineering defaults preserving typographic discipline
  return { fontSize: 22, lineHeight: 1.5, letterSpacing: 0, fontFamily: 'Times New Roman' };
}</code></pre> 
</div>

<h3>Layout Reflow Containment (60fps Rendering Guard)</h3>
<p class="p1">To completely eliminate browser stuttering or visual flickering when adjusting text parameters, configuration values scale cleanly via target element mutations. By scoping dynamic adjustments strictly to individual text container CSS variables rather than triggering global document invalidations, runtime style modifications bypass heavy layout recalculations, securing an un-throttled 60fps frame rate even on lower-end mobile chipsets.</p>

<div class="combo-asset-card"> 
  <div class="telemetry-visual"> 
    <div class="telemetry-code-block">
      <span class="telemetry-title">[Typographic Variable Mappings - Scoped Mutations]</span>
      #font-increase &nbsp; → layoutController.apply() → selector: '--reader-font-size' += 2px<br/>
      #line-increase → layoutController.apply() → selector: '--reader-line-height' += 0.1<br/>
      #reset-btn &nbsp; &nbsp; → layoutController.purge() &nbsp; → state: clear localStorage textSettings
    </div>
    <div class="telemetry-overlay"> 
      <span class="telemetry-pill">Status: Style Thread Reflow Guard active</span> 
    </div> 
  </div> 
  <div class="combo-divider"></div> 
  <p class="combo-observation">Observation: Confining dynamic font properties to scoped structural elements eliminates expensive layout invalidation cycles, preventing full-page element repaints.</p> 
</div>

<h3>Asynchronous Canvas Graphics Pipeline</h3>
<p class="p1">The social export subsystem converts dynamic text nodes on the fly into high-density rasterized graphics using an HTML5 2D canvas layer. The architecture manages word wrapping boundaries, multi-line paragraph offsets, padding boundaries, and themes internally on the main thread, outputting highly compressed binary image blocks directly to the browser viewport. This design pattern completely unloads image compilation tasks from your infrastructure.</p>

<div class="combo-asset-card"> 
  <div class="live-mermaid-container" data-a11y-title="Canvas Rendering Pipeline Sequence">
  sequenceDiagram
      autonumber
      participant App as User Gesture Interface
      participant Engine as Canvas Graphic Compiler
      participant Canvas as 2D Context Surface
      participant Target as Native System Share

      App->>Engine: Select Verse Node (Trigger Selection Overlay)
      Note over Engine: Extracts verse string parameters & textual payload
      Engine->>Canvas: Instantiate workspace layer & apply theme parameters
      Canvas->>Canvas: Calculate multi-line string bounds & stitch layout
      Canvas-->>Engine: Output rasterized data matrix
      Engine->>Target: Resolve binary PNG Blob & call Web Share API
      Note over Target: Launches native OS file distribution layer
  </div>
  <div class="combo-divider"></div> 
  <p class="combo-observation">Observation: Rendering textual assets inside client contexts unloads graphic compute tasks from your infrastructure, ensuring graphic creation remains instant, highly scalable, and private.</p> 
  <div class="combo-divider"></div> 
  <pre><code class="language-javascript">// Asynchronous canvas rendering and compressed image block production pipeline from sharing-overlay.js
canvas.toBlob(function(blob) {
  generatedImageBlob = blob;
  generatedImageUrl = URL.createObjectURL(blob);
  resolve({ blob: generatedImageBlob, url: generatedImageUrl });
}, 'image/png');</code></pre> 
</div>

<h3>Defensive Data Governance & Security Controls</h3>
<p class="p1">To guard the flat-file directory infrastructure from path-traversal mechanics or injection vectors, all query parameters pass through strict validation blocks at the application boundary. By validating array keys and running input sequences through explicit string matching configurations, the application neutralizes malicious script insertion attempts before any template construction happens. Furthermore, compiling content to static structures completely removes dynamic runtime SQL injection vectors from the production attack surface.</p>

<div class="combo-asset-card">
  <pre><code class="language-php">// Type-safe argument isolation and input sanitization checking loops from reader.php
$book = isset($_GET['book']) ? preg_replace("/[^a-zA-Z0-9\s-_]/", "", $_GET['book']) : '';
$chapter = isset($_GET['chapter']) ? (int)$_GET['chapter'] : 1;

// Strict whitelist testing against pre-compiled schema lists to isolate directory execution paths
if (!in_array($book, $validBooksArray)) {
    header("HTTP/1.1 404 Not Found");
    exit("Invalid Book Boundary Request.");
}</code></pre>
  <div class="combo-divider"></div>
  <p class="combo-observation">Observation: Filtering inbound parameters via strict scalar type coercion and regular expression filters prevents malicious path manipulation or local directory traversal injections.</p>
</div>`, `
    <p class="p1">Este motor de entrega tipográfica full-stack foi desenvolvido para contornar gargalos tradicionais de banco de dados relacional em escala. Movendo pesadas queries para um estágio de compilação em background, a arquitetura gera arquivos estáticos imutáveis que carregam instantaneamente, dispensando o processamento do servidor em tempo de execução.</p>

<div class="combo-asset-card"> 
  <div class="live-mermaid-container" data-a11y-title="Fluxo de Compilação Estática">
  flowchart LR
Row_1 --> Row_2

subgraph Row_1 [Loop de Compilação Offline]
    direction TB
    MySQL[(Banco de Dados Central)] --> Script[Motor Compilador PHP] --> Buffer[Escopo do Buffer de Memória]
end

subgraph Row_2 [Pipeline de Entrega de Borda]
    direction TB
    DiskIO[Escritor do Sistema de Diretório] --> FlatHTML[Árvore Compilada de Arquivos HTML Estáticos] --> Viewport[Viewport de Leitura do Cliente]
end
  </div>
  <div class="combo-divider"></div> 
  <p class="combo-observation">Observação: Mover operações relacionais para um loop offline nivela entradas hierárquicas em caminhos estáticos, permitindo que o servidor absorva picos pesados com 0ms de latência.</p> 
  <div class="combo-divider"></div> 
  <pre><code class="language-php">// Loop de compilação organizando registros brutos diretamente em estruturas de diretório
$dirReader = $dirChapterList . "$chapter/";
if (!is_dir($dirReader)) {
    mkdir($dirReader, 0777, true);
}
// Gera os dados para o disco como pontos de entrada
file_put_contents($dirReader . "index.html", $htmlReader);</code></pre> 
</div>

<h3>Controle de Estado e Hidratação</h3>
<p class="p1">As preferências tipográficas são executadas através de caminhos operacionais não-bloqueantes, utilizando o armazenamento do navegador para persistir seleções. Em vez de depender de consultas de rede, objetos de configuração hidratam o estado diretamente na árvore DOM durante a análise inicial, garantindo uma renderização instantânea.</p>

<div class="combo-asset-card"> 
  <div class="telemetry-visual"> 
    <div class="storage-card">
      <div class="storage-card-title">âš¡ Interface de Hidratação Local (Client Storage)</div>
      <div class="storage-card-bar-bg">
        <div class="storage-card-bar-fill"></div>
      </div>
    </div>
    <div class="telemetry-overlay mt-12"> 
      <span class="telemetry-pill" data-metric="load"><span class="pulse-dot"></span> Latência de Hidratação: 0ms</span> 
      <span class="telemetry-pill" data-metric="memory"><span class="pulse-dot bg-blue"></span> Contexto de Execução: Loop Isolado</span> 
    </div> 
  </div> 
  <div class="combo-divider"></div> 
  <p class="combo-observation">Observação: Inicializar os parâmetros do sistema a partir de configurações client-side evita os 'handshakes' remotos, mantendo transições suaves de estilo.</p> 
  <div class="combo-divider"></div> 
  <pre><code class="language-javascript">// Recuperação síncrona do estado e hidratação da tipografia via overlayreader.js
function loadSettings() {
  const savedSettings = JSON.parse(localStorage.getItem('textSettings'));
  if (savedSettings) return savedSettings;
  // Padrões tolerantes a falhas preservando a disciplina
  return { fontSize: 22, lineHeight: 1.5, letterSpacing: 0, fontFamily: 'Times New Roman' };
}</code></pre> 
</div>

<h3>Contenção de Reflow e Garantia de 60fps</h3>
<p class="p1">Para eliminar instabilidades ou cintilações no navegador, os valores dimensionam via mutações de elementos alvo. Escopando ajustes dinâmicos apenas para variáveis CSS de contêineres e evitando reflows custosos do DOM inteiro, modificações de estilo em tempo real funcionam em fluidos 60 quadros por segundo, mesmo em hardwares mais antigos.</p>

<div class="combo-asset-card"> 
  <div class="telemetry-visual"> 
    <div class="telemetry-code-block">
      <span class="telemetry-title">[Mapeamento - Mutações no Escopo]</span>
      #font-increase &nbsp; → layoutController.apply() → selector: '--reader-font-size' += 2px<br/>
      #line-increase → layoutController.apply() → selector: '--reader-line-height' += 0.1<br/>
      #reset-btn &nbsp; &nbsp; → layoutController.purge() &nbsp; → state: limpar textSettings
    </div>
    <div class="telemetry-overlay"> 
      <span class="telemetry-pill">Status: Contenção Ativa de Thread</span> 
    </div> 
  </div> 
  <div class="combo-divider"></div> 
  <p class="combo-observation">Observação: Restringir a manipulação no DOM previne repinturas pesadas, o que poderia inviabilizar o processamento em mobile.</p> 
</div>

<h3>Pipeline Gráfico de Canvas Assíncrono</h3>
<p class="p1">O subsistema de exportação social converte texto em gráficos 2D em tempo real. A arquitetura gerencia quebra de linhas, preenchimentos e temas internamente na thread principal, gerando diretamente blobs de imagens comprimidas sem depender da infraestrutura em nuvem, garantindo um sistema nativo instantâneo e livre de custos.</p>

<div class="combo-asset-card"> 
  <div class="live-mermaid-container" data-a11y-title="Sequência de Pipeline Gráfico no Canvas">
  sequenceDiagram
      autonumber
      participant App as Interface Gestual
      participant Engine as Compilador Gráfico
      participant Canvas as Contexto de Tela 2D
      participant Target as Interface Nativa de Sistema

      App->>Engine: Seleciona Versículo (Aciona Sobreposição)
      Note over Engine: Extrai dados textuais e parâmetros
      Engine->>Canvas: Instancia o Canvas e aplica Tema
      Canvas->>Canvas: Calcula cordenadas e renderiza as strings multi-linhas
      Canvas-->>Engine: Retorna dados na matriz Rasterizada
      Engine->>Target: Resolve o Blob PNG e invoca a API Web Share nativa
  </div>
  <div class="combo-divider"></div> 
  <p class="combo-observation">Observação: Descarregar funções gráficas da nuvem reduz latências e custos com servidores, mantendo as criações rápidas e escaláveis.</p> 
  <div class="combo-divider"></div> 
  <pre><code class="language-javascript">// Renderização no Canvas e conversão de bloco de imagem no sharing-overlay.js
canvas.toBlob(function(blob) {
  generatedImageBlob = blob;
  generatedImageUrl = URL.createObjectURL(blob);
  resolve({ blob: generatedImageBlob, url: generatedImageUrl });
}, 'image/png');</code></pre> 
</div>

<h3>Controles de Governança e Segurança</h3>
<p class="p1">Para resguardar a infraestrutura de diretório de arquivos planos de ataques de travessia e vetores de injeção, todos os dados consultados passam por bloqueios rigorosos. Com restrições severas sobre padrões RegExp e filtragens condicionais, injeções maliciosas não processam templates, garantindo também blindagem total contra manipulação SQL por conta de serem arquivos totalmente estáticos.</p>

<div class="combo-asset-card">
  <pre><code class="language-php">// Verificação forte contra coerção escalar para segurança estática do reader.php
$book = isset($_GET['book']) ? preg_replace("/[^a-zA-Z0-9\s-_]/", "", $_GET['book']) : '';
$chapter = isset($_GET['chapter']) ? (int)$_GET['chapter'] : 1;

// Validação implacável contra manipulação de caminhos via Whitelists pré-compiladas
if (!in_array($book, $validBooksArray)) {
    header("HTTP/1.1 404 Not Found");
    exit("Invalid Book Boundary Request.");
}</code></pre>
  <div class="combo-divider"></div>
  <p class="combo-observation">Observação: Limpar os dados antes de servirem de índice para alvos de roteamento barra a criação de injeções de diretório via web root.</p>
</div>`),
  credits: ["Lio Schimanko"],
  videoSrc: _t("assets/videos/en/en-testamentus.mp4", "assets/videos/pt/pt-testamentus.mp4"),
  vttSrc: _t("assets/subtitles/en/en-testamentus.vtt", "assets/subtitles/pt/pt-testamentus.vtt"),
  frameSrc: "assets/frames/holofante.avif",
  thumbSrc: "assets/thumbs/en/testamentus.avif",
  deviceClass: "iphone-17",
  customGap: "0px",
};