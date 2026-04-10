const { Appointment, Customer } = require("../models");

// LIST PAGE
exports.page = async (req, res) => {
  const customers = await Customer.findAll({ order: [["name", "ASC"]] });

  const appointments = await Appointment.findAll({
    include: [{ model: Customer }],
    order: [["appointmentAt", "DESC"]],
  });

  res.render("appointments/index", {
    pageTitle: "Appointments",
    pageSubTitle: "Create and manage appointments",
    customers,
    appointments,
  });
};

// CREATE (customerName datalist typing)
exports.create = async (req, res) => {
  try {
    const {
      customerName,
      appointmentAt,
      email,
      whatsapp,
      hotelPickup,
      hotelName,
      roomNo,
      hotelAddress,
      notes,
      remindBeforeMinutes,
    } = req.body;

    if (!customerName || !customerName.trim()) {
      req.flash("error", "Please select or enter customer name");
      return res.redirect("/appointments");
    }

    if (!appointmentAt) {
      req.flash("error", "Please select appointment date/time");
      return res.redirect("/appointments");
    }

    let customer = await Customer.findOne({ where: { name: customerName.trim() } });
    if (!customer) {
      customer = await Customer.create({
        name: customerName.trim(),
        phone: whatsapp || "",
        email: email || "",
      });
    }

    const pickup = hotelPickup === "yes";

    await Appointment.create({
      appointmentAt: new Date(appointmentAt),
      email: email?.trim() || null,
      whatsapp: whatsapp?.trim() || null,
      hotelPickup: pickup,
      hotelName: pickup ? (hotelName?.trim() || null) : null,
      roomNo: pickup ? (roomNo?.trim() || null) : null,
      hotelAddress: pickup ? (hotelAddress?.trim() || null) : null,
      notes: notes?.trim() || null,
      remindBeforeMinutes: Number(remindBeforeMinutes || 60),
      remindedAt: null,
      CustomerId: customer.id,
    });

    req.flash("success", "Appointment created");
    return res.redirect("/appointments");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to create appointment");
    return res.redirect("/appointments");
  }
};

// DELETE
exports.remove = async (req, res) => {
  try {
    const appt = await Appointment.findByPk(req.params.id);
    if (!appt) {
      req.flash("error", "Appointment not found");
      return res.redirect("/appointments");
    }

    await appt.destroy();
    req.flash("success", "Appointment deleted");
    return res.redirect("/appointments");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to delete appointment");
    return res.redirect("/appointments");
  }
};

// EDIT PAGE
exports.editPage = async (req, res) => {
  const appointment = await Appointment.findByPk(req.params.id, { include: [Customer] });
  if (!appointment) {
    req.flash("error", "Appointment not found");
    return res.redirect("/appointments");
  }

  const customers = await Customer.findAll({ order: [["name", "ASC"]] });

  res.render("appointments/edit", {
    pageTitle: "Edit Appointment",
    pageSubTitle: "Update appointment details",
    appointment,
    customers,
  });
};

// UPDATE
exports.update = async (req, res) => {
  try {
    const appt = await Appointment.findByPk(req.params.id);
    if (!appt) {
      req.flash("error", "Appointment not found");
      return res.redirect("/appointments");
    }

    const {
      customerName,
      appointmentAt,
      email,
      whatsapp,
      hotelPickup,
      hotelName,
      roomNo,
      hotelAddress,
      notes,
      remindBeforeMinutes,
    } = req.body;

    if (!customerName || !appointmentAt) {
      req.flash("error", "Customer and Date/Time required");
      return res.redirect(`/appointments/${req.params.id}/edit`);
    }

    let customer = await Customer.findOne({ where: { name: customerName.trim() } });
    if (!customer) {
      customer = await Customer.create({
        name: customerName.trim(),
        phone: whatsapp || "",
        email: email || "",
      });
    }

    const pickup = hotelPickup === "yes";

    await appt.update({
      appointmentAt: new Date(appointmentAt),
      email: email || null,
      whatsapp: whatsapp || null,
      hotelPickup: pickup,
      hotelName: pickup ? hotelName || null : null,
      roomNo: pickup ? roomNo || null : null,
      hotelAddress: pickup ? hotelAddress || null : null,
      notes: notes || null,
      remindBeforeMinutes: Number(remindBeforeMinutes || 60),
      CustomerId: customer.id,
      remindedAt: null, // reset reminder on update
    });

    req.flash("success", "Appointment updated");
    return res.redirect("/appointments");
  } catch (err) {
    console.error(err);
    req.flash("error", "Failed to update appointment");
    return res.redirect(`/appointments/${req.params.id}/edit`);
  }
};

// CALENDAR PAGE
exports.calendarPage = (req, res) => {
  res.render("appointments/calendar", {
    pageTitle: "Appointments Calendar",
    pageSubTitle: "Monthly/weekly view",
  });
};

// CALENDAR EVENTS JSON
exports.calendarEvents = async (req, res) => {
  const appointments = await Appointment.findAll({ include: [Customer] });

  const events = appointments.map((a) => {
    const pickup = !!a.hotelPickup;

    return {
      id: a.id,
      title: `${a.Customer ? a.Customer.name : "Customer"}${pickup ? " (Pickup)" : ""}`,
      start: a.appointmentAt,
      url: `/appointments/${a.id}/edit`,
      backgroundColor: pickup ? "#dc2626" : "#2563eb",
      borderColor: pickup ? "#dc2626" : "#2563eb",
    };
  });

  res.json(events);
};
console.log("Loaded appointmentController ✅", {
  page: typeof exports.page,
  create: typeof exports.create,
  calendarPage: typeof exports.calendarPage,
  calendarEvents: typeof exports.calendarEvents,
});