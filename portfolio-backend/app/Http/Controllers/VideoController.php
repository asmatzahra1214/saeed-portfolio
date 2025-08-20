<?php

namespace App\Http\Controllers;

use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VideoController extends Controller
{
    /**
     * Display a listing of the videos.
     */
    public function index()
    {
        $videos = Video::latest()->get();
        
        return response()->json([
            'success' => true,
            'data' => $videos,
            'message' => 'Videos retrieved successfully.'
        ]);
    }

    /**
     * Store a newly created video in storage.
     */
   public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'title' => 'required|string|max:255',
        'url' => 'required|url',
        'type' => 'required|in:youtube,vimeo,other',
        'description' => 'nullable|string'
    ]);

    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Validation error',
            'errors' => $validator->errors()
        ], 422);
    }

    try {
        // Create video without mass assignment
        $video = new Video();
        $video->title = $request->title;
        $video->url = $request->url;
        $video->type = $request->type;
        $video->description = $request->description;
        $video->save();

        return response()->json([
            'success' => true,
            'data' => $video,
            'message' => 'Video created successfully.'
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to create video',
            'error' => $e->getMessage()
        ], 500);
    }
}

    /**
     * Display the specified video.
     */
    public function show($id)
    {
        try {
            $video = Video::findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $video,
                'message' => 'Video retrieved successfully.'
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Video not found'
            ], 404);
        }
    }

    /**
     * Update the specified video in storage.
     */
    public function update(Request $request, $id)
    {
        try {
            $video = Video::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|required|string|max:255',
                'url' => 'sometimes|required|url',
                'type' => 'sometimes|required|in:youtube,vimeo,other',
                'description' => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $video->update($validator->validated());

            return response()->json([
                'success' => true,
                'data' => $video,
                'message' => 'Video updated successfully.'
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Video not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update video',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified video from storage.
     */
    public function destroy($id)
    {
        try {
            $video = Video::findOrFail($id);
            $video->delete();

            return response()->json([
                'success' => true,
                'message' => 'Video deleted successfully.'
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Video not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete video',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get videos by type
     */
    public function getByType($type)
    {
        $validTypes = ['youtube', 'vimeo', 'other'];
        
        if (!in_array($type, $validTypes)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid video type. Allowed types: youtube, vimeo, other'
            ], 422);
        }

        $videos = Video::where('type', $type)->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $videos,
            'message' => "{$type} videos retrieved successfully."
        ]);
    }

    /**
     * Search videos by title or description
     */
    public function search(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'query' => 'required|string|min:2'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $query = $request->input('query');

        $videos = Video::where('title', 'like', "%{$query}%")
                      ->orWhere('description', 'like', "%{$query}%")
                      ->latest()
                      ->get();

        return response()->json([
            'success' => true,
            'data' => $videos,
            'message' => 'Search results retrieved successfully.'
        ]);
    }
}