import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { hashPassword } from '../src/utils/password.utils'

const prisma = new PrismaClient()

// Configurações - fácil de modificar
const NUMBER_OF_USERS = 10
const NUMBER_OF_PRODUCTS = 15
const NUMBER_OF_ORDERS = 8
const NUMBER_OF_ITEMS_PER_ORDER = 3
const DEFAULT_PASSWORD = '123456'

// Status predefinidos para os pedidos
const ORDER_STATUSES = ['PENDENTE', 'PROCESSANDO', 'ENTREGUE', 'CANCELADO']

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Limpar dados existentes na ordem correta (respeitando as relações)
  console.log('🧹 Limpando dados existentes...')
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  // 1. Criar Usuários
  console.log('👤 Criando usuários...')
  let usersData: any = []
  for (let index = 0; index < NUMBER_OF_USERS; index++) {
    const hashedPassword = await hashPassword(DEFAULT_PASSWORD);
    const user = {
      nome: `Usuário ${index + 1}`,
      email: `usuario${index + 1}@email.com`,
      senha_hash: hashedPassword,
      matricula: index % 3 === 0 ? null : `MAT${String(index + 1).padStart(5, '0')}`,
    }
    usersData.push(user)
  }

  await prisma.user.createMany({ data: usersData })
  const users = await prisma.user.findMany()
  console.log(`✅ ${users.length} usuários criados`)

  // 2. Criar Produtos
  console.log('📦 Criando produtos...')
  const productsData = Array.from({ length: NUMBER_OF_PRODUCTS }, (_, i) => ({
    nome: `Produto ${i + 1}`,
    descricao: `Descrição detalhada do produto ${i + 1}. Este é um produto de alta qualidade.`,
    preco: Number((10 + (i * 2.5)).toFixed(2)), // Preços progressivos: 10.00, 12.50, 15.00, etc.
    imagem: i % 4 === 0 ? null : `https://exemplo.com/produto${i + 1}.jpg`, // 1/4 sem imagem
    disponivel: i % 8 !== 0 // Aproximadamente 87.5% disponíveis
  }))

  await prisma.product.createMany({ data: productsData })
  const products = await prisma.product.findMany()
  console.log(`✅ ${products.length} produtos criados`)

  // 3. Criar Pedidos e Itens
  console.log('🛒 Criando pedidos e itens...')

  for (let i = 0; i < NUMBER_OF_ORDERS; i++) {
    // Selecionar usuário de forma previsível (cíclica)
    const user = users[i % users.length]
    
    // Status distribuído de forma previsível
    const status = ORDER_STATUSES[i % ORDER_STATUSES.length]
    
    // Data do pedido escalonada (pedidos mais recentes primeiro)
    const data_pedido = new Date(Date.now() - (i * 3 * 24 * 60 * 60 * 1000))

    // Selecionar produtos para este pedido (sempre os mesmos para o mesmo índice)
    const startProductIndex = (i * NUMBER_OF_ITEMS_PER_ORDER) % products.length
    const orderProducts = products.slice(
      startProductIndex, 
      startProductIndex + NUMBER_OF_ITEMS_PER_ORDER
    )

    // Se não houver produtos suficientes, pega do início
    const selectedProducts = orderProducts.length === NUMBER_OF_ITEMS_PER_ORDER 
      ? orderProducts 
      : [...orderProducts, ...products.slice(0, NUMBER_OF_ITEMS_PER_ORDER - orderProducts.length)]

    // Calcular total do pedido
    let total = 0
    const orderItemsData = selectedProducts.map((product, index) => {
      const quantidade = (i + index + 1) % 4 + 1 // Quantidade entre 1-4 de forma previsível
      const preco_unitario = Number(product.preco)
      const itemTotal = quantidade * preco_unitario
      total += itemTotal

      return {
        product_id: product.id,
        quantidade,
        preco_unitario
      }
    })

    // Criar pedido
    const order = await prisma.order.create({
      data: {
        user_id: user.id,
        data_pedido,
        total: Number(total.toFixed(2)),
        status,
      }
    })

    // Criar itens do pedido
    await prisma.orderItem.createMany({
      data: orderItemsData.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantidade: item.quantidade,
        preco_unitario: item.preco_unitario
      }))
    })

    console.log(`📦 Pedido ${i + 1} criado com ${selectedProducts.length} itens`)
  }

  // Estatísticas finais
  console.log('\n✅ Seed concluída com sucesso!')
  console.log('📊 Estatísticas:')
  console.log(`   👥 Usuários: ${NUMBER_OF_USERS}`)
  console.log(`   📦 Produtos: ${NUMBER_OF_PRODUCTS}`)
  console.log(`   🛒 Pedidos: ${NUMBER_OF_ORDERS}`)
  console.log(`   📋 Itens totais: ${NUMBER_OF_ORDERS * NUMBER_OF_ITEMS_PER_ORDER}`)
  
  // Contagens reais do banco
  const userCount = await prisma.user.count()
  const productCount = await prisma.product.count()
  const orderCount = await prisma.order.count()
  const orderItemCount = await prisma.orderItem.count()
  
  console.log('\n📊 Contagens reais do banco:')
  console.log(`   👥 Usuários: ${userCount}`)
  console.log(`   📦 Produtos: ${productCount}`)
  console.log(`   🛒 Pedidos: ${orderCount}`)
  console.log(`   📋 Itens de pedido: ${orderItemCount}`)
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })