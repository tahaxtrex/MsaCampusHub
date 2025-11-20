import { supabaseAdmin } from "../lib/supabase.js";

export const deleteEvent = async (req, res) => {
    const { id } = req.params;

    console.log("[DELETE EVENT] Starting deletion for event ID:", id);

    if (!id) {
        console.log("[DELETE EVENT] No ID provided");
        return res.status(400).json({ message: "Event ID is required" });
    }

    try {
        // 1. Delete associated volunteers
        console.log("[DELETE EVENT] Step 1: Deleting volunteers for event:", id);
        const { data: deletedVolunteers, error: volError } = await supabaseAdmin
            .from("event_volunteers")
            .delete()
            .eq("event_id", id)
            .select();

        if (volError) {
            console.error("[DELETE EVENT] Error deleting volunteers:", volError);
            return res.status(500).json({ message: "Failed to delete associated volunteers", error: volError.message });
        }

        console.log("[DELETE EVENT] Deleted volunteers:", deletedVolunteers?.length || 0);

        // 2. Delete the event
        console.log("[DELETE EVENT] Step 2: Deleting event:", id);
        const { data: deletedEvent, error: eventError } = await supabaseAdmin
            .from("events")
            .delete()
            .eq("id", id)
            .select();

        if (eventError) {
            console.error("[DELETE EVENT] Error deleting event:", eventError);
            return res.status(500).json({ message: "Failed to delete event", error: eventError.message });
        }

        console.log("[DELETE EVENT] Successfully deleted event:", deletedEvent);
        return res.status(200).json({ message: "Event deleted successfully", deletedEvent });
    } catch (error) {
        console.error("[DELETE EVENT] Server error:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
