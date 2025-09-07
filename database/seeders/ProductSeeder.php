<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

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
                'product_code' => 'PRD003',
                'name' => 'Lenovo Loq',
                'price' => 11150000,
                'stock' => 50,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'product_code' => 'PRD004',
                'name' => 'Keyboard Mechanical',
                'price' => 750000,
                'stock' => 30,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'product_code' => 'PRD005',
                'name' => 'Monitor Samsung 24"',
                'price' => 2000000,
                'stock' => 20,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'product_code' => 'PRD006',
                'name' => 'Headset Razer',
                'price' => 1500000,
                'stock' => 25,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'product_code' => 'PRD007',
                'name' => 'Webcam Logitech',
                'price' => 800000,
                'stock' => 40,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'product_code' => 'PRD008',
                'name' => 'Flashdisk Sandisk 64GB',
                'price' => 150000,
                'stock' => 100,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'product_code' => 'PRD009',
                'name' => 'Printer Canon',
                'price' => 2200000,
                'stock' => 15,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'product_code' => 'PRD010',
                'name' => 'SSD Samsung 1TB',
                'price' => 1800000,
                'stock' => 35,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'product_code' => 'PRD011',
                'name' => 'Lenovo Legion',
                'price' => 2800000,
                'stock' => 11,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
