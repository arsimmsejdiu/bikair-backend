insert into access_rights (name, category, description)
values ('AVAILABLE_READ', 'BIKE_STATUS_READ', 'Permission de voir les vélo possédant ce status');
insert into access_rights (name, category, description)
values ('MAINTENANCE_READ', 'BIKE_STATUS_READ', 'Permission de voir les vélo possédant ce status');
insert into access_rights (name, category, description)
values ('BOOKED_READ', 'BIKE_STATUS_READ', 'Permission de voir les vélo possédant ce status');
insert into access_rights (name, category, description)
values ('USED_READ', 'BIKE_STATUS_READ', 'Permission de voir les vélo possédant ce status');
insert into access_rights (name, category, description)
values ('STOLEN_READ', 'BIKE_STATUS_READ', 'Permission de voir les vélo possédant ce status');
insert into access_rights (name, category, description)
values ('NOT_FOUND_READ', 'BIKE_STATUS_READ', 'Permission de voir les vélo possédant ce status');
insert into access_rights (name, category, description)
values ('PREPARATION_READ', 'BIKE_STATUS_READ', 'Permission de voir les vélo possédant ce status');
insert into access_rights (name, category, description)
values ('WAIT_DEPLOY_READ', 'BIKE_STATUS_READ', 'Permission de voir les vélo possédant ce status');
insert into access_rights (name, category, description)
values ('DAMAGED_READ', 'BIKE_STATUS_READ', 'Permission de voir les vélo possédant ce status');

insert into access_rights (name, category, description)
values ('AVAILABLE_WRITE', 'BIKE_STATUS_WRITE', 'Permission de modifier les vélo pour y affecter ce status');
insert into access_rights (name, category, description)
values ('MAINTENANCE_WRITE', 'BIKE_STATUS_WRITE', 'Permission de modifier les vélo pour y affecter ce status');
insert into access_rights (name, category, description)
values ('BOOKED_WRITE', 'BIKE_STATUS_WRITE', 'Permission de modifier les vélo pour y affecter ce status');
insert into access_rights (name, category, description)
values ('USED_WRITE', 'BIKE_STATUS_WRITE', 'Permission de modifier les vélo pour y affecter ce status');
insert into access_rights (name, category, description)
values ('STOLEN_WRITE', 'BIKE_STATUS_WRITE', 'Permission de modifier les vélo pour y affecter ce status');
insert into access_rights (name, category, description)
values ('NOT_FOUND_WRITE', 'BIKE_STATUS_WRITE', 'Permission de modifier les vélo pour y affecter ce status');
insert into access_rights (name, category, description)
values ('PREPARATION_WRITE', 'BIKE_STATUS_WRITE', 'Permission de modifier les vélo pour y affecter ce status');
insert into access_rights (name, category, description)
values ('WAIT_DEPLOY_WRITE', 'BIKE_STATUS_WRITE', 'Permission de modifier les vélo pour y affecter ce status');
insert into access_rights (name, category, description)
values ('DAMAGED_WRITE', 'BIKE_STATUS_WRITE', 'Permission de modifier les vélo pour y affecter ce status');

insert into access_rights (name, category, description)
values ('PRIORITY_READ', 'BIKE_TAG_READ', 'Permission de voir les vélo possédant ce tag');
insert into access_rights (name, category, description)
values ('WORKSHOP_READ', 'BIKE_TAG_READ', 'Permission de voir les vélo possédant ce tag');
insert into access_rights (name, category, description)
values ('TO_SPOT_READ', 'BIKE_TAG_READ', 'Permission de voir les vélo possédant ce tag');
insert into access_rights (name, category, description)
values ('CONTROL_READ', 'BIKE_TAG_READ', 'Permission de voir les vélo possédant ce tag');
insert into access_rights (name, category, description)
values ('CONTROLLED_READ', 'BIKE_TAG_READ', 'Permission de voir les vélo possédant ce tag');
insert into access_rights (name, category, description)
values ('COLLECT_READ', 'BIKE_TAG_READ', 'Permission de voir les vélo possédant ce tag');
insert into access_rights (name, category, description)
values ('COLLECTED_READ', 'BIKE_TAG_READ', 'Permission de voir les vélo possédant ce tag');
insert into access_rights (name, category, description)
values ('BATTERY_LOW_READ', 'BIKE_TAG_READ', 'Permission de voir les vélo possédant ce tag');
insert into access_rights (name, category, description)
values ('CLIENT_REVIEW_READ', 'BIKE_TAG_READ', 'Permission de voir les vélo possédant ce tag');

insert into access_rights (name, category, description)
values ('PRIORITY_WRITE', 'BIKE_TAG_WRITE', 'Permission de modifier les vélo pour y affecter ce tag');
insert into access_rights (name, category, description)
values ('WORKSHOP_WRITE', 'BIKE_TAG_WRITE', 'Permission de modifier les vélo pour y affecter ce tag');
insert into access_rights (name, category, description)
values ('TO_SPOT_WRITE', 'BIKE_TAG_WRITE', 'Permission de modifier les vélo pour y affecter ce tag');
insert into access_rights (name, category, description)
values ('CONTROL_WRITE', 'BIKE_TAG_WRITE', 'Permission de modifier les vélo pour y affecter ce tag');
insert into access_rights (name, category, description)
values ('CONTROLLED_WRITE', 'BIKE_TAG_WRITE', 'Permission de modifier les vélo pour y affecter ce tag');
insert into access_rights (name, category, description)
values ('COLLECT_WRITE', 'BIKE_TAG_WRITE', 'Permission de modifier les vélo pour y affecter ce tag');
insert into access_rights (name, category, description)
values ('COLLECTED_WRITE', 'BIKE_TAG_WRITE', 'Permission de modifier les vélo pour y affecter ce tag');
insert into access_rights (name, category, description)
values ('BATTERY_LOW_WRITE', 'BIKE_TAG_WRITE', 'Permission de modifier les vélo pour y affecter ce tag');
insert into access_rights (name, category, description)
values ('CLIENT_REVIEW_WRITE', 'BIKE_TAG_WRITE', 'Permission de modifier les vélo pour y affecter ce tag');

