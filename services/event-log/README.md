# event-log v2

Microservice qui reçois les demande d'enregistrement d'évennement pour les stocker dans la table event_log.

Le format de donnée attendu est le suivant :

```json
{
  "data": {
    "user": {},
    "trip": {},
    ... // Toutes les donnée relative à l'evènement.
  },
  "type": "EVENT_TYPE" // Type de l'évènement
}
```
