update product_variations
set description =
        '{
          "en": {
            "name": "Minute Pack",
            "title": "Use by the minute.",
            "label": "60 minutes",
            "frequency": "60 minute plan",
            "expires": "Valid for 30 days.",
            "description": "A round trip with Bik Air? Take advantage of our minute pack for stress-free meter use.",
            "describe": [
              "Buy Bik''air minutes in advance for even more flexibility",
              "Minutes counted down on each trip",
              "Take advantage of more advantageous rates with this pack",
              "Significant savings over time"
            ],
            "bond": null,
            "success_message": "Your purchase is confirmed. You can use your 60-minute pack until"
          },
          "fr": {
            "name": "Pack minutes",
            "title": "À utiliser à la minute.",
            "label": "60 minutes",
            "frequency": "Forfait de 60 minutes",
            "expire": "Valable 30 jours.",
            "description": "A round trip with Bik Air? Take advantage of our minute pack for stress-free meter use.",
            "describe": [
              "Achetez des minutes en Bik’air à l’avance pour toujours plus de flexibilité",
              "Des minutes décomptées à chaque trajet",
              "Profitez de tarifs plus avantageux avec ce pack",
              "Des économies non négligeables sur la durée"
            ],
            "obligation": null,
            "success_message": "Votre achat est confirmé. Vous pouvez utiliser votre pack de 60 minutes jusqu''au"
          }
        }'
where discount_type = 'PACK'
  and discount_value = 60;
update product_variations
set description =
        '{
          "en": {
            "name": "Minute Pack",
            "title": "Use by the minute.",
            "label": "120 minutes",
            "frequency": "120 minute plan",
            "expires": "Valid for 30 days.",
            "description": "A round trip with Bik Air? Take advantage of our minute pack for stress-free meter use.",
            "describe": [
              "Buy Bik''air minutes in advance for even more flexibility",
              "Minutes counted down on each trip",
              "Take advantage of more advantageous rates with this pack",
              "Significant savings over time"
            ],
            "bond": null,
            "success_message": "Your purchase is confirmed. You can use your 120-minute pack until"
          },
          "fr": {
            "name": "Pack minutes",
            "title": "À utiliser à la minute.",
            "label": "120 minutes",
            "frequency": "Forfait de 120 minutes",
            "expire": "Valable 30 jours.",
            "description": "Un aller-retour avec Bik Air ? Privilégiez notre pack de minutes pour une utilisation sans stress de compteur.",
            "describe": [
              "Achetez des minutes en Bik’air à l’avance pour toujours plus de flexibilité",
              "Des minutes décomptées à chaque trajet",
              "Profitez de tarifs plus avantageux avec ce pack",
              "Des économies non négligeables sur la durée"
            ],
            "obligation": null,
            "success_message": "Votre achat est confirmé. Vous pouvez utiliser votre pack de 120 minutes jusqu''au"
          }
        }'
where discount_type = 'PACK'
  and discount_value = 120;
update product_variations
set description =
        '{
          "en": {
            "name": "Minute Pack",
            "title": "Use by the minute.",
            "label": "240 minutes",
            "frequency": "240 minute plan",
            "expires": "Valid for 30 days.",
            "description": "A round trip with Bik Air? Take advantage of our minute pack for stress-free meter use.",
            "describe": [
              "Buy Bik''air minutes in advance for even more flexibility",
              "Minutes counted down on each trip",
              "Take advantage of more advantageous rates with this pack",
              "Significant savings over time"
            ],
            "bond": null,
            "success_message": "Your purchase is confirmed. You can use your 240-minute pack until"
          },
          "fr": {
            "name": "Pack minutes",
            "title": "À utiliser à la minute.",
            "label": "240 minutes",
            "frequency": "Forfait de 240 minutes",
            "expire": "Valable 30 jours.",
            "description": "Un aller-retour avec Bik Air ? Privilégiez notre pack de minutes pour une utilisation sans stress de compteur.",
            "describe": [
              "Achetez des minutes en Bik’air à l’avance pour toujours plus de flexibilité",
              "Des minutes décomptées à chaque trajet",
              "Profitez de tarifs plus avantageux avec ce pack",
              "Des économies non négligeables sur la durée"
            ],
            "obligation": null,
            "success_message": "Votre achat est confirmé. Vous pouvez utiliser votre pack de 240 minutes jusqu''au"
          }
        }'
where discount_type = 'PACK'
  and discount_value = 240;

update product_variations
set description =
        '{
          "en": {
            "name": "Travel Pack",
            "title": "30 min max / trip",
            "label": "5 trips",
            "frequency": "5 trips",
            "expires": "Valid for 30 days.",
            "description": "A round trip with Bik Air? Choose our travel pack for stress-free meter use.",
            "describe": [
              "Bik''ez serenely, buy your trips in a pack for more savings",
              "Choose your number of journeys in advance",
              "Take your time on your electric bike",
              "30 minutes max / journey"
            ],
            "bond": null,
            "success_message": "Your purchase is confirmed. You can use your 5-ride pack until"
          },
          "fr": {
            "name": "Pack trajets",
            "title": "30 min max / trajet",
            "label": "5 trajets",
            "frequency": "5 trajets",
            "expire": "Valable 30 jours.",
            "description": "Un aller-retour avec Bik Air ? Privilégiez notre pack de trajet pour une utilisation sans stress de compteur.",
            "describe": [
              "Bik’ez sereinement, achetez vos trajets en pack pour plus d’économies",
              "Choisissez votre nombre de trajets à l’avance",
              "Prenez votre temps sur votre vélo électrique",
              "30 minutes max / trajet"
            ],
            "obligation": null,
            "success_message": "Votre achat est confirmé. Vous pouvez utiliser votre pack de 5 trajets jusqu''au"
          }
        }'
