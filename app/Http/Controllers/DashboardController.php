<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Customer;
use App\Models\Transaction;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $todaySales = Transaction::whereDate('created_at', now())->sum('total');
        $todayTransactions = Transaction::whereDate('created_at', now())->count();
        $totalProducts = Product::count();
        $totalCustomers = Customer::count();

        return Inertia::render('dashboard', [
            'todaySales' => $todaySales,
            'todayTransactions' => $todayTransactions,
            'totalProducts' => $totalProducts,
            'totalCustomers' => $totalCustomers,
        ]);
    }
}
