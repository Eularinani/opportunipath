import { PrismaClient } from '@prisma/client';

// Guias iniciais, criados como rascunho (publicado: false). Revê-os no admin e marca "Publicar guia".
// Formato do conteúdo: "## " = subtítulo, "- " = item de lista, linha vazia = novo parágrafo.
// Idempotente: não toca em guias já existentes com o mesmo slug.
const prisma = new PrismaClient();
const AUTOR = 'Equipa OportuniPath';

const guias = [
  {
    slug: 'como-identificar-burlas-de-bolsas-de-estudo',
    titulo: 'Como identificar burlas de bolsas de estudo',
    categoria: 'Candidatura',
    resumo: 'Sinais de alerta para não perderes dinheiro nem dados pessoais com bolsas falsas.',
    conteudo: `Todos os anos há pessoas que perdem dinheiro com "bolsas" que não existem. A regra mais importante: uma bolsa verdadeira é sempre anunciada pela entidade que a paga — uma universidade, um governo ou uma fundação — no seu site oficial.

## Sinais de alerta
- Pedem-te dinheiro para "garantir", "reservar" ou "processar" a bolsa. As bolsas não se compram.
- Dizem que ganhaste uma bolsa a que nunca te candidataste.
- O contacto vem de um email gratuito (Gmail, Hotmail, Yahoo) ou só por WhatsApp, em vez do domínio oficial da instituição.
- Pressionam-te com prazos de horas ou dias e pedem segredo.
- Pedem a password do teu email, dados do cartão bancário ou cópias de documentos antes de qualquer processo oficial.
- Prometem "100% de aprovação" ou visto garantido.

## Como confirmar se uma bolsa é real
- Procura a bolsa no site oficial da instituição, escrevendo tu o endereço, e não através do link que te enviaram.
- Confirma que o nome da bolsa, os valores e os prazos são os mesmos do site oficial.
- Se a candidatura é feita pela embaixada, confirma no site oficial da embaixada.
- Desconfia de agentes que cobram para te inscrever numa bolsa que tem candidatura gratuita.

## No OportuniPath
Cada bolsa publicada tem um link para a página oficial e a data em que foi verificada. Mesmo assim, confirma sempre no site oficial antes de te candidatares. Se encontrares informação errada, escreve-nos para geral@securadist.com.`,
  },
  {
    slug: 'calendario-de-candidaturas-a-bolsas',
    titulo: 'Quando te candidatar: o calendário das bolsas',
    categoria: 'Candidatura',
    resumo: 'A maioria das bolsas para começar em setembro fecha entre outubro e fevereiro. Vê como te organizar.',
    conteudo: `Um erro comum é procurar bolsas poucos meses antes do início das aulas. Para cursos que começam em setembro ou outubro, muitas candidaturas fecham entre outubro e fevereiro do ano anterior — quase um ano antes.

## Exemplos para o ano letivo 2027/28
- ETH Zurich (ESOP): candidatura de 1 a 30 de novembro de 2026.
- EPFL Master Excellence Fellowships: até 15 de dezembro de 2026.
- Gates Cambridge: 8 de dezembro de 2026 ou 6 de janeiro de 2027, consoante o curso.
- Swedish Institute (SI): candidatura ao mestrado até 15 de janeiro de 2027; pedido da bolsa de 8 a 24 de fevereiro de 2027.
- NL Scholarship (Países Baixos): 1 de fevereiro de 2027 em várias universidades.

Datas consultadas em novembro de 2026. Prazos mudam e variam por curso: confirma sempre no site oficial antes de te candidatares.

## Como te organizar
- 12 meses antes: escolhe 3 a 5 bolsas e cursos e lê os requisitos.
- 9 a 10 meses antes: marca os testes de língua e começa a pedir documentos e traduções.
- 6 a 8 meses antes: pede as cartas de recomendação e escreve a carta de motivação.
- Até ao prazo: submete a candidatura com alguns dias de margem — os portais costumam ficar lentos no último dia.

## Atenção às bolsas em duas etapas
Algumas bolsas exigem primeiro a candidatura ao curso e só depois o pedido da bolsa (por exemplo, a do Swedish Institute). Se falhares a primeira etapa, já não te podes candidatar à bolsa.`,
  },
  {
    slug: 'como-escrever-uma-carta-de-motivacao',
    titulo: 'Como escrever uma carta de motivação para bolsas',
    categoria: 'Candidatura',
    resumo: 'Uma estrutura simples para mostrares quem és, o que queres estudar e porque mereces a bolsa.',
    conteudo: `A carta de motivação é onde o júri te conhece para além das notas. Deve responder a três perguntas: quem és, o que queres fazer e porque esta bolsa e este curso são o passo certo.

## Antes de escrever
- Lê com atenção o que a bolsa pede: número de palavras, perguntas específicas, língua.
- Vê os objetivos da bolsa. Muitas procuram liderança, impacto no país de origem ou excelência académica — mostra como encaixas nisso.

## Estrutura que funciona
- Abertura: uma situação ou motivação concreta que explique o teu interesse pela área. Evita frases genéricas como "desde criança que sonho…".
- Percurso: os estudos, trabalhos e projetos mais relevantes, com resultados concretos.
- O curso e a instituição: porque este programa em particular (disciplinas, professores, laboratórios).
- Futuro: o que vais fazer depois e que impacto esperas ter.
- Fecho: uma ou duas frases que liguem tudo.

## Erros a evitar
- Repetir o currículo em texto corrido.
- Usar a mesma carta para todas as bolsas sem a adaptar.
- Ultrapassar o limite de palavras.
- Erros de ortografia: pede a alguém que leia antes de enviares.`,
  },
  {
    slug: 'como-pedir-cartas-de-recomendacao',
    titulo: 'Como pedir cartas de recomendação',
    categoria: 'Candidatura',
    resumo: 'Quem escolher, quando pedir e que informação dar a quem te vai recomendar.',
    conteudo: `Muitas bolsas e universidades pedem duas ou três cartas de recomendação. Uma boa carta vem de alguém que te conhece bem e consegue dar exemplos concretos.

## Quem escolher
- Professores ou orientadores que te acompanharam de perto (por exemplo, no trabalho final de curso).
- Chefias diretas, se a bolsa valoriza experiência profissional.
- Evita pedir a alguém importante que mal te conhece: uma carta genérica pesa pouco.

## Quando e como pedir
- Pede com pelo menos 4 a 6 semanas de antecedência.
- Envia um resumo com: a bolsa e o curso, o prazo, o teu currículo, a tua carta de motivação e dois ou três pontos que gostavas que fossem destacados.
- Confirma como a carta é enviada. Em muitos portais, quem recomenda recebe um link e envia a carta diretamente — tu não a vês.

## Depois do pedido
- Envia um lembrete simpático uma semana antes do prazo.
- Agradece e informa o resultado, seja qual for.`,
  },
];

async function main() {
  let criados = 0;
  for (const g of guias) {
    if (await prisma.guia.findUnique({ where: { slug: g.slug } })) continue;
    await prisma.guia.create({ data: { ...g, autor: AUTOR, publicado: false } });
    criados++;
  }
  console.log(`✅ ${criados} guias criados como rascunho (${guias.length - criados} já existiam).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
