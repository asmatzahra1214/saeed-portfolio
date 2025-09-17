<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SignupController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\AppoinmentController;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\HomeController;




Route::prefix('signup')->group(function () {
    // Get all users
    Route::get('/', [SignupController::class, 'index']);
    
    // Create new user
    Route::post('/', [SignupController::class, 'store']);
    
    // Get single user
    Route::get('/{id}', [SignupController::class, 'show']);
    
    // Update user
    Route::put('/{id}', [SignupController::class, 'update']);
    
    // Delete user
    Route::delete('/{id}', [SignupController::class, 'destroy']);
});

Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

//Contact routes
Route::prefix('contact')->group(function () {
    Route::post('/', [ContactController::class, 'store']);
    Route::get('/', [ContactController::class, 'index']);
    Route::get('/{id}', [ContactController::class, 'show']);
    Route::delete('/{id}', [ContactController::class, 'destroy']);

});
// Public appointment routes
Route::prefix('appoinment')->middleware('api')->group(function () {
    Route::post('/', [AppoinmentController::class, 'store'])->name('appoinment.store');
    Route::get('/', [AppoinmentController::class, 'index'])->name('appoinment.index');
    // Route::get('/{id}', [AppoinmentController::class, 'show'])->name('appoinment.show');
    // Route::put('/{id}', [AppoinmentController::class, 'update'])->name('appoinment.update');
    Route::delete('/{id}', [AppoinmentController::class, 'destroy'])->name('appoinment.destroy');
});

Route::apiResource('video', VideoController::class);

// Additional custom routes
Route::get('video/type/{type}', [VideoController::class, 'getByType']);
Route::get('video/search/{query}', [VideoController::class, 'search']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});  

//home content 
Route::prefix('home')->group(function () {
    Route::get('/', [HomeController::class, 'index']);
    Route::post('/', [HomeController::class, 'store']);
    Route::get('/public', [HomeController::class, 'publicContent']);
    Route::get('/{id}', [HomeController::class, 'show']);
    Route::delete('/{id}', [HomeController::class, 'destroy']);
});
