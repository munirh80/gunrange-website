/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users");

    let collection;
    try {
      collection = app.findCollectionByNameOrId("range_submissions");
    } catch (_) {
      collection = new Collection({
        type: "base",
        name: "range_submissions",
        // Public can submit (create). Only admins can list/view/approve/reject.
        listRule: "@request.auth.role = 'admin'",
        viewRule: "@request.auth.role = 'admin'",
        createRule: "",
        updateRule: "@request.auth.role = 'admin'",
        deleteRule: "@request.auth.role = 'admin'",
        fields: [
          // --- Approval workflow fields ---
          {
            name: "status",
            type: "select",
            required: true,
            maxSelect: 1,
            values: ["pending", "approved", "rejected"],
          },
          { name: "reviewer_notes", type: "text", max: 2000 },
          {
            name: "reviewed_by",
            type: "relation",
            maxSelect: 1,
            collectionId: users.id,
            cascadeDelete: false,
          },
          { name: "reviewed_at", type: "date" },

          // --- Step 1: Facility info ---
          { name: "title", type: "text", max: 100 },
          { name: "range_name", type: "text", required: true, max: 200 },
          { name: "general_email", type: "email" },
          { name: "email_on_web", type: "bool" },
          { name: "website", type: "url" },
          { name: "website_on_web", type: "bool" },
          { name: "facility_access", type: "text", max: 50 },
          { name: "type_of_facility", type: "text", max: 50 },
          { name: "commercial_range", type: "bool" },
          { name: "law_enforcement_facility", type: "bool" },
          { name: "municipal_facility", type: "bool" },
          { name: "gun_sportsmans_club", type: "bool" },
          { name: "military_facility", type: "bool" },
          { name: "hunting_preserve", type: "bool" },
          { name: "handicap_accessible", type: "text", max: 10 },
          { name: "public_access", type: "text", max: 10 },
          { name: "members_only", type: "text", max: 10 },
          { name: "memberships_available", type: "text", max: 10 },
          { name: "events_open_to_public", type: "text", max: 10 },

          // --- Step 2: Physical location ---
          { name: "address", type: "text", max: 300 },
          { name: "street_number", type: "text", max: 50 },
          { name: "street_name", type: "text", max: 200 },
          { name: "city", type: "text", max: 100 },
          { name: "state", type: "text", max: 50 },
          { name: "country", type: "text", max: 50 },
          { name: "zip", type: "text", max: 20 },
          { name: "latitude", type: "text", max: 30 },
          { name: "longitude", type: "text", max: 30 },

          // --- Step 3: Mailing ---
          { name: "mailing_address", type: "text", max: 300 },
          { name: "mailing_city", type: "text", max: 100 },
          { name: "mailing_state", type: "text", max: 50 },
          { name: "mailing_zip", type: "text", max: 20 },
          { name: "mailing_country", type: "text", max: 50 },

          // --- Step 4: Phones ---
          { name: "main_phone", type: "text", max: 50 },
          { name: "main_phone_on_web", type: "bool" },
          { name: "toll_free", type: "text", max: 50 },
          { name: "toll_free_on_web", type: "bool" },
          { name: "fax", type: "text", max: 50 },
          { name: "fax_on_web", type: "bool" },
          { name: "other_phone", type: "text", max: 50 },
          { name: "other_phone_type", type: "text", max: 50 },
          { name: "other_phone_on_web", type: "bool" },

          // --- Step 5: Primary contact ---
          { name: "primary_first_name", type: "text", max: 100 },
          { name: "primary_last_name", type: "text", max: 100 },
          { name: "primary_email", type: "email" },
          { name: "primary_contact_title", type: "text", max: 100 },
          { name: "primary_phone", type: "text", max: 50 },
          { name: "primary_address", type: "text", max: 300 },
          { name: "primary_city", type: "text", max: 100 },
          { name: "primary_state", type: "text", max: 50 },
          { name: "primary_zip", type: "text", max: 20 },
          { name: "primary_country", type: "text", max: 50 },

          // --- Step 6: Publications ---
          { name: "bullet_points", type: "bool" },
          { name: "first_shots", type: "bool" },
          { name: "pull_the_trigger", type: "bool" },

          // --- Steps 7-11: Shooting available (booleans) ---
          { name: "trap", type: "bool" },
          { name: "skeet", type: "bool" },
          { name: "informal_practice_area", type: "bool" },
          { name: "bunker_trap", type: "bool" },
          { name: "international_skeet", type: "bool" },
          { name: "other_shotgun", type: "bool" },
          { name: "five_stand", type: "bool" },
          { name: "sporting_clays", type: "bool" },
          { name: "cfr_indoor", type: "bool" },
          { name: "cfr_max_indoor", type: "text", max: 50 },
          { name: "cfr_outdoor", type: "bool" },
          { name: "cfr_max_outdoor", type: "text", max: 50 },
          { name: "handgun_indoor", type: "bool" },
          { name: "handgun_max_indoor", type: "text", max: 50 },
          { name: "handgun_outdoor", type: "bool" },
          { name: "handgun_max_outdoor", type: "text", max: 50 },
          { name: "archery_indoor", type: "bool" },
          { name: "archery_outdoor_field", type: "bool" },
          { name: "archery_outdoor_3d", type: "bool" },
          { name: "airgun", type: "bool" },
          { name: "muzzle_loaders_outdoor", type: "bool" },
          { name: "range_simulators", type: "bool" },

          // --- Steps 12-14: Competitions / services / hunting (multi-select lists) ---
          { name: "competitions", type: "json", maxSize: 200000 },
          { name: "services", type: "json", maxSize: 200000 },
          { name: "hunting", type: "json", maxSize: 200000 },

          // --- Step 15: Membership & First Shots ---
          { name: "member_info", type: "bool" },
          { name: "first_shots_program", type: "bool" },

          { name: "created", type: "autodate", onCreate: true, onUpdate: false },
          { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
        ],
        indexes: [
          "CREATE INDEX idx_range_submissions_status ON range_submissions (status)",
        ],
      });
      app.save(collection);
    }
  },
  (app) => {
    try {
      const collection = app.findCollectionByNameOrId("range_submissions");
      app.delete(collection);
    } catch (e) {
      if (e.message.includes("no rows in result set")) return;
      throw e;
    }
  },
);
