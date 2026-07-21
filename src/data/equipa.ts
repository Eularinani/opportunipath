import type { MembroEquipa } from './types-documentos';

export const equipa: MembroEquipa[] = [
  {
    nome: 'Paulo Manuel',
    funcao: 'Fundador & CEO',
    bio: 'Ex-bolsista em Portugal, apaixonado por educacao e tecnologia.',
    imagem: '/images/team-paulo.jpg',
    linkedin: '#',
    twitter: '#',
  },
  {
    nome: 'Teresa Gomes',
    funcao: 'Gestora de Conteudo',
    bio: 'Mestre em Comunicacao, responsavel pelos guias e artigos.',
    imagem: '/images/team-teresa.jpg',
    linkedin: '#',
  },
  {
    nome: 'Marcos Kiala',
    funcao: 'Desenvolvedor',
    bio: 'Licenciado em Ciencia da Computacao, constroi a plataforma.',
    imagem: '/images/team-marcos.jpg',
    linkedin: '#',
    twitter: '#',
  },
];

export const valores = [
  { icon: '\ud83c\udfaf', titulo: 'Precisao', descricao: 'Informacao verificada e atualizada. Nada de rumores ou desatualizacoes.' },
  { icon: '\ud83e\udd1d', titulo: 'Comunidade', descricao: 'Acreditamos no poder da partilha. Juntos, chegamos mais longe.' },
  { icon: '\ud83d\ude80', titulo: 'Empoderamento', descricao: 'Damos-te as ferramentas. O resto depende de ti.' },
  { icon: '\ud83d\udca1', titulo: 'Clareza', descricao: 'Guias simples e diretos. Nada de burocrates.' },
  { icon: '\ud83c\udf0d', titulo: 'Acessibilidade', descricao: 'Educacao de qualidade deve ser acessivel a todos os angolanos.' },
  { icon: '\u2764\ufe0f', titulo: 'Paixao', descricao: 'Fazemos isto porque acreditamos no futuro de Angola.' },
];
