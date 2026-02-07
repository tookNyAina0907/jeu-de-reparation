<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return ['message' => 'API Gestion Réparations Automobiles'];
});
