alter table access_rights add constraint access_rights_unique_name unique (name);
alter table roles add constraint roles_unique_name unique (name);
