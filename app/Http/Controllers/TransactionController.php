<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Product;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        // Get search parameter from request
        $search = $request->get('search');

        // Build query with relationships
        $query = Transaction::with(['user', 'customer', 'items.product'])
            ->latest();

        // Apply search filter if provided
        if ($search) {
            $query->where(function ($q) use ($search) {
                // Search by transaction ID
                $q->where('id', 'like', "%{$search}%")
                    // Search by customer name - using 'full_name' instead of 'name'
                    ->orWhereHas('customer', function ($customerQuery) use ($search) {
                        $customerQuery->where('full_name', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%"); // Also search by phone
                    })
                    // Search by cashier name
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $transactions = $query->paginate(10)->withQueryString();

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'filters' => [
                'search' => $search
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Transactions/Create', [
            'customers' => Customer::all(),
            'products' => Product::all(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
        ]);

        $subtotal = 0;
        foreach ($request->items as $item) {
            $product = Product::findOrFail($item['product_id']);
            $subtotal += $product->price * $item['qty'];
        }

        $discount = 0;
        if ($subtotal > 1000000) {
            $discount = $subtotal * 0.15;
        } elseif ($subtotal > 500000) {
            $discount = $subtotal * 0.10;
        }

        $total = $subtotal - $discount;

        $transaction = Transaction::create([
            'user_id' => Auth::id(),
            'customer_id' => $request->customer_id,
            'subtotal' => $subtotal,
            'discount' => $discount,
            'total' => $total,
        ]);

        foreach ($request->items as $item) {
            $product = Product::findOrFail($item['product_id']);

            $transaction->items()->create([
                'product_id' => $product->id,
                'qty' => $item['qty'],
                'price' => $product->price,
                'subtotal' => $product->price * $item['qty'],
            ]);

            $product->decrement('stock', $item['qty']);
        }

        return redirect()->route('transactions.index')
            ->with('success', 'Transaksi berhasil dibuat');
    }

    public function edit(Transaction $transaction)
    {
        $transaction->load(['items.product', 'customer', 'user']);

        return Inertia::render('Transactions/Edit', [
            'transaction' => $transaction,
            'customers' => Customer::select('id', 'full_name', 'phone')->get(),
            'products' => Product::select('id', 'name', 'price', 'stock')->get(),
        ]);
    }

    public function update(Request $request, Transaction $transaction)
    {
        $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
        ]);

        // 🔹 Kembalikan stok produk lama sebelum update
        foreach ($transaction->items as $oldItem) {
            $product = Product::find($oldItem->product_id);
            if ($product) {
                $product->increment('stock', $oldItem->qty);
            }
        }

        // 🔹 Hapus semua item lama
        $transaction->items()->delete();

        // 🔹 Hitung ulang subtotal & discount
        $subtotal = 0;
        foreach ($request->items as $item) {
            $product = Product::findOrFail($item['product_id']);
            $subtotal += $product->price * $item['qty'];
        }

        $discount = 0;
        if ($subtotal > 1000000) {
            $discount = $subtotal * 0.15;
        } elseif ($subtotal > 500000) {
            $discount = $subtotal * 0.10;
        }

        $total = $subtotal - $discount;

        // 🔹 Update transaksi
        $transaction->update([
            'customer_id' => $request->customer_id,
            'subtotal' => $subtotal,
            'discount' => $discount,
            'total' => $total,
        ]);

        // 🔹 Tambahkan item baru & kurangi stok
        foreach ($request->items as $item) {
            $product = Product::findOrFail($item['product_id']);

            $transaction->items()->create([
                'product_id' => $product->id,
                'qty' => $item['qty'],
                'price' => $product->price,
                'subtotal' => $product->price * $item['qty'],
            ]);

            $product->decrement('stock', $item['qty']);
        }

        return redirect()->route('transactions.index')
            ->with('success', 'Transaksi berhasil diperbarui');
    }


    public function show(Transaction $transaction)
    {
        return Inertia::render('Transactions/Show', [
            'transaction' => $transaction->load(['user', 'customer', 'items.product']),
        ]);
    }

    // Add this method to your TransactionController class

    /**
     * Show the POS interface with customers and products
     */
    public function pos()
    {
        $customers = Customer::select(['id', 'full_name', 'phone'])
            ->orderBy('full_name')
            ->get();

        $products = Product::select(['id', 'name', 'price', 'stock'])
            ->where('stock', '>', 0)
            ->orderBy('name')
            ->get();

        return Inertia::render('Pos/Index', [
            'customers' => $customers,
            'products' => $products
        ]);
    }
}
