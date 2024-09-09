# alert-pending-trips

Microservice qui gère l'envoi de notification (mail, SMS, ...).  
Ce microservice reçoit une notification SNS déclanché par le microservice handle-notification.  
Les paramètre de notification sont vérifié en amont par notification-handler il est donc attendu que la requête soit bien
formé arrivé dans ce microservice.

## Process

1.  On récupère la notification
2.  En fonction du type on appel le service de notification correspondant
3.  On envoit la notification

.
