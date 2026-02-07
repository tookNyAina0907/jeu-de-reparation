<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('t_reparations_statut', function (Blueprint $table) {
            $table->id();
            $table->integer('reparations_id');
            $table->integer('statut_id');
            $table->timestamp('date_statut')->useCurrent();
            $table->foreign('reparations_id')->references('id')->on('t_reparations')->onDelete('cascade');
            $table->foreign('statut_id')->references('id')->on('t_statut');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('t_reparations_statut');
    }
};
