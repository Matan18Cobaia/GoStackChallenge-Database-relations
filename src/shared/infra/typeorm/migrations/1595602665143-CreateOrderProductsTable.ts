import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateOrderProductsTable1595602665143 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: 'orders_products',
      columns: [{
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        generationStrategy: "uuid",
        default: 'uuid_generate_v4()'
      },
      {
        name: 'product_id',
        type: 'uuid',
        isNullable: false
      },
      {
        name: 'order_id',
        type: 'uuid',
        isNullable: false
      },
      {
        name: 'price',
        type: 'decimal',
        isNullable: false
      },
      {
        name: 'quantity',
        type: 'int',
        isNullable: false
      },
      {
        name: 'created_at',
        type: 'timestamp',
        default: 'now()'
      },
      {
        name: 'updated_at',
        type: 'timestamp',
        default: 'now()'
      }],
      foreignKeys: [{
        name: 'OrderProductsProducts',
        columnNames: ['product_id'],
        referencedTableName: 'products',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      {
        name: 'OrderProductsOrders',
        columnNames: ['order_id'],
        referencedTableName: 'orders',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }]
    }))
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable('orders_products');
  }

}
