# Not!ce

## Prerequisites

- [Node.js 20](https://nodejs.org/en/download/)

  - It's recommended to use [nvm](https://github.com/nvm-sh/nvm) to manage your Node.js versions

    ```bash
    nvm install v20.10.0
    ```

- [pnpm](https://pnpm.io/installation)

## Developing

1. Clone the repository

   ```bash
   # Clone with SSH
   git clone git@github.com:notice-project/notice.git

   # Clone with HTTPS
   git clone https://github.com/notice-project/notice.git
   ```

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Start the development server

   ```bash
   pnpm dev
   ```

   Or, if you want to start the server and open the app in a new browser tab:

   ```bash
   pnpm dev -- --open
   ```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
Test Cloudflare Preview
