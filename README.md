# OportuniPath

<p align="center">
  <strong>Conectando talento angolano a oportunidades de estudo no mundo inteiro.</strong>
</p>

<p align="center">
  <a href="https://github.com/Eularinani/opportunipath">
    <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js 15" />
  </a>
  <a href="https://github.com/Eularinani/opportunipath">
    <img src="https://img.shields.io/badge/TypeScript-5.9-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  </a>
  <a href="https://github.com/Eularinani/opportunipath">
    <img src="https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma" alt="Prisma" />
  </a>
  <a href="https://github.com/Eularinani/opportunipath">
    <img src="https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  </a>
</p>

---

## O que é o OportuniPath?

O **OportuniPath** é uma plataforma digital angolana dedicada a reunir, organizar e divulgar **bolsas de estudo internacionais** para estudantes angolanos.

Acreditamos que a educação é o caminho mais seguro para o desenvolvimento de Angola. Por isso, criámos um espaço onde qualquer angolano pode descobrir oportunidades de estudo — desde cursos de línguas e licenciaturas até mestrados, doutoramentos e bolsas de pesquisa — em qualquer parte do mundo.

## Qual é o fim/objetivo?

O nosso objetivo é **democratizar o acesso à informação sobre bolsas de estudo internacionais**, eliminando barreiras como:

- Falta de centralização de informação;
- Dificuldade em saber quais bolsas ainda estão abertas;
- Desconhecimento dos requisitos e documentos necessários;
- Prazos perdidos por falta de alertas.

Queremos que mais angolanos consigam estudar no exterior e regressem ao país com conhecimento para contribuir no seu desenvolvimento.

---

## Funcionalidades Principais

### Para o público

- 🔍 **Pesquisa e filtros avançados** — por país, nível de estudos, área, tipo de bolsa e estado.
- ⭐ **Bolsas em destaque** — as melhores oportunidades em destaque na homepage.
- 🔔 **Bolsas a abrir em breve** — prepara a candidatura antes da abertura.
- 🗺️ **Bolsas por país** — explora oportunidades por destino.
- 📄 **Checklist de documentos** — marca os documentos que já tens prontos.
- 📚 **Guias e artigos** — conteúdos para ajudar na candidatura.
- 📬 **Newsletter** — recebe alertas de novas bolsas e prazos.
- 📞 **Formulário de contacto** — fala connosco diretamente.

### Para administradores

- 📊 **Dashboard com estatísticas e gráficos** — bolsas por país, status, mês e contactos.
- 📝 **CRUD completo de bolsas** — cria, edita, destaca e remove oportunidades.
- 📰 **CRUD de guias/artigos** — gestão de conteúdo educativo.
- 👥 **Gestão de utilizadores** — alteração de roles e eliminação.
- 📧 **Gestão de contactos e newsletter** — resposta e acompanhamento.

---

## Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router + Server Components) |
| Linguagem | [TypeScript](https://www.typescriptlang.org/) |
| Estilos | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Base de dados | [PostgreSQL](https://www.postgresql.org/) + [Prisma ORM](https://www.prisma.io/) |
| Autenticação | [Auth.js v5](https://authjs.dev/) (NextAuth) |
| Email | [Resend](https://resend.com/) |
| Gráficos | [Recharts](https://recharts.org/) |
| Validação | [Zod](https://zod.dev/) |

---

## Estrutura do Projeto

```
app-next/
├── prisma/               # Schema e seed da base de dados
├── public/               # Ficheiros estáticos
├── src/
│   ├── app/              # Rotas e páginas (Next.js App Router)
│   │   ├── (auth)/       # Login e registo
│   │   ├── (public)/     # Páginas públicas (homepage, bolsas, etc.)
│   │   ├── admin/        # Painel administrativo
│   │   ├── api/          # API Routes
│   │   └── ...
│   ├── components/       # Componentes React reutilizáveis
│   ├── lib/              # Utilitários, DB, auth, email
│   ├── data/             # Dados estáticos (documentos, equipa)
│   └── types/            # Tipos TypeScript
├── tailwind.config.ts
└── package.json
```

---

## Como Correr Localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/Eularinani/opportunipath.git
cd opportunipath/app-next
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
```

Edita `.env.local` com os teus valores:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/opportunipath"
AUTH_SECRET="gera_um_token_seguro_aqui"
NEXTAUTH_URL="http://localhost:3000"
RESEND_API_KEY="re_xxxxxx"
ADMIN_EMAIL="admin@opportunipath.ao"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

> 💡 Gera o `AUTH_SECRET` com: `openssl rand -base64 32`

### 4. Inicializar a base de dados

```bash
npm run db:push
npm run db:seed
```

O seed cria:
- Admin: `admin@opportunipath.ao` (password aleatória impressa no terminal)
- 13 bolsas de exemplo
- 1 subscritor de newsletter de teste

> ⚠️ Guarda a password do admin — só é mostrada uma vez!

### 5. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) no teu browser.

### 6. Aceder ao Admin

1. Vai a [http://localhost:3000/login](http://localhost:3000/login)
2. Entra com `admin@opportunipath.ao` e a password do seed
3. Serás redirecionado automaticamente para `/admin`

---

## Scripts Disponíveis

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build de produção
npm run start      # Servidor de produção
npm run lint       # Verificação de lint
npm run db:push    # Sincroniza schema com a base de dados
npm run db:seed    # Popula a base de dados com dados iniciais
npm run db:studio  # Abre Prisma Studio
```

---

## Roadmap / Próximos Passos

- [ ] Upload de imagens (Cloudinary / AWS S3)
- [ ] Login com Google OAuth
- [ ] Sistema de favoritos para utilizadores
- [ ] Testes E2E com Playwright
- [ ] Notificações push para prazos a expirar
- [ ] Modo escuro / tema claro
- [ ] Internacionalização (PT / EN)

---

## Contribuir

Tens uma sugestão ou queres contribuir com código? Fica à vontade para abrir uma **issue** ou enviar um **pull request**.

1. Faz fork do projeto
2. Cria uma branch: `git checkout -b minha-feature`
3. Faz commit das alterações: `git commit -m 'feat: adiciona nova funcionalidade'`
4. Faz push para a branch: `git push origin minha-feature`
5. Abre um Pull Request

---

## Contacto

- 📧 Email: geral@opportunipath.ao
- 🌐 Website: [https://opportunipath.ao](https://opportunipath.ao)
- 💼 LinkedIn: OportuniPath
- 📸 Instagram: @opportunipath

---

<p align="center">
  <strong>OportuniPath — O teu caminho para o mundo.</strong>
</p>

<p align="center">
  Feito com ❤️ em Angola.
</p>
