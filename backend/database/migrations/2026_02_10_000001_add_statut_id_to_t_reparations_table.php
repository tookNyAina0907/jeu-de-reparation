<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('t_reparations', function (Blueprint $table) {
            $table->integer('statut_id')->nullable()->after('type_id');
            $table->foreign('statut_id')->references('id')->on('t_statut');
        });
    }

    public function down(): void
    {
        Schema::table('t_reparations', function (Blueprint $table) {
            $table->dropForeign(['statut_id']);
            $table->dropColumn('statut_id');
        });
    }
};
