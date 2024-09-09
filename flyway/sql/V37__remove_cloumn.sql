ALTER TABLE user_games
DROP COLUMN IF EXISTS achieved;

ALTER TABLE games
DROP COLUMN IF EXISTS level;

ALTER TABLE user_games DROP COLUMN IF EXISTS game_id;
ALTER TABLE user_games ADD COLUMN IF NOT EXISTS game_id integer NOT NULL;


ALTER TABLE user_games DROP COLUMN IF EXISTS status;
ALTER TABLE user_games ADD COLUMN IF NOT EXISTS status varchar(100) not null default 'ACTIVE';
