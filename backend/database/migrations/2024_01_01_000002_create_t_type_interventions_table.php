<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('t_type_interventions', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 100);
            $table->string('description_interventions', 500)->nullable();
            $table->decimal('prix', 10, 2);
            $table->time('duree')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('t_type_interventions');
    }
};
