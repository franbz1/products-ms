import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductsService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Connected to database');
  }

  async create(createProductDto: CreateProductDto) {
    return await this.product.create({
      data: createProductDto,
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalProducts = await this.product.count();
    const lastPage = Math.ceil(totalProducts / limit);

    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
      }),
      meta: {
        page: page,
        limit: limit,
        totalProducts: totalProducts,
        lastPage: lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID: ${id} was not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    try {
      const product = await this.product.update({
        where: { id },
        data: updateProductDto,
      });
      return product;

    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Product with ID: ${id} was not found`)
      }
      throw error
    }
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
