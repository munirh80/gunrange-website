/// <reference path="../pb_data/types.d.ts" />

// Notification emails for the range-submission owner approval workflow.
//  - On create (new submission): email every admin that a listing is pending review,
//    and email the submitter a confirmation that their request was received.
//  - On update (status change): email the submitter when their listing is
//    approved or rejected.

function adminEmails(app) {
  const admins = app.findRecordsByFilter("users", "role = 'admin'", "", 0, 0, {});
  const emails = [];
  for (let i = 0; i < admins.length; i++) {
    const addr = admins[i].getString("email");
    if (addr) emails.push({ address: addr });
  }
  return emails;
}

function submitterName(record) {
  const first = record.getString("primary_first_name");
  const last = record.getString("primary_last_name");
  const name = (first + " " + last).trim();
  return name || record.getString("range_name") || "there";
}

onRecordAfterCreateSuccess((e) => {
  const record = e.record;
  const rangeName = record.getString("range_name");
  const submitterEmail = record.getString("primary_email");
  const name = submitterName(record);
  const appName = "DMV Ranges";

  // 1) Notify all admins that a new submission is pending review.
  const recipients = adminEmails($app);
  if (recipients.length > 0) {
    const message = new MailerMessage({
      from: { name: appName },
      to: recipients,
      subject: "New range listing pending approval — " + rangeName,
      html:
        "<h2>New submission received</h2>" +
        "<p><strong>Range:</strong> " + rangeName + "</p>" +
        "<p><strong>Submitted by:</strong> " + name + "</p>" +
        "<p><strong>Location:</strong> " + record.getString("city") + ", " +
        record.getString("state") + "</p>" +
        "<p>Log in to the admin dashboard to review and approve or reject this listing.</p>",
    });
    try {
      $app.newMailClient().send(message);
    } catch (err) {
      $app.logger().error("admin notification email failed", "err", String(err));
    }
  }

  // 2) Confirm receipt to the submitter (if they gave an email).
  if (submitterEmail) {
    const confirm = new MailerMessage({
      from: { name: appName },
      to: [{ address: submitterEmail }],
      subject: "We received your range listing — " + rangeName,
      html:
        "<p>Hi " + name + ",</p>" +
        "<p>Thanks for listing <strong>" + rangeName + "</strong> in the DMV Ranges directory. " +
        "Our team will review your submission and publish approved listings. " +
        "You'll receive another email once your listing has been approved or rejected.</p>" +
        "<p>— The DMV Ranges team</p>",
    });
    try {
      $app.newMailClient().send(confirm);
    } catch (err) {
      $app.logger().error("submitter confirmation email failed", "to", submitterEmail, "err", String(err));
    }
  }

  e.next();
}, "range_submissions");

onRecordAfterUpdateSuccess((e) => {
  const record = e.record;
  const status = record.getString("status");

  // Only notify on a decision, not on every edit.
  if (status !== "approved" && status !== "rejected") {
    e.next();
    return;
  }

  const submitterEmail = record.getString("primary_email");
  if (!submitterEmail) {
    e.next();
    return;
  }

  const rangeName = record.getString("range_name");
  const name = submitterName(record);
  const notes = record.getString("reviewer_notes");
  const appName = "DMV Ranges";

  let subject;
  let body;
  if (status === "approved") {
    subject = "Your range listing is approved — " + rangeName;
    body =
      "<p>Hi " + name + ",</p>" +
      "<p>Great news — your listing for <strong>" + rangeName + "</strong> has been approved " +
      "and will appear in the DMV Ranges directory.</p>" +
      (notes ? "<p><strong>Notes from our team:</strong> " + notes + "</p>" : "") +
      "<p>— The DMV Ranges team</p>";
  } else {
    subject = "Update on your range listing — " + rangeName;
    body =
      "<p>Hi " + name + ",</p>" +
      "<p>Thanks for submitting <strong>" + rangeName + "</strong>. After review, we're unable to " +
      "publish this listing at this time.</p>" +
      (notes ? "<p><strong>Reason:</strong> " + notes + "</p>" : "") +
      "<p>If you believe this is in error or have updated details, please reply to this email.</p>" +
      "<p>— The DMV Ranges team</p>";
  }

  const message = new MailerMessage({
    from: { name: appName },
    to: [{ address: submitterEmail }],
    subject: subject,
    html: body,
  });

  try {
    $app.newMailClient().send(message);
  } catch (err) {
    $app.logger().error("decision notification email failed", "to", submitterEmail, "err", String(err));
  }

  e.next();
}, "range_submissions");
