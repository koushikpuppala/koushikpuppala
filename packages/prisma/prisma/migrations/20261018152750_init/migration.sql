-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('create', 'update', 'delete', 'publish', 'unpublish', 'upload', 'login', 'logout');

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('unread', 'read', 'resolved', 'archived', 'spam');

-- CreateEnum
CREATE TYPE "ContactPriority" AS ENUM ('low', 'normal', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('full_time', 'part_time', 'intern', 'contract', 'freelance');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('image', 'video', 'audio', 'document', 'other');

-- CreateEnum
CREATE TYPE "MetadataType" AS ENUM ('page', 'layout');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('completed', 'in_progress', 'archived');

-- CreateEnum
CREATE TYPE "SocialPlatform" AS ENUM ('linkedin', 'github', 'discord', 'twitter', 'instagram', 'facebook', 'youtube', 'email', 'website');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'editor', 'user');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'inactive', 'suspended');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('google', 'github', 'password');

-- CreateTable
CREATE TABLE "about" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "lead_statement" TEXT,
    "content" TEXT NOT NULL,
    "biography" TEXT,
    "location" TEXT,
    "coordinates" TEXT,
    "timezone" TEXT,
    "status" TEXT,
    "profile_image_id" UUID,
    "highlights" TEXT[],
    "skills" TEXT[],
    "stats" JSONB,
    "values" JSONB,
    "pillars" JSONB,
    "cta_label" TEXT,
    "cta_url" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "about_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_metrics" (
    "id" UUID NOT NULL,
    "ip" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "endpoint" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "api_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "action" "AuditAction" NOT NULL,
    "entity" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "old_data" JSONB,
    "new_data" JSONB,
    "actor" TEXT NOT NULL,
    "actor_id" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "request_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "url" TEXT,
    "status" "ContactStatus" NOT NULL DEFAULT 'unread',
    "priority" "ContactPriority" NOT NULL DEFAULT 'normal',
    "source" TEXT DEFAULT 'website',
    "internal_notes" TEXT,
    "assigned_to_id" UUID,
    "read_at" TIMESTAMP(3),
    "resolved_at" TIMESTAMP(3),
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education" (
    "id" UUID NOT NULL,
    "degree" TEXT NOT NULL,
    "field_of_study" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT[],
    "achievements" TEXT[],
    "focus_areas" TEXT[],
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "expected_date" TIMESTAMP(3),
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "website" TEXT,
    "logo_id" UUID,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "experience" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "employment_type" "EmploymentType" NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "is_current" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT[],
    "achievements" TEXT[],
    "technologies" TEXT[],
    "website" TEXT,
    "logo_id" UUID,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "home" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "separator" TEXT NOT NULL DEFAULT '|',
    "subtitles" TEXT[],
    "content" TEXT NOT NULL,
    "cta_label" TEXT NOT NULL DEFAULT 'View Projects',
    "cta_url" TEXT NOT NULL DEFAULT '/projects',
    "secondary_cta_label" TEXT,
    "secondary_cta_url" TEXT,
    "stats" JSONB,
    "featured_skills" TEXT[],
    "profile_image_id" UUID,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "home_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" UUID NOT NULL,
    "type" "MediaType" NOT NULL DEFAULT 'image',
    "file_name" TEXT NOT NULL,
    "original_name" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "mime_type" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "folder" TEXT,
    "storage_key" TEXT NOT NULL,
    "url" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "alt_text" TEXT,
    "caption" TEXT,
    "uploaded_by_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metadata" (
    "id" UUID NOT NULL,
    "type" "MetadataType" NOT NULL DEFAULT 'page',
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "og_image" TEXT,
    "canonical_url" TEXT,
    "robots" TEXT DEFAULT 'index,follow',
    "keywords" TEXT[],
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "metadata_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_gallery" (
    "project_id" UUID NOT NULL,
    "media_id" UUID NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "caption" TEXT,
    "alt_text" TEXT,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_gallery_pkey" PRIMARY KEY ("project_id","media_id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "project_type" TEXT,
    "role" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "ProjectStatus" NOT NULL DEFAULT 'completed',
    "short_description" TEXT,
    "descriptions" TEXT[],
    "case_study" TEXT,
    "tags" TEXT[],
    "technologies" TEXT[],
    "metrics" JSONB,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "github" TEXT,
    "live_url" TEXT,
    "thumbnail_id" UUID,
    "hero_image_id" UUID,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Resume',
    "version_name" TEXT,
    "headline" TEXT,
    "summary" TEXT,
    "highlights" JSONB,
    "competencies" TEXT[],
    "stats" JSONB,
    "media_id" UUID NOT NULL,
    "file_size" INTEGER,
    "file_type" TEXT DEFAULT 'application/pdf',
    "checksum" TEXT,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "resume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT NOT NULL,
    "features" TEXT[],
    "icon" TEXT,
    "image_id" UUID,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "token_hash" TEXT NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "revoked_by" TEXT,
    "revoked_at" TIMESTAMP(3),
    "issued_at" TIMESTAMP(3) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "last_activity_at" TIMESTAMP(3),
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "proficiency" INTEGER,
    "icon" TEXT,
    "media_id" UUID,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_published" BOOLEAN NOT NULL DEFAULT true,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "socials" (
    "id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "platform" "SocialPlatform" NOT NULL,
    "label" TEXT,
    "handle" TEXT,
    "icon" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "socials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "firebase_uid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "photo_url" TEXT,
    "provider" "AuthProvider" NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "last_login_at" TIMESTAMP(3),
    "last_activity_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "about_profile_image_id_index" ON "about"("profile_image_id");

-- CreateIndex
CREATE INDEX "about_published_deleted_sort_index" ON "about"("is_published", "deleted_at", "sort_order");

-- CreateIndex
CREATE INDEX "api_metric_status_index" ON "api_metrics"("status");

-- CreateIndex
CREATE INDEX "api_metric_endpoint_index" ON "api_metrics"("endpoint");

-- CreateIndex
CREATE INDEX "api_metric_created_at_index" ON "api_metrics"("created_at");

-- CreateIndex
CREATE INDEX "api_metric_method_endpoint_index" ON "api_metrics"("method", "endpoint");

-- CreateIndex
CREATE INDEX "audit_actor_id_index" ON "audit_logs"("actor_id");

-- CreateIndex
CREATE INDEX "audit_created_at_index" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "audit_entity_index" ON "audit_logs"("entity", "entity_id");

-- CreateIndex
CREATE INDEX "contact_email_index" ON "contact"("email");

-- CreateIndex
CREATE INDEX "contact_priority_index" ON "contact"("priority");

-- CreateIndex
CREATE INDEX "contact_created_at_index" ON "contact"("created_at");

-- CreateIndex
CREATE INDEX "contact_assigned_to_id_index" ON "contact"("assigned_to_id");

-- CreateIndex
CREATE INDEX "contact_status_deleted_index" ON "contact"("status", "deleted_at");

-- CreateIndex
CREATE INDEX "education_logo_id_index" ON "education"("logo_id");

-- CreateIndex
CREATE INDEX "education_published_deleted_sort_index" ON "education"("is_published", "deleted_at", "sort_order");

-- CreateIndex
CREATE INDEX "experience_logo_id_index" ON "experience"("logo_id");

-- CreateIndex
CREATE INDEX "experience_featured_index" ON "experience"("featured");

-- CreateIndex
CREATE INDEX "experience_published_deleted_sort_index" ON "experience"("is_published", "deleted_at", "sort_order");

-- CreateIndex
CREATE INDEX "home_profile_image_id_index" ON "home"("profile_image_id");

-- CreateIndex
CREATE INDEX "home_published_deleted_sort_index" ON "home"("is_published", "deleted_at", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "media_storage_key_key" ON "media"("storage_key");

-- CreateIndex
CREATE INDEX "media_type_index" ON "media"("type");

-- CreateIndex
CREATE INDEX "media_uploaded_by_id_index" ON "media"("uploaded_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "metadata_key_key" ON "metadata"("key");

-- CreateIndex
CREATE INDEX "metadata_type_index" ON "metadata"("type");

-- CreateIndex
CREATE INDEX "metadata_published_deleted_index" ON "metadata"("is_published", "deleted_at");

-- CreateIndex
CREATE INDEX "project_gallery_media_id_index" ON "project_gallery"("media_id");

-- CreateIndex
CREATE INDEX "project_gallery_sort_order_index" ON "project_gallery"("project_id", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "project_category_index" ON "projects"("category");

-- CreateIndex
CREATE INDEX "project_featured_index" ON "projects"("featured");

-- CreateIndex
CREATE INDEX "project_thumbnail_id_index" ON "projects"("thumbnail_id");

-- CreateIndex
CREATE INDEX "project_hero_image_id_index" ON "projects"("hero_image_id");

-- CreateIndex
CREATE INDEX "project_published_deleted_sort_index" ON "projects"("is_published", "deleted_at", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "resume_media_id_key" ON "resume"("media_id");

-- CreateIndex
CREATE INDEX "resume_published_deleted_sort_index" ON "resume"("is_published", "deleted_at", "sort_order");

-- CreateIndex
CREATE INDEX "service_image_id_index" ON "services"("image_id");

-- CreateIndex
CREATE INDEX "service_published_deleted_sort_index" ON "services"("is_published", "deleted_at", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_hash_key" ON "sessions"("token_hash");

-- CreateIndex
CREATE INDEX "session_user_index" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "session_revoked_index" ON "sessions"("revoked");

-- CreateIndex
CREATE INDEX "session_expires_at_index" ON "sessions"("expires_at");

-- CreateIndex
CREATE INDEX "skill_media_id_index" ON "skills"("media_id");

-- CreateIndex
CREATE INDEX "skill_category_index" ON "skills"("category");

-- CreateIndex
CREATE INDEX "skill_featured_index" ON "skills"("featured");

-- CreateIndex
CREATE INDEX "skill_published_deleted_sort_index" ON "skills"("is_published", "deleted_at", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "socials_platform_key" ON "socials"("platform");

-- CreateIndex
CREATE INDEX "social_platform_index" ON "socials"("platform");

-- CreateIndex
CREATE INDEX "social_featured_index" ON "socials"("featured");

-- CreateIndex
CREATE INDEX "social_visible_deleted_sort_index" ON "socials"("isVisible", "deleted_at", "sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "users_firebase_uid_key" ON "users"("firebase_uid");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "user_role_index" ON "users"("role");
