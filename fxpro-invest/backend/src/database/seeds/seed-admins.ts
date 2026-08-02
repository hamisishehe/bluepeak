import * as bcrypt from 'bcrypt';
import dataSource from '../data-source';
import { UserRole } from '../../common/enums/user-role.enum';
import { UserStatus } from '../../common/enums/user-status.enum';
import { User } from '../../users/user.entity';

async function seedAdmins() {
  await dataSource.initialize();
  const users = dataSource.getRepository(User);
  const defaults = [
    {
      email: 'investor@bluepeakcapital.com',
      fullName: 'Alexander Grant',
      role: UserRole.USER,
      referralCode: 'FXINVESTOR',
      availableBalance: '5000.00',
      investmentBalance: '0.00',
      totalProfit: '0.00',
      mustChangePassword: false,
    },
    { email: 'admin@bluepeakcapital.com', fullName: 'BluePeak Admin', role: UserRole.ADMIN, referralCode: 'BPADMIN' },
    { email: 'super@bluepeakcapital.com', fullName: 'BluePeak Super Admin', role: UserRole.SUPER_ADMIN, referralCode: 'BPSUPER' },
  ];

  for (const account of defaults) {
    const exists = await users.exists({ where: { email: account.email } });
    if (!exists) {
      let referralCode = account.referralCode;
      let suffix = 1;
      while (await users.exists({ where: { referralCode } })) {
        referralCode = `${account.referralCode}${suffix}`;
        suffix += 1;
      }
      await users.save(users.create({
        ...account,
        referralCode,
        passwordHash: await bcrypt.hash('ChangeMe123!', 12),
        status: UserStatus.ACTIVE,
        emailVerified: true,
        mustChangePassword: account.mustChangePassword ?? true,
      }));
    }
  }

  await dataSource.destroy();
}

void seedAdmins();
