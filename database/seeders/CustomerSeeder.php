<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('customers')->insert([
            [
                'full_name' => 'Rasya Razaqa',
                'phone' => '085161196033',
                'email' => '',
            ],
            [
                'full_name' => 'Budi Santoso',
                'phone' => '081234567890',
                'email' => 'budi@example.com',
            ],
            [
                'full_name' => 'Siti Aminah',
                'phone' => '082112223333',
                'email' => 'siti@example.com',
            ],
            [
                'full_name' => 'Agus Pratama',
                'phone' => '085512341234',
                'email' => 'agus@example.com',
            ],
        ]);
    }
}
