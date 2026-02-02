

import { AssignmentType } from './enums';

/**
 * Assignment DTO - response from API
 */
export interface Assignment {
  id: string;
  assetId: string;
  assetName: string;
  assetSerialNumber: string;
  userId: string;
  userFullName: string;
  userEmail: string;
  type: AssignmentType;
  typeName: string;
  assignedAt: string;
  returnedAt?: string;
  expectedReturnDate?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
}

/**
 * Create Assignment Request
 */
export interface CreateAssignmentRequest {
  assetId: string;
  userId: string;
  type: AssignmentType;
  expectedReturnDate?: string;
  notes?: string;
}
