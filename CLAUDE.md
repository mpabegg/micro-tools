# Instruções para Claude — micro-tools

Este repo é uma coleção de micro-ferramentas web pessoais, publicadas em GitHub Pages sob o subcaminho `/<repo>/`. As regras abaixo são duras; respeite-as.

## Princípio: mínimo absoluto

- **Sem npm, sem bundler, sem dependências, sem framework.** Não introduza `package.json`, `node_modules`, build steps ou ferramentas de transpilação.
- Cada ferramenta é **um único arquivo `.html`** autossuficiente, com HTML, CSS e JS inline.
- Se algo pode ser um arquivo estático, deve ser.
- Única exceção tolerada: Google Fonts via `<link>`, com fallback de sistema na CSS.

## Caminhos relativos (sempre)

O site é servido em `https://mpabegg.github.io/micro-tools/`, ou seja, sob um subcaminho. **Nada de paths absolutos começando com `/`** — quebra em produção.

Aplica-se a tudo: `<link>`, `<script>`, `<a href>`, `fetch()`, registro do service worker, `start_url`/`scope` do manifest, lista de cache do SW. Sempre `./algo` ou `algo`.

## Convenções de código

- **localStorage:** uma chave única por ferramenta, padrão `<nome>_v1` (ex.: `sets_tracker_v1`). Nunca compartilhar chaves.
- **Estética:** dark + amber (`--bg:#0c0a09`, `--amber:#ff8a1f`). Veja as variáveis CSS no topo de cada `.html`.
- **Fontes:** Anton / Barlow Condensed / JetBrains Mono via Google Fonts, com fallback de sistema (`system-ui`, `monospace`).
- **PWA:** todo `.html` deve linkar `./manifest.json`, definir `theme-color`, e registrar `./sw.js` com `scope: "./"`.

## Service worker

- Único `sw.js` na raiz. Versão em `CACHE = "tools-vN"` — **bumpe N a cada mudança** no app-shell ou em arquivos cacheados, pra invalidar caches antigos no `activate`.
- Ao adicionar uma ferramenta, inclua-a em `APP_SHELL` no `sw.js` E bumpe o `CACHE`.
- Estratégia: cache-first para same-origin, stale-while-revalidate oportunista para fontes Google.

## Arquivo intocável

**`manual-de-estrategias.md` é pessoal e canônico.** Não edite, não leia para gerar respostas, não referencie no código, não inclua em caches do SW, não parseie nem cite. Trate como se não existisse. O `index.html` contém um bloco estático de lembrete de estratégia ("O Método" / "Quando Travar") com texto inline — é cópia manual curada, não derivada do manual.

## Ferramentas removidas

- `riff-trainer.html` — removido. Não recrie sem pedido explícito; não inclua em precache do SW.

## Fluxo ao adicionar uma ferramenta

1. Criar `nova.html` na raiz (base: copiar cabeçalho de uma ferramenta existente — metas PWA, manifest, ícone, snippet de registro do SW no final do `<body>`).
2. Adicionar card no `index.html` (há template comentado dentro de `.grid`).
3. Adicionar `"./nova.html"` em `APP_SHELL` em `sw.js`.
4. Bumpar `CACHE` em `sw.js`.
5. Commits pequenos e descritivos.

## Restrições gerais

- Não adicione documentação além de `README.md` e este arquivo, salvo pedido explícito.
- Não crie features especulativas. Implemente exatamente o que foi pedido.
- Não introduza backwards-compatibility shims gratuitos: este repo é pessoal e tem um único usuário.
