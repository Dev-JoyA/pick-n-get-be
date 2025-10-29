import { User, UserRole } from '../models/userModel';
import { Rider, ApprovalStatus } from '../interface/deliveryInterface';
import { ContractExecuteTransaction, ContractCallQuery, ContractId } from '@hashgraph/sdk';
import { getHederaConfig } from './hederaFileService';
import { Client, PrivateKey } from '@hashgraph/sdk';

const CONTRACT_ADDRESS = '0.0.7153245'; 
const SUPER_ADMIN_WALLET = process.env.SUPER_ADMIN_WALLET || ''; // Set in .env

export interface UserRoleInfo {
  walletAddress: string;
  roles: string[];
  primaryRole: string;
  userData?: {
    userId?: number;
    name?: string;
    profileImage?: string;
  };
  riderData?: {
    riderId: number;
    approvalStatus: string;
    riderStatus: string;
  };
}

/**
 * Get role from smart contract
 */
async function getRoleFromContract(walletAddress: string): Promise<string | null> {
  try {
    const config = getHederaConfig();
    const client = Client.forTestnet();
    const operatorKey = PrivateKey.fromStringECDSA(
      config.operatorKey.startsWith('0x') ? config.operatorKey.slice(2) : config.operatorKey
    );
    client.setOperator(config.operatorId, operatorKey);

    const contractId = ContractId.fromString(CONTRACT_ADDRESS);

    // Call getRole(address) function
    const query = new ContractCallQuery()
      .setContractId(contractId)
      .setGas(100000)
      .setFunction('getRole', [
        { type: 'address', value: walletAddress }
      ]);

    const result = await query.execute(client);
    
    // Parse the result (returns string: "Recycler", "Rider", "Admin", or "Unassigned")
    const roleString = result.getString(0);
    
    console.log(`📜 Contract role for ${walletAddress}: ${roleString}`);
    
    return roleString === 'Unassigned' ? null : roleString;
  } catch (error) {
    console.error('Error reading role from contract:', error);
    return null;
  }
}

/**
 * Map contract role to UserRole enum
 */
function mapContractRoleToUserRole(contractRole: string): UserRole {
  switch (contractRole) {
    case 'Admin':
      return UserRole.Admin;
    case 'Rider':
    case 'Recycler':
      return UserRole.Recycler;
    default:
      return UserRole.Recycler;
  }
}

/**
 * Check wallet address and return all roles
 */
export async function checkWalletRoles(
  walletAddress: string,
  syncFromContract: boolean = false
): Promise<UserRoleInfo> {
  const roles: string[] = [];
  let userData: UserRoleInfo['userData'];
  let riderData: UserRoleInfo['riderData'];

  // ✅ Check if wallet is SuperAdmin (hardcoded)
  if (walletAddress.toLowerCase() === SUPER_ADMIN_WALLET.toLowerCase()) {
    return {
      walletAddress,
      roles: ['SuperAdmin', 'Admin', 'Rider', 'Recycler'],
      primaryRole: 'SuperAdmin',
    };
  }

  // Check if wallet is registered as User/Recycler/Admin in DB
  let user = await User.findOne({ walletAddress });

  // ✅ If user not in DB but syncFromContract=true, check contract
  if (!user && syncFromContract) {
    console.log(`🔍 User not in DB, checking contract for ${walletAddress}...`);
    
    const contractRole = await getRoleFromContract(walletAddress);
    
    if (contractRole) {
      // User exists in contract, create DB record
      const lastUser = await User.findOne().sort({ id: -1 }).limit(1);
      const newUserId = lastUser ? lastUser.id + 1 : 1;

      const userRole = mapContractRoleToUserRole(contractRole);

      user = await User.create({
        id: newUserId,
        name: `User_${newUserId}`,
        phoneNumber: '', // Can be updated later
        walletAddress,
        roles: [userRole],
        status: 'Active',
      });

      console.log(`✅ Created user from contract: ${walletAddress} with role ${contractRole}`);
    }
  }

  if (user) {
    roles.push(...user.roles);
    userData = {
      userId: user.id,
      name: user.name,
      profileImage: user.profileImage,
    };
  }

  // Check if wallet is registered as Rider in DB
  const rider = await Rider.findOne({ walletAddress });
  if (rider && rider.approvalStatus === ApprovalStatus.Approve) {
    if (!roles.includes('Rider')) {
      roles.push('Rider');
      
      // ✅ Sync Rider role to User document if exists
      if (user && !user.roles.includes(UserRole.Recycler)) {
        user.roles.push(UserRole.Recycler); // Riders can also recycle
        await user.save();
      }
    }
    
    riderData = {
      riderId: rider.id,
      approvalStatus: rider.approvalStatus,
      riderStatus: rider.riderStatus,
    };
  }

  // Determine primary role (priority order)
  const rolesPriority = ['SuperAdmin', 'Admin', 'Rider', 'Recycler'];
  const primaryRole = rolesPriority.find((r) => roles.includes(r)) || 'Guest';

  return {
    walletAddress,
    roles: [...new Set(roles)], // Remove duplicates
    primaryRole,
    userData,
    riderData,
  };
}

  // Check if wallet is registered as Rider
  const rider = await Rider.findOne({ walletAddress });
  if (rider && rider.approvalStatus === ApprovalStatus.Approve) {
    roles.push('Rider');
    riderData = {
      riderId: rider.id,
      approvalStatus: rider.approvalStatus,
      riderStatus: rider.riderStatus,
    };
  }

  // Determine primary role (priority order)
  const rolesPriority = ['SuperAdmin', 'Admin', 'Rider', 'Recycler'];
  const primaryRole = rolesPriority.find((r) => roles.includes(r)) || 'Guest';

  return {
    walletAddress,
    roles: [...new Set(roles)], // Remove duplicates
    primaryRole,
    userData,
    riderData,
  };
}

/**
 * Add role to user
 */
export async function addRoleToUser(
  walletAddress: string,
  role: UserRole,
): Promise<{ success: boolean; message: string }> {
  try {
    const user = await User.findOne({ walletAddress });

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    // Check if role already exists
    if (user.roles.includes(role)) {
      return {
        success: false,
        message: `User already has ${role} role`,
      };
    }

    // Add role
    user.roles.push(role);
    await user.save();

    return {
      success: true,
      message: `${role} role added successfully`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to add role',
    };
  }
}

/**
 * Remove role from user
 */
export async function removeRoleFromUser(
  walletAddress: string,
  role: UserRole,
): Promise<{ success: boolean; message: string }> {
  try {
    const user = await User.findOne({ walletAddress });

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    // Remove role
    user.roles = user.roles.filter((r) => r !== role);

    // Ensure at least one role remains
    if (user.roles.length === 0) {
      user.roles = [UserRole.Recycler];
    }

    await user.save();

    return {
      success: true,
      message: `${role} role removed successfully`,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to remove role',
    };
  }
}