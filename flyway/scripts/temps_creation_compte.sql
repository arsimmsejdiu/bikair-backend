select avg(e1.created_at - (select e2.created_at
                        from event_log e2
                        where e2.type = 'USER_CLICK_PHONE_VALIDATION'
                          and e1.created_at > e2.created_at
                        order by abs(extract(epoch from (e2.created_at - e1.created_at)))
                        limit 1)) as avg
from event_log e1
where e1.type = 'USER_CLICK_SUBSCRIPTION';