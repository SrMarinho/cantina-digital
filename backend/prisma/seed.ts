import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed do banco de dados para cantina digital...')

  // 1. Criar escolas
  console.log('Criando escolas...')
  const school1 = await prisma.school.create({
    data: {
      name: 'Escola Modelo A',
      code: 'SCH001',
      address: 'Rua Exemplo, 123 - Bairro Teste',
      phone: '(11) 99999-9999',
      email: 'contato@escolamodeloa.edu',
    },
  })

  const school2 = await prisma.school.create({
    data: {
      name: 'Colégio Exemplo B',
      code: 'SCH002',
      address: 'Avenida Demo, 456 - Centro',
      phone: '(21) 88888-8888',
      email: 'administracao@colegioexemplob.edu',
    },
  })

  // 2. Criar categorias para cantina
  console.log('Criando categorias...')
  const categoriesSchool1 = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Lanches',
        description: 'Sanduíches e salgados',
        schoolId: school1.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Bebidas',
        description: 'Variedade de bebidas',
        schoolId: school1.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Doces',
        description: 'Sobremesas e doces',
        schoolId: school1.id,
      },
    }),
  ])

  const categoriesSchool2 = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Lanches Rápidos',
        description: 'Pratos rápidos',
        schoolId: school2.id,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Bebidas',
        description: 'Bebidas diversas',
        schoolId: school2.id,
      },
    }),
  ])

  // 3. Criar produtos
  console.log('Criando produtos...')
  const products = await Promise.all([
    // Produtos para escola 1
    prisma.product.create({
      data: {
        name: 'Sanduíche Natural',
        description: 'Sanduíche com recheio natural',
        price: 8.50,
        categoryId: categoriesSchool1[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Suco de Laranja',
        description: 'Suco natural de laranja',
        price: 4.00,
        categoryId: categoriesSchool1[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Bolo de Chocolate',
        description: 'Fatia de bolo de chocolate',
        categoryId: categoriesSchool1[2].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Coxinha',
        description: 'Salgado recheado',
        categoryId: categoriesSchool1[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Água Mineral',
        description: 'Garrafa de água 500ml',
        categoryId: categoriesSchool1[1].id,
      },
    }),

    prisma.product.create({
      data: {
        name: 'Hambúrguer',
        description: 'Hambúrguer artesanal',
        categoryId: categoriesSchool2[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Refrigerante',
        description: 'Lata de refrigerante 350ml',
        categoryId: categoriesSchool2[1].id,
      },
    }),
    prisma.product.create({
      data: {
        name: 'Pão de Queijo',
        description: 'Porção com 4 unidades',
        categoryId: categoriesSchool2[0].id,
      },
    }),
  ])

  // 4. Criar usuários
  console.log('Criando usuários...')
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Administrador Escola A',
        email: 'admin@escolaa.edu',
        password: '$2b$10$ExampleHash123456789012', // senha: 123456
        role: 'admin',
        registrationNumber: 'ADM001',
        schoolId: school1.id,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Funcionário Cantina A',
        email: 'funcionario@escolaa.edu',
        password: '$2b$10$ExampleHash123456789012',
        role: 'employee',
        registrationNumber: 'FUNC001',
        schoolId: school1.id,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Aluno Teste A',
        email: 'aluno@escolaa.edu',
        password: '$2b$10$ExampleHash123456789012',
        role: 'user',
        registrationNumber: 'ALU001',
        schoolId: school1.id,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Administrador Escola B',
        email: 'admin@escolab.edu',
        password: '$2b$10$ExampleHash123456789012',
        role: 'admin',
        registrationNumber: 'ADM002',
        schoolId: school2.id,
      },
    }),
  ])

  // 5. Criar estoques
  console.log('Criando estoques...')
  const stocks = await Promise.all([
    // Estoque escola 1
    prisma.stock.create({
      data: {
        productId: products[0].id,
        schoolId: school1.id,
        quantity: 50,
        minQuantity: 10,
        maxQuantity: 100,
        price: 8.50,
      },
    }),
    prisma.stock.create({
      data: {
        productId: products[1].id,
        schoolId: school1.id,
        quantity: 100,
        minQuantity: 20,
        maxQuantity: 200,
        price: 4.00,
      },
    }),
    prisma.stock.create({
      data: {
        productId: products[2].id,
        schoolId: school1.id,
        quantity: 30,
        minQuantity: 5,
        maxQuantity: 50,
        price: 5.50,
      },
    }),
    prisma.stock.create({
      data: {
        productId: products[3].id,
        schoolId: school1.id,
        quantity: 80,
        minQuantity: 15,
        maxQuantity: 150,
        price: 3.50,
      },
    }),
    prisma.stock.create({
      data: {
        productId: products[4].id,
        schoolId: school1.id,
        quantity: 200,
        minQuantity: 50,
        maxQuantity: 500,
        price: 2.50,
      },
    }),

    // Estoque escola 2
    prisma.stock.create({
      data: {
        productId: products[5].id,
        schoolId: school2.id,
        quantity: 40,
        minQuantity: 8,
        maxQuantity: 80,
        price: 12.00,
      },
    }),
    prisma.stock.create({
      data: {
        productId: products[6].id,
        schoolId: school2.id,
        quantity: 150,
        minQuantity: 30,
        maxQuantity: 300,
        price: 5.00,
      },
    }),
    prisma.stock.create({
      data: {
        productId: products[7].id,
        schoolId: school2.id,
        quantity: 60,
        minQuantity: 12,
        maxQuantity: 120,
        price: 6.00,
      },
    }),
  ])

  // 6. Criar pedidos de exemplo
  console.log('Criando pedidos...')
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        schoolId: school1.id,
        userId: users[2].id, // Aluno
        totalAmount: 16.50,
        status: 'completed',
        orderItems: {
          create: [
            {
              productId: products[0].id,
              quantity: 1,
              unitPrice: 8.50,
              totalPrice: 8.50,
            },
            {
              productId: products[1].id,
              quantity: 2,
              unitPrice: 4.00,
              totalPrice: 8.00,
            },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        schoolId: school2.id,
        userId: users[3].id, // Admin (pode ser qualquer usuário)
        totalAmount: 17.00,
        status: 'pending',
        orderItems: {
          create: [
            {
              productId: products[5].id,
              quantity: 1,
              unitPrice: 12.00,
              totalPrice: 12.00,
            },
            {
              productId: products[6].id,
              quantity: 1,
              unitPrice: 5.00,
              totalPrice: 5.00,
            },
          ],
        },
      },
    }),
  ])

  // 7. Criar logs de inventário
  console.log('Criando logs de inventário...')
  const inventoryLogs = await Promise.all([
    prisma.inventoryLog.create({
      data: {
        schoolId: school1.id,
        productId: products[0].id,
        userId: users[1].id, // Funcionário
        type: 'entrada',
        quantity: 50,
        previousStock: 0,
        newStock: 50,
        reason: 'Estoque inicial',
      },
    }),
    prisma.inventoryLog.create({
      data: {
        schoolId: school1.id,
        productId: products[0].id,
        userId: users[1].id,
        type: 'saida',
        quantity: 1,
        previousStock: 50,
        newStock: 49,
        reason: 'Venda pedido #1',
      },
    }),
  ])

  console.log('Seed concluído com sucesso!')
  console.log(`- ${(await prisma.school.findMany()).length} escolas criadas`)
  console.log(`- ${(await prisma.user.findMany()).length} usuários criados`)
  console.log(`- ${(await prisma.product.findMany()).length} produtos criados`)
  console.log(`- ${(await prisma.stock.findMany()).length} estoques criados`)
  console.log(`- ${(await prisma.order.findMany()).length} pedidos criados`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })