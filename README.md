# App Arvo — Portal do Produtor

Aplicativo para os produtores do programa **Reflorestar** acompanharem a propriedade, o projeto com a Arvo, as parcelas e informações do campo.

| Pasta | Conteúdo |
|---|---|
| [`mobile/`](mobile/) | App em Expo (React Native + TypeScript) — como rodar está no [README do app](mobile/README.md) |
| [`docs/`](docs/) | [Especificação da Fase 1](docs/especificacao-fase-1.md): telas, dados, decisões e próximos passos |
| raiz | Logos e símbolo da Arvo usados na identidade visual |

## Backend

O app usa o `mvgi-backend` (sistema interno da Arvo), com as rotas `/api/app/*` criadas na branch `feat/app-produtor` daquele repositório.

## Situação

Versão de **teste**. Pronto: login por telefone e senha, sessão salva no aparelho, abas Início, Propriedade e Perfil com dados reais. Próximo: aba Meu Projeto (etapas, atividades e parcelas).
