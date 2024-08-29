# Aplicativo de Galeria de Fotos

Este repositório contém a **Funcionalidade de Galeria de Fotos** desenvolvido para dispositivos móveis, acompanhado por um servidor backend. O app permite que os usuários visualizem, enviem e organizem suas fotos de forma simples e intuitiva.

## Funcionalidades

- **Aplicativo Móvel**: Desenvolvido com [Expo](https://expo.dev/), o aplicativo oferece uma interface simples e amigável para navegação e gerenciamento de coleções de fotos.
- **Servidor Backend**: Criado utilizando [Node.js](https://nodejs.org/en) com [Nest](https://nestjs.com/), o servidor lida com autenticação de usuários, armazenamento de fotos e requisições API.
- **Gerenciamento de Fotos**: Os usuários podem fazer upload, adicionar e excluir fotos do álbum.
- **Design Responsivo**: Otimizado para diferentes tamanhos de tela, garantindo uma experiência fluida em todos os dispositivos móveis.

## Tecnologias Utilizadas

- **Frontend**: React Native, Expo
- **Backend**: Node.js, Nest
- **Banco de Dados**: Postgres
- **Armazenamento**: Nuvem local
- **Contêinerização**: Docker

## Começando

Para executar este projeto localmente, siga os passos abaixo:

1. Utilize o comando `docker compose up -d --build` para iniciar o servidor e o banco de dados.
2. Navegue até a pasta `mobile` com `cd mobile`.
3. Execute `npm install` para instalar as dependências necessárias.
4. Por fim, rode `npm run android` para iniciar o aplicativo no emulador Android ou em um dispositivo conectado.
