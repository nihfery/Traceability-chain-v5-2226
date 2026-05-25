export const MASTER_STAGES = [
  {
    key: "plucking",
    label: "Plucking",
    skippable: false,
    prerequisiteStages: [],
  },
  {
    key: "withering",
    label: "Withering",
    skippable: false,
    prerequisiteStages: ["plucking"],
  },
  {
    key: "rolling",
    label: "Rolling",
    skippable: true,
    prerequisiteStages: ["withering"],
  },
  {
    key: "predrying",
    label: "Pre-Drying",
    skippable: false,
    prerequisiteStages: ["withering"],
  },
  {
    key: "drying",
    label: "Drying",
    skippable: false,
    prerequisiteStages: ["predrying"],
  },
  {
    key: "postdrying",
    label: "Post-Drying",
    skippable: true,
    prerequisiteStages: ["drying"],
  },
  {
    key: "packing",
    label: "Packing",
    skippable: false,
    prerequisiteStages: ["drying"],
  },
];

export const STAGE_LABELS = MASTER_STAGES.reduce((acc, stage) => {
  acc[stage.key] = stage.label;
  return acc;
}, {});

export const STAGE_TRANSITIONS = {
  plucking: ["withering"],
  withering: ["rolling", "predrying"],
  rolling: ["predrying"],
  predrying: ["drying"],
  drying: ["postdrying", "packing"],
  postdrying: ["packing"],
  packing: [],
};

export const STAGE_PREREQUISITES = MASTER_STAGES.reduce((acc, stage) => {
  acc[stage.key] = stage.prerequisiteStages || [];
  return acc;
}, {});

export const TEA_PRODUCTION_FLOWS = [
  {
    teaType: "Green Tea",
    stageKeys: ["plucking", "withering", "rolling", "drying", "packing"],
  },
  {
    teaType: "Yellow Tea",
    stageKeys: ["plucking", "withering", "rolling", "predrying", "drying", "postdrying", "packing"],
  },
  {
    teaType: "White Tea",
    stageKeys: ["plucking", "withering", "drying", "packing"],
  },
  {
    teaType: "Oolong Tea",
    stageKeys: ["plucking", "withering", "rolling", "predrying", "drying", "postdrying", "packing"],
  },
  {
    teaType: "Black Tea",
    stageKeys: ["plucking", "withering", "rolling", "predrying", "drying", "postdrying", "packing"],
  },
  {
    teaType: "Dark Tea",
    stageKeys: ["plucking", "withering", "rolling", "predrying", "drying", "postdrying", "packing"],
  },
];

export const DEFAULT_TEA_TYPE = "Black Tea";
export const TEA_TYPE_OPTIONS = TEA_PRODUCTION_FLOWS.map((flow) => flow.teaType);

export const LEGACY_WORKFLOW_STAGE_KEYS = {
  standard: MASTER_STAGES.map((stage) => stage.key),
  noRolling: ["plucking", "withering", "predrying", "drying", "postdrying", "packing"],
  fastTrack: ["plucking", "withering", "drying", "packing"],
};

export function getTeaProductionFlow(teaType) {
  return (
    TEA_PRODUCTION_FLOWS.find((flow) => flow.teaType === teaType) ||
    TEA_PRODUCTION_FLOWS.find((flow) => flow.teaType === DEFAULT_TEA_TYPE) ||
    TEA_PRODUCTION_FLOWS[0]
  );
}

export function getStageTemplatesForTeaType(teaType) {
  const flow = getTeaProductionFlow(teaType);

  return flow.stageKeys
    .map((stageKey, index) => {
      const stage = MASTER_STAGES.find((item) => item.key === stageKey);
      if (!stage) return null;

      return {
        ...stage,
        prerequisiteStages: flow.stageKeys.slice(0, index),
      };
    })
    .filter(Boolean);
}

export function buildDefaultStages(teaType) {
  return getStageTemplatesForTeaType(teaType).map((stage, index) => ({
    stageName: stage.key,
    label: stage.label,
    skippable: stage.skippable,
    prerequisiteStages: stage.prerequisiteStages,
    status: index === 0 ? "available" : "pending",
    completed: false,
    skipped: false,
    skipReason: null,
    ipfsCid: null,
    ipfsUrl: null,
    txHash: null,
    txUrl: null,
    timestamp: null,
    operator: null,
    payload: null,
    ipfsName: null,
    mock: null,
  }));
}

export function deriveBatchStatus(stages = [], options = {}) {
  const blockchainAnchored = Boolean(options.blockchainAnchored);

  if (!stages.length) {
    return "draft";
  }

  const finalizedCount = stages.filter(
    (item) => item.status === "completed" || item.status === "skipped"
  ).length;

  if (finalizedCount === stages.length && blockchainAnchored) {
    return "completed";
  }

  if (!finalizedCount) {
    return "draft";
  }

  return "in_progress";
}
