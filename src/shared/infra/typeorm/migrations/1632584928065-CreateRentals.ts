import { query } from 'express';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRentals1632584928065 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'rentals',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'car_id', type: 'uuid', isNullable: true },
          { name: 'user_id', type: 'uuid', isNullable: true },
          {
            name: 'start_date',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'end_date',
            type: 'timestamp with time zone',
            isNullable: true,
          },
          { name: 'expected_return_date', type: 'timestamp with time zone' },
          { name: 'total', type: 'numeric', isNullable: true },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'FKCarRental',
            referencedTableName: 'cars',
            referencedColumnNames: ['id'],
            columnNames: ['car_id'],
            onDelete: 'SET NULL',
            onUpdate: 'SET NULL',
          },
          {
            name: 'FKUserRental',
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            columnNames: ['user_id'],
            onDelete: 'SET NULL',
            onUpdate: 'SET NULL',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('rentals');
  }
}
