import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VehicleTypeResponse {
  @Field({ description: 'ID of the vehicle type' })
  typeId: string;

  @Field({ description: 'Name of the vehicle type' })
  typeName: string;
}

@ObjectType()
export class VehicleResponse {
  @Field({ description: 'ID of the vehicle make' })
  makeId: string;

  @Field({ description: 'Name of the vehicle make' })
  makeName: string;

  @Field(() => [VehicleTypeResponse], {
    description: 'List of vehicle types',
    nullable: true,
  })
  vehicleTypes?: VehicleTypeResponse[];
}