where discount_type = 'ONE_SHOT'
  and max_usage = 5;
update product_variations
set description =
        '{
          "en": {
            "name": "Travel Pack",
            "title": "30 min max / trip",
            "label": "10 trips",
            "frequency": "10 trips",
            "expires": "Valid for 30 days.",
            "description": "A round trip with Bik Air? Choose our travel pack for stress-free meter use.",
            "describe": [
              "Bik''ez serenely, buy your trips in a pack for more savings",
              "Choose your number of journeys in advance",
              "Take your time on your electric bike",
              "30 minutes max / journey"
            ],
            "bond": null,
            "success_message": "Your purchase is confirmed. You can use your 10-ride pack until"
          },
          "fr": {
            "name": "Pack trajets",
            "title": "30 min max / trajet",
            "label": "10 trajets",
            "frequency": "10 trajets",
            "expire": "Valable 30 jours.",
            "description": "Un aller-retour avec Bik Air ? Privilégiez notre pack de trajet pour une utilisation sans stress de compteur.",
            "describe": [
              "Bik’ez sereinement, achetez vos trajets en pack pour plus d’économies",
              "Choisissez votre nombre de trajets à l’avance",
              "Prenez votre temps sur votre vélo électrique",
              "30 minutes max / trajet"
            ],
            "obligation": null,
            "success_message": "Votre achat est confirmé. Vous pouvez utiliser votre pack de 10 trajets jusqu''au"
          }
        }'
where discount_type = 'ONE_SHOT'
  and max_usage = 10;
update product_variations
set description =
        '{
          "en": {
            "name": "Travel Pack",
            "title": "30 min max / trip",
            "label": "20 trips",
            "frequency": "20 trips",
            "expires": "Valid for 30 days.",
            "description": "A round trip with Bik Air? Choose our travel pack for stress-free meter use.",
            "describe": [
              "Bik''ez serenely, buy your trips in a pack for more savings",
              "Choose your number of journeys in advance",
              "Take your time on your electric bike",
              "30 minutes max / journey"
            ],
            "bond": null,
            "success_message": "Your purchase is confirmed. You can use your 20-ride pack until"
          },
          "fr": {
            "name": "Pack trajets",
            "title": "30 min max / trajet",
            "label": "20 trajets",
            "frequency": "20 trajets",
            "expire": "Valable 30 jours.",
            "description": "Un aller-retour avec Bik Air ? Privilégiez notre pack de trajet pour une utilisation sans stress de compteur.",
            "describe": [
              "Bik’ez sereinement, achetez vos trajets en pack pour plus d’économies",
              "Choisissez votre nombre de trajets à l’avance",
              "Prenez votre temps sur votre vélo électrique",
              "30 minutes max / trajet"
            ],
            "obligation": null,
            "success_message": "Votre achat est confirmé. Vous pouvez utiliser votre pack de 20 trajets jusqu''au"
          }
        }'
where discount_type = 'ONE_SHOT'
  and max_usage = 20;
insert into product_variations (product_id, description, price, status, discount_id, max_usage, discount_type,
                                discount_value)
    (select product_id,
            '{
                   "en": {
                     "name": "Travel Pack",
                     "title": "30 min max / trip",
                     "label": "2 trips",
                     "frequency": "2 trips",
                     "expires": "Valid for 30 days.",
                     "description": "A round trip with Bik Air? Choose our travel pack for stress-free meter use.",
                     "describe": [
                       "Bik''ez serenely, buy your trips in a pack for more savings",
                       "Choose your number of journeys in advance",
                       "Take your time on your electric bike",
                       "30 minutes max / journey"
                     ],
                     "bond": null,
                     "success_message": "Your purchase is confirmed. You can use your 2-ride pack until"
                   },
                   "fr": {
                     "name": "Pack trajets",
                     "title": "30 min max / trajet",
                     "label": "2 trajets",
                     "frequency": "2 trajets",
                     "expire": "Valable 30 jours.",
                     "description": "Un aller-retour avec Bik Air ? Privilégiez notre pack de trajet pour une utilisation sans stress de compteur.",
                     "describe": [
                       "Bik’ez sereinement, achetez vos trajets en pack pour plus d’économies",
                       "Choisissez votre nombre de trajets à l’avance",
                       "Prenez votre temps sur votre vélo électrique",
                       "30 minutes max / trajet"
                     ],
                     "obligation": null,
                     "success_message": "Votre achat est confirmé. Vous pouvez utiliser votre pack de 2 trajets jusqu''au"
                   }
                 }',
            299,
            'ACTIVE',
            discount_id,
            2,
            discount_type,
            discount_value
     from product_variations
     where discount_type = 'ONE_SHOT'
       and max_usage = 20);
