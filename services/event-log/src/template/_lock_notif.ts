const _lockNotif = (args) => {
    return `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Bikair-lock-report</title>
            </head>
            <body>
            <p>
            Date: ${args.date}
            <br><br>
            1) TECHNICIEN<br>
             - Nom : ${args.lastname}<br>
             - Prénom : ${args.firstname}<br>
             - Geolocalisation : <a target="_blank" href='${args.tech_link_address}'>${args.tech_address}</a><br>
            <br>
            2) VÉLO<br>
            - N° : ${args.bike_name}<br>
            - Status: ${args.bike_status}<br>
            - Geolocalisation: <a target="_blank" href='${args.bike_link_address}'>${args.bike_address}</a><br>
            <br>
        </html>`;
};

export default _lockNotif;
