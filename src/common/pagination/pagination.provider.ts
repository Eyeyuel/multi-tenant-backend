import { Inject, Injectable } from '@nestjs/common';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import {
  FindManyOptions,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { REQUEST } from '@nestjs/core';
// import { Request } from 'express';
import type { Request } from 'express';
import { Paginated } from './pagination.interface';

@Injectable()
export class PaginationProvider {
  constructor(@Inject(REQUEST) private readonly request: Request) {}
  public async paginationQuery<T extends ObjectLiteral>(
    paginationQueryDto: PaginationQueryDto,
    repositary: Repository<T>,
    where?: FindOptionsWhere<T>,
    relations?: string[],
  ): Promise<Paginated<T>> {
    const { page = 1, limit = 10 } = paginationQueryDto;
    const findOptions: FindManyOptions<T> = {
      skip: (page - 1) * limit,
      take: limit,
    };
    if (where) {
      findOptions.where = where;
    }
    if (relations) {
      findOptions.relations = relations;
    }

    const totalItems = await repositary.count();
    const totalPage = Math.ceil(totalItems / limit);
    const nextPage = page === totalPage ? page : page + 1;
    const prevPage = page === 1 ? page : page - 1;
    const baseUrl = this.request.protocol + '://' + this.request.headers.host;
    const newUrl = new URL(baseUrl + this.request.url);

    const result = await repositary.find(findOptions);

    const response: Paginated<T> = {
      data: result,
      meta: {
        itemsPerPage: limit,
        totalItems: totalItems,
        currentPage: page,
        totalPage: totalPage,
      },
      links: {
        first: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=1`,
        last: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${totalPage}`,
        current: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${page}`,
        next: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${nextPage}`,
        previous: `${newUrl.origin}${newUrl.pathname}?limit=${limit}&page=${prevPage}`,
      },
    };
    return response;
  }
}
