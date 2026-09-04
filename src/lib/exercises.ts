export type ExerciseField = {
  key: string;
  label: string;
  placeholder: string;
  rows?: number;
};

export type Exercise = {
  slug: string;
  title: string;
  tagline: string;
  intro: string;
  free: boolean;
  minutes: number;
  art: string;
  fields: ExerciseField[];
  timer?: boolean;
  closing: string;
  moods: string[];
};

export const exercises: Exercise[] = [
  {
    slug: "lista-cabeca",
    title: "Lista do que passa na minha cabeça",
    tagline: "Tirar da cabeça e colocar no papel",
    intro:
      "Sem filtro e sem ordem: escreva o que está ocupando espaço aí dentro. Depois separamos com carinho o que pesa e o que acalma.",
    free: true,
    minutes: 7,
    art: "list",
    moods: ["ansiosa", "sobrecarregada", "confusa"],
    fields: [
      {
        key: "pesados",
        label: "O que está pesando hoje",
        placeholder: "Escreva um por linha, do jeito que vier...",
        rows: 7,
      },
      {
        key: "leves",
        label: "O que está sendo bom hoje",
        placeholder: "Mesmo as coisas pequenas contam...",
        rows: 6,
      },
    ],
    closing:
      "Você acabou de esvaziar um pouco da sua cabeça. Ela não precisa carregar tudo sozinha.",
  },
  {
    slug: "se-entao",
    title: "Se... então...",
    tagline: "Reconhecer os gatilhos",
    intro:
      "Perceber o que dispara a ansiedade já é metade do caminho. Complete as frases sem se cobrar precisão.",
    free: true,
    minutes: 6,
    art: "trigger",
    moods: ["ansiosa", "irritada"],
    fields: [
      {
        key: "se",
        label: "Se acontece...",
        placeholder: "Se eu recebo uma mensagem sem resposta...",
        rows: 4,
      },
      {
        key: "entao",
        label: "...então eu sinto e faço",
        placeholder: "...então eu penso que fiz algo errado e checo o celular sem parar.",
        rows: 4,
      },
      {
        key: "cuidado",
        label: "O que poderia me acolher nesse momento",
        placeholder: "Uma respiração longa, avisar alguém, sair para caminhar...",
        rows: 4,
      },
    ],
    closing: "Nomear o gatilho tira dele parte do poder. Bonito ter chegado até aqui.",
  },
  {
    slug: "carta-para-voce",
    title: "Carta para você mesma",
    tagline: "Escrita em terceira pessoa",
    intro:
      "Escreva para você como escreveria para alguém que ama. Use seu nome e o 'ela/ele' — a distância ajuda a suavizar a autocrítica.",
    free: true,
    minutes: 10,
    art: "letter",
    moods: ["triste", "sobrecarregada"],
    fields: [
      {
        key: "carta",
        label: "Querida...",
        placeholder: "Ela tem se esforçado mais do que percebe...",
        rows: 12,
      },
    ],
    closing: "Guarde esta carta. Em um dia difícil, ela vai ser exatamente o que você precisa ler.",
  },
  {
    slug: "monstro-da-ansiedade",
    title: "O monstro da ansiedade",
    tagline: "Transforme a ansiedade em personagem",
    intro:
      "Se a sua ansiedade tivesse corpo, voz e manias, como ela seria? Dar forma a ela é um jeito gentil de olhar de fora.",
    free: true,
    minutes: 12,
    art: "monster",
    moods: ["ansiosa", "com medo"],
    fields: [
      { key: "nome", label: "O nome dele(a)", placeholder: "Ex.: Gogó, Dona Pressa...", rows: 2 },
      {
        key: "aparencia",
        label: "Como ele é",
        placeholder: "Tamanho, cor, textura, o que ele veste, como se move...",
        rows: 5,
      },
      {
        key: "historia",
        label: "Uma história sobre ele",
        placeholder: "Onde ele aparece, o que ele quer, o que o acalma no final...",
        rows: 9,
      },
    ],
    closing: "Um monstro com nome e história vira personagem — e personagens a gente aprende a conduzir.",
  },
  {
    slug: "carta-para-alguem",
    title: "Carta para alguém (que nunca será enviada)",
    tagline: "Dizer tudo, em segurança",
    intro:
      "Escreva para quem você precisa falar algo. Ninguém vai ler. É seu espaço para dizer o que ficou preso.",
    free: false,
    minutes: 12,
    art: "letter2",
    moods: ["triste", "irritada"],
    fields: [
      { key: "para", label: "Para quem", placeholder: "Um nome, ou só 'você'...", rows: 2 },
      { key: "carta", label: "O que precisa ser dito", placeholder: "Comece por onde doer menos...", rows: 12 },
    ],
    closing: "O que precisava sair, saiu. Respire fundo: ficou mais leve aí dentro.",
  },
  {
    slug: "entrevista-eu",
    title: "Entrevista com o eu do passado ou do futuro",
    tagline: "Conversar com outras versões suas",
    intro:
      "Escolha uma versão sua — de dez anos atrás ou de dez anos à frente — e faça perguntas. Depois responda como ela responderia.",
    free: false,
    minutes: 15,
    art: "interview",
    moods: ["confusa", "calma"],
    fields: [
      { key: "quem", label: "Com quem você vai conversar", placeholder: "Eu de 15 anos / eu aos 60...", rows: 2 },
      { key: "perguntas", label: "Suas perguntas", placeholder: "O que você mais queria ouvir?", rows: 6 },
      { key: "respostas", label: "As respostas dela", placeholder: "Escreva na voz dela...", rows: 9 },
    ],
    closing: "Você acabou de ouvir alguém que te conhece muito bem.",
  },
  {
    slug: "lembro-me-de-sentir",
    title: "Lembro-me de sentir... quando...",
    tagline: "Mapear memórias afetivas",
    intro:
      "Uma frase por vez. Deixe a memória vir sem julgar se é grande ou pequena, boa ou ruim.",
    free: false,
    minutes: 8,
    art: "memory",
    moods: ["triste", "calma"],
    fields: [
      { key: "memorias", label: "Lembro-me de sentir...", placeholder: "...paz, quando ficava na cozinha da minha avó.", rows: 10 },
    ],
    closing: "Suas memórias também são material de cuidado.",
  },
  {
    slug: "problema-terceira-pessoa",
    title: "Resolução de problemas em terceira pessoa",
    tagline: "Ver de fora para decidir melhor",
    intro:
      "Conte o problema como se fosse de outra pessoa. Depois aconselhe essa pessoa com a gentileza que você teria com uma amiga.",
    free: false,
    minutes: 12,
    art: "problem",
    moods: ["confusa", "sobrecarregada"],
    fields: [
      { key: "situacao", label: "A situação dela", placeholder: "Ela está diante de...", rows: 6 },
      { key: "opcoes", label: "Caminhos possíveis", placeholder: "Ela poderia...", rows: 6 },
      { key: "conselho", label: "O que você diria a ela", placeholder: "Se fosse sua melhor amiga...", rows: 5 },
    ],
    closing: "O conselho que você deu vale para você também.",
  },
  {
    slug: "fluxo-de-pensamento",
    title: "Fluxo de pensamento com timer",
    tagline: "Escrever sem parar, sem editar",
    intro:
      "Escolha um tempo e escreva sem tirar as mãos do teclado. Sem vírgula certa, sem revisar. O objetivo é destravar.",
    free: false,
    minutes: 10,
    art: "flow",
    timer: true,
    moods: ["ansiosa", "confusa"],
    fields: [
      { key: "fluxo", label: "Escreva sem parar", placeholder: "Comece com 'agora eu estou...'", rows: 14 },
    ],
    closing: "Você deixou o pensamento correr. Isso também é descanso.",
  },
  {
    slug: "gratidao",
    title: "Lista de gratidão e felicidade",
    tagline: "Treinar o olhar para o que sustenta",
    intro:
      "Nada de gratidão forçada: procure o que foi genuinamente bom, mesmo que minúsculo.",
    free: false,
    minutes: 5,
    art: "gratitude",
    moods: ["calma", "feliz"],
    fields: [
      { key: "gratidao", label: "Hoje eu agradeço por", placeholder: "Três coisas bastam...", rows: 6 },
      { key: "felicidade", label: "Um momento que me fez bem", placeholder: "Descreva com detalhes sensoriais...", rows: 6 },
    ],
    closing: "Registrar o que é bom ensina o cérebro a encontrar mais disso.",
  },
];

