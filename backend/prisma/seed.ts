import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes
  await prisma.inventoryLog.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.stock.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()
  await prisma.role.deleteMany()
  await prisma.school.deleteMany()

  // 1. Criar Roles
  console.log('👥 Criando roles...')
  await prisma.role.createMany({
    data: [
      { name: 'admin', description: 'Administrador do sistema' },
      { name: 'manager', description: 'Gerente' },
      { name: 'employee', description: 'Funcionário' },
      { name: 'user', description: 'Usuário' }
    ]
  })

  // 2. Criar Escolas
  console.log('🏫 Criando escolas...')
  const school1 = await prisma.school.create({
    data: {
      name: 'Escola A',
      code: 'SCH001',
      address: 'Endereço da Escola A',
      phone: '(00) 0000-0001',
      email: 'escolaA@email.com',
      isActive: true
    }
  })

  const school2 = await prisma.school.create({
    data: {
      name: 'Escola B',
      code: 'SCH002',
      address: 'Endereço da Escola B',
      phone: '(00) 0000-0002',
      email: 'escolaB@email.com',
      isActive: true
    }
  })

  // 3. Criar Usuários
  console.log('👤 Criando usuários...')
  await prisma.user.createMany({
    data: [
      // Escola 1
      {
        schoolId: school1.id,
        name: 'Usuário 1A',
        email: 'usuario1A@email.com',
        password: 'senha123',
        role: 'admin',
        registrationNumber: 'REG001'
      },
      {
        schoolId: school1.id,
        name: 'Usuário 2A',
        email: 'usuario2A@email.com',
        password: 'senha123',
        role: 'employee',
        registrationNumber: 'REG002'
      },
      // Escola 2
      {
        schoolId: school2.id,
        name: 'Usuário 1B',
        email: 'usuario1B@email.com',
        password: 'senha123',
        role: 'admin',
        registrationNumber: 'REG101'
      },
      {
        schoolId: school2.id,
        name: 'Usuário 2B',
        email: 'usuario2B@email.com',
        password: 'senha123',
        role: 'manager',
        registrationNumber: 'REG102'
      }
    ]
  })

  // 4. Criar Categorias
  console.log('📁 Criando categorias...')
  const categoriesSchool1 = await prisma.category.createMany({
    data: [
      {
        name: 'Categoria 1A',
        description: 'Descrição da categoria 1A',
        schoolId: school1.id
      },
      {
        name: 'Categoria 2A',
        description: 'Descrição da categoria 2A',
        schoolId: school1.id
      }
    ]
  })

  const categoriesSchool2 = await prisma.category.createMany({
    data: [
      {
        name: 'Categoria 1B',
        description: 'Descrição da categoria 1B',
        schoolId: school2.id
      },
      {
        name: 'Categoria 2B',
        description: 'Descrição da categoria 2B',
        schoolId: school2.id
      }
    ]
  })

  // Buscar categorias criadas
  const categories = await prisma.category.findMany()
  const categoriesA = categories.filter(c => c.schoolId === school1.id)
  const categoriesB = categories.filter(c => c.schoolId === school2.id)

  // 5. Criar Produtos
  console.log('📦 Criando produtos...')
  const products = await prisma.product.createMany({
    data: [
      {
        name: 'Produto 1',
        description: 'Descrição do produto 1',
        imageUrl: 'https://exemplo.com/produto1.jpg',
        isAvailable: true,
        basePrice: 10.50,
        categoryId: categoriesA[0].id
      },
      {
        name: 'Produto 2',
        description: 'Descrição do produto 2',
        imageUrl: 'https://exemplo.com/produto2.jpg',
        isAvailable: true,
        basePrice: 15.75,
        categoryId: categoriesA[1].id
      },
      {
        name: 'Produto 3',
        description: 'Descrição do produto 3',
        imageUrl: 'https://exemplo.com/produto3.jpg',
        isAvailable: true,
        basePrice: 20.00,
        categoryId: categoriesB[0].id
      },
      {
        name: 'Produto 4',
        description: 'Descrição do produto 4',
        imageUrl: 'https://exemplo.com/produto4.jpg',
        isAvailable: false,
        basePrice: 25.25,
        categoryId: categoriesB[1].id
      }
    ]
  })

  // Buscar produtos e usuários criados
  const productsList = await prisma.product.findMany()
  const usersList = await prisma.user.findMany()

  // 6. Criar Stocks
  console.log('📊 Criando stocks...')
  await prisma.stock.createMany({
    data: [
      // Escola 1 - Produtos 1 e 2
      {
        productId: productsList[0].id,
        schoolId: school1.id,
        quantity: 100,
        minQuantity: 10,
        maxQuantity: 200,
        price: 11.00
      },
      {
        productId: productsList[1].id,
        schoolId: school1.id,
        quantity: 50,
        minQuantity: 5,
        maxQuantity: 100,
        price: 16.00
      },
      // Escola 2 - Produtos 3 e 4
      {
        productId: productsList[2].id,
        schoolId: school2.id,
        quantity: 75,
        minQuantity: 8,
        maxQuantity: 150,
        price: 21.50
      },
      {
        productId: productsList[3].id,
        schoolId: school2.id,
        quantity: 25,
        minQuantity: 3,
        maxQuantity: 50,
        price: 26.00
      }
    ]
  })

  // 7. Criar Orders
  console.log('🛒 Criando orders...')
  const order1 = await prisma.order.create({
    data: {
      schoolId: school1.id,
      userId: usersList[0].id,
      totalAmount: 32.50,
      status: 'completed'
    }
  })

  const order2 = await prisma.order.create({
    data: {
      schoolId: school2.id,
      userId: usersList[2].id,
      totalAmount: 47.50,
      status: 'pending'
    }
  })

  // 8. Criar Order Items
  console.log('📝 Criando order items...')
  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order1.id,
        productId: productsList[0].id,
        quantity: 2,
        unitPrice: 11.00,
        totalPrice: 22.00
      },
      {
        orderId: order1.id,
        productId: productsList[1].id,
        quantity: 1,
        unitPrice: 10.50,
        totalPrice: 10.50
      },
      {
        orderId: order2.id,
        productId: productsList[2].id,
        quantity: 2,
        unitPrice: 21.50,
        totalPrice: 43.00
      },
      {
        orderId: order2.id,
        productId: productsList[3].id,
        quantity: 1,
        unitPrice: 4.50,
        totalPrice: 4.50
      }
    ]
  })

  // 9. Criar Inventory Logs
  console.log('📋 Criando inventory logs...')
  await prisma.inventoryLog.createMany({
    data: [
      {
        schoolId: school1.id,
        productId: productsList[0].id,
        userId: usersList[0].id,
        type: 'entrada',
        quantity: 100,
        previousStock: 0,
        newStock: 100,
        reason: 'Estoque inicial'
      },
      {
        schoolId: school1.id,
        productId: productsList[1].id,
        userId: usersList[1].id,
        type: 'entrada',
        quantity: 50,
        previousStock: 0,
        newStock: 50,
        reason: 'Estoque inicial'
      },
      {
        schoolId: school2.id,
        productId: productsList[2].id,
        userId: usersList[2].id,
        type: 'entrada',
        quantity: 75,
        previousStock: 0,
        newStock: 75,
        reason: 'Estoque inicial'
      },
      {
        schoolId: school2.id,
        productId: productsList[3].id,
        userId: usersList[3].id,
        type: 'saida',
        quantity: 5,
        previousStock: 30,
        newStock: 25,
        reason: 'Venda'
      }
    ]
  })

  console.log('✅ Seed concluída com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })