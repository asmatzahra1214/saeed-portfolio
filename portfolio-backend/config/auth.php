<?php

return [
    'defaults' => [
        'guard' => 'web',
        'passwords' => 'users',
    ],

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],

        'api' => [
            'driver' => 'sanctum',
            'provider' => 'signups', // Using our custom provider
        ],
    ],

    'providers' => [
        
    'users' => [
        'driver' => 'eloquent',
        'model' => App\Models\Signup::class, // Changed from User::class
    ],


        'signups' => [
            'driver' => 'eloquent',
            'model' => App\Models\Signup::class,
        ],
    ],

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => 'password_reset_tokens',
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    'password_timeout' => 10800,
];