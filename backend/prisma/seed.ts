import 'dotenv/config'
import { PrismaClient, OrderStatus } from '../src/generated/prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// Configurações - fácil de modificar
const NUMBER_OF_SCHOOLS = 3
const NUMBER_OF_CATEGORIES = 4
const NUMBER_OF_PRODUCTS_PER_CATEGORY = 6
const NUMBER_OF_USERS_PER_SCHOOL = 3
const NUMBER_OF_ORDERS_PER_SCHOOL = 5
const DEFAULT_PASSWORD = '123456'

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes na ordem correta
  console.log('🧹 Limpando dados existentes...')
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
  const rolesData = [
    { name: 'admin', description: 'Administrador do sistema' },
    { name: 'manager', description: 'Gerente de escola' },
    { name: 'employee', description: 'Funcionário' },
    { name: 'user', description: 'Usuário comum' }
  ]

  await prisma.role.createMany({ data: rolesData })
  const roles = await prisma.role.findMany()

  // 2. Criar Escolas
  console.log('🏫 Criando escolas...')
  const schoolsData = Array.from({ length: NUMBER_OF_SCHOOLS }, (_, i) => ({
    name: `Escola ${i + 1}`,
    code: `SCH${String(i + 1).padStart(3, '0')}`,
    address: `Endereço da Escola ${i + 1}, Nº ${100 + i}, Centro`,
    phone: `(11) 9${String(i).padStart(4, '0')}-${String(i).padStart(4, '0')}`,
    email: `escola${i + 1}@email.com`,
    isActive: true
  }))

  await prisma.school.createMany({ data: schoolsData })
  const schools = await prisma.school.findMany()

  // 3. Criar Usuários
  console.log('👤 Criando usuários...')
  const secretKey = process.env.JWT_SECRET || 'default-secret-key'
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD + secretKey, 10)

  let userCount = 0
  const usersData = schools.flatMap(school => {
      return Array.from({ length: NUMBER_OF_USERS_PER_SCHOOL }, (_, i) => {
        const roleIndex = i % roles.length
        const role = roles[roleIndex]
        
        const user = {
          name: `Usuário ${userCount}`,
          email: `usuario${userCount}@email.com`,
          password: hashedPassword,
          roleId: role.id,
          registrationNumber: `REG${school.id}${String(i + 1).padStart(3, '0')}`,
          isActive: true
        }

        userCount += 1

        return user
      })
    }
  )

  await prisma.user.createMany({ data: usersData })
  const users = await prisma.user.findMany()

  // 4. Criar Categorias
  console.log('📁 Criando categorias...')
  const categoriesData = Array.from({ length: NUMBER_OF_CATEGORIES }, (_, i) => ({
    name: `Categoria ${i + 1}`,
    description: `Descrição da Categoria ${i + 1}`,
    isActive: true
  }))

  await prisma.category.createMany({ data: categoriesData })
  const categories = await prisma.category.findMany()

  // 5. Criar Produtos
  console.log('📦 Criando produtos...')
  const productsData = categories.flatMap(category =>
    Array.from({ length: NUMBER_OF_PRODUCTS_PER_CATEGORY }, (_, i) => {
      const productNumber = (category.id - 1) * NUMBER_OF_PRODUCTS_PER_CATEGORY + i + 1
      return {
        name: `Produto ${productNumber}`,
        description: `Descrição do Produto ${productNumber} da Categoria ${category.name}`,
        imageUrl: `https://exemplo.com/produto${productNumber}.jpg`,
        isAvailable: true,
        basePrice: ((productNumber * 30 + 1).toFixed(2)),
        categoryId: category.id
      }
    })
  )

  await prisma.product.createMany({ data: productsData })
  const products = await prisma.product.findMany()

  // 6. Criar Stocks
  console.log('📊 Criando stocks...')
  const stocksData = schools.flatMap(school =>
    products.map(product => ({
      productId: product.id,
      schoolId: school.id,
      quantity: (school.id * 10) + product.id, // Quantidade previsível
      minQuantity: 10,
      maxQuantity: 100,
      price: (Number(product.basePrice) * 1.2).toFixed(2)
    }))
  )

  await prisma.stock.createMany({ data: stocksData })

  // 7. Criar Ordens e OrderItems
  console.log('🛒 Criando ordens...')
  const orderStatuses = Object.values(OrderStatus)
  
  for (const school of schools) {
    const schoolUsers = users.filter(user => 
      (user.registrationNumber)?.toString().startsWith(`REG${school.id}`)
    )

    for (let i = 0; i < NUMBER_OF_ORDERS_PER_SCHOOL; i++) {
      const user = schoolUsers[i % schoolUsers.length]
      const schoolProducts = products
      
      // Selecionar 3-5 produtos aleatórios para esta ordem
      const orderProducts = schoolProducts
        .sort(() => 0.5 - Math.random())
        .slice(0, 3 + Math.floor(Math.random() * 3))

      // Calcular total
      let totalAmount = 0
      const orderItemsData = orderProducts.map(product => {
        const quantity = 1 + Math.floor(Math.random() * 3)
        const unitPrice = Number(product.basePrice) * 1.2
        const totalPrice = quantity * unitPrice
        totalAmount += totalPrice

        return {
          productId: product.id,
          quantity,
          unitPrice: unitPrice.toFixed(2),
          totalPrice: totalPrice.toFixed(2)
        }
      })

      // Criar ordem
      const order = await prisma.order.create({
        data: {
          schoolId: school.id,
          userId: user.id,
          totalAmount: totalAmount.toFixed(2),
          status: orderStatuses[i % orderStatuses.length], // Distribui status de forma previsível
          notes: `Ordem ${i + 1} para Escola ${school.id}`,
        }
      })

      // Criar itens da ordem
      await prisma.orderItem.createMany({
        data: orderItemsData.map(item => ({
          ...item,
          orderId: order.id
        }))
      })
    }
  }

  console.log('\n✅ Seed concluída com sucesso!')
  console.log(`🏫 Escolas criadas: ${NUMBER_OF_SCHOOLS}`)
  console.log(`👥 Usuários criados: ${NUMBER_OF_SCHOOLS * NUMBER_OF_USERS_PER_SCHOOL}`)
  console.log(`📁 Categorias criadas: ${NUMBER_OF_CATEGORIES}`)
  console.log(`📦 Produtos criados: ${NUMBER_OF_CATEGORIES * NUMBER_OF_PRODUCTS_PER_CATEGORY}`)
  console.log(`🛒 Ordens criadas: ${NUMBER_OF_SCHOOLS * NUMBER_OF_ORDERS_PER_SCHOOL}`)
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })