# App do Produtor Arvo — Especificação da Fase 1 (Informativo)

> Versão 0.4 · 17/11/2026 · Rascunho para discussão · Primeira versão é para **teste**

## 1. Objetivo

Dar ao produtor do **Reflorestar** que já tem projeto com a Arvo um app no celular para acompanhar a própria propriedade, o andamento do projeto, os pagamentos e a cotação do café — sem precisar ligar ou esperar visita técnica.

**Fora da Fase 1:** chat com a equipe (Fase 2), mapa com polígonos, relatórios técnicos, outros programas além do Reflorestar, produtores sem contrato/leads, marketplace, simulador de ROI, previsão de safra, telemetria e demais itens do documento de proposta.

## 2. Decisões já tomadas

| Tema | Decisão |
|---|---|
| Público | Produtores (`producer`) com projeto no programa **Reflorestar** |
| Login | **Telefone e senha** — o telefone é obrigatório no cadastro do produtor, o e-mail não |
| Regra da senha | Senha simples, **mínimo de 4 caracteres**. Sem exigência de letra maiúscula, número ou caractere especial (ex.: `1234` ou `sitio` são aceitas) |
| App | Expo (React Native + TypeScript), Android primeiro |
| Backend | `mvgi-backend`, com novo grupo de rotas `/app/...` somente leitura |
| Modo de uso | Somente leitura: o produtor consulta, não altera dados |
| Estágio | Primeira versão é de **teste**, com produtores de teste e depois poucos produtores reais |
| Parcelas | O produtor vê parcelas **com datas e valores** (previsto e pago) |
| Cotação do café | Mostrada todo dia na tela inicial (arábica e conilon) |
| Publicação de conteúdo | Usuários `admin` do MVGI publicam comunicados, materiais e eventos |
| Mapa | Sem polígonos por enquanto: só um ponto com a localização da propriedade |
| Relatórios técnicos | Fora por enquanto |

> **Glossário — área de intervenção (no código: `land`):** é cada pedaço da propriedade onde o projeto atua (plantio, recuperação de nascente, cercamento etc.). Uma propriedade pode ter várias, cada uma com sua modalidade (SAF, REC, FPE…), área em hectares e culturas. No agro isso costuma ser chamado de "talhão"; no app usaremos o termo da Arvo.

## 3. Telas

### 3.0 Acesso

| Tela | Conteúdo |
|---|---|
| **Login** | Telefone (com máscara `(27) 99999-9999`) e senha (mínimo 4 caracteres, botão de mostrar/ocultar senha) |
| **Esqueci a senha** | Na fase de teste: mensagem "Fale com a Arvo" + botão de WhatsApp do escritório. Um admin redefine a senha pelo painel |
| **Primeiro acesso** | O admin ativa o acesso do produtor no painel e define uma senha inicial, que é passada a ele pessoalmente ou por WhatsApp |
| **Escolher propriedade** | Só aparece se o produtor tiver mais de uma propriedade |

Sessão fica salva no aparelho (`expo-secure-store`); o produtor só faz login de novo se sair ou o token expirar.

> **Depois do teste:** trocar "Esqueci a senha" por código via SMS/WhatsApp, para o produtor não depender da equipe.

### 3.1 Aba Início

- Saudação com nome do produtor e nome da propriedade
- **Cotação do café do dia:** arábica e conilon (R$/saca de 60 kg), variação em relação ao dia anterior, data e fonte
- **Etapa atual do projeto** + barra de progresso
- **Próximas atividades** (as 3 próximas do cronograma, com prazo)
- **Próxima parcela:** valor previsto e data
- **Último aviso** da Arvo
- **Clima** da propriedade: hoje + próximos 7 dias, chuva prevista

Tocar na cotação abre um gráfico simples dos últimos 30 dias.

### 3.2 Aba Propriedade

- **Localização:** mapa com um ponto na propriedade (lat/long do endereço) e botão "Como chegar"
- **Ficha da propriedade:** nome, município/comunidade, bacia hidrográfica, área total, área de vegetação nativa (%), nº de nascentes, CAR (número e situação)
- **Áreas de intervenção:** lista com modalidade, área (ha), área já executada e culturas

### 3.3 Aba Meu Projeto

- **Dados do contrato:** número do contrato, programa, data de emissão, situação, técnico responsável
- **Etapas:** linha do tempo com Elaboração de projeto → Implantação → Monitoramento, marcando concluída / em andamento / futura
- **Atividades da etapa:** lista com check de concluída, data e prazo
- **Cronograma por ano:** o que acontece no 1º ano (implantação e manutenção), 2º e 3º ano
- **Parcelas (PSA):** 1ª a 5ª parcela, com data prevista, valor previsto, se já foi paga, data e valor pago, e total recebido até agora

### 3.4 Aba Aprender

- **Biblioteca:** cartilhas e folders em PDF, com download para ler sem internet
- **Vídeos:** vídeos curtos de manejo (link do YouTube)
- **Eventos:** dias de campo, oficinas e reuniões da região, com data e local

### 3.5 Aba Perfil

- Dados do produtor (nome, telefone) — apenas leitura, com aviso "para alterar, fale com a Arvo"
- **Avisos:** histórico completo de comunicados
- Contato da Arvo (telefone/WhatsApp do escritório) — ponte até o chat da Fase 2
- Sair

## 4. Dados: o que já existe e o que falta

Levantamento feito no `mvgi-backend`.

### 4.1 Já existe — só precisa expor ao produtor

| Tela | Dado no backend |
|---|---|
| Ficha da propriedade | `PropertyModel` (área, CAR, situação do CAR, nascentes, bacia, comunidade) |
| Áreas de intervenção | `LandModel` + `ModalityModel` + `landCultures` |
| Contrato e etapas | `ProjectModel`, `StageModel`, `currentStage` |
| Atividades e cronograma | `ActivityModel` (`year1Impl`…`year3`, `deadline`, `checked`) |
| Parcelas | `InstallmentModel` (`expectedDate`, `paidAt`, `paidAmount`, `shortTermVrte`, `longTermVrte`) + valor da VRTE em `general_settings` |
| Localização | `AddressModel` (`latitude`, `longitude`) → ponto no mapa e clima |

### 4.2 Precisa ajustar no backend

| Item | Situação atual | O que fazer |
|---|---|---|
| **Login por telefone** | `/login` usa e-mail. `producers.phone` aceita vazio, não é único e não tem formato padrão | Nova rota `POST /app/login` (telefone + senha, só perfil `producer`). Guardar telefone só com dígitos e impedir dois produtores com o mesmo telefone |
| **Senha do produtor** | Produtores cadastrados hoje não têm senha | Botão no painel MVGI: "Ativar acesso ao app / redefinir senha" (só admin) |
| **Avisos ao produtor** | `NotificationModel` é mensagem interna entre usuários | Criar "Comunicado" com público-alvo (todos, por bacia, por município, por projeto) |

### 4.3 Não existe — precisa criar

| Item | Observação |
|---|---|
| **Cotação do café** | Ver seção 5 |
| **Biblioteca e vídeos** | Novo cadastro de "Material" (título, tipo PDF/vídeo, arquivo/link, categoria). `TrainingModel` atual é de colaboradores, não serve |
| **Eventos para produtores** | `MobilizationModel` pode servir de base, mas falta título, descrição e "publicar no app" |
| **Telas no painel MVGI** para o admin publicar comunicados, materiais e eventos | Sem isso, essas abas ficam vazias |
| **Clima** | Integração externa (sugestão: Open-Meteo, gratuita, sem chave) usando lat/long da propriedade |

## 5. Cotação do café

**O que mostrar:** preço do dia do **arábica** e do **conilon** (o conilon é o café mais plantado no Espírito Santo), em R$ por saca de 60 kg, com variação e data.

**Fontes candidatas (validar qual usar e se a reprodução é permitida):**

| Fonte | Vantagem | Atenção |
|---|---|---|
| **CEPEA/Esalq** — indicadores do café arábica e robusta/conilon | Referência nacional, usada em contratos | Preço de referência de São Paulo/Sul de Minas e Vitória; atualiza nos dias úteis |
| **CCCV** — Centro do Comércio de Café de Vitória | Preço praticado no Espírito Santo, mais próximo do produtor do Reflorestar | Verificar formato de publicação |
| Cooperativas locais (ex.: Cooabriel) | Preço que o produtor realmente recebe | Cobre só a região da cooperativa |

**Como funciona:**
- O backend busca a cotação **uma vez por dia** (tarefa agendada), guarda numa tabela `coffee_quotes` (data, tipo, preço, fonte) e o app só lê dessa tabela
- Assim o app não depende do site externo estar no ar, funciona offline com o último valor e tem histórico para o gráfico
- Se a busca falhar, o app mostra o último valor com a data ("cotação de 14/11")
- Plano B para o teste: um admin digita a cotação do dia no painel

