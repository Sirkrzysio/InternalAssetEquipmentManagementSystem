

export enum AssetStatus {
  Available = 0,
  Assigned = 1,
  InMaintenance = 2,
  Retired = 3,
  Lost = 4,
}

export const AssetStatusLabels: Record<AssetStatus, string> = {
  [AssetStatus.Available]: 'Dostępny',
  [AssetStatus.Assigned]: 'Przypisany',
  [AssetStatus.InMaintenance]: 'W serwisie',
  [AssetStatus.Retired]: 'Wycofany',
  [AssetStatus.Lost]: 'Zgubiony',
};
