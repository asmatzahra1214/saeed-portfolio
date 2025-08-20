<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'video';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'url',
        'type',
        'description'
    ];

    /**
     * Extract YouTube video ID from URL
     */
    public function getYoutubeIdAttribute()
    {
        if ($this->type !== 'youtube') {
            return null;
        }

        // Handle different YouTube URL formats
        $url = $this->url;
        
        // Regular YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID
        if (preg_match('/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/', $url, $matches)) {
            return $matches[1];
        }
        
        // Short YouTube URL: https://youtu.be/VIDEO_ID
        if (preg_match('/youtu\.be\/([a-zA-Z0-9_-]+)/', $url, $matches)) {
            return $matches[1];
        }
        
        // Embed URL: https://www.youtube.com/embed/VIDEO_ID
        if (preg_match('/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/', $url, $matches)) {
            return $matches[1];
        }

        return null;
    }

    /**
     * Get embed URL for the video
     */
    public function getEmbedUrlAttribute()
    {
        if ($this->type === 'youtube' && $this->youtube_id) {
            return "https://www.youtube.com/embed/{$this->youtube_id}";
        }
        
        if ($this->type === 'vimeo') {
            // Extract Vimeo ID from URL
            if (preg_match('/vimeo\.com\/(\d+)/', $this->url, $matches)) {
                return "https://player.vimeo.com/video/{$matches[1]}";
            }
        }
        
        return $this->url;
    }

    /**
     * Get thumbnail URL for YouTube videos
     */
    public function getThumbnailUrlAttribute()
    {
        if ($this->type === 'youtube' && $this->youtube_id) {
            return "https://img.youtube.com/vi/{$this->youtube_id}/hqdefault.jpg";
        }
        
        return null;
    }

    /**
     * Scope a query to only include YouTube videos.
     */
    public function scopeYoutube($query)
    {
        return $query->where('type', 'youtube');
    }

    /**
     * Scope a query to only include Vimeo videos.
     */
    public function scopeVimeo($query)
    {
        return $query->where('type', 'vimeo');
    }
}