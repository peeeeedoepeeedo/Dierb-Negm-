CREATE TABLE "addresses" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"location_id" text,
	"label" text NOT NULL,
	"street" text NOT NULL,
	"building" text,
	"floor" text,
	"apartment" text,
	"landmark" text,
	"notes" text,
	"latitude" double precision,
	"longitude" double precision,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "answers" (
	"id" text PRIMARY KEY NOT NULL,
	"question_id" text NOT NULL,
	"author_id" text NOT NULL,
	"body" text NOT NULL,
	"is_accepted" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'published' NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"actor_id" text,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"metadata_json" text,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cart_items" (
	"id" text PRIMARY KEY NOT NULL,
	"cart_id" text NOT NULL,
	"product_id" text NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "carts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"store_id" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"parent_id" text,
	"name_ar" text NOT NULL,
	"slug" text NOT NULL,
	"icon" text,
	"entity_type" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "community_comments" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"author_id" text NOT NULL,
	"body" text NOT NULL,
	"status" text DEFAULT 'published' NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "community_likes" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "community_posts" (
	"id" text PRIMARY KEY NOT NULL,
	"author_id" text NOT NULL,
	"body" text NOT NULL,
	"location_id" text,
	"status" text DEFAULT 'published' NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "conversation_members" (
	"id" text PRIMARY KEY NOT NULL,
	"conversation_id" text NOT NULL,
	"user_id" text NOT NULL,
	"last_read_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" text PRIMARY KEY NOT NULL,
	"subject" text,
	"entity_type" text,
	"entity_id" text,
	"created_by" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "coupon_redemptions" (
	"id" text PRIMARY KEY NOT NULL,
	"coupon_id" text NOT NULL,
	"user_id" text NOT NULL,
	"order_id" text,
	"discount_amount" double precision NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "coupons" (
	"id" text PRIMARY KEY NOT NULL,
	"store_id" text NOT NULL,
	"code" text NOT NULL,
	"discount_type" text NOT NULL,
	"discount_value" double precision NOT NULL,
	"minimum_order" double precision DEFAULT 0 NOT NULL,
	"maximum_discount" double precision,
	"usage_limit" integer,
	"per_user_limit" integer DEFAULT 1 NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "favorites" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feature_flags" (
	"key" text PRIMARY KEY NOT NULL,
	"name_ar" text NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"description" text,
	"updated_by" text,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventory_movements" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"type" text NOT NULL,
	"quantity" integer NOT NULL,
	"reference_type" text,
	"reference_id" text,
	"actor_id" text,
	"note" text,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_applications" (
	"id" text PRIMARY KEY NOT NULL,
	"listing_id" text NOT NULL,
	"applicant_id" text NOT NULL,
	"cover_note" text NOT NULL,
	"status" text DEFAULT 'submitted' NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "listings" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"kind" text NOT NULL,
	"category_id" text,
	"location_id" text,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"price" double precision,
	"phone" text NOT NULL,
	"attributes_json" text DEFAULT '{}' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" text PRIMARY KEY NOT NULL,
	"parent_id" text,
	"type" text NOT NULL,
	"name_ar" text NOT NULL,
	"slug" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"conversation_id" text NOT NULL,
	"sender_id" text NOT NULL,
	"body" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "notification_preferences" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"in_app" boolean DEFAULT true NOT NULL,
	"email" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"entity_type" text,
	"entity_id" text,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "offers" (
	"id" text PRIMARY KEY NOT NULL,
	"store_id" text NOT NULL,
	"product_id" text,
	"category_id" text,
	"name" text NOT NULL,
	"scope" text NOT NULL,
	"discount_type" text NOT NULL,
	"discount_value" double precision NOT NULL,
	"minimum_order" double precision DEFAULT 0 NOT NULL,
	"maximum_discount" double precision,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"product_id" text NOT NULL,
	"name_snapshot" text NOT NULL,
	"unit_price" double precision NOT NULL,
	"quantity" integer NOT NULL,
	"line_total" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_status_history" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"from_status" text,
	"to_status" text NOT NULL,
	"changed_by" text NOT NULL,
	"note" text,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"order_number" text NOT NULL,
	"customer_id" text NOT NULL,
	"store_id" text NOT NULL,
	"address_id" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"subtotal" double precision NOT NULL,
	"discount" double precision DEFAULT 0 NOT NULL,
	"delivery_fee" double precision DEFAULT 0 NOT NULL,
	"total" double precision NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"store_id" text NOT NULL,
	"category_id" text,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"sku" text,
	"price" double precision NOT NULL,
	"compare_at_price" double precision,
	"stock" integer DEFAULT 0 NOT NULL,
	"unit" text DEFAULT 'قطعة' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"sponsored" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"full_name" text,
	"phone" text,
	"avatar_key" text,
	"status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "question_votes" (
	"id" text PRIMARY KEY NOT NULL,
	"question_id" text NOT NULL,
	"user_id" text NOT NULL,
	"value" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" text PRIMARY KEY NOT NULL,
	"author_id" text NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"category_id" text,
	"status" text DEFAULT 'open' NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" text PRIMARY KEY NOT NULL,
	"reporter_id" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"reason" text NOT NULL,
	"details" text,
	"status" text DEFAULT 'open' NOT NULL,
	"resolved_by" text,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"order_id" text,
	"rating" integer NOT NULL,
	"comment" text,
	"status" text DEFAULT 'published' NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "service_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"category_id" text,
	"location_id" text,
	"name" text NOT NULL,
	"profession" text NOT NULL,
	"description" text NOT NULL,
	"phone" text NOT NULL,
	"whatsapp" text,
	"price_from" double precision,
	"availability" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "service_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"address_id" text,
	"details" text NOT NULL,
	"preferred_at" timestamp with time zone,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "stores" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"category_id" text,
	"location_id" text,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"phone" text NOT NULL,
	"whatsapp" text,
	"address" text NOT NULL,
	"latitude" double precision,
	"longitude" double precision,
	"logo_key" text,
	"cover_key" text,
	"delivery_enabled" boolean DEFAULT false NOT NULL,
	"minimum_order" double precision DEFAULT 0 NOT NULL,
	"delivery_fee" double precision DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "subscription_plans" (
	"id" text PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name_ar" text NOT NULL,
	"price" double precision NOT NULL,
	"duration_days" integer NOT NULL,
	"trial_days" integer DEFAULT 0 NOT NULL,
	"features_json" text DEFAULT '[]' NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"store_id" text NOT NULL,
	"plan_id" text NOT NULL,
	"status" text NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "system_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"value_type" text NOT NULL,
	"public" boolean DEFAULT false NOT NULL,
	"updated_by" text,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "answers" ADD CONSTRAINT "answers_author_id_profiles_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_id_profiles_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cart_id_carts_id_fk" FOREIGN KEY ("cart_id") REFERENCES "public"."carts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "carts" ADD CONSTRAINT "carts_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_post_id_community_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_author_id_profiles_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_likes" ADD CONSTRAINT "community_likes_post_id_community_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_likes" ADD CONSTRAINT "community_likes_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_author_id_profiles_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_members" ADD CONSTRAINT "conversation_members_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_members" ADD CONSTRAINT "conversation_members_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_created_by_profiles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_redemptions" ADD CONSTRAINT "coupon_redemptions_coupon_id_coupons_id_fk" FOREIGN KEY ("coupon_id") REFERENCES "public"."coupons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_redemptions" ADD CONSTRAINT "coupon_redemptions_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_redemptions" ADD CONSTRAINT "coupon_redemptions_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feature_flags" ADD CONSTRAINT "feature_flags_updated_by_profiles_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_actor_id_profiles_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_applicant_id_profiles_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_owner_id_profiles_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_profiles_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_changed_by_profiles_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_profiles_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_votes" ADD CONSTRAINT "question_votes_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_votes" ADD CONSTRAINT "question_votes_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_author_id_profiles_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_profiles_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_resolved_by_profiles_id_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_profiles" ADD CONSTRAINT "service_profiles_owner_id_profiles_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_profiles" ADD CONSTRAINT "service_profiles_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_profiles" ADD CONSTRAINT "service_profiles_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_customer_id_profiles_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_provider_id_service_profiles_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."service_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_address_id_addresses_id_fk" FOREIGN KEY ("address_id") REFERENCES "public"."addresses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_owner_id_profiles_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stores" ADD CONSTRAINT "stores_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_store_id_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "public"."stores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_subscription_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."subscription_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "system_settings" ADD CONSTRAINT "system_settings_updated_by_profiles_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "addresses_user_idx" ON "addresses" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "answers_question_created_idx" ON "answers" USING btree ("question_id","created_at");--> statement-breakpoint
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE UNIQUE INDEX "cart_items_cart_product_uq" ON "cart_items" USING btree ("cart_id","product_id");--> statement-breakpoint
CREATE INDEX "carts_user_status_idx" ON "carts" USING btree ("user_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "carts_user_store_status_uq" ON "carts" USING btree ("user_id","store_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "categories_type_slug_uq" ON "categories" USING btree ("entity_type","slug");--> statement-breakpoint
CREATE INDEX "community_comments_post_created_idx" ON "community_comments" USING btree ("post_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "community_likes_post_user_uq" ON "community_likes" USING btree ("post_id","user_id");--> statement-breakpoint
CREATE INDEX "community_posts_status_created_idx" ON "community_posts" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "community_posts_author_idx" ON "community_posts" USING btree ("author_id");--> statement-breakpoint
CREATE UNIQUE INDEX "conversation_members_conversation_user_uq" ON "conversation_members" USING btree ("conversation_id","user_id");--> statement-breakpoint
CREATE INDEX "conversation_members_user_idx" ON "conversation_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "conversations_entity_idx" ON "conversations" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "coupon_redemptions_coupon_user_idx" ON "coupon_redemptions" USING btree ("coupon_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "coupon_redemptions_order_uq" ON "coupon_redemptions" USING btree ("order_id");--> statement-breakpoint
CREATE UNIQUE INDEX "coupons_store_code_uq" ON "coupons" USING btree ("store_id","code");--> statement-breakpoint
CREATE INDEX "coupons_store_dates_idx" ON "coupons" USING btree ("store_id","active","starts_at","ends_at");--> statement-breakpoint
CREATE UNIQUE INDEX "favorites_user_entity_uq" ON "favorites" USING btree ("user_id","entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "inventory_product_created_idx" ON "inventory_movements" USING btree ("product_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "job_applications_listing_applicant_uq" ON "job_applications" USING btree ("listing_id","applicant_id");--> statement-breakpoint
CREATE INDEX "listings_kind_status_created_idx" ON "listings" USING btree ("kind","status","created_at");--> statement-breakpoint
CREATE INDEX "listings_owner_idx" ON "listings" USING btree ("owner_id");--> statement-breakpoint
CREATE UNIQUE INDEX "locations_parent_slug_uq" ON "locations" USING btree ("parent_id","slug");--> statement-breakpoint
CREATE INDEX "locations_parent_idx" ON "locations" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "messages_conversation_created_idx" ON "messages" USING btree ("conversation_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "notification_preferences_user_type_uq" ON "notification_preferences" USING btree ("user_id","type");--> statement-breakpoint
CREATE INDEX "notifications_user_read_idx" ON "notifications" USING btree ("user_id","read_at");--> statement-breakpoint
CREATE INDEX "offers_store_status_dates_idx" ON "offers" USING btree ("store_id","status","starts_at","ends_at");--> statement-breakpoint
CREATE INDEX "order_items_order_idx" ON "order_items" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "order_history_order_idx" ON "order_status_history" USING btree ("order_id");--> statement-breakpoint
CREATE UNIQUE INDEX "orders_number_uq" ON "orders" USING btree ("order_number");--> statement-breakpoint
CREATE INDEX "orders_customer_idx" ON "orders" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "orders_store_status_idx" ON "orders" USING btree ("store_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "products_store_slug_uq" ON "products" USING btree ("store_id","slug");--> statement-breakpoint
CREATE INDEX "products_store_active_idx" ON "products" USING btree ("store_id","active");--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_email_uq" ON "profiles" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "question_votes_question_user_uq" ON "question_votes" USING btree ("question_id","user_id");--> statement-breakpoint
CREATE INDEX "questions_status_created_idx" ON "questions" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "questions_author_idx" ON "questions" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "reports_status_created_idx" ON "reports" USING btree ("status","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "reviews_user_entity_order_uq" ON "reviews" USING btree ("user_id","entity_type","entity_id","order_id");--> statement-breakpoint
CREATE INDEX "reviews_entity_status_idx" ON "reviews" USING btree ("entity_type","entity_id","status");--> statement-breakpoint
CREATE INDEX "service_profiles_owner_idx" ON "service_profiles" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "service_profiles_status_location_idx" ON "service_profiles" USING btree ("status","location_id");--> statement-breakpoint
CREATE INDEX "service_requests_customer_idx" ON "service_requests" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "service_requests_provider_status_idx" ON "service_requests" USING btree ("provider_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "stores_slug_uq" ON "stores" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "stores_owner_idx" ON "stores" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "stores_status_location_idx" ON "stores" USING btree ("status","location_id");--> statement-breakpoint
CREATE UNIQUE INDEX "subscription_plans_code_uq" ON "subscription_plans" USING btree ("code");--> statement-breakpoint
CREATE INDEX "subscriptions_store_status_idx" ON "subscriptions" USING btree ("store_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "user_roles_user_role_uq" ON "user_roles" USING btree ("user_id","role");--> statement-breakpoint
CREATE INDEX "user_roles_user_idx" ON "user_roles" USING btree ("user_id");