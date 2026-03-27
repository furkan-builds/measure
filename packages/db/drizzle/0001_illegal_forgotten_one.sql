CREATE TABLE "servings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"food_id" uuid NOT NULL,
	"label" text NOT NULL,
	"amount_grams" real NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "food_log" ALTER COLUMN "food_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "food_log" ADD COLUMN "label" text NOT NULL;--> statement-breakpoint
ALTER TABLE "food_log" ADD COLUMN "calories" real NOT NULL;--> statement-breakpoint
ALTER TABLE "food_log" ADD COLUMN "protein" real;--> statement-breakpoint
ALTER TABLE "food_log" ADD COLUMN "carbs" real;--> statement-breakpoint
ALTER TABLE "food_log" ADD COLUMN "fat" real;--> statement-breakpoint
ALTER TABLE "food_log" ADD COLUMN "serving_id" uuid;--> statement-breakpoint
ALTER TABLE "food_log" ADD COLUMN "quantity" real;--> statement-breakpoint
ALTER TABLE "foods" ADD COLUMN "brand" text;--> statement-breakpoint
ALTER TABLE "foods" ADD COLUMN "calories_per_100g" real NOT NULL;--> statement-breakpoint
ALTER TABLE "foods" ADD COLUMN "protein_per_100g" real NOT NULL;--> statement-breakpoint
ALTER TABLE "foods" ADD COLUMN "carbs_per_100g" real NOT NULL;--> statement-breakpoint
ALTER TABLE "foods" ADD COLUMN "fat_per_100g" real NOT NULL;--> statement-breakpoint
ALTER TABLE "foods" ADD COLUMN "fiber_per_100g" real;--> statement-breakpoint
ALTER TABLE "foods" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "servings" ADD CONSTRAINT "servings_food_id_foods_id_fk" FOREIGN KEY ("food_id") REFERENCES "public"."foods"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_log" ADD CONSTRAINT "food_log_serving_id_servings_id_fk" FOREIGN KEY ("serving_id") REFERENCES "public"."servings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_log" DROP COLUMN "servings";--> statement-breakpoint
ALTER TABLE "foods" DROP COLUMN "calories";--> statement-breakpoint
ALTER TABLE "foods" DROP COLUMN "protein";--> statement-breakpoint
ALTER TABLE "foods" DROP COLUMN "carbs";--> statement-breakpoint
ALTER TABLE "foods" DROP COLUMN "fat";--> statement-breakpoint
ALTER TABLE "foods" DROP COLUMN "serving_size";--> statement-breakpoint
ALTER TABLE "foods" DROP COLUMN "serving_unit";