import { supabaseAdmin } from "../lib/supabase.js";

const MAX_CAPACITY = 100;

// POST /api/iftar-tickets — Register a new ticket
export const registerTicket = async (req, res) => {
    const { full_name, email, phone, payment_method } = req.body;

    if (!full_name || !email || !payment_method) {
        return res.status(400).json({ error: "full_name, email, and payment_method are required." });
    }

    const validMethods = ["paypal", "revolut", "bank"];
    if (!validMethods.includes(payment_method)) {
        return res.status(400).json({ error: "Invalid payment_method. Must be paypal, revolut, or bank." });
    }

    try {
        // 1. Check current capacity
        const { count, error: countError } = await supabaseAdmin
            .from("iftar_tickets")
            .select("*", { count: "exact", head: true });

        if (countError) throw countError;

        if (count >= MAX_CAPACITY) {
            return res.status(409).json({ error: "Sorry, the event is sold out! No more tickets available." });
        }

        // 2. Check for duplicate email
        const { data: existing, error: dupError } = await supabaseAdmin
            .from("iftar_tickets")
            .select("id")
            .eq("email", email.toLowerCase().trim())
            .single();

        if (dupError && dupError.code !== "PGRST116") {
            // PGRST116 = "not found" — anything else is a real error
            throw dupError;
        }

        if (existing) {
            return res.status(409).json({ error: "This email is already registered for the Iftar." });
        }

        // 3. Insert ticket
        const { data, error: insertError } = await supabaseAdmin
            .from("iftar_tickets")
            .insert([{
                full_name: full_name.trim(),
                email: email.toLowerCase().trim(),
                phone: phone ? phone.trim() : null,
                payment_method,
                paid: false,
            }])
            .select()
            .single();

        if (insertError) throw insertError;

        return res.status(201).json({
            success: true,
            ticket: data,
            remaining: MAX_CAPACITY - (count + 1),
        });
    } catch (error) {
        console.error("[IFTAR TICKET] Register error:", error);
        return res.status(500).json({ error: "Internal server error. Please try again." });
    }
};

// GET /api/iftar-tickets — Get all tickets (admin use)
export const getAllTickets = async (req, res) => {
    try {
        const { data, error, count } = await supabaseAdmin
            .from("iftar_tickets")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false });

        if (error) throw error;

        return res.status(200).json({
            tickets: data,
            total: count,
            remaining: MAX_CAPACITY - count,
            capacity: MAX_CAPACITY,
        });
    } catch (error) {
        console.error("[IFTAR TICKET] GetAll error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

// GET /api/iftar-tickets/capacity — Public capacity check
export const getCapacity = async (req, res) => {
    try {
        const { count, error } = await supabaseAdmin
            .from("iftar_tickets")
            .select("*", { count: "exact", head: true });

        if (error) throw error;

        return res.status(200).json({
            sold: count,
            remaining: MAX_CAPACITY - count,
            capacity: MAX_CAPACITY,
            sold_out: count >= MAX_CAPACITY,
        });
    } catch (error) {
        console.error("[IFTAR TICKET] Capacity error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

// PATCH /api/iftar-tickets/:id/paid — Toggle paid status (admin)
export const togglePaid = async (req, res) => {
    const { id } = req.params;
    const { paid } = req.body;

    if (typeof paid !== "boolean") {
        return res.status(400).json({ error: "paid must be a boolean." });
    }

    try {
        const { data, error } = await supabaseAdmin
            .from("iftar_tickets")
            .update({ paid })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: "Ticket not found." });

        return res.status(200).json({ success: true, ticket: data });
    } catch (error) {
        console.error("[IFTAR TICKET] TogglePaid error:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};
