<?php

use App\Http\Controllers\EventsController;
use App\Http\Controllers\OAuthController;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::middleware(['auth:sanctum', 'verified'])->get('/dashboard', function () {
    return view('dashboard');
})->name('dashboard');

// Route::get('/events', function () {
//     $events = Http::get('https://jsonplaceholder.typicode.com/posts')->json();

//     return view('events', ['events' => $events]);
// });

Route::get('/events', [EventsController::class, 'index'])->name('events');

Route::get('/oauth/redirect', [OAuthController::class, 'redirect']);
Route::get('/oauth/callback', [OAuthController::class, 'callback']);