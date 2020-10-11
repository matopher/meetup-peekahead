<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 leading-tight">
            Events
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div class="bg-white overflow-hidden shadow-xl sm:rounded-lg">
                <div class="p-4">

                    @if ($events)
                        @foreach ($events as $event)
                            <a href="{{ $event['link'] }}">
                                <h3 class="mt-6 font-bold">{{ $event['name'] }} - {{ $event['group']['name'] }}</h3>
                            </a>
                        @endforeach
                    @else
                        <p>You must login with Meetup to see events.</p>
                    @endif

                    @if (!auth()->user()->token) 
                        <a href="/oauth/redirect" class="inline-flex items-center px-4 py-2 mt-4 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150">Authorize Meetup</a>
                    @endif
                
                </div>
            </div>
        </div>
    </div>
</x-app-layout>
