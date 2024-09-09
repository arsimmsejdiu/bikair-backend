UPDATE products set description = '{
  "en": {
    "name": "2-Trip Pass",
    "title": "Valid for 1 day",
    "frequency": "2 trips",
    "expire": "Valid for 1 day.",
    "description": "2 trips of 30 minutes maximum.\nNo unlocking fees!",
    "describe": [
      "No stress, take your time to ride",
      "Save up to 3€ per trip",
      "30 minutes per trip, this is huuuge!",
      "Enjoy your 2 trips for 1 day"
    ],
    "obligation": null,
    "success_message": "Your purchase is confirmed. You can use your 2-trip pass until",
    "price": 399
  },
  "fr": {
    "name": "Pass 2 Trajets",
    "title": "Valable 1 jour",
    "frequency": "2 trajets",
    "expire": "Valable 1 jour.",
    "description": "2 trajets de 30 minutes maximum.\nPas de frais de déverrouillage !",
    "describe": [
      "Pas de stress, prenez votre temps pour rouler",
      "Economisez jusqu''a 3€ par trajet",
      "30 minutes par trajet, vous êtes laaaarge !",
      "Profitez de vos 2 trajets pendant 1 jour"
    ],
    "obligation": null,
    "success_message": "Votre achat est confirmé. Vous pouvez utiliser votre Pass 2 trajets jusqu''au",
    "price": 399
  }
}' where name = 'DAY_PASS';

UPDATE products set description = '{
  "en": {
    "name": "Minute Pack",
    "price": 900,
    "title": "Use by the minute.",
    "label": "60 minutes",
    "frequency": "60 minute plan",
    "expire": "Valid for 30 days.",
    "description": "Use the minutes whenever you like.\nNo unlocking fees!",
    "describe": [
      "Buy Bik''air minutes in advance for even more flexibility",
      "Minutes counted down on each trip",
      "Take advantage of more advantageous rates with this pack",
      "Significant savings over time"
    ],
    "obligation": null,
    "success_message": "Your purchase is confirmed. You can use your 60-minute pack until"
  },
  "fr": {
    "name": "Pack minutes",
    "price": 900,
    "title": "À utiliser à la minute.",
    "label": "60 minutes",
    "frequency": "Forfait de 60 minutes",
    "expire": "Valable 30 jours.",
    "description": "Utilisez les minutes quand vous voulez.\nPas de frais de déverrouillage sur vos trajets !",
    "describe": [
      "Achetez des minutes en Bik’air à l’avance pour toujours plus de flexibilité",
      "Des minutes décomptées à chaque trajet",
      "Profitez de tarifs plus avantageux avec ce pack",
      "Des économies non négligeables sur la durée"
    ],
    "obligation": null,
    "success_message": "Votre achat est confirmé. Vous pouvez utiliser votre pack de 60 minutes jusqu''au"
  }
}' where name = 'PACK_MINUTES';
UPDATE product_variations set description = '{
  "en": {
    "name": "Minute Pack",
    "price": 900,
    "title": "Use by the minute.",
    "label": "60 minutes",
    "frequency": "60 minute plan",
    "expire": "Valid for 30 days.",
    "description": "Use the minutes whenever you like.\nNo unlocking fees!",
    "describe": [
      "Buy Bik''air minutes in advance for even more flexibility",
      "Minutes counted down on each trip",
      "Take advantage of more advantageous rates with this pack",
      "Significant savings over time"
    ],
    "obligation": null,
    "success_message": "Your purchase is confirmed. You can use your 60-minute pack until"
  },
  "fr": {
    "name": "Pack minutes",
    "price": 900,
    "title": "À utiliser à la minute.",
    "label": "60 minutes",
    "frequency": "Forfait de 60 minutes",
    "expire": "Valable 30 jours.",
    "description": "Utilisez les minutes quand vous voulez.\nPas de frais de déverrouillage sur vos trajets !",
    "describe": [
      "Achetez des minutes en Bik’air à l’avance pour toujours plus de flexibilité",
      "Des minutes décomptées à chaque trajet",
      "Profitez de tarifs plus avantageux avec ce pack",
      "Des économies non négligeables sur la durée"
    ],
    "obligation": null,
    "success_message": "Votre achat est confirmé. Vous pouvez utiliser votre pack de 60 minutes jusqu''au"
  }
}' where product_id = (SELECT id from products where name = 'PACK_MINUTES') AND discount_value = 60;
UPDATE product_variations set description = '{
  "en": {
    "name": "Minute Pack",
    "price": 1600,
    "title": "Use by the minute.",
    "label": "120 minutes",
    "frequency": "120 minute plan",
    "expire": "Valid for 30 days.",
    "description": "Use the minutes whenever you like.\nNo unlocking fees!",
    "describe": [
      "Buy Bik''air minutes in advance for even more flexibility",
      "Minutes counted down on each trip",
      "Take advantage of more advantageous rates with this pack",
      "Significant savings over time"
    ],
    "obligation": null,
    "success_message": "Your purchase is confirmed. You can use your 120-minute pack until"
  },
  "fr": {
    "name": "Pack minutes",
    "price": 1600,
    "title": "À utiliser à la minute.",
    "label": "120 minutes",
    "frequency": "Forfait de 120 minutes",
    "expire": "Valable 30 jours.",
    "description": "Utilisez les minutes quand vous voulez.\nPas de frais de déverrouillage sur vos trajets !",
    "describe": [
      "Achetez des minutes en Bik’air à l’avance pour toujours plus de flexibilité",
      "Des minutes décomptées à chaque trajet",
      "Profitez de tarifs plus avantageux avec ce pack",
      "Des économies non négligeables sur la durée"
    ],
    "obligation": null,
    "success_message": "Votre achat est confirmé. Vous pouvez utiliser votre pack de 120 minutes jusqu''au"
  }
}' where product_id = (SELECT id from products where name = 'PACK_MINUTES') AND discount_value = 120;
UPDATE product_variations set description = '{
  "en": {
    "name": "Minute Pack",
    "price": 2800,
    "title": "Use by the minute.",
    "label": "240 minutes",
    "frequency": "240 minute plan",
    "expire": "Valid for 30 days.",
    "description": "Use the minutes whenever you like.\nNo unlocking fees!",
    "describe": [
      "Buy Bik''air minutes in advance for even more flexibility",
      "Minutes counted down on each trip",
      "Take advantage of more advantageous rates with this pack",
      "Significant savings over time"
    ],
    "obligation": null,
    "success_message": "Your purchase is confirmed. You can use your 240-minute pack until"
  },
  "fr": {
    "name": "Pack minutes",
    "price": 2800,
    "title": "À utiliser à la minute.",
    "label": "240 minutes",
    "frequency": "Forfait de 240 minutes",
    "expire": "Valable 30 jours.",
    "description": "Utilisez les minutes quand vous voulez.\nPas de frais de déverrouillage sur vos trajets !",
    "describe": [
      "Achetez des minutes en Bik’air à l’avance pour toujours plus de flexibilité",
      "Des minutes décomptées à chaque trajet",
      "Profitez de tarifs plus avantageux avec ce pack",
      "Des économies non négligeables sur la durée"
    ],
    "obligation": null,
    "success_message": "Votre achat est confirmé. Vous pouvez utiliser votre pack de 240 minutes jusqu''au"
  }
}' where product_id = (SELECT id from products where name = 'PACK_MINUTES') AND discount_value = 240;
