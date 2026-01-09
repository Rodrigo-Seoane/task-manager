-- CreateEnum
CREATE TYPE "CycleStatus" AS ENUM ('DRAFT', 'ACTIVE', 'REVIEW', 'COMPLETED');

-- CreateTable
CREATE TABLE "tutors" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tutors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learners" (
    "id" TEXT NOT NULL,
    "tutor_id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "pin_code" TEXT NOT NULL,
    "total_points" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weekly_cycles" (
    "id" TEXT NOT NULL,
    "learner_id" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "status" "CycleStatus" NOT NULL DEFAULT 'DRAFT',
    "tutor_reviewed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weekly_cycles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "weekly_cycle_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon_name" TEXT,
    "point_value" INTEGER NOT NULL DEFAULT 10,
    "frequency_per_week" INTEGER NOT NULL,
    "is_boss_task" BOOLEAN NOT NULL DEFAULT false,
    "expectation" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_completions" (
    "id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "learner_id" TEXT NOT NULL,
    "weekly_cycle_id" TEXT NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tutor_approved" BOOLEAN,
    "points_awarded" INTEGER NOT NULL DEFAULT 0,
    "tutor_notes" TEXT,

    CONSTRAINT "task_completions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tutors_email_key" ON "tutors"("email");

-- CreateIndex
CREATE INDEX "learners_tutor_id_idx" ON "learners"("tutor_id");

-- CreateIndex
CREATE INDEX "weekly_cycles_learner_id_start_date_idx" ON "weekly_cycles"("learner_id", "start_date");

-- CreateIndex
CREATE INDEX "weekly_cycles_status_idx" ON "weekly_cycles"("status");

-- CreateIndex
CREATE INDEX "tasks_weekly_cycle_id_idx" ON "tasks"("weekly_cycle_id");

-- CreateIndex
CREATE INDEX "tasks_is_boss_task_idx" ON "tasks"("is_boss_task");

-- CreateIndex
CREATE INDEX "task_completions_task_id_idx" ON "task_completions"("task_id");

-- CreateIndex
CREATE INDEX "task_completions_learner_id_idx" ON "task_completions"("learner_id");

-- CreateIndex
CREATE INDEX "task_completions_weekly_cycle_id_idx" ON "task_completions"("weekly_cycle_id");

-- CreateIndex
CREATE INDEX "task_completions_tutor_approved_idx" ON "task_completions"("tutor_approved");

-- AddForeignKey
ALTER TABLE "learners" ADD CONSTRAINT "learners_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "weekly_cycles" ADD CONSTRAINT "weekly_cycles_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "learners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_weekly_cycle_id_fkey" FOREIGN KEY ("weekly_cycle_id") REFERENCES "weekly_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_completions" ADD CONSTRAINT "task_completions_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_completions" ADD CONSTRAINT "task_completions_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "learners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_completions" ADD CONSTRAINT "task_completions_weekly_cycle_id_fkey" FOREIGN KEY ("weekly_cycle_id") REFERENCES "weekly_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
