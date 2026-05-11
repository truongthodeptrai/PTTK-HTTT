const MS_PER_DAY = 24 * 60 * 60 * 1000;

const REFUND_RULES = {
  NO_CONTRACT: {
    code: 'NO_CONTRACT',
    rate: 0.8,
    label: 'No contract signed',
  },
  CONTRACT_ENDED: {
    code: 'CONTRACT_ENDED',
    rate: 1,
    label: 'Contract ended',
  },
  STAY_UNDER_6_MONTHS: {
    code: 'STAY_UNDER_6_MONTHS',
    rate: 0.5,
    label: 'Stay under 6 months',
  },
  STAY_6_MONTHS_OR_LONGER: {
    code: 'STAY_6_MONTHS_OR_LONGER',
    rate: 0.7,
    label: 'Stay 6 months or longer',
  },
};

function toDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getStayMonths(startDate, endDate = new Date()) {
  const start = toDate(startDate);
  const end = toDate(endDate);

  if (!start || !end || end < start) return 0;

  const months = (end.getFullYear() - start.getFullYear()) * 12
    + (end.getMonth() - start.getMonth());
  const dayAdjustment = end.getDate() < start.getDate() ? -1 : 0;

  return Math.max(months + dayAdjustment, 0);
}

function getStayDays(startDate, endDate = new Date()) {
  const start = toDate(startDate);
  const end = toDate(endDate);

  if (!start || !end || end < start) return 0;
  return Math.floor((end - start) / MS_PER_DAY);
}

function resolveRefundRule({
  hasContract,
  contractEnded,
  stayStartDate,
  stayEndDate,
}) {
  if (!hasContract) return REFUND_RULES.NO_CONTRACT;
  if (contractEnded) return REFUND_RULES.CONTRACT_ENDED;

  const stayMonths = getStayMonths(stayStartDate, stayEndDate);
  return stayMonths >= 6
    ? REFUND_RULES.STAY_6_MONTHS_OR_LONGER
    : REFUND_RULES.STAY_UNDER_6_MONTHS;
}

function calculateDepositRefund({
  depositAmount,
  penaltyAmount = 0,
  hasContract = true,
  contractEnded = false,
  stayStartDate,
  stayEndDate = new Date(),
}) {
  const deposit = Number(depositAmount) || 0;
  const penalty = Math.max(Number(penaltyAmount) || 0, 0);
  const rule = resolveRefundRule({
    hasContract,
    contractEnded,
    stayStartDate,
    stayEndDate,
  });

  const baseRefund = Math.round(deposit * rule.rate);
  const refundAmount = Math.max(baseRefund - penalty, 0);

  return {
    refundAmount,
    baseRefund,
    penaltyAmount: penalty,
    refundRate: rule.rate,
    ruleCode: rule.code,
    ruleLabel: rule.label,
    stayMonths: hasContract ? getStayMonths(stayStartDate, stayEndDate) : 0,
    stayDays: hasContract ? getStayDays(stayStartDate, stayEndDate) : 0,
  };
}

module.exports = {
  REFUND_RULES,
  calculateDepositRefund,
  getStayMonths,
};