**Rota:** `GET /app/coffee-quotes?days=30`

> Mais tarde dá para estender para outras culturas do produtor (cacau, banana, pimenta-do-reino…), já que `cultures.quotation` existe no backend.

## 6. Rotas novas no backend (rascunho)

Todas, exceto o login, exigem token de produtor e retornam **somente dados do próprio produtor**.

```
POST /app/login                       → telefone + senha → token
GET  /app/me                          → produtor + lista de propriedades
GET  /app/properties/:id              → ficha + localização
GET  /app/properties/:id/lands        → áreas de intervenção, modalidades, culturas
GET  /app/projects/:id                → contrato, etapa atual, progresso
GET  /app/projects/:id/activities     → etapas + atividades + cronograma
GET  /app/projects/:id/installments   → parcelas com valores
GET  /app/coffee-quotes?days=30       → cotação do café
GET  /app/announcements               → comunicados para este produtor
GET  /app/materials                   → biblioteca e vídeos
GET  /app/events                      → eventos próximos da região
GET  /app/weather?propertyId=         → clima (o backend consulta a API e guarda em cache)
```

Regras obrigatórias:
- Qualquer `:id` pedido precisa pertencer ao produtor logado; caso contrário, `404`
- Só projetos do programa Reflorestar aparecem
- **Limitar tentativas de login por telefone:** como a senha pode ter só 4 dígitos (10 mil combinações), isso é obrigatório. Sugestão: após 5 erros seguidos, bloquear aquele telefone por 15 minutos; após 15 erros, bloquear até um admin liberar
- Senha sempre guardada com `bcrypt` (como já é feito hoje no MVGI); a regra de mínimo 4 caracteres é validada no app e no backend

## 7. Offline

- Dados das abas Início, Propriedade e Meu Projeto ficam em cache e abrem sem internet ("atualizado em …")
- Cotação do café mostra o último valor baixado, com a data
- PDFs baixados ficam salvos no aparelho
- Vídeos e clima exigem internet

## 8. Dados de teste

Script `mvgi-backend/scripts/seed-app-producers.ts` cria 5 produtores de teste no Reflorestar, só em banco local (`localhost`, nome terminado em `_dev`). Pode ser executado de novo sem duplicar nada.

```
NODE_ENV=local npx ts-node -r tsconfig-paths/register --transpile-only scripts/seed-app-producers.ts
```

| Telefone | Cenário | O que testa |
|---|---|---|
| (27) 90000-0001 | Implantação, 2 áreas, 1 parcela paga | Caso típico |
| (27) 90000-0002 | Elaboração de projeto, nenhuma parcela paga | Produtor recém-chegado |
| (27) 90000-0003 | Monitoramento, 3 áreas, 3 parcelas pagas | Projeto avançado |
| (27) 90000-0004 | **Duas propriedades** em etapas diferentes | Tela "Escolher propriedade" |
| (27) 90000-0005 | Contrato **cancelado** | Como o app trata projeto encerrado |

A senha de teste está na constante `TEST_PASSWORD` do script.

## 9. Perguntas em aberto

1. **Telefone repetido:** pode haver dois produtores com o mesmo telefone (ex.: marido e esposa)? Se sim, o login precisa de um passo "qual de vocês?".
2. **Quais produtores reais** entram no teste depois dos produtores fictícios?
3. **Fonte da cotação do café:** CEPEA, CCCV ou cooperativa? Qual preço o produtor da Arvo usa como referência?
4. **Contrato cancelado:** o produtor ainda deve conseguir entrar no app?

**Respondidas:** login por telefone · só Reflorestar · parcelas e valores aparecem · conteúdo publicado por admins · sem polígonos e sem relatórios técnicos por enquanto.

## 10. Ordem sugerida de entrega

1. ✅ **Base:** projeto Expo (`mobile/`), `POST /app/login` por telefone, sessão, `/app/me` — feito em 17/11/2026
2. **Meu Projeto:** contrato, etapas, atividades e parcelas (dados já existem)
3. **Início:** cotação do café + resumo + clima
4. **Propriedade:** ficha, localização e áreas de intervenção
5. **Conteúdo:** cadastro no painel MVGI + abas Aprender e Avisos
6. **Offline e publicação:** cache, build Android pela EAS, teste fechado na Play Store
