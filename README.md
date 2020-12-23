# Casher
 
## Como iniciar o bot

1. Primeiro você deve instalar todas as dependencias: 
```npm
npm install
```
ou
```npm
yarn add
```
2. Cria o arquivo `.env` na raíz do projeto e coloca dentro dele: 
```
TOKEN=seutokenaqui
```
3. Starta o bot 
```npm
npm start
```
ou
```npm
yarn start
```
---

## File config.json

O arquivo `config.json` possui algumas configurações importantes que podem ser alteradas, mas tomando cuidado para manter alguns valores com os mesmos tipos, caso o tipo seja alterado, provavelmente será acusado algum erro. Aqui passaremos uma espécie de interface para o `config.json`:
```ts
{
  "defaultCommandCooldownTime": number,
  "defaultCommandCooldownUsageLimit": number
}
```