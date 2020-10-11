<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class EventsController extends Controller
{
    public function index() {
        $events = [];

        if(auth()->user()->token) {
            $response = Http::withHeaders([
                'Accept'  => 'application/json',
                'Authorization' => 'Bearer ' . auth()->user()->token->access_token
                ])->get('https://api.meetup.com/self/events');

            if ($response->status() === 200) {
                $events = $response->json();
            }
        }

        return view('events', ['events' => $events]);
    }

    public function getGroupWithUpcomingEvents() {
        $events = [];

        if(auth()->user()->token) {
            $response = Http::withHeaders([
                'Accept'  => 'application/json',
                'Authorization' => 'Bearer ' . auth()->user()->token->access_token
                ])->get("https://api.meetup.com/pro/Techlahoma/groups?upcoming_events_min=1");

            if ($response->status() === 200) {
                $events = $response->json();
            }
        }

        return $events;
    }
}
