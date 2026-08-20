CREATE TABLE "ad_events" (
	"id" text PRIMARY KEY NOT NULL,
	"ad_id" text NOT NULL,
	"user_id" text,
	"type" text NOT NULL,
	"session_key" text,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "advertisements" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"store_id" text,
	"placement" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"title" text NOT NULL,
	"image_key" text,
	"target_url" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"approved_by" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "advertisements_dates_check" CHECK ("advertisements"."ends_at">"advertisements"."starts_at")
);
--> statement-breakpoint
CREATE TABLE "analytics_events" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"session_key" text,
	"event" text NOT NULL,
	"entity_type" text,
	"entity_id" text,
	"metadata_json" text DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deliveries" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"driver_id" text NOT NULL,
	"assigned_by" text NOT NULL,
	"status" text DEFAULT 'assigned' NOT NULL,
	"accepted_at" timestamp with time zone,
	"picked_up_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "driver_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"phone" text NOT NULL,
	"vehicle_type" text NOT NULL,
	"vehicle_plate" text,
	"available" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "payment_transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"subscription_id" text,
	"provider" text NOT NULL,
	"provider_reference" text,
	"amount" double precision NOT NULL,
	"currency" text DEFAULT 'EGP' NOT NULL,
	"status" text DEFAULT 'created' NOT NULL,
	"metadata_json" text DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "payment_transactions_amount_check" CHECK ("payment_transactions"."amount">=0)
);
--> statement-breakpoint
CREATE TABLE "recent_searches" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"query" text NOT NULL,
	"filters_json" text DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"ticket_id" text NOT NULL,
	"sender_id" text NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "support_tickets" (
	"id" text PRIMARY KEY NOT NULL,
	"requester_id" text NOT NULL,
	"assigned_admin_id" text,
	"subject" text NOT NULL,
	"priority" text DEFAULT 'normal' NOT NULL,
	"status" text DEFAULT 'open' NOT NULL,
	"closed_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "ad_events" ADD CONSTRAINT "ad_events_ad_id_advertisements_id_fk" FOREIGN KEY ("ad_id") REFERENCES "public"."advertisements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ad_events" ADD CONSTRAINT "ad_events_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "advertisements" ADD CONSTRAINT "advertisements_owner_id_profiles_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "advertisements" ADD CONSTRAINT "advertisements_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "advertisements" ADD CONSTRAINT "advertisements_approved_by_profiles_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_driver_id_driver_profiles_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."driver_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_assigned_by_profiles_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "driver_profiles" ADD CONSTRAINT "driver_profiles_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recent_searches" ADD CONSTRAINT "recent_searches_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_ticket_id_support_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."support_tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_sender_id_profiles_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_requester_id_profiles_id_fk" FOREIGN KEY ("requester_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_assigned_admin_id_profiles_id_fk" FOREIGN KEY ("assigned_admin_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ad_events_ad_type_created_idx" ON "ad_events" USING btree ("ad_id","type","created_at");--> statement-breakpoint
CREATE INDEX "advertisements_placement_status_dates_idx" ON "advertisements" USING btree ("placement","status","starts_at","ends_at");--> statement-breakpoint
CREATE INDEX "advertisements_owner_idx" ON "advertisements" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "analytics_event_created_idx" ON "analytics_events" USING btree ("event","created_at");--> statement-breakpoint
CREATE INDEX "analytics_entity_created_idx" ON "analytics_events" USING btree ("entity_type","entity_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "deliveries_order_uq" ON "deliveries" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "deliveries_driver_status_idx" ON "deliveries" USING btree ("driver_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "driver_profiles_user_uq" ON "driver_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "driver_profiles_available_status_idx" ON "driver_profiles" USING btree ("available","status");--> statement-breakpoint
CREATE UNIQUE INDEX "payment_transactions_provider_ref_uq" ON "payment_transactions" USING btree ("provider","provider_reference");--> statement-breakpoint
CREATE INDEX "recent_searches_user_created_idx" ON "recent_searches" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "support_messages_ticket_created_idx" ON "support_messages" USING btree ("ticket_id","created_at");--> statement-breakpoint
CREATE INDEX "support_tickets_requester_status_idx" ON "support_tickets" USING btree ("requester_id","status");--> statement-breakpoint
CREATE INDEX "support_tickets_assignee_status_idx" ON "support_tickets" USING btree ("assigned_admin_id","status");--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_status_check" CHECK ("profiles"."status" in ('active','suspended','deleted'));--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_check" CHECK ("user_roles"."role" in ('customer','merchant','service_provider','delivery','staff','moderator','admin','super_admin'));