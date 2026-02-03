<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('t_reparations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('voiture_id')->constrained('t_voiture')->onDelete('cascade');
            $table->foreignId('type_id')->constrained('t_type_interventions')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('t_reparations');
    }
};
