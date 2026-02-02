

export enum AssignmentType {
  Permanent = 0,
  Temporary = 1,
  Loan = 2,
}

export const AssignmentTypeLabels: Record<AssignmentType, string> = {
  [AssignmentType.Permanent]: 'Stałe',
  [AssignmentType.Temporary]: 'Tymczasowe',
  [AssignmentType.Loan]: 'Wypożyczenie',
};
