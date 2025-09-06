<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('products')->insert([
            [
                'product_code' => 'PRD001',
                'name' => 'Laptop Asus',
                'price' => 7500000,
                'stock' => 10,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'product_code' => 'PRD002',
                'name' => 'Mouse Logitech',
                'price' => 250000,
                'stock' => 50,
                'created_at' => now(),
                'updated_at' => now(),
            ],
                        [
                'product_code' => 'PRD002',
                'name' => 'Lenovo Loq',
                'price' => 11150000,
                'stock' => 50,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
