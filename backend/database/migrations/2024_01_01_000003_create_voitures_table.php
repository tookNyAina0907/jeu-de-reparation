<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('t_voiture', function (Blueprint $table) {
            $table->id();
            $table->string('matricule', 100)->unique();
            $table->foreignId('users_id')->constrained('t_users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('t_voiture');
    }
};
