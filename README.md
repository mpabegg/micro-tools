# micro-tools

Caixa de ferramentas web pessoais. Cada ferramenta é **um único arquivo `.html`** autossuficiente — sem build, sem framework, sem dependências. Publicado em [GitHub Pages](https://mpabegg.github.io/micro-tools/).

## Estrutura

```
.
├── index.html            # capa/hub — linka todas as ferramentas
├── sets-tracker.html     # tracker de sets de treino (localStorage: sets_tracker_v1)
├── riff-trainer.html     # metrônomo/trainer de riff (sem persistência)
├── manifest.json         # PWA manifest (caminhos relativos)
├── sw.js                 # service worker (app-shell cache-first)
├── icon.svg              # ícone do PWA
└── icon-maskable.svg     # ícone maskable (Android)
```

## Convenções

- **Um arquivo por ferramenta.** HTML + CSS + JS inline no mesmo `.html`. Sem npm, sem bundler.
- **Caminhos relativos.** O Pages serve em `/<repo>/`, então nada de paths absolutos (`/foo`). Sempre `./foo`.
- **localStorage com chave única.** Convenção: `<nome>_v1`. Não compartilhar chaves entre ferramentas.
- **Estética dark/amber.** Veja as variáveis CSS no topo dos `.html` existentes.
- **Fontes:** Google Fonts com `display=swap` + fallback de sistema. Funcionam offline via cache do SW; sem rede, caem no fallback.

## Adicionar uma ferramenta

1. Criar `minha-ferramenta.html` na raiz. Pegue o cabeçalho de uma ferramenta existente como base (metas PWA, manifest, ícone, registro do SW no rodapé).
2. Copiar um card no `index.html` (tem template comentado dentro do `<div class="grid">`).
3. Adicionar o caminho ao `APP_SHELL` em `sw.js` e bumpar `CACHE` (`tools-v1` → `tools-v2`) pra invalidar caches antigos.
4. Commitar e dar push — o Pages publica sozinho.

## Rodar local

Precisa servir por HTTP pra o service worker funcionar (`file://` não registra SW):

```sh
python3 -m http.server 8000
# abre http://localhost:8000/
```

## Publicação

GitHub Pages serve a branch `main` direto da raiz. URL: `https://mpabegg.github.io/micro-tools/`. Não há pipeline — push em `main` publica.

## PWA / offline

Service worker registrado em todas as páginas faz cache do app-shell na instalação. Após a primeira visita online, as ferramentas abrem offline. Para forçar atualização após mudanças, bumpe a versão de `CACHE` em `sw.js`.
