import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { IsEnum, IsString, MinLength } from 'class-validator';
import { Repository } from 'typeorm';
import { CurrentUser } from '../auth/current-user';
import { CurrentUserDecorator } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CryptoNetwork } from '../deposits/deposit.entity';
import { WalletAddress } from './wallet-address.entity';

class WalletAddressDto {
  @IsEnum(CryptoNetwork)
  network!: CryptoNetwork;
  @IsString()
  @MinLength(12)
  address!: string;
}

@ApiTags('wallet-addresses')
@Controller('api/v1/wallet-addresses')
@UseGuards(JwtAuthGuard)
export class WalletAddressesController {
  constructor(@InjectRepository(WalletAddress) private readonly wallets: Repository<WalletAddress>) {}
  @Get()
  own(@CurrentUserDecorator() user: CurrentUser) {
    return this.wallets.find({ where: { userId: user.id, active: true }, order: { createdAt: 'DESC' } });
  }
  @Post()
  create(@CurrentUserDecorator() user: CurrentUser, @Body() dto: WalletAddressDto) {
    return this.wallets.save(this.wallets.create({ ...dto, userId: user.id }));
  }
}

