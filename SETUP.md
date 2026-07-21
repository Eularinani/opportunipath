# OportuniPath — Setup Guide

## Stack
- **Next.js 15** (App Router + Server Components)
- **Prisma 6** + **PostgreSQL** (Neon)
- **NextAuth.js v5** (Auth.js) — Credentials provider
- **Resend** — Email & newsletter
- **Tailwind CSS** + shadcn/ui
- Postgres full-text search (ILIKE)

---

## 1. Instalar dependências

```bash
cd app-next
npm install
```

---

## 2. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Edita `.env.local` com os teus valores reais:

### 2.1 Base de dados (Neon)
1. Vai a [neon.tech](https://neon.tech) e cria uma conta gratuita
2. Cria um novo projecto
3. Copia a **Connection string** e coloca em `DATABASE_URL`

### 2.2 NextAuth Secret
```bash
openssl rand -base64 32
```
Cola o resultado em `AUTH_SECRET`

### 2.3 Resend (Email)
1. Vai a [resend.com](https://resend.com) e cria conta gratuita
2. Cria uma API Key
3. Cola em `RESEND_API_KEY`
4. (Opcional) Verifica o teu domínio para enviar de `@opportunipath.ao`

---

## 3. Inicializar base de dados

```bash
# Push do schema para o Neon
npm run db:push

# Gerar o Prisma Client
npm run db:generate

# Popular com dados iniciais (bolsas de exemplo + admin user)
npm run db:seed
```

O seed cria:
- **Admin**: `admin@opportunipath.ao` / `admin123!`
- 3 bolsas de exemplo (Santander, DAAD, Chevening)
- 1 subscritor de newsletter de exemplo

> ⚠️ Muda a password do admin imediatamente após o primeiro login!

---

## 4. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## 5. Aceder ao Admin Dashboard

1. Vai a [http://localhost:3000/login](http://localhost:3000/login)
2. Entra com `admin@opportunipath.ao` / `admin123!`
3. Redireccionado automaticamente para `/admin`

---

## 6. Rotas principais

| Rota | Descrição |
|------|-----------|
| `/` | Homepage |
| `/bolsas` | Listagem com filtros e search |
| `/bolsa/[slug]` | Detalhe da bolsa |
| `/guias` | Artigos e guias |
| `/documentos` | Checklist de documentos |
| `/sobre` | Sobre a plataforma |
| `/login` | Login |
| `/register` | Registo |
| `/admin` | Dashboard admin (protegido) |
| `/admin/bolsas` | CRUD bolsas |
| `/admin/guias` | CRUD guias |
| `/admin/utilizadores` | Gestão de utilizadores |
| `/admin/newsletter` | Subscritores |

---

## 7. API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/bolsas` | Listar bolsas (filtros, paginação, search) |
| POST | `/api/bolsas` | Criar bolsa (admin) |
| GET | `/api/bolsas/[id]` | Detalhe + incrementa views |
| PUT | `/api/bolsas/[id]` | Atualizar (admin) |
| DELETE | `/api/bolsas/[id]` | Eliminar (admin) |
| GET | `/api/guias` | Listar guias |
| POST | `/api/guias` | Criar guia (admin) |
| GET | `/api/guias/[id]` | Detalhe do guia |
| PUT | `/api/guias/[id]` | Atualizar guia (admin) |
| POST | `/api/newsletter` | Subscrever newsletter |
| DELETE | `/api/newsletter?email=X` | Cancelar subscrição |
| POST | `/api/contacto` | Enviar mensagem |
| POST | `/api/auth/register` | Registar utilizador |

---

## 8. Produção (Vercel)

1. Push para GitHub
2. Importa o projecto no [vercel.com](https://vercel.com)
3. Adiciona as variáveis de ambiente
4. Deploy automático em cada push para `main`

---

## 9. Próximos passos sugeridos

- [ ] Adicionar upload de imagens (Cloudinary/S3)
- [ ] Implementar Google OAuth (`next-auth` provider)
- [ ] Adicionar testes E2E com Playwright
- [ ] Implementar sistema de favoritos
- [ ] Adicionar notificações push para prazos a expirar