export const freeExercises = exercises.filter((e) => e.free);
export const premiumExercises = exercises.filter((e) => !e.free);

export function getExercise(slug: string) {
  return exercises.find((e) => e.slug === slug);
}

export type MoodKey = "calma" | "feliz" | "ansiosa" | "triste" | "irritada" | "sobrecarregada";

export const moods: {
  key: MoodKey;
  label: string;
  color: string;
  score: number;
  emoji: string;
}[] = [
  { key: "feliz", label: "Leve", color: "var(--chart-4)", score: 5, emoji: "😊" },
  { key: "calma", label: "Calma", color: "var(--success)", score: 4, emoji: "😌" },
  { key: "confusa" as MoodKey, label: "Confusa", color: "var(--chart-5)", score: 3, emoji: "😕" },
  { key: "ansiosa", label: "Ansiosa", color: "var(--primary)", score: 2, emoji: "😰" },
  { key: "triste", label: "Triste", color: "var(--mauve)", score: 2, emoji: "😢" },
  { key: "irritada", label: "Irritada", color: "var(--chart-3)", score: 2, emoji: "😠" },
  {
    key: "sobrecarregada",
    label: "Sobrecarregada",
    color: "var(--destructive)",
    score: 1,
    emoji: "😵‍💫",
  },
];

export function moodInfo(key: string) {
  return moods.find((m) => m.key === key);
}
