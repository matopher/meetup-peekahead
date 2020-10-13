<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
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

    public function upcoming() {
       $groups = $this->getGroupWithUpcomingEvents(); 

       $events = $this->getUpcomingEvents($groups);

       return $events;
    }

    private function getUpcomingEvents($groups) {
        $now = Carbon::now();

        $no_later_than_date = $now->add(10, 'day')->toISOString();

        $formatted_date = Str::of($no_later_than_date)->rtrim('Z');

        $events = collect([]);

        foreach ($groups as $group) {
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'Authorization' => 'Bearer ' . auth()->user()->token->access_token
            ])->get("https://api.meetup.com/${group}/events?status=upcoming&no_later_than=${formatted_date}&desc=true");
        

            $new_event = $response->json();
    
            $events->push($new_event);
        }

        return $events;
    }

    private function getGroupWithUpcomingEvents() {
        $groups = [];

        if(auth()->user()->token) {
            $response = Http::withHeaders([
                'Accept'  => 'application/json',
                'Authorization' => 'Bearer ' . auth()->user()->token->access_token
                ])->get("https://api.meetup.com/pro/Techlahoma/groups?upcoming_events_min=1");

            if ($response->status() === 200) {
                $groups = collect($response->json())->pluck('urlname')->all();
            }
        }

        return $groups;
    }
}
