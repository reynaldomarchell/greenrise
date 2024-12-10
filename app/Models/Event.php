<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;
    protected $fillable = [
        "title",
        "description",
        "date",
        "image",
        "donationTotal"
    ];

    public function donations(){
        return $this->hasMany(Donation::class);
    }
}