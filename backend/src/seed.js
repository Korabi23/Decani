router.post("/seed-jobs", requireAdmin, async (req, res, next) => {
  try {
    const jobsToSeed = [
      {
        title: "Senior Frontend Developer",
        company: "TechCorp Solutions",
        location: "Prishtinë",
        type: "Full-time",
        salary: "€45,000 - €60,000",
        description:
          "Join our dynamic team to build cutting-edge web applications using React and modern technologies.",
        requirements: ["React", "JavaScript/TypeScript", "REST APIs"],
        perks: ["Remote option", "Training", "Competitive salary"],
      },
      {
        title: "Marketing Specialist",
        company: "Creative Agency Pro",
        location: "Prishtinë",
        type: "Part-time",
        salary: "€25,000 - €35,000",
        description:
          "Drive brand awareness and lead generation through innovative digital marketing campaigns.",
        requirements: ["Social media", "Content strategy", "Analytics"],
        perks: ["Flexible hours", "Growth opportunities"],
      },
      {
        title: "UX/UI Designer",
        company: "Design Studio Alpha",
        location: "Prishtinë",
        type: "Full-time",
        salary: "€40,000 - €55,000",
        description:
          "Create beautiful and intuitive user experiences for mobile and web applications.",
        requirements: ["Figma", "UX research", "Prototyping"],
        perks: ["Creative team", "Modern tools"],
      },
      {
        title: "Data Analyst",
        company: "Analytics Hub",
        location: "Prishtinë",
        type: "Part-time",
        salary: "€30,000 - €42,000",
        description:
          "Transform complex data into actionable insights to drive business decisions and growth.",
        requirements: ["Excel/Sheets", "SQL basics", "Reporting"],
        perks: ["Flexible schedule", "Learning budget"],
      },
      {
        title: "Project Manager",
        company: "Innovation Labs",
        location: "Prishtinë",
        type: "Full-time",
        salary: "€50,000 - €70,000",
        description:
          "Lead cross-functional teams to deliver high-impact projects on time and within budget.",
        requirements: ["Communication", "Planning", "Leadership"],
        perks: ["Bonus", "Career growth"],
      },
      
    ];

    
    const existing = await Job.find({}, { title: 1, company: 1 }).lean();
    const existingSet = new Set(existing.map((j) => `${j.title}__${j.company}`));

    const toInsert = jobsToSeed.filter(
      (j) => !existingSet.has(`${j.title}__${j.company}`)
    );

    if (toInsert.length === 0) {
      return res.json({ message: "Nothing new to seed ✅" });
    }

    await Job.insertMany(toInsert);

    res.json({ message: `Seeded ${toInsert.length} new jobs ✅` });
  } catch (e) {
    next(e);
  }
});
