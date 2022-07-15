import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GraphqlService implements GqlOptionsFactory {
  createGqlOptions(): Promise<GqlModuleOptions> | GqlModuleOptions {
    return {
      autoSchemaFile: true,
      context: ({ req, res }) => ({ req, res }),
      useGlobalPrefix: true,
    };
  }
}
