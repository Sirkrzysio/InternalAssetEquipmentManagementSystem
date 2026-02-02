

/**
 * Audit Log DTO - response from API
 */
export interface AuditLog {
  id: string;
  entityName: string;
  entityId: string;
  action: string;
  changes?: string;
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  timestamp: string;
}
