export const cassiwatch = {
   logoUrl: "assets/logos/cassi.jpeg",
   id: "cassiwatch",
   slug: "ux-on-wrist",
   year: "2023 ∙ CASSI",
   employer: "CASSI",
   readTime: _t("3 min", "3 min"),
   title: _t("UX on Wrist ", "UX no Pulso"),
   shortDesc: _t("Translating healthcare metrics to Apple Watch constraints.", "Traduzindo métricas de saúde para as restrições do Apple Watch."),
   aiSummary: _t("An experimental port of CASSI's mobile app to watchOS. Focused purely on emergency data and authorization glances, relying on native Apple Wallet integrations to maintain glanceability under 3 seconds.", "Uma versão experimental do aplicativo da CASSI para o watchOS. Focado estritamente em visualizações rápidas de autorizações e carteira médica, integrando-se via Apple Wallet nativo para tempos de consulta menores que 3 segundos."),
   keyIndicators: [
      { value: _t("2 Core", "2 Core"), label: _t("Features focused on retention", "Recursos focados em retenção") },
      { value: _t("1 Gesture", "1 Gesto"), label: _t("Emergency access via Apple Wallet", "Acesso emergencial via Apple Wallet") },
      { value: "< 3s", label: _t("Time to comprehension", "Tempo de compreensão cognitiva") },
      { value: "100%", label: _t("Compliance with Apple HIG", "Conformidade com a Apple HIG") }
   ],
   desc: _t(`
<p class="p1">
<strong>Note on experimental nature:</strong> This is an experimental design and proof of concept. It was not implemented in production, thus it has no measured real-world impact. The project demonstrates the application of Apple Human Interface Guidelines for watchOS 10 in a healthcare context.
</p>

<h3>Design Challenge</h3>

<p class="p1">
Based on projects developed at CASSI, identify which mobile features would add maximum value in a wearable context. Constraints: 40-45mm screen, interactions <5s, glanceability.
</p>

<p class="p1">
<strong>Core Problem:</strong> How to adapt critical health plan features (authorization view, emergency card) for a wearable interface with sub-5 second interactions?
</p>

<p class="p1">
<strong>Platform Constraints:</strong><br>
- Limited screen: 324×394px or 368×448px<br>
- Brief interactions: users consult on the go<br>
- Critical info hierarchy: max 3-5 data points per screen<br>
- Apple HIG watchOS 9 compliance
</p>

<p class="p1"><strong>Project Members:</strong> Lio Schimanko, Illa Penha, Felipe Pires & Luís Aragão</p>

<div class="case-asset-wrapper">
   <div class="case-asset-box is-image">
      <img src="assets/cases/en/watch/2.avif" alt="Medical authorization visualization">
   </div>
   <p class="case-caption">Medical authorization visualization — critical information prioritized for <3s glanceability.</p>
</div>

<h3>Research & Design Decisions</h3>

<p class="p1">
<strong>Methods Used:</strong><br>
- Analysis of previous CASSI projects<br>
- Identification of most-accessed mobile features (internal analytics)<br>
- User flow mapping for wearables<br>
- Study of Apple watchOS 10 Human Interface Guidelines
</p>

<p class="p1">
<strong>Design & Prototyping:</strong> Figma, Apple watchOS UI Kit, SF Compact Typography<br>
<strong>Ecosystem & Compliance:</strong> Apple HIG, Apple Wallet integration (PassKit)<br>
<strong>Product Strategy:</strong> Mobile-to-Wearable translation
</p>

<p class="p1">
<strong>Critical Decision #1: Which Features to Port?</strong>
</p>

<p class="p1">
<strong>Tradeoff Chosen:</strong> 2 core features (authorizations + emergency card)<br>
<strong>Reason:</strong> Analysis showed authorizations (monitoring expenses) and emergency cards are the most critical use cases. Authorizations = passive daily use; card = active emergency use.<br>
<strong>Impact:</strong> Aligned with Apple's philosophy of radical simplicity.
</p>

<p class="p1">
<strong>Critical Decision #2: Information Hierarchy in Authorizations</strong>
</p>

<p class="p1">
<strong>Tradeoff Chosen:</strong> Spaced list with radical visual hierarchy<br>
<strong>Reason:</strong> Users consult while walking or waiting. Prioritized 3 critical data points: (1) Procedure type, (2) Value, (3) Recent date.<br>
<strong>Impact:</strong> <3s glanceability.
</p>

<div class="case-asset-wrapper">
   <div class="case-asset-box is-image">
      <img src="assets/cases/en/watch/1.avif" alt="Emergency card in Apple Wallet">
   </div>
   <p class="case-caption">Emergency card — Apple Wallet integration for instant sharing via AirDrop/Messages.</p>
</div>

<p class="p1">
<strong>Critical Decision #3: Card Access — Native App vs. Apple Wallet</strong>
</p>

<p class="p1">
<strong>Tradeoff Chosen:</strong> Dual — in-app card + "Add to Wallet" button<br>
<strong>Reason:</strong> Emergency use requires maximum speed. Apple Wallet allows access in 1 gesture (double-click side button), even when locked.<br>
<strong>Impact:</strong> Velocity > Branding in emergency healthcare situations.
</p>

<h3>Design Solution</h3>

<p class="p1">
<strong>Information Architecture:</strong><br>
1. <strong>Authorization List:</strong> Spaced cards with type/value/date<br>
2. <strong>Authorization Details:</strong> Provider name, address, ANS code<br>
3. <strong>Card:</strong> QR code + essential data<br>
4. <strong>Apple Wallet Pass:</strong> Instant double-click access
</p>

<h3>Design Learnings</h3>

<p class="p1">
<strong>1. Less is more in wearables:</strong> Porting only 2 features followed HIG philosophy. Every additional screen is exponential friction.
</p>

<p class="p1">
<strong>2. Visual hierarchy saves glanceability:</strong> SF Compact Display Bold for values allowed <3s comprehension.
</p>

<p class="p1">
<strong>3. Native integration > customization:</strong> Apple Wallet sacrificed branding but gained life-saving speed.
</p>

<p class="p1">
<strong>Key learning on healthcare wearable design:</strong> Critical info in stress/motion context must be <strong>glanceable</strong> and <strong>actionable</strong>. This requires sacrificing density for radical simplicity.
</p>
        `, `
<p class="p1">
<strong>Nota sobre contexto experimental:</strong> Este é um design experimental de prova de conceito. Não foi implementado em produção, não possuindo impactos reais. O projeto demonstra a aplicação pura da Human Interface Guidelines da Apple voltadas à saúde.
</p>

<h3>Desafio de Design</h3>

<p class="p1">
Baseado em projetos móveis da CASSI, o objetivo foi extrair o máximo de valor para interfaces de pulso. Restrições: Tela de 40 a 45 mm e uso rápido de no máximo 5 segundos.
</p>

<p class="p1">
<strong>Problema Principal:</strong> Como adaptar visões complexas do plano (visualizações de autorização, carteirinha médica de emergência) em telas de wearable com um teto de interação micro-curto?
</p>

<p class="p1">
<strong>Restrições da Plataforma:</strong><br>
- Tela minúscula: 324×394px ou 368×448px<br>
- Interações Breves: Usuários agem caminhando.<br>
- Hierarquia Crítica: no máximo 3-5 dados no display.<br>
- Padrões Apple HIG para watchOS.
</p>

<p class="p1"><strong>Membros do Projeto:</strong> Lio Schimanko, Illa Penha, Felipe Pires & Luís Aragão</p>

<div class="case-asset-wrapper">
   <div class="case-asset-box is-image">
      <img src="assets/cases/watch/2.avif" alt="Medical authorization visualization">
   </div>
   <p class="case-caption">Tela de visualizações com cartões para rastreio direto e fácil da autorização médica.</p>
</div>

<h3>Pesquisa e Decisões</h3>

<p class="p1">
<strong>Métodos de Estudo:</strong><br>
- Investigação em projetos móveis da CASSI<br>
- Determinação de necessidades críticas por análise de logs internos.<br>
- Design Flow para uso diário em caminhadas.<br>
- Estudo estrito e técnico do watchOS 10 Guidelines da Apple.
</p>

<p class="p1">
<strong>Estrutura de Design & Prototipagem:</strong> UI Kits da Apple em Figma e Arquitetura Compact Typography (SF Compact).<br>
<strong>Compliance:</strong> Mapeamentos de integração PassKit na Apple Wallet nativa.
</p>

<p class="p1">
<strong>Decisão nº 1: Filtro Restritivo de Adaptação</strong>
</p>

<p class="p1">
<strong>Tradeoff Escolhido:</strong> Omitir dezenas de funcionalidades e concentrar-se em autorizações + socorro.<br>
<strong>Causa:</strong> Analisar e focar nos elementos ativos vs passivos, deixando as atividades profundas ou longas nos canais para navegadores e smartphones principais.
</p>

<p class="p1">
<strong>Decisão nº 2: Carga de Retenção</strong>
</p>

<p class="p1">
<strong>Tradeoff Escolhido:</strong> Visualização de matriz simples com radical ordenação visual.<br>
<strong>Causa:</strong> Separar e isolar as 3 frentes de urgência (1) Natureza (2) Valor e (3) Datas, para dar suporte cognitivo ágil.<br>
</p>

<div class="case-asset-wrapper">
   <div class="case-asset-box is-image">
      <img src="assets/cases/watch/1.avif" alt="Emergency card in Apple Wallet">
   </div>
   <p class="case-caption">Módulo do QR Code — acesso limpo integrando-se via PassKit do Apple Wallet nativo.</p>
</div>

<p class="p1">
<strong>Decisão nº 3: Interface no Aplicativo VS Aplicação Nativa</strong>
</p>

<p class="p1">
<strong>Tradeoff Escolhido:</strong> Integração dupla — Acesso restrito a um duplo-clique nativo Apple.<br>
<strong>Causa:</strong> A emergência demanda velocidade insana, sem telas de carregamento do app. Pressionar o pino em 1 toque na tranca poupa muito atrito no estresse da hora.<br>
<strong>Impacto:</strong> A Velocidade importa mais do que uma tela bem desenhada na marca CASSI sob circunstâncias adversas de dor.
</p>

<h3>Soluções Estruturais e Aprendizados</h3>

<p class="p1">
<strong>Arquitetura da Informação:</strong><br>
1. <strong>Lista Principal de Solicitações:</strong> Dados de alta visibilidade e data.<br>
2. <strong>Detalhes Completos:</strong> Provedor, Hospital e código final regulamentar ANS.<br>
3. <strong>Card Pessoal:</strong> Códigos de QR de urgência do dependente.<br>
4. <strong>PassKit:</strong> O suporte emergencial completo sem destravar o aparelho de relógio.
</p>

<h3>Resumo de Design (Insights)</h3>

<p class="p1">
<strong>1. Menos é infinitamente mais na usabilidade Wearable:</strong> Mapear tudo para 2 micro funcionalidades respeitou a diretriz Apple HIG e eliminou telas inúteis de complexidade pesada.
</p>

<p class="p1">
<strong>2. Retenção Hierárquica salva vidas cognitivamente falando:</strong> Escalas precisas nas fontes (SF Compact BOLD) reduziram as perdas e erros do utilizador.
</p>

<p class="p1">
<strong>3. Padrões Nativos sobrepujam as customizações de vaidade da marca:</strong> Colar-se ao Apple Wallet nativo entregou muito mais poder do usuário sob crise de saúde do que mantê-lo bloqueado em uma interface esteticamente controlada pela CASSI.
</p>

<p class="p1">
<strong>Aprendizados reais de UI em Healthcare wearable:</strong> Dados urgentes importam, simplicidade domina a dor do momento, sacrificando-se o resto.
</p>
        `),
   credits: ["Lio Schimanko", "Illa Penha", "Felipe Pires", "Luís Aragão"],
   videoSrc: _t("assets/videos/en/en-cassiwatch.mp4", "assets/videos/pt/pt-cassiwatch.mp4"),
   vttSrc: _t("assets/subtitles/en/en-cassiwatch.vtt", "assets/subtitles/pt/pt-cassiwatch.vtt"),
   thumbSrc: "assets/thumbs/en/cassiwatch.avif",
   deviceClass: "apple-watch",
   customGap: "0px",
};