<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class OAuthController extends Controller
{
    public function redirect() {
        $queries = http_build_query([
            'client_id' => config('services.meetup.client_id'),
            'redirect_uri' => config('services.meetup.redirect_uri'),
            'response_type' => 'code',
        ]);

       return redirect('https://secure.meetup.com/oauth2/authorize?' . $queries);
    }

    public function callback(Request $request) {

        $response = Http::asForm()->post('https://secure.meetup.com/oauth2/access', [
            'client_id' => config('services.meetup.client_id'),
            'client_secret' => config('services.meetup.client_secret'),
            'grant_type' => 'authorization_code',
            'redirect_uri' => config('services.meetup.redirect_uri'),
            'code' => $request->code
        ]);

        $response = $response->json();

        $request->user()->token()->delete();

        $request->user()->token()->create([
            'access_token' => $response['access_token'],
            'expires_in' => $response['expires_in'],
            'refresh_token' => $response['refresh_token']
        ]);

        return redirect('/events');
    }
}
