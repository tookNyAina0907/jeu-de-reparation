<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

<<<<<<< HEAD
    'allowed_origins' => ['*'],
=======
    'allowed_origins' => ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
>>>>>>> d0fb118 (Update project)

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