insert into access_rights (name, category, description)
values ('COLLECTOR_REPORT', 'TECH_APP_FUNCTIONALITY', 'Accès au rapport collecteur dans l''application technicien');
insert into access_rights (name, category, description)
values ('CONTROLLER_REPORT', 'TECH_APP_FUNCTIONALITY', 'Accès au rapport contrôleur dans l''application technicien');
insert into access_rights (name, category, description)
values ('UPDATE_BIKE_TRACKER', 'TECH_APP_FUNCTIONALITY', 'Modifier le tracker du vélo dans l''app technicien');
insert into access_rights (name, category, description)
values ('UPDATE_BIKE_LOCK', 'TECH_APP_FUNCTIONALITY', 'Modifier le cadenas du vélo dans l''app technicien');
insert into access_rights (name, category, description)
values ('CREATE_BIKE', 'TECH_APP_FUNCTIONALITY', 'Créer un vélo dans l''app technicien');
insert into access_rights (name, category, description)
values ('LOCK_ACCESS', 'TECH_APP_FUNCTIONALITY', 'Ouvrir ou fermer le cadenas dans l''application technicien');
insert into access_rights (name, category, description)
values ('UPDATE_BIKE_CITY', 'TECH_APP_FUNCTIONALITY', 'Modifier la ville du vélo dans l''application technicien');
insert into access_rights (name, category, description)
values ('UPDATE_BIKE_STATUS', 'TECH_APP_FUNCTIONALITY', 'Modifier le status d''un vélo dans l''application technicien');
insert into access_rights (name, category, description)
values ('UPDATE_BIKE_TAGS', 'TECH_APP_FUNCTIONALITY', 'Modifier les tags d''un vélo dans l''application technicien');

insert into access_rights (name, category, description)
values ('BACKOFFICE_ACCESS', 'BACKOFFICE_FUNCTIONALITY', 'Droit d''accès au backoffice');
insert into access_rights (name, category, description)
values ('ADMINS_READ', 'BACKOFFICE_FUNCTIONALITY', 'Droit d''accès à la page du backoffice');
insert into access_rights (name, category, description)
values ('ADMINS_WRITE', 'BACKOFFICE_FUNCTIONALITY', 'Droit de modification sur la page du backoffice');
insert into access_rights (name, category, description)
values ('SPOTS_READ', 'BACKOFFICE_FUNCTIONALITY', 'Droit d''accès à la page du backoffice');
insert into access_rights (name, category, description)
values ('SPOTS_WRITE', 'BACKOFFICE_FUNCTIONALITY', 'Droit de modification sur la page du backoffice');
insert into access_rights (name, category, description)
values ('REPORTS_READ', 'BACKOFFICE_FUNCTIONALITY', 'Droit d''accès à la page du backoffice');
insert into access_rights (name, category, description)
values ('REPORTS_WRITE', 'BACKOFFICE_FUNCTIONALITY', 'Droit de modification sur la page du backoffice');
insert into access_rights (name, category, description)
values ('DISCOUNTS_READ', 'BACKOFFICE_FUNCTIONALITY', 'Droit d''accès à la page du backoffice');
insert into access_rights (name, category, description)
values ('DISCOUNTS_WRITE', 'BACKOFFICE_FUNCTIONALITY', 'Droit de modification sur la page du backoffice');
insert into access_rights (name, category, description)
values ('MARKETINGS_READ', 'BACKOFFICE_FUNCTIONALITY', 'Droit d''accès à la page du backoffice');
insert into access_rights (name, category, description)
values ('MARKETINGS_WRITE', 'BACKOFFICE_FUNCTIONALITY', 'Droit de modification sur la page du backoffice');
insert into access_rights (name, category, description)
values ('RATES_READ', 'BACKOFFICE_FUNCTIONALITY', 'Droit d''accès à la page du backoffice');
insert into access_rights (name, category, description)
values ('RATES_WRITE', 'BACKOFFICE_FUNCTIONALITY', 'Droit de modification sur la page du backoffice');
insert into access_rights (name, category, description)
values ('BIKES_READ', 'BACKOFFICE_FUNCTIONALITY', 'Droit d''accès à la page du backoffice');
insert into access_rights (name, category, description)
values ('BIKES_WRITE', 'BACKOFFICE_FUNCTIONALITY', 'Droit de modification sur la page du backoffice');
insert into access_rights (name, category, description)
values ('SUBSCRIPTIONS_READ', 'BACKOFFICE_FUNCTIONALITY', 'Droit d''accès à la page du backoffice');
insert into access_rights (name, category, description)
values ('SUBSCRIPTIONS_WRITE', 'BACKOFFICE_FUNCTIONALITY', 'Droit de modification sur la page du backoffice');
insert into access_rights (name, category, description)
values ('USERS_READ', 'BACKOFFICE_FUNCTIONALITY', 'Droit d''accès à la page du backoffice');
insert into access_rights (name, category, description)
values ('USERS_WRITE', 'BACKOFFICE_FUNCTIONALITY', 'Droit de modification sur la page du backoffice');
insert into access_rights (name, category, description)
values ('TRIPS_READ', 'BACKOFFICE_FUNCTIONALITY', 'Droit d''accès à la page du backoffice');
insert into access_rights (name, category, description)
values ('TRIPS_WRITE', 'BACKOFFICE_FUNCTIONALITY', 'Droit de modification sur la page du backoffice');
