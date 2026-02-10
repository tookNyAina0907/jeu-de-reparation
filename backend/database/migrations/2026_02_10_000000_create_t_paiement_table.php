<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('t_paiement', function (Blueprint $table) {
            $table->id();
            $table->integer('voiture_id');
            $table->decimal('montant', 10, 2);
            $table->timestamp('date_paiement')->useCurrent();

            $table->foreign('voiture_id')->references('id')->on('t_voiture')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('t_paiement');
    }
};
