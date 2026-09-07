/// <reference path="../pb_data/types.d.ts" />

migrate(
  (app) => {
    const users = app.findCollectionByNameOrId("users");

    // Add a role select field if it doesn't exist yet.
    if (!users.fields.getByName("role")) {
      users.fields.add(
        new SelectField({
          name: "role",
          required: false,
          maxSelect: 1,
          values: ["admin", "member"],
        }),
      );
    }

    // Closed sign-up: only a seeded/existing admin can own the approval workflow.
    users.createRule = null;
    app.save(users);

    // Seed the owner/approver account so the approval workflow has a user.
    // The user can ask to change this email to their real address later.
    const adminEmail = "owner@dmvranges.local";
    try {
      app.findAuthRecordByEmail("users", adminEmail);
    } catch (_) {
      const admin = new Record(users);
      admin.setEmail(adminEmail);
      admin.setPassword("DmvRanges!Approver2026");
      admin.set("name", "DMV Ranges Owner");
      admin.set("role", "admin");
      admin.set("verified", true);
      app.save(admin);
    }
  },
  (app) => {
    try {
      const users = app.findCollectionByNameOrId("users");
      const role = users.fields.getByName("role");
      if (role) users.fields.removeByName("role");
      users.createRule = "";
      app.save(users);
    } catch (e) {
      if (e.message.includes("no rows in result set")) return;
      throw e;
    }

    try {
      const admin = app.findAuthRecordByEmail("users", "owner@dmvranges.local");
      app.delete(admin);
    } catch (e) {
      if (e.message.includes("no rows in result set")) return;
      throw e;
    }
  },
);
