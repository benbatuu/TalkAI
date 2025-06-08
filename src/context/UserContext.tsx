/**
 * @deprecated Use AuthContext instead. This context is redundant as it only wraps AuthContext functionality.
 * Import { useAuth } from './AuthContext' directly.
 * 
 * Example:
 * Instead of:
 * import { useUser } from './UserContext'
 * 
 * Use:
 * import { useAuth } from './AuthContext'
 */

import { useAuth } from './AuthContext';

export { useAuth as useUser };
