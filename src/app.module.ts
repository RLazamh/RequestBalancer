import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { VehicleModule } from './vehicle/vehicle.module';

@Module({
  imports: [
    VehicleModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      path: `/graphql`,
      formatError: (error) => {
        return {
          message: error.message,
          locations: error.locations,
          path: error.path,
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
