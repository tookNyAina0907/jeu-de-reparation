<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('t_reparations_statut', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reparations_id')->constrained('t_reparations')->onDelete('cascade');
            $table->foreignId('statut_id')->constrained('t_statut');
            $table->timestamp('date_statut')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('t_reparations_statut');
    }
};
