<?php

namespace App\Http\Controllers;

use App\Models\Signup;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class SignupController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index()
    {
        return response()->json(Signup::all(), 200);
    }

    /**
     * Store a newly created user (register).
     */
    public function store(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:signup',
            'password' => 'required|string|min:6|confirmed',
            'role'     => 'in:admin,user',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Create user
        $user = Signup::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role ?? 'user',
        ]);

      return response()->json([
        'status'  => 'success',
        'message' => 'User registered successfully! Now click on Login.'
    ], 201);
    }

    /**
     * Show a single user.
     */
    public function show($id)
    {
        $user = Signup::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json($user, 200);
    }

    /**
     * Update a user.
     */
    public function update(Request $request, $id)
    {
        $user = Signup::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->update($request->only('name', 'email', 'role'));

        if ($request->has('password')) {
            $user->password = Hash::make($request->password);
            $user->save();
        }

        return response()->json([
            'message' => 'User updated successfully',
            'user'    => $user
        ], 200);
    }

    /**
     * Remove a user.
     */
    public function destroy($id)
    {
        $user = Signup::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully'], 200);
    }
}
