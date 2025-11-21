import 'dotenv/config'
import { Prisma, PrismaClient } from '../src/generated/prisma/client'
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()
const numberOfProducts = 25
const numberOfCategories = 2
const numberOfSchools = 2
const numberOfOrdersPerSchool = 5

const roles = ['admin', 'manager', 'employee', 'user']


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
  await prisma.school.createMany({
    data:
      Array.from({ length: numberOfSchools }).map((_, index) => {
        return {
          name: `Escola ${String.fromCharCode(66 + index)}`,
          code: `SCH00${index}`,
          address: `Endereço da Escola ${String.fromCharCode(66 + index)}`,
          phone: `(00) 0000-000${index + 2}`,
          email: `escola${String.fromCharCode(66 + index)}@email.com`,
          isActive: true
        }
      })
  })

  const secretKey = process.env.JWT_SECRET
  
  if (!secretKey) {
    throw new Error('Chave secreta não definida');
  }

  const hashedPassword =  await bcrypt.hash('123' + secretKey, 10);

  const schools = await prisma.school.findMany()

  // 3. Criar Usuários
  console.log('👤 Criando usuários...')
  await prisma.user.createMany({
    data:
    schools.map((school) => {
      return [
        {
          schoolId: school.id,
          name: 'Admin User',
          email: 'admin@email.com',
          password: hashedPassword,
          role: 'admin',
          registrationNumber: `REG${school.id}001`
        },
        {
          schoolId: school.id,
          name: 'Regular User',
          email: 'usere@email.com',
          password: hashedPassword,
          role: 'user',
          registrationNumber: `REG${school.id}002`
        },
      ]
    }).flat()
  })

  // 4. Criar Categorias
  console.log('📁 Criando categorias...')
  const categoriesList = await prisma.category.createMany({
    data: [
      {
        name: 'Categoria 1A',
        description: 'Descrição da categoria 1A',
      },
      {
        name: 'Categoria 2A',
        description: 'Descrição da categoria 2A',
      }
    ]
  })

  // Buscar categorias criadas
  const categories = await prisma.category.findMany()

  // 5. Criar Produtos
  console.log('📦 Criando produtos...')
  const products = await prisma.product.createMany({
    data: 
      Array.from({ length: numberOfProducts }).map((_, index) => {
        return {
          name: `Produto ${index + 1}`,
          description: `Descrição do produto ${index + 1}`,
          imageUrl: `https://exemplo.com/produto${index + 1}.jpg`,
          isAvailable: true,
          basePrice: Math.random() * 30 + 1,
          categoryId: categories[Math.floor(index / (numberOfProducts / numberOfCategories))].id
        }
      })
  })

  // Buscar produtos e usuários criados
  const productsList = await prisma.product.findMany()
  
  const usersList = await prisma.user.findMany()

  // 6. Criar Stocks
  console.log('📊 Criando stocks...')
  await prisma.stock.createMany({
    data:
      schools.map((school) => {
        return Array.from({ length: numberOfProducts }).map((_, product_index) => {
          return {
            productId: productsList[product_index].id,
            schoolId: school.id,
            quantity: Math.floor(Math.random() * 20) + 1,
            minQuantity: Math.floor(Math.random() * 10) + 1,
            maxQuantity: Math.floor(Math.random() * 200) + 1,
            price: 10
          }
        })
      }).flat()
  })
  console.log('\n✅ Seed concluída com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })