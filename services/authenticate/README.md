# Authenticate Documentation v2

Microservice des services lié à l'authentification et la création des utilisateurs

Plus d'info sur le [WIKI](https://gitlab.com/bikairproject/microservices/authenticate/-/wikis/home)

Microservice qui gère les différente requête autour de l'authentification et l'enregistrement d'utilisateurs.

## I. Configuration

Pour tester en local il faut un fichier `.env` avec les valeures suivante :

```dotenv
#Environement
NODE_ENV=develop

#Clef JWT
JWT_SECRET_TMP=xxxxx
JWT_SECRET=xxxxx

#Nom des lambda appelé
MICROSERVICE_SEND_NOTIFICATION=bikair-send-notification-production-microservice
```

## II. Authorizer

Ces service est couvert par l'authorizer api-key :

- /phone
- /confirm
- /logout
- /login

Il faut avoir les header suivants :

- `x-api-key` : Clef d'api
- `x-origin` : avec la valeur du type de la clef d'api

Ces service est couvert par l'authorizer token :

- /register

Il faut avoir les header suivants :

- `Authorization` : token d'authentification au format `Bearer <token>`
- `x-api-key` : Clef d'api
- `x-origin` : avec la valeur du type de la clef d'api

## III. Endpoints

- [[POST] /phone](endpoints/[POST] phone)
- [[POST] /confirm](endpoints/[POST] confirm)
- [[POST] /logout](endpoints/[POST] logout)
- [[POST] /login](endpoints/[POST] login)
- [[POST] /register](endpoints/[POST] register)
