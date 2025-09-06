<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'customer_id',
        'subtotal',
        'discount',
        'total',
    ];

    // 🔗 Relasi ke User (kasir/admin)
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // 🔗 Relasi ke Customer
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    // 🔗 Relasi ke Transaction Items
    public function items()
    {
        return $this->hasMany(TransactionItem::class);
    }
}
