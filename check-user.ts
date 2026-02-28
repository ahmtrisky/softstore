import { PrismaClient } from '@prisma/client'
import { createHash } from 'crypto'

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'admin@softstore.com' }
  })
  
  if (user) {
    console.log('User found:')
    console.log('- ID:', user.id)
    console.log('- Name:', user.name)
    console.log('- Email:', user.email)
    console.log('- Role:', user.role)
    console.log('- Password hash:', user.password)
    
    // Test password
    const testHash = createHash('sha256').update('admin123').digest('hex')
    console.log('\nExpected hash:', testHash)
    console.log('Match:', user.password === testHash)
  } else {
    console.log('User NOT found!')
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
