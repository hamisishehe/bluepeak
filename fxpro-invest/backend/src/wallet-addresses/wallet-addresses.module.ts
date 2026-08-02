import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletAddress } from './wallet-address.entity';
import { WalletAddressesController } from './wallet-addresses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WalletAddress])],
  controllers: [WalletAddressesController],
})
export class WalletAddressesModule {}

