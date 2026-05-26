export function formatDate(dateString, language = "id") {
  if (!dateString) return "-";
  return new Intl.DateTimeFormat(language === "en" ? "en-US" : "id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateString));
}

export function shortHash(value = "", start = 6, end = 4) {
  if (!value || value.length <= start + end) return value || "-";
  return `${value.slice(0, start)}...${value.slice(-end)}`;
}

export function statusClasses(status) {
  switch (status) {
    case "completed":
      return "badge bg-emerald-100 text-emerald-700";
    case "in_progress":
      return "badge bg-amber-100 text-amber-800";
    default:
      return "badge bg-slate-100 text-slate-700";
  }
}

export function stageStatusClasses(status) {
  switch (status) {
    case "completed":
      return "badge bg-emerald-100 text-emerald-700";
    case "available":
      return "badge bg-amber-100 text-amber-800";
    case "skipped":
      return "badge bg-rose-100 text-rose-700";
    default:
      return "badge bg-slate-100 text-slate-600";
  }
}

export function statusText(status, language = "id") {
  const labels = {
    id: {
      completed: "Selesai",
      in_progress: "Sedang berjalan",
      draft: "Draft",
    },
    en: {
      completed: "Completed",
      in_progress: "In progress",
      draft: "Draft",
    },
  };

  return labels[language]?.[status] || status || "-";
}

export function stageStatusText(status, language = "id") {
  const labels = {
    id: {
      completed: "Tersimpan",
      available: "Siap diproses",
      skipped: "Dilewati",
      pending: "Menunggu",
    },
    en: {
      completed: "Stored",
      available: "Ready",
      skipped: "Skipped",
      pending: "Waiting",
    },
  };

  if (labels[language]?.[status]) {
    return labels[language][status];
  }

  switch (status) {
    case "completed":
      return language === "en" ? "Stored" : "Tersimpan";
    case "available":
      return language === "en" ? "Ready" : "Siap diproses";
    case "skipped":
      return language === "en" ? "Skipped" : "Dilewati";
    default:
      return language === "en" ? "Waiting" : "Menunggu";
  }
}

const stageLabels = {
  id: {
    plucking: "Pemetikan",
    withering: "Pelayuan",
    rolling: "Penggulungan",
    predrying: "Pra-Pengeringan",
    drying: "Pengeringan",
    postdrying: "Pasca-Pengeringan",
    packing: "Pengemasan",
  },
  en: {
    plucking: "Plucking",
    withering: "Withering",
    rolling: "Rolling",
    predrying: "Pre-Drying",
    drying: "Drying",
    postdrying: "Post-Drying",
    packing: "Packing",
  },
};

const teaTypeLabels = {
  id: {
    "Green Tea": "Teh Hijau",
    "Yellow Tea": "Teh Kuning",
    "White Tea": "Teh Putih",
    "Oolong Tea": "Teh Oolong",
    "Black Tea": "Teh Hitam",
    "Dark Tea": "Teh Gelap",
  },
  en: {
    "Green Tea": "Green Tea",
    "Yellow Tea": "Yellow Tea",
    "White Tea": "White Tea",
    "Oolong Tea": "Oolong Tea",
    "Black Tea": "Black Tea",
    "Dark Tea": "Dark Tea",
  },
};

const fieldLabels = {
  id: {
    operatorShift: "Shift Operator",
    leafGrade: "Grade Daun",
    weightKg: "Berat (kg)",
    location: "Lokasi",
    notes: "Catatan",
    durationMinutes: "Durasi (menit)",
    temperature: "Suhu",
    humidity: "Kelembapan",
    weightBeforeKg: "Berat Awal (kg)",
    weightAfterKg: "Berat Akhir (kg)",
    machineCode: "Kode Mesin",
    rpm: "RPM",
    outputKg: "Output (kg)",
    moisturePercent: "Kadar Air (%)",
    dryerMachine: "Mesin Pengering",
    finalMoisturePercent: "Kadar Air Akhir (%)",
    sortingGrade: "Grade Sortir",
    qcStatus: "Status QC",
    aromaNote: "Catatan Aroma",
    packageType: "Jenis Kemasan",
    totalPackage: "Total Kemasan",
    netWeightKg: "Berat Bersih (kg)",
    warehouseLocation: "Lokasi Gudang",
  },
  en: {
    operatorShift: "Operator Shift",
    leafGrade: "Leaf Grade",
    weightKg: "Weight (kg)",
    location: "Location",
    notes: "Notes",
    durationMinutes: "Duration (minutes)",
    temperature: "Temperature",
    humidity: "Humidity",
    weightBeforeKg: "Weight Before (kg)",
    weightAfterKg: "Weight After (kg)",
    machineCode: "Machine Code",
    rpm: "RPM",
    outputKg: "Output (kg)",
    moisturePercent: "Moisture (%)",
    dryerMachine: "Dryer Machine",
    finalMoisturePercent: "Final Moisture (%)",
    sortingGrade: "Sorting Grade",
    qcStatus: "QC Status",
    aromaNote: "Aroma Note",
    packageType: "Package Type",
    totalPackage: "Total Package",
    netWeightKg: "Net Weight (kg)",
    warehouseLocation: "Warehouse Location",
  },
};

function normalizeStageKey(stage) {
  return String(stage || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

function titleCaseField(field) {
  return String(field || "")
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function humanStage(stage, language = "id") {
  const key = normalizeStageKey(stage);
  return stageLabels[language]?.[key] || stageLabels.en[key] || stage || "-";
}

export function humanTeaType(teaType, language = "id") {
  return teaTypeLabels[language]?.[teaType] || teaType || "-";
}

export function humanFieldLabel(field, language = "id") {
  return fieldLabels[language]?.[field] || fieldLabels.en[field] || titleCaseField(field);
}

export function humanWorkflowMode(language = "id") {
  return language === "en" ? "Dynamic Multi-Path" : "Alur Dinamis Multi-Jalur";
}

export function humanRole(role, language = "id") {
  const labels = {
    id: {
      admin: "Admin",
      operator: "Operator",
    },
    en: {
      admin: "Admin",
      operator: "Operator",
    },
  };

  return labels[language]?.[role] || labels.en[role] || role || "-";
}

export function getActiveStages(batch) {
  return (batch?.stages || []).filter((stage) => stage.status === "available");
}

export function getSkippableStages(batch) {
  return (batch?.stages || []).filter(
    (stage) => stage.skippable && stage.status !== "completed" && stage.status !== "skipped"
  );
}
