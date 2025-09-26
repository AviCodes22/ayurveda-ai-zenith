-- Update the send_notification_webhook function to set search_path
CREATE OR REPLACE FUNCTION public.send_notification_webhook()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
  user_email text;
BEGIN
  -- Get the user's email from the auth.users table
  SELECT email INTO user_email FROM auth.users WHERE id = NEW.user_id;

  -- Send a POST request to the n8n webhook
  PERFORM net.http_post(
    'https://harshn8n.app.n8n.cloud/webhook-test/35527606-726b-41c4-9170-67baea4f030b', -- <<< REPLACE THIS WITH YOUR N8N URL
    json_build_object(
      'email', user_email,
      'title', NEW.title,
      'message', NEW.message
    )::text,
    '{}'::jsonb,
    '{"Content-Type": "application/json"}'::jsonb
  );

  RETURN NEW;
END;
$function$;