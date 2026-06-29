export const cassi = {
        logoUrl: "assets/logos/cassi.jpeg",
        id: "cassi",
        slug: "us400k-redesign",
        year: _t("2022 ∙ CASSI", "2022 ∙ CASSI"),
        isProtected: true,
        password: "123",
        employer: "CASSI",
        readTime: _t("2 min", "2 min"),
        title: _t("US$400k Redesign", "Redesign de US$400k"),
        shortDesc: _t("Mobile redesign saving $400k in mismanaged medical expenses.", "Redesign móvel economizando $400k em despesas médicas indevidas."),
        aiSummary: _t("By transforming a dense 20-item regulatory list into an intuitive card hierarchy, this redesign allowed 229,000 families to easily spot and dispute incorrect healthcare charges natively within the app.", "Ao transformar uma densa lista de 20 itens regulatórios em uma hierarquia de cards intuitiva, esse redesign permitiu que 229.000 famílias identificassem e contestassem facilmente cobranças incorretas de saúde nativamente dentro do aplicativo."),
        keyIndicators: [
                { value: "USD 400,000", label: _t("Annual savings in avoided expenses", "Economia anual em despesas evitadas") },
                { value: "13,000", label: _t("Proactively disputed authorizations", "Autorizações contestadas proativamente") },
                { value: "15s", label: _t("Search time reduced from 3min", "Tempo de busca reduzido de 3 minutos") },
                { value: "30,000", label: _t("Unrecognized procedures caught", "Procedimentos não reconhecidos bloqueados") }
        ],
        desc: _t(`
        <p class="p1"> 
<strong>NDA Note:</strong> This project is protected by compliance and non-disclosure agreements. This case presents a sanitized overview focusing on methods and public results from the 2022 Annual Report. 
</p> 

<p class="p1">
<strong>Once upon a time,</strong> the CASSI health insurance app served 229,000 mobile users. The company faced a huge systemic problem: medical providers were submitting incorrect or fake procedures, creating massive unexpected expenses for patients and the institution.
</p>

<p class="p1">
<strong>Every day,</strong> these wrong charges went completely unnoticed. The old app crammed over 20 mandatory regulatory items into a single dense list with zero visual order. Finding a specific doctor visit took up to three minutes. To make things worse, parents had to log out completely and log back in under a different username just to see their children's medical bills.
</p>

<p class="p1">
<strong>One day,</strong> we set out to build an intuitive multi-platform system to empower users to spot and dispute these wrong charges instantly.
</p>

<p class="p1">
<strong>Because of this,</strong> we negotiated with regulatory focal points and discovered that while displaying all 20+ items was mandatory, their layout order was flexible. We broke the dense list down into clear, collapsible groups like Consultations, Exams, and Therapies, highlighting vital data at the very top.
</p>


<div class="combo-asset-card"> 
<div class="before-after-slider"> 
<img src="assets/thumbs/consulta.avif" class="img-after" alt="New Design"> 
<img src="assets/thumbs/holofante.avif" class="img-before" alt="Old Design"> 
<div class="slider-handle"></div> 
</div> 
<div class="combo-divider"></div> 
<p class="combo-observation">Observation: Shifting from a dense tabular list to a categorical hierarchy reduced visual noise by 40%.</p> 
</div> 


<p class="p1">
<strong>Because of that,</strong> we re-engineered the account architecture to remove family friction. We introduced a quick side-swipe gesture that lets users securely toggle between policyholder and dependent views in a single shared session. We also launched direct phone alerts that notify users the moment a bill is registered, letting them tap an "I don't recognize this" button while their memory is still fresh.
</p>

<div class="combo-asset-card"> 
<img src="assets/cases/en/consulta/6.avif" alt="Dependent Switch Motion" class="case-img-rounded-full"> 
<div class="combo-divider"></div> 
<p class="combo-observation">Observation: Side swipe gesture switches the family data context in 1 second without a painful logout-login loop.</p> 
</div>

<p class="p1">
<strong>Until finally,</strong> the time it took to find a specific procedure fell from three minutes to just 15 seconds, causing search abandonment rates to drop by 47%. Users successfully flagged thousands of unrecognized charges directly through the app.
</p>

<p class="p1">
<strong>And ever since then,</strong> user dispute data flows directly into an automated quality matrix for healthcare providers. Incorrect charges now count negatively against clinics and hospitals in their annual evaluations, keeping providers honest and protecting institutional finances.
</p>

<div class="combo-asset-card"> 
<img src="assets/cases/en/consulta/7.avif" alt="Results" class="case-img-rounded-full"> 
<div class="combo-divider"></div> 
<p class="combo-observation">Translation & Business Outcome: 13,000 disputed items and 30,000 unrecognized procedures saved R$ 2.5 million (USD 400,000) in avoided healthcare expenses in 2022.</p> 
</div>
        `, `
        <p class="p1"> 
<strong>Nota de Privacidade:</strong> Este projeto é protegido por acordos de confidencialidade (NDA). Este caso apresenta um resumo sanitizado focado em metodologias e resultados públicos de 2022. 
</p> 

<p class="p1">
<strong>Era uma vez,</strong> o aplicativo da CASSI que atendia a cerca de 229.000 perfis familiares em uso ativo. Contudo, o plano sofria com o descontrole: grandes centros e provedores médicos lançavam autorizações incorretas para exames duplicados que nunca aconteceram no mundo físico. Essa sangria criava perdas avassaladoras anuais de capital do plano.
</p>

<p class="p1">
<strong>Todos os dias,</strong> por anos, essas cargas ilegais e faturas fantasmas permaneciam sem revisão do beneficiário final, por um motivo trágico de UI e Experiência. O modelo em layout antigo forçava +20 chaves de metadados listadas e enlatadas em campos longos e ilegíveis que exauriam cognitivamente os usuários. Encontrar consultas específicas consumia três minutos estressantes.
A pior parte era que um pai deveria sempre se desconectar do app central para depois ter que logar a sessão isoladamente na credencial do filho menor para avaliar as perdas, aumentando as chances de nunca ser verificado.
</p>

<p class="p1">
<strong>Um dia,</strong> começamos o mapeamento para sanar de forma contundente e intuitiva os vazamentos.
</p>

<p class="p1">
<strong>Por conta disso,</strong> fizemos mesas de conciliação de regras de negócios entre áreas de Tecnologia, Jurídico e Compliance Regulatório ANS. Confirmamos que embora a Agência (ANS) exija legalmente os 20 dados, ela não restringe a ordem ou agrupamento visual de como o cliente os consome no Mobile. Separamos e explodimos o modelo de lista contínua em pastas (Cartões Retráteis), categorizadas (Consulta, Exame e Terapia), iluminando o valor monetário como pivô de reconhecimento na tela e permitindo leitura limpa sob navegação acelerada e progressiva do usuário.
</p>


<div class="combo-asset-card"> 
<div class="before-after-slider"> 
<img src="assets/thumbs/consulta.avif" class="img-after" alt="Novo Design Hierarquizado"> 
<img src="assets/thumbs/holofante.avif" class="img-before" alt="Antigo Layout Tabular"> 
<div class="slider-handle"></div> 
</div> 
<div class="combo-divider"></div> 
<p class="combo-observation">Observação: Evoluir da estrutura relacional plana de tabelas pesadas de texto diminuiu a sobrecarga na visão de busca orgânica manual em mais de 40%.</p> 
</div> 


<p class="p1">
<strong>Ainda por causa disso,</strong> redesenhamos o login arquitetural das credenciais seguras de toda a família. Implantamos gestos de deslizamento lateral simples. Este novo fluxo transfere temporariamente a sessão para a visão de faturas do filho sem nunca quebrar o login primário ou comprometer a API Backend central. Por cima dessa correção fundamental, acoplamos disparo Push transacional no exato instante em que hospitais passavam os exames no faturamento, garantindo que membros de confiança clicassem nativamente no botão (Não Reconheço Isso!) e recusassem de imediato fraudes nos extratos enquanto o dia e momento da ida ao médico estavam ativos mentalmente no paciente.
</p>

<div class="combo-asset-card"> 
<img src="assets/cases/consulta/6.avif" alt="Deslize de Dependente" class="case-img-rounded-full"> 
<div class="combo-divider"></div> 
<p class="combo-observation">Observação: O componente em carrossel de dependente troca os extratos de visualização e perfil familiar em 1 único segundo, neutralizando para sempre a dor dos infinitos loops passados de login e logouts estressantes nas filas médicas.</p> 
</div>

<p class="p1">
<strong>Até que finalmente,</strong> com as modificações estruturais o teto temporal de buscas manuais dos próprios pacientes por itens nas telas regrediu maravilhosamente dos absurdos três minutos para simples e efetivos 15 segundos. Isso derrubou a taxa de desistência nos cliques por irritação na pesquisa geral em margens vertiginosas de -47%. 
Nossos pais de família finalmente encontraram rapidamente registros e puderam estornar e cancelar por iniciativa de seus celulares uma contagem colossal e volumétrica de cobranças errôneas na ponta digital do aplicativo.
</p>

<p class="p1">
<strong>E desde então,</strong> essa massa bruta de dados oriunda de milhões de bloqueios das próprias mãos dos cidadãos do aplicativo, irriga hoje a espinha dorsal corporativa das Matrizes Inteligentes de Qualidade dos provedores médicos da Sede da CASSI. As faturas fantasmas erradas agora descontam pontuações no repasse anual de reajuste financeiro dos hospitais em escopo nacional, o que garante e sela definitivamente a proteção dos cofres institucionais contra provedores duvidosos em favor exclusivo do beneficiário.
</p>

<div class="combo-asset-card"> 
<img src="assets/cases/consulta/7.avif" alt="Resultado Final do Processo" class="case-img-rounded-full"> 
<div class="combo-divider"></div> 
<p class="combo-observation">Fechamento do Impacto Operacional & Negócios: A soma de 13 mil cliques ativados de Disputa Proativa do Usuário com a interceptação e interrupção das métricas em +30.000 Procedimentos Fantasmas Não Reconhecidos pouparam diretamente cerca de R$ 2.5 milhões de Reais puros na instituição por cobranças em 2022.</p> 
</div>
        `),
        credits: ["Lio Schimanko", "Illa Penha", "Felipe Pires", "Luís Aragão"],
        videoSrc: _t("assets/videos/en/en-consulta.mp4", "assets/videos/pt/pt-consulta.mp4"),
        vttSrc: _t("assets/subtitles/en/en-consulta.vtt", "assets/subtitles/pt/pt-consulta.vtt"),
        thumbSrc: "assets/thumbs/en/consulta.avif",
        deviceClass: "iphone-12",
};