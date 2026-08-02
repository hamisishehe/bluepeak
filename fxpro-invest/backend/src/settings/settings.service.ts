import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CryptoNetwork } from '../deposits/deposit.entity';
import { SystemSetting } from './system-setting.entity';

export interface InvestmentSettings {
  minimumDeposit: string;
  maximumDeposit: string;
  weeklyReturnPercentage: string;
  profitIntervalMinutes: number;
  profitIntervalDays: number;
  referralCommissionPercentage: string;
  minimumWithdrawal: string;
  maximumWithdrawal: string;
  withdrawalFeePercentage: string;
  withdrawalFlatFee: string;
  registrationEnabled: boolean;
  depositsEnabled: boolean;
  withdrawalsEnabled: boolean;
  referralsEnabled: boolean;
  maintenanceMode: boolean;
  supportedDepositNetworks: CryptoNetwork[];
  supportedWithdrawalNetworks: CryptoNetwork[];
}

export const defaultSettings: InvestmentSettings = {
  minimumDeposit: '1000.00',
  maximumDeposit: '10000.00',
  weeklyReturnPercentage: '12.00',
  profitIntervalMinutes: 10080,
  profitIntervalDays: 7,
  referralCommissionPercentage: '0.50',
  minimumWithdrawal: '100.00',
  maximumWithdrawal: '10000.00',
  withdrawalFeePercentage: '0.00',
  withdrawalFlatFee: '0.00',
  registrationEnabled: true,
  depositsEnabled: true,
  withdrawalsEnabled: true,
  referralsEnabled: true,
  maintenanceMode: false,
  supportedDepositNetworks: [CryptoNetwork.BEP20, CryptoNetwork.TRC20],
  supportedWithdrawalNetworks: [CryptoNetwork.BEP20, CryptoNetwork.TRC20],
};

@Injectable()
export class SettingsService {
  constructor(@InjectRepository(SystemSetting) private readonly settings: Repository<SystemSetting>) {}

  async getInvestmentSettings(): Promise<InvestmentSettings> {
    const rows = await this.settings.find();
    const settings = rows.reduce<InvestmentSettings>((acc, row) => ({ ...acc, [row.key]: row.value }), defaultSettings);
    if (!settings.profitIntervalMinutes && settings.profitIntervalDays) {
      settings.profitIntervalMinutes = Number(settings.profitIntervalDays) * 24 * 60;
    }
    return settings;
  }

  async updateSettings(values: Record<string, string | number | boolean | string[]>) {
    for (const [key, value] of Object.entries(values)) {
      await this.settings.save(this.settings.create({ key, value }));
    }
    return this.getInvestmentSettings();
  }
}
