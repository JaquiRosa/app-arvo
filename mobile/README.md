# Arvo Produtor — app

App do produtor do Reflorestar (Expo + React Native + TypeScript). Especificação em [`../docs/especificacao-fase-1.md`](../docs/especificacao-fase-1.md).

## Como rodar (ambiente local)

**1. Backend** (`C:\Users\jaqui\arvo\mvgi-backend`, branch `feat/app-produtor`)

```bash
NODE_ENV=local yarn migration:run
NODE_ENV=local npx ts-node -r tsconfig-paths/register --transpile-only scripts/seed-app-producers.ts
yarn local
```

O seed cria 5 produtores de teste — telefones `(27) 90000-0001` a `0005`; a senha está em `TEST_PASSWORD` no script.

**2. App**

```bash
npm install
npx expo start
```

- `w` abre no navegador (bom para testar rápido)
- No celular: instale o **Expo Go** e leia o QR code. O celular não enxerga `localhost`, então troque em `.env` para o IP do computador na rede, ex.: `EXPO_PUBLIC_API_URL=http://192.168.0.10:3000/api`

## Estrutura

```
src/
  app/            telas (Expo Router: cada arquivo é uma rota)
    login.tsx
    (tabs)/       inicio, propriedade, projeto, aprender, perfil
  api/            chamadas ao mvgi-backend (/api/app/...)
  auth/           sessão (token salvo no armazenamento seguro do celular)
  hooks/          useProfile, propriedade selecionada
  components/     peças de tela reutilizáveis
  theme.ts        cores e tamanhos da identidade Arvo
```

## Rotas do backend usadas

| Rota | O que faz |
|---|---|
| `POST /api/app/login` | Telefone + senha (mín. 4 caracteres) → token de 30 dias. 5 erros seguidos bloqueiam 15 min; 15 erros bloqueiam até um admin liberar |
| `GET /api/app/me` | Produtor + propriedades com projeto no Reflorestar |

## Checagens

```bash
npx tsc --noEmit
npx expo-doctor
```
