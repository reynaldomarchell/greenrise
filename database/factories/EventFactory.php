<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->text(),
            'description' => fake()->text(2000),
            'date' => fake()->dateTime()->format('Y-m-d H:i:s'),
            'image' => fake()->imageUrl(),
            'donationTotal' => fake()->numberBetween(100000, 1000000),

        ];
    }
}