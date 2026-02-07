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
            $table->integer('voiture_id');
            $table->integer('type_id');
            $table->foreign('voiture_id')->references('id')->on('t_voiture')->onDelete('cascade');
            $table->foreign('type_id')->references('id')->on('t_type_interventions');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('t_reparations');
    }
};
