<?php

namespace App\Http\Controllers;

use App\Models\Appoinment; // Using the correct model name with your spelling
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AppoinmentController extends Controller
{
public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'user_id' => 'nullable|exists:signup,id',
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'phone' => 'nullable|string|max:20',
        'appointment_time' => 'required|date',
        'collaboration_topic' => 'nullable|string',
        // Remove 'message' unless you've added it to migration
    ]);

    if ($validator->fails()) {
        return response()->json([
            'status' => 'error',
            'errors' => $validator->errors()
        ], 422);
    }

    $appoinment = Appoinment::create($request->only([
        'user_id',
        'name',
        'email',
        'phone',
        'appointment_time',
        'collaboration_topic'
    ]));

    return response()->json([
        'status' => 'success',
        'message' => 'Appointment booked successfully!',
        'data' => $appoinment
    ], 201);
}
    public function index()
    {
        $appoinments = Appoinment::with('user')->latest()->get(); // Fixed variable name and using Appoinment

        return response()->json([
            'status' => 'success',
            'data' => $appoinments // Fixed variable name
        ]);
    }

    public function show($id)
    {
        $appoinment = Appoinment::with('user')->find($id); // Using Appoinment

        if (!$appoinment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Appointment not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $appoinment
        ]);
    }

    public function update(Request $request, $id)
    {
        $appoinment = Appoinment::find($id); // Using Appoinment

        if (!$appoinment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Appointment not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'user_id' => 'nullable|exists:signup,id',
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
            'phone' => 'nullable|string|max:20',
            'appointment_time' => 'sometimes|date',
            'message' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $appoinment->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Appointment updated successfully',
            'data' => $appoinment
        ]);
    }

    public function destroy($id)
    {
        $appoinment = Appoinment::find($id); // Using Appoinment

        if (!$appoinment) {
            return response()->json([
                'status' => 'error',
                'message' => 'Appointment not found'
            ], 404);
        }

        $appoinment->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Appointment deleted successfully'
        ]);
    }
}