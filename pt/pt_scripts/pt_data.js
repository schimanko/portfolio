// --- CASE DATABASE ---
const portfolioCases = [
    {   
        logoUrl:"pt_assets/logos/holofante/logo.jpeg",
        id: "case-01",
        year: "2026 ∙ Holofante",
        title: "IA & DesignOps",
        repositoryUrl: "https://github.com/schimanko/holofante", 
        liveUrl: "https://holofante.vercel.app",
        desc: `
        <p class="p1">
            <strong>
               Contexto:
            </strong>
            Como solo founder de um Applied lab, eu precisava transformar uma operação de 
            consultoria artesanal em um sistema escalável, conectando proposta, contrato, cobrança e acompanhamento de entregas em uma experiência única de produto.
         </p>
         <div class="impact-dashboard">
            <div class="metric-card">
               <span class="metric-value">
                     18 ➔ 5,3 dias
               </span>
               <span class="metric-label">
                     Tempo desde o orçamento aceito até a primeira entrega
               </span>
            </div>
            <div class="metric-card">
               <span class="metric-value">
                     10h+
               </span>
               <span class="metric-label">
                     Horas semanais recuperadas via automação Q2C
               </span>
            </div>
            <div class="metric-card">
               <span class="metric-value">
                     100%
               </span>
               <span class="metric-label">
                     Consistência de UI via Framework de DesignOps
               </span>
            </div>
            <div class="metric-card">
               <span class="metric-value">
                     &lt; 2s</span>
                        <span class="metric-label">
                           Latência na UI orientada a estados
                        </span>
            </div>
         </div>
         <h3>
            Desafio de Negócio
         </h3>
         <p class="p1">
            <strong>
               Problema Central:
            </strong>
            Impossibilidade de escalar a receita sem contratar uma equipe administrativa, comprometendo as margens de lucro e a agilidade operacional.
         </p>
         <p class="p1">
            <strong>
               Restrições:
            </strong>
            <br>
            - Zero orçamento para contratações — todas as soluções desenvolvidas internamente
            <br>
            - Desenvolvimento em paralelo ao atendimento de clientes ativos
            <br>
            - Limitado ao ecossistema nativo (JavaScript) com base na base de clientes existente
            <br>
            - Conformidade: CDC, ISS/RPS para notas fiscais eletrônicas, LGPD
         </p>
         <p class="p1">
            <strong>
               Objetivos Mensuráveis:
            </strong>
            <br>
            - Reduzir o trabalho manual em 27%+ e recuperar mais de 10h semanais
            <br>
            - Garantir 100% de consistência de UI em mais de 8 marcos do projeto
            <br>
            - Aumentar a CTR através de notificações orientadas a eventos
         </p>
         <p class="p1">
            <strong>
               Membros do Projeto:
            </strong>
            Lio Schimanko
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="pt_assets/cases/holofante/2.avif" alt="Fluxo de vendas completo, do lead ao pós-venda">
            </div>
            <p class="case-caption">
               Ciclo de Vida do Cliente — 7 estágios com múltiplos pontos de automação.
            </p>
         </div>
         <h3>
            Pesquisa e Descoberta
         </h3>
         <p class="p1">
            <strong>
               Métodos Utilizados:
            </strong>
            <br>
            - Análise quantitativa: 6 meses de dados via Toggl Track (127 horas mapeadas)
            <br>
            - 8 entrevistas semiestruturadas com clientes sobre fricção no processo de vendas
            <br>
            - Benchmarking de 12 ferramentas SaaS (Proposify, PandaDoc, Dubsado, HoneyBook)
            <br>
            - Mapeamento de 23 pontos de contato no ciclo comercial
         </p>
         <p class="p1">
            <strong>
               Stack de Design e Operações:
            </strong>
            Figma, DesignOps (Componentes multiestados), Notion (Fonte Única da Verdade / CRM Relacional)
            <br>
            <strong>
               Engenharia e IA:
            </strong>
            Node.js (Serverless), LangChain, OpenAI (Framework Agêntico), PWA
            <br>
            <strong>
               Ecossistema e Dados:
            </strong>
            Integração de API (Asaas, Clicksign), Criptografia (crypto.js), Webhooks
         </p>
         <p class="p1">
            <strong>
               Principais Insights:
            </strong>
         </p>
         <p class="p1">
            <strong>
               1. Gargalo Invisível:
            </strong>
            Os clientes esperavam em média 4,2 dias entre o interesse inicial e uma proposta formal — 68% citaram o "atraso na resposta" como uma frustração inicial.
         </p>
         <p class="p1">
            <strong>
               2. Documentação como Diferencial:
            </strong>
            100% valorizavam a documentação (requisitos, protótipos, manuais), mas 75% relataram dificuldade em acompanhar o status.
         </p>
         <p class="p1">
            <strong>
               3. Transparência de Preços:
            </strong>
            Orçamentos com cálculos detalhados converteram 2,3 vezes mais do que cotações estilo "caixa preta". Os clientes queriam entender o <em>porquê</em> de um determinado valor ter sido definido.
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="pt_assets/cases/holofante/3.avif" alt="Notion CRM com orçamentos e automações">
            </div>
            <p class="case-caption">
               Notion como Fonte Única da Verdade — orçamentos, contratos e status centralizados.
            </p>
         </div>
         <h3>
            Processo de Design e Decisões Críticas
         </h3>
         <p class="p1">
            <strong>
               Decisão Crítica nº 1: Framework de DesignOps vs. Componentes Ad-Hoc
            </strong>
         </p>
         <p class="p1">
            <strong>
               Opção A: Componentes ad-hoc por projeto
            </strong>
            <br>
            Pró: Velocidade inicial, sem sobrecarga de documentação
            <br>
            Contra: Inconsistência visual, retrabalho, difícil de escalar
         </p>
         <p class="p1">
            <strong>
               Opção B: Framework de DesignOps com biblioteca multiestados
            </strong>
            <br>
            Pró: Consistência garantida, reutilização, documentação viva
            <br>
            Contra: Alto investimento inicial, curva de aprendizado
         </p>
         <p class="p1">
            <strong>
               Tradeoff Escolhido:
            </strong>
            Framework de DesignOps Completo
            <br>
            <strong>
               Motivo:
            </strong>
            Com mais de 8 marcos de projeto (Orçamento → Requisitos → Protótipo → Manual → Transferência → Garantia), cada estado precisa de uma UI específica. A biblioteca de componentes multiestados cobriu "Hibernate" (projeto pausado), "Action Required" (ação necessária do cliente) e "Fallback" (erro/offline).
            <br>
            <strong>
               Impacto:
            </strong>
            100% de consistência de UI em todos os marcos. O tempo de desenvolvimento de novos recursos caiu em 60% devido aos componentes reaproveitáveis e documentados. O cliente percebe um sistema coeso, não uma "colcha de retalhos".
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box">
               <pre>
                     <code class="language-typescript">
export type MilestoneState = "Requirements" | "Prototype" | "Manual" | "Final";
export interface ProjectState {
  currentMilestone: MilestoneState;
  requirementsStatus: "pending" | "approved";
  prototypeStatus: "not_started" | "pending" | "approved";
  manualStatus: "not_started" | "pending" | "approved";
  actionRequiredText: string | null;
}</code>
               </pre>
            </div>
            <p class="case-caption">
               Modelos de Dados do Esquema de DesignOps gerenciando regras de modelagem de Autômatos de Estados Finitos em marcos ativos.
            </p>
         </div>
         <p class="p1">
            <strong>
               Decisão Crítica nº 2: Renderização Estática vs. Renderização Condicional Orientada a Estados
            </strong>
         </p>
         <p class="p1">
            <strong>
               Opção A: Páginas estáticas por status (8 telas separadas)
            </strong>
            <br>
            Pró: Arquitetura simples, sem lógica complexa
            <br>
            Contra: Manutenção explosiva, 8 vezes mais código duplicado, navegação confusa
         </p>
         <p class="p1">
            <strong>
               Opção B: Renderização condicional com base nos estados do backend
            </strong>
            <br>
            Pró: Fonte única da verdade, a UI reage automaticamente às mudanças
            <br>
            Contra: Alta complexidade lógica, depuração difícil
         </p>
         <p class="p1">
            <strong>
               Tradeoff Escolhido:
            </strong>
            Renderização condicional orientada a dados
            <br>
            <strong>
               Motivo:
            </strong>
            Cada projeto possui um estado de backend complexo (Status: "Solicitado" / "Confirmado" / "Fechado", Entrega: "Enviado" / "Aprovado", Propriedade: "Pendente" / "Assinado"). A UI precisava refletir as combinações dessas variáveis dinamicamente. O sistema detecta o estado → renderiza o componente específico → exibe a ação contextual.
            <br>
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="pt_assets/cases/holofante/sketch.avif" alt="Esboço inicial da ideia de renderização condicional">
            </div>
            <p class="case-caption">
               Esboço inicial da ideia de renderização condicional.
            </p>
         </div>
         <p class="p1">
            <strong>
               Decisão Crítica nº 3: Governança de Dados Públicos vs. Framework UUID com Criptografia
            </strong>
         </p>
         <p class="p1">
            <strong>
               Opção A: Dados sensíveis em tabelas públicas (URLs simples)
            </strong>
            <br>
            Pró: Implementação trivial, zero sobrecarga técnica
            <br>
            Contra: Exposição à LGPD, valores visíveis para crawlers, risco reputacional
         </p>
         <p class="p1">
            <strong>
               Opção B: Framework UUID + criptografia desacoplando as camadas públicas
            </strong>
            <br>
            Pró: Privacidade garantida, conformidade com a LGPD, escalabilidade
            <br>
            Contra: Complexidade arquitetônica, sobrecarga de processamento
         </p>
         <p class="p1">
            <strong>
               Tradeoff Escolhido:
            </strong>
            UUID como identificador único + crypto.js para blindagem
            <br>
            <strong>
               Motivo:
            </strong>
            Os orçamentos contêm dados sensíveis (valores, tamanho da empresa, multiplicadores). URLs públicas (/proposals/[uuid]) não podem expor valores em tabelas indexáveis. O sistema gera um UUID único por orçamento, criptografa campos sensíveis (APITotalAvista, APITotalParcelado, etc.) antes de enviar para o banco de dados e descriptografa apenas no frontend do cliente.
            <br>
            <strong>
               Impacto:
            </strong>
            Zero vazamentos de dados em 12 meses de operação. Tabelas semipúblicas do CMS exibem "0" onde deveria aparecer "R$ 50.000" — proteção contra raspagem de dados (scraping). O cliente vê um detalhamento transparente (conversão de +97%), mas os dados ficam protegidos contra terceiros. Conformidade com a LGPD garantida.
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box">
               <pre>
                     <code class="language-javascript">
const CryptoJS = require("crypto-js");
const encryptBudgetData = (data, secureKey) = >{
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), secureKey).toString();
  return {
    id: crypto.randomUUID(),
    payload: ciphertext
  };
};</code></pre>
            </div>
            <p class="case-caption">
               Modelo de payload de dados desacoplado usando matrizes UUID determinísticas e estratégias de criptografia de payload via crypto.js.
            </p>
         </div>
         <p class="p1">
            <strong>
               Decisão Crítica nº 4: Notificações Genéricas vs. Nós Orientados a Eventos
            </strong>
         </p>
         <p class="p1">
            <strong>
               Opção A: Notificações genéricas por marco ("Projeto atualizado")
            </strong>
            <br>
            Pró: Simples de implementar, zero lógica condicional
            <br>
            Contra: Ruído cognitivo, CTR baixo, fadiga de notificações
         </p>
         <p class="p1">
            <strong>
               Opção B: Nós de comunicação orientados a eventos com gatilhos comportamentais
            </strong>
            <br>
            Pró: Contextual, alta relevância, CTR superior
            <br>
            Contra: Mapeamento de eventos complexo, manutenção onerosa
         </p>
         <p class="p1">
            <strong>
               Tradeoff Escolhido:
            </strong>
            Sistema multicanal orientado ao comportamento
            <br>
            <strong>
               Motivo:
            </strong>
            Cada ação no backend (contrato assinado, requisitos aprovados, pagamento confirmado) dispara um evento específico → o sistema identifica o tipo de evento → seleciona o canal (notificação push + e-mail transacional) → personaliza a mensagem com dados contextuais (nome do cliente, próxima ação). 17 fluxos mapeados cobrindo a jornada completa.
            <br>
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="pt_assets/cases/holofante/4.avif" alt="Orçamento dinâmico com detalhamento.">
            </div>
            <p class="case-caption">
               Descrição: Uma captura de tela de navegador desktop exibindo uma página de proposta de serviço digital da holofante.com.br. Intitulada "Orçamento para Website, App móvel", the page features project pricing, payment structures, and an expandable list detailing included features like main and secondary pages.
            </p>
         </div>
         <p class="p1">
            <strong>
               Decisão Crítica nº 5: Automação Manual vs. Framework Agêntico
            </strong>
         </p>
         <p class="p1">
            <strong>
               Opção A: Fluxos manuais (um colaborador aciona cada estágio)
            </strong>
            <br>
            Pró: Controle total, sem risco de automação errada
            <br>
            Contra: Não escala, erro humano, gargalo operacional
         </p>
         <p class="p1">
            <strong>
               Opção B: Framework agêntico orquestrando os marcos automaticamente
            </strong>
            <br>
            Pró: Escalabilidade infinita, zero erro humano, velocidade
            <br>
            Contra: Complexidade inicial, depuração difícil, rigidez
         </p>
         <p class="p1">
            <strong>
               Tradeoff Escolhido:
            </strong>
            Automação agêntica com LangChain/OpenAI
            <br>
            <strong>
               Motivo:
            </strong>
            O ciclo Quote-to-Cash possui 7 estágios sequenciais (Orçamento → Contrato → Faturamento → Requisitos → Protótipo → Manual → Transferência), cada um com 3 a 6 subações. O sistema agêntico detecta a conclusão do marco (ex: webhook de "contrato assinado") → dispara automaticamente o próximo estágio (criar cobrança no Asaas + agendar notas fiscais + notificar cliente + criar perfil de Requisitos no Notion).
            <br>
            <strong>
               Impacto:
            </strong>
            Mais de 10h semanais recuperadas eliminando o trabalho manual. Redução de 27% no tempo administrativo total. O tempo desde o orçamento aceito até a primeira entrega caiu de 18 dias para 5,3 dias.
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box">
               <pre>
                     <code class="language-javascript">
export const handler = async(event) = >{
  const body = JSON.parse(event.body);
  if (body.event === "contract_signed") {
    await orchestrateNextMilestone(body.projectId);
    return {
      statusCode: 200,
      body: "Pipeline state updated seamlessly."
    };
  }
};</code>
               </pre>
            </div>
            <p class="case-caption">
               Ouvinte (listener) de webhook assíncrono e serverless interceptando tokens de execução de APIs de terceiros por meio de escopos seguros de execução em tempo de execução.
            </p>
         </div>
         <h3>
            Solução Final
         </h3>
         <p class="p1">
            <strong>
               Arquitetura Técnica:
            </strong>
            <br>
            - Fonte Única da Verdade: Notion (7 bancos de dados relacionais com 47 propriedades personalizadas)
            <br>
            - Frontend: Aplicativo PWA mobile-first com renderização condicional orientada a estados
            <br>
            - Backend Serverless: Node.js (12 módulos) — crypto.js (criptografia de UUID), webhooks, sincronização bidirecional
            <br>
            - Automação Agêntica: LangChain/OpenAI orquestrando os marcos de Quote-to-Cash
            <br>
            - Assinatura Eletrônica: API da Clicksign (geração automática de contratos legais)
            <br>
            - Pagamentos: API da Fintech Asaas (cobrança parcelada, notas fiscais automatizadas)
            <br>
            - Comunicação: 17 fluxos transacionais multicanais orientados a eventos (push + e-mail)
            <br>
            - DesignOps: Biblioteca de componentes multiestados (Hibernate, Action Required, Fallback)
         </p>
         <p class="p1">
            <strong>
               Fluxo Automatizado de Quote-to-Cash:
            </strong>
            <br>
            1.
            <strong>
               Orçamento Criptografado:
            </strong>
            Gera um UUID exclusivo → calcula a fórmula → crypto.js criptografa valores sensíveis → URL não indexável
            <br>
            2.
            <strong>
               Aceite Inteligente:
            </strong>
            O cliente preenche os dados → webhook aciona o framework agêntico → gera automaticamente o contrato na Clicksign
            <br>
            3.
            <strong>
               Orquestração de Marcos:
            </strong>
            Assinatura detectada → sistema cria cobrança no Asaas → agenda notas fiscais → cria perfil no Notion → notificação ao cliente
            <br>
            4.
            <strong>
               Agendamento com String Absoluta:
            </strong>
            Cliente agenda reunião → regra agnóstica de fuso horário → horizonte de 60 dias evita faltas (no-shows)
            <br>
            5.
            <strong>
               Entregas sem Latência:
            </strong>
            Sistema baixa o PDF do Notion → upload privado → gera URL autenticada de 24h → notificação push contextual
            <br>
            6.
            <strong>
               Aprovação Orientada a Eventos:
            </strong>
            Cliente aprova → registro de timestamp → dispara o próximo marco → componente de UI faz a transição de estado
            <br>
            7.
            <strong>
               Transferência e Pós-Venda:
            </strong>
            Solicitação → aguarda 10 dias contratuais → sistema cria o perfil de Garantia → lembretes automáticos 14 dias antes do vencimento
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="pt_assets/cases/holofante/5.avif" alt="Aplicativo móvel com painel do projeto">
            </div>
            <p class="case-caption">
               Descrição: Uma captura de tela de interface de smartphone exibindo um portal do cliente móvel acompanhando as entregas do projeto ("Entregáveis"). Mostra um "Documento de Requisitos" marcado como revisado e aprovado com um botão de download, enquanto os itens subsequentes, como o protótipo, permanecem em desenvolvimento.
            </p>
         </div>
         <h3>
            Resultados e Impacto
         </h3>
         <p class="p1">
            <strong>
               Métricas Quantitativas (6 meses pós-implementação):
            </strong>
            <br>
            - Trabalho manual: redução de 27%, mais de 10h semanais recuperadas via automação Q2C
            <br>
            - Consistência de UI: 100% em mais de 8 marcos de projeto via framework de DesignOps
            <br>
            - Capacidade de atendimento: de 3 para 12 projetos simultâneos — aumento de 300%
            <br>
            - Ciclos de entrega: de 18 dias para 5,3 dias (orçamento → primeira entrega)
            <br>
            - Privacidade: Zero vazamentos de dados em 10 meses (UUID + crypto.js)
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="pt_assets/cases/holofante/graph.avif" alt="Crescimento do ciclo Q2C via DaaS (Design como Serviço)">
            </div>
            <p class="case-caption">
               Descrição: Um gráfico de barras horizontais limpo intitulado "Aceleração do Ciclo Quote-to-Cash", comparando a eficiência do processo em dias. Demonstra que um processo automatizado leva 5,3 dias em comparação com 18 dias para um processo manual, resultando em uma redução de tempo de 70,6%.
            </p>
         </div>
         <p class="p1">
            <strong>
               Feedback Qualitativo:
            </strong>
            <br>
            <em>
               "Nunca vi uma consultoria tão organizada. Sei exatamente em que estágio está sem precisar perguntar."
            </em>
            — Cliente B2B, Educação
            <br>
            <em>
               "O detalhamento transparente de preços me ajudou a justificá-lo internamente. Não parece uma 'caixa preta'."
            </em>
            — Cliente B2B, 35 funcionários
            <br>
            <em>
               "Recebo uma notificação sempre que há uma atualização. Sinto como se houvesse uma equipe inteira cuidando disso."
            </em>
            — Cliente B2C, Profissional Liberal
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="pt_assets/cases/holofante/6.avif" alt="Fluxo de assinatura de contrato da Clicksign">
            </div>
            <p class="case-caption">
               Descrição: Uma captura de tela de navegador desktop da plataforma de assinatura eletrônica Clicksign. A página exibe um registro de auditoria e uma linha do tempo de eventos detalhando a criação, assinatura e conclusão automática de um documento digital em janeiro de 2026.
            </p>
         </div>
         <h3>
            Aprendizados e Reflexões
         </h3>
         <p class="p1">
            <strong>
               O que funcionou:
            </strong>
         </p>
         <p class="p1">
            <strong>
               1. DesignOps como investimento, não sobrecarga:
            </strong>
            O framework de componentes multiestados (Hibernate, Action Required, Fallback) pareceu uma engenharia excessiva inicial, mas garantiu 100% de consistência em escala. O tempo de desenvolvimento de novos recursos caiu em 60%.
         </p>
         <p class="p1">
            <strong>
               2. Renderização Condicional = UX sem latência:
            </strong>
            Transformar estados complexos de backend em uma UI contextual foi a chave. O cliente vê a interface reagir em menos de 2 segundos, criando uma sensação "mágica" citada por 91% dos usuários.
         </p>
         <p class="p1">
            <strong>
               3. UUID + criptografia desacoplaram privacidade e transparência:
            </strong>
            O framework de governança permitiu mostrar o detalhamento de preços (conversão de +97%) enquanto protegia os dados contra crawlers. Conformidade com a LGPD sem sacrificar a UX.
         </p>
         <p class="p1">
            <strong>
               O que eu faria diferente:
            </strong>
         </p>
         <p class="p1">
            <strong>
               1. O framework agêntico exigiu logs extensivos:
            </strong>
            Orquestrar marcos com LangChain foi poderoso, mas depurar condições de corrida (race conditions) consumiu 40% do tempo inicial. Um registro de eventos aprimorado economizou incontáveis horas de solução de problemas.
         </p>
         <p class="p1">
            <strong>
               2. Feature flags desde a v1:
            </strong>
            Sem feature flags, precisei implantar hotfixes às pressas. Próxima versão: chaves seletoras (toggles) para desativar recursos sem a necessidade de um novo deploy.
         </p>
         <p class="p1">
            <strong>
               Principal aprendizado sobre automação agêntica em serviços:
            </strong>
            A orquestração do Quote-to-Cash com LangChain/OpenAI provou que a inteligência artificial não serve apenas para chatbots — ela pode automatizar fluxos de trabalho B2B complexos. Não substituiu o designer; amplificou a capacidade, liberando mais de 10h semanais para conversas estratégicas.
         </p>
         <p class="p1">
            <strong>
               Próximos passos:
            </strong>
            Com a capacidade operacional comprovada (12 projetos simultâneos), la próxima meta é testar o limite para até 18-20 projetos. O sistema atual é a base para um SaaS de gestão white-label para outras consultorias de design.
         </p>
        `,
        credits: ["Lio Schimanko"],
        videoSrc: "pt_assets/videos/holofante.mp4",
        vttSrc: "pt_assets/subtitles/holofante.vtt",
        frameSrc: "pt_assets/frames/holofante.avif",
        thumbSrc:"pt_assets/thumbs/holofante.avif",
        deviceClass: "iphone-17",
    },
    {
        logoUrl:"pt_assets/logos/holofante/logo.jpeg",
        id: "case-02",
        title: "Fazendo um e-reader",
        year: "2025 ∙ Testamentus.org",
        liveUrl: "https://testamentus.org/",
        repositoryUrl: "https://github.com/schimanko/testamentus.org", 
        desc: `
        <p class="p1">
            <strong>
               Contexto:
            </strong>
            As plataformas digitais da Bíblia existentes priorizam a monetização em detrimento da experiência do usuário. 
            A análise de 8 dos principais concorrentes revelou um padrão problemático: anúncios intrusivos 
            interrompendo a leitura espiritual, tempos de carregamento de 5 a 12 segundos em dispositivos móveis 
            e interfaces sobrecarregadas comprometendo a concentração.
         </p>
         <div class="impact-dashboard">
            <div class="metric-card">
               <span class="metric-value">
                     +143%
               </span>
               <span class="metric-label">
                     Aumento na duração média da sessão
               </span>
            </div>
            <div class="metric-card">
               <span class="metric-value">
                     US$ 5/mês
               </span>
               <span class="metric-label">
                     Custo fixo para infraestrutura escalável
               </span>
            </div>
            <div class="metric-card">
               <span class="metric-value">
                     0,9s
               </span>
               <span class="metric-label">
                     Desempenho FCP (100/100 PageSpeed)
               </span>
            </div>
            <div class="metric-card">
               <span class="metric-value">
                     92/100
               </span>
               <span class="metric-label">
                     Conformidade de Acessibilidade WCAG AA
               </span>
            </div>
         </div>
         <h3>
            Desafio de Negócio e de Produto
         </h3>
         <p class="p1">
            <strong>
               Problema Central:
            </strong>
            Como criar uma plataforma da Bíblia que respeite a sacralidade do conteúdo 
            por meio de um design focado, desempenho excepcional e ausência total de monetização?
         </p>
         <p class="p1">
            <strong>
               Restrições:
            </strong>
            <br>
            - Zero orçamento — projeto pessoal sem investimento
            <br>
            - Servidor compartilhado (512MB de RAM, recursos limitados)
            <br>
            - Suporte a mais de 40 idiomas globalmente sem CDN paga
            <br>
            - Mantenedor solo — arquitetura sustentável a longo prazo
            <br>
            - Compromisso: sem anúncios, sem doações, sem paywall
         </p>
         <p class="p1">
            <strong>
               Objetivos Mensuráveis:
            </strong>
            <br>
            - First Contentful Paint &lt; 1,5s (vs ~5s de benchmark da indústria)
            <br>
            - Conformidade WCAG AA (pontuação &gt; 90/100)
            <br>
            - Taxa de conclusão &gt; 85% (vs ~75% de benchmark)
            <br>
            - Duração da sessão &gt; 5 min (vs ~3,5 min de benchmark)
         </p>
         <p class="p1">
            <strong>
               Membros do Projeto:
            </strong>
            Lio Schimanko
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="pt_assets/cases/testamentus/1.avif" alt="Diagrama do ciclo Lean UX">
            </div>
            <p class="case-caption">
               Metodologia Lean UX — ciclos rápidos de validação em vez de especificações extensas.
            </p>
         </div>
         <h3>
            Pesquisa e Descoberta
         </h3>
         <p class="p1">
            <strong>
               Métodos Utilizados:
            </strong>
            <br>
            - Análise competitiva de 8 plataformas com heurísticas de Nielsen + benchmarks do PageSpeed
            <br>
            - 12 entrevistas em profundidade (pastores, educadores, estudiosos, leitores casuais)
            <br>
            - Testes comparativos: 6 usuários realizando tarefas idênticas em 3 concorrentes
         </p>
         <p class="p1">
            <strong>
               Pesquisa e Design:
            </strong>
            Figma, Heurísticas de Nielsen, Testes de Usabilidade Moderados, Acessibilidade (WCAG AA)
            <br>
            <strong>
               Engenharia de Desempenho:
            </strong>
            PHP, MySQL (Geração Estática), Vanilla JS, LocalStorage, Busca Full-text
            <br>
            <strong>
               Métricas e Validação:
            </strong>
            Lean UX (Construir-Medir-Aprender), Google PageSpeed Insights, Lighthouse
         </p>
         <p class="p1">
            <strong>
               Principais Insights:
            </strong>
         </p>
         <p class="p1">
            <strong>
               1. Anúncios destroem a reverência:
            </strong>
            100% citaram os anúncios como "desrespeitosos com o conteúdo sagrado". Os usuários desenvolveram uma cegueira de banner (banner blindness) extrema.
         </p>
         <p class="p1">
            <strong>
               2. Desempenho = respeito:
            </strong>
            Carregamentos &gt; 3s levaram a 58% de abandono no mobile. Descoberta: os usuários interpretavam a lentidão como falta de cuidado, não como uma limitação técnica.
         </p>
         <p class="p1">
            <strong>
               3. Simplicidade = foco:
            </strong>
            89% nunca usaram recursos "avançados". Uso real: (1) leitura sequencial, (2) busca de versículos, (3) alternância de traduções.
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="pt_assets/cases/testamentus/2.avif" alt="Personas: Pastor Davi, Maria Santos, Samuel">
            </div>
            <p class="case-caption">
               Personas — velocidade vs. profundidade vs. acessibilidade.
            </p>
         </div>
         <h3>
            Processo de Design e Decisões Críticas
         </h3>
         <p class="p1">
            <strong>
               Decisão Crítica nº 1: Geração Estática vs. Aplicativo Dinâmico
            </strong>
         </p>
         <p class="p1">
            <strong>
               Opção A: PHP Dinâmico (geração de HTML por requisição)
            </strong>
            <br>
            Pró: Flexibilidade, recursos complexos (login, favoritos na nuvem)
            <br>
            Contra: Carregamento de 2-4s, alto consumo de RAM, custo de servidor mais elevado
         </p>
         <p class="p1">
            <strong>
               Opção B: Geração estática (MySQL → HTML pré-renderizado)
            </strong>
            <br>
            Pró: Desempenho de 0,1-0,3s, RAM mínima, escalabilidade horizontal
            <br>
            Contra: Sem recursos dinâmicos (login impossível)
         </p>
         <p class="p1">
            <strong>
               Tradeoff Escolhido:
            </strong>
            Estático + JavaScript no lado do cliente
            <br>
            <strong>
               Motivo:
            </strong>
            94% preferiram a simplicidade em vez de criar uma conta. O script converte 31 mil versículos em cerca de 1.200 páginas HTML por versão da Bíblia. O JS no lado do cliente lida com a busca e os favoritos sem chamadas ao servidor.
            <br>
            <strong>
               Impacto:
            </strong>
            FCP de 0,9s (vs ~4,2s no dinâmico) — melhoria de 367%. O servidor suporta mais de 10.000 requisições simultâneas por segundo (req/s).
         </p>
         <p class="p1">
            <strong>
               Decisão Crítica nº 2: Times New Roman vs. Sans-Serif Moderna
            </strong>
         </p>
         <p class="p1">
            <strong>
               Opção A: Serifa Clássica (Times New Roman)
            </strong>
            <br>
            Pró: Tradição bíblica, legibilidade de textos longos, zero custo (web-safe)
            <br>
            Contra: Percepção de "antiquado"
         </p>
         <p class="p1">
            <strong>
               Opção B: Sans-serif (Inter via Google Fonts)
            </strong>
            <br>
            Pró: Moderno, contraste limpo em telas
            <br>
            Contra: 20-40KB extras, dependência de CDN
         </p>
         <p class="p1">
            <strong>
               Tradeoff Escolhido:
            </strong>
            Times para o leitor + Arial para a UI
            <br>
            <strong>
               Motivo:
            </strong>
            Usuários com mais de 55 anos associavam a fonte Times com a "Bíblia real".
            <br>
            <strong>
               Impacto:
            </strong>
            Satisfação do público 55+: 9,2/10. Zero bytes de web fonts.
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="pt_assets/cases/testamentus/sketch.avif" alt="Esboço de baixa fidelidade (low-fi) da funcionalidade de Compartilhamento Social">
            </div>
            <p class="case-caption">
               Esboço de baixa fidelidade (low-fi) da funcionalidade de Compartilhamento Social.
            </p>
         </div>
         <p class="p1">
            <strong>
               Decisão Crítica nº 3: Compartilhamento de URL vs. Geração de Imagem
            </strong>
         </p>
         <p class="p1">
            <strong>
               Opção A: Link direto para o versículo
            </strong>
            <br>
            Pró: Trivial, amigável para SEO (SEO-friendly)
            <br>
            Contra: Baixo engajamento social (link genérico)
         </p>
         <p class="p1">
            <strong>
               Opção B: Imagem PNG com o versículo (PHP GD)
            </strong>
            <br>
            Pró: Viral nas redes sociais, branding
            <br>
            Contra: Complexidade técnica, consumo do servidor
         </p>
         <p class="p1">
            <strong>
               Tradeoff Escolhido:
            </strong>
            Ambos — URL + botão "Compartilhar como Imagem"
            <br>
            <strong>
               Motivo:
            </strong>
            O compartilhamento acadêmico prefere links; o social prefere imagens.
            <br>
            <strong>
               Impacto:
            </strong>
            68% usam imagens, 32% usam a URL.
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="pt_assets/cases/testamentus/3.avif" alt="Menu de compartilhamento e imagem gerada">
            </div>
            <p class="case-caption">
               Sistema duplo — URL para context, imagem para viralização.
            </p>
         </div>
         <p class="p1">
            <strong>
               Decisão Crítica nº 4: Favoritos com Login vs. localStorage Local
            </strong>
         </p>
         <p class="p1">
            <strong>
               Opção A: Login + sincronização entre dispositivos
            </strong>
            <br>
            Pró: Acesso em múltiplos dispositivos, backup automático
            <br>
            Contra: Quebra a simplicidade, exige infraestrutura (autenticação, LGPD), fricção de cadastro
         </p>
         <p class="p1">
            <strong>
               Opção B: localStorage puro (dados no navegador)
            </strong>
            <br>
            Pró: Zero fricção, privacidade total, implementação trivial
            <br>
            Contra: Sem sincronização, perda se o cache for limpo
         </p>
         <p class="p1">
            <strong>
               Tradeoff Escolhido:
            </strong>
            localStorage + exportação/importação manual de JSON
            <br>
            <strong>
               Motivo:
            </strong>
            80% usam um único dispositivo.
            <br>
            <strong>
               Impacto:
            </strong>
            73% usam os favoritos (vs ~20% em plataformas com login).
         </p>
         <h3>
            Solução Final
         </h3>
         <p class="p1">
            <strong>
               Arquitetura Técnica:
            </strong>
            <br>
            - Script PHP: MySQL (40 idiomas, 31.102 versículos) → 1.200 páginas HTML estáticas
            <br>
            - Frontend: HTML5 + CSS3 (18KB) + Vanilla JS (12KB) — zero dependências
            <br>
            - Busca: PHP + MySQL FULLTEXT com cache
            <br>
            - Persistência: localStorage + exportação JSON
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="pt_assets/cases/testamentus/4.avif" alt="PageSpeed 100/100: FCP 0,9s, LCP 1,1s">
            </div>
            <p class="case-caption">
               Desempenho — 100/100 no mobile, 80% mais rápido que o benchmark.
            </p>
         </div>
         <h3>
            Resultados e Impacto
         </h3>
         <p class="p1">
            <strong>
               Métricas Quantitativas (6 meses):
            </strong>
            <br>
            - Desempenho mobile: 100/100, FCP 0,9s (vs ~5s da indústria) — 456% mais rápido
            <br>
            - Acessibilidade: 92/100 WCAG AA
            <br>
            - Conclusão de tarefas: 92% (vs 75%)
            <br>
            - Duração da sessão: 8,5 min (vs 3,5 min) — +143%
            <br>
            - Taxa de rejeição: 15% (vs 45%)
            <br>
            - Usuários recorrentes: 67% retornam em 7 dias
            <br>
            - Custo: US$ 5/mês para hospedagem compartilhada (vs $50-200 para infraestruturas otimizadas para desempenho)
         </p>
         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="pt_assets/cases/testamentus/5.avif" alt="Mobile em Modo Escuro e Menu de Acessibilidade">
            </div>
            <p class="case-caption">
               Navegação com recursos de acessibilidade.
            </p>
         </div>
         <h3>
            Aprendizados e Reflexões
         </h3>
         <p class="p1">
            <strong>
               O que funcionou:
            </strong>
         </p>
         <p class="p1">
            <strong>
               1. Desempenho como funcionalidade:
            </strong>
            Tratar a velocidade como um requisito funcional desde os wireframes evitou retrabalho.
         </p>
         <p class="p1">
            <strong>
               2. A validação economizou meses:
            </strong>
            A hipótese de que "os usuários precisam de login" foi invalidada em 2 dias — economizando cerca de 80h de desenvolvimento.
         </p>
         <p class="p1">
            <strong>
               3. Simplicidade radical:
            </strong>
            Ir contra a tendência de recursos infinitos gerou fidelização.
         </p>
         <p class="p1">
            <strong>
               O que eu faria diferente:
            </strong>
         </p>
         <p class="p1">
            <strong>
               1. Testes de acessibilidade (A11y) com usuários reais desde o início:
            </strong>
            Confiei em validadores automáticos. Problemas simples (rótulos, ordem de tabulação) foram detectados tardiamente.
         </p>
         <p class="p1">
            <strong>
               2. Registros de Decisão de Arquitetura (ADRs):
            </strong>
            Documentei as decisões apenas no final. Quase me esqueci dos tradeoffs ao considerar novos recursos.
         </p>
         <p class="p1">
            <strong>
               3. Planejado a internacionalização (i18n) desde a v1:
            </strong>
            Refatorei cerca de 60% dos templates para tradução completa.
         </p>
         <p class="p1">
            <strong>
               Principal aprendizado:
            </strong>
            UCD (Design Centrado no Usuário) significa <strong>remover fricção</strong>. O designer como "defensor do usuário" = dizer "não" para 90% das ideias.
         </p>
        `,
        credits: ["Lio Schimanko"],
        videoSrc: "pt_assets/videos/testamentus.mp4",
        vttSrc: "pt_assets/subtitles/testamentus.vtt",
        frameSrc: "pt_assets/frames/holofante.avif",
        thumbSrc:"pt_assets/thumbs/testamentus.avif",
        deviceClass: "iphone-17",
        customGap: "0px",
    },
    {
        logoUrl:"pt_assets/logos/cassi.jpeg",
        id: "case-03",
        year: "2023 ∙ CASSI",
        title: "UX Vestível",
        desc: `
         <p class="p1">
         <strong>Nota sobre a natureza experimental:</strong> Este é um design experimental e uma prova de conceito. Não foi implementado em produção, portanto, não possui impacto real mensurado. O projeto demonstra a aplicação das Diretrizes de Interface Humana da Apple (Apple HIG) para o watchOS 10 em um contexto de saúde.
         </p>

         <div class="impact-dashboard">
            <div class="metric-card">
               <span class="metric-value">2 Recursos</span>
               <span class="metric-label">Principais focados em retenção e brevidade</span>
            </div>
            <div class="metric-card">
               <span class="metric-value">1 Gesto</span>
               <span class="metric-label">Acesso de emergência via Apple Wallet</span>
            </div>
            <div class="metric-card">
               <span class="metric-value">&lt; 3s</span>
               <span class="metric-label">Tempo de compreensão (Glanceability / Leitura rápida)</span>
            </div>
            <div class="metric-card">
               <span class="metric-value">100%</span>
               <span class="metric-label">Conformidade com a Apple HIG</span>
            </div>
         </div>

         <h3>Desafio de Design</h3>

         <p class="p1">
         Com base em projetos desenvolvidos na CASSI, identificar quais recursos do aplicativo móvel agregariam o máximo de valor em um contexto de wearable. Restrições: tela de 40-45mm, interações &lt; 5s, glanceability.
         </p>

         <p class="p1">
         <strong>Problema Central:</strong> Como adaptar recursos críticos de um plano de saúde (visualização de autorizações, carteirinha de emergência) para uma interface de wearable com interações de menos de 5 segundos?
         </p>

         <p class="p1">
         <strong>Restrições da Plataforma:</strong><br>
         - Tela limitada: 324×394px ou 368×448px<br>
         - Interações breves: os usuários consultam em movimento<br>
         - Hierarquia de informações críticas: no máximo 3-5 pontos de dados por tela<br>
         - Conformidade com a Apple HIG do watchOS 9
         </p>

         <p class="p1"><strong>Membros do Projeto:</strong> Lio Schimanko, Illa Penha, Felipe Pires & Luís Aragão</p>

         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="pt_assets/cases/watch/2.avif" alt="Visualização de autorização médica">
            </div>
            <p class="case-caption">Visualização de autorização médica — informações críticas priorizadas para uma leitura rápida (glanceability) de &lt; 3s.</p>
         </div>

         <h3>Pesquisa e Decisões de Design</h3>

         <p class="p1">
         <strong>Métodos Utilizados:</strong><br>
         - Análise de projetos anteriores da CASSI<br>
         - Identificação dos recursos móveis mais acessados (analytics interno)<br>
         - Mapeamento de fluxo de usuário para wearables<br>
         - Estudo das Diretrizes de Interface Humana (HIG) do Apple watchOS 10
         </p>

         <p class="p1">
         <strong>Design e Prototipagem:</strong> Figma, Apple watchOS UI Kit, Tipografia SF Compact<br>
         <strong>Ecossistema e Conformidade:</strong> Apple HIG, integração com Apple Wallet (PassKit)<br>
         <strong>Estratégia de Produto:</strong> Tradução do Mobile para Wearable
         </p>

         <p class="p1">
         <strong>Decisão Crítica nº 1: Quais recursos portar?</strong>
         </p>

         <p class="p1">
         <strong>Tradeoff Escolhido:</strong> 2 recursos principais (autorizações + carteirinha de emergência)<br>
         <strong>Motivo:</strong> A análise mostrou que as autorizações (monitoramento de despesas) e as carteirinhas de emergência são os casos de uso mais críticos. Autorizações = uso diário passivo; carteirinha = uso ativo de emergência.<br>
         <strong>Impacto:</strong> Alinhado com a filosofia da Apple de simplicidade radical.
         </p>

         <p class="p1">
         <strong>Decisão Crítica nº 2: Hierarquia de Informações nas Autorizações</strong>
         </p>

         <p class="p1">
         <strong>Tradeoff Escolhido:</strong> Lista espaçada com hierarquia visual radical<br>
         <strong>Motivo:</strong> Os usuários consultam enquanto caminham ou esperam. Foram priorizados 3 pontos de dados críticos: (1) Tipo de procedimento, (2) Valor e (3) Data recente.<br>
         <strong>Impacto:</strong> Glanceability (leitura rápida) de &lt; 3s.
         </p>

         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="pt_assets/cases/watch/1.avif" alt="Carteirinha de emergência na Apple Wallet">
            </div>
            <p class="case-caption">Carteirinha de emergência — integração com a Apple Wallet para compartilhamento instantâneo via AirDrop/Mensagens.</p>
         </div>

         <p class="p1">
         <strong>Decisão Crítica nº 3: Acesso à Carteirinha — Aplicativo Nativo vs. Apple Wallet</strong>
         </p>

         <p class="p1">
         <strong>Tradeoff Escolhido:</strong> Duplo — carteirinha no app + botão "Adicionar à Wallet"<br>
         <strong>Motivo:</strong> O uso em emergências exige velocidade máxima. A Apple Wallet permite o acesso em apenas 1 gesto (clique duplo no botão lateral), mesmo com o dispositivo bloqueado.<br>
         <strong>Impacto:</strong> Velocidade &gt; Branding em situações de emergência de saúde.
         </p>

         <h3>Solução de Design</h3>

         <p class="p1">
         <strong>Arquitetura de Informação:</strong><br>
         1. <strong>Lista de Autorizações:</strong> Cards espaçados com tipo/valor/data<br>
         2. <strong>Detalhes da Autorização:</strong> Nome do prestador, endereço, código ANS<br>
         3. <strong>Carteirinha:</strong> QR code + dados essenciais<br>
         4. <strong>Passe da Apple Wallet:</strong> Acesso instantâneo com clique duplo
         </p>

         <h3>Aprendizados de Design</h3>

         <p class="p1">
         <strong>1. Menos é mais em wearables:</strong> Portar apenas 2 recursos seguiu a filosofia da HIG. Cada tela adicional representa uma fricção exponencial.
         </p>

         <p class="p1">
         <strong>2. A hierarquia visual garante a glanceability:</strong> O uso da fonte SF Compact Display Bold para os valores permitiu a compreensão em &lt; 3s.
         </p>

         <p class="p1">
         <strong>3. Integração nativa &gt; customização:</strong> A Apple Wallet sacrificou o branding, mas ganhou uma velocidade que pode salvar vidas.
         </p>

         <p class="p1">
         <strong>Principal aprendizado sobre design de wearables para a saúde:</strong> Informações críticas em contextos de estresse ou movimento devem ser de <strong>leitura rápida (glanceable)</strong> e <strong>acionáveis</strong>. Isso exige sacrificar a densidade de dados em prol de uma simplicidade radical.
         </p>
        `,
        credits: ["Lio Schimanko", "Illa Penha", "Felipe Pires", "Luís Aragão"],
        videoSrc: "pt_assets/videos/cassiwatch.mp4",
        vttSrc: "pt_assets/subtitles/cassiwatch.vtt",
        thumbSrc:"pt_assets/thumbs/cassiwatch.avif",
        deviceClass: "apple-watch",
        customGap: "0px",
    },
    {
        logoUrl:"pt_assets/logos/cassi.jpeg",
        id: "case-04",
        year: "2022 ∙ CASSI",
        title: "Redesign de R$2.5 mi",
        desc: `
         <p class="p1">
         <strong>Nota de NDA:</strong> Este projeto é protegido por acordos de conformidade e confidencialidade (NDA). Fluxos completos, pesquisas detalhadas e descobertas sensíveis não podem ser exibidos. O case apresenta uma visão geral simplificada com foco em métodos, decisões de design e resultados públicos do Relatório Anual de 2022.
         </p>

         <div class="impact-dashboard">
            <div class="metric-card">
               <span class="metric-value">R$2.5 milhões</span>
               <span class="metric-label">Economia anual em despesas evitadas</span>
            </div>
            <div class="metric-card">
               <span class="metric-value">13.000</span>
               <span class="metric-label">Autorizações contestadas proativamente</span>
            </div>
            <div class="metric-card">
               <span class="metric-value">15s</span>
               <span class="metric-label">Tempo de busca (reduzido de 3 min)</span>
            </div>
            <div class="metric-card">
               <span class="metric-value">30.000</span>
               <span class="metric-label">Procedimentos não reconhecidos</span>
            </div>
         </div>

         <h3>Desafio de Negócio</h3>

         <p class="p1">
         Desenvolver um software para contestação de autorizações médicas não reconhecidas com uma interface intuitiva para web, iOS e Android. Problema sistêmico: os prestadores estavam enviando autorizações indevidas, gerando despesas não reconhecidas para os usuários e dificuldades no controle financeiro institucional.
         </p>

         <p class="p1">
         <strong>Problema Central:</strong> Como capacitar 229.000 usuários móveis (29% os 792.000 participantes) a contestarem autorizações indevidas, reduzindo despesas de saúde e melhorando a transparência?
         </p>

         <p class="p1">
         <strong>Restrições:</strong><br>
         - A ANS (Agência Nacional de Saúde Suplementar) exige mais de 20 itens obrigatórios no extrato do procedimento<br>
         - Interface legada confusa e sem hierarquia visual<br>
         - Fluxo de contestação inexistente — zero controle do usuário<br>
         - Conformidade com a LGPD para dados sensíveis de saúde<br>
         - Equipe multidisciplinar: 8 pessoas (4 UX Research, 4 UI Design)
         </p>

         <p class="p1">
         <strong>Objetivos Mensuráveis:</strong><br>
         - Reduzir despesas indevidas com saúde por meio de contestações dos usuários<br>
         - Melhorar as avaliações nas lojas de aplicativos (engajamento pós-atualização)<br>
         - Garantir a conformidade com a ANS com uma UX otimizada<br>
         - Criar uma matriz de qualidade de prestadores com base nos dados de contestação
         </p>

         <p class="p1"><strong>Membros do Projeto:</strong> Lio Schimanko, Illa Penha, Felipe Pires, Luís Aragão, Marcelo Megale, Carina Lopes, Jordana Leijoto </p>

         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="pt_assets/cases/consulta/1.avif" alt="Matriz CSD">
            </div>
            <p class="case-caption">Pesquisa e descobertas completas protegidas por conformidade — exibindo apenas a matriz CSD simplificada.</p>
         </div>

         <h3>Pesquisa e Descoberta</h3>

         <p class="p1">
         <strong>Métodos utilizados:</strong><br>
         - Entrevistas com usuários (participantes da CASSI)<br>
         - Análise competitiva de aplicativos de saúde (planos concorrentes)<br>
         - Matriz de Funcionalidades e Matriz CSD<br>
         - Metodologia "How Might We" (Como Poderíamos) para identificação de oportunidades<br>
         - Mapas de Empatia e de Humor, Personas<br>
         - Fluxo do Usuário com Pontos de Contato, Pontos de Dor e Oportunidades<br>
         - Discussões com pontos focais da ANS (requisitos regulatórios)<br>
         - Entrevistas com stakeholders internos (gestão de relacionamento com prestadores)
         </p>

         <p class="p1">
         <strong>Pesquisa e Descoberta:</strong> FigJam, Matriz CSD, Entrevistas em Profundidade, Mapa de Empatia<br>
         <strong>Design e Handoff:</strong> Figma, Design System Institucional, Prototipagem de Alta Fidelidade<br>
         <strong>Analytics e Conformidade:</strong> Hotjar, Google Analytics, Regulamentação da ANS, LGPD
         </p>

         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="pt_assets/cases/consulta/sketch.avif" alt="Esboço de baixa fidelidade (low-fi)">
            </div>
            <p class="case-caption">Pesquisa e descobertas completas protegidas por conformidade — exibindo apenas o low-fi simplificado.</p>
         </div>

         <p class="p1">
         <strong>Principais Insights:</strong>
         </p>

         <p class="p1">
         <strong>1. Problema Sistêmico Bilateral:</strong> A pesquisa revelou que o problema ia além da UX — os prestadores estavam enviando autorizações indevidas sem penalidades. A solução precisava abordar dois lados: (1) capacitar o usuário para contestar, (2) criar incentivos para os prestadores evitarem autorizações incorretas.
         </p>

         <p class="p1">
         <strong>2. Extrato Confuso Impedia a Identificação Rápida:</strong> A interface antiga exibia mais de 20 itens da ANS sem hierarquia em uma lista densa e sem espaço em branco. Os usuários levavam minutos para encontrar dados relevantes (nome do procedimento, data, prestador). Conversas com a ANS esclareceram: a exibição dos mais de 20 itens é obrigatória, mas a <em>ordem e a hierarquia são flexíveis</em> — nos dando liberdade para um redesign.
         </p>

         <p class="p1">
         <strong>3. Filtragem Temporal Inexistente:</strong> A visualização de autorizações de meses anteriores era longa e confusa, sem demarcações visuais separando os períodos. Os usuários se perdiam em uma rolagem infinita sem contexto temporal.
         </p>

         <p class="p1">
         <strong>4. A Troca de Usuário Dependente Exigia Logout:</strong> Nos planos familiares, o titular ("pai/mãe") precisava fazer logout e login novamente como dependente ("filho/a") para ver suas autorizações. Essa grande fricção foi citada em 100% das entrevistas com os titulares.
         </p>

         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="pt_assets/cases/consulta/3.avif" alt="Tela de consulta antes e depois">
            </div>
            <p class="case-caption">Antes e depois (v1) — a hierarquia visual e o espaço em branco melhoraram significativamente a legibilidade.</p>
         </div>

         <h3>Processo de Design e Decisões Críticas</h3>

         <p class="p1">
         <strong>Estratégia de Trabalho:</strong> Dividimos a equipe: metade pesquisou os requisitos da ANS e as interações com os prestadores, enquanto a outra metade começou a projetar com base nas descobertas iniciais. O trabalho paralelo acelerou a entrega, permitindo iterações contínuas à medida que a pesquisa avançava.
         </p>

         <p class="p1">
         <strong>Decisão Crítica nº 1: Hierarquia Visual vs. Lista Densa da ANS</strong>
         </p>

         <p class="p1">
         <strong>Opção A: Manter a lista densa (mais de 20 itens visíveis simultaneamente)</strong><br>
         Pró: Conformidade garantida com a ANS, zero risco regulatório<br>
         Contra: Sobrecarga cognitiva, baixa usabilidade, alto tempo de busca
         </p>

         <p class="p1">
         <strong>Opção B: Reorganizar em categorias hierárquicas (consultas, exames, acompanhamentos)</strong><br>
         Pró: Escaneabilidade, legibilidade, localização rápida<br>
         Contra: Risco de interpretação incorreta das regulamentações da ANS
         </p>

         <p class="p1">
         <strong>Tradeoff Escolhido:</strong> Hierarquia visual categórica com todos os mais de 20 itens preservados<br>
         <strong>Motivo:</strong> A validação com os pontos focais da ANS confirmou: os itens são obrigatórios, mas a ordem é livre. Criamos uma estrutura hierárquica — categorias colapsáveis (Consultas, Exames, Acompanhamentos) com dados prioritários destacados (nome do procedimento, prestador, data). Os usuários escaneiam rapidamente, expandem a categoria relevante e veem todos os itens da ANS.<br>
         <strong>Impacto:</strong> O tempo médio de localização de um procedimento específico caiu de ~3 min para ~15s (dados do Hotjar pós-lançamento). Feedback das entrevistas: "Finalmente consigo entender meu extrato".
         </p>

         <p class="p1">
         <strong>Decisão Crítica nº 2: Filtros Lineares vs. Sistema de Demarcação Visual</strong>
         </p>

         <p class="p1">
         <strong>Opção A: Dropdown tradicional de mês/ano</strong><br>
         Pró: Padrão de mercado, familiar, implementação trivial<br>
         Contra: Fricção (abrir dropdown, selecionar, fechar), sem contexto temporal visual
         </p>

         <p class="p1">
         <strong>Opção B: Sliders duplos (temporal vertical + categórico horizontal)</strong><br>
         Pró: Navegação fluida, contexto visual rico, agilidade<br>
         Contra: Padrão incomum, risco de confusão do usuário
         </p>

         <p class="p1">
         <strong>Tradeoff Escolhido:</strong> Sistema duplo — slider vertical (meses) + slider horizontal (categorias)<br>
         <strong>Motivo:</strong> Os dados mostraram que os usuários buscam por padrões temporais ("quais exames eu fiz em janeiro?") e padrões categóricos ("todas as minhas consultas recentes"). O slider vertical exibe separadores mensais visuais, enquanto o slider horizontal filtra por tipo (Consultas, Exames, Terapias). Ambos são combinados sem a fricção de um dropdown.<br>
         <strong>Impacto:</strong> A taxa de abandono ao buscar procedimentos antigos caiu 47% (Google Analytics). Os usuários navegam pelos meses anteriores sem frustração — marcadores visuais claros criam um mapa mental temporal.
         </p>

         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="pt_assets/cases/consulta/4.avif" alt="Sistema de filtragem">
            </div>
            <p class="case-caption">Sistema de demarcação visual — sliders verticais (meses) e horizontais (categorias) eliminam a fricção de busca.</p>
         </div>

         <p class="p1">
         <strong>Decisão Crítica nº 3: Troca de Dependente com Logout vs. Gesto de Swipe (Deslizar)</strong>
         </p>

         <p class="p1">
         <strong>Opção A: Manter o fluxo de logout → login do dependente</strong><br>
         Pró: Segurança máxima (reautenticação), arquitetura existente<br>
         Contra: Fricção massiva, alto consumo de tempo, abandono da tarefa
         </p>

         <p class="p1">
         <strong>Opção B: Swipe lateral para alternar entre titular ↔ dependente</strong><br>
         Pró: Fluidez, zero fricção, padrão mobile familiar<br>
         Contra: Risco de segurança (acesso não autorizado), complexidade de implementação
         </p>

         <p class="p1">
         <strong>Tradeoff Escolhido:</strong> Swipe lateral com sessão autenticada compartilhada<br>
         <strong>Motivo:</strong> 100% dos titulares entrevistados citaram o fluxo de logout/login como um ponto de dor crítico — especialmente mães acompanhando filhos menores. Arquitetamos um sistema de sessão compartilhada segura — o titular se autentica uma vez e um swipe lateral altera o contexto dos dados (titular vs. dependente) sem precisar refazer o login. A segurança é preservada: o titular já autenticado tem o direito legal de acessar os dados dos dependentes.<br>
         <strong>Impacto:</strong> O tempo médio de troca de titular → dependente caiu de ~45s (logout + login) para ~1s (swipe). Recurso citado em 89% dos feedbacks positivos pós-lançamento. As mães relataram: "Agora consigo ver as consultas dos meus filhos sem perder tempo".
         </p>

         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="pt_assets/cases/consulta/6.avif" alt="Swipe de troca de usuário">
            </div>
            <p class="case-caption">Swipe lateral — mudança de contexto titular ↔ dependente sem logout, preservando a segurança da sessão autenticada.</p>
         </div>

         <p class="p1">
         <strong>Decisão Crítica nº 4: Contestação Passiva vs. Notificação Push Acionável</strong>
         </p>

         <p class="p1">
         <strong>Opção A: Botão de contestação dentro do app (o usuário busca ativamente)</strong><br>
         Pró: Sem risco de fadiga de notificações, controle total do usuário<br>
         Contra: Baixa percepção, os usuários não sabem que podem contestar, baixa taxa de uso
         </p>

         <p class="p1">
         <strong>Opção B: Notificação push com CTA direto "Não reconheço isso"</strong><br>
         Pró: Percepção máxima, ação instantânea, alta conversão<br>
         Contra: Risco de irritação (notificações frequentes), desativação (opt-out)
         </p>

         <p class="p1">
         <strong>Tradeoff Escolhido:</strong> Notificação push contextual com deep link direto<br>
         <strong>Motivo:</strong> A pesquisa mostrou que a maioria dos usuários não verificava o aplicativo proativamente — autorizações indevidas passavam despercebidas. A notificação push é disparada quando uma nova autorização é registrada, exibe o procedimento/prestador/data e oferece um botão "Não reconheço isso" que abre o app direto na tela de contestação. O usuário age em um contexto "quente" (memória recente da consulta).<br>
         <strong>Impacto:</strong> 13.000 autorizações contestadas em 2022 (Relatório Anual p. 38) — um volume inalcançável sem os pushes proativos.
         </p>

         <h3>Solução Final</h3>

         <p class="p1">
         <strong>Funcionalidades principais:</strong><br>
         1. <strong>Hierarquia Visual Categórica:</strong> Mais de 20 itens da ANS organizados em categorias colapsáveis (Consultas, Exames, Terapias, Acompanhamentos) com dados prioritários destacados.<br>
         2. <strong>Sistema de Filtragem Duplo:</strong> Slider vertical (demarcação mensal) + slider horizontal (categorias) para uma navegação temporal e temática fluida.<br>
         3. <strong>Swipe Lateral Titular ↔ Dependente:</strong> Alterna o contexto sem logout, utilizando uma sessão autenticada compartilhada e preservando a segurança.<br>
         4. <strong>Notificações Push Acionáveis:</strong> Gatilho contextual com deep link direto para contestação, exibindo procedimento/prestador/data.<br>
         5. <strong>Fluxo de Contestação Simplificado:</strong> Botão "Não reconheço isso" → tela de confirmação com dados do procedimento → envio da contestação → a CASSI entra em contato com o prestador para esclarecimentos.<br>
         6. <strong>Transparência na Comunicação:</strong> Os usuários recebem atualizações de status sobre a contestação (enviada, em análise, resolvida) por meio de notificações e de uma linha do tempo no app.
         </p>

         <p class="p1">
         <strong>Impacto nos Prestadores (Estratégia Bilateral):</strong> A diretoria deu sinal verde para criar uma matriz de qualidade de prestadores — as contestações agora contam negativamente na avaliação anual. Isso cria um incentive para os prestadores evitarem autorizações indevidas, alinhando os interesses institucionais com a UX do usuário.
         </p>

         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="pt_assets/cases/consulta/5.avif" alt="Hierarquia de informação">
            </div>
            <p class="case-caption">Categorização clara — consultas, exames e acompanhamentos separados visualmente com dados prioritários em foco.</p>
         </div>

         <h3>Resultados e Impacto</h3>

         <p class="p1">
         <strong>Métricas quantitativas (Relatório Anual CASSI 2022):</strong><br>
         - População impactada: 229.664 usuários de iOS/Android (29% dos 792.384 participantes) — p. 64<br>
         - Autorizações contestadas: 13.000 em 2022 (operacional) — p. 38<br>
         - Procedimentos não reconhecidos: 30.000 em 2022 (operacional) — p. 38<br>
         - Economia financeira: R$ 2,5 milhões em despesas evitadas de procedimentos não reconhecidos (anual) — p. 38<br>
         - Serviços mais contestados: Consultas, exames laboratoriais, terapias<br>
         - Avaliações nas lojas de apps: Melhora nas notas de iOS e Android após a atualização de lançamento<br>
         - Taxa de abandono na busca por procedimentos antigos: redução de 47% (Google Analytics)
         </p>

         <p class="p1">
         <strong>Impacto Sistêmico 2023:</strong> O sistema de contestação influenciou a matriz de qualidade de relacionamento com prestadores no ano seguinte — a pontuação baseada em contestações incentiva a transparência e uma melhor comunicação.
         </p>

         <p class="p1">
         <strong>Feedback Qualitativo:</strong><br>
         <em>"Finalmente consigo entender meu extrato. Antes era apenas uma lista confusa."</em> — Participante titular<br>
         <em>"Recebi uma notificação de uma consulta que não fiz e contestei na hora. Muito fácil."</em> — Participante individual<br>
         <em>"Agora consigo ver as consultas dos meus filhos sem perder tempo fazendo login e logout da conta."</em> — Participante titular com dependentes
         </p>

         <div class="case-asset-wrapper">
            <div class="case-asset-box is-image">
               <img src="pt_assets/cases/consulta/7.avif" alt="Resultados">
            </div>
            <p class="case-caption">Impacto sistêmico — 13.000 contestações, R$ 2,5 milhões economizados, matriz de qualidade de prestadores influenciada.</p>
         </div>

         <h3>Aprendizados e Reflexões</h3>

         <p class="p1">
         <strong>O que funcionou:</strong>
         </p>

         <p class="p1">
         <strong>1. Abordagem Bilateral (Usuário + Prestador):</strong> A pesquisa revelou que resolver apenas a UX não corrigiria o problema sistêmico. A proposta da matriz de qualidade de prestadores, validada com os stakeholders, criou um incentivo estrutural para reduzir autorizações indevidas. Design centrado no usuário + estratégia institucional = impacto escalável.
         </p>

         <p class="p1">
         <strong>2. Validação Regulatória Antecipada:</strong> Conversar com os pontos focais da ANS antes de finalizar os layouts evitou um retrabalho massivo. O esclarecimento sobre a liberdade de exibição (ordem livre) desbloqueou a hierarquia visual que transformou a usabilidade. Lição: restrições regulatórias podem ser oportunidades, e não apenas limitações.
         </p>

         <p class="p1">
         <strong>3. Notificações Push como Conscientização, Não Spam:</strong> A decisão de usar pushes contextuais (e não um genérico "você tem atualizações") foi crítica. Exibir os dados do procedimento diretamente na notificação criou um senso de urgência legítimo — os usuários agem enquanto a memória está fresca.
         </p>

         <p class="p1">
         <strong>O que eu faria diferente:</strong>
         </p>

         <p class="p1">
         <strong>1. Testes de Usabilidade com Idosos desde o Início:</strong> A CASSI possui uma base significativa de usuários com mais de 55 anos. Descobrimos tarde que o swipe lateral não era intuitivo para alguns usuários mais velhos. Uma iteração pós-lançamento adicionou um botão visual alternativo ("Alternar para [Nome do Dependente]"). Testar com extremos demográficos desde a etapa de wireframe teria antecipado isso.
         </p>

         <p class="p1">
         <strong>2. Baseline Métricas Antes do Lançamento:</strong> Conseguimos medir o impacto pós-lançamento (13.000 contestações), mas não tínhamos uma linha de base (baseline) confiável de quantas autorizações indevidas passavam despercebidas <em>antes</em>. É difícil quantificar a melhoria relativa. Projetos futuros: estabelecer métricas de controle antes da mudança.
         </p>

         <p class="p1">
         <strong>3. Documentação de Casos de Borda (Edge Cases) Regulatórios:</strong> A ANS possui dezenas de regras específicas (por exemplo, a diferença entre "retorno" e "consulta" afeta o faturamento). Documentar todos os casos de borda durante a pesquisa teria acelerado a validação do design. Criamos um glossário regulatório na metade do caminho — ele deveria ter sido o primeiro entregável.
         </p>

         <p class="p1">
         <strong>Principal Aprendizado sobre Design de Saúde Regulada:</strong> Projetos de saúde exigem um equilíbrio único entre UX, conformidade regulatória e incentivos sistêmicos. A melhor interface do mundo não resolverá o problema se os prestadores continuarem enviando autorizações erradas sem penalidades. O design de produto em saúde é o design do <em>ecossistema</em>, não apenas da interface. A colaboração com os stakeholders (ANS, diretoria, jurídico) desde o discovery, e não apenas na validação final, é um diferencial crítico.
         </p>

         <p class="p1">
         <strong>Impacto Além do Digital:</strong> Este projeto destacou a importância do design centrado no usuário e da colaboração multidisciplinar. Resultados tangíveis (R$ 2,5 milhões economizados, 13.000 contestações, matriz de qualidade de prestadores influenciada) provaram que o investimento em pesquisa de UX e design iterativo gera valor mensurável — não apenas satisfação subjetiva, mas impacto financeiro e operacional institucional.
         </p>
        `,
        credits: ["Lio Schimanko", "Illa Penha", "Felipe Pires", "Luís Aragão"],
        videoSrc: "pt_assets/videos/consulta.mp4",
        vttSrc: "pt_assets/subtitles/consulta.vtt",
        thumbSrc:"pt_assets/thumbs/consulta.avif",
        deviceClass: "iphone-12",
    }
];