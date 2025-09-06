<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_code',
        'name',
        'price',
        'stock',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer',
    ];

    /**
     * Get formatted price for display
     */
    public function getFormattedPriceAttribute()
    {
        return 'Rp ' . number_format((float) $this->price, 0, ',', '.');
    }

    /**
     * Check if product is available
     */
    public function isAvailable()
    {
        return $this->stock > 0;
    }

    /**
     * Decrease stock when product is sold
     */
    public function decreaseStock($quantity)
    {
        if ($this->stock >= $quantity) {
            $this->decrement('stock', $quantity);
            return true;
        }
        return false;
    }

    /**
     * Increase stock when needed
     */
    public function increaseStock($quantity)
    {
        $this->increment('stock', $quantity);
    }

    // /**
    //  * Get transaction details for this product
    //  */
    public function transactionItems()
    {
        return $this->hasMany(TransactionItem::class);
    }
}
