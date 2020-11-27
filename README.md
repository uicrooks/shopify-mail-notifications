<!-- logo (start) -->
<p align="center">
  <img src=".github/img/logo.svg" width="180px">
</p>

<p align="center">
  <img src=".github/img/banner.svg" width="450px">
</p>
<!-- logo (end) -->

<!-- title / description (start) -->
<h2 align="center">Shopify Notifications</h2>

Blazing fast mail templating environment for Shopify mail notifications with Liquid, ✉ MJML + 🌿 Twig. Create responsive emails quickly with less code.
<!-- title / description (end) -->

<!-- features (start) -->
## Features
- MJML
- Twig
- Liquid
- Yaml
- Webpack
- Webpack-dev-server
- Ready to use shopify mail notification templates
<!-- features (end) -->

<!-- system requirements (start) -->
## System requirements
- Node.js
- npm or yarn
<!-- system requirements (end) -->

<!-- getting started (start) -->
## Getting started
Install dependencies and run webpack-dev-server:

### npm

```shell
$ npm install
```

```shell
$ npm run dev
```

### yarn

```shell
$ yarn import # migrate package-lock.json to yarn.lock
$ rm package-lock.json # or delete manually
$ yarn install
```

```shell
$ yarn dev
```

### Optional
If the server port is already in use, adjust `devServerPort` in `package.json`
<!-- getting started (end) -->

<!-- production (start) -->
## Production
Generate minified `.html` files in `dist/` directory:

### npm

```shell
$ npm run build
```

### yarn

```shell
$ yarn build
```
<!-- production (end) -->

<!-- directories (start) -->
## Directories
| Directory | Description |
| --- | --- |
| .config | Contains webpack configs. |
| src | Contains webpack's main entry point `main.js` which auto-loads all `.twig` files inside `src/templates/` and all it's subdirectories. |
| src/assets | Contains images (used only during development). |
| src/components | Contains reusable components. |
| src/data | Contains `.yml` files. The contents are accessible in all `.twig` files. |
| src/data/shopify | Contains `data.yml` file with Shopify dummy data (used during development to preview liquid templates). |
| src/layouts | Contains layouts. |
| src/templates | Contains mail templates. The `index.twig` template is reserved for navigation. |
<!-- directories (end) -->

<!-- documentation (start) -->
## Documentation

### Additional Docs
- [MJML docs](https://documentation.mjml.io/)
- [Twig docs](https://twig.symfony.com/doc/2.x/)
- [Liquid docs](https://shopify.github.io/liquid/)
<!-- documentation (end) -->

<!-- limitations (start) -->
## Limitations
- If you change data in files inside `src/data/shopify/` you have to restart webpack.
- It's not possible to set `shop.email_accent_color` to change it later in Shopify.
- `POS Exchange Receipt` template doesn't work.
<!-- limitations (end) -->