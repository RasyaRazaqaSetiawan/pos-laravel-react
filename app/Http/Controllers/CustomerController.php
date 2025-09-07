<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::query();

        // Filter berdasarkan pencarian
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('full_name', 'like', "%{$searchTerm}%")
                    ->orWhere('phone', 'like', "%{$searchTerm}%")
                    ->orWhere('email', 'like', "%{$searchTerm}%");
            });
        }

        // Paginate data customer
        $customers = $query->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(function ($customer) {
                return [
                    'id' => $customer->id,
                    'full_name' => $customer->full_name,
                    'phone' => $customer->phone,
                    'email' => $customer->email,
                    'can_delete' => $customer->transactions()->count() === 0,
                ];
            });

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Customers/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255|unique:customers,full_name',
            'phone' => 'required|string|max:20|unique:customers,phone',
            'email' => 'nullable|email|unique:customers,email',
        ]);

        Customer::create($validated);

        return redirect()
            ->route('customers.index')
            ->with('success', 'Customer created successfully.');
    }

    public function storeFromTransaction(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255|unique:customers,full_name',
            'phone' => 'required|string|max:20|unique:customers,phone',
            'email' => 'nullable|email|unique:customers,email',
        ]);

        $customer = Customer::create($validated);

        // Return kembali ke halaman transaction dengan customer baru di props
        return back()->with([
            'success' => 'Customer created successfully',
            'newCustomer' => [
                'id' => $customer->id,
                'full_name' => $customer->full_name,
                'phone' => $customer->phone,
                'email' => $customer->email,
            ]
        ]);
    }


    public function edit(Customer $customer)
    {
        // Validasi keberadaan customer
        if (!$customer->exists) {
            Log::error('Customer not found', ['id' => request()->route('customer')]);
            abort(404, 'Customer not found');
        }

        return Inertia::render('Customers/Edit', [
            'customer' => [
                'id' => $customer->id,
                'full_name' => $customer->full_name,
                'phone' => $customer->phone,
                'email' => $customer->email,
            ],
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255|unique:customers,full_name',
            'phone' => 'required|string|max:20|unique:customers,phone',
            'email' => "required|email|unique:customers,email,{$customer->id}",
        ]);

        $customer->update($validated);

        return redirect()
            ->route('customers.index')
            ->with('success', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer)
    {
        // Cek apakah customer memiliki transaksi
        if ($customer->transactions()->exists()) {
            return back()->withErrors([
                'error' => 'Cannot delete customer that has transaction history.'
            ]);
        }

        $customer->delete();

        return redirect()
            ->route('customers.index')
            ->with('success', 'Customer deleted successfully.');
    }
}
