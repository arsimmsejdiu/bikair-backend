delete
from user_settings
where user_id = 8507;
delete
from user_discounts
where user_id = 8507;
delete
from trip_reviews
where trip_id in (select id from trips where user_id = 8507);
delete
from trip_status
where trip_id in (select id from trips where user_id = 8507);
delete
from trips
where user_id = 8507;
delete
from trip_deposits
where user_id = 8507;
delete
from payment_methods
where user_id = 8507;
delete
from event_log
where metadata ->> 'phone'::text = '+33698406927'
   or metadata ->> 'phone'::text = '0698406927'
   or metadata -> 'user' ->> 'phone'::text = '+33698406927';
delete
from bookings
where user_id = 8507;
delete
from users
where id = 8507;