<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::query();

        if ($request->filled('search')) {
            $query->where('full_name', 'like', "%{$request->search}%")
                ->orWhere('phone', 'like', "%{$request->search}%")
                ->orWhere('email', 'like', "%{$request->search}%");
        }

        $customers = $query->latest()
            ->paginate(10)
            ->withQueryString()
            ->through(function ($customer) {
                return [
                    'id' => $customer->id,
                    'full_name' => $customer->full_name,
                    'phone' => $customer->phone,
                    'email' => $customer->email,
                    // Add can_delete logic based on transactions
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
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|unique:customers,email',
        ]);

        Customer::create($validated);

        return redirect()->route('customers.index')->with('success', 'Customer created successfully.');
    }

    public function edit(Customer $customer)
    {
        // Debug: Log customer data
        Log::info('Customer data:', ['customer' => $customer->toArray()]);

        // Debug: Check if customer exists
        if (!$customer->exists) {
            Log::error('Customer not found', ['id' => request()->route('customer')]);
            abort(404, 'Customer not found');
        }

        return Inertia::render('Customers/Edit', [
            'customer' => $customer->toArray(), // Ensure it's serialized properly
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|unique:customers,email,' . $customer->id,
        ]);

        $customer->update($validated);

        return redirect()->route('customers.index')->with('success', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer)
    {
        // Check if customer has any transactions
        if ($customer->transactions()->exists()) {
            return back()->withErrors(['error' => 'Cannot delete customer that has transaction history.']);
        }

        $customer->delete();

        return redirect()->route('customers.index')->with('success', 'Customer deleted successfully.');
    }
}
