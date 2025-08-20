<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    /**
     * Store a newly created contact message.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $contact = Contact::create([
            'name' => $request->name,
            'email' => $request->email,
            'message' => $request->message,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Contact message submitted successfully!',
            'data' => $contact
        ], 201);
    }

    /**
     * Display a listing of contact messages.
     */
   public function index()
{
    $contacts = Contact::all();
    return response()->json($contacts->toArray()); // Explicitly convert to array
}

    /**
     * Display the specified contact message.
     */
    public function show($id)
    {
        $contact = Contact::find($id);

        if (!$contact) {
            return response()->json([
                'status' => 'error',
                'message' => 'Contact message not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $contact
        ]);
    }

    /**
     * Remove the specified contact message.
     */
    public function destroy($id)
    {
        $contact = Contact::find($id);

        if (!$contact) {
            return response()->json([
                'status' => 'error',
                'message' => 'Contact message not found'
            ], 404);
        }

        $contact->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Contact message deleted successfully'
        ]);
    }
}