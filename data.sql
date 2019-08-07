-- table
CREATE TABLE public.assignment
(
  node_id character(4), -- node id
  program_id character(4), -- program id
  updated timestamp with time zone DEFAULT CURRENT_TIMESTAMP
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.assignment
  OWNER TO postgres;
COMMENT ON COLUMN public.assignment.node_id IS 'node id';
COMMENT ON COLUMN public.assignment.program_id IS 'program id';
-- end create table

-- create function
CREATE OR REPLACE FUNCTION notify_event() RETURNS TRIGGER AS $$
  DECLARE
    record RECORD;
    payload JSON;
  BEGIN
    IF (TG_OP = 'DELETE') THEN
      record = OLD;
    ELSE
      record = NEW;
    END IF;

    payload = json_build_object('action', TG_OP, 'data', row_to_json(record)); -- [data] contain node_id, program_id, updated

    PERFORM pg_notify('events', payload::text);

    RETURN NULL;
  END;
$$ LANGUAGE plpgsql;
-- end create function

-- create trigger
CREATE TRIGGER assignment_notify_event
AFTER INSERT OR UPDATE OR DELETE ON assignment
    FOR EACH ROW EXECUTE PROCEDURE notify_event();
-- end create trigger