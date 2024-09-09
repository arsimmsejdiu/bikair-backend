# PUSH NOTIFICATION v2

## Env ---

Créer un fichier `.env` à la racine du projet

```dotenv
NODE_ENV=develop
APP_NOTIFY_CLIENT_EMAIL=firebase-adminsdk-1q63r@bikair-8c4ba.iam.gserviceaccount.com
APP_NOTIFY_CLIENT_ID=107754577452436409335
APP_NOTIFY_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDk4WOg/QLxvqFX\nT0d4nyM2hPDs5beKfzNu6semm48vGl2BFHrJYn92BFbTDaVM5v+MoE+/Zks11gO4\nR2OuyIZdAQwn6yjtTk+NT0h2lYbtCABgAORHKmqW0JpiKz+VwYGGtOewm7fJ5k7D\nbxMrdhaF7XEOBJCpRQ081+zwu3upaQlTHziXDubrTIX+tQz37U6gUGH0wipQaW3/\nZc5DXzWjs7Q+dpsZHZKUJtRitA1XELgxwQS8UqQqx6CMxk+Kb3PIxAM6Xq9LUNo3\nRP8ZF0m0vsr93JqeZXyoG+XDb8HnWuODUr3n97RdAHGNT1WiVMs5Fz6lhSl+1yHY\n2YXHDAZjAgMBAAECggEAA9y3eu93k+fhKtxYMPpgoMayDK8pC7/45PFxz92QXCnZ\nYnX0M2P7/ciObDSbKkbF6WU6W+LiRysEToOParWVm3Y8BlDhMjA9hriQ4uNhbr/4\nn3620ZGvKet9Sx4+jhZ8LWV3tCt9IBtShXaSevgmp4fRJV8jz3gG3Qru9OKqjc35\nWBtqVe8lU4cTkpHp/23L0ZY/0M7wA5Vy7mO8GIS8psRopp5ZtUxtXdKdhqqDvuTm\naFkwBQ0uXCD6i9XbrtiphaWALLRt8T/jX43jJeixQ298z4b4GspLoVr7pppks7LP\nFiO8OM37xhEs+rveiKBYuSQCGv7FO5o7ETmtSvYE6QKBgQD3EyinfnV+rUBqd35V\nMuovOHg28MeXzR65eu7WwSwa1klm+rIiv7HO2HfcdG8cvVxTGVx2EmastoLCIII4\n58jirrR0CWH52AJFKUJnB+Pe1XsHnRhCIhZc4IaLpXCPgtpwytvX4NFf6TTR6pZe\ng0+ve78LMNtQM1tBseQ+s98DqwKBgQDtJfnvxjYXcr4QTXyxIyRvdOYdk2qlKRvX\nza8CIlJjOMtZqS1WzWayKYm+IH4zSlLb/Mm4xB9eZ2V8bi89w1gfXopljlC9pQb6\nrspCf8PKgDdNwqqg9jF8OXn2sxDDjzM1E4jF53EOU4FpZi2+MZfvELK8fxCPLTY4\ncJPOxo1QKQKBgHygBFSf++H+v8w0I9wTx340DKchwnt2cnX6ZTibzYRn7DRuZaYT\nbTu5gpQHgvhLJ6Oe2j2QQIwDr2b+ANF1UKXOm6UgCnR8mYCLNDxGBZGjut/3RIIv\nMXp9okAUHfe1eDuGh2eXteSb/BGaM2jO8UXBtHaPmUAV94TmlwttrSLrAoGAWKLc\nEvljmEoDrfY4R8DZymrH44AI2ShPRs6Svdp0Lq+4mY946bulyatq10wvvx3lcGHA\nR7XN/6vnq6VHNO+BTWA5nBGgLfGzdRjFcits05Aum3rJ6ZV7E3IsGr/84Qrx2cGu\nWkHR6MffU7SkHjVNE0aLd5aKauk8HcY+CIf/o1kCgYA5guUpa0R5rpEWeIZxbBeU\njlqWcGkuggfqJM7L/3Pva350X+SSiTObplXNykYX3zRT7BEBjsXHHeMq8+WMyO+5\nYOMCUdzP0gGM1R0ILEz2jrOZ/ohfx25YEcsmNVhZrUsAmplEeBDbDA6PK5+cPUvc\n+wcj50MYjN4pGvw76KtaGA==\n-----END PRIVATE KEY-----\n"
APP_NOTIFY_PRIVATE_KEY_ID=7415d7d345c68bc3cd13dd41414a5bdfa05c6edc
APP_NOTIFY_PROJECT_ID=bikair-8c4ba
APP_NOTIFY_TYPE=service_account
```

### Update device token

Nous sauvegardons les tokens des utilisateurs "client".

### Send notification

Function global qui sert a envoyer un simple message type "push-notification" avec firebase-admin.
Les messages sont envoyer par:
role: USER ou ADMIN
topics: INFORMATIONS ou PROMOTIONS
A la fin de l'envoi, les messages sont enregistre dans la base de donnees.

## Docs

https://rnfirebase.io/messaging/usage
https://notifee.app/react-native/docs/overview

### Deploy

serverless deploy function --function update-token --stage develop --aws-profile bikair
serverless deploy function --function push-notification --stage develop --aws-profile bikair
